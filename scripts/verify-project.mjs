// Verifies the Dentaliva Delivery board: item count and Status=Todo coverage.
import { execFileSync } from 'node:child_process';
const raw = execFileSync('gh', ['project', 'item-list', '1', '--owner', 'aaronkisac', '--limit', '1000', '--format', 'json'], { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
const d = JSON.parse(raw);
const vals = (i) => Array.isArray(i.fieldValues) ? i.fieldValues : (i.fieldValues ? [i.fieldValues] : []);
const todo = d.items.filter((i) => vals(i).some((v) => v?.name === 'Status' && v?.value === 'Todo' || v?.optionId && v?.value === 'Todo')).length;
console.log('items:', d.items.length);
console.log('with Status=Todo:', todo);
const sample = d.items[0];
console.log('sample:', sample?.content?.title);
console.log('sample fieldValues:', JSON.stringify(vals(sample)));
