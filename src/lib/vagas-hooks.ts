import { useQuery } from "@tanstack/react-query";

import { getVagasSetemp, getVagasSine } from "./vagas.functions";
import type { FonteResposta, Vaga } from "./vagas-types";

export function useVagasSine() {
  return useQuery<FonteResposta>({
    queryKey: ["vagas", "sine"],
    queryFn: () => getVagasSine(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useVagasSetemp() {
  return useQuery<FonteResposta>({
    queryKey: ["vagas", "setemp"],
    queryFn: () => getVagasSetemp(),
    staleTime: 5 * 60 * 1000,
  });
}

/** Junta as duas fontes preservando estados independentes. */
export function useVagasUnificadas() {
  const sine = useVagasSine();
  const setemp = useVagasSetemp();

  const vagas: Vaga[] = [...(sine.data?.vagas ?? []), ...(setemp.data?.vagas ?? [])];

  return {
    vagas,
    sine,
    setemp,
    isLoading: sine.isLoading || setemp.isLoading,
    algumaFalhou: sine.isError || setemp.isError,
  };
}

export function findVagaBySlug(vagas: Vaga[], slug: string): Vaga | undefined {
  return vagas.find((v) => v.slug === slug);
}
