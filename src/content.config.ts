import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // 一句话直接回答(GEO: answer-first,放在页面顶部供 AI 摘取)
    tldr: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(['案例分析', '法规解读', '风险清单']),
    heroImage: z.string().optional(),
    markets: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    // FAQ 结构化数据(GEO 关键:FAQPage schema)
    faqs: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .default([]),
    sources: z
      .array(z.object({ name: z.string(), url: z.string() }))
      .default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
