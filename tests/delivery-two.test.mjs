import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const catalog = source("src/components/catalog.tsx");
const viewer = source("src/components/card-detail-viewer.tsx");
const rotation = source("src/components/card-360-viewer.tsx");
const config = source(".env.example");

test("WhatsApp commercial route and checkout use the correct number", () => {
  assert.match(catalog, /5511984477950/);
  assert.match(config, /NEXT_PUBLIC_WHATSAPP_NUMBER=5511984477950/);
  assert.match(catalog, /whatsAppUrl\(PHONE, whatsAppMessage\(reconciled, current\)\)/);
  assert.match(catalog, /window\.location\.assign\(url\)/);
  assert.match(catalog, /Falar no WhatsApp/);
});
test("360 rotation remains accessible and pauses when not visible", () => {
  assert.match(rotation, /IntersectionObserver/);
  assert.match(rotation, /visibilitychange/);
  assert.match(rotation, /prefers-reduced-motion/);
  assert.match(rotation, /onPointerMove/);
  assert.match(rotation, /onKeyDown/);
});
test("Zoom allows mouse wheel, double tap, pinch, keyboard and focus containment", () => {
  assert.match(viewer, /onWheel=/);
  assert.match(viewer, /lastTap\.current/);
  assert.match(viewer, /pinch\.current/);
  assert.match(viewer, /event\.key === "Tab"/);
  assert.match(viewer, /event\.key === "Escape"/);
});
