import { NextRequest, NextResponse } from "next/server";
import { setSessao, validarCredenciais } from "../../../../lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { erro: "Usuário e senha são obrigatórios" },
        { status: 400 }
      );
    }

    if (!validarCredenciais(username, password)) {
      return NextResponse.json(
        { erro: "Usuário ou senha inválidos" },
        { status: 401 }
      );
    }

    await setSessao(username);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro no login:", error);

    return NextResponse.json(
      { erro: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
