---
title: "TLS 的起源与演进：从 Netscape SSL 到 TLS 1.3"
modDatetime: 2026-11-07T07:28:11Z
pubDatetime: 2018-08-08T16:40:00+08:00
description: "梳理 SSL 与 TLS 的起源、TLS 1.2 及 TLS 1.3 draft-28 的握手设计，用 Canvas 动画解释证书、密钥交换与 0-RTT。"
author: Sarom Chars
draft: false
tags: [TLS, 网络安全]
---

上一篇记了[数字签名、证书和中间人攻击](/2018/08/04/thinking_about_ruanyifeng_signature/)。这篇接着看 SSL 和 TLS：证书怎样参与建立连接，两端又怎样得到保护数据的密钥。

TLS（Transport Layer Security，传输层安全协议）源于 Netscape 的 SSL。1999 年，IETF 发布 TLS 1.0；TLS 1.2 的规范发表于 2008 年。TLS 1.3 这里按 2018 年 3 月 20 日公开的 draft-28 介绍，仍将它作为草案材料。[RFC 2246](#ref-rfc2246) · [RFC 5246](#ref-rfc5246) · [TLS 1.3 draft-28](#ref-draft-ietf-tls-tls13-28)

## TLS 为什么会出现：可靠送达不等于安全送达

设想浏览器通过网络提交一段登录信息。如果应用直接发送明文，即使底层传输可以可靠地把字节送到另一端，也没有自动解决三个问题：经过链路的人能否读到内容、内容会不会被修改、连接的另一端是不是你想访问的服务。

TLS 把这些目标组合起来：**保密性**保护内容，**完整性**帮助发现篡改，<strong>身份认证（authentication）</strong>帮助确认对端身份。实际 HTTPS 中通常由服务器出示数字证书（digital certificate），客户端验证证书和目标名称；是否认证客户端取决于应用需求。TLS 的保护范围也有边界：终端被控制、应用主动泄露数据、或用户向恶意网站提交信息，都不能只靠加密链路解决。[TLS 的目标，RFC 5246 §1](#ref-rfc5246-section-1)

在传统 HTTPS over TCP 连接中，HTTP 负责请求和响应的语义，TLS 先协商参数、认证对端并建立密钥，再保护这些 HTTP 数据。证书参与认证；443 是常用端口，端口号本身不能说明连接协商了哪个版本。[RFC 2246 附录 E](#ref-rfc2246-appendix-E)

## 从 SSL 到 TLS：关键时间线

下表记录协议及标准文档的关键节点。**RFC 的归档时间、协议首次出现的时间和浏览器实际淘汰的时间不是一回事。**

| 时间 | 节点 | 应该记住什么 | 一手来源 |
| --- | --- | --- | --- |
| 1995 年 | Netscape SSL 2.0 文档 | TLS 出现之前的 SSL 路线；RFC 6176 引用的原始 SSL 2.0 文档日期为 1995-02-09 | [RFC 6176 §6.2](#ref-rfc6176-section-6.2) |
| 1996 年 | SSL 3.0 | 后来 TLS 1.0 的直接基础；RFC 6101 归档的是 1996-11-18 版本 | [RFC 6101 摘要](#ref-rfc6101) |
| 1999 年 1 月 | TLS 1.0 | IETF 发布 RFC 2246，将 SSL 3.0 的基础推进为 TLS 标准 | [RFC 2246](#ref-rfc2246) |
| 2006 年 4 月 | TLS 1.1 | 改善 CBC 记录保护，包括使用显式初始化向量（initialization vector，IV） | [RFC 4346 §1.1](#ref-rfc4346-section-1.1) |
| 2008 年 8 月 | TLS 1.2 | 增加 AEAD 密码套件支持，并调整哈希、签名等机制 | [RFC 5246 §1.2](#ref-rfc5246-section-1.2) |
| 2011 年 3 月 | 禁止 SSL 2.0 | 旧协议正式退出可协商版本 | [RFC 6176](#ref-rfc6176) |
| 2015 年 6 月 | 弃用 SSL 3.0 | 修补旧实现不能消除其协议层面的全部问题 | [RFC 7568](#ref-rfc7568) |
| 2018 年 3 月 20 日 | TLS 1.3 draft-28 | 已公开的草案设计：缩短握手、清理旧机制；本文以这一固定版本为依据 | [draft-28](#ref-draft-ietf-tls-tls13-28) |

特别容易混淆的是 **SSL 3.0 与 2011 年**：RFC 6101 于 2011 年发布，是为了保存早期协议文档，不能据此说 SSL 3.0 发明于 2011 年。[RFC 6101](#ref-rfc6101)

部署时可以参考 2015 年的 RFC 7525：要求支持并优先协商 TLS 1.2；对 TLS 1.0 / 1.1 使用 SHOULD NOT，并保留无更高版本可用时的例外。建议、禁止协商和规范状态变化需要分别看。[RFC 7525 §3.1.1](#ref-rfc7525-section-3.1.1)

## SSL 为什么改叫 TLS：既有继承，也有协议变化

SSL 是 Secure Sockets Layer；TLS 是 Transport Layer Security。两者确有直接继承关系，但把 TLS 1.0 解释成“SSL 3.0 换个名字”会漏掉标准中的实质差异。

RFC 2246 明确说明 TLS 1.0 基于 Netscape 的 SSL 3.0 规范，同时两者的差异足以使它们不能直接互操作。当时的实现可以支持多个版本并协商回退，这不等于两个协议本身完全相同。**这里是在描述历史，不能据此为今天启用 SSL 回退。** [RFC 2246 §3](#ref-rfc2246-section-3)

今天仍常听到“SSL 证书”。在网站语境中，这往往是沿用下来的商品或习惯名称，并不能证明连接在运行 SSL。判断连接使用的协议，要看实际协商结果，而不是证书商品名。

## TLS 1.1 与 1.2：让记录保护和算法选择继续演进

TLS 的变化不只发生在握手上，它还必须规定怎样把应用数据分成记录并加以保护。

TLS 1.1 对 CBC 模式的处理做了调整，例如显式 IV。TLS 1.2 则支持带关联数据的认证加密（authenticated encryption with associated data，AEAD），并改进了哈希与签名算法的选择方式。前者修正已有路径，后者给更现代的数据保护机制提供了协议空间。[RFC 4346 §1.1](#ref-rfc4346-section-1.1) · [RFC 5246 §1.2](#ref-rfc5246-section-1.2)

这也解释了为什么“版本支持 TLS 1.2”只是判断条件之一：同一个协议版本还可能允许不同的密码套件。讨论安全性需要同时看版本、算法、实现和配置，而不能只在版本号上打勾。面向实际配置时，应结合具体平台文档与适用规范；本文侧重历史，不提供一份适用于所有服务的配置清单。[2015 年的安全使用建议：RFC 7525](#ref-rfc7525)

## TLS 1.3 草案：把密钥交换提前

draft-28 中，TLS 1.3 把握手收紧：保留 AEAD 数据保护，移除静态 RSA 密钥交换等旧机制，并在 ServerHello 之后加密更多握手内容。这里的“移除 RSA 密钥交换”不等于“RSA 证书都不能用了”：密钥交换与身份签名是不同职责。[draft-28 §1.3](#ref-draft-ietf-tls-tls13-28-section-1.3)

在常见的、基于证书和临时密钥交换的连接中，客户端不必等服务器回应后才首次发送密钥交换参数。它把 key_share 提前放进 ClientHello，减少了等待。这是下面动画对比的重点。

### 握手示意：TLS 1.2 与 TLS 1.3 draft-28

*注：下图为教学示意动画，展示消息交互时序，不是实测抓包。*

<iframe src="/animations/tls-handshake.html" title="TLS 1.2 与 TLS 1.3 draft-28 握手逐步对比动画" loading="lazy" width="100%" height="800" style="border:1px solid #64748b;border-radius:12px" sandbox="allow-scripts"></iframe>

[单独打开握手动画](/animations/tls-handshake.html)。支持切换版本、播放、暂停、重置与逐步查看；默认静止，减少动态效果偏好下使用逐步展示。

**无需运行脚本，也可以按下面的顺序理解。** 示例限定为已建立底层连接、仅服务器证书认证、无会话恢复、无 HelloRetryRequest 的握手；TLS 1.2 采用 ECDHE。一次箭头代表一组消息（flight），不是一个 TCP 包。

| 阶段 | TLS 1.2（示意） | TLS 1.3 draft-28（示意） |
| --- | --- | --- |
| 客户端先说什么 | ClientHello：声明能力 | ClientHello：声明能力，并携带 key_share |
| 服务器第一次回应 | ServerHello、Certificate、ServerKeyExchange、ServerHelloDone | ServerHello，随后发送受握手密钥保护的 EncryptedExtensions、Certificate、CertificateVerify、Finished |
| 客户端下一步 | 验证服务器，发送 ClientKeyExchange、ChangeCipherSpec、Finished | 验证证书与握手证明，发送 Finished，随后可发应用数据 |
| 后续 | 服务器发送 ChangeCipherSpec、Finished，客户端收到后可发应用数据 | 服务器验证客户端 Finished；完成此示例中的握手 |

从客户端开始发 ClientHello，到它能够发出常规应用数据，这个简化场景里 TLS 1.2 需要约 **2 个网络往返（2-RTT）**，TLS 1.3 需要约 **1 个网络往返（1-RTT）**。这里没有计入 DNS、底层连接建立、证书验证耗时，也没有覆盖所有恢复路径。HelloRetryRequest 会增加往返，不能把这里的 1-RTT 直接等同于网页加载时间减半。[TLS 1.2 握手：RFC 5246 §7.3](#ref-rfc5246-section-7.3) · [TLS 1.3 草案握手：draft-28 §2](#ref-draft-ietf-tls-tls13-28-section-2)

### 证书、公钥、会话密钥分别做什么

这部分可以接着阅读本站以前的[数字签名、证书与中间人攻击笔记](/2018/08/04/thinking_about_ruanyifeng_signature/)。旧笔记中的“用私钥加密摘要”是直观类比；理解现代协议时，应使用“签名算法与验签算法”的表述，不把所有签名都理解成公钥加密的逆过程。

按 draft-28 的证书认证握手，可以这样分工：

- **证书与信任链**：帮助客户端把服务名称与公钥建立可信关联，还需要正确完成名称、有效期和信任路径等验证。
- **CertificateVerify**：服务器用对应私钥对握手上下文签名，证明持有私钥，并把身份认证绑定到本次握手。
- **临时密钥协商**：两端利用各自秘密和交换的公开参数通过临时密钥协商（key agreement）建立共享秘密，再按协议派生流量密钥。私密密钥材料不会原样传输。
- **对称流量密钥**：用于高效保护后续记录。证书里的公钥并不直接承担每个 HTTP 响应正文的加密工作。

这些职责在握手里相互配合：只交换密钥而不认证对端，仍可能遭遇中间人攻击；只持有证书而不证明私钥持有，也不能完成这里描述的认证。[draft-28 §4.4](#ref-draft-ietf-tls-tls13-28-section-4.4) · [draft-28 §7](#ref-draft-ietf-tls-tls13-28-section-7)

### 0-RTT 为什么不是“免费加速”

draft-28 允许在特定的预共享密钥或恢复场景下发送早期数据（0-RTT）。它不是首次连接的通用能力，也没有与常规 1-RTT 数据完全相同的安全保证，尤其需要处理**跨连接重放**风险。[draft-28 §2.3](#ref-draft-ietf-tls-tls13-28-section-2.3)

以业务理解这个区别：如果一次请求会创建订单或扣款，被重复执行的后果远比重复读取内容严重。是否允许早期数据，必须由应用协议和服务端一起判断。仅仅因为“用了 TLS 1.3”就把所有操作放进 0-RTT，并不是正确结论。[draft-28 §8](#ref-draft-ietf-tls-tls13-28-section-8)

SSL 2.0 与 SSL 3.0 已分别有禁止或弃用文档。历史规范可以帮助理解旧系统，具体部署仍需核对当时的安全建议、实现版本与密码套件。[RFC 6176](#ref-rfc6176) · [RFC 7568](#ref-rfc7568) · [RFC 7525](#ref-rfc7525)

## 延伸阅读与来源

正文引用会定位到这里；点击下列原文或章节链接，会在新标签页打开。

<ul>
<li><a id="ref-rfc6101" href="https://www.rfc-editor.org/rfc/rfc6101" target="_blank" rel="noopener noreferrer" title="在新标签页打开原文" style="scroll-margin-top:2rem">RFC 6101：SSL 3.0 历史归档 ↗</a>
</li>
<li><a id="ref-rfc2246" href="https://www.rfc-editor.org/rfc/rfc2246" target="_blank" rel="noopener noreferrer" title="在新标签页打开原文" style="scroll-margin-top:2rem">RFC 2246：TLS 1.0 ↗</a>
<ul>
<li><a id="ref-rfc2246-appendix-E" href="https://www.rfc-editor.org/rfc/rfc2246#appendix-E" target="_blank" rel="noopener noreferrer" title="在新标签页打开原文" style="scroll-margin-top:2rem">RFC 2246 附录 E ↗</a></li>
<li><a id="ref-rfc2246-section-3" href="https://www.rfc-editor.org/rfc/rfc2246#section-3" target="_blank" rel="noopener noreferrer" title="在新标签页打开原文" style="scroll-margin-top:2rem">RFC 2246 §3 ↗</a></li>
</ul>
</li>
<li><a id="ref-rfc4346" href="https://www.rfc-editor.org/rfc/rfc4346" target="_blank" rel="noopener noreferrer" title="在新标签页打开原文" style="scroll-margin-top:2rem">RFC 4346：TLS 1.1 ↗</a>
<ul>
<li><a id="ref-rfc4346-section-1.1" href="https://www.rfc-editor.org/rfc/rfc4346#section-1.1" target="_blank" rel="noopener noreferrer" title="在新标签页打开原文" style="scroll-margin-top:2rem">RFC 4346 §1.1 ↗</a></li>
</ul>
</li>
<li><a id="ref-rfc5246" href="https://www.rfc-editor.org/rfc/rfc5246" target="_blank" rel="noopener noreferrer" title="在新标签页打开原文" style="scroll-margin-top:2rem">RFC 5246：TLS 1.2 ↗</a>
<ul>
<li><a id="ref-rfc5246-section-1" href="https://www.rfc-editor.org/rfc/rfc5246#section-1" target="_blank" rel="noopener noreferrer" title="在新标签页打开原文" style="scroll-margin-top:2rem">TLS 的目标，RFC 5246 §1 ↗</a></li>
<li><a id="ref-rfc5246-section-1.2" href="https://www.rfc-editor.org/rfc/rfc5246#section-1.2" target="_blank" rel="noopener noreferrer" title="在新标签页打开原文" style="scroll-margin-top:2rem">RFC 5246 §1.2 ↗</a></li>
<li><a id="ref-rfc5246-section-7.3" href="https://www.rfc-editor.org/rfc/rfc5246#section-7.3" target="_blank" rel="noopener noreferrer" title="在新标签页打开原文" style="scroll-margin-top:2rem">TLS 1.2 握手：RFC 5246 §7.3 ↗</a></li>
</ul>
</li>
<li><a id="ref-draft-ietf-tls-tls13-28" href="https://datatracker.ietf.org/doc/html/draft-ietf-tls-tls13-28" target="_blank" rel="noopener noreferrer" title="在新标签页打开原文" style="scroll-margin-top:2rem">TLS 1.3 draft-28：2018-03-20 公开的草案版本 ↗</a>
<ul>
<li><a id="ref-draft-ietf-tls-tls13-28-section-1.3" href="https://datatracker.ietf.org/doc/html/draft-ietf-tls-tls13-28#section-1.3" target="_blank" rel="noopener noreferrer" title="在新标签页打开原文" style="scroll-margin-top:2rem">draft-28 §1.3 ↗</a></li>
<li><a id="ref-draft-ietf-tls-tls13-28-section-2" href="https://datatracker.ietf.org/doc/html/draft-ietf-tls-tls13-28#section-2" target="_blank" rel="noopener noreferrer" title="在新标签页打开原文" style="scroll-margin-top:2rem">TLS 1.3 草案握手：draft-28 §2 ↗</a></li>
<li><a id="ref-draft-ietf-tls-tls13-28-section-4.4" href="https://datatracker.ietf.org/doc/html/draft-ietf-tls-tls13-28#section-4.4" target="_blank" rel="noopener noreferrer" title="在新标签页打开原文" style="scroll-margin-top:2rem">draft-28 §4.4 ↗</a></li>
<li><a id="ref-draft-ietf-tls-tls13-28-section-7" href="https://datatracker.ietf.org/doc/html/draft-ietf-tls-tls13-28#section-7" target="_blank" rel="noopener noreferrer" title="在新标签页打开原文" style="scroll-margin-top:2rem">draft-28 §7 ↗</a></li>
<li><a id="ref-draft-ietf-tls-tls13-28-section-2.3" href="https://datatracker.ietf.org/doc/html/draft-ietf-tls-tls13-28#section-2.3" target="_blank" rel="noopener noreferrer" title="在新标签页打开原文" style="scroll-margin-top:2rem">draft-28 §2.3 ↗</a></li>
<li><a id="ref-draft-ietf-tls-tls13-28-section-8" href="https://datatracker.ietf.org/doc/html/draft-ietf-tls-tls13-28#section-8" target="_blank" rel="noopener noreferrer" title="在新标签页打开原文" style="scroll-margin-top:2rem">draft-28 §8 ↗</a></li>
</ul>
</li>
<li><a id="ref-rfc6176" href="https://www.rfc-editor.org/rfc/rfc6176" target="_blank" rel="noopener noreferrer" title="在新标签页打开原文" style="scroll-margin-top:2rem">RFC 6176：禁止 SSL 2.0 ↗</a>
<ul>
<li><a id="ref-rfc6176-section-6.2" href="https://www.rfc-editor.org/rfc/rfc6176#section-6.2" target="_blank" rel="noopener noreferrer" title="在新标签页打开原文" style="scroll-margin-top:2rem">RFC 6176 §6.2 ↗</a></li>
</ul>
</li>
<li><a id="ref-rfc7568" href="https://datatracker.ietf.org/doc/html/rfc7568" target="_blank" rel="noopener noreferrer" title="在新标签页打开原文" style="scroll-margin-top:2rem">RFC 7568：弃用 SSL 3.0 ↗</a>
</li>
<li><a id="ref-rfc7525" href="https://www.rfc-editor.org/rfc/rfc7525" target="_blank" rel="noopener noreferrer" title="在新标签页打开原文" style="scroll-margin-top:2rem">RFC 7525：2015 年的 TLS / DTLS 安全使用建议 ↗</a>
<ul>
<li><a id="ref-rfc7525-section-3.1.1" href="https://www.rfc-editor.org/rfc/rfc7525#section-3.1.1" target="_blank" rel="noopener noreferrer" title="在新标签页打开原文" style="scroll-margin-top:2rem">RFC 7525 §3.1.1 ↗</a></li>
</ul>
</li>
</ul>
