import { createServerFn } from "@tanstack/react-start";

import { mockRespostaSetemp, mockRespostaSine } from "./vagas-mock";
import type { FonteResposta } from "./vagas-types";

// Server functions que expõem, em contrato uniforme, as vagas de cada fonte.
// TODO: substituir estes retornos por parsing real dos boletins do Sine
// e da API/scrape do Portal do Trabalhador do Amazonas, mantendo
// exatamente o mesmo formato FonteResposta.

export const getVagasSine = createServerFn({ method: "GET" }).handler(
  async (): Promise<FonteResposta> => {
    return mockRespostaSine;
  },
);

export const getVagasSetemp = createServerFn({ method: "GET" }).handler(
  async (): Promise<FonteResposta> => {
    return mockRespostaSetemp;
  },
);