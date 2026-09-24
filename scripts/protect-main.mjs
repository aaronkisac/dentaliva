// Applies branch protection to main: PRs only, linear history, and the CI
// check required. Run after the CI workflow has landed (FND-4). Idempotent.
// Usage: node scripts/protect-main.mjs
import { execFileSync } from 'node:child_process';

const protection = {
  required_status_checks: { strict: true, contexts: ["CI"] },
  enforce_admins: true,
  required_pull_request_reviews: null,
  restrictions: null,
  required_linear_history: true,
  required_conversation_resolution: true,
  allow_force_pushes: false,
  allow_deletions: false,
};

execFileSync("gh", ["api", "--method", "PUT", "/repos/aaronkisac/dentaliva/branches/main/protection",
  "--input", "-"], { input: JSON.stringify(protection), stdio: "inherit" });
console.log("main branch protection applied (requires CI, linear history).");
