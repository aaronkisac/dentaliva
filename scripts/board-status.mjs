// Sets a project status for an issue's board item. Usage: node scripts/board-status.mjs <issueNumber> <StatusName>
import { execFileSync } from 'node:child_process';
const gh = (a) => JSON.parse(execFileSync('gh', a, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 }));
const [issueNum, statusName] = process.argv.slice(2);
if (!issueNum || !statusName) throw new Error('usage: node scripts/board-status.mjs <issueNumber> <StatusName>');
const items = gh(['project', 'item-list', '1', '--owner', 'aaronkisac', '--limit', '1000', '--format', 'json']).items;
const item = items.find((i) => i.content?.url?.endsWith(`/issues/${issueNum}`) || i.content?.number === Number(issueNum));
if (!item) throw new Error(`issue #${issueNum} not found on board`);
const fields = gh(['project', 'field-list', '1', '--owner', 'aaronkisac', '--format', 'json']).fields;
const status = fields.find((f) => f.name === 'Status');
const option = status.options.find((o) => o.name.toLowerCase() === statusName.toLowerCase());
if (!option) throw new Error(`status option "${statusName}" not found`);
gh(['project', 'item-edit', '--id', item.id, '--project-id', 'PVT_kwHOAhpYss4Bkjp_', '--field-id', status.id, '--single-select-option-id', option.id, '--format', 'json']);
console.log(`issue #${issueNum} → ${option.name}`);
