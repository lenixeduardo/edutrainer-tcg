import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const ui=read("src/components/catalog.tsx"), css=read("src/app/hero-shiny.css");
test("hero renovada mantém links funcionais e imagens Shiny locais",()=>{
  assert.match(ui,/hero container hero-shiny/);
  assert.match(ui,/href="#catalogo"/);
  assert.match(ui,/href="#como-funciona"/);
  assert.match(ui,/Colecione o que importa/);
  for(const name of ["charmander","pikachu","lucario","riolu","slowpoke","snorlax"]){
    assert.ok(ui.includes("/cards/shiny/"+name),name);
  }
  assert.doesNotMatch(ui,/hero-card-outlines\.svg/);
});
test("mobile mantém imagens visíveis e textos legíveis",()=>{
  assert.match(css,/@media\(max-width:600px\)/);
  assert.match(css,/\.hero-shiny \.hero-shiny-art\{order:2/);
  assert.match(css,/font-size:34px/);
  assert.match(css,/#101E39/);
  assert.match(css,/#44566E/);
  assert.match(css,/#FFCB05/);
  assert.match(css,/focus-visible/);
  assert.match(read("src/app/layout.tsx"),/hero-shiny\.css/);
});
