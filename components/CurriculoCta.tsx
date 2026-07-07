import Link from "next/link";
import { FileText, Sparkles, Zap } from "lucide-react";
import { siteConfig } from "../config/site";

type CurriculoCtaProps = {
  variant?: "banner" | "sidebar";
  vaga?: string;
  fonte?: string;
};

function montarHref(vaga?: string, fonte?: string) {
  if (!vaga) {
    return "/adaptar-curriculo";
  }

  const params = new URLSearchParams({ vaga });

  if (fonte) {
    params.set("fonte", fonte);
  }

  return `/adaptar-curriculo?${params.toString()}`;
}

export function CurriculoCta({ variant = "banner", vaga, fonte }: CurriculoCtaProps) {
  const href = montarHref(vaga, fonte);

  if (variant === "sidebar") {
    return (
      <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-blue-700">
          <Sparkles className="size-5" aria-hidden="true" />
          <p className="text-sm font-black uppercase tracking-wide">
            Serviço extra
          </p>
        </div>

        <h3 className="mt-3 text-lg font-black text-slate-950">
          Adapte seu currículo pra essa vaga
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-700">
          Envie a vaga e seu currículo e aumente sua chance de ser chamado
          pra entrevista.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
            <Zap className="size-3" aria-hidden="true" /> Destaque
          </span>
          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
            {siteConfig.precoCurriculo}
          </span>
        </div>

        <Link
          href={href}
          className="mt-4 flex w-full items-center justify-center rounded-xl bg-blue-700 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-800"
        >
          Quero adaptar meu currículo
        </Link>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-start gap-4 overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
        <Zap className="size-3" aria-hidden="true" /> Mais pedido
      </span>

      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-blue-600 text-white shadow-sm">
          <FileText className="size-6" aria-hidden="true" />
        </span>

        <div>
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">
            Serviço extra
          </p>
          <h3 className="mt-1 text-lg font-black text-slate-950">
            Quer adaptar seu currículo pra uma vaga específica ou montar um do
            zero? Entre em contato.
          </h3>
          <p className="mt-1 max-w-xl text-sm leading-6 text-slate-700">
            Envie sua vaga de interesse e seu currículo atual — devolvemos uma
            versão adaptada, ou construímos um do zero para você, aumentando suas chances de ser chamado para a entrevista.
          </p>
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-col items-center gap-2 sm:w-auto">
        <Link
          href={href}
          className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:from-blue-800 hover:to-blue-700 sm:w-auto"
        >
          Adaptar meu currículo
        </Link>

        <p className="text-xs font-bold text-blue-700">
          {siteConfig.precoCurriculo} via Pix
        </p>
      </div>
    </div>
  );
}
