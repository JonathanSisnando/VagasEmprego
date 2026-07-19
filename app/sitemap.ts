import type { MetadataRoute } from "next";
import { vagas } from "../data/vagas";
import { siteConfig } from "../config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const dataAtual = new Date();

  return [
    {
      url: `${siteConfig.url}`,
      lastModified: dataAtual,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/vagas`,
      lastModified: dataAtual,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/enviar-vaga`,
      lastModified: dataAtual,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/contato`,
      lastModified: dataAtual,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/sobre`,
      lastModified: dataAtual,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/politica-de-privacidade`,
      lastModified: dataAtual,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${siteConfig.url}/adaptar-curriculo`,
      lastModified: dataAtual,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}/parceiros`,
      lastModified: dataAtual,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...vagas.map((vaga) => ({
      url: `${siteConfig.url}/vagas/${vaga.slug}`,
      lastModified: new Date(vaga.dataPublicacao),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}