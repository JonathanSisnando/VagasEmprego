"use client";

import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-slate-900">
            Vagas Manaus Hoje
          </Link>

          <button
            type="button"
            onClick={() => setMenuAberto(!menuAberto)}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 md:hidden"
            aria-label="Abrir menu"
            aria-expanded={menuAberto}
          >
            <span className="text-2xl leading-none">
              {menuAberto ? "×" : "☰"}
            </span>
          </button>

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
          <nav className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 text-sm font-medium text-slate-700 md:hidden">
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