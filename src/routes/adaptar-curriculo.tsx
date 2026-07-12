import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { z } from "zod";

import { AntiFraudNotice } from "@/components/site/AntiFraudNotice";
import { SiteLayout } from "@/components/site/SiteLayout";
import { StickyMobileCTA } from "@/components/site/StickyMobileCTA";
import {
  PRECO_CURRICULO_MAX,
  PRECO_CURRICULO_MIN,
  whatsappLink,
} from "@/lib/site-config";

const searchSchema = z.object({
  vaga: z.string().optional(),
});

export const Route = createFileRoute("/adaptar-curriculo")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Montar ou adaptar currículo — Vagas Manaus Hoje" },
      { name: "description", content: `Serviço opcional: montamos ou adaptamos seu currículo para a vaga desejada por R$ ${PRECO_CURRICULO_MIN} a R$ ${PRECO_CURRICULO_MAX}, entregue via WhatsApp.` },
      { property: "og:title", content: "Currículo pronto para sua vaga em Manaus" },
      { property: "og:description", content: "Serviço via WhatsApp/Pix. Rápido e direto." },
    ],
  }),
  component: AdaptarCurriculoPage,
});

function AdaptarCurriculoPage() {
  const { vaga } = Route.useSearch();

  const mensagem = vaga
    ? `Olá! Quero o serviço de currículo para a vaga: ${vaga}.`
    : "Olá! Quero o serviço de currículo. Podem me ajudar?";

  const link = whatsappLink(mensagem);

  return (
    <SiteLayout>
      <header className="border-b border-black/5 bg-white px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-wider text-primary">
            Serviço opcional
          </p>
          <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight">
            Currículo pronto para a vaga que você quer.
          </h1>
          <p className="mt-2 text-pretty text-sm text-muted-foreground md:text-base">
            Não tem currículo? Montamos do zero. Já tem? Adaptamos para a vaga.
            Tudo por WhatsApp, entrega rápida.
          </p>

          <div className="mt-6 flex items-end gap-4 rounded-2xl border border-black/5 bg-slate-50 p-5">
            <div>
              <p className="font-mono text-[10px] uppercase text-slate-500">
                Investimento
              </p>
              <p className="text-3xl font-black">
                R$ {PRECO_CURRICULO_MIN} <span className="text-lg text-slate-400">–</span> R$ {PRECO_CURRICULO_MAX}
              </p>
              <p className="mt-1 text-xs text-slate-500">Pagamento via Pix</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 pb-36 md:pb-16">
        {vaga ? (
          <div className="mb-6 rounded-2xl border-2 border-primary/30 bg-primary/5 p-5">
            <p className="text-xs font-black uppercase tracking-wider text-primary">
              Vaga pré-selecionada
            </p>
            <p className="mt-1 text-base font-bold">{vaga}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Vamos adaptar seu currículo com foco nessa vaga.
            </p>
          </div>
        ) : null}

        <h2 className="text-lg font-extrabold">Como funciona</h2>
        <ol className="mt-4 space-y-3">
          {[
            { t: "1. Envie a vaga de interesse", d: "Manda o nome da vaga ou o link no WhatsApp." },
            { t: "2. Nossa equipe monta ou adapta", d: "Escrevemos com o foco certo para o tipo da vaga." },
            { t: "3. Recebe pronto pelo WhatsApp", d: "Currículo em PDF, pronto para candidatar." },
          ].map((s) => (
            <li key={s.t} className="flex gap-3 rounded-2xl border border-black/5 bg-white p-4">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="font-bold">{s.t}</p>
                <p className="text-sm text-muted-foreground">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics="cta-whatsapp-curriculo"
            className="hidden h-14 w-full items-center justify-center gap-2 rounded-xl bg-whatsapp text-base font-black text-whatsapp-foreground shadow-lg shadow-whatsapp/25 md:flex"
          >
            <MessageCircle className="size-5" aria-hidden />
            Pedir pelo WhatsApp
          </a>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Serviço de redação profissional. <strong>Não garante contratação</strong> —
          quem contrata é a empresa da vaga.
        </p>

        <div className="mt-6">
          <AntiFraudNotice compact />
        </div>
      </div>

      <StickyMobileCTA>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics="cta-whatsapp-curriculo-mobile"
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-whatsapp text-sm font-black text-whatsapp-foreground shadow-lg shadow-whatsapp/25"
        >
          <MessageCircle className="size-4" aria-hidden />
          Pedir pelo WhatsApp
        </a>
      </StickyMobileCTA>
    </SiteLayout>
  );
}