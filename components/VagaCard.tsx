import Link from "next/link";
import type { Vaga } from "../data/vagas";

type VagaCardProps = {
  vaga: Vaga;
};

export function VagaCard({ vaga }: VagaCardProps) {
  const ehVagaSine =
    String(vaga.id).startsWith("sine-") ||
    normalizar(vaga.fonte).includes("sine manaus");

  const bairroInformado =
    vaga.bairro && normalizar(vaga.bairro) !== "nao informado";

  const semExperiencia =
    normalizar(vaga.experiencia).includes("nao e necessario") ||
    normalizar(vaga.experiencia).includes("sem experiencia") ||
    normalizar(vaga.experiencia).includes("nao exige") ||
    normalizar(vaga.experiencia).includes("nao necessita");

  const ensinoMedio = normalizar(vaga.escolaridade).includes("ensino medio");

  const quantidadeVagas = vaga.quantidadeVagas ?? 1;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {ehVagaSine && (
          <span className="rounded-full bg-blue-700 px-3 py-1 text-xs font-black text-white">
            Sine Manaus
          </span>
        )}

        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
          {vaga.categoria}
        </span>

        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
          {quantidadeVagas} vaga{quantidadeVagas > 1 ? "s" : ""}
        </span>

        {vaga.pcd && (
          <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
            PCD
          </span>
        )}

        {semExperiencia && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
            Sem experiência
          </span>
        )}

        {ensinoMedio && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
            Ensino médio
          </span>
        )}
      </div>

      <div className="flex-1">
        <h2 className="text-xl font-black leading-tight text-slate-950 group-hover:text-blue-700">
          {vaga.titulo}
        </h2>

        <p className="mt-2 text-sm font-medium text-slate-500">
          {ehVagaSine ? "Prefeitura de Manaus - Sine Manaus" : vaga.empresa}
        </p>

        {ehVagaSine && (
          <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm font-bold text-blue-900">
              Cadastro: presencial no Sine Manaus
            </p>
          </div>
        )}

        <div className="mt-5 space-y-3 text-sm text-slate-700">
          <p>
            <span className="font-bold text-slate-900">Local:</span>{" "}
            {vaga.cidade}/{vaga.estado}
            {bairroInformado ? ` — ${vaga.bairro}` : ""}
          </p>

          <p>
            <span className="font-bold text-slate-900">Escolaridade:</span>{" "}
            {vaga.escolaridade}
          </p>

          <p>
            <span className="font-bold text-slate-900">Experiência:</span>{" "}
            {vaga.experiencia}
          </p>

          <p>
            <span className="font-bold text-slate-900">Publicado em:</span>{" "}
            {vaga.dataPublicacao}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {vaga.modalidade && (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
              {vaga.modalidade}
            </span>
          )}

          {vaga.tipoContrato && vaga.tipoContrato !== "Não informado" && (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
              {vaga.tipoContrato}
            </span>
          )}

          {ehVagaSine && (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
              Fonte oficial
            </span>
          )}
        </div>
      </div>

      <Link
        href={`/vagas/${vaga.slug}`}
        className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800"
      >
        Ver detalhes da vaga
      </Link>
    </article>
  );
}

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}