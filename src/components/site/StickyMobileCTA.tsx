import type { ReactNode } from "react";

export function StickyMobileCTA({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-background/95 p-4 backdrop-blur-md md:hidden">
      <div className="mx-auto flex max-w-5xl gap-3">{children}</div>
    </div>
  );
}
