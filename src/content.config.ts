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
    verifiedDate: z.coerce.date().optional(),
    reviewedDate: z.coerce.date().optional(),
    reviewStatus: z.enum(['reviewed', 'pending']).default('pending'),
    revisions: z.array(z.object({ date: z.coerce.date(), summary: z.string().min(1) })).default([]),
    productType: z.string().min(1),
    category: z.enum(['案例分析', '法规解读', '风险清单']),
    heroImage: z.string().optional(),
    markets: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    // FAQ 与可见问答保持一致，不承诺搜索富媒体或 AI 引用
    faqs: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .default([]),
    sources: z
      .array(z.object({ name: z.string().min(1), url: z.string().url() }))
      .min(1),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
