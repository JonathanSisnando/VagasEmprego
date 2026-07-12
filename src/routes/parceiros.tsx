import { createFileRoute, Link } from "@tanstack/react-router";
import { Instagram, MessageCircle } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { whatsappLink } from "@/lib/site-config";

type Parceiro = {
  nome: string;
  descricao: string;
  instagram?: string;
  whatsapp?: string;
};

const PARCEIROS: Parceiro[] = [
  // TODO: preencher com parceiros reais
];

export const Route = createFileRoute("/parceiros")({
  head: () => ({
    meta: [
      { title: "Parceiros — Vagas Manaus Hoje" },
      { name: "description", content: "Perfis parceiros que divulgam vagas em Manaus junto com o Vagas Manaus Hoje." },
      { property: "og:title", content: "Parceiros de divulgação em Manaus" },
      { property: "og:description", content: "Rede de perfis que compartilha vagas na cidade." },
    ],
  }),
  component: ParceirosPage,
});

function ParceirosPage() {
  return (
    <SiteLayout>
      <header className="border-b border-black/5 bg-white px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-black tracking-tight">Parceiros</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Perfis do Instagram e WhatsApp que divulgam vagas em Manaus e que
            trocam publicações com o Vagas Manaus Hoje.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8">
        {PARCEIROS.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-black/10 bg-white p-8 text-center">
            <p className="text-lg font-extrabold">Ainda sem parceiros por aqui.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Tem um perfil que divulga vagas em Manaus? Fale com a gente para
              trocar divulgação.
            </p>
            <a
              href={whatsappLink("Olá! Tenho um perfil que divulga vagas em Manaus e quero trocar divulgação com o Vagas Manaus Hoje.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex h-12 items-center gap-2 rounded-xl bg-whatsapp px-5 text-sm font-black text-whatsapp-foreground"
            >
              <MessageCircle className="size-4" aria-hidden /> Falar no WhatsApp
            </a>
            <div className="mt-4 text-xs text-muted-foreground">
              ou <Link to="/contato" className="underline">envie uma mensagem</Link>
            </div>
          </div>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {PARCEIROS.map((p) => (
              <li key={p.nome} className="rounded-2xl border border-black/5 bg-white p-5">
                <p className="text-base font-extrabold">{p.nome}</p>
                <p className="mt-1 text-sm text-muted-foreground">{p.descricao}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.instagram ? (
                    <a href={p.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold">
                      <Instagram className="size-3.5" aria-hidden /> Instagram
                    </a>
                  ) : null}
                  {p.whatsapp ? (
                    <a href={p.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-whatsapp/10 px-3 py-1.5 text-xs font-bold text-whatsapp">
                      <MessageCircle className="size-3.5" aria-hidden /> WhatsApp
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SiteLayout>
  );
}