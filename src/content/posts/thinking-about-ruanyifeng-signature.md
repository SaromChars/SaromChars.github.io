---
title: "阮一峰译数字签名--体会"
pubDatetime: 2018-08-04T02:55:15+08:00
description: "阅读数字签名相关文章后的笔记，记录数字签名、数字证书、信任链和中间人攻击的理解。"
author: Sarom Chars
draft: false
tags: []
---

<span id="阮一峰译数字签名–读后感"></span>

## [阮一峰译数字签名](http://www.ruanyifeng.com/blog/2011/08/what_is_a_digital_signature.html)–读后感

## 数字签名简单概念

数字签名

> 就是只有信息的发送者才能产生的别人无法伪造的一段数字串，这段数字同时也是对信息的发送者发送信息的真实性的一个有效证明。是对非对称密钥加密技术和数字摘要技术的应用。先对原文信息作数字摘要处理（通过hash算法，md5、sha之类的），得到定长的hash值，再用密钥对中的私钥对hash值以及相关算法信息进行加密。

数字签名的信息完整性

> 数字签名的验签，将原文产生的数字摘要信息和使用公钥解密得到的数字摘要信息进行比对，进而确认信息的完整性。

数字签名的不可抵赖性

> 发送者的不可抵赖性，是由于私钥只有发送者拥有，而密钥对唯一，即公私钥存在一一对应的关系。要想确保发送者，则应该先确保公钥可靠获取、保存。最后通过比对数字摘要信息，进而确认发送者的身份，**（个人理解）换句话说，数字签名的不可抵赖性建立在信息完整性之上。**

## 数字证书的简单概念

数字认证中心

> 电子签证的机关，简称CA（Certificate Authority），自身持有机构的私钥，也负责发行包含所认证的客户、设备等公钥的数字证书。作为可信的第三方，为交易、通信提供保障。

数字证书

> CA为客户生成的密钥对，用CA自身的私钥对客户的公钥以及相关信息作数字签名后得到的文件，即为数字证书。CA的数字证书可以通过CA的公钥进行验签，确保可信。通常是系统自带或直接在网上下载CA根证书，用当中的公钥，对得到的数字证书验签，进而获取到客户的公钥。通过信任CA，进而信任CA所信任的客户（组织或者个人）的身份，存在一个信任链的关系。

信任链

> 数字证书的信任关系是，层级传递的，链式的。即A信任CA，CA信任B，那A就可以信任B了。

根证书

> 数字证书的信任关系是链式的，需要验证的客户的数字证书是信任链的末端，自然有信任链的首端。而首端的是否可信，如果仍采取数字签名的方式去确保证书可信，则无法找到信任链的源头。理应存在一个信任链的首端–根证书，CA自己颁发给自己的数字证书。应该是使用CA自己的私钥给自己的公钥以及相关信息签名。

## 文章大概例子

首先有Bob，Pady，Doge，Susan四个人（用户），Bob自己通过了非对称加密算法生成了密钥对，然后将自己的公钥给了其余三个。

于是乎，根据非对称加密算法的特性，其他三个用公钥加密的消息，只有持有私钥的Bob自身能够解密。

<div style="max-width:100%;overflow-x:auto" id="flowchart-0" class="flow-chart"></div>

同理，Bob用私钥加密的消息，则其余三人都能够解密。

<div style="max-width:100%;overflow-x:auto" id="sequence-0"></div>

所以发送密邮，应该事先交换彼此的公钥。

对于有时候，Bob得为自己的言行负责，写下言出必行的承诺书，又要保证自己的承诺书没有被篡改（通常承诺书不必加密，明文，是公开的）。

就必须在承诺书上留下自己的签名，首先用数字摘要算法获取承诺书的指纹（定长hash值），再用自己独有的私钥对这个指纹进行加密，附在承诺书后面，方便他人检验（相当于落款的大名）。

Bob对Susan的承诺书：

<div style="max-width:100%;overflow-x:auto" id="flowchart-1" class="flow-chart"></div>

Susan拿到后，获取承诺书的指纹和用Bob的公钥解密后得到的hash，二者相比较：

<div style="max-width:100%;overflow-x:auto" id="flowchart-2" class="flow-chart"></div>

相等，说明这个承诺书没有改动，真的是Bob写的啊。

但是呢，假设Doge是个不怀好意的人，事先生成属于自己的一套密钥对，由于Bob给Susan密钥对的时候，没有其他的安全保障，或者说Susan一开始就错拿了Doge的公钥。

