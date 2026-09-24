// Adds created issues to the Dentaliva Delivery project and sets Status=Todo.
// Usage: node scripts/add-to-project.mjs <project-id>
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const projectId = process.argv[2];
if (!projectId) throw new Error('usage: node scripts/add-to-project.mjs <project-id>');
const gh = (args) => JSON.parse(execFileSync('gh', args, { encoding: 'utf8' }));

const issues = JSON.parse(readFileSync(new URL('./created-issues.json', import.meta.url), 'utf8'));

const fields = gh(['project', 'field-list', '1', '--owner', 'aaronkisac', '--format', 'json']).fields;
const status = fields.find((f) => f.name === 'Status');
const todo = status?.options?.find((o) => o.name === 'Todo');
console.log('Status field:', status?.id, '| Todo option:', todo?.id);

const added = [];
for (const issue of issues) {
  const item = gh(['project', 'item-add', '1', '--owner', 'aaronkisac', '--url', issue.url, '--format', 'json']);
  if (todo) {
    execFileSync('gh', ['project', 'item-edit', '--id', item.id, '--project-id', projectId,
      '--field-id', status.id, '--single-select-option-id', todo.id], { stdio: 'pipe' });
  }
  added.push({ id: issue.id, item: item.id });
  console.log('  +', issue.id, '→ project item', item.id);
}
console.log(`\n${added.length} issues added to project ${projectId}.`);
