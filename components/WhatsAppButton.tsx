import Image from "next/image";
import { siteConfig } from "../config/site";
import { TrackedActionLink } from "./TrackedActionLink";

export function WhatsAppButton() {
  const mensagem = encodeURIComponent(
    `Olá! Vim pelo site ${siteConfig.nome} e gostaria de falar com você.`
  );

  return (
    <TrackedActionLink
      href={`https://wa.me/${siteConfig.whatsapp}?text=${mensagem}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar pelo WhatsApp"
      evento="click_whatsapp_flutuante"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 shadow-lg transition hover:scale-105 hover:bg-green-700"
    >
      <Image
        src="/whatsapp-svgrepo-com.svg"
        alt=""
        width={32}
        height={32}
        className="h-8 w-8"
      />
    </TrackedActionLink>
  );
}