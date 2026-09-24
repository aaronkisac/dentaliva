// Gated squash-merge: waits for checks, verifies every conclusion is SUCCESS,
// then merges and prints the issue reference. Usage:
//   node scripts/merge-pr.mjs <branch-or-pr-number> <issueNumber>
import { execFileSync } from "node:child_process";

const [ref, issueNum] = process.argv.slice(2);
if (!ref || !issueNum)
  throw new Error("usage: node scripts/merge-pr.mjs <branch-or-pr> <issueNumber>");
const gh = (args) => JSON.parse(execFileSync("gh", args, { encoding: "utf8" }));

execFileSync("gh", ["pr", "checks", ref, "--watch", "--interval", "15"], { stdio: "inherit" });
const pr = gh(["pr", "view", ref, "--json", "statusCheckRollup,state,mergeable"]);
const conclusions = pr.statusCheckRollup.map((c) => c.conclusion ?? c.status);
if (conclusions.length === 0) {
  console.error("REFUSING to merge: no CI checks reported.");
  process.exit(1);
}
if (!conclusions.every((c) => c === "SUCCESS")) {
  console.error("REFUSING to merge: checks not green:", conclusions.join(","));
  process.exit(1);
}
if (pr.mergeable !== "MERGEABLE") {
  console.error("REFUSING to merge: PR not mergeable:", pr.mergeable);
  process.exit(1);
}
execFileSync("gh", ["pr", "merge", ref, "--squash", "--delete-branch"], { stdio: "inherit" });
console.log(`merged ${ref} (issue #${issueNum}) — all ${conclusions.length} check(s) SUCCESS`);
