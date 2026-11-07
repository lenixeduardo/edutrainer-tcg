import type { Product } from "./types";

/** Arte digital EN da edição; não é foto nem atestado do estado NM do exemplar.
 * Imagens linkadas de um catálogo comunitário e não copiadas ao repositório.
 */
const references: Record<string,{name:string;url:string}> = {
  "109/091":{name:"charmander",url:"https://images.pokemontcg.io/sv4pt5/109_hires.png"},
  "110/091":{name:"charmeleon",url:"https://images.pokemontcg.io/sv4pt5/110_hires.png"},
  "131/091":{name:"pikachu",url:"https://images.pokemontcg.io/sv4pt5/131_hires.png"},
  "174/091":{name:"lucario",url:"https://images.pokemontcg.io/sv4pt5/174_hires.png"},
  "202/091":{name:"snorlax",url:"https://images.pokemontcg.io/sv4pt5/202_hires.png"},
  "116/091":{name:"slowpoke",url:"https://images.pokemontcg.io/sv4pt5/116_hires.png"},
  "201/091":{name:"ditto",url:"https://images.pokemontcg.io/sv4pt5/201_hires.png"},
  "092/091":{name:"oddish",url:"https://images.pokemontcg.io/sv4pt5/92_hires.png"}
};

export function getCardReference(product: Pick<Product,"name"|"card_number"|"language">) {
  const match=references[product.card_number.trim()];
  if(!match || match.name!==product.name.trim().toLowerCase())return null;
  return {url:match.url,language:"Inglês" as const,matchesLanguage:product.language==="Inglês",source:"Pokémon TCG API (comunitária)"};
}
