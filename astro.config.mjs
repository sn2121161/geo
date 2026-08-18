// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 部署前把 site 改成你的真实域名(务必 https)
// 例如: site: 'https://www.chuhai-gui.com'
export default defineConfig({
  site: 'https://oversea-observe.online',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-light' },
  },
});
