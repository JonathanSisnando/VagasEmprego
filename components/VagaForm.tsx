"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

type VagaFormData = {
  titulo: string;
  empresa: string;
  cidade: string;
  estado: string;
  bairro: string;
  categoria: string;
  modalidade: string;
  tipoContrato: string;
  escolaridade: string;
  experiencia: string;
  salario: string;
  descricao: string;
  requisitos: string;
  beneficios: string;
  comoSeCandidatar: string;
  fonte: string;
  linkFonte: string;
  status: string;
  pcd: string;
  quantidadeVagas: string;
  dataExpiracao: string;
  emailCandidatura: string;
  whatsappCandidatura: string;
};

type CampoProps = {
  label: string;
  id: string;
  campo: keyof VagaFormData;
  form: VagaFormData;
  onChange: (campo: keyof VagaFormData, valor: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  as?: "textarea" | "select";
  opcoes?: string[];
};

function Campo({
  label,
  id,
  campo,
  form,
  onChange,
  type = "text",
  placeholder,
  required,
  as,
  opcoes,
}: CampoProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-slate-900">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {as === "textarea" ? (
        <textarea
          id={id}
          value={form[campo]}
          onChange={(e) => onChange(campo, e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />
      ) : as === "select" ? (
        <select
          id={id}
          value={form[campo]}
          onChange={(e) => onChange(campo, e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
        >
          <option value="">Selecione...</option>
          {opcoes?.map((opcao) => (
            <option key={opcao} value={opcao}>
              {opcao}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          value={form[campo]}
          onChange={(e) => onChange(campo, e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />
      )}
    </div>
  );
}

type VagaFormProps = {
  initialData?: VagaFormData;
  vagaId?: string;
};

const CATEGORIAS = [
  "Administrativo",
  "Atendimento",
  "Comércio",
  "Indústria",
  "Logística",
  "Produção",
  "Serviços Gerais",
  "Serviços",
  "Técnico",
  "Outros",
];

const MODALIDADES = ["Presencial", "Remoto", "Híbrido"];

const CONTRATOS = ["CLT", "Estágio", "Temporário", "Freelancer", "PJ", "Não informado"];

function vagaParaForm(vaga?: Record<string, unknown>): VagaFormData {
  return {
    titulo: (vaga?.titulo as string) ?? "",
    empresa: (vaga?.empresa as string) ?? "",
    cidade: (vaga?.cidade as string) ?? "Manaus",
    estado: (vaga?.estado as string) ?? "AM",
    bairro: (vaga?.bairro as string) ?? "",
    categoria: (vaga?.categoria as string) ?? "",
    modalidade: (vaga?.modalidade as string) ?? "Presencial",
    tipoContrato: (vaga?.tipoContrato as string) ?? "",
    escolaridade: (vaga?.escolaridade as string) ?? "",
    experiencia: (vaga?.experiencia as string) ?? "",
    salario: (vaga?.salario as string) ?? "",
    descricao: (vaga?.descricao as string) ?? "",
    requisitos: Array.isArray(vaga?.requisitos) ? (vaga?.requisitos as string[]).join("\n") : "",
    beneficios: Array.isArray(vaga?.beneficios) ? (vaga?.beneficios as string[]).join("\n") : "",
    comoSeCandidatar: (vaga?.comoSeCandidatar as string) ?? "",
    fonte: (vaga?.fonte as string) ?? "",
    linkFonte: (vaga?.linkFonte as string) ?? "",
    status: (vaga?.status as string) ?? "ativa",
    pcd: vaga?.pcd ? "sim" : "nao",
    quantidadeVagas: String((vaga?.quantidadeVagas as number) ?? 1),
    dataExpiracao: (vaga?.dataExpiracao as string) ?? "",
    emailCandidatura: (vaga?.emailCandidatura as string) ?? "",
    whatsappCandidatura: (vaga?.whatsappCandidatura as string) ?? "",
  };
}

export function VagaForm({ initialData, vagaId }: VagaFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<VagaFormData>(
    vagaParaForm(initialData as Record<string, unknown>)
  );
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  function atualizar(
    campo: keyof VagaFormData,
    valor: string
  ) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCarregando(true);
    setErro("");

    const body = {
      titulo: form.titulo,
      empresa: form.empresa || "Empresa não informada",
      cidade: form.cidade,
      estado: form.estado,
      bairro: form.bairro || "Não informado",
      categoria: form.categoria,
      modalidade: form.modalidade,
      tipoContrato: form.tipoContrato || "Não informado",
      escolaridade: form.escolaridade || "Não informado",
      experiencia: form.experiencia || "Não informado",
      salario: form.salario || "Não informado",
      descricao: form.descricao,
      requisitos: form.requisitos
        ? form.requisitos.split("\n").map((r) => r.trim()).filter(Boolean)
        : ["Não informado"],
      beneficios: form.beneficios
        ? form.beneficios.split("\n").map((r) => r.trim()).filter(Boolean)
        : ["Não informado"],
      comoSeCandidatar: form.comoSeCandidatar || "Confira a fonte oficial da vaga.",
      fonte: form.fonte || "Cadastro manual",
      linkFonte: form.linkFonte || "#",
      status: form.status,
      pcd: form.pcd === "sim",
      quantidadeVagas: Number(form.quantidadeVagas) || 1,
      dataExpiracao: form.dataExpiracao || undefined,
      emailCandidatura: form.emailCandidatura || "",
      whatsappCandidatura: form.whatsappCandidatura || "",
    };

    try {
      const url = vagaId
        ? `/api/admin/vagas/${vagaId}`
        : "/api/admin/vagas";

      const method = vagaId ? "PUT" : "POST";

      const resposta = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!resposta.ok) {
        const data = await resposta.json();
        throw new Error(data.erro ?? "Erro ao salvar vaga");
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao salvar vaga"
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-800"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Voltar para o painel
        </Link>

        <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-950">
          {vagaId ? "Editar vaga" : "Nova vaga"}
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Preencha os campos abaixo para{" "}
          {vagaId ? "atualizar a" : "cadastrar uma nova"} vaga.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {erro && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {erro}
            </div>
          )}

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">
              Informações principais
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Campo form={form} onChange={atualizar} label="Título da vaga" id="titulo" campo="titulo" required />
              </div>

              <Campo form={form} onChange={atualizar} label="Empresa" id="empresa" campo="empresa" />
              <Campo form={form} onChange={atualizar} label="Categoria" id="categoria" campo="categoria" as="select" opcoes={CATEGORIAS} required />

              <Campo form={form} onChange={atualizar} label="Cidade" id="cidade" campo="cidade" />
              <Campo form={form} onChange={atualizar} label="Estado" id="estado" campo="estado" />

              <Campo form={form} onChange={atualizar} label="Bairro" id="bairro" campo="bairro" placeholder="Centro, Distrito Industrial..." />
              <Campo form={form} onChange={atualizar} label="Modalidade" id="modalidade" campo="modalidade" as="select" opcoes={MODALIDADES} />

              <Campo form={form} onChange={atualizar} label="Tipo de contrato" id="tipoContrato" campo="tipoContrato" as="select" opcoes={CONTRATOS} />

              <Campo form={form} onChange={atualizar}
                label="Quantidade de vagas"
                id="quantidadeVagas"
                campo="quantidadeVagas"
                type="number"
              />

              <Campo form={form} onChange={atualizar}
                label="Data de expiração"
                id="dataExpiracao"
                campo="dataExpiracao"
                type="date"
              />

              <Campo form={form} onChange={atualizar} label="PCD?" id="pcd" campo="pcd" as="select" opcoes={["nao", "sim"]} />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">
              Requisitos e detalhes
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Campo form={form} onChange={atualizar} label="Escolaridade" id="escolaridade" campo="escolaridade" />
              <Campo form={form} onChange={atualizar} label="Experiência" id="experiencia" campo="experiencia" />
              <Campo form={form} onChange={atualizar} label="Salário" id="salario" campo="salario" />

              <div className="sm:col-span-2">
                <Campo form={form} onChange={atualizar}
                  label="Descrição"
                  id="descricao"
                  campo="descricao"
                  as="textarea"
                  placeholder="Descreva a vaga em algumas linhas..."
                />
              </div>

              <div className="sm:col-span-2">
                <Campo form={form} onChange={atualizar}
                  label="Requisitos (um por linha)"
                  id="requisitos"
                  campo="requisitos"
                  as="textarea"
                  placeholder="Ensino médio completo&#10;Conhecimento em informática&#10;Boa comunicação"
                />
              </div>

              <div className="sm:col-span-2">
                <Campo form={form} onChange={atualizar}
                  label="Benefícios (um por linha)"
                  id="beneficios"
                  campo="beneficios"
                  as="textarea"
                  placeholder="Vale transporte&#10;Vale alimentação&#10;Plano de saúde"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">
              Candidatura e fonte
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Campo form={form} onChange={atualizar}
                  label="Como se candidatar"
                  id="comoSeCandidatar"
                  campo="comoSeCandidatar"
                  as="textarea"
                  placeholder="Envie seu currículo para rh@empresa.com com o título 'Vaga Auxiliar Administrativo'"
                />
              </div>

              <Campo form={form} onChange={atualizar} label="Fonte da vaga" id="fonte" campo="fonte" />
              <Campo form={form} onChange={atualizar} label="Link da fonte" id="linkFonte" campo="linkFonte" type="url" />

              <Campo form={form} onChange={atualizar} label="E-mail para candidatura" id="emailCandidatura" campo="emailCandidatura" type="email" />
              <Campo form={form} onChange={atualizar} label="WhatsApp para candidatura" id="whatsappCandidatura" campo="whatsappCandidatura" />

              <Campo form={form} onChange={atualizar} label="Status" id="status" campo="status" as="select" opcoes={["ativa", "encerrada"]} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={carregando}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              <Save className="size-4" aria-hidden="true" />
              {carregando
                ? "Salvando..."
                : vagaId
                  ? "Atualizar vaga"
                  : "Cadastrar vaga"}
            </button>

            <Link
              href="/admin"
              className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
