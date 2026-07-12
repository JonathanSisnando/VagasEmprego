import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre o Vagas Manaus Hoje" },
      { name: "description", content: "O Vagas Manaus Hoje é uma central independente que agrega vagas do Sine Manaus e SETEMP em um só lugar." },
      { property: "og:title", content: "Sobre o Vagas Manaus Hoje" },
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
          <h1 className="text-3xl font-black tracking-tight">Sobre o projeto</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Somos uma central independente de divulgação de vagas. Nosso
            objetivo é reduzir o tempo entre quem procura emprego em Manaus e
            as vagas que já existem nas fontes oficiais.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <section>
          <h2 className="text-lg font-extrabold">De onde vêm as vagas</h2>
          <ul className="mt-3 space-y-3 text-sm">
            <li className="rounded-2xl border border-black/5 bg-white p-4">
              <p className="font-bold">Sine Manaus (Prefeitura de Manaus)</p>
              <p className="mt-1 text-muted-foreground">
                Boletins oficiais de vagas publicados pela Prefeitura de Manaus.
                A candidatura é presencial em qualquer posto do Sine.
              </p>
            </li>
            <li className="rounded-2xl border border-black/5 bg-white p-4">
              <p className="font-bold">SETEMP / Portal do Trabalhador do Amazonas</p>
              <p className="mt-1 text-muted-foreground">
                Vagas do estado inteiro, publicadas pela Secretaria de Estado do
                Trabalho. A candidatura é feita online no portal oficial.
              </p>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-extrabold">O que somos e o que não somos</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Não temos vínculo com a Prefeitura de Manaus, com o Governo do
            Estado, com o Sine ou com a SETEMP. Não somos uma agência de
            emprego. Não vendemos vagas. A única cobrança do site é o serviço
            opcional de{" "}
            <Link to="/adaptar-curriculo" className="underline">montagem/adaptação de currículo</Link>, feito por WhatsApp.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-extrabold">Confiança</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Toda vaga publicada aqui aponta para a sua fonte oficial. Assim
            você pode conferir antes de se candidatar. Vagas de emprego são
            gratuitas — se pedirem pagamento, é golpe.
          </p>
        </section>
      </div>
    </SiteLayout>
  );
}