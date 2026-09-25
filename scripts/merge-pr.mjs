// Gated squash-merge: waits for checks to appear, waits for them to finish,
// verifies every conclusion is SUCCESS, then merges.
// Usage: node scripts/merge-pr.mjs <branch-or-pr-number> <issueNumber>
import { execFileSync, execSync } from "node:child_process";

const [ref, issueNum] = process.argv.slice(2);
if (!ref || !issueNum)
  throw new Error("usage: node scripts/merge-pr.mjs <branch-or-pr> <issueNumber>");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
execFileSync("gh", ["pr", "merge", ref, "--squash", "--delete-branch"], { stdio: "inherit" });
console.log(`merged ${ref} (issue #${issueNum}) — all ${conclusions.length} check(s) SUCCESS`);