这样就可怕了，Doge就可以堂而皇之的成为了中间人，所以说，不要天天给心仪的女生写信、请购物车，不然，可能成为了邮差或者快递的女朋友。。。

这就是简单的“中间人攻击”。

Bob以为是这样的：

<div style="max-width:100%;overflow-x:auto" id="sequence-1"></div>

  
实际上，经过了Doge的偷龙转凤：  

<div style="max-width:100%;overflow-x:auto" id="sequence-2"></div>

这样Susan还以为这一切都是Bob写的，但是觉得不对劲，和Bob当面商量之后才发现，根本不是Bob一开始写的内容。虽然将信将疑，Susan觉得还是找个公证人可靠些，让公证人给Bob的公钥做数字签名，让公证人负责审核公钥是不是Bob的，这样不用Susan自己逐一确保别人给的公钥。

这个公证人，就是数字认证机构（CA）,所颁发的就是数字签名、审核过的公钥以及一些相关的消息，就是数字证书。

<div style="max-width:100%;overflow-x:auto" id="sequence-3"></div>

年度大戏。。不。。。年度大时序啊。。。。

上面CA说了这个公钥就是Bob的，那就是Bob的，这样Doge也没办法了。

这样只要有这个CA的公钥就可以，解析这个CA所颁发的数字证书了，管理起来也更加方便。将对各个公钥的验证转话为了对CA公钥的验证，大大减少了Susan验证负担，毕竟Bob可能只是Susan的云备胎之一。。可能还有Effort、Carson等人。

<script src="/lib/recovered/raphael-2.2.7-raphael.min.js"></script>

<script src="/lib/recovered/flowchart-1.6.5-flowchart.min.js"></script>

<textarea id="flowchart-0-code" style="display: none">start=&gt;start: 开始
message=&gt;inputoutput: 正常数据
encrypt=&gt;subroutine: 使用公钥加密
encryptText=&gt;inputoutput: 密文
decrypt=&gt;subroutine: 使用私钥解密
transText=&gt;inputoutput: 译文
end=&gt;end: 结束

start-&gt;message-&gt;encrypt-&gt;encryptText-&gt;decrypt-&gt;transText-&gt;end</textarea>

<textarea id="flowchart-0-options" style="display: none">{"theme":"simple","scale":1,"line-width":2,"line-length":50,"text-margin":10,"font-size":12}</textarea>

 

<script> var code = document.getElementById("flowchart-0-code").value; var options = JSON.parse(decodeURIComponent(document.getElementById("flowchart-0-options").value)); var diagram = flowchart.parse(code); diagram.drawSVG("flowchart-0", options);</script>

<textarea id="flowchart-1-code" style="display: none">A=&gt;start: start writing
B=&gt;inputoutput: message
C=&gt;operation: hash the message
D=&gt;operation: encrpyt the hash result via the private key
E=&gt;operation: append the message
F=&gt;inputoutput: message with signature
G=&gt;end: end writing
A-&gt;B-&gt;C-&gt;D-&gt;E-&gt;F-&gt;G</textarea>

<textarea id="flowchart-1-options" style="display: none">{"theme":"simple","scale":1,"line-width":2,"line-length":50,"text-margin":10,"font-size":12}</textarea>

 

<script> var code = document.getElementById("flowchart-1-code").value; var options = JSON.parse(decodeURIComponent(document.getElementById("flowchart-1-options").value)); var diagram = flowchart.parse(code); diagram.drawSVG("flowchart-1", options);</script>

<textarea id="flowchart-2-code" style="display: none">A=&gt;start: start verifying
B=&gt;inputoutput: message with signature
C=&gt;operation: hash the message
D=&gt;operation: decrpyt the hash result via the public key
E=&gt;condition: compare the hash value and decrypt value
F=&gt;inputoutput: the message is real
G=&gt;inputoutput: the message is fake
H=&gt;end: end verifying
A-&gt;B-&gt;C-&gt;D-&gt;E
E(yes)-&gt;F
E(no)-&gt;G
F-&gt;H
G-&gt;H</textarea>

<textarea id="flowchart-2-options" style="display: none">{"theme":"simple","scale":1,"line-width":2,"line-length":50,"text-margin":10,"font-size":12}</textarea>

 

<script> var code = document.getElementById("flowchart-2-code").value; var options = JSON.parse(decodeURIComponent(document.getElementById("flowchart-2-options").value)); var diagram = flowchart.parse(code); diagram.drawSVG("flowchart-2", options);</script>

<script src="/lib/recovered/webfont-1.6.27-webfontloader.js"></script>

