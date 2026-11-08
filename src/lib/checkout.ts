import type { Cart, Product } from "./types";
import { whatsAppMessage } from "./business";

export type CheckoutCustomer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
};

export const EMPTY_CUSTOMER: CheckoutCustomer = {
  firstName:"",lastName:"",email:"",phone:"",cep:"",street:"",
  number:"",complement:"",neighborhood:"",city:"",state:""
};
export const CUSTOMER_FIELDS = Object.keys(EMPTY_CUSTOMER) as (keyof CheckoutCustomer)[];
export const CUSTOMER_STORAGE_KEY = "edutrainer:checkout-customer:v1";
const STATES = new Set("AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" "));
const trimmed = (value:string) => value.replace(/[\r\n\t\u0000-\u001f]/g," ").replace(/\s+/g," ").trim();
const onlyDigits = (value:string) => value.replace(/\D/g,"");
const phoneDigits = (value:string) => {
  const digits = onlyDigits(value);
  return digits.startsWith("55") && (digits.length===12 || digits.length===13) ? digits.slice(2) : digits;
};
export function cleanCheckoutCustomer(value:CheckoutCustomer):CheckoutCustomer {
  const result={...EMPTY_CUSTOMER};
  for(const field of CUSTOMER_FIELDS)result[field]=trimmed(String(value[field]??"")).slice(0,160);
  result.email=result.email.toLowerCase();
  result.state=result.state.toUpperCase();
  result.cep=onlyDigits(result.cep);
  result.phone=phoneDigits(result.phone);
  return result;
}
export type CheckoutErrors = Partial<Record<keyof CheckoutCustomer,string>>;
export function validateCheckoutCustomer(raw:CheckoutCustomer):CheckoutErrors {
  const c=cleanCheckoutCustomer(raw), e:CheckoutErrors={};
  if(c.firstName.length<2 || c.firstName.length>80)e.firstName="Informe seu nome.";
  if(c.lastName.length<2 || c.lastName.length>80)e.lastName="Informe seu sobrenome.";
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)||c.email.length>160)e.email="Informe um e-mail válido.";
  if(!/^[1-9]\d(?:9\d{8}|[2-9]\d{7})$/.test(c.phone))e.phone="Informe o telefone com DDD (10 ou 11 dígitos).";
  if(!/^\d{8}$/.test(c.cep))e.cep="Informe o CEP com 8 dígitos.";
  if(c.street.length<3)e.street="Informe sua rua ou avenida.";
  if(!c.number)e.number="Informe o número ou S/N.";
  if(c.neighborhood.length<2)e.neighborhood="Informe seu bairro.";
  if(c.city.length<2)e.city="Informe sua cidade.";
  if(!STATES.has(c.state))e.state="Escolha uma UF válida (ex.: SP).";
  return e;
}
export function customerWhatsAppMessage(cart:Cart,products:Product[],raw:CheckoutCustomer):string {
  if(Object.keys(validateCheckoutCustomer(raw)).length)return "";
  const c=cleanCheckoutCustomer(raw),order=whatsAppMessage(cart,products);
  if(!order)return "";
  return [
    order,"","DADOS INFORMADOS PELO CLIENTE",
    "Nome: "+c.firstName+" "+c.lastName,
    "E-mail: "+c.email,
    "Telefone: +55 "+c.phone,
    "Endereço: "+c.street+", "+c.number+(c.complement?" — "+c.complement:""),
    "Bairro: "+c.neighborhood,
    "Cidade/UF: "+c.city+"/"+c.state,
    "CEP: "+c.cep,
    "","Por favor, confirme estoque, frete e condições antes de finalizar."
  ].join("\n");
}
