"use client";
import {useEffect,useRef,useState,type FormEvent} from "react";
import {ArrowLeft,ArrowRight,LockKeyhole,X} from "lucide-react";
import {
  cleanCheckoutCustomer,CUSTOMER_STORAGE_KEY,EMPTY_CUSTOMER,
  validateCheckoutCustomer,type CheckoutCustomer,type CheckoutErrors
} from "@/lib/checkout";

type Props={count:number;submitting:boolean;onClose:()=>void;onSubmit:(customer:CheckoutCustomer)=>void|Promise<void>};
type Field=keyof CheckoutCustomer;

export default function CustomerCheckout({count,submitting,onClose,onSubmit}:Props){
  const [values,setValues]=useState<CheckoutCustomer>(EMPTY_CUSTOMER);
  const [errors,setErrors]=useState<CheckoutErrors>({});
  const [remember,setRemember]=useState(false);
  const [consent,setConsent]=useState(false);
  const [submitted,setSubmitted]=useState(false);
  const sectionRef=useRef<HTMLElement|null>(null);

  useEffect(()=>{
    try{
      const saved=localStorage.getItem(CUSTOMER_STORAGE_KEY);
      if(saved){
        const parsed:unknown=JSON.parse(saved);
        if(parsed && typeof parsed==="object"){
          setValues(cleanCheckoutCustomer({...EMPTY_CUSTOMER,...parsed}));
          setRemember(true);
        }
      }
    }catch{ /* armazenamento local indisponível */ }
  },[]);

  useEffect(()=>{
    const previous=document.activeElement as HTMLElement|null,modal=sectionRef.current;
    modal?.querySelector<HTMLInputElement>('input[name="firstName"]')?.focus();
    const key=(event:KeyboardEvent)=>{
      if(event.key==="Escape"&&!submitting){event.preventDefault();event.stopPropagation();onClose();}
      if(event.key!=="Tab"||!modal)return;
      const all=Array.from(modal.querySelectorAll<HTMLElement>("button:not(:disabled),input:not(:disabled),select:not(:disabled)"));
      const first=all[0],last=all[all.length-1];
      if(!first||!last)return;
      if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
    };
    document.addEventListener("keydown",key,true);
    return ()=>{document.removeEventListener("keydown",key,true);previous?.focus();};
  },[onClose,submitting]);

  const update=(field:Field,value:string)=>{
    setValues(old=>({...old,[field]:field==="state"?value.toUpperCase():value}));
    setErrors(old=>({...old,[field]:undefined}));
  };
  const field=(key:Field,title:string,autocomplete:string,options?:{kind?:string;inputMode?:"numeric"|"tel";max?:number;hint?:string})=>(
    <label key={key} className="et-checkout-field">
      <span>{title}{key!=="complement" && <b aria-hidden="true"> *</b>}</span>
      <input name={key} type={options?.kind??"text"} autoComplete={autocomplete}
        inputMode={options?.inputMode} maxLength={options?.max??120}
        value={values[key]} onChange={event=>update(key,event.currentTarget.value)}
        required={key!=="complement"} aria-invalid={Boolean(errors[key])}
        aria-describedby={errors[key]?"et-checkout-"+key+"-error":undefined}
        placeholder={options?.hint} disabled={submitting}/>
      {errors[key] && <small id={"et-checkout-"+key+"-error"} role="alert">{errors[key]}</small>}
    </label>
  );

  const submit=(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    setSubmitted(true);
    const invalid=validateCheckoutCustomer(values);
    setErrors(invalid);
    if(Object.keys(invalid).length||!consent){
      const first=Object.keys(invalid)[0];
      if(first)sectionRef.current?.querySelector<HTMLInputElement>('[name="'+first+'"]')?.focus();
      return;
    }
    const normalized=cleanCheckoutCustomer(values);
    try{
      if(remember)localStorage.setItem(CUSTOMER_STORAGE_KEY,JSON.stringify(normalized));
      else localStorage.removeItem(CUSTOMER_STORAGE_KEY);
    }catch{ /* não impede o checkout */ }
    void onSubmit(normalized);
  };

  return <div className="et-checkout-backdrop" role="presentation" onMouseDown={event=>{
    if(event.target===event.currentTarget&&!submitting)onClose();
  }}>
    <section className="et-checkout-panel" ref={sectionRef} role="dialog" aria-modal="true" aria-labelledby="et-checkout-title">
      <div className="et-checkout-head">
        <div>
          <small>ETAPA FINAL · {count} {count===1?"CARTA":"CARTAS"}</small>
          <h2 id="et-checkout-title">Dados para o pedido</h2>
          <p>Preencha seus dados para consultar frete e disponibilidade pelo WhatsApp.</p>
        </div>
        <button type="button" onClick={onClose} disabled={submitting} aria-label="Fechar cadastro de compra"><X size={21}/></button>
      </div>
      <form className="et-checkout-form" onSubmit={submit} noValidate>
        <div className="et-checkout-section">
          <h3>Contato</h3>
          <div className="et-checkout-grid">
            {field("firstName","Nome","given-name",{max:80,hint:"Nome"})}
            {field("lastName","Sobrenome","family-name",{max:80,hint:"Sobrenome"})}
            <div className="et-checkout-wide">{field("email","E-mail","email",{kind:"email",max:160,hint:"voce@exemplo.com"})}</div>
            <div className="et-checkout-wide">{field("phone","Telefone com DDD","tel",{kind:"tel",inputMode:"tel",max:24,hint:"(11) 99999-9999"})}</div>
          </div>
        </div>
        <div className="et-checkout-section">
          <h3>Endereço de entrega</h3>
          <div className="et-checkout-grid">
            {field("cep","CEP","postal-code",{inputMode:"numeric",max:10,hint:"00000-000"})}
            {field("state","UF","address-level1",{max:2,hint:"SP"})}
            <div className="et-checkout-wide">{field("street","Rua ou avenida","address-line1",{max:120,hint:"Nome do logradouro"})}</div>
            {field("number","Número","off",{max:20,hint:"Número ou S/N"})}
            {field("complement","Complemento (opcional)","address-line2",{max:80,hint:"Apto., bloco, casa..."})}
            {field("neighborhood","Bairro","address-level3",{max:90})}
            {field("city","Cidade","address-level2",{max:90})}
          </div>
        </div>
        <div className="et-checkout-privacy">
          <label><input type="checkbox" checked={remember} onChange={event=>setRemember(event.currentTarget.checked)} disabled={submitting}/><span>Salvar meus dados <strong>neste dispositivo</strong> para futuros pedidos (opcional).</span></label>
          <label><input type="checkbox" checked={consent} onChange={event=>setConsent(event.currentTarget.checked)} required disabled={submitting}/><span>Autorizo o envio dos dados de contato e endereço na mensagem do WhatsApp para atendimento, cálculo de frete e entrega.</span></label>
          {submitted&&!consent && <p className="et-checkout-consent-error" role="alert">Autorize o envio dos dados para continuar.</p>}
          <p><LockKeyhole size={15}/> Os dados não são enviados ao servidor do catálogo. Se optar por salvá-los, ficarão apenas neste navegador.</p>
        </div>
        <div className="et-checkout-footer">
          <button type="button" className="et-checkout-back" onClick={onClose} disabled={submitting}><ArrowLeft size={17}/> Voltar ao carrinho</button>
          <button type="submit" className="et-checkout-submit" disabled={submitting}>{submitting?"Conferindo estoque...":"Continuar no WhatsApp"}<ArrowRight size={17}/></button>
          <p>O pedido só será enviado ao confirmar a mensagem no WhatsApp. Nenhum pagamento ou reserva ocorre nesta etapa.</p>
        </div>
      </form>
    </section>
  </div>;
}