<script src="/lib/recovered/snap.svg-0.4.1-snap.svg-min.js"></script>

<script src="/lib/recovered/underscore.js-1.8.3-underscore-min.js"></script>

<script src="/lib/recovered/js-sequence-diagrams-1.0.6-sequence-diagram-min.js"></script>

<textarea id="sequence-0-code" style="display: none">Title: 以Bob与Pady通信为例子
Bob-&gt;Pady: 公钥
Bob--&gt;Pady: 私钥加密过的消息
Pady--&gt;Bob: 公钥加密过的消息</textarea>

<textarea id="sequence-0-options" style="display: none">{"theme":"simple","scale":1,"line-width":2,"line-length":50,"text-margin":10,"font-size":12}</textarea>

 

<script> var code = document.getElementById("sequence-0-code").value; var options = JSON.parse(decodeURIComponent(document.getElementById("sequence-0-options").value)); var diagram = Diagram.parse(code); diagram.drawSVG("sequence-0", options);</script>

<textarea id="sequence-1-code" style="display: none">Bob-&gt;Susan: love message
Susan-&gt;Bob: oh shit</textarea>

<textarea id="sequence-1-options" style="display: none">{"theme":"simple","scale":1,"line-width":2,"line-length":50,"text-margin":10,"font-size":12}</textarea>

 

<script> var code = document.getElementById("sequence-1-code").value; var options = JSON.parse(decodeURIComponent(document.getElementById("sequence-1-options").value)); var diagram = Diagram.parse(code); diagram.drawSVG("sequence-1", options);</script>

<textarea id="sequence-2-code" style="display: none">Bob-&gt;Doge: love message
Doge-&gt;Susan: fxxk U
Bob--&gt;Susan: fxxk U
Susan-&gt;Bob: oh shit</textarea>

<textarea id="sequence-2-options" style="display: none">{"theme":"simple","scale":1,"line-width":2,"line-length":50,"text-margin":10,"font-size":12}</textarea>

 

<script> var code = document.getElementById("sequence-2-code").value; var options = JSON.parse(decodeURIComponent(document.getElementById("sequence-2-options").value)); var diagram = Diagram.parse(code); diagram.drawSVG("sequence-2", options);</script>

<textarea id="sequence-3-code" style="display: none">participant CA
participant Bob
participant Susan

Bob-&gt;CA: 1、请求审核身份，并颁发数字证书
CA-&gt;Bob: 2、通过后，颁发数字证书
Bob-&gt;Susan: 3、签名后的\nlove message，\n并带上了公钥数字证书
Susan-&gt;CA: 4、请求根证书，\n用于验证Bob给的公钥数字证书
CA-&gt;Susan: 5、返回根证书
Susan-&gt;Susan: 6、CA保证了公钥\n确实是Bob的，\n（确认了公钥的申请人）
Susan-&gt;Susan: 7、Susan知道了\nBob的真实想法后，\n十分感动
Susan-&gt;Bob: 8、(使用公钥加密过的)\nsorry, u r a good man
Bob-&gt;Bob: 9、Bob认为，\nSusan泄漏了公钥，\n绝对不是Susan发的消息
Bob-&gt;Susan: 10、继续，\n签名后的love message，\n并带上了公钥数字证书

Susan-&gt;Susan: 11、Susan苦恼如何自证
Susan-&gt;CA: 12、Susan也去申请证书，\n请求审核身份，\n并颁发数字证书
CA-&gt;Susan: 13、通过后，\n颁发数字证书
Susan-&gt;Bob: 14、签名后的明文：\nsorry, u r a good man，\n并带上了公钥数字证书
Bob-&gt;CA: 15、Bob不相信，\n去CA那边自取其辱
CA-&gt;Susan: 16、返回根证书，\n（耸肩。。）
Bob-&gt;Bob: 17、CA保证了公钥\n确实是Bob的，\n（确认了公钥的申请人）
Bob-&gt;CA: 18、Bob觉得在没\n必要证明自己了，\n申请吊销证书

CA-&gt;CA: 19、钱交了就行。。\nBob的证书就作废吧</textarea>

<textarea id="sequence-3-options" style="display: none">{"theme":"simple","scale":1,"line-width":2,"line-length":50,"text-margin":10,"font-size":12}</textarea>

 

<script> var code = document.getElementById("sequence-3-code").value; var options = JSON.parse(decodeURIComponent(document.getElementById("sequence-3-options").value)); var diagram = Diagram.parse(code); diagram.drawSVG("sequence-3", options);</script>
