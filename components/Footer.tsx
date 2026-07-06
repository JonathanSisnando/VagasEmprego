import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
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