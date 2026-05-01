export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/lots/lots", "/lots/completed", "/lots/unsold", "/news", "/contact", "/search"],
        disallow: [
          "/profile",
          "/auction/",
          "/login",
          "/register",
          "/admin",
          "/api/",
          "/*.pdf", // If you want to keep protocols private from direct search, but usually lots are public
        ],
      },
    ],
    sitemap: "https://www.uainf-auksion.uz/sitemap.xml",
  };
}
