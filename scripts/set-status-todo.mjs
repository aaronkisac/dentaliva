// Sets Status=Todo on every item of the Dentaliva Delivery project (idempotent).
import { execFileSync } from 'node:child_process';
const gh = (a) => JSON.parse(execFileSync('gh', a, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 }));

const items = gh(['project', 'item-list', '1', '--owner', 'aaronkisac', '--limit', '1000', '--format', 'json']).items;
const fields = gh(['project', 'field-list', '1', '--owner', 'aaronkisac', '--format', 'json']).fields;
const status = fields.find((f) => f.name === 'Status');
const todo = status.options.find((o) => o.name === 'Todo');
console.log('items:', items.length, '| status field:', status.id, '| todo option:', todo.id);

let set = 0;
for (const it of items) {
  gh(['project', 'item-edit', '--id', it.id, '--project-id', 'PVT_kwHOAhpYss4Bkjp_',
    '--field-id', status.id, '--single-select-option-id', todo.id, '--format', 'json']);
  set++;
}
console.log('set Todo on', set, 'items');
