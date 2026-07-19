import { NextRequest, NextResponse } from "next/server";
import {
  buscarNoticiaSine,
  buscarNoticiaSineMaisRecente,
  extrairVagasDoPost,
  limparHtmlParaTexto,
} from "../../../lib/sine-manaus";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");

  try {
    const post = slug
      ? await buscarNoticiaSine(slug)
      : await buscarNoticiaSineMaisRecente();

    if (!post) {
      return NextResponse.json(
        {
          erro: slug
            ? "Notícia não encontrada pelo slug informado"
            : "Nenhuma notícia recente do Sine Manaus encontrada",
          slug,
        },
        {
          status: 404,
        }
      );
    }

    const vagas = extrairVagasDoPost(post);

    const totalCargos = vagas.length;

    const totalImportado = vagas.reduce((total, vaga) => {
      return total + (vaga.quantidadeVagas ?? 1);
    }, 0);

    const tituloLimpo = limparHtmlParaTexto(post.title.rendered);

    const totalDeclaradoNoticia = extrairTotalDeclaradoDaNoticia(tituloLimpo);

    const diferenca =
      typeof totalDeclaradoNoticia === "number"
        ? totalDeclaradoNoticia - totalImportado
        : null;

    return NextResponse.json({
      fonte: "Prefeitura de Manaus - Sine Manaus",
      modo: slug ? "slug-informado" : "noticia-mais-recente",
      post: {
        id: post.id,
        slug: post.slug,
        titulo: tituloLimpo,
        link: post.link,
        dataPublicacao: post.date.slice(0, 10),
      },
      total: totalImportado,
      totalImportado,
      totalDeclaradoNoticia,
      totalCargos,
      diferenca,
      vagas,
    });
} catch (error) {
  console.error(error);

  return NextResponse.json(
    {
      erro: "Erro ao importar vagas do Sine Manaus",
      detalhe: error instanceof Error ? error.message : String(error),
    },
    {
      status: 500,
    }
  );
}
}

function extrairTotalDeclaradoDaNoticia(titulo: string) {
  const match = titulo.match(/(\d+)\s+vagas/i);

  if (!match) {
    return null;
  }

  return Number(match[1]);
}