import { NextRequest, NextResponse } from "next/server";
import { lerVagasUsuario, salvarVagasUsuario } from "../../../../../lib/vaga-storage";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vagas = await lerVagasUsuario();
    const body = await request.json();
    const index = vagas.findIndex((vaga) => vaga.id === id);

    if (index === -1) {
      return NextResponse.json(
        { erro: "Vaga não encontrada" },
        { status: 404 }
      );
    }

    vagas[index] = { ...vagas[index], ...body, id };
    await salvarVagasUsuario(vagas);

    return NextResponse.json({ vaga: vagas[index] });
  } catch (error) {
    console.error("Erro ao atualizar vaga:", error);

    return NextResponse.json(
      { erro: "Erro ao atualizar vaga" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vagas = await lerVagasUsuario();
    const index = vagas.findIndex((vaga) => vaga.id === id);

    if (index === -1) {
      return NextResponse.json(
        { erro: "Vaga não encontrada" },
        { status: 404 }
      );
    }

    vagas.splice(index, 1);
    await salvarVagasUsuario(vagas);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao excluir vaga:", error);

    return NextResponse.json(
      { erro: "Erro ao excluir vaga" },
      { status: 500 }
    );
  }
}
