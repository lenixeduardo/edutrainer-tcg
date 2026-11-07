export type Condition = "NM" | "SP" | "MP" | "HP";
export type Finish = "Normal" | "Foil" | "Reverse Foil";
export type Language = "Português" | "Inglês" | "Japonês" | "Chinês" | "Coreano" | "Outro";
export type Category = "Vintage" | "Arte Rara" | "Full Art" | "Promo" | "Shiny" | "Outras";

export type Product = {
  id: string;
  name: string;
  set_name: string;
  card_number: string;
  category: Category;
  language: Language;
  condition: Condition;
  finish: Finish;
  rarity: string;
  price_cents: number;
  stock: number;
  front_url: string;
  back_url: string;
  is_published: boolean;
  created_at?: string;
};

export type Cart = Record<string, number>;
