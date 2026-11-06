import { copyFileSync } from 'node:fs';
// public/ 是发布来源，根目录镜像仅供本地阅读，构建时同步以避免漂移。
for (const name of ['robots.txt', 'llms.txt']) copyFileSync(new URL(`../public/${name}`, import.meta.url), new URL(`../${name}`, import.meta.url));
