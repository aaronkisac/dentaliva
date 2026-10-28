// Gated squash-merge. Pre-merge gate first (Aaron, 2026-10-28: "merge öncesi
// conflict kontrolü"): the PR must merge cleanly into AND be based on the
// current origin/main tip. GitHub's mergeable flag alone is not enough —
// stale branches passed CI against an old base and broke main after merge
// (DSN-57), and a main-based branch's staging deploy overwrote a sibling
// PR's staging (blog #337 over #335). Branch protection cannot enforce this:
// private repo on GitHub Free has no branch protection (protect-main.mjs
// gets 403) — this script is the real gate.
// Then: waits for checks to appear, waits for them to finish, verifies every
// conclusion is SUCCESS, then merges. --delete-branch is opt-in: from a
// worktree it tries to delete the checked-out branch and corrupts the
// worktree record (DSN-61 lesson).
// Usage: node scripts/merge-pr.mjs <branch-or-pr-number> <issueNumber> [--delete-branch]
import { execFileSync, execSync } from "node:child_process";

const argv = process.argv.slice(2);
const deleteBranch = argv.includes("--delete-branch");
const [ref, issueNum] = argv.filter((a) => a !== "--delete-branch");
if (!ref || !issueNum)
  throw new Error(
    "usage: node scripts/merge-pr.mjs <branch-or-pr> <issueNumber> [--delete-branch]",
  );
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const sh = (cmd) => execSync(cmd, { encoding: "utf8" }).trim();

// 0. Conflict + currency gate. mergeable flips between CONFLICTING/UNKNOWN,
// so allow a short retry window before refusing.
let pr;
for (let attempt = 0; attempt < 4; attempt++) {
  pr = JSON.parse(sh(`gh pr view ${ref} --json number,headRefName,mergeable`));
  if (pr.mergeable === "MERGEABLE") break;
  if (pr.mergeable !== "UNKNOWN") {
    console.error(
      `REFUSING to merge: GitHub reports #${pr.number} as ${pr.mergeable} (conflicts with main). Resolve them first.`,
    );
    process.exit(1);
  }
  await sleep(5_000);
}
if (pr.mergeable !== "MERGEABLE") {
  console.error(`REFUSING to merge: mergeability of #${pr.number} stayed UNKNOWN.`);
  process.exit(1);
}
sh("git fetch origin main");
sh(`git fetch origin ${pr.headRefName}`);

// Real merge trial in memory (touches no worktree, creates no commit).
let conflictedFiles = null;
try {
  execFileSync(
    "git",
    ["merge-tree", "--name-only", "--write-tree", "origin/main", `origin/${pr.headRefName}`],
    { stdio: "pipe" },
  );
} catch (err) {
  // Output: tree OID line, blank line, conflicted file names.
  conflictedFiles = String(err.stdout ?? "")
    .split("\n")
    .slice(2)
    .filter(Boolean);
}
if (conflictedFiles) {
  console.error(
    `REFUSING to merge: merging origin/main into ${pr.headRefName} conflicts in:\n  ${conflictedFiles.join("\n  ")}`,
  );
  console.error("Merge origin/main into the branch, resolve, push, let CI rerun.");
  process.exit(1);
}

const mergeBase = sh(`git merge-base origin/main origin/${pr.headRefName}`);
const mainTip = sh("git rev-parse origin/main");
if (mergeBase !== mainTip) {
  const behind = sh(`git rev-list --count ${mergeBase}..origin/main`);
  console.error(
    `REFUSING to merge: branch is ${behind} commit(s) behind main. Merge origin/main into ${pr.headRefName}, push, let CI rerun, then retry.`,
  );
  process.exit(1);
}
console.log(`gate ok: #${pr.number} merges clean into current origin/main.`);

// 1. Wait until at least one check is reported (CI registration lag).
let rollup = [];
for (let attempt = 0; attempt < 40; attempt++) {
  rollup = JSON.parse(
    execSync(`gh pr view ${ref} --json statusCheckRollup`, { encoding: "utf8" }),
  ).statusCheckRollup;
  if (rollup.length > 0) break;
  await sleep(10_000);
}
if (rollup.length === 0) {
  console.error("REFUSING to merge: no CI checks appeared within the wait window.");
  process.exit(1);
}

// 2. Wait for all checks to complete.
let done = false;
for (let attempt = 0; attempt < 60; attempt++) {
  rollup = JSON.parse(
    execSync(`gh pr view ${ref} --json statusCheckRollup`, { encoding: "utf8" }),
  ).statusCheckRollup;
  done = rollup.every(
    (c) => (c.conclusion ?? c.status) !== "PENDING" && (c.conclusion ?? c.status) !== "IN_PROGRESS",
  );
  if (done) break;
  await sleep(15_000);
}

// 3. Verify green, then merge.
const conclusions = rollup.map((c) => c.conclusion ?? c.status);
if (conclusions.length === 0) {
  console.error("REFUSING to merge: zero checks at merge time.");
  process.exit(1);
}
if (!conclusions.every((c) => c === "SUCCESS")) {
  console.error("REFUSING to merge: checks not green:", conclusions.join(","));
  process.exit(1);
}
const mergeArgs = ["pr", "merge", ref, "--squash"];
if (deleteBranch) mergeArgs.push("--delete-branch");
execFileSync("gh", mergeArgs, { stdio: "inherit" });
console.log(
  `merged ${ref} (issue #${issueNum}) — all ${conclusions.length} check(s) SUCCESS${deleteBranch ? ", branch deleted" : ""}`,
);
