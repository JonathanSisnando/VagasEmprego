"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { siteConfig } from "../config/site";

export function SineInstructions() {
  const [expandido, setExpandido] = useState(false);

  return (
    <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
      <h2 className="text-xl font-black text-slate-950">
        Como se candidatar no Sine Manaus
      </h2>

      <p className="mt-4 leading-8 text-slate-700">
        Vá a um dos postos do Sine Manaus levando documentos pessoais
        originais e currículo atualizado — sem necessidade de cópias.
      </p>

      <h3 className="mt-5 text-sm font-black uppercase tracking-wide text-slate-500">
        Endereços dos postos
      </h3>

      <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
        <li className="flex gap-3">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-700" />
          <span>
            Avenida Constantino Nery, nº 1.272, bairro São Geraldo, zona
            Centro-Sul
          </span>
        </li>

        <li className="flex gap-3">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-700" />
          <span>
            Shopping Phelippe Daou, na avenida Camapuã, nº 2.939, bairro Cidade
            de Deus, zona Norte
          </span>
        </li>
      </ul>

      <button
        type="button"
        onClick={() => setExpandido((valor) => !valor)}
        aria-expanded={expandido}
        className="mt-5 flex items-center gap-2 text-sm font-black text-blue-700 transition hover:text-blue-800"
      >
        {expandido
          ? "Ver menos"
          : "Ver lista completa de documentos e orientações"}
        <ChevronDown
          className={`size-4 transition-transform ${expandido ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {expandido && (
        <div className="mt-5 border-t border-blue-100 pt-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-slate-500">
            Documentos necessários
          </h3>

          <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
            {[
              "Comprovante de vacinação (Covid-19)",
              "Currículo atualizado",
              "Certificados de cursos",
              "Documentos pessoais (RG, CPF, PIS, CTPS)",
              "Comprovante de escolaridade",
              "Comprovante de residência",
            ].map((doc) => (
              <li key={doc} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-700" />
                <span>
                  <strong>{doc}</strong> (originais, sem necessidade de
                  cópias)
                  {doc === "Currículo atualizado" && (
                    <>
                      . Não tem um pronto ou quer aumentar suas chances?{" "}
                      <Link
                        href="/adaptar-curriculo"
                        className="font-bold text-blue-700 underline hover:text-blue-800"
                      >
                        A gente adapta o seu por {siteConfig.precoCurriculo}
                      </Link>
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>

          <h3 className="mt-6 text-sm font-black uppercase tracking-wide text-slate-500">
            Orientações importantes
          </h3>

          <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              <span>
                Mantenha seu cadastro atualizado, especialmente ao finalizar
                novas qualificações.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              <span>
                Para vagas específicas, podem ser solicitados documentos
                adicionais (cursos ou certificações). Fique atento aos
                &ldquo;Requisitos Obrigatórios&rdquo; de cada vaga.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              <span>
                A vestimenta deve ser adequada. Não é permitido bermudas,
                shorts, minissaias, camisetas regatas e chinelos.
              </span>
            </li>
          </ul>

          <p className="mt-6 text-sm leading-7 text-slate-600">
            A Semtepi ressalta que critérios referentes a sexo, idade, cor ou
            situação familiar não podem ser informados na divulgação das
            vagas, conforme a Constituição Federal e a CLT.
          </p>
        </div>
      )}
    </div>
  );
}
