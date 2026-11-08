import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const ref=read("src/lib/card-reference.ts");
const vintage=JSON.parse(read("src/lib/vintage-data.ts").split("= [")[1].split("];")[0].replace(/^/,"["));
test("24 imagens HD com id da edição e número do anúncio",()=>{
 const names={Evolutions:"xy12","Gym Heroes":"gym1","Neo Revelation":"neo3","Base Set":"base1"};
 assert.equal(vintage.length,24);
 for(const card of vintage){
  const set=names[card.set_name],number=String(Number(card.card_number.split("/")[0]));
  assert.ok(set,card.card_number);
  const u="https://images.pokemontcg.io/"+set+"/"+number+"_hires.png";
  assert.ok(ref.includes(u),card.name+" "+card.card_number);
  assert.ok(ref.includes('setName:'+JSON.stringify(card.set_name)));
 }
});
test("distingue edições, preserva imagem enviada e fallback",()=>{
 assert.match(ref,/match\.setName && match\.setName !== product\.set_name/);
 assert.match(read("src/components/catalog.tsx"),/referenceFailed/);
 assert.match(read("src/components/card-detail-viewer.tsx"),/setReferenceFailed/);
 for(const card of vintage)assert.match(card.front_url,/^\/cards\/vintage\//);
});
