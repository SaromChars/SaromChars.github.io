# Sarom 个人博客

基于 Astro + AstroPaper 的博客源工程，实际位置为 `/Users/sc/proj/sarom-blog-source`。文章、SEO、统计接入代码和维护资料随本仓保存。现有线上发布产物仓在 `/Users/sc/proj/SaromChars.github.io`，旧目录保持旧版检出，作为迁移前参考；按用户最新指令，本源工程将直接迁入同一个 GitHub 仓库并发布。

## 本地运行

使用 Node 24（依赖最低要求见 package.json）：

```sh
npm ci
npm run build
npm test
npm run preview -- --port 4328
```

访问 `http://127.0.0.1:4328/`。日常开发使用 `npm run dev`。构建产物为 `dist/`，依赖锁文件是 `package-lock.json`。

## 写文章

1. 复制 `src/content/posts/_post-template.md`，例如命名为 `my-next-post.md`。不要用下划线开头命名正式文章。
2. 修改标题、`pubDatetime`、摘要、标签和正文，写作期间保留 `draft: true`。原文章的 `modDatetime` 未知，因此未伪造更新时间；后续实质性修改时再填写真实时间。
3. 执行 `npm run preview:drafts`，在仅本机的开发站点预览草稿。预览页面标记 noindex，并关闭统计。
4. 确认内容后将 `draft` 改为 `false`，运行构建、测试并检查预览。这一步准备本地发布内容，不会修改线上站点。
5. 通过审查后再执行正式发布步骤，见[发布与统计接入](.site-foundry/publishing.md)。

草稿标志只控制网站输出。如果未来源仓设为公开，已提交的草稿 Markdown 仍可被查看；非公开素材请留在仓库外或私有源仓。

文章图片可以放在 `public/images/posts/<文章标识>/`，正文引用 `/images/posts/<文章标识>/image.png`，配有描述性的替代文字。新文章默认为 `/posts/<文件名>/`，发布后保持文件名和地址稳定。旧文章保留原地址，映射集中在 `src/site/legacy-routes.ts`。

## 站点配置与复用

- `astro-paper.config.ts`：域名、站名、简介、作者、语言、主题功能及社交链接。
- `src/content.config.ts`：文章及页面字段。
- `src/layouts/`：公共 SEO、文章元数据及结构化数据。
- `src/components/Analytics.astro`、`src/lib/analytics.mjs`：显式开启的生产统计。
- `.env.example`：公开接入参数的格式，复制为忽略的 `.env.local` 后填写。
- `.site-foundry/`：项目简报、配置、维护任务和验证记录。

复用边界见[复用说明](.site-foundry/reuse.md)。上游版本及许可见 [UPSTREAM.md](UPSTREAM.md) 和 [LICENSE](LICENSE)。

## 当前状态

已恢复 1 篇文章的正文、7 个图表和旧静态资源；原有 8 个页面 URL 保留，补充文章列表、搜索、RSS、sitemap 和中文界面。统计与搜索验证信息尚待用户提供，真实数据收集、Search Console 所有权和收录状态均未验证。

原 Hexo 恢复候选保留在被忽略的 `.local/hexo-recovery/`，这是本地恢复材料，不代表已具备异地备份。用户最新授权直接覆盖现有线上仓库。远端为 `https://github.com/SaromChars/SaromChars.github.io`，默认分支 `master`；迁移保留原 Git 历史，不创建新仓库。部署结果以发布记录为准。

完整证据见[本轮验证记录](.site-foundry/records/2026-11-04-astro.md)。

## 自动发布

`.github/workflows/check.yml` 验证 PR；`.github/workflows/pages.yml` 在 master 推送或手动触发时检查、构建并部署现有 Pages 站点。域名保持 `https://www.saromchars.tech/`。只修改 `.site-foundry/`、README、AGENTS 或 UPSTREAM 的提交不触发网站重建。推送 master 即发布操作，应先审查内容和验证结果。
