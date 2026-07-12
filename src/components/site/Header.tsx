import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { SITE_NOME } from "@/lib/site-config";

const NAV = [
  { to: "/vagas", label: "Vagas" },
  { to: "/adaptar-curriculo", label: "Currículo" },
  { to: "/enviar-vaga", label: "Enviar vaga" },
  { to: "/sobre", label: "Sobre" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-black/5 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <div className="grid size-8 place-items-center rounded-lg bg-primary font-black text-primary-foreground">
            M
          </div>
          <span className="text-base font-extrabold tracking-tight">
            {SITE_NOME.split(" ").slice(0, 2).join(" ")}{" "}
            <span className="text-primary">Hoje</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                activeProps={{ className: "text-primary" }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          className="grid size-11 place-items-center rounded-lg text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-black/5 bg-background md:hidden">
          <ul className="mx-auto flex max-w-5xl flex-col px-4 py-2">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base font-medium text-foreground"
                  activeProps={{ className: "text-primary" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </nav>
  );
}