import { notFound } from "next/navigation";
import { VagaForm } from "../../../../components/VagaForm";
import { lerVagasUsuario } from "../../../../lib/vaga-storage";

type EditarVagaPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditarVagaPage({
  params,
}: EditarVagaPageProps) {
  const { id } = await params;
  const vagas = await lerVagasUsuario();
  const vaga = vagas.find((v) => v.id === id);

  if (!vaga) {
    notFound();
  }

  return <VagaForm initialData={vaga as unknown as Parameters<typeof VagaForm>[0]['initialData']} vagaId={id} />;
}
