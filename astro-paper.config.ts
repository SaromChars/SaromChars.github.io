import { defineAstroPaperConfig } from "./src/types/config";
export default defineAstroPaperConfig({
  site: {
    url: process.env.SITE_URL || "https://www.saromchars.tech/",
    title: "Sarom's Blog",
    description: "Sarom Chars 的个人博客，记录技术学习与思考。",
    author: "Sarom Chars",
    profile: "https://github.com/SaromChars",
    ogImage: "og.png",
    lang: "zh-CN",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: { perPage: 10, perIndex: 5 },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: false,
    showArchives: true,
    showBackButton: true,
    editPost: { enabled: false },
    search: "pagefind",
  },
  socials: [{ name: "github", url: "https://github.com/SaromChars", linkTitle: "Sarom Chars 的 GitHub" }],
  shareLinks: [],
});
