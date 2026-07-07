import { NextResponse } from "next/server";
import { buscarVagasSetemp } from "../../../lib/setemp";

export async function GET() {
  try {
    const vagas = await buscarVagasSetemp();

    const totalImportado = vagas.reduce((total, vaga) => {
      return total + (vaga.quantidadeVagas ?? 1);
    }, 0);

    return NextResponse.json({
      fonte: "SETEMP / Portal do Trabalhador",
      total: totalImportado,
      totalImportado,
      totalCargos: vagas.length,
      vagas,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        erro: "Erro ao importar vagas do Portal do Trabalhador (SETEMP)",
        detalhe: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      }
    );
  }
}
