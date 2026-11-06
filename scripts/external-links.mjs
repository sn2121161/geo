// Keep the article open when a reader follows an external Markdown reference.
export default {
  name: 'external-reference-tabs',
  element: {
    filter: ['a'],
    visit(node, ctx) {
    if (node.tagName !== 'a') return;
    const href = node.properties?.href;
    if (typeof href !== 'string' || !/^https?:\/\//i.test(href)) return;
    if (new URL(href).hostname === 'oversea-observe.online') return;
    ctx.setProperty(node, 'target', '_blank');
    const current = node.properties.rel;
    const rel = Array.isArray(current) ? current : String(current ?? '').split(/\s+/);
    ctx.setProperty(node, 'rel', [...new Set([...rel.filter(Boolean), 'noopener', 'noreferrer'])]);
    },
  },
};
