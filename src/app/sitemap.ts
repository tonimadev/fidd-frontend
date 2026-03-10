import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://fidd.com.br";

  // Páginas públicas estáticas
  const routes = [
    "",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return [...routes];
}
