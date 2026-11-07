import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read = p => readFileSync(new URL("../"+p,import.meta.url),"utf8");
const cards = JSON.parse(read("data/shiny-cards-source.json"));
const css = read("src/app/official-theme.css");
const refs = read("src/lib/card-reference.ts");
const ui = read("src/components/catalog.tsx");
const seed = read("src/lib/demo-data.ts");
test("11 cartas corretas e preços inalterados", () => {
 assert.equal(cards.length,11);
 assert.equal(new Set(cards.map(x=>x.card_number)).size,11);
 assert.equal(cards.reduce((n,x)=>n+x.price_cents,0),139390);
 for(const x of cards){
   assert.ok(x.card_number==="100/100" ? x.set_name==="Beat of the Frontier (Pt3)" : ["Paldean Fates","Destinos de Paldea"].includes(x.set_name));
   if(x.card_number.endsWith("/091"))assert.ok(["Shiny Rare","Rara Shiny"].includes(x.rarity));
   assert.ok(seed.includes(x.id));
 }
});
test("Riolu e Sneasel com referências HD e fallback preservado", () => {
 assert.match(refs,/sv4pt5\\/173_hires\\.png/);
 assert.match(refs,/sv4pt5\\/182_hires\\.png/);
 assert.match(refs,/ja-dpt3-100\\.png/);
 assert.match(ui,/referenceFailed/);
});
test("proporção fiel, botões e identidade preservados", () => {
 assert.match(css,/aspect-ratio:63\\/88/);
 assert.match(css,/object-fit:contain/);
 assert.match(css,/max-height:none/);
 assert.match(ui,/et-product-meta/);
 assert.doesNotMatch(ui,/et-art-badge/);
 assert.match(css,/#003A70/);
 assert.match(css,/#FFCB05/);
 assert.match(ui,/updateCart/);
});
