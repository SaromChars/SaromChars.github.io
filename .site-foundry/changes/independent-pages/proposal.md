# 独立源仓与 GitHub Pages 预览

2026-11-04，用户要求为源工程建立独立 GitHub 仓库、配置 Pages 发布流程，先不要覆盖现有线上博客。

范围：拟建 SaromChars/sarom-blog-source，仓库可见性待用户回复。仅新仓库拥有 Pages 发布权限，不访问或写入旧仓的发布配置，不修改 DNS、自定义域名或原产物。默认分支 main，PR 检查和 main 自动部署，仅对独立预览站发布。预览 noindex、关闭 GA4/GSC，无 CNAME，正式域名仍只属于旧站。

技术：使用 configure-pages 的实际 origin/base_path 配置 Astro；为文章内图表、历史 URL、RSS、robots 和站内导航处理项目子路径，不能只配置 Astro base 而遗留根路径资源。GitHub 可能继承账号 Pages 自定义域名，最终预览 URL 以实际 Pages API/工作流返回结果为准，不修改旧站来强制地址形式。

验收：根路径回归继续通过；项目子路径首页、旧文章、图表、搜索、元数据、sitemap/robots 无越界链接；发布产物不含 CNAME 或源资料；没有统计；CI 最小权限，PR 不部署，部署目标仅本仓。建仓并核查可见性，提交/推送源工程，启用新仓 Pages Actions 来源，验证首次远端 workflow 和实际预览地址。原仓 HEAD/CNAME 与上线域名保持原样。

用户当前授权覆盖创建、提交、推送和新仓独立 Pages 发布；不覆盖旧站域名或内容切换。源码上传前排除本地备份、环境文件、截图和临时日志。若 GitHub 登录或套餐阻塞，完成本地流程并记录实际阻塞，不创建凭据或更改账号套餐。

## 用户最新指令覆盖原方案

用户回复“直接覆盖我线上的博客仓就好了”，因此取消新建独立仓库和仅预览限制。最终方案将 Astro 源工程以保留历史的新提交迁入现有 SaromChars/SaromChars.github.io 的 master 分支，Pages 来源从 master 根目录切换到 GitHub Actions，直接发布原自定义域名。保留根目录和 public/CNAME，不修改 DNS，不强推、不重写历史。工作流使用现有域名根路径，生产 robots 为 index；GA4/GSC 在未提供 ID 时保持未接入。前文独立仓库验收中与新指令冲突的部分不再适用；子路径支持保留作为可复用能力。

已通过浏览器核实：现有 Pages 来源是 master 根目录，自定义域名 www.saromchars.tech；页面有既存 DNS/HTTPS 配置提示，本轮不改域名或证书设置。上线后分别核实实际访问和部署状态。
