import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/vagas")({
  component: VagasLayout,
});

function VagasLayout() {
  return <Outlet />;
}
