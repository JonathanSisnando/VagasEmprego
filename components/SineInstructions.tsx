export function SineInstructions() {
  return (
    <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
      <h2 className="text-xl font-black text-slate-950">
        Como se candidatar no Sine Manaus
      </h2>

      <p className="mt-4 leading-8 text-slate-700">
        Os candidatos devem comparecer a um dos postos do Sine Manaus para
        participar da pré-seleção ou receber orientação de cadastro, Carteira de
        Trabalho Digital e seguro-desemprego.
      </p>

      <h3 className="mt-6 text-sm font-black uppercase tracking-wide text-slate-500">
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

      <h3 className="mt-6 text-sm font-black uppercase tracking-wide text-slate-500">
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
              <strong>{doc}</strong> (originais, sem necessidade de cópias)
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
            Mantenha seu cadastro atualizado, especialmente ao finalizar novas
            qualificações.
          </span>
        </li>

        <li className="flex gap-3">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
          <span>
            Para vagas específicas, podem ser solicitados documentos adicionais
            (cursos ou certificações). Fique atento aos &ldquo;Requisitos
            Obrigatórios&rdquo; de cada vaga.
          </span>
        </li>

        <li className="flex gap-3">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
          <span>
            A vestimenta deve ser adequada. Não é permitido bermudas, shorts,
            minissaias, camisetas regatas e chinelos.
          </span>
        </li>
      </ul>

      <p className="mt-6 text-sm leading-7 text-slate-600">
        A Semtepi ressalta que critérios referentes a sexo, idade, cor ou
        situação familiar não podem ser informados na divulgação das vagas,
        conforme a Constituição Federal e a CLT.
      </p>
    </div>
  );
}
