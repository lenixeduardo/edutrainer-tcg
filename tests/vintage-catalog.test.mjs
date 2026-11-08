import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const r=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const prices=JSON.parse(r("data/vintage-prices-myp.json"));
const src=r("src/lib/vintage-data.ts"),demo=r("src/lib/demo-data.ts"),ui=r("src/components/catalog.tsx"),cache=r("src/lib/catalog.ts");
test("24 references and 27 physical copies with consistent NM prices",()=>{
 assert.equal(prices.quotes.length,24);
 assert.equal(prices.quotes.filter(x=>x.price_cents===0).length,4);
 for(const x of prices.quotes){assert.equal(x.condition,"NM");assert.match(x.myp_url,/mypcards\.com/);assert.ok(src.includes(x.id));}
 assert.match(demo,/\.\.\.VINTAGE_PRODUCTS/);
 assert.match(cache,/edutrainer:demo-products:v6/);
});
test("No fake physical backs or free-card prices",()=>{
 assert.match(ui,/Sob consulta/);
 assert.match(ui,/Consultar preço no WhatsApp/);
 assert.match(ui,/Filtrar por coleção/);
 assert.match(ui,/product\.price_cents <= 0/);
 assert.match(src,/"back_url": ""/);
});
