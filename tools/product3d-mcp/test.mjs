import test from "node:test";
import assert from "node:assert/strict";
import {validateImageUrl,renderManifest} from "./tripo.mjs";
test("rejects local URL",()=>assert.throws(()=>validateImageUrl("http://localhost/test.png")));
test("creates four 3:4 shots",()=>{const x=renderManifest({productId:"bong-barbie",modelUrl:"https://example.com/model.glb"});assert.equal(x.shots.length,4);assert.ok(x.shots.every(s=>s.width===1200&&s.height===1600));assert.equal(x.published,false)});
