import { Loader2 } from "lucide-react";

export default function VagaDetalheLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="size-8 animate-spin text-blue-700" aria-hidden="true" />
          <p className="text-sm font-semibold text-slate-600">
            Carregando detalhes da vaga...
          </p>
        </div>
      </section>
    </main>
  );
}
