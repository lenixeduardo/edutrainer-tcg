import type { Metadata } from "next";
import "./globals.css";
import "./official-theme.css";
import "./card-360.css";
import "./card-detail.css";
import "./customer-checkout.css";
import "./hero-shiny.css";
import "./collector-banner.css";
import "./how-photo-section.css";

export const metadata: Metadata = {
  title: "EduTrainer TCG | Cartas Pokémon",
  description: "Catálogo de cartas Pokémon colecionáveis. Selecione suas cartas e consulte a compra pelo WhatsApp.",
  icons: { icon: "/brand/pokeball-mark-v2.svg", shortcut: "/brand/pokeball-mark-v2.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
