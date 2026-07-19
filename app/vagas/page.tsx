import type { Metadata } from "next";
import { VagasClient } from "../../components/VagasClient";

export const metadata: Metadata = {
  title: "Encontre vagas disponíveis em Manaus | Vagas Manaus Hoje",
  description:
    "Consulte oportunidades divulgadas publicamente e veja vagas atualizadas automaticamente pelo Sine Manaus antes de ir presencialmente ao atendimento.",
};

export default function VagasPage() {
  return <VagasClient />;
}