"use client";

import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  ExternalLink,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import type { Vaga } from "../../data/vagas";

type VagaEstendida = Vaga & { _fonte?: "admin" };

export default function AdminDashboardPage() {
  const router = useRouter();
  const [vagas, setVagas] = useState<VagaEstendida[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [excluindo, setExcluindo] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState("");

  async function carregarVagas() {
    try {
      const resposta = await fetch("/api/admin/vagas");

      if (!resposta.ok) {
        throw new Error("Erro ao carregar vagas");
      }

      const data = await resposta.json();
      setVagas(data.vagas ?? []);
    } catch (error) {
      setErro("Não foi possível carregar as vagas.");
      console.error(error);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    startTransition(() => {
      carregarVagas();
    });
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function handleExcluir(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta vaga?")) {
      return;
    }

    setExcluindo(id);

    try {
      const resposta = await fetch(`/api/admin/vagas/${id}`, {
        method: "DELETE",
      });

      if (!resposta.ok) {
        throw new Error("Erro ao excluir vaga");
      }

      setVagas((prev) => prev.filter((vaga) => vaga.id !== id));
      setMensagem("Vaga excluída com sucesso!");
    } catch (error) {
      setErro("Erro ao excluir vaga.");
      console.error(error);
    } finally {
      setExcluindo(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-lg font-bold text-slate-900"
          >
            <Briefcase className="size-5 text-blue-700" aria-hidden="true" />
            Admin
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <ExternalLink className="size-4" aria-hidden="true" />
              Ver site
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50"
            >
              <LogOut className="size-4" aria-hidden="true" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-blue-700">
              Painel administrativo
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Gerenciar vagas
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              {vagas.length} vaga{vagas.length !== 1 ? "s" : ""} cadastrada
              {vagas.length !== 1 ? "s" : ""}
            </p>
          </div>

          <Link
            href="/admin/vagas/novo"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-800"
          >
            <Plus className="size-4" aria-hidden="true" />
            Nova vaga
          </Link>
        </div>

        {mensagem && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800">
            {mensagem}
          </div>
        )}

        {erro && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {erro}
          </div>
        )}

        {carregando && (
          <div className="mt-12 flex items-center justify-center gap-3 text-slate-600">
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            <span className="text-sm font-semibold">Carregando vagas...</span>
          </div>
        )}

        {!carregando && vagas.length === 0 && (
          <div className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-lg font-black text-slate-950">
              Nenhuma vaga cadastrada ainda.
            </p>

            <p className="mt-3 text-slate-600">
              Crie sua primeira vaga para começar.
            </p>

            <Link
              href="/admin/vagas/novo"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-800"
            >
              <Plus className="size-4" aria-hidden="true" />
              Nova vaga
            </Link>
          </div>
        )}

        {!carregando && vagas.length > 0 && (
          <div className="mt-8 space-y-4">
            {vagas.map((vaga) => (
              <div
                key={vaga.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-black text-slate-950">
                      {vaga.titulo}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                        vaga.status === "ativa"
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {vaga.status}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-600">
                    {vaga.empresa} — {vaga.categoria}
                    {vaga.bairro && vaga.bairro !== "Não informado"
                      ? ` — ${vaga.bairro}`
                      : ""}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Publicado em {vaga.dataPublicacao}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/admin/vagas/${vaga.id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                    Editar
                  </Link>

                  <Link
                    href={`/vagas/${vaga.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    <ExternalLink className="size-4" aria-hidden="true" />
                    Ver
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleExcluir(vaga.id)}
                    disabled={excluindo === vaga.id}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {excluindo === vaga.id ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Trash2 className="size-4" aria-hidden="true" />
                    )}
                    {excluindo === vaga.id ? "Excluindo..." : "Excluir"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
