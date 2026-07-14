import { createFileRoute } from "@tanstack/react-router";

const BASE_URL = "https://vagas-manaus.vercel.app";

type SitemapEntry = {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
};

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "daily", priority: "1.0" },
          { path: "/vagas", changefreq: "daily", priority: "0.9" },
          { path: "/adaptar-curriculo", changefreq: "weekly", priority: "0.8" },
          { path: "/enviar-vaga", changefreq: "weekly", priority: "0.6" },
          { path: "/parceiros", changefreq: "monthly", priority: "0.4" },
          { path: "/sobre", changefreq: "monthly", priority: "0.5" },
          { path: "/contato", changefreq: "monthly", priority: "0.4" },
          { path: "/politica-de-privacidade", changefreq: "yearly", priority: "0.3" },
        ];

        // Tenta adicionar vagas dinâmicas ao sitemap
        try {
          const [resSine, resSetemp] = await Promise.all([
            fetch("https://www.manaus.am.gov.br/wp-json/wp/v2/posts?search=sine&per_page=1&orderby=date&order=desc&_fields=id,date", { signal: AbortSignal.timeout(5000) }),
            fetch("https://www.portaldotrabalhador.am.gov.br/jobs", { signal: AbortSignal.timeout(5000) }),
          ]);

          if (resSine.ok) {
            const posts = await resSine.json() as { id: number; date: string }[];
            const dataAtual = new Date().toISOString().slice(0, 10);
            // Adiciona sitemap genérico para vagas (o slug é derivado do título)
            entries.push({ path: "/vagas", changefreq: "daily", priority: "0.9", lastmod: posts[0]?.date?.slice(0, 10) ?? dataAtual });
          }
        } catch {
          // fallback sem vagas dinâmicas
        }

        const urls = entries
          .map((e) =>
            [
              `  <url>`,
              `    <loc>${BASE_URL}${e.path}</loc>`,
              e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
              e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
              e.priority ? `    <priority>${e.priority}</priority>` : null,
              `  </url>`,
            ]
              .filter(Boolean)
              .join("\n"),
          )
          .join("\n");

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
