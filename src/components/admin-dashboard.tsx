"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, ImagePlus, LayoutGrid, LogOut, Package, Pencil, Plus, Search, Shield, Trash2, X } from "lucide-react";
import type { Product, Category, Language, Condition, Finish } from "@/lib/types";
import { money, parsePrice } from "@/lib/business";
import { minimumSalePrice } from "@/lib/selling-policy";
import { loadProducts, saveProduct, uploadPhoto } from "@/lib/catalog";
import { isDemo, supabase } from "@/lib/supabase";

const INITIAL: Product = {
  id: "", name: "", set_name: "", card_number: "", category: "Outras", language: "Português",
  condition: "NM", finish: "Normal", rarity: "", price_cents: 0, stock: 1,
  front_url: "", back_url: "", is_published: true,
};

const categories: Category[] = ["Vintage", "Arte Rara", "Full Art", "Promo", "Shiny", "Outras"];
const languages: Language[] = ["Português", "Inglês", "Japonês", "Chinês", "Coreano", "Outro"];
const conditions: Condition[] = ["NM", "SP", "MP", "HP"];
const finishes: Finish[] = ["Normal", "Foil", "Reverse Foil"];

export default function AdminDashboard() {
  const [authState, setAuthState] = useState<"checking" | "login" | "ready" | "denied">(isDemo ? "ready" : "checking");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [items, setItems] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Product>(INITIAL);
  const [priceInput, setPriceInput] = useState("0,00");
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);

  async function checkAdmin() {
    if (isDemo) { setAuthState("ready"); return; }
    const db = supabase()!;
    const { data: { user }, error: userError } = await db.auth.getUser();
    if (userError || !user) { setAuthState("login"); return; }
    const { data, error: lookupError } = await db.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
    if (lookupError) { setError(`Não foi possível validar o perfil: ${lookupError.message}`); setAuthState("denied"); return; }
    setAuthState(data ? "ready" : "denied");
  }

  useEffect(() => { void checkAdmin(); }, []);
  useEffect(() => { if (authState === "ready") void refresh(); }, [authState]);

  async function refresh() {
    try { setError(""); setItems(await loadProducts()); }
    catch (e) { setError(e instanceof Error ? e.message : "Erro ao carregar produtos."); }
  }

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setAuthBusy(true);
    const db = supabase();
    if (!db) return;
    const { error: loginError } = await db.auth.signInWithPassword({ email, password });
    if (loginError) { setError("Não foi possível entrar. Verifique suas credenciais."); setAuthBusy(false); return; }
    await checkAdmin(); setAuthBusy(false);
  }

  async function signOut() {
    if (!isDemo) await supabase()!.auth.signOut();
    setAuthState("login"); setItems([]); setError("");
  }

  function openEditor(product?: Product) {
    setError(""); setSuccess(""); setFrontFile(null); setBackFile(null);
    setDraft(product ? { ...product } : { ...INITIAL });
    setPriceInput(product ? (product.price_cents / 100).toFixed(2).replace(".", ",") : "0,00");
    setEditing(true);
  }

  function change<K extends keyof Product>(key: K, value: Product[K]) { setDraft(old => ({ ...old, [key]: value })); }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setSuccess("");
    const price = parsePrice(priceInput);
    if (!draft.name.trim() || !draft.set_name.trim() || !draft.card_number.trim()) { setError("Nome, coleção e numeração são obrigatórios."); return; }
    if (price === null) { setError("Preço inválido. Use por exemplo 49,90."); return; }
    const floor=minimumSalePrice(draft);
    if (floor !== null && price>0 && price<floor) { setError(`Preço mínimo permitido para este exemplar: ${money(floor)}. Valor menor não respeita a margem comercial.`); return; }
    if (!Number.isInteger(draft.stock) || draft.stock < 0 || draft.stock > 99999) { setError("Informe uma quantidade válida de estoque."); return; }
    setBusy(true);
    try {
      const front = frontFile ? await uploadPhoto(frontFile) : draft.front_url.trim();
      const back = backFile ? await uploadPhoto(backFile) : draft.back_url.trim();
      if (draft.is_published && !front) throw new Error("Adicione uma foto frontal antes de publicar a carta.");
      const payload: Product = {
        ...draft, id: draft.id || crypto.randomUUID(), name: draft.name.trim(), set_name: draft.set_name.trim(), card_number: draft.card_number.trim(),
        rarity: draft.rarity.trim(), front_url: front, back_url: back, price_cents: price,
      };
      await saveProduct(payload);
      setEditing(false); setSuccess("Carta salva no catálogo.");
      await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível salvar."); }
    finally { setBusy(false); }
  }

  async function toggleVisibility(product: Product) {
    if (!window.confirm(product.is_published ? `Arquivar ${product.name} e ocultar do catálogo?` : `Publicar ${product.name} no catálogo?`)) return;
    try { setError(""); await saveProduct({ ...product, is_published: !product.is_published }); setSuccess(product.is_published ? "Carta arquivada." : "Carta publicada."); await refresh(); }
    catch (e) { setError(e instanceof Error ? e.message : "Erro ao atualizar visibilidade."); }
  }

  const filtered = useMemo(() => items.filter(item => `${item.name} ${item.card_number} ${item.set_name}`.toLowerCase().includes(query.toLowerCase().trim())), [items, query]);
  const published = items.filter(item => item.is_published).length;
  const available = items.filter(item => item.is_published && item.stock > 0).length;
  const units = items.reduce((a, item) => a + item.stock, 0);

  if (authState === "checking") return <div className="admin-auth-shell"><p>Verificando acesso ao painel...</p></div>;
  if (authState === "login" || authState === "denied") return <div className="admin-auth-shell"><Link href="/" className="back-link"><ArrowLeft size={16}/> Voltar ao catálogo</Link><div className="admin-login"><img className="admin-logo" src="/brand/logo-mark.svg" alt="" /><span className="section-eyebrow"><span className="orange-dash"/> ACESSO RESTRITO</span><h1>Área do vendedor<span className="heading-period">.</span></h1><p>Entre com a conta autorizada para gerenciar as cartas da EduTrainer TCG.</p>{error && <div className="error-box">{error}</div>}{authState === "denied" ? <><p className="denied">Esta conta não está na lista de administradores.</p><button className="secondary-button" onClick={signOut}>Sair desta conta</button></> : <form onSubmit={signIn}><label>E-mail<input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" autoComplete="username" /></label><label>Senha<input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Sua senha" autoComplete="current-password" /></label><button type="submit" className="primary-button" disabled={authBusy}>{authBusy ? "Entrando..." : "Entrar no painel"}<ArrowRight size={16}/></button></form>}</div></div>;

  return <div className="admin-app"><aside className="admin-sidebar"><Link className="admin-brand" href="/"><img className="admin-logo" src="/brand/logo-mark.svg" alt="" /><span>EDUTRAINER TCG<small>PAINEL DO VENDEDOR</small></span></Link><div className="sidebar-label">GERENCIAMENTO</div><div className="side-active"><LayoutGrid size={19}/> Catálogo</div><Link href="/"><Eye size={18}/> Ver loja</Link><div className="sidebar-spacer"/><div className="sidebar-legend"><Shield size={18}/><span>Administração com controle de acesso</span></div><button type="button" onClick={signOut}><LogOut size={18}/> Sair</button></aside><div className="admin-main"><header className="admin-header"><div><span>EDUTRAINER TCG</span><strong>Visão geral do catálogo</strong></div><div className="admin-header-right"><Link href="/" target="_blank"><Eye size={17}/> Abrir loja</Link><span className="admin-avatar">ET</span></div></header>
    <main className="admin-content">{isDemo && <div className="admin-demo-banner"><strong>Dados locais do painel</strong> — As alterações feitas aqui são salvas somente neste navegador e não aparecem para outros clientes. Para gerenciar o catálogo de forma compartilhada, configure a integração com o banco de dados.</div>}
      <div className="admin-title-row"><div><div className="section-eyebrow"><span className="orange-dash"/> ADMINISTRAÇÃO</div><h1>Gerenciar cartas<span className="heading-period">.</span></h1><p>Cadastre produtos, atualize preços e controle o que aparece na loja.</p></div><button type="button" className="primary-button" onClick={() => openEditor()}><Plus size={19}/> Nova carta</button></div>
      <div className="stat-grid"><div className="stat-card"><span>Cartas cadastradas</span><strong>{items.length}</strong><small>Todos os registros</small></div><div className="stat-card"><span>Publicadas</span><strong>{published}</strong><small>Visíveis no catálogo</small></div><div className="stat-card"><span>Disponíveis</span><strong>{available}</strong><small>Com estoque positivo</small></div><div className="stat-card"><span>Unidades totais</span><strong>{units}</strong><small>Inventário registrado</small></div></div>
      {error && <div className="error-box">{error}</div>}{success && <div role="status" className="success-box"><Check size={17}/>{success}</div>}
      <div className="admin-list-card"><div className="admin-list-top"><div><h2>Inventário de cartas</h2><span>{filtered.length} resultados</span></div><div className="search-field"><Search size={18}/><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar carta ou coleção" aria-label="Buscar inventário" /></div></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>CARTA</th><th>CONDIÇÃO</th><th>PREÇO</th><th>ESTOQUE</th><th>STATUS</th><th>AÇÕES</th></tr></thead><tbody>{filtered.map(item => <tr key={item.id}><td><div className="admin-product-cell"><div className="admin-product-thumb">{item.front_url ? <img src={item.front_url} alt=""/> : <Package size={18}/>}</div><div><strong>{item.name}</strong><small>{item.set_name} · {item.card_number}</small></div></div></td><td>{item.condition} · {item.language}</td><td className="table-price">{money(item.price_cents)}</td><td>{item.stock}</td><td><span className={`status-chip ${!item.is_published ? "archived" : item.stock === 0 ? "sold" : "on"}`}>{!item.is_published ? "Arquivada" : item.stock === 0 ? "Esgotada" : "Publicada"}</span></td><td><div className="table-actions"><button type="button" title="Editar carta" aria-label={`Editar ${item.name}`} onClick={() => openEditor(item)}><Pencil size={17}/></button><button type="button" title={item.is_published ? "Arquivar" : "Publicar"} aria-label={`${item.is_published ? "Arquivar" : "Publicar"} ${item.name}`} onClick={() => toggleVisibility(item)}>{item.is_published ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div></td></tr>)}</tbody></table>{!filtered.length && <div className="admin-empty"><Package size={28}/><p>Nenhuma carta encontrada.</p><button type="button" onClick={() => openEditor()}>Cadastrar carta <Plus size={15}/></button></div>}</div></div>
    </main></div>

    {editing && <div className="overlay" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget && !busy) setEditing(false); }}><section role="dialog" aria-modal="true" aria-label="Editor de carta" className="editor-modal"><header className="editor-head"><div><span className="section-eyebrow"><span className="orange-dash"/> CADASTRO</span><h2>{draft.id ? "Editar carta" : "Nova carta"}</h2></div><button type="button" onClick={() => setEditing(false)} disabled={busy} aria-label="Fechar editor"><X size={22}/></button></header><form onSubmit={save} className="editor-form"><div className="form-grid"><label className="field-span">Nome da carta *<input required maxLength={120} value={draft.name} onChange={e => change("name", e.target.value)} placeholder="Ex.: Pikachu" /></label><label>Coleção / expansão *<input required maxLength={120} value={draft.set_name} onChange={e => change("set_name", e.target.value)} placeholder="Ex.: Pokémon 151" /></label><label>Numeração *<input required maxLength={40} value={draft.card_number} onChange={e => change("card_number", e.target.value)} placeholder="Ex.: 173/165" /></label><label>Categoria<select value={draft.category} onChange={e => change("category", e.target.value as Category)}>{categories.map(value => <option key={value}>{value}</option>)}</select></label><label>Idioma<select value={draft.language} onChange={e => change("language", e.target.value as Language)}>{languages.map(value => <option key={value}>{value}</option>)}</select></label><label>Condição<select value={draft.condition} onChange={e => change("condition", e.target.value as Condition)}>{conditions.map(value => <option key={value}>{value}</option>)}</select></label><label>Acabamento<select value={draft.finish} onChange={e => change("finish", e.target.value as Finish)}>{finishes.map(value => <option key={value}>{value}</option>)}</select></label><label>Raridade<input maxLength={100} value={draft.rarity} onChange={e => change("rarity", e.target.value)} placeholder="Ex.: Illustration Rare" /></label><label>Preço (R$) *<input required inputMode="decimal" value={priceInput} onChange={e => setPriceInput(e.target.value)} placeholder="49,90" /></label><label>Quantidade em estoque *<input required type="number" min="0" max="99999" step="1" value={draft.stock} onChange={e => change("stock", Number(e.target.value))} /></label><div className="field-span admin-photo-guidance" role="note"><strong>Fotos de alta qualidade:</strong> envie a frente e o verso de cada exemplar, sem filtros ou deformação. Recomendação: pelo menos 1.200 px de largura, ideal 1.500 px ou mais. Fotos individuais substituem os recortes de montagem. Sem armazenamento conectado, o limite de arquivo é 350 KB.</div><label className="field-span">URL de foto frontal (alternativa ao upload)<input type="url" value={draft.front_url.startsWith("data:") ? "" : draft.front_url} onChange={e => change("front_url", e.target.value)} placeholder="https://..." /></label><label className="field-span">URL de foto do verso (opcional)<input type="url" value={draft.back_url.startsWith("data:") ? "" : draft.back_url} onChange={e => change("back_url", e.target.value)} placeholder="https://..." /></label><label className="upload-field"><ImagePlus size={20}/><span>{frontFile ? frontFile.name : "Enviar foto frontal"}</span><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e => setFrontFile(e.target.files?.[0] || null)} /></label><label className="upload-field"><ImagePlus size={20}/><span>{backFile ? backFile.name : "Enviar foto do verso"}</span><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e => setBackFile(e.target.files?.[0] || null)} /></label></div><label className="publish-check"><input type="checkbox" checked={draft.is_published} onChange={e => change("is_published", e.target.checked)}/><span>Publicar esta carta no catálogo</span></label>{error && <div role="alert" className="error-box">{error}</div>}<div className="editor-foot"><button type="button" className="secondary-button" onClick={() => setEditing(false)} disabled={busy}>Cancelar</button><button type="submit" className="primary-button" disabled={busy}>{busy ? "Salvando..." : "Salvar carta"}<Check size={17}/></button></div></form></section></div>}
  </div>;
}
