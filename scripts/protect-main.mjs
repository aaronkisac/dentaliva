// Applies branch protection to main: PRs only, linear history, and the CI
// check required. Run after the CI workflow has landed (FND-4). Idempotent.
// Usage: node scripts/protect-main.mjs
import { execFileSync } from "node:child_process";

const protection = {
  required_status_checks: { strict: true, contexts: ["CI"] },
  enforce_admins: true,
  // API tuhafıkları (canlıda bisect edildi): reviews null → "links/0/schema
  // nil" 422; {} → onay sayısı 1'e döner (review'cu yokken merge kilitlenir)
  // → onay 0 ile açık obje şart. restrictions {} → "teams/users weren't
  // supplied" 422 → null (yani kısıtlama yok) gönderilmeli.
  required_pull_request_reviews: { required_approving_review_count: 0 },
  restrictions: null,
  required_linear_history: true,
  required_conversation_resolution: true,
  allow_force_pushes: false,
  allow_deletions: false,
};

execFileSync(
  "gh",
  [
    "api",
    "--method",
    "PUT",
    "/repos/aaronkisac/dentaliva/branches/main/protection",
    "--input",
    "-",
  ],
  { input: JSON.stringify(protection), stdio: "inherit" },
);
console.log("main branch protection applied (requires CI, linear history).");
