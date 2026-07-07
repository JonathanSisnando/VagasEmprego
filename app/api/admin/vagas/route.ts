import { NextRequest, NextResponse } from "next/server";
import { lerVagasUsuario, salvarVagasUsuario } from "../../../../lib/vaga-storage";

export async function GET() {
  try {
    const vagas = await lerVagasUsuario();

    return NextResponse.json({ vagas });
  } catch (error) {
    console.error("Erro ao listar vagas:", error);

    return NextResponse.json(
      { erro: "Erro ao listar vagas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const vagas = await lerVagasUsuario();
    const body = await request.json();

    const novaVaga = {
      ...body,
      id: String(Date.now()),
      slug: body.slug || body.titulo.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") + "-" + Date.now(),
      dataPublicacao: body.dataPublicacao || new Date().toISOString().slice(0, 10),
      status: body.status || "ativa",
    };

    vagas.push(novaVaga);
    await salvarVagasUsuario(vagas);

    return NextResponse.json({ vaga: novaVaga }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar vaga:", error);

    return NextResponse.json(
      { erro: "Erro ao criar vaga" },
      { status: 500 }
    );
  }
}
