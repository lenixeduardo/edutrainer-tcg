import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url));
const ui=read("src/components/catalog.tsx").toString("utf8");
const css=read("src/app/how-photo-section.css").toString("utf8");
const layout=read("src/app/layout.tsx").toString("utf8");
test("seção Como comprar usa foto enviada e três etapas originais",()=>{
 assert.match(ui,/className="how-section how-photo-section"/);
 assert.match(ui,/id="como-funciona"/);
 assert.match(ui,/srcSet="\/banners\/como-comprar-mobile-v1\.webp"/);
 assert.match(ui,/src="\/banners\/como-comprar-desktop-v1\.webp"/);
 for(const title of ["Explore as cartas","Monte seu carrinho","Finalize na conversa"])assert.ok(ui.includes(title));
 assert.match(ui,/alt="Pessoa segurando cartas Pokémon protegidas/);
 assert.match(layout,/how-photo-section\.css/);
});
test("duas imagens locais WebP têm resolução e tamanho adequados",()=>{
 const files=[["public/banners/como-comprar-desktop-v1.webp",90000],["public/banners/como-comprar-mobile-v1.webp",85000]];
 for(const [path,minimum] of files){
  const bytes=read(path);
  assert.ok(bytes.length>minimum,path);
  assert.equal(bytes.toString("ascii",0,4),"RIFF");
  assert.equal(bytes.toString("ascii",8,12),"WEBP");
 }
});
test("layout foto desktop e mobile preserva hierarquia e contraste",()=>{
 assert.match(css,/grid-template-columns: minmax\(0, 1\.06fr\) minmax\(0, \.94fr\)/);
 assert.match(css,/@media \(max-width: 700px\)/);
 assert.match(css,/aspect-ratio: 4 \/ 3/);
 assert.match(css,/\.how-photo-visual img/);
 assert.match(css,/object-fit: cover/);
 assert.match(css,/color: #101E39/);
 assert.match(css,/color: #44566E/);
});
test("seções hero e banner de coleção permanecem",()=>{
 assert.match(ui,/hero container hero-shiny/);
 assert.match(ui,/et-collector-banner container/);
 assert.match(ui,/Sua próxima carta favorita pode estar/);
});
