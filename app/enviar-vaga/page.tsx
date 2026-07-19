import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "../../config/site";
import { TrackedActionLink } from "../../components/TrackedActionLink";

export const metadata: Metadata = {
  title: "Enviar vaga | Vagas Manaus Hoje",
  description:
    "Envie uma oportunidade de emprego para divulgação no Vagas Manaus Hoje.",
};

export default function EnviarVagaPage() {


  const mensagem = encodeURIComponent(`Olá! Quero divulgar uma vaga no site ${siteConfig.nome}.

Cargo:
Empresa:
Cidade/Bairro:
Salário:
Tipo de contrato:
Modalidade:
Escolaridade:
Experiência:
Requisitos:
Benefícios:
Forma de candidatura:
Fonte ou link oficial da vaga:`);

const linkWhatsApp = `https://wa.me/${siteConfig.whatsapp}?text=${mensagem}`;

  const informacoesNecessarias = [
    "Título da vaga",
    "Nome da empresa, se puder divulgar",
    "Cidade e bairro",
    "Salário, se informado",
    "Tipo de contrato",
    "Modalidade: presencial, remoto ou híbrido",
    "Escolaridade exigida",
    "Experiência necessária",
    "Requisitos da vaga",
    "Benefícios",
    "Forma de candidatura",
    "Fonte ou link oficial da vaga",
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
              Divulgue uma oportunidade
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              Enviar vaga
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Tem uma vaga de emprego em Manaus para divulgar? Envie as
              informações principais pelo WhatsApp para análise antes da
              publicação.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Como funciona
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-3xl font-black text-blue-700">1</p>
                <h3 className="mt-3 font-black text-slate-950">
                  Envie os dados
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Informe cargo, local, requisitos, benefícios e forma de
                  candidatura.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-3xl font-black text-blue-700">2</p>
                <h3 className="mt-3 font-black text-slate-950">
                  A vaga é analisada
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  As informações são conferidas para evitar publicações
                  incompletas ou suspeitas.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-3xl font-black text-blue-700">3</p>
                <h3 className="mt-3 font-black text-slate-950">
                  Publicação no site
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Se estiver tudo certo, a vaga pode ser cadastrada na
                  plataforma.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Informações necessárias
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Para facilitar a divulgação, envie o máximo possível das
              informações abaixo.
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {informacoesNecessarias.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-700"
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-700" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-xl font-black text-amber-900">
              Aviso importante
            </h2>

            <p className="mt-3 leading-7 text-amber-900">
              O Vagas Manaus Hoje é uma central independente de divulgação. A
              publicação de uma vaga não significa vínculo com a empresa
              contratante. Sempre confira a fonte oficial antes de enviar dados
              pessoais ou se candidatar.
            </p>
          </article>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-xl font-black text-slate-950">
              Enviar pelo WhatsApp
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Clique no botão abaixo para abrir o WhatsApp com um modelo de
              mensagem pronto para preencher.
            </p>

            <TrackedActionLink
              href={linkWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              evento="click_enviar_vaga"
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-green-600 px-5 py-4 text-sm font-black text-white shadow-sm transition hover:bg-green-700"
            >
              Enviar vaga pelo WhatsApp
            </TrackedActionLink>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-900">
                Antes de enviar
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Evite mandar prints incompletos. Sempre que possível, envie o
                texto da vaga e o link da fonte oficial.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}