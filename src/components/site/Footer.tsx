import { Link } from "@tanstack/react-router";

import { SITE_NOME } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-black/5 bg-white pb-28 pt-10 md:pb-10">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="max-w-sm">
            <p className="text-sm font-extrabold tracking-tight text-foreground">
              {SITE_NOME}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Central independente de divulgação. Não possuímos vínculo com a
              Prefeitura de Manaus, o Governo do Amazonas, o Sine ou a SETEMP.
            </p>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
              Navegar
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/vagas" className="hover:text-primary">Todas as vagas</Link></li>
              <li><Link to="/adaptar-curriculo" className="hover:text-primary">Montar currículo</Link></li>
              <li><Link to="/enviar-vaga" className="hover:text-primary">Enviar uma vaga</Link></li>
              <li><Link to="/parceiros" className="hover:text-primary">Parceiros</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
              Institucional
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/sobre" className="hover:text-primary">Sobre o projeto</Link></li>
              <li><Link to="/contato" className="hover:text-primary">Contato</Link></li>
              <li><Link to="/politica-de-privacidade" className="hover:text-primary">Política de privacidade</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-black/5 pt-6 text-[11px] uppercase tracking-wider text-muted-foreground">
          © {new Date().getFullYear()} {SITE_NOME} · Vagas atualizadas via Sine Manaus e SETEMP
        </p>
      </div>
    </footer>
  );
}