import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const ui=read("src/components/catalog.tsx"),admin=read("src/components/admin-dashboard.tsx"),css=read("src/app/official-theme.css"),brand=read("public/brand/pokeball-horizontal-v3.svg");
test("horizontal Pokeball mark uses approved brand colors",()=>{
 for(const x of ["clipPath id=\"disc\"","#FFCB05","#0055C5"]) assert.ok(brand.includes(x),x);
 assert.match(brand,/transform="translate\(/);
 assert.doesNotMatch(brand,/<text\s|textLength=|font-family=/);
 assert.match(brand,/viewBox="0 0 660 150"/);
});
test("catalog header, footer, admin and favicon retain brand while collector banner does not repeat logo",()=>{
 assert.equal(ui.split('src="/brand/pokeball-horizontal-v3.svg"').length-1,2);
 assert.doesNotMatch(ui,/className="et-collector-brand"/);
 assert.equal(admin.split('src="/brand/pokeball-mark-v2.svg"').length-1,2);
 assert.match(read("src/app/layout.tsx"),/pokeball-mark-v2\.svg/);
 assert.doesNotMatch(ui,/className="brand-mark"/);
});
test("responsive horizontal wordmark remains within mobile header",()=>{
 assert.match(css,/@media\(max-width:600px\)\{\.brand\{width:181px/);
 assert.doesNotMatch(ui,/et-collector-brand-logo/);
});
