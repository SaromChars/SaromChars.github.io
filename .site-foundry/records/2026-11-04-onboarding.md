# 既有博客接入检查

日期：2026-11-04（Asia/Shanghai）。范围：[本次接入说明](../changes/onboard-existing-blog/proposal.md)。

## 工程证据

- GitHub 连接器 `get_repo`：公开仓库 `SaromChars/SaromChars.github.io`，默认分支 `master`，未归档。
- 执行 `git clone https://github.com/SaromChars/SaromChars.github.io.git /Users/sc/proj/SaromChars.github.io`，退出码 0。
- `git -C /Users/sc/proj/SaromChars.github.io status --short --branch`：`## master...origin/master`，无工作区改动。
- `git remote -v`：origin 拉取与推送地址均为上述仓库的 HTTPS `.git` 地址。
- `git log -1`：`819ac3986e028406618a226dfb97dc29332867e3`，提交时间 `2023-10-24T16:03:41+08:00`，标题 `Update CNAME`。
- `git branch -a`：本地 master、origin/master 及 origin/HEAD；未发现其他远端分支。
- `git ls-files`：119 个跟踪文件，8 个站点 HTML（不含 lib）。未发现 `package.json`、Hexo `_config.yml` / `_config.yaml`、`source/`、文章 Markdown 或 `.github/workflows/`；检查范围是当前检出版本，不证明历史或其他仓库没有源文件。
- 静态文件非空检查：首页、归档、关于、既有文章、`css/main.css`、`js/src/bootstrap.js` 及 CNAME 均存在。
- 首页源码含 Hexo 页脚、NexT.Mist v5.1.4、`lang="zh-Hans"`；canonical 为 `http://yoursite.com/`，Open Graph 也仍含默认域名。
- CNAME 内容：`www.saromchars.tech`。

## 线上只读探测

网页读取工具未能取回站点内容；受限网络下 urllib 首次探测 DNS 失败。随后在允许网络访问的命令环境，用 urllib、12 秒超时和默认重定向处理重新探测：

| 请求 | 结果 |
| --- | --- |
| `https://saromchars.github.io/` | 最终 URL 为 `https://www.saromchars.tech/`，HTTP 200 |
| `https://www.saromchars.tech/` | HTTP 200 |
| `https://api.github.com/repos/SaromChars/SaromChars.github.io/pages` | 未认证请求返回 HTTP 404 |

HTTP 200 只证明本次首页请求可达，没有验证全站内容、资源、移动端、DNS 全部记录或发布 commit。Pages API 404 不能作为未启用 Pages 的结论；后台发布来源、构建类型及 HTTPS 设置仍待核实。托管方式来自用户说明。

## 交付与限制

已从模板建立项目简报及站点 JSON，替换不适用的默认栈；未决账号、指标、预算及 Pages 来源保持 null/待确认。已将项目加入索引和当前任务入口。JSON、文档本地链接、工程路径及本轮差异检查见任务清单。

本轮未修改博客文件，未安装依赖、运行生成构建、提交、推送、发 PR 或部署；未创建定时维护自动化。源工程缺失和默认域名残留是下一轮输入，尚未修复。

## 资料迁移

依用户纠正，项目资料已从建站容器迁入博客工程 `.site-foundry/`，容器只保留索引。上文干净工作区和文件统计是克隆时的检查结果；迁移后仅新增维护文档，既有站点文件保持不变。未提交或推送。
