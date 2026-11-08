import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const text=read("src/lib/vintage-data.ts");
const vintage=JSON.parse(text.slice(text.indexOf("= [")+2,text.lastIndexOf("]")+1));
const policy=read("src/lib/selling-policy.ts");
const catalog=read("src/lib/catalog.ts");
const admin=read("src/components/admin-dashboard.tsx");
const ui=read("src/components/catalog.tsx");
const expected=[
 ["Mewtwo","051/108",16490,"NM"],
 ["Pikachu","035/108",7990,"NM"],
 ["Here Comes Team Rocket!","113/108",7990,"NM"],
 ["Misty's Determination","080/108",5990,"NM"],
 ["Gastly","047/108",3490,"NM"],
 ["Misty's Wrath","114/132",8490,"HP"],
 ["Misty's Duel","123/132",10990,"SP"]
];
test("7 preços de venda acima do piso de margem preservados",()=>{
 for(const [name,n,price,condition] of expected){
  const card=vintage.find(p=>p.name===name && p.card_number===n);
  assert.ok(card,name+" "+n);
  assert.equal(card.price_cents,price);
  assert.equal(card.condition,condition);
  assert.ok(policy.includes(JSON.stringify(card.id)+": "+price));
 }
 assert.equal(expected.length,7);
});
test("quantidade do Gastly normal fica separada do foil não identificado",()=>{
 const gastly=vintage.find(p=>p.name==="Gastly" && p.card_number==="047/108");
 assert.equal(gastly.stock,1);
 assert.equal(vintage.length,24);
});
test("piso impedido em administração e no envio ao WhatsApp",()=>{
 assert.match(admin,/minimumSalePrice\(draft\)/);
 assert.match(ui,/priceBelowPolicy\(product\)/);
 assert.match(catalog,/priceBelowPolicy\(product\)/);
 assert.match(catalog,/edutrainer:demo-products:v7/);
 assert.match(catalog,/edutrainer:demo-products:v6/);
 assert.match(catalog,/enforcePriceFloor/);
});
test("custo não é divulgado no bundle público",()=>{
 assert.doesNotMatch(policy,/acquisition_cost_cents|cost_cents\s*:/);
 assert.match(policy,/MIN_PROFIT_CENTS = 2000/);
});
