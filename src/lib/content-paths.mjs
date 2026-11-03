/** @param {string} value @param {string} base */
export function mountPath(value, base = "/") {
  const prefix = "/" + base.replace(/^\/+|\/+$/g, "");
  if (prefix === "/" || !value.startsWith("/") || value.startsWith("//")) return value;
  if (value === prefix || value.startsWith(prefix + "/")) return value;
  return prefix + value;
}
/** @param {string} html @param {string} base */
export function rebaseHtml(html, base) {
  return html.replace(/\b(src|href)=(['"])(\/(?!\/)[^'"]*)\2/g, (_, attr, quote, value) => `${attr}=${quote}${mountPath(value, base)}${quote}`);
}
/** Rebase both parsed Markdown links and preserved raw HTML from old posts. */
export function rehypeContentPaths(options = { base: "/" }) {
  return function transform(tree) {
    const walk = node => {
      if (node.type === "raw") node.value = rebaseHtml(node.value, options.base);
      if (node.properties) {
        for (const attr of ["src", "href"]) {
          if (typeof node.properties[attr] === "string") node.properties[attr] = mountPath(node.properties[attr], options.base);
        }
      }
      for (const child of node.children ?? []) walk(child);
    };
    walk(tree);
  };
}
