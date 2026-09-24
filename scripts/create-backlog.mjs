// One-off seeder: creates labels, milestones and issues on aaronkisac/dentaliva via gh CLI.
// Usage: node scripts/create-backlog.mjs [--add-to-project <project-id>]
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { ISSUES, LABELS, MILESTONES, REPO } from './backlog-data.mjs';

const gh = (args, input) =>
  JSON.parse(execFileSync('gh', ['api', ...args], { input, encoding: 'utf8', shell: false }));

const post = (path, body) => gh([path, '--method', 'POST', '--input', '-'], JSON.stringify(body));
const t = (ty) => `type/${ty}`;
// LABELS lists epic/* in milestone order (1..10)
const epicLabel = (n) => LABELS.filter(([name]) => name.startsWith('epic/'))[n - 1][0];

console.log('→ labels');
for (const [name, color] of LABELS) {
  try { post(`/repos/${REPO}/labels`, { name, color }); console.log('  +', name); }
  catch { console.log('  ·', name, '(exists)'); }
}

console.log('→ milestones');
const milestoneIds = {};
for (const m of MILESTONES) {
  const r = post(`/repos/${REPO}/milestones`, { title: m.name, description: m.desc, state: 'open' });
  milestoneIds[m.n] = r.number;
  console.log('  +', m.name, '→', r.number);
}

console.log('→ issues');
const created = [];
for (const i of ISSUES) {
  const epic = MILESTONES.find((m) => m.n === i.e);
  const body = [
    `## Story`, '', i.st, '',
    `## Acceptance criteria`,
    ...i.ac.map((a) => `- ${a}`), '',
    `## Tests`, i.ts, '',
    `---`,
    `**Estimate:** ${i.s} · **Depends on:** ${i.d} · **Epic:** ${epic.name}`,
    `**Definition of Done:** see [docs/BACKLOG.md](../blob/main/docs/BACKLOG.md) (global).`,
  ].join('\n');
  const r = post(`/repos/${REPO}/issues`, {
    title: `[${i.id}] ${i.title}`,
    body,
    labels: [epicLabel(i.e), t(i.ty), `size/${i.s}`],
    milestone: milestoneIds[i.e],
  });
  created.push({ id: i.id, number: r.number, url: r.html_url });
  console.log('  +', `[${i.id}] #${r.number}`);
}

writeFileSync(new URL('./created-issues.json', import.meta.url), JSON.stringify(created, null, 2));
console.log(`\n${created.length} issues created.`);

const projectIdx = process.argv.indexOf('--add-to-project');
if (projectIdx > -1) {
  const projectId = process.argv[projectIdx + 1];
  console.log('→ adding to project', projectId);
  for (const c of created) {
    execFileSync('gh', ['project', 'item-add', projectId, '--owner', REPO.split('/')[0], '--url', c.url], { stdio: 'pipe' });
    console.log('  +', c.id);
  }
}
