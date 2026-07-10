"use client";

import type { ComponentProps } from "react";
import { track } from "@vercel/analytics";

type TrackedActionLinkProps = ComponentProps<"a"> & {
  evento: string;
  propriedades?: Record<string, string | number | boolean>;
};

export function TrackedActionLink({
  evento,
  propriedades,
  onClick,
  ...props
}: TrackedActionLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        track(evento, propriedades);
        onClick?.(event);
      }}
    />
  );
}
