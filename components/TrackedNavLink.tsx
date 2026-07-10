"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { track } from "@vercel/analytics";

type TrackedNavLinkProps = ComponentProps<typeof Link> & {
  evento: string;
  propriedades?: Record<string, string | number | boolean>;
};

export function TrackedNavLink({
  evento,
  propriedades,
  onClick,
  ...props
}: TrackedNavLinkProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        track(evento, propriedades);
        onClick?.(event);
      }}
    />
  );
}
