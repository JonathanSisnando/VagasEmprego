import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "../../config/site";

export const metadata: Metadata = {
  title: "Montar ou adaptar currículo | Vagas Manaus Hoje",
  description:
    "Não tem currículo? A gente monta um do zero. Já tem? Adaptamos para destacar o que a vaga de interesse pede.",
};

type AdaptarCurriculoPageProps = {
  searchParams: Promise<{ vaga?: string; fonte?: string }>;
};

export default async function AdaptarCurriculoPage({
  searchParams,
}: AdaptarCurriculoPageProps) {
  const { vaga, fonte } = await searchParams;

  const mensagem = vaga
    ? encodeURIComponent(
        `Olá! Quero montar ou adaptar meu currículo para: ${vaga}${
          fonte ? ` — ${fonte}` : ""
        }.
Já tenho currículo (anexo) / Não tenho currículo ainda.`
      )
    : encodeURIComponent(
        `Olá! Quero montar ou adaptar meu currículo no site ${siteConfig.nome}.

Vaga de interesse (link ou nome/empresa):
Já tenho currículo (anexo) / Não tenho currículo ainda.`
      );

  const linkWhatsApp = `https://wa.me/${siteConfig.whatsapp}?text=${mensagem}`;

  const informacoesNecessarias = [
    "Link ou nome da vaga de interesse",
    "Empresa e cidade da vaga, se souber",
    "Seu currículo atual, se já tiver (PDF ou Word)",
    "Áreas de experiência que quer destacar",
    "Alguma preferência de formatação, se tiver",
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
              Serviço extra
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              Monte ou adapte seu currículo
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Não tem currículo ainda? A gente monta um do zero. Já tem um?
              Enviamos a vaga de interesse pelo WhatsApp e devolvemos uma
              versão adaptada, destacando o que essa vaga específica pede.
            </p>

            <p className="mt-4 inline-flex w-fit items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-black text-blue-700">
              {siteConfig.precoCurriculo} via Pix
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
                  Envie a vaga
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Mande o link da vaga (ou nome e empresa). Se já tiver
                  currículo, anexe em PDF ou Word.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-3xl font-black text-blue-700">2</p>
                <h3 className="mt-3 font-black text-slate-950">
                  Montamos ou adaptamos
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Sem currículo, montamos um do zero. Com currículo,
                  destacamos as experiências que mais combinam com a vaga.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-3xl font-black text-blue-700">3</p>
                <h3 className="mt-3 font-black text-slate-950">
                  Você recebe pronto
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  A versão adaptada volta pra você pelo mesmo WhatsApp, pronta
                  pra enviar na candidatura.
                </p>
              </div>
            </div>
          </article>

          {vaga && (
            <article className="rounded-3xl border border-green-200 bg-green-50 p-6 shadow-sm">
              <h2 className="text-xl font-black text-green-900">
                Vaga pré-selecionada
              </h2>

              <p className="mt-4 leading-7 text-green-800">
                Você veio da vaga <strong>{vaga}</strong>
                {fonte && <> — {fonte}</>}. Ao clicar no botão do WhatsApp, a
                mensagem já vai com o nome dessa vaga preenchido. Se já tiver
                currículo, anexe; se não tiver, é só avisar.
              </p>

              <div className="mt-4 rounded-2xl border border-green-200 bg-white p-4">
                <p className="text-sm leading-6 text-green-800">
                  <strong>Mensagem que será enviada:</strong>
                  <br />
                  <span className="text-green-700">
                    &ldquo;Olá! Quero montar ou adaptar meu currículo para:{" "}
                    {vaga}
                    {fonte && ` — ${fonte}`}. Já tenho currículo (anexo) / Não
                    tenho currículo ainda.&rdquo;
                  </span>
                </p>
              </div>
            </article>
          )}

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Informações necessárias
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Para agilizar a montagem ou adaptação, envie o máximo possível
              das informações abaixo.
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
              O Vagas Manaus Hoje é uma central independente de divulgação.
              Montar ou adaptar o currículo não garante contratação nem
              vínculo com a empresa da vaga. Sempre confira a fonte oficial
              antes de enviar seus dados ou se candidatar.
            </p>
          </article>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-xl font-black text-slate-950">
              Enviar pelo WhatsApp
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Clique no botão abaixo para abrir o WhatsApp com uma mensagem
              pronta para preencher.
            </p>

            <p className="mt-4 text-sm font-black text-slate-900">
              Valor: {siteConfig.precoCurriculo}, pago via Pix
            </p>

            <a
              href={linkWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-green-600 px-5 py-4 text-sm font-black text-white shadow-sm transition hover:bg-green-700"
            >
              Montar ou adaptar pelo WhatsApp
            </a>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-900">
                Antes de enviar
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Tenha em mãos o link ou nome da vaga de interesse. Se já
                tiver currículo (PDF ou Word), separe pra anexar.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
