import { useEffect, useRef, useState, useCallback } from "react";
import { X, Share2, Link as LinkIcon, Check, Smartphone, Download } from "lucide-react";
import type { Vaga } from "@/lib/vagas-types";
import { fonteCurta, isFromSine } from "./VagaBadges";

type ShareModalProps = {
  vaga: Vaga;
  isOpen: boolean;
  onClose: () => void;
};

function montarTextoCompartilhamento(vaga: Vaga): string {
  const empresa = vaga.empresa !== "Não informado" ? vaga.empresa : "";
  const empresaLinha = empresa
    ? `🏢 ${empresa} • ${vaga.cidade}/${vaga.estado}`
    : `🏢 ${vaga.cidade}/${vaga.estado}`;
  const vagasNum =
    vaga.quantidadeVagas && vaga.quantidadeVagas > 1 ? `${vaga.quantidadeVagas} vagas` : "1 vaga";
  return `🔎 Vaga: ${vaga.titulo}\n${empresaLinha}\n📋 ${vaga.categoria} • ${vagasNum}\n👉 ${vaga.linkFonte}`;
}

function montarLinkWhatsApp(vaga: Vaga): string {
  const texto = montarTextoCompartilhamento(vaga);
  return `https://wa.me/?text=${encodeURIComponent(texto)}`;
}

function montarTextoCopiado(vaga: Vaga): string {
  const texto = montarTextoCompartilhamento(vaga);
  return texto;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

function hasNativeShare() {
  return typeof navigator !== "undefined" && !!navigator.share;
}

export function ShareModal({ vaga, isOpen, onClose }: ShareModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);
  const isMobile = useIsMobile();
  const [useNativeShare, setUseNativeShare] = useState(false);

  useEffect(() => {
    setUseNativeShare(hasNativeShare());
  }, []);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setTimeout(() => {
        const closeBtn = dialogRef.current?.querySelector<HTMLButtonElement>("[data-close]");
        closeBtn?.focus();
      }, 50);
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(montarTextoCopiado(vaga));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = montarTextoCopiado(vaga);
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [vaga]);

  const handleNativeShare = useCallback(async () => {
    try {
      await navigator.share({
        title: vaga.titulo,
        text: montarTextoCompartilhamento(vaga),
        url: vaga.linkFonte,
      });
    } catch {
      // usuário cancelou ou erro
    }
  }, [vaga]);

  const handleDownloadImage = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1080, 1080);

    ctx.fillStyle = "#1e40af";
    ctx.font = "bold 36px sans-serif";
    ctx.fillText(fonteCurta(vaga), 60, 120);

    ctx.fillStyle = "#111827";
    ctx.font = "bold 52px sans-serif";
    const words = vaga.titulo.split(" ");
    let line = "";
    let y = 220;
    for (const word of words) {
      const testLine = line + word + " ";
      if (ctx.measureText(testLine).width > 900 && line) {
        ctx.fillText(line.trim(), 60, y);
        line = word + " ";
        y += 65;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), 60, y);

    ctx.fillStyle = "#6b7280";
    ctx.font = "32px sans-serif";
    const empresa = vaga.empresa !== "Não informado" ? `${vaga.empresa} • ` : "";
    ctx.fillText(`${empresa}${vaga.cidade}, ${vaga.estado}`, 60, y + 80);

    ctx.fillStyle = "#e8ecf1";
    ctx.fillRect(60, y + 110, 400, 48);
    ctx.fillStyle = "#475569";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText(vaga.categoria.toUpperCase(), 80, y + 142);

    ctx.fillStyle = "#9ca3af";
    ctx.font = "24px sans-serif";
    ctx.fillText("Vagas Manaus Hoje", 60, 1020);

    const link = document.createElement("a");
    link.download = `vaga-${vaga.slug}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [vaga]);

  if (!isOpen) return null;

  const fonte = fonteCurta(vaga);
  const sine = isFromSine(vaga);
  const vagasNum =
    vaga.quantidadeVagas && vaga.quantidadeVagas > 1 ? `${vaga.quantidadeVagas} vagas` : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Compartilhar vaga"
    >
      <div
        ref={dialogRef}
        className={`relative w-full bg-white shadow-xl transition-all duration-300 ${
          isMobile
            ? "max-h-[90vh] overflow-y-auto rounded-t-2xl animate-slide-up"
            : "max-w-lg rounded-2xl animate-scale-in"
        }`}
      >
        <button
          data-close
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full p-2 text-muted-foreground transition-colors hover:bg-slate-100"
          aria-label="Fechar"
        >
          <X className="size-5" />
        </button>

        <div className="p-5 pb-6">
          <div className="mb-4 flex items-center gap-2">
            <Share2 className="size-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Compartilhar vaga</h2>
          </div>

          {/* Preview card */}
          <div className="mb-5 overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
            <div className="border-l-4 border-l-primary p-4">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold uppercase tracking-wider font-mono ${
                    sine ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {fonte}
                </span>
                {sine && (
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                    OFICIAL
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-xl font-bold leading-tight text-foreground">
                {vaga.titulo}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {vaga.empresa !== "Não informado" ? `${vaga.empresa} • ` : ""}
                {vaga.cidade}, {vaga.estado}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase text-slate-600">
                  {vaga.categoria}
                </span>
                {vagasNum && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase text-slate-600">
                    {vagasNum}
                  </span>
                )}
                {vaga.escolaridade && vaga.escolaridade !== "Não informado" && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase text-slate-600">
                    {vaga.escolaridade}
                  </span>
                )}
              </div>
            </div>
            <div className="border-t border-black/5 bg-slate-50 px-4 py-2 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Vagas Manaus Hoje
            </div>
          </div>

          {/* Botões de compartilhamento */}
          {useNativeShare ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleNativeShare}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Smartphone className="size-5" />
                Compartilhar via sistema
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-bold text-foreground transition-colors hover:bg-slate-50"
              >
                {copied ? (
                  <>
                    <Check className="size-5 text-green-500" />
                    Link copiado!
                  </>
                ) : (
                  <>
                    <LinkIcon className="size-5" />
                    Copiar link
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {/* WhatsApp */}
              <a
                href={montarLinkWhatsApp(vaga)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 rounded-xl border border-black/5 bg-white p-4 transition-colors hover:bg-green-50"
              >
                <div className="flex size-12 items-center justify-center rounded-full bg-[#25D366] text-white">
                  <svg viewBox="0 0 24 24" className="size-6 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-foreground">WhatsApp</span>
              </a>

              {/* Instagram (gerar imagem) */}
              <button
                type="button"
                onClick={handleDownloadImage}
                className="flex flex-col items-center gap-2 rounded-xl border border-black/5 bg-white p-4 transition-colors hover:bg-pink-50"
              >
                <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white">
                  <svg viewBox="0 0 24 24" className="size-6 fill-current">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-foreground">Baixar imagem</span>
              </button>

              {/* Copiar link */}
              <button
                type="button"
                onClick={handleCopy}
                className="flex flex-col items-center gap-2 rounded-xl border border-black/5 bg-white p-4 transition-colors hover:bg-slate-50"
              >
                <div className="flex size-12 items-center justify-center rounded-full bg-slate-800 text-white">
                  {copied ? <Check className="size-5" /> : <LinkIcon className="size-5" />}
                </div>
                <span className="text-xs font-bold text-foreground">
                  {copied ? "Copiado!" : "Copiar link"}
                </span>
              </button>
            </div>
          )}

          {/* Link completo */}
          <a
            href={vaga.linkFonte}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Ver informações completas
          </a>
        </div>
      </div>
    </div>
  );
}
