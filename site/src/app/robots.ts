import type {MetadataRoute} from "next";

const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {userAgent: "*", allow: "/"},
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
    host: new URL(siteUrl).origin,
  };
}
