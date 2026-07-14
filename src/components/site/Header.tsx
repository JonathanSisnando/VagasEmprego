import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";

import { SITE_NOME } from "@/lib/site-config";

const NAV = [
  { to: "/vagas", label: "Vagas" },
  { to: "/adaptar-curriculo", label: "Currículo" },
  { to: "/enviar-vaga", label: "Enviar vaga" },
  { to: "/sobre", label: "Sobre" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-black/5 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <h1 className="text-base font-bold uppercase tracking-tight font-mono text-foreground">
            Vagas <span className="text-primary">Manaus</span> Hoje
          </h1>
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary font-mono"
                activeProps={{ className: "text-primary" }}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={toggleDark}
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:text-primary"
              aria-label={dark ? "Modo claro" : "Modo escuro"}
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
          </li>
        </ul>

        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          className="grid size-11 place-items-center rounded-sm text-foreground md:hidden"
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
                  className="block py-3 text-sm font-medium text-foreground font-mono uppercase tracking-wider"
                  activeProps={{ className: "text-primary" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="border-t border-black/5 py-3">
              <button
                type="button"
                onClick={toggleDark}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground font-mono uppercase tracking-wider"
              >
                {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                {dark ? "Modo claro" : "Modo escuro"}
              </button>
            </li>
          </ul>
        </div>
      ) : null}
    </nav>
  );
}
