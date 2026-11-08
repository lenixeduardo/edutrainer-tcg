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
 assert.match(catalog,/edutrainer:demo-products:v8/);
 assert.match(catalog,/edutrainer:demo-products:v7/);
 assert.match(catalog,/enforcePriceFloor/);
});
test("custo não é divulgado no bundle público",()=>{
 assert.doesNotMatch(policy,/acquisition_cost_cents|cost_cents\s*:/);
 assert.match(policy,/MIN_PROFIT_CENTS = 2000/);
});


test("12 preços baixos sem custo documentado não são oferecidos como venda",()=>{
 const quoteIds=["ebfb7e64-d958-5ec5-bcca-3ccd811a5301","0e0da525-cbd6-5d54-a6b2-952115c04084","dd28c604-7c5a-5b85-b1d7-06502350d2f0","67dd1ef7-3ddb-58ff-beda-a0514e74cac6","7217ea73-0a27-5606-a479-5f5df21bb10f","69481f5d-2307-5e47-b30e-51c8c6e15f4a","bbdee41e-b7f5-5bc1-a02e-9b4da3196bf4","4ef53bfc-f70b-526f-b6dc-9344bfc03399","ea6172a7-1648-5668-a278-97b042561060","a9c3410b-164d-5052-a644-5b881393cb66","45733035-597b-5891-91a5-8362fb52cfe3","5aaa2df1-bae3-56b1-847e-92d0e6a178b0"];
 for(const id of quoteIds){
  const product=vintage.find(p=>p.id===id);
  assert.ok(product);
  assert.equal(product.price_cents,0,`${product.name} deve mostrar Sob consulta`);
 }
 assert.match(policy,/MIN_UNVERIFIED_LISTING_CENTS = 2300/);
 assert.match(policy,/price_cents:0/);
 assert.match(ui,/Sob consulta/);
});
test("retira aviso de demonstração da vitrine e preserva confirmação do estoque",()=>{
 assert.doesNotMatch(ui,/AMBIENTE DE DEMONSTRAÇÃO|carrinho de demonstração|Editar catálogo demo/);
 assert.match(ui,/A confirmar antes da compra/);
 assert.match(catalog,/\.map\(enforcePriceFloor\)/);
 assert.match(read("src/lib/business.ts"),/item\.price_cents > 0/);
});
