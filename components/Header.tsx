"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Briefcase className="size-5 text-blue-700" aria-hidden="true" />
            Vagas Manaus Hoje
          </Link>

          <button
            type="button"
            onClick={() => setMenuAberto(!menuAberto)}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 md:hidden"
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuAberto}
          >
            <span className="text-2xl leading-none">
              {menuAberto ? "×" : "☰"}
            </span>
          </button>

          {menuAberto && (
            <div
              className="fixed inset-0 z-30 bg-black/20 md:hidden"
              onClick={() => setMenuAberto(false)}
              aria-hidden="true"
            />
          )}

          <nav className="hidden items-center gap-4 text-sm font-medium text-slate-700 md:flex">
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
          </nav>
        </div>

        {menuAberto && (
          <nav className="relative z-40 mt-4 flex flex-col gap-3 border-t border-slate-100 bg-white pt-4 text-sm font-medium text-slate-700 md:hidden">
            <Link
              href="/vagas"
              onClick={() => setMenuAberto(false)}
              className="rounded-lg px-2 py-2 hover:bg-slate-50 hover:text-blue-700"
            >
              Vagas
            </Link>

            <Link
              href="/sobre"
              onClick={() => setMenuAberto(false)}
              className="rounded-lg px-2 py-2 hover:bg-slate-50 hover:text-blue-700"
            >
              Sobre
            </Link>

            <Link
              href="/enviar-vaga"
              onClick={() => setMenuAberto(false)}
              className="rounded-lg px-2 py-2 hover:bg-slate-50 hover:text-blue-700"
            >
              Enviar vaga
            </Link>

            <Link
              href="/contato"
              onClick={() => setMenuAberto(false)}
              className="rounded-lg px-2 py-2 hover:bg-slate-50 hover:text-blue-700"
            >
              Contato
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}