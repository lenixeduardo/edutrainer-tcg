import type { Metadata } from "next";
import "./globals.css";
import "./official-theme.css";

export const metadata: Metadata = {
  title: "EduTrainer TCG | Cartas Pokémon",
  description: "Catálogo de cartas Pokémon colecionáveis. Selecione suas cartas e consulte a compra pelo WhatsApp.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
