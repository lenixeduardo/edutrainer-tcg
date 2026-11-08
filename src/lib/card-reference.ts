import type { Product } from "./types";

/** Artes digitais de referência não são fotografias do exemplar NM.
 * Links externos não comprovam autorização comercial para reprodução.
 */
type ReferenceEntry = { name:string; url:string; language?:Product["language"]; source?:string; aliases?:string[]; setName?:string };
const references: Record<string,ReferenceEntry> = {
  "109/091":{name:"charmander",url:"https://images.pokemontcg.io/sv4pt5/109_hires.png"},
  "110/091":{name:"charmeleon",url:"https://images.pokemontcg.io/sv4pt5/110_hires.png"},
  "131/091":{name:"pikachu",url:"https://images.pokemontcg.io/sv4pt5/131_hires.png"},
  "174/091":{name:"lucario",url:"https://images.pokemontcg.io/sv4pt5/174_hires.png"},
  "202/091":{name:"snorlax",url:"https://images.pokemontcg.io/sv4pt5/202_hires.png"},
  "116/091":{name:"slowpoke",url:"https://images.pokemontcg.io/sv4pt5/116_hires.png"},
  "201/091":{name:"ditto",url:"https://images.pokemontcg.io/sv4pt5/201_hires.png"},
  "173/091":{name:"riolu",url:"https://images.pokemontcg.io/sv4pt5/173_hires.png"},
  "182/091":{name:"sneasel",url:"https://images.pokemontcg.io/sv4pt5/182_hires.png"},
  "092/091":{name:"oddish",url:"https://images.pokemontcg.io/sv4pt5/92_hires.png"},
  "048/108":{name:"haunter",setName:"Evolutions",url:"https://images.pokemontcg.io/xy12/48_hires.png",source:"Pokémon TCG API (conjunto e número validados)"},
  "051/108":{name:"mewtwo",setName:"Evolutions",url:"https://images.pokemontcg.io/xy12/51_hires.png",source:"Pokémon TCG API (conjunto e número validados)"},
  "059/108":{name:"machamp",setName:"Evolutions",url:"https://images.pokemontcg.io/xy12/59_hires.png",source:"Pokémon TCG API (conjunto e número validados)"},
  "062/108":{name:"hitmonchan",setName:"Evolutions",url:"https://images.pokemontcg.io/xy12/62_hires.png",source:"Pokémon TCG API (conjunto e número validados)"},
  "080/108":{name:"misty's determination",setName:"Evolutions",url:"https://images.pokemontcg.io/xy12/80_hires.png",source:"Pokémon TCG API (conjunto e número validados)"},
  "099/108":{name:"fairy energy",setName:"Evolutions",url:"https://images.pokemontcg.io/xy12/99_hires.png",source:"Pokémon TCG API (conjunto e número validados)"},
  "113/108":{name:"here comes team rocket!",setName:"Evolutions",url:"https://images.pokemontcg.io/xy12/113_hires.png",source:"Pokémon TCG API (conjunto e número validados)"},
  "029/108":{name:"dewgong",setName:"Evolutions",url:"https://images.pokemontcg.io/xy12/29_hires.png",source:"Pokémon TCG API (conjunto e número validados)"},
  "031/108":{name:"starmie",setName:"Evolutions",url:"https://images.pokemontcg.io/xy12/31_hires.png",source:"Pokémon TCG API (conjunto e número validados)"},
  "033/108":{name:"magikarp",setName:"Evolutions",url:"https://images.pokemontcg.io/xy12/33_hires.png",source:"Pokémon TCG API (conjunto e número validados)"},
  "035/108":{name:"pikachu",setName:"Evolutions",url:"https://images.pokemontcg.io/xy12/35_hires.png",source:"Pokémon TCG API (conjunto e número validados)"},
  "038/108":{name:"magneton",setName:"Evolutions",url:"https://images.pokemontcg.io/xy12/38_hires.png",source:"Pokémon TCG API (conjunto e número validados)"},
  "040/108":{name:"electrode",setName:"Evolutions",url:"https://images.pokemontcg.io/xy12/40_hires.png",source:"Pokémon TCG API (conjunto e número validados)"},
  "041/108":{name:"electabuzz",setName:"Evolutions",url:"https://images.pokemontcg.io/xy12/41_hires.png",source:"Pokémon TCG API (conjunto e número validados)"},
  "047/108":{name:"gastly",setName:"Evolutions",url:"https://images.pokemontcg.io/xy12/47_hires.png",source:"Pokémon TCG API (conjunto e número validados)"},
  "114/132":{name:"misty's wrath",setName:"Gym Heroes",url:"https://images.pokemontcg.io/gym1/114_hires.png",source:"Pokémon TCG API (conjunto e número validados)"},
  "123/132":{name:"misty's duel",setName:"Gym Heroes",url:"https://images.pokemontcg.io/gym1/123_hires.png",source:"Pokémon TCG API (conjunto e número validados)"},
  "054/064":{name:"smoochum",setName:"Neo Revelation",url:"https://images.pokemontcg.io/neo3/54_hires.png",source:"Pokémon TCG API (conjunto e número validados)"},
  "017/102":{name:"beedrill",setName:"Base Set",url:"https://images.pokemontcg.io/base1/17_hires.png",source:"Pokémon TCG API (conjunto e número validados)"},
  "007/108":{name:"beedrill",setName:"Evolutions",url:"https://images.pokemontcg.io/xy12/7_hires.png",source:"Pokémon TCG API (conjunto e número validados)"},
  "009/108":{name:"charmander",setName:"Evolutions",url:"https://images.pokemontcg.io/xy12/9_hires.png",source:"Pokémon TCG API (conjunto e número validados)"},
  "010/108":{name:"charmeleon",setName:"Evolutions",url:"https://images.pokemontcg.io/xy12/10_hires.png",source:"Pokémon TCG API (conjunto e número validados)"},
  "014/108":{name:"vulpix",setName:"Evolutions",url:"https://images.pokemontcg.io/xy12/14_hires.png",source:"Pokémon TCG API (conjunto e número validados)"},
  "018/108":{name:"arcanine",setName:"Evolutions",url:"https://images.pokemontcg.io/xy12/18_hires.png",source:"Pokémon TCG API (conjunto e número validados)"},
  "100/100":{name:"zapdos lv.30",aliases:["zapdos shiny","zapdos"],url:"https://cdn.pooka.app/card/ja-dpt3-100.png",language:"Japonês",source:"Pooka — Beat of the Frontier (DPt3), 100/100"}
};

export function getCardReference(product: Pick<Product,"name"|"card_number"|"language"|"set_name">) {
  const match=references[product.card_number.trim()];
  if (!match) return null;
  const name=product.name.trim().toLowerCase();
  if (match.name!==name && !match.aliases?.includes(name)) return null;
  if (match.setName && match.setName !== product.set_name) return null;
  const language=match.language??"Inglês";
  return {url:match.url,language,matchesLanguage:product.language===language,source:match.source??"Pokémon TCG API (comunitária)"};
}
