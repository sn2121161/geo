// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import externalLinks from './scripts/external-links.mjs';
import { satteri } from '@astrojs/markdown-satteri';

// 部署前把 site 改成你的真实域名(务必 https)
// 例如: site: 'https://www.chuhai-gui.com'
export default defineConfig({
  site: 'https://oversea-observe.online',
  integrations: [sitemap()],
  markdown: {
    processor: satteri({ hastPlugins: [externalLinks] }),
    shikiConfig: { theme: 'github-light' },
  },
});
