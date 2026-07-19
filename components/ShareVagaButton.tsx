"use client";

import type { MouseEvent } from "react";
import { Share2 } from "lucide-react";
import { track } from "@vercel/analytics";
import type { Vaga } from "../data/vagas";
import { siteConfig } from "../config/site";
import { formatarData, normalizar } from "../lib/vaga-utils";

type ShareVagaButtonProps = {
  vaga: Vaga;
  fonteLabel: string;
  className?: string;
};

const REGEX_ATIVIDADES = /^atividades?:?\s/i;

function dividirEmItens(texto: string) {
  return texto
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
}

function montarMensagem(vaga: Vaga, fonteLabel: string, url: string) {
  const quantidadeVagas = vaga.quantidadeVagas ?? 1;

  const bairroInformado =
    vaga.bairro && normalizar(vaga.bairro) !== "nao informado";

  const requisitosGerais = vaga.requisitos
    .filter((requisito) => !REGEX_ATIVIDADES.test(requisito))
    .flatMap(dividirEmItens);

  const atividades = vaga.requisitos
    .filter((requisito) => REGEX_ATIVIDADES.test(requisito))
    .flatMap((requisito) =>
      dividirEmItens(requisito.replace(REGEX_ATIVIDADES, ""))
    );

  const descricao =
    vaga.descricao ??
    `Vaga de ${vaga.titulo} divulgada por ${fonteLabel}.`;

  const linhas: string[] = [
    `📌 *${vaga.titulo}*`,
    fonteLabel,
    "",
    "*Informações da vaga*",
    `📍 Local: ${vaga.cidade}/${vaga.estado}${
      bairroInformado ? ` — ${vaga.bairro}` : ""
    }`,
    `🎓 Escolaridade: ${vaga.escolaridade}`,
    `⏱️ Experiência: ${vaga.experiencia}`,
    `💰 Salário: ${vaga.salario}`,
    `📅 Publicado em: ${formatarData(vaga.dataPublicacao)}`,
    `✅ Status: ${vaga.status}`,
  ];

  if (vaga.dataExpiracao) {
    linhas.push(`🗓️ Disponível até: ${formatarData(vaga.dataExpiracao)}`);
  }

  linhas.push(
    `🔢 Quantidade: ${quantidadeVagas} vaga${quantidadeVagas > 1 ? "s" : ""}`
  );

  linhas.push("", "*Descrição*", descricao);

  if (requisitosGerais.length > 0) {
    linhas.push("", "*Requisitos*");
    requisitosGerais.forEach((item) => linhas.push(`• ${item}`));
  }

  if (atividades.length > 0) {
    linhas.push("", "*Atividades*");
    atividades.forEach((item) => linhas.push(`• ${item}`));
  }

  if (vaga.beneficios.length > 0) {
    linhas.push("", "*Benefícios*");
    vaga.beneficios.forEach((item) => linhas.push(`• ${item}`));
  }

  linhas.push("", "Confira mais detalhes e como se candidatar:", url);

  return linhas.join("\n");
}

function abrirCompartilhamentoWhatsapp(texto: string) {
  const link = `https://wa.me/?text=${encodeURIComponent(texto)}`;
  window.open(link, "_blank", "noopener,noreferrer");
}

export function ShareVagaButton({
  vaga,
  fonteLabel,
  className,
}: ShareVagaButtonProps) {
  async function handleShare(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    const url = `${siteConfig.url}/vagas/${vaga.slug}`;
    const texto = montarMensagem(vaga, fonteLabel, url);

    track("click_compartilhar_vaga", {
      vaga: vaga.titulo,
      fonte: vaga.fonte,
    });

    const podeUsarShareNativo =
      typeof navigator !== "undefined" && typeof navigator.share === "function";

    if (podeUsarShareNativo) {
      try {
        // Não envia "url" separado: alguns apps (ex.: WhatsApp) priorizam o
        // campo url e descartam o texto detalhado. O link já está embutido
        // no final de "texto", então title + text cobrem tudo.
        await navigator.share({
          title: `${vaga.titulo} - ${siteConfig.nome}`,
          text: texto,
        });
        return;
      } catch (error) {
        // Usuário cancelou o compartilhamento nativo: não faz nada.
        if ((error as Error)?.name === "AbortError") {
          return;
        }
        // Qualquer outro erro (ex: navegador sem suporte real) cai no fallback abaixo.
      }
    }

    abrirCompartilhamentoWhatsapp(texto);
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={`Compartilhar vaga de ${vaga.titulo}`}
      className={
        className ??
        "inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
      }
    >
      <Share2 className="size-4" aria-hidden="true" />
    </button>
  );
}
