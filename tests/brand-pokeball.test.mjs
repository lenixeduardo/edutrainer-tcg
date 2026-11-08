import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const ui=read("src/components/catalog.tsx"),admin=read("src/components/admin-dashboard.tsx"),css=read("src/app/official-theme.css"),brand=read("public/brand/pokeball-horizontal-v2.svg");
test("horizontal Pokeball mark uses approved brand colors",()=>{
 for(const x of ["EduTrainer</text>","TCG</text>","ballClip","#FFCB05","#0051CD"]) assert.ok(brand.includes(x),x);
});
test("catalog header footer collector banner admin and favicon use same identity",()=>{
 assert.equal(ui.split('src="/brand/pokeball-horizontal-v2.svg"').length-1,3);
 assert.equal(admin.split('src="/brand/pokeball-mark-v2.svg"').length-1,2);
 assert.match(read("src/app/layout.tsx"),/pokeball-mark-v2\.svg/);
 assert.doesNotMatch(ui,/className="brand-mark"/);
});
test("responsive horizontal wordmark remains within mobile header",()=>{
 assert.match(css,/@media\(max-width:600px\)\{\.brand\{width:181px/);
 assert.match(read("src/app/collector-banner.css"),/\.et-collector-brand-logo/);
});
