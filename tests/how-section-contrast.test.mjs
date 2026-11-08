import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const css=readFileSync(new URL("../src/app/official-theme.css",import.meta.url),"utf8");
const base=readFileSync(new URL("../src/app/globals.css",import.meta.url),"utf8");
const contrast=(fg,bg)=>{
 const l=h=>{const s=h.replace("#","");const v=[0,2,4].map(i=>parseInt(s.slice(i,i+2),16)/255).map(c=>c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4);return 0.2126*v[0]+0.7152*v[1]+0.0722*v[2];};
 const a=l(fg),b=l(bg);return (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
};
test("corrige herança do tema antigo e deixa títulos legíveis",()=>{
 assert.match(base,/\.how-section\{background:#242626;color:#f6f5f0/);
 assert.match(css,/\.how-section\{background:#F3F8FF;border-block:1px solid #E1EBF7;color:#101E39\}/);
 assert.match(css,/\.how-section \.how-grid h3\{color:#101E39\}/);
 assert.match(css,/\.how-section \.how-grid p\{color:#44566E\}/);
});
test("texto normal e indicadores de etapa atendem a WCAG AA",()=>{
 for(const color of ["#101E39","#44566E","#235C9D"]){
   assert.ok(contrast(color,"#F3F8FF")>=4.5, `Baixo contraste: ${color}`);
 }
 assert.match(css,/\.how-section \.how-index\{color:#235C9D\}/);
 assert.match(css,/\.how-section \.section-eyebrow\{color:#44566E\}/);
});
test("não altera a identidade branca azul e amarela",()=>{
 for(const color of ["#003A70","#3D7DCA","#FFCB05"])assert.ok(css.includes(color));
 assert.match(css,/\.how-section h2 em\{color:#3D7DCA\}/);
});
