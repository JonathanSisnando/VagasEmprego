import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "../config/site";

export function Footer() {
  const mensagem = encodeURIComponent(
    `Olá! Vim pelo site ${siteConfig.nome} e gostaria de divulgar uma vaga.`
  );

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 p-5 mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-green-600 text-white shadow-sm">
              <MessageCircle className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-black text-green-900">
                Tem uma vaga para divulgar?
              </p>
              <p className="text-sm text-green-700">
                Envie as informações pelo WhatsApp.
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/${siteConfig.whatsapp}?text=${mensagem}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-green-700 sm:w-auto"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Falar no WhatsApp
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Vagas Manaus Hoje
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Central independente de divulgação de vagas em Manaus.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Links rápidos
            </h3>

<nav className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
  <Link href="/vagas" className="hover:text-blue-700">
    Vagas
  </Link>

  <Link href="/sobre" className="hover:text-blue-700">
    Sobre
  </Link>

  <Link href="/enviar-vaga" className="hover:text-blue-700">
    Enviar vaga
  </Link>

  <Link href="/contato" className="hover:text-blue-700">
    Contato
  </Link>

  <Link href="/adaptar-curriculo" className="hover:text-blue-700">
    Adaptar currículo
  </Link>

  <Link href="/politica-de-privacidade" className="hover:text-blue-700">
  Política de Privacidade
</Link>
</nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Aviso
            </h3>

            <p className="mt-3 text-sm text-slate-600">
              Sempre confira a fonte oficial da vaga antes de enviar seus dados
              ou se candidatar.
            </p>
          </div>
        </div>

        <p className="mt-8 border-t border-slate-100 pt-4 text-xs text-slate-500">
          © 2026 Vagas Manaus Hoje. Projeto independente.
        </p>
      </div>
    </footer>
  );
}