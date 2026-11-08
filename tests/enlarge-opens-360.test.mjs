import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const viewer=read("src/components/card-detail-viewer.tsx");
const css=read("src/app/card-detail.css");
const rotation=read("src/components/card-360-viewer.tsx");

test("Abrir ampliação entra no giro quando há verso cadastrado",()=>{
 assert.match(viewer,/const handleOpenInspection = \(\) => setInspection\(hasBack \? "360" : "zoom"\)/);
 assert.match(viewer,/onClick=\{handleOpenInspection\}/);
 assert.match(viewer,/inspection === "360" && hasBack && <Card360Dialog/);
 assert.match(viewer,/Card360Viewer product=\{product\}/);
 assert.match(viewer,/Abrir ampliação \{hasBack \? "360°" : ""\}/);
});
test("sem verso usa zoom comum; evita inventar o outro lado",()=>{
 assert.match(viewer,/hasBack \? "360" : "zoom"/);
 assert.match(viewer,/inspection === "zoom" && url && <ZoomDialog/);
 assert.match(viewer,/onBackTo360=\{hasBack \? \(\) => setInspection\("360"\) : undefined\}/);
});
test("janela 360 acessível com foco, Escape e giro por toque",()=>{
 assert.match(viewer,/role="dialog" aria-modal="true"/);
 assert.match(viewer,/data-zoom-open="true"/);
 assert.match(viewer,/event.key === "Escape"/);
 assert.match(viewer,/event.key === "Tab"/);
 assert.match(viewer,/onZoom=\{\(\) => setInspection\("zoom"\)\}/);
 assert.match(css,/\.et-360-dialog/);
 assert.match(css,/max-height:100dvh/);
 assert.match(css,/touch-action:none/);
 assert.match(rotation,/onPointerMove=\{onPointerMove\}/);
 assert.match(rotation,/prefers-reduced-motion/);
});
