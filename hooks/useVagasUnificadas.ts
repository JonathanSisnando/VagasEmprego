"use client";

import { useEffect, useMemo, useState } from "react";
import { vagas as vagasEstaticas } from "../data/vagas";
import type { Vaga } from "../data/vagas";

type RespostaSine = {
  fonte: string;
  totalImportado?: number;
  totalDeclaradoNoticia?: number | null;
  totalCargos?: number;
  vagas: Vaga[];
  post?: {
    link: string;
    dataPublicacao: string;
  };
  erro?: string;
};

type RespostaSetemp = {
  fonte: string;
  totalImportado?: number;
  totalCargos?: number;
  vagas: Vaga[];
  erro?: string;
};

export type InfoFonteSine = {
  fonte: string;
  post?: { link: string; dataPublicacao: string };
  totalOficial: number;
  totalCargos: number;
};

export type InfoFonteSetemp = {
  totalOficial: number;
  totalCargos: number;
};

export function useVagasUnificadas() {
  const [vagasSine, setVagasSine] = useState<Vaga[]>([]);
  const [vagasSetemp, setVagasSetemp] = useState<Vaga[]>([]);
  const [carregandoSine, setCarregandoSine] = useState(true);
  const [carregandoSetemp, setCarregandoSetemp] = useState(true);
  const [erroSine, setErroSine] = useState(false);
  const [erroSetemp, setErroSetemp] = useState(false);
  const [sine, setSine] = useState<InfoFonteSine>({
    fonte: "Prefeitura de Manaus - Sine Manaus",
    totalOficial: 0,
    totalCargos: 0,
  });
  const [setemp, setSetemp] = useState<InfoFonteSetemp>({
    totalOficial: 0,
    totalCargos: 0,
  });

  useEffect(() => {
    async function carregarSine() {
      try {
        const resposta = await fetch("/api/vagas-sine");

        if (!resposta.ok) {
          throw new Error("Erro ao buscar vagas do Sine Manaus.");
        }

        const dados = (await resposta.json()) as RespostaSine;

        if (dados.erro) {
          throw new Error(dados.erro);
        }

        setVagasSine(dados.vagas ?? []);
        setSine({
          fonte: dados.fonte || "Prefeitura de Manaus - Sine Manaus",
          post: dados.post,
          totalOficial: dados.totalDeclaradoNoticia ?? dados.totalImportado ?? 0,
          totalCargos: dados.totalCargos ?? dados.vagas?.length ?? 0,
        });
      } catch (error) {
        console.error(error);
        setErroSine(true);
      } finally {
        setCarregandoSine(false);
      }
    }

    carregarSine();
  }, []);

  useEffect(() => {
    async function carregarSetemp() {
      try {
        const resposta = await fetch("/api/vagas-setemp");

        if (!resposta.ok) {
          throw new Error("Erro ao buscar vagas do Portal do Trabalhador.");
        }

        const dados = (await resposta.json()) as RespostaSetemp;

        if (dados.erro) {
          throw new Error(dados.erro);
        }

        setVagasSetemp(dados.vagas ?? []);
        setSetemp({
          totalOficial: dados.totalImportado ?? dados.vagas?.length ?? 0,
          totalCargos: dados.totalCargos ?? dados.vagas?.length ?? 0,
        });
      } catch (error) {
        console.error(error);
        setErroSetemp(true);
      } finally {
        setCarregandoSetemp(false);
      }
    }

    carregarSetemp();
  }, []);

  const vagas = useMemo(() => {
    return [...vagasEstaticas, ...vagasSine, ...vagasSetemp];
  }, [vagasSine, vagasSetemp]);

  return {
    vagas,
    carregando: carregandoSine || carregandoSetemp,
    erroSine,
    erroSetemp,
    totalCadastradas: vagasEstaticas.length,
    sine,
    setemp,
  };
}
