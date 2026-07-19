import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "../../config/site";

export const metadata: Metadata = {
  title: "Política de Privacidade | Vagas Manaus Hoje",
  description:
    "Veja a política de privacidade do Vagas Manaus Hoje, incluindo informações sobre contato, links externos, envio de vagas e segurança.",
};

export default function PoliticaDePrivacidadePage() {

  const secoes = [
    {
      titulo: "1. Sobre esta política",
      texto: [
        "Esta Política de Privacidade explica como o Vagas Manaus Hoje trata informações relacionadas ao uso do site, envio de vagas, contato por WhatsApp, contato por e-mail e acesso a links externos.",
        "O Vagas Manaus Hoje é uma central independente de divulgação e organização de oportunidades de emprego em Manaus.",
      ],
    },
    {
      titulo: "2. Dados que podem ser informados",
      texto: [
        "Ao entrar em contato pelo WhatsApp, e-mail ou formulário externo, você pode informar dados como nome, telefone, e-mail, cargo de interesse, informações de uma vaga ou mensagem enviada voluntariamente.",
        "O site não solicita pagamento, dados bancários, senhas, documentos sensíveis ou informações confidenciais para candidatura.",
      ],
    },
    {
      titulo: "3. Uso das informações",
      texto: [
        "As informações enviadas podem ser usadas para responder contatos, analisar sugestões de vagas, corrigir informações publicadas, remover oportunidades encerradas ou melhorar a organização do site.",
        "Informações de vagas enviadas para divulgação podem ser adaptadas e organizadas antes da publicação, mantendo o foco na clareza para os candidatos.",
      ],
    },
    {
      titulo: "4. WhatsApp e e-mail",
      texto: [
        "Ao clicar em botões de WhatsApp ou e-mail, você será direcionado para serviços externos ao Vagas Manaus Hoje.",
        "As conversas realizadas pelo WhatsApp ou e-mail seguem também as políticas e regras dessas respectivas plataformas.",
      ],
    },
    {
      titulo: "5. Links externos",
      texto: [
        "O site pode conter links para fontes oficiais, páginas de empresas, sites de candidatura, redes sociais ou outros canais externos.",
        "O Vagas Manaus Hoje não controla o conteúdo, segurança, políticas de privacidade ou funcionamento desses sites externos.",
      ],
    },
    {
      titulo: "6. Divulgação de vagas",
      texto: [
        "As vagas publicadas podem ter origem em fontes públicas, divulgações de empresas, pessoas, canais oficiais ou sugestões recebidas.",
        "A publicação de uma vaga no site não significa vínculo empregatício, parceria comercial ou garantia de contratação.",
      ],
    },
    {
      titulo: "7. Segurança",
      texto: [
        "Recomendamos que candidatos sempre confirmem a vaga na fonte oficial antes de enviar dados pessoais ou participar de qualquer processo seletivo.",
        "Nunca pague para participar de entrevista, seleção, cadastro, treinamento ou promessa de contratação.",
      ],
    },
    {
      titulo: "8. Alterações nesta política",
      texto: [
        "Esta política pode ser atualizada a qualquer momento para refletir melhorias no site, mudanças na forma de contato ou ajustes nas informações apresentadas.",
        "A versão mais recente estará sempre disponível nesta página.",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <Link
            href="/"
            className="text-sm font-bold text-blue-700 hover:text-blue-800"
          >
            ← Voltar para início
          </Link>

          <div className="mt-8 max-w-3xl">
            <p className="text-sm font-black uppercase tracking-wide text-blue-700">
              Informações legais
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              Política de Privacidade
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Esta página explica como o Vagas Manaus Hoje lida com informações
              enviadas por usuários, contatos, sugestões de vagas e links
              externos.
            </p>

            <p className="mt-4 text-sm font-semibold text-slate-500">
              Última atualização: 12/06/2026
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <article className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-xl font-black text-amber-900">
              Aviso importante
            </h2>

            <p className="mt-3 leading-7 text-amber-900">
              Este texto é um modelo informativo inicial para o site. Ele não
              substitui orientação jurídica profissional. Caso o projeto cresça,
              receba muitos dados ou use formulários próprios, o ideal é revisar
              esta política com apoio especializado.
            </p>
          </article>

          {secoes.map((secao) => (
            <article
              key={secao.titulo}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-2xl font-black text-slate-950">
                {secao.titulo}
              </h2>

              <div className="mt-4 space-y-4">
                {secao.texto.map((paragrafo) => (
                  <p key={paragrafo} className="leading-8 text-slate-700">
                    {paragrafo}
                  </p>
                ))}
              </div>
            </article>
          ))}

          <article className="rounded-3xl border border-red-100 bg-red-50 p-6">
            <h2 className="text-xl font-black text-red-800">
              Alerta contra golpes
            </h2>

            <p className="mt-3 leading-7 text-red-700">
              O Vagas Manaus Hoje não cobra valores para divulgar vagas ou para
              candidatos se candidatarem. Desconfie de qualquer pessoa ou empresa
              que solicite pagamento para garantir entrevista, treinamento,
              cadastro ou contratação.
            </p>
          </article>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-xl font-black text-slate-950">
              Resumo rápido
            </h2>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-black text-slate-900">
                  Não cobramos candidatura
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Nenhum candidato deve pagar para participar de processos
                  seletivos divulgados no site.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-black text-slate-900">
                  Links externos
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Algumas candidaturas podem acontecer fora do Vagas Manaus
                  Hoje, em sites ou canais de terceiros.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-black text-slate-900">
                  Confirme a fonte
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Sempre verifique a origem da vaga antes de enviar informações
                  pessoais.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3 border-t border-slate-100 pt-6">
              <Link
                href="/contato"
                className="flex w-full items-center justify-center rounded-xl bg-blue-700 px-5 py-4 text-sm font-black text-white shadow-sm transition hover:bg-blue-800"
              >
                Entrar em contato
              </Link>

              <Link
                href="/vagas"
                className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-800 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                Ver vagas disponíveis
              </Link>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-900">
                E-mail para contato
              </p>

              <p className="mt-2 break-all text-sm leading-6 text-slate-600">
                {siteConfig.email}
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}