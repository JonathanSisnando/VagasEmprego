import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

import { SITE_NOME, SITE_VERSAO, whatsappLink } from "@/lib/site-config";

export function Footer() {
  const mensagem = encodeURIComponent(
    `Olá! Vim pelo site ${SITE_NOME} e gostaria de divulgar uma vaga.`,
  );

  return (
    <footer className="mt-16 border-t border-black/5 bg-white pb-28 pt-10 md:pb-10">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-8 flex flex-col items-center gap-4 rounded-2xl border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-5 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-whatsapp text-white shadow-sm">
              <MessageCircle className="size-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-black text-green-900">Tem uma vaga para divulgar?</p>
              <p className="text-sm text-green-700">Envie as informações pelo WhatsApp.</p>
            </div>
          </div>
          <a
            href={whatsappLink(mensagem)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-whatsapp px-5 py-3 text-sm font-black text-whatsapp-foreground shadow-sm transition hover:bg-whatsapp/90 sm:w-auto"
          >
            <MessageCircle className="size-4" aria-hidden />
            Falar no WhatsApp
          </a>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="max-w-sm">
            <p className="text-sm font-extrabold tracking-tight text-foreground">{SITE_NOME}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Central independente de divulgação. Não possuímos vínculo com a Prefeitura de Manaus,
              o Governo do Amazonas, o Sine ou a SETEMP.
            </p>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
              Navegar
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/vagas" className="hover:text-primary">
                  Todas as vagas
                </Link>
              </li>
              <li>
                <Link to="/adaptar-curriculo" className="hover:text-primary">
                  Montar currículo
                </Link>
              </li>
              <li>
                <Link to="/enviar-vaga" className="hover:text-primary">
                  Enviar uma vaga
                </Link>
              </li>
              <li>
                <Link to="/parceiros" className="hover:text-primary">
                  Parceiros
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
              Institucional
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/sobre" className="hover:text-primary">
                  Sobre o projeto
                </Link>
              </li>
              <li>
                <Link to="/contato" className="hover:text-primary">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/politica-de-privacidade" className="hover:text-primary">
                  Política de privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-8 border-t border-black/5 pt-6 text-[11px] uppercase tracking-wider text-muted-foreground">
          © {new Date().getFullYear()} {SITE_NOME} · Vagas atualizadas via Sine Manaus e SETEMP ·
          Sempre confira a fonte oficial da vaga antes de enviar seus dados ou se candidatar. ·
          <span className="ml-1 font-mono">{SITE_VERSAO}</span>
        </p>
      </div>
    </footer>
  );
}
