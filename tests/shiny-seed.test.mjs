import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const cards = JSON.parse(readFileSync(path.join(root, 'data/shiny-cards-source.json'), 'utf8'));
assert.equal(cards.length, 11, 'Deve haver 11 cartas');
assert.equal(new Set(cards.map(x => x.id)).size, 11, 'IDs sem duplicatas');
assert.equal(new Set(cards.map(x => x.card_number)).size, 11, 'Números sem duplicatas');
assert.equal(cards.reduce((sum, x) => sum + x.price_cents, 0), 139390, 'Total em centavos');
assert.deepEqual(cards.map(x => x.price_cents), cards.map(x => x.price_cents).sort((a,b) => b-a), 'Ordem por preço');
for (const card of cards) {
  assert.ok(card.name.length > 1);
  assert.ok(/^\d{3}\/\d{3}$/.test(card.card_number));
  for (const field of ['front_url','back_url']) {
    assert.ok(card[field].startsWith('/cards/shiny/'));
    assert.ok(existsSync(path.join(root,'public',card[field])), `${card.name}: ${field}`);
  }
}
const seed = readFileSync(path.join(root,'src/lib/demo-data.ts'),'utf8');
const sql = readFileSync(path.join(root,'supabase/import-shiny-cards.sql'),'utf8');
for (const card of cards) {
  assert.ok(seed.includes(card.id), `Demo contém ${card.name}`);
  assert.ok(sql.includes(card.id), `SQL contém ${card.name}`);
}
assert.ok(sql.includes('ON CONFLICT (id) DO NOTHING'));
assert.ok(sql.includes("'0'" ) === false, 'Preço e estoque numéricos');
console.log('Lote Shiny OK — 11 cartas, 22 imagens, 11 IDs consistentes, R$ 1.393,90.');
