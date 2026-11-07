import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const root=resolve(import.meta.dirname,'..');
const meta=JSON.parse(readFileSync(resolve(root,'data/image-provenance.json'),'utf8'));
const matching=['charmander-109-091','riolu-173-091','lucario-174-091','pikachu-131-091','snorlax-202-091','oddish-092-091','sneasel-182-091','slowpoke-116-091'];
test('imagens recortadas e ampliadas com tamanho uniforme',()=>{
 assert.equal(meta.length,11);
 for(const item of meta){
  assert.deepEqual(item.size_px,[1200,1680]);
  assert.ok(existsSync(resolve(root,item.file)), item.file);
 }
});
test('não troca Ditto 201/091 nem publica variantes sem preço',()=>{
 const seed=readFileSync(resolve(root,'src/lib/demo-data.ts'),'utf8');
 for(const slug of matching) assert.ok(seed.includes(`/cards/shiny/${slug}-hq.webp`));
 assert.ok(seed.includes('ditto-201-091-front.webp'));
 assert.ok(seed.includes('ditto-309-190-jp-hq.webp'));
 assert.ok(seed.includes('applin-sv012-sv122-hq.webp'));
 assert.ok(seed.includes('"condition": "NM"'));
 const drafts=seed.split('\n').filter(x=>x.includes('"is_published": false'));
 assert.equal(drafts.length,2);
});
test('hover de CTA apresenta texto branco em contraste sobre azul-marinho',()=>{
 const css=readFileSync(resolve(root,'src/app/official-theme.css'),'utf8');
 assert.match(css,/\.add-button:not\(:disabled\):hover/);
 assert.match(css,/background:#003A70 !important;/);
 assert.match(css,/color:#FFFFFF !important;/);
});
