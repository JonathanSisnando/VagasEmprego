import { createServerFn } from "@tanstack/react-start";

import type { FonteResposta } from "./vagas-types";
import { getVagasSine as scraperSine } from "./sine-manaus";
import { getVagasSetemp as scraperSetemp } from "./setemp";

export const getVagasSine = createServerFn({ method: "GET" }).handler(
  async (): Promise<FonteResposta> => {
    try {
      console.log("[ServerFn] Chamando scraperSine...");
      const resultado = await scraperSine();
      console.log("[ServerFn] scraperSine retornou:", resultado.resumo.totalCargos, "cargos,", resultado.resumo.totalVagas, "vagas");
      return resultado;
    } catch (error) {
      console.error("[ServerFn] Erro ao buscar vagas do Sine Manaus:", error);
      console.error("[ServerFn] Stack trace:", error instanceof Error ? error.stack : "N/A");
      return {
        vagas: [],
        resumo: {
          fonte: "Prefeitura de Manaus - Sine Manaus",
          totalCargos: 0,
          totalVagas: 0,
          linkOficial: "https://www.manaus.am.gov.br/",
          atualizadoEm: new Date().toISOString(),
        },
      };
    }
  },
);

export const getVagasSetemp = createServerFn({ method: "GET" }).handler(
  async (): Promise<FonteResposta> => {
    try {
      return await scraperSetemp();
    } catch (error) {
      console.error("Erro ao buscar vagas do SETEMP:", error);
      return {
        vagas: [],
        resumo: {
          fonte: "SETEMP - Portal do Trabalhador do Amazonas",
          totalCargos: 0,
          totalVagas: 0,
          linkOficial: "https://portaldotrabalhador.setemp.am.gov.br/",
          atualizadoEm: new Date().toISOString(),
        },
      };
    }
  },
);
