import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Mail, MessageCircle } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { whatsappLink } from "@/lib/site-config";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Vagas Manaus Hoje" },
      {
        name: "description",
        content: "Fale com o Vagas Manaus Hoje pelo WhatsApp, e-mail ou Instagram.",
      },
      { property: "og:title", content: "Contato" },
      { property: "og:description", content: "Canais para falar com o Vagas Manaus Hoje." },
    ],
  }),
  component: ContatoPage,
});

function ContatoPage() {
  return (
    <SiteLayout>
      <header className="border-b border-black/5 bg-white px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-black tracking-tight">Contato</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Dúvidas, parceria, correções em uma vaga? Escolha o canal.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <ul className="grid gap-3 md:grid-cols-2">
          <li>
            <a
              href={whatsappLink("Olá! Falo com o Vagas Manaus Hoje?")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 items-center gap-3 rounded-2xl border border-black/5 bg-white px-4 font-bold hover:border-whatsapp/40"
            >
              <MessageCircle className="size-5 text-whatsapp" aria-hidden /> WhatsApp
            </a>
          </li>
          <li>
            <a
              href="mailto:contato@vagasmanaushoje.com.br"
              className="flex h-14 items-center gap-3 rounded-2xl border border-black/5 bg-white px-4 font-bold hover:border-primary/40"
            >
              <Mail className="size-5 text-primary" aria-hidden /> E-mail
            </a>
          </li>
          <li className="md:col-span-2">
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 items-center gap-3 rounded-2xl border border-black/5 bg-white px-4 font-bold hover:border-pcd/40"
            >
              <Instagram className="size-5 text-pcd" aria-hidden /> Instagram
            </a>
          </li>
        </ul>
      </div>
    </SiteLayout>
  );
}
