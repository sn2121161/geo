import { readdir, readFile } from 'node:fs/promises';
const pending = [];
async function visit(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) await visit(path);
    else if (entry.name.endsWith('.html') && (await readFile(path, 'utf8')).includes('待人工复审稿。')) pending.push(path);
  }
}
await visit('dist');
if (pending.length) { console.error('停止发布：以下修订稿尚待人工复审：\n' + pending.join('\n')); process.exit(1); }
console.log('发布审核状态检查通过');
