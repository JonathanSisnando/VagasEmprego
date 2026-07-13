import { useRef, useEffect, useState, useCallback } from "react";
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  GraduationCap,
  Clock,
  Calendar,
  ExternalLink,
  Share2,
} from "lucide-react";

import type { Vaga } from "@/lib/vagas-types";

import { fonteCurta, isFromSetemp, isFromSine, VagaBadges } from "./VagaBadges";
import { ShareModal } from "./ShareModal";

function tempoRelativo(data: string): string {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  const diff = Math.round((hoje.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return "Hoje";
  if (diff === 1) return "Ontem";
  if (diff < 7) return `Há ${diff} dias`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function formatarData(data: string): string {
  const d = new Date(data);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function temInformacao(valor: string | undefined | null): boolean {
  return !!valor && valor !== "Não informado" && valor.trim() !== "";
}

type VagaCardProps = {
  vaga: Vaga;
  isOpen: boolean;
  onToggle: () => void;
};

export function VagaCard({ vaga, isOpen, onToggle }: VagaCardProps) {
  const sine = isFromSine(vaga);
  const setemp = isFromSetemp(vaga);
  const borda = sine ? "border-l-primary" : setemp ? "border-l-slate-300" : "border-l-slate-300";
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen, vaga]);

  const handleShareClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShareOpen(true);
  }, []);

  const tipoCadastro = sine ? "presencial" : "online";
  const tipoFonte = sine || setemp ? "oficial" : "externa";

  return (
    <>
      <div
        className={`animate-slide-up border-y border-r border-black/5 bg-white transition-colors hover:bg-[#fafbfc] active:bg-[#f1f5f9] border-l-4 ${borda}`}
      >
        <button
          type="button"
          onClick={onToggle}
          className="w-full p-4 text-left"
          aria-expanded={isOpen}
        >
          <div className="flex items-start justify-between gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider font-mono ${sine ? "text-primary" : "text-muted-foreground"}`}
            >
              {fonteCurta(vaga)}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-muted-foreground">
                {tempoRelativo(vaga.dataPublicacao)}
              </span>
              {isOpen ? (
                <ChevronUp className="size-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="size-4 text-muted-foreground" />
              )}
            </div>
          </div>

          <h3 className="mt-1 text-base font-semibold leading-tight text-foreground">
            {vaga.titulo}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {vaga.empresa} •{" "}
            {vaga.bairro && vaga.bairro !== "Não informado"
              ? vaga.bairro
              : `${vaga.cidade}, ${vaga.estado}`}
          </p>

          <div className="mt-3">
            <VagaBadges vaga={vaga} />
          </div>
        </button>

        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: isOpen ? `${contentHeight}px` : "0px",
            opacity: isOpen ? 1 : 0,
          }}
        >
          <div ref={contentRef} className="border-t border-black/5 px-4 pb-4 pt-3">
            <div className="mb-3 rounded-lg bg-blue-50 p-3">
              <p className="text-sm font-bold text-blue-700">
                Cadastro: {tipoCadastro} no {fonteCurta(vaga)}
              </p>
            </div>

            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>
                  {vaga.bairro && vaga.bairro !== "Não informado"
                    ? `${vaga.bairro}, ${vaga.cidade}, ${vaga.estado}`
                    : `${vaga.cidade}, ${vaga.estado}`}
                </span>
              </li>
              {temInformacao(vaga.escolaridade) && (
                <li className="flex items-start gap-2 text-sm text-foreground">
                  <GraduationCap className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span>{vaga.escolaridade}</span>
                </li>
              )}
              {temInformacao(vaga.experiencia) && (
                <li className="flex items-start gap-2 text-sm text-foreground">
                  <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span>{vaga.experiencia}</span>
                </li>
              )}
              <li className="flex items-start gap-2 text-sm text-foreground">
                <Calendar className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>Publicado em {formatarData(vaga.dataPublicacao)}</span>
              </li>
            </ul>

            <div className="mt-3 flex gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                {sine ? "Presencial" : "Online"}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {tipoFonte === "oficial" ? "Fonte oficial" : "Fonte externa"}
              </span>
            </div>

            <div className="mt-4 flex gap-3">
              <a
                href={vaga.linkFonte}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Ver detalhes da vaga
                <ExternalLink className="size-4" />
              </a>
              <button
                type="button"
                onClick={handleShareClick}
                className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-bold text-foreground transition-colors hover:bg-slate-50"
              >
                <Share2 className="size-4" />
                <span className="hidden sm:inline">Compartilhar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ShareModal vaga={vaga} isOpen={shareOpen} onClose={() => setShareOpen(false)} />
    </>
  );
}

export function VagaCardSkeleton() {
  return (
    <div className="border-y border-r border-l-4 border-l-slate-200 border-black/5 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="h-3 w-12 rounded bg-slate-100" />
        <div className="h-3 w-14 rounded bg-slate-100" />
      </div>
      <div className="mt-2 h-5 w-3/4 rounded bg-slate-100" />
      <div className="mt-2 h-3.5 w-1/2 rounded bg-slate-100" />
      <div className="mt-3 flex gap-2">
        <div className="h-5 w-20 rounded bg-slate-100" />
        <div className="h-5 w-16 rounded bg-slate-100" />
      </div>
    </div>
  );
}
