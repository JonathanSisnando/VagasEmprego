import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";

const POSTOS = [
  {
    nome: "Posto Central",
    endereco: "Avenida Constantino Nery, nº 1.272, bairro São Geraldo, zona Centro-Sul",
    horario: "8h às 14h",
  },
  {
    nome: "Shopping Phelippe Daou",
    endereco: "Avenida Camapuã, nº 2.939, bairro Cidade de Deus, zona Norte",
    horario: "8h às 14h",
  },
];

export function SineInstructions() {
  const [aberto, setAberto] = useState(false);

  return (
    <article className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
      <h2 className="text-base font-extrabold">Como se candidatar no Sine Manaus</h2>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90">
        Os candidatos devem comparecer a um dos postos do Sine Manaus com documentos pessoais,
        currículo, comprovante de escolaridade e residência, das 8h às 14h.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Os interessados devem estar munidos do comprovante de vacinação (Covid-19), currículo,
        certificados de cursos e documentos pessoais (RG, CPF, PIS, CTPS, comprovante de
        escolaridade e residência). Não é necessário apresentar cópias, somente os documentos
        originais.
      </p>

      <button
        type="button"
        onClick={() => setAberto(!aberto)}
        className="mt-3 flex items-center gap-2 text-xs font-bold text-primary"
      >
        {aberto ? (
          <>Ver menos <ChevronUp className="size-3" /></>
        ) : (
          <>Ver endereços dos postos <ChevronDown className="size-3" /></>
        )}
      </button>

      {aberto && (
        <div className="mt-3 space-y-2">
          {POSTOS.map((posto) => (
            <div key={posto.nome} className="flex gap-2 rounded-xl bg-white p-3 text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <p className="font-bold">{posto.nome}</p>
                <p className="text-xs text-muted-foreground">{posto.endereco}</p>
                <p className="text-xs text-muted-foreground">Atendimento: {posto.horario}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
