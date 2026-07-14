import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre | Vagas Manaus Hoje" },
      {
        name: "description",
        content:
          "Conheça o objetivo do Vagas Manaus Hoje, uma central independente de divulgação de oportunidades de emprego em Manaus.",
      },
      { property: "og:title", content: "Sobre | Vagas Manaus Hoje" },
      { property: "og:description", content: "Quem somos e de onde vêm as vagas que publicamos." },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <SiteLayout>
      <header className="border-b border-black/5 bg-white px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <Link to="/" className="text-sm font-bold text-primary hover:text-primary/80">
            ← Voltar para início
          </Link>
          <p className="mt-6 text-xs font-bold uppercase tracking-wider text-primary">
            Sobre o projeto
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
            Sobre o Vagas Manaus Hoje
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            O Vagas Manaus Hoje é uma central independente criada para reunir e organizar
            oportunidades de emprego divulgadas publicamente em Manaus.
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-black/5 bg-white p-6">
            <h2 className="text-lg font-extrabold">Nosso objetivo</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              O objetivo do site é facilitar o acesso a vagas de emprego em Manaus, ajudando
              candidatos a encontrarem oportunidades de forma mais organizada, clara e rápida.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              As vagas são apresentadas com informações como cargo, bairro, escolaridade,
              experiência, requisitos, benefícios e fonte da divulgação, sempre que esses dados
              estiverem disponíveis.
            </p>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-6">
            <h2 className="text-lg font-extrabold">Como as vagas são divulgadas</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-2xl font-black text-primary">1</p>
                <h3 className="mt-2 font-bold">Coleta das informações</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  As oportunidades podem vir de fontes públicas, divulgações de empresas, pessoas
                  ou canais oficiais.
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-2xl font-black text-primary">2</p>
                <h3 className="mt-2 font-bold">Organização dos dados</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  As informações são organizadas por categoria, local, requisitos e forma de
                  candidatura.
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-2xl font-black text-primary">3</p>
                <h3 className="mt-2 font-bold">Publicação no site</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Após análise básica, a vaga pode ser publicada para facilitar o acesso dos
                  candidatos.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-6">
            <h2 className="text-lg font-extrabold">Compromisso com os candidatos</h2>
            <ul className="mt-4 space-y-2">
              {[
                "Organizar vagas de forma simples e acessível.",
                "Informar a fonte da vaga sempre que possível.",
                "Evitar divulgação de oportunidades suspeitas.",
                "Incentivar que o candidato sempre confirme a vaga na fonte oficial.",
              ].map((item) => (
                <li key={item} className="flex gap-3 rounded-xl bg-slate-50 p-3 text-sm">
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-warning/30 bg-warning/10 p-6">
            <h2 className="text-base font-extrabold text-warning">Aviso de responsabilidade</h2>
            <p className="mt-2 text-sm leading-relaxed text-warning/90">
              O Vagas Manaus Hoje não é responsável pelos processos seletivos, contratações,
              entrevistas ou decisões das empresas anunciantes. O site atua como uma central
              independente de divulgação e organização de oportunidades.
            </p>
          </section>

          <section className="rounded-2xl border border-alert/30 bg-alert/10 p-6">
            <h2 className="text-base font-extrabold text-alert">Segurança em primeiro lugar</h2>
            <p className="mt-2 text-sm leading-relaxed text-alert/90">
              Nunca pague para participar de processo seletivo. Desconfie de promessas de
              contratação imediata, cobranças, links suspeitos ou pedidos de dados sensíveis sem
              confirmação da fonte oficial.
            </p>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-black/5 bg-white p-5">
            <h2 className="text-base font-extrabold">Navegue pelo site</h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Acesse as principais áreas do Vagas Manaus Hoje.
            </p>
            <div className="mt-4 space-y-2">
              <Link
                to="/vagas"
                className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
              >
                Ver vagas disponíveis
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/enviar-vaga"
                className="flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-bold text-foreground"
              >
                Enviar uma vaga
              </Link>
              <Link
                to="/contato"
                className="flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-bold text-foreground"
              >
                Entrar em contato
              </Link>
            </div>
            <div className="mt-4 rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-bold">Projeto local</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Criado com foco em oportunidades de emprego para Manaus e região.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </SiteLayout>
  );
}
