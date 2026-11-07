import type { Product } from "./types";

/** Artes digitais de referência não são fotografias do exemplar NM.
 * Links externos não comprovam autorização comercial para reprodução.
 */
type ReferenceEntry = { name:string; url:string; language?:Product["language"]; source?:string; aliases?:string[] };
const references: Record<string,ReferenceEntry> = {
  "109/091":{name:"charmander",url:"https://images.pokemontcg.io/sv4pt5/109_hires.png"},
  "110/091":{name:"charmeleon",url:"https://images.pokemontcg.io/sv4pt5/110_hires.png"},
  "131/091":{name:"pikachu",url:"https://images.pokemontcg.io/sv4pt5/131_hires.png"},
  "174/091":{name:"lucario",url:"https://images.pokemontcg.io/sv4pt5/174_hires.png"},
  "202/091":{name:"snorlax",url:"https://images.pokemontcg.io/sv4pt5/202_hires.png"},
  "116/091":{name:"slowpoke",url:"https://images.pokemontcg.io/sv4pt5/116_hires.png"},
  "201/091":{name:"ditto",url:"https://images.pokemontcg.io/sv4pt5/201_hires.png"},
  "092/091":{name:"oddish",url:"https://images.pokemontcg.io/sv4pt5/92_hires.png"},
  "100/100":{name:"zapdos lv.30",aliases:["zapdos shiny","zapdos"],url:"https://cdn.pooka.app/card/ja-dpt3-100.png",language:"Japonês",source:"Pooka — Beat of the Frontier (DPt3), 100/100"}
};

export function getCardReference(product: Pick<Product,"name"|"card_number"|"language">) {
  const match=references[product.card_number.trim()];
  if (!match) return null;
  const name=product.name.trim().toLowerCase();
  if (match.name!==name && !match.aliases?.includes(name)) return null;
  const language=match.language??"Inglês";
  return {url:match.url,language,matchesLanguage:product.language===language,source:match.source??"Pokémon TCG API (comunitária)"};
}
