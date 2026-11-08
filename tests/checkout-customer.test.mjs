import test from "node:test";
import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import path from "node:path";
import {createRequire} from "node:module";
const root=path.resolve(import.meta.dirname,".."),output=mkdtempSync(path.join(tmpdir(),"et-checkout-"));
try{
  execFileSync("tsc",["src/lib/checkout.ts","--strict","--target","ES2022","--module","commonjs","--moduleResolution","node","--outDir",output],{cwd:root,stdio:"pipe"});
  const require=createRequire(import.meta.url);
  const {cleanCheckoutCustomer,validateCheckoutCustomer,customerWhatsAppMessage}=require(path.join(output,"checkout.js"));
  const customer={firstName:"Lia",lastName:"Silva",email:"LIA@EXAMPLE.COM",phone:"(11) 98888-7777",cep:"01317-002",street:"Rua Exemplo",number:"25",complement:"Apto 3",neighborhood:"Bela Vista",city:"São Paulo",state:"sp"};
  test("dados completos e normalização segura",()=>{
    assert.deepEqual(validateCheckoutCustomer(customer),{});
    const clean=cleanCheckoutCustomer(customer);
    assert.equal(clean.phone,"11988887777");
    assert.equal(clean.cep,"01317002");
    assert.equal(clean.email,"lia@example.com");
    assert.equal(clean.state,"SP");
  });
  test("rejeita nome, sobrenome, contato e endereço ausentes",()=>{
    const errors=validateCheckoutCustomer({firstName:"",lastName:"",email:"no",phone:"123",cep:"1",street:"",number:"",complement:"",neighborhood:"",city:"",state:"XY"});
    for(const f of ["firstName","lastName","email","phone","cep","street","number","neighborhood","city","state"])assert.ok(errors[f],f);
  });
  test("whatsapp inclui dados do cliente com endereço sem inventar estoque",()=>{
    const product={id:"a",name:"Pikachu",set_name:"Evolutions",card_number:"035/108",condition:"NM",language:"Inglês",finish:"Normal",price_cents:5000,stock:1,is_published:true};
    const message=customerWhatsAppMessage({a:1},[product],customer);
    for(const s of ["Lia Silva","lia@example.com","11988887777","Rua Exemplo, 25","Bela Vista","São Paulo/SP","01317002","Pikachu"])assert.ok(message.includes(s),s);
    assert.equal(customerWhatsAppMessage({},[product],customer),"");
    assert.equal(customerWhatsAppMessage({a:1},[product],{...customer,email:"invalid"}),"");
  });
}finally{rmSync(output,{recursive:true,force:true});}
