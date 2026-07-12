import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { StickyMobileCTA } from "@/components/site/StickyMobileCTA";
import { whatsappLink } from "@/lib/site-config";

export const Route = createFileRoute("/enviar-vaga")({
  head: () => ({
    meta: [
      { title: "Enviar uma vaga — Vagas Manaus Hoje" },
      { name: "description", content: "Divulgue uma vaga de emprego em Manaus. Envie os dados pelo WhatsApp e publicamos gratuitamente." },
      { property: "og:title", content: "Envie sua vaga para o Vagas Manaus Hoje" },
      { property: "og:description", content: "Divulgação gratuita de vagas em Manaus." },
    ],
  }),
  component: EnviarVagaPage,
});

const CAMPOS: Array<{ label: string; d: string }> = [
  { label: "Cargo / função", d: "Ex: Auxiliar de produção" },
  { label: "Empresa", d: "Nome ou setor da empresa" },
  { label: "Cidade e bairro", d: "Ex: Manaus – Distrito Industrial I" },
  { label: "Salário", d: "Valor ou 'a combinar'" },
  { label: "Tipo de contrato", d: "CLT, temporário, estágio…" },
  { label: "Modalidade", d: "Presencial, híbrido ou remoto" },
  { label: "Escolaridade exigida", d: "Fundamental, médio, superior…" },
  { label: "Experiência exigida", d: "Anos ou 'não exigida'" },
  { label: "Requisitos", d: "O que a pessoa precisa saber ou ter" },
  { label: "Benefícios", d: "VT, VR, plano de saúde…" },
  { label: "Como se candidatar", d: "WhatsApp, e-mail ou link" },
  { label: "Fonte oficial", d: "Link do site/edital, se houver" },
];

function buildMensagem() {
  const linhas = [
    "Olá! Quero divulgar uma vaga no Vagas Manaus Hoje:",
    "",
    ...CAMPOS.map((c) => `• ${c.label}:`),
    "",
    "Obrigado!",
  ];
  return linhas.join("\n");
}

function EnviarVagaPage() {
  const link = whatsappLink(buildMensagem());
  return (
    <SiteLayout>
      <header className="border-b border-black/5 bg-white px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-black leading-tight tracking-tight">
            Divulgue sua vaga gratuitamente.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Junte as informações abaixo e envie pelo WhatsApp. Publicamos assim
            que conseguirmos confirmar a vaga.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 pb-36 md:pb-16">
        <h2 className="text-lg font-extrabold">O que enviar</h2>
        <ul className="mt-4 grid gap-2 md:grid-cols-2">
          {CAMPOS.map((c) => (
            <li key={c.label} className="rounded-2xl border border-black/5 bg-white p-4">
              <p className="font-bold">{c.label}</p>
              <p className="text-sm text-muted-foreground">{c.d}</p>
            </li>
          ))}
        </ul>

        <div className="mt-8 hidden md:block">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics="cta-whatsapp-enviar-vaga"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-whatsapp px-6 text-base font-black text-whatsapp-foreground shadow-lg shadow-whatsapp/25"
          >
            <MessageCircle className="size-5" aria-hidden />
            Enviar vaga pelo WhatsApp
          </a>
        </div>
      </div>

      <StickyMobileCTA>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics="cta-whatsapp-enviar-vaga-mobile"
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-whatsapp text-sm font-black text-whatsapp-foreground shadow-lg shadow-whatsapp/25"
        >
          <MessageCircle className="size-4" aria-hidden />
          Enviar pelo WhatsApp
        </a>
      </StickyMobileCTA>
    </SiteLayout>
  );
}