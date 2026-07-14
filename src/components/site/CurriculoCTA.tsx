import { Link } from "@tanstack/react-router";

import { PRECO_CURRICULO_MAX, PRECO_CURRICULO_MIN } from "@/lib/site-config";

export function CurriculoCTA({ vagaTitulo }: { vagaTitulo?: string }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white">
      <span className="inline-block rounded bg-primary px-2 py-1 text-[10px] font-black uppercase tracking-wider">
        Serviço opcional
      </span>
      <h2 className="mt-3 text-xl font-extrabold leading-tight">
        Precisa de currículo pronto para esta vaga?
      </h2>
      <p className="mt-2 text-pretty text-sm text-slate-300">
        Não tem currículo ou quer adaptar para esta vaga específica? Nossa equipe monta e devolve
        tudo pelo WhatsApp.
      </p>
      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase text-slate-400">A partir de</p>
          <p className="text-2xl font-black">R$ {PRECO_CURRICULO_MIN},00</p>
          <p className="text-[11px] text-slate-400">até R$ {PRECO_CURRICULO_MAX},00 · Pix</p>
        </div>
        <Link
          to="/adaptar-curriculo"
          search={vagaTitulo ? { vaga: vagaTitulo } : {}}
          className="rounded-xl bg-whatsapp px-5 py-3 text-sm font-black text-whatsapp-foreground shadow-lg shadow-whatsapp/25"
        >
          Quero meu currículo
        </Link>
      </div>
    </section>
  );
}
