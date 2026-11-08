import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const ui=read("src/components/catalog.tsx");
const css=read("src/app/collector-banner.css");
const layout=read("src/app/layout.tsx");

test("Mantém hero existente e inclui banner antes do footer",()=>{
  assert.match(ui,/hero container hero-shiny/);
  assert.match(ui,/hero-shiny-album/);
  assert.match(ui,/et-collector-banner container/);
  assert.ok(ui.indexOf('className="et-collector-banner')>ui.indexOf('className="how-section'));
  assert.ok(ui.indexOf('className="et-collector-banner')<ui.indexOf('<footer'));
  assert.match(ui,/Sua próxima carta favorita pode estar/);
});
test("Banner tem Pokébola, foto local e ambos os links funcionais",()=>{
  assert.ok(ui.includes('src="/brand/pokeball-horizontal-v2.svg"'));
  assert.match(ui,/edutrainer-collector-photo-hd-v2\.avif/);
  assert.match(ui,/href="#catalogo"/);
  assert.match(ui,/et-collector-secondary" href=\{CONTACT_URL\}/);
  assert.doesNotMatch(ui,/et-collector-caption|Imagem ilustrativa · confira as fotos individuais/);
  const photo=readFileSync(new URL("../public/banners/edutrainer-collector-photo-hd-v2.avif",import.meta.url));
  assert.ok(photo.length>120000,"Imagem HD deve ter mais qualidade que a antiga versão de 5,8 KB");
  assert.equal(photo.toString("ascii",4,8),"ftyp");
  assert.match(layout,/collector-banner\.css/);
});
test("Responsividade mobile e foco de teclado",()=>{
  assert.match(css,/@media\(max-width:600px\)/);
  assert.match(css,/flex-direction:column/);
  assert.match(css,/aspect-ratio:1094\/701/);
  assert.match(css,/min-height:44px/);
  assert.match(css,/focus-visible/);
  assert.match(css,/prefers-reduced-motion/);
  assert.match(css,/#003A70/);
  assert.match(css,/#FFCB05/);
});
