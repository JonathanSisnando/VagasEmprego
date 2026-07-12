import { AlertTriangle } from "lucide-react";

import { AVISO_ANTIFRAUDE } from "@/lib/site-config";

export function AntiFraudNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-2xl border-2 border-alert bg-alert/5 p-4"
    >
      <div className="grid size-8 shrink-0 place-items-center rounded-full bg-alert text-alert-foreground">
        <AlertTriangle className="size-4" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-wider text-alert">
          Aviso de segurança
        </p>
        <p className="mt-1 text-sm leading-relaxed text-foreground">
          {AVISO_ANTIFRAUDE}
          {!compact ? (
            <>
              {" "}Se pedirem dinheiro, exames pagos ou cursos obrigatórios antes da contratação, <strong>é golpe</strong>.
            </>
          ) : null}
        </p>
      </div>
    </div>
  );
}