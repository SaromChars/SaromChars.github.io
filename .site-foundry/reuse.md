# Astro 基础复用边界

此工程是首个博客实例，还没有独立发布通用模板或 SDK。组件可复用不代表修改会自动同步到所有站点。

| 通用能力 | 位置 | 新站需提供 |
| --- | --- | --- |
| 内容集合及字段校验 | src/content.config.ts | 内容类型和字段取舍 |
| SEO 布局与文章结构化数据 | src/layouts/ | 真实站名、域名、作者、摘要和分享图片 |
| 生产统计开关 | src/components/Analytics.astro、src/lib/analytics.mjs | 每站自己的 GA4 ID、启用策略 |
| 中文界面、导航、搜索和阅读布局 | src/components/、src/i18n/、src/styles/ | 品牌和语言 |
| 构建及候选包检查 | .github/workflows/check.yml | 新源仓和发布目标 |

新站使用时必须替换文章、关于页面、astro-paper.config.ts、CNAME、分享图片及所有账号信息，并移除 `src/site/legacy-routes.ts` 中属于旧博客的映射。旧图表依赖和迁移内容也不应无条件带入新站。测试中的旧站快照需更换为新站验收依据。

以后第二个站点确认需求后，从经验证的组件提炼模板，保留上游许可与版本；不预先引入多租户、统一数据库或全站自动升级系统。
