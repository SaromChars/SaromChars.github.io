# 内容、统计与 GitHub Pages 发布

## 当前发布方案

用户在本轮明确改为“直接覆盖我线上的博客仓就好了”，取消新建独立仓库及仅预览限制。

源工程远端为 `SaromChars/SaromChars.github.io`，默认分支 `master`，生产域名保持 `https://www.saromchars.tech/`。旧产物提交 `819ac3986e028406618a226dfb97dc29332867e3` 保留在 Git 历史；本地 `/Users/sc/proj/SaromChars.github.io` 暂留旧版检出，不要与当前源工程同时独立推送。

GitHub Pages 来源切换为 GitHub Actions。`check.yml` 验证 PR；`pages.yml` 对 master 推送/手动触发执行预览回归、正式构建、产物检查和部署。发布只使用本仓 `GITHUB_TOKEN` 的 Pages/OIDC 权限，不需要额外 PAT。源码目录、测试和维护资料不进入发布产物。根目录及 public/CNAME 保持现有域名；本轮不改 DNS 或域名/HTTPS 开关。

生产构建使用 index；PR 和本地预览 noindex。GA4/GSC 通过仓库 Actions Variables（Settings → Secrets and variables → Actions → Variables）读取以下公开变量：

- PUBLIC_ENABLE_ANALYTICS：提供并验证 ID 后设为 true，当前缺省 false。
- PUBLIC_GA4_MEASUREMENT_ID：G- 开头的实际 ID。
- PUBLIC_GOOGLE_SITE_VERIFICATION：Search Console HTML 标签的 content 值。

发布完成状态见[本轮记录](records/2026-11-04-pages-release.md)。

## GA4

用户已有 GA4 属性，尚未提供衡量 ID。将 `.env.example` 复制为 `.env.local`，本地/预览保留 `PUBLIC_DEPLOY_ENV=preview` 和 `PUBLIC_ENABLE_ANALYTICS=false`。

正式候选构建时才使用：

```text
PUBLIC_DEPLOY_ENV=production
PUBLIC_ENABLE_ANALYTICS=true
PUBLIC_GA4_MEASUREMENT_ID=<你的 G- 开头衡量 ID>
```

衡量 ID 是前端公开配置，不是密码。启用生产统计却没有有效 ID 时构建会失败，避免静默漏接；预览保持关闭。每次页面导航是完整 HTML 加载，页面只初始化一次 Google tag；不再额外手动发送重复 page_view。

默认使用 Google tag 的配置行为；滚动、外链点击等增强型衡量项需到 GA4 数据流核对。站内搜索使用 `q` 参数，可按 GA4 的站内搜索设置验证。根据实际受众配置必要的隐私告知/同意机制后再启用；事件不应携带邮件、姓名等个人信息。

发布后访问首页和文章，使用实时报告/DebugView 或 Tag Assistant 核对入站、页面 URL、重复事件和排除自己的访问。模拟 ID 的本地测试不证明真实账号已收数据。浏览器拦截和网络限制会影响客户端统计完整性。

## Search Console

用户可选择对 `saromchars.tech` 做 DNS 验证（需域名管理权限），或创建 `https://www.saromchars.tech/` 的 URL 前缀属性。

使用 HTML 标签验证时，将标签 content 的值填入 `PUBLIC_GOOGLE_SITE_VERIFICATION`，布局会生成 meta 标签；没有值时不输出占位标记。发布前可在候选构建中检查，发布后才在 Search Console 点击验证。

站点地图入口为 `https://www.saromchars.tech/sitemap-index.xml`。验证所有权后提交它，并使用网址检查确认原文章可抓取、canonical 正确。提交 sitemap 不保证收录或排名。

官方来源：[GA4 设置](https://support.google.com/analytics/answer/14183469)、[Search Console 验证](https://support.google.com/webmasters/answer/9008080)。

## 后续发布与回退

修改文章或代码后先运行预览构建、测试和浏览器检查，PR 审查后合入 master；推送会自动发布。纯维护文档更新不会重建网站。Actions 成功后检查线上首页、原文章、搜索、RSS、sitemap 及统计，不能只以 workflow 成功推断全部业务路径正常。

需要回退网站时，优先选择一个已成功部署的源码提交进行可审查的 revert，再由 Actions 重建。回到迁移前的静态站则应在临时分支从旧提交导出静态文件到 public，或恢复旧树并将 Pages 来源恢复 master 根目录；两条路径都必须另做验证，不强推或重写历史。切换回旧树时先准备好原来源设置，避免生成产物与发布方式不匹配。

迁移前实测 Pages 设置含既存 DNS/HTTPS 提示。本轮保留设置，上线后按实际访问记录说明；不把代码部署等同于域名配置修复。

只有 `dist/` 是 Actions 发布材料。源码仓本身公开，不应提交未公开草稿、密钥、环境文件、截图或本地恢复材料。
