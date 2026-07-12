import { createFileRoute } from "@tanstack/react-router";

import { AntiFraudNotice } from "@/components/site/AntiFraudNotice";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => ({
    meta: [
      { title: "Política de privacidade — Vagas Manaus Hoje" },
      { name: "description", content: "Como o Vagas Manaus Hoje trata dados e por que é uma central independente sem vínculo com órgãos públicos." },
      { property: "og:title", content: "Política de privacidade" },
      { property: "og:description", content: "Nossas práticas e o aviso antifraude." },
    ],
  }),
  component: PoliticaPage,
});

function PoliticaPage() {
  return (
    <SiteLayout>
      <header className="border-b border-black/5 bg-white px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-black tracking-tight">Política de privacidade</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <AntiFraudNotice />

        <section className="prose prose-sm max-w-none">
          <h2 className="text-lg font-extrabold">Independência</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            O Vagas Manaus Hoje é uma central independente de divulgação de
            vagas. Não possuímos vínculo com a Prefeitura de Manaus, com o
            Governo do Amazonas, com o Sine ou com a SETEMP. Todas as vagas
            apontam para sua fonte oficial.
          </p>

          <h2 className="mt-6 text-lg font-extrabold">Dados coletados</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            O site não coleta cadastro de candidatos. Usamos apenas métricas
            anônimas de navegação para entender quais vagas são mais úteis.
          </p>

          <h2 className="mt-6 text-lg font-extrabold">Serviço de currículo</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ao contratar o serviço de currículo, as informações que você envia
            pelo WhatsApp são usadas exclusivamente para montar seu currículo,
            e não são compartilhadas com empresas.
          </p>

          <h2 className="mt-6 text-lg font-extrabold">Contato</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Dúvidas sobre privacidade podem ser enviadas pelo nosso canal de
            contato.
          </p>
        </section>
      </div>
    </SiteLayout>
  );
}