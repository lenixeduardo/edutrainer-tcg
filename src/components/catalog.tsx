"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Check, ChevronDown, Heart, Menu, Minus, Plus,
  Search, ShieldCheck, ShoppingBag, SlidersHorizontal, Sparkles, Trash2, Truck, X,
  PackageCheck, Copy, ExternalLink, RotateCcw
} from "lucide-react";
import type { Cart, Category, Product } from "@/lib/types";
import { cartCount, cartTotal, money, reconcileCart, updateCart, whatsAppMessage, whatsAppUrl } from "@/lib/business";
import { loadProducts } from "@/lib/catalog";
import { isDemo } from "@/lib/supabase";

const CATEGORIES = ["Todas", "Shiny", "Arte Rara", "Vintage", "Full Art", "Promo", "Outras"] as const;
const CART_KEY = "edutrainer:cart:v1";
const PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
type SortBy = "featured" | "price-asc" | "price-desc" | "name";

function ProductVisual({ product, side = "front", className = "" }: { product: Product; side?: "front" | "back"; className?: string }) {
  const src = side === "front" ? product.front_url : product.back_url;
  return <div className={`card-visual ${className}`}>
    {src ? <img src={src} alt={`${side === "front" ? "Frente" : "Verso"} da carta ${product.name} ${product.card_number}`} loading="lazy" /> :
      <div className="no-card-image"><span className="placeholder-logo">E<span>·</span></span><span>Foto {side === "front" ? "da frente" : "do verso"} não cadastrada</span></div>}
  </div>;
}

function ProductCard({ product, onSelect, onAdd }: { product: Product; onSelect: (product: Product) => void; onAdd: (product: Product) => void }) {
  const out = product.stock < 1;
  return <article className="product-card">
    <button className="product-photo" type="button" onClick={() => onSelect(product)} aria-label={`Ver detalhes de ${product.name}`}>
      <ProductVisual product={product} />
      <span className="photo-status">{product.category}</span>
      {out && <span className="sold-layer"><span>ESGOTADO</span></span>}
    </button>
    <div className="product-content">
      <button type="button" onClick={() => onSelect(product)} className="product-title">{product.name}</button>
      <p className="product-kicker">{product.card_number}</p>
      <div className="product-bottom"><span className="price">{money(product.price_cents)}</span>
        <button type="button" className="add-button" aria-label={`Adicionar ${product.name} ao carrinho`} disabled={out} onClick={() => onAdd(product)}><Plus size={15}/> Carrinho</button>
      </div>
    </div>
  </article>;
}

export default function CatalogApp() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart>({});
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Todas");
  const [condition, setCondition] = useState("Todas");
  const [language, setLanguage] = useState("Todos");
  const [sort, setSort] = useState<SortBy>("price-desc");
  const [inStock, setInStock] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [side, setSide] = useState<"front" | "back">("front");
  const [notice, setNotice] = useState("");
  const [sending, setSending] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    try { const saved = localStorage.getItem(CART_KEY); if (saved) setCart(JSON.parse(saved) as Cart); } catch { /* carrinho vazio */ }
    loadProducts().then(items => { setProducts(items.filter(item => item.is_published)); setLoaded(true); }).catch(e => { setError(e.message); setLoaded(true); });
  }, []);
  useEffect(() => { if (loaded) { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* armazenamento cheio */ } } }, [cart, loaded]);
  useEffect(() => { if (loaded) setCart(current => reconcileCart(current, products)); }, [products, loaded]);
  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => { if (event.key === "Escape") { setSelected(null); setCartOpen(false); setMobileMenu(false); } };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);
  useEffect(() => { document.body.style.overflow = cartOpen || selected ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [cartOpen, selected]);

  const filtered = useMemo(() => products.filter(item => {
    const haystack = `${item.name} ${item.set_name} ${item.card_number} ${item.rarity}`.toLowerCase();
    return (!query.trim() || haystack.includes(query.toLowerCase().trim())) &&
      (category === "Todas" || item.category === category) &&
      (condition === "Todas" || item.condition === condition) &&
      (language === "Todos" || item.language === language) && (!inStock || item.stock > 0);
  }).sort((a, b) => sort === "price-asc" ? a.price_cents - b.price_cents : sort === "price-desc" ? b.price_cents - a.price_cents : sort === "name" ? a.name.localeCompare(b.name) : Number(b.stock > 0) - Number(a.stock > 0)), [products, query, category, condition, language, inStock, sort]);
  const itemsInCart = products.filter(item => (cart[item.id] || 0) > 0);
  const count = cartCount(cart);
  const total = cartTotal(cart, products);

  const alert = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(""), 3200); };
  const add = (product: Product) => {
    if (product.stock <= (cart[product.id] || 0)) { alert("Você já selecionou todas as unidades disponíveis."); return; }
    setCart(current => updateCart(current, product, 1));
    alert(`${product.name} adicionado ao carrinho de demonstração`);
  };
  const detail = (product: Product) => { setSide("front"); setSelected(product); };
  const resetFilters = () => { setQuery(""); setCategory("Todas"); setCondition("Todas"); setLanguage("Todos"); setSort("price-desc"); setInStock(false); };
  const copyOrder = async () => {
    try { await navigator.clipboard.writeText(whatsAppMessage(cart, products)); alert("Resumo do pedido copiado."); }
    catch { alert("Não foi possível copiar. Tente novamente em uma conexão segura."); }
  };
  const sendOrder = async () => {
    if (!count || sending) return;
    setSending(true);
    try {
      const current = (await loadProducts()).filter(item => item.is_published);
      const reconciled = reconcileCart(cart, current);
      setProducts(current);
      if (JSON.stringify(Object.entries(reconciled).sort()) !== JSON.stringify(Object.entries(cart).sort())) {
        setCart(reconciled);
        alert("O estoque mudou. O carrinho foi atualizado; confira antes de continuar.");
        return;
      }
      const url = whatsAppUrl(PHONE, whatsAppMessage(reconciled, current));
      if (!url) { alert("Número comercial ainda não configurado. Copie o pedido para enviar manualmente."); return; }
      window.location.assign(url);
    } catch { alert("Não foi possível confirmar o estoque. Tente novamente."); }
    finally { setSending(false); }
  };

  return <div className="site-shell">
    <header className="site-header"><div className="container header-inside">
      <Link href="/" className="brand" aria-label="EduTrainer TCG, página inicial"><img src="/brand/logo-horizontal.svg" alt="EduTrainer TCG" /></Link>
      <span className="header-tagline">Cartas colecionáveis<small>Catálogo de produtos</small></span>
      <nav className={`desktop-nav ${mobileMenu ? "nav-visible" : ""}`} aria-label="Navegação principal"><a className="nav-active" href="#inicio" onClick={() => setMobileMenu(false)}>Início</a><a href="#catalogo" onClick={() => setMobileMenu(false)}>Catálogo</a><a href="#como-funciona" onClick={() => setMobileMenu(false)}>Como comprar</a><Link href="/admin">Painel admin</Link></nav>
      <div className="header-actions"><button className="cart-trigger" type="button" onClick={() => setCartOpen(true)} aria-label={`Abrir carrinho com ${count} cartas`}><ShoppingBag size={21} strokeWidth={1.8}/>{count > 0 && <span className="cart-bubble">{count}</span>}</button><button className="mobile-menu-button" type="button" aria-label="Abrir menu" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X size={23}/> : <Menu size={23}/>}</button></div>
    </div></header>

    {isDemo && <div className="demo-bar"><strong>AMBIENTE DE DEMONSTRAÇÃO</strong><span>11 cartas e preços transcritos das imagens enviadas. Fotos físicas, condição e estoque ainda precisam de confirmação.</span><Link href="/admin">Editar catálogo demo <ArrowRight size={14}/></Link></div>}

    <main>
      <section className="hero container" id="inicio">
        <div className="hero-left"><h1>Colecione o que importa.</h1><p>Encontre suas próximas cartas no mesmo lugar.<br/>Fotos de referência de frente e verso para consulta.</p><a className="hero-cta" href="#catalogo">Explorar catálogo <ArrowRight size={18}/></a></div>
        <div className="hero-art" aria-hidden="true"><img src="/illustrations/hero-card-outlines.svg" alt="" /></div>
      </section>
      <section className="catalog-section container" id="catalogo">
        <div className="catalog-heading"><div><h2>Destaques do catálogo</h2><p>Selecione suas cartas e envie o pedido pelo WhatsApp.</p></div><span className="catalog-count">{loaded ? `${products.length} referências cadastradas` : "Carregando catálogo"}</span></div>
        <div className="catalog-controls"><div className="search-field"><Search size={20}/><input type="search" placeholder="Buscar nome, coleção ou número..." aria-label="Buscar cartas" value={query} onChange={e => setQuery(e.target.value)} /></div><div className="filter-select-box"><SlidersHorizontal size={17}/><select aria-label="Filtrar por condição" value={condition} onChange={e => setCondition(e.target.value)}><option>Todas</option><option>NM</option><option>SP</option><option>MP</option><option>HP</option></select><ChevronDown size={14}/></div><div className="filter-select-box"><select aria-label="Filtrar por idioma" value={language} onChange={e => setLanguage(e.target.value)}><option value="Todos">Todos os idiomas</option><option>Português</option><option>Inglês</option><option>Japonês</option><option>Chinês</option><option>Coreano</option><option>Outro</option></select><ChevronDown size={14}/></div></div>
        <div className="category-bar"><div className="category-tabs">{CATEGORIES.map(item => <button type="button" key={item} className={category === item ? "category active" : "category"} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="stock-checkbox"><input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)}/><span>Apenas disponíveis</span></label></div>
        <div className="product-tools"><span>{loaded ? `${filtered.length} ${filtered.length === 1 ? "resultado" : "resultados"}` : "..."}</span><div><span>Ordenar:</span><select aria-label="Ordenação" value={sort} onChange={e => setSort(e.target.value as SortBy)}><option value="featured">Destaques</option><option value="price-asc">Menor preço</option><option value="price-desc">Maior preço</option><option value="name">Nome A–Z</option></select><ChevronDown size={15}/></div></div>
        {error && <div className="error-box">{error} <button onClick={() => location.reload()}>Tentar novamente</button></div>}
        {!loaded ? <div className="product-grid">{Array.from({ length: 5 }).map((_,i) => <div className="skeleton-product" key={i}><div/><span/><span/></div>)}</div> :
          filtered.length ? <div className="product-grid">{filtered.map(product => <ProductCard key={product.id} product={product} onSelect={detail} onAdd={add}/>)}</div> :
            <div className="no-results"><Search size={28}/><h3>Nenhuma carta encontrada</h3><p>Tente alterar os filtros ou explorar todas as cartas disponíveis.</p><button type="button" onClick={resetFilters}>Limpar filtros <RotateCcw size={15}/></button></div>}
      </section>

      <section className="how-section" id="como-funciona"><div className="container"><div className="section-eyebrow"><span className="orange-dash"/> SIMPLES ASSIM</div><h2>Escolha. Adicione.<br/><em>Chame no WhatsApp.</em></h2><div className="how-grid"><div><span className="how-index">01</span><h3>Explore as cartas</h3><p>Filtre por coleção, condição ou idioma e confira os detalhes.</p></div><div><span className="how-index">02</span><h3>Monte seu carrinho</h3><p>Adicione as cartas desejadas e acompanhe o subtotal.</p></div><div><span className="how-index">03</span><h3>Finalize na conversa</h3><p>Envie seu resumo pelo WhatsApp e combine frete e pagamento.</p></div></div></div></section>
    </main>
    <footer className="footer"><div className="container footer-top"><div className="footer-brand"><span className="brand-mark">E<span className="brand-dot">.</span></span><div><strong>EDUTRAINER TCG</strong><span>Feito para quem coleciona.</span></div></div><div className="footer-links"><a href="#catalogo">Catálogo</a><a href="#como-funciona">Como comprar</a><Link href="/admin">Painel admin</Link></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} EDUTRAINER TCG</span><span>Os pedidos são confirmados diretamente pelo WhatsApp.</span></div></footer>
    {notice && <div role="status" className="toast"><Check size={17}/>{notice}</div>}
    {count > 0 && !cartOpen && <button type="button" className="floating-cart" onClick={() => setCartOpen(true)}><ShoppingBag size={18}/> Ver carrinho <span>{count}</span><ArrowRight size={17}/></button>}

    {selected && <div className="overlay" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setSelected(null); }}><section className="product-modal" role="dialog" aria-modal="true" aria-label={`Detalhes da carta ${selected.name}`}><button type="button" className="modal-close" onClick={() => setSelected(null)} aria-label="Fechar"><X size={20}/></button><div className="modal-photo"><ProductVisual product={selected} side={side}/><div className="image-switch"><button type="button" className={side === "front" ? "active" : ""} onClick={() => setSide("front")}>Frente</button><button type="button" className={side === "back" ? "active" : ""} onClick={() => setSide("back")}>Verso</button></div></div><div className="modal-details"><span className="section-eyebrow"><span className="orange-dash"/> DETALHES DA CARTA</span><h2>{selected.name}</h2><p className="modal-set">{selected.set_name} · {selected.card_number}</p><div className="tag-row"><span>{selected.condition}</span><span>{selected.language}</span><span>{selected.finish}</span></div><div className="product-info-rows"><div><span>Raridade</span><strong>{selected.rarity || "Não informada"}</strong></div><div><span>Condição</span><strong>{selected.condition}</strong></div><div><span>Disponibilidade</span><strong>{selected.stock > 0 ? `${selected.stock} ${selected.stock === 1 ? "unidade" : "unidades"}` : "Esgotado"}</strong></div></div><div className="modal-pricing"><small>Valor por unidade</small><strong>{money(selected.price_cents)}</strong></div><button className="primary-button" type="button" disabled={selected.stock === 0} onClick={() => { add(selected); setSelected(null); setCartOpen(true); }}><ShoppingBag size={19}/>{selected.stock > 0 ? "Adicionar ao carrinho" : "Produto esgotado"}<ArrowRight size={17}/></button><p className="modal-disclaimer">{selected.set_name === "Seleção Shiny" ? "Imagens recortadas da montagem de referência, não fotografias individuais do produto. Solicite fotos reais da frente e do verso. " : ""}Preço, condição e disponibilidade sujeitos à confirmação antes da compra.</p></div></section></div>}

    {cartOpen && <div className="drawer-overlay" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setCartOpen(false); }}><aside className="cart-drawer" aria-label="Meu carrinho" role="dialog" aria-modal="true"><div className="drawer-head"><div><span className="section-eyebrow"><span className="orange-dash"/> SUA SELEÇÃO</span><h2>Meu carrinho<span className="heading-period">.</span></h2></div><button type="button" aria-label="Fechar carrinho" onClick={() => setCartOpen(false)}><X size={23}/></button></div><div className="cart-scroll">{itemsInCart.length ? itemsInCart.map(product => <div key={product.id} className="cart-line"><div className="cart-line-img"><ProductVisual product={product}/></div><div className="cart-line-info"><p>{product.name}</p><span>{product.card_number} · {product.condition} · {product.language}</span><strong>{money(product.price_cents)}</strong><div className="qty-control"><button type="button" aria-label={`Retirar uma unidade de ${product.name}`} onClick={() => setCart(current => updateCart(current, product, -1))}><Minus size={13}/></button><span>{cart[product.id]}</span><button type="button" aria-label={`Adicionar uma unidade de ${product.name}`} disabled={cart[product.id] >= product.stock} onClick={() => setCart(current => updateCart(current, product, 1))}><Plus size={13}/></button></div></div><button type="button" className="remove-line" aria-label={`Remover ${product.name} do carrinho`} onClick={() => setCart(current => { const copy = { ...current }; delete copy[product.id]; return copy; })}><Trash2 size={16}/></button></div>) : <div className="empty-cart"><ShoppingBag size={35}/><h3>Seu carrinho está vazio</h3><p>Explore o catálogo e adicione as cartas que deseja consultar.</p><button type="button" onClick={() => setCartOpen(false)}>Continuar explorando <ArrowRight size={16}/></button></div>}</div>{itemsInCart.length > 0 && <div className="drawer-bottom"><div className="subtotal-row"><span>Subtotal ({count} {count === 1 ? "carta" : "cartas"})</span><strong>{money(total)}</strong></div><p>Frete calculado na conversa. O envio não reserva automaticamente o estoque.</p><button className="primary-button whatsapp-button" type="button" onClick={sendOrder} disabled={sending || !PHONE}>{sending ? "Validando estoque..." : PHONE ? "Enviar pedido no WhatsApp" : "WhatsApp não configurado"}<ArrowRight size={18}/></button><button type="button" className="secondary-button" onClick={copyOrder}><Copy size={16}/> Copiar resumo do pedido</button></div>}</aside></div>}
  </div>;
}
