"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CardDetailViewer from "./card-detail-viewer";
import CustomerCheckout from "./customer-checkout";
import { customerWhatsAppMessage, type CheckoutCustomer } from "@/lib/checkout";
import { getCardReference } from "@/lib/card-reference";
import { priceBelowPolicy } from "@/lib/selling-policy";
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
const PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511984477950";
const CONTACT_URL = whatsAppUrl(PHONE, "Olá! Gostaria de consultar cartas do catálogo EduTrainer TCG.");
type SortBy = "featured" | "price-asc" | "price-desc" | "name";

function ProductVisual({ product, side = "front", className = "" }: { product: Product; side?: "front" | "back"; className?: string }) {
  const [referenceFailed,setReferenceFailed]=useState(false);
  const ref=side==="front" ? getCardReference(product) : null;
  const useArt=Boolean(ref&&!referenceFailed);
  const src=useArt ? ref!.url : side==="front" ? product.front_url : product.back_url;
  return <div className={`card-visual ${className}`}>
    {src ? <img src={src} loading="lazy"
      alt={useArt ? `Arte digital ${ref!.language} de ${product.name} ${product.card_number}, não foto do exemplar NM` : `Imagem enviada de ${product.name}, ${side==="front"?"frente":"verso"}`}
      onError={() => { if(useArt)setReferenceFailed(true); }} /> :
      <div className="no-card-image"><span>Imagem não cadastrada</span></div>}
  </div>;
}

function ProductCard({ product, onSelect, onAdd }: { product: Product; onSelect: (product: Product) => void; onAdd: (product: Product) => void }) {
  const out = product.stock < 1;
  const quoteRequired = product.price_cents <= 0;
  return <article className="product-card">
    <button className="product-photo" type="button" onClick={() => onSelect(product)} aria-label={`Ver detalhes de ${product.name}`}>
      <ProductVisual product={product} />
      {out && <span className="sold-layer"><span>ESGOTADO</span></span>}
    </button>
    <div className="product-content">
      <div className="et-product-meta"><span className="et-category-pill">{product.category}</span><span className="et-condition-pill">{product.condition}</span></div>
      <button type="button" onClick={() => onSelect(product)} className="product-title">{product.name}</button>
      <p className="product-kicker">{product.set_name} · {product.card_number}</p>
      <div className="product-bottom"><span className={`price${quoteRequired ? " price-on-request" : ""}`}>{quoteRequired ? "Sob consulta" : money(product.price_cents)}</span>
        <button type="button" className="add-button" aria-label={`Adicionar ${product.name} ao carrinho`} disabled={out} onClick={() => quoteRequired ? onSelect(product) : onAdd(product)}>{quoteRequired ? <ExternalLink size={15}/> : <Plus size={15}/>} {quoteRequired ? "Consultar" : "Carrinho"}</button>
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
  const [collection, setCollection] = useState("Todas as coleções");
  const [sort, setSort] = useState<SortBy>("price-desc");
  const [inStock, setInStock] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [notice, setNotice] = useState("");
  const [sending, setSending] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    try { const saved = localStorage.getItem(CART_KEY); if (saved) setCart(JSON.parse(saved) as Cart); } catch { /* carrinho vazio */ }
    loadProducts().then(items => { setProducts(items.filter(item => item.is_published)); setLoaded(true); }).catch(e => { setError(e.message); setLoaded(true); });
  }, []);
  useEffect(() => { if (loaded) { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* armazenamento cheio */ } } }, [cart, loaded]);
  useEffect(() => { if (loaded) setCart(current => reconcileCart(current, products)); }, [products, loaded]);
  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => { if (event.key === "Escape" && !checkoutOpen && !document.querySelector('[data-zoom-open="true"]')) { setSelected(null); setCartOpen(false); setMobileMenu(false); } };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [checkoutOpen]);
  useEffect(() => { document.body.style.overflow = cartOpen || selected || checkoutOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [cartOpen, selected, checkoutOpen]);

  const collections = useMemo(() => [...new Set(products.map(item => item.set_name))].sort((a,b) => a.localeCompare(b)), [products]);
  const filtered = useMemo(() => products.filter(item => {
    const haystack = `${item.name} ${item.set_name} ${item.card_number} ${item.rarity}`.toLowerCase();
    return (!query.trim() || haystack.includes(query.toLowerCase().trim())) &&
      (category === "Todas" || item.category === category) &&
      (condition === "Todas" || item.condition === condition) &&
      (language === "Todos" || item.language === language) &&
      (collection === "Todas as coleções" || item.set_name === collection) && (!inStock || item.stock > 0);
  }).sort((a, b) => sort === "price-asc" ? a.price_cents - b.price_cents : sort === "price-desc" ? b.price_cents - a.price_cents : sort === "name" ? a.name.localeCompare(b.name) : Number(b.stock > 0) - Number(a.stock > 0)), [products, query, category, condition, language, collection, inStock, sort]);
  const itemsInCart = products.filter(item => (cart[item.id] || 0) > 0);
  const count = cartCount(cart);
  const total = cartTotal(cart, products);

  const alert = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(""), 3200); };
  const add = (product: Product) => {
    if (product.price_cents <= 0) { setSelected(product); return; }
    if (product.stock <= (cart[product.id] || 0)) { alert("Você já selecionou todas as unidades disponíveis."); return; }
    setCart(current => updateCart(current, product, 1));
    setNotice(`${product.name} adicionado ao carrinho.`);
  };
  const detail = (product: Product) => { setSelected(product); };
  const resetFilters = () => { setQuery(""); setCategory("Todas"); setCondition("Todas"); setLanguage("Todos"); setCollection("Todas as coleções"); setSort("price-desc"); setInStock(false); };
  const copyOrder = async () => {
    try { await navigator.clipboard.writeText(whatsAppMessage(cart, products)); alert("Resumo do pedido copiado."); }
    catch { alert("Não foi possível copiar. Tente novamente em uma conexão segura."); }
  };
  const sendOrder = async (customer: CheckoutCustomer) => {
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
      const belowFloor=current.find(product => (reconciled[product.id] || 0)>0 && priceBelowPolicy(product));
      if (belowFloor) { alert(`O preço de ${belowFloor.name} exige revisão antes de enviar o pedido.`); return; }
      const url = whatsAppUrl(PHONE, customerWhatsAppMessage(reconciled, current, customer));
      if (!url) { alert("Não foi possível gerar o link do WhatsApp. Copie o pedido para enviar manualmente."); return; }
      window.location.assign(url);
    } catch { alert("Não foi possível confirmar o estoque. Tente novamente."); }
    finally { setSending(false); }
  };

  return <div className="site-shell">
    <header className="site-header"><div className="container header-inside">
      <Link href="/" className="brand" aria-label="EduTrainer TCG, página inicial"><img src="/brand/pokeball-horizontal-v3.svg" width="660" height="150" alt="EduTrainer TCG" /></Link>
      <span className="header-tagline">Cartas colecionáveis<small>Catálogo de produtos</small></span>
      <nav className={`desktop-nav ${mobileMenu ? "nav-visible" : ""}`} aria-label="Navegação principal"><a className="nav-active" href="#inicio" onClick={() => setMobileMenu(false)}>Início</a><a href="#catalogo" onClick={() => setMobileMenu(false)}>Catálogo</a><a href="#como-funciona" onClick={() => setMobileMenu(false)}>Como comprar</a><Link href="/admin">Painel admin</Link></nav>
      <div className="header-actions"><button className="cart-trigger" type="button" onClick={() => setCartOpen(true)} aria-label={`Abrir carrinho com ${count} cartas`}><ShoppingBag size={21} strokeWidth={1.8}/>{count > 0 && <span className="cart-bubble">{count}</span>}</button><button className="mobile-menu-button" type="button" aria-label="Abrir menu" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X size={23}/> : <Menu size={23}/>}</button></div>
    </div></header>

    

    <main>
      <section className="hero container hero-shiny" id="inicio" aria-label="Cartas para colecionadores">
        <div className="hero-left">
          <span className="hero-shiny-kicker">SHINY · VINTAGE · COLECIONÁVEIS</span>
          <h1>Colecione o que importa.</h1>
          <p>Encontre cartas especiais para sua coleção. Explore cada edição e solicite seu pedido diretamente pelo WhatsApp.</p>
          <div className="hero-shiny-actions">
            <a className="hero-cta" href="#catalogo">Explorar catálogo <ArrowRight size={18}/></a>
            <a className="hero-shiny-secondary" href="#como-funciona">Como comprar</a>
          </div>
        </div>
        <div className="hero-art hero-shiny-art" aria-hidden="true">
          <div className="hero-shiny-album">
          <div className="hero-shiny-slot" key="0"><img src="/cards/shiny/charmander-109-091-front.webp" alt="" width="240" height="336" decoding="async" /></div>
          <div className="hero-shiny-slot" key="1"><img src="/cards/shiny/pikachu-131-091-front.webp" alt="" width="240" height="336" decoding="async" /></div>
          <div className="hero-shiny-slot" key="2"><img src="/cards/shiny/lucario-174-091-front.webp" alt="" width="240" height="336" decoding="async" /></div>
          <div className="hero-shiny-slot" key="3"><img src="/cards/shiny/riolu-173-091-front.webp" alt="" width="240" height="336" decoding="async" /></div>
          <div className="hero-shiny-slot" key="4"><img src="/cards/shiny/slowpoke-116-091-front.webp" alt="" width="240" height="336" decoding="async" /></div>
          <div className="hero-shiny-slot" key="5"><img src="/cards/shiny/snorlax-202-091-front.webp" alt="" width="240" height="336" decoding="async" /></div>
          </div>
        </div>
      </section>
      <section className="catalog-section container" id="catalogo">
        <div className="catalog-heading"><div><h2>Destaques do catálogo</h2><p>Selecione suas cartas e envie o pedido pelo WhatsApp.</p></div><span className="catalog-count">{loaded ? `${products.length} referências cadastradas` : "Carregando catálogo"}</span></div>
        <div className="catalog-controls"><div className="search-field"><Search size={20}/><input type="search" placeholder="Buscar nome, coleção ou número..." aria-label="Buscar cartas" value={query} onChange={e => setQuery(e.target.value)} /></div><div className="filter-select-box et-collection-filter"><select aria-label="Filtrar por coleção" value={collection} onChange={e => setCollection(e.target.value)}><option value="Todas as coleções">Todas as coleções</option>{collections.map(name => <option key={name} value={name}>{name}</option>)}</select><ChevronDown size={14}/></div><div className="filter-select-box"><SlidersHorizontal size={17}/><select aria-label="Filtrar por condição" value={condition} onChange={e => setCondition(e.target.value)}><option>Todas</option><option>NM</option><option>SP</option><option>MP</option><option>HP</option></select><ChevronDown size={14}/></div><div className="filter-select-box"><select aria-label="Filtrar por idioma" value={language} onChange={e => setLanguage(e.target.value)}><option value="Todos">Todos os idiomas</option><option>Português</option><option>Inglês</option><option>Japonês</option><option>Chinês</option><option>Coreano</option><option>Outro</option></select><ChevronDown size={14}/></div></div>
        <div className="category-bar"><div className="category-tabs">{CATEGORIES.map(item => <button type="button" key={item} className={category === item ? "category active" : "category"} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="stock-checkbox"><input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)}/><span>Apenas disponíveis</span></label></div>
        <div className="product-tools"><span>{loaded ? `${filtered.length} ${filtered.length === 1 ? "resultado" : "resultados"}` : "..."}</span><div><span>Ordenar:</span><select aria-label="Ordenação" value={sort} onChange={e => setSort(e.target.value as SortBy)}><option value="featured">Destaques</option><option value="price-asc">Menor preço</option><option value="price-desc">Maior preço</option><option value="name">Nome A–Z</option></select><ChevronDown size={15}/></div></div>
        {error && <div className="error-box">{error} <button onClick={() => location.reload()}>Tentar novamente</button></div>}
        {!loaded ? <div className="product-grid">{Array.from({ length: 5 }).map((_,i) => <div className="skeleton-product" key={i}><div/><span/><span/></div>)}</div> :
          filtered.length ? <div className="product-grid">{filtered.map(product => <ProductCard key={product.id} product={product} onSelect={detail} onAdd={add}/>)}</div> :
            <div className="no-results"><Search size={28}/><h3>Nenhuma carta encontrada</h3><p>Tente alterar os filtros ou explorar todas as cartas disponíveis.</p><button type="button" onClick={resetFilters}>Limpar filtros <RotateCcw size={15}/></button></div>}
      </section>

      <section className="how-section" id="como-funciona"><div className="container"><div className="section-eyebrow"><span className="orange-dash"/> SIMPLES ASSIM</div><h2>Escolha. Adicione.<br/><em>Chame no WhatsApp.</em></h2><div className="how-grid"><div><span className="how-index">01</span><h3>Explore as cartas</h3><p>Filtre por coleção, condição ou idioma e confira os detalhes.</p></div><div><span className="how-index">02</span><h3>Monte seu carrinho</h3><p>Adicione as cartas desejadas e acompanhe o subtotal.</p></div><div><span className="how-index">03</span><h3>Finalize na conversa</h3><p>Envie seu resumo pelo WhatsApp e combine frete e pagamento.</p></div></div></div></section>
      <section className="et-collector-banner container" aria-labelledby="et-collector-heading">
        <div className="et-collector-copy">
          <div className="et-collector-brand"><img className="et-collector-brand-logo" src="/brand/pokeball-horizontal-v3.svg" width="660" height="150" alt="EduTrainer TCG" loading="lazy" decoding="async"/></div>
          <div className="et-collector-kicker">COLEÇÃO EM DESTAQUE</div>
          <h2 id="et-collector-heading">Sua próxima carta favorita pode estar <em>aqui.</em></h2>
          <p>Cartas selecionadas, imagens em alta qualidade e atendimento direto pelo WhatsApp.</p>
          <div className="et-collector-actions">
            <a className="et-collector-primary" href="#catalogo">Ver catálogo <ArrowRight size={18} aria-hidden="true"/></a>
            {CONTACT_URL && <a className="et-collector-secondary" href={CONTACT_URL} target="_blank" rel="noopener noreferrer">Falar no WhatsApp <ExternalLink size={16} aria-hidden="true"/></a>}
          </div>
        </div>
        <div className="et-collector-visual">
          <img
            src="/banners/edutrainer-collector-photo-hd-v2.avif"
            width="1094" height="701" loading="lazy" decoding="async"
            alt="Fichário aberto com cartas Pokémon Shiny, enquanto uma mão segura uma carta de Lucario"
            onError={event => {event.currentTarget.onerror=null;event.currentTarget.src="/cards/shiny/lucario-174-091-front.webp";}}
          />
        </div>
      </section>
    </main>
    <footer className="footer"><div className="container footer-top"><div className="footer-brand et-footer-brand"><Link href="/" className="et-footer-logo" aria-label="EduTrainer TCG, voltar ao início"><img src="/brand/pokeball-horizontal-v3.svg" width="660" height="150" alt="EduTrainer TCG" loading="lazy" decoding="async"/></Link><span className="et-footer-tagline">Feito para quem coleciona.</span></div><div className="footer-links"><a href="#catalogo">Catálogo</a><a href="#como-funciona">Como comprar</a>{CONTACT_URL && <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" aria-label="Conversar com a EduTrainer TCG pelo WhatsApp">Falar no WhatsApp <ExternalLink size={14}/></a>}<Link href="/admin">Painel admin</Link></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} EDUTRAINER TCG</span><span>Os pedidos são confirmados diretamente pelo WhatsApp.</span></div></footer>
    {notice && <div role="status" className="toast"><Check size={17}/>{notice}</div>}
    {count > 0 && !cartOpen && <button type="button" className="floating-cart" onClick={() => setCartOpen(true)}><ShoppingBag size={18}/> Ver carrinho <span>{count}</span><ArrowRight size={17}/></button>}

    {selected && <div className="overlay" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setSelected(null); }}><section className="product-modal" role="dialog" aria-modal="true" aria-label={`Detalhes da carta ${selected.name}`}><button type="button" className="modal-close" onClick={() => setSelected(null)} aria-label="Fechar"><X size={20}/></button><div className="modal-photo"><CardDetailViewer key={selected.id} product={selected}/></div><div className="modal-details"><span className="section-eyebrow"><span className="orange-dash"/> DETALHES DA CARTA</span><h2>{selected.name}</h2><p className="modal-set">{selected.set_name} · {selected.card_number}</p><div className="tag-row"><span>{selected.condition}</span><span>{selected.language}</span><span>{selected.finish}</span></div><div className="product-info-rows"><div><span>Raridade</span><strong>{selected.rarity || "Não informada"}</strong></div><div><span>Condição</span><strong>{selected.condition} (informada pelo vendedor)</strong></div><div><span>Disponibilidade</span><strong>{isDemo ? "A confirmar antes da compra" : selected.stock > 0 ? `${selected.stock} ${selected.stock === 1 ? "unidade" : "unidades"}` : "Esgotado"}</strong></div></div><div className="modal-pricing"><small>Valor por unidade</small><strong>{selected.price_cents > 0 ? money(selected.price_cents) : "Sob consulta"}</strong></div>{selected.price_cents <= 0 ? <a className="primary-button" href={whatsAppUrl(PHONE, `Olá! Gostaria de consultar o preço NM de ${selected.name} (${selected.set_name}, ${selected.card_number}) no EduTrainer TCG.`) || "#"} target="_blank" rel="noopener noreferrer"><ExternalLink size={19}/> Consultar preço no WhatsApp</a> : <button className="primary-button" type="button" disabled={selected.stock === 0} onClick={() => { add(selected); setSelected(null); setCartOpen(true); }}><ShoppingBag size={19}/>{selected.stock > 0 ? "Adicionar ao carrinho" : "Produto esgotado"}<ArrowRight size={17}/></button>}<p className="modal-disclaimer">Arte digital e imagens enviadas são fontes distintas; nenhuma delas certifica a condição física. Condição NM informada pelo vendedor, não certificada; confirme fotos individuais do exemplar e disponibilidade antes de comprar.</p></div></section></div>}

    {cartOpen && <div className="drawer-overlay" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setCartOpen(false); }}><aside className="cart-drawer" aria-label="Meu carrinho" role="dialog" aria-modal="true"><div className="drawer-head"><div><span className="section-eyebrow"><span className="orange-dash"/> SUA SELEÇÃO</span><h2>Meu carrinho<span className="heading-period">.</span></h2></div><button type="button" aria-label="Fechar carrinho" onClick={() => setCartOpen(false)}><X size={23}/></button></div><div className="cart-scroll">{itemsInCart.length ? itemsInCart.map(product => <div key={product.id} className="cart-line"><div className="cart-line-img"><ProductVisual product={product}/></div><div className="cart-line-info"><p>{product.name}</p><span>{product.card_number} · {product.condition} · {product.language}</span><strong>{money(product.price_cents)}</strong><div className="qty-control"><button type="button" aria-label={`Retirar uma unidade de ${product.name}`} onClick={() => setCart(current => updateCart(current, product, -1))}><Minus size={13}/></button><span>{cart[product.id]}</span><button type="button" aria-label={`Adicionar uma unidade de ${product.name}`} disabled={cart[product.id] >= product.stock} onClick={() => setCart(current => updateCart(current, product, 1))}><Plus size={13}/></button></div></div><button type="button" className="remove-line" aria-label={`Remover ${product.name} do carrinho`} onClick={() => setCart(current => { const copy = { ...current }; delete copy[product.id]; return copy; })}><Trash2 size={16}/></button></div>) : <div className="empty-cart"><ShoppingBag size={35}/><h3>Seu carrinho está vazio</h3><p>Explore o catálogo e adicione as cartas que deseja consultar.</p><button type="button" onClick={() => setCartOpen(false)}>Continuar explorando <ArrowRight size={16}/></button></div>}</div>{itemsInCart.length > 0 && <div className="drawer-bottom"><div className="subtotal-row"><span>Subtotal ({count} {count === 1 ? "carta" : "cartas"})</span><strong>{money(total)}</strong></div><p>Frete calculado na conversa. O envio não reserva automaticamente o estoque.</p><button className="primary-button whatsapp-button" type="button" onClick={() => setCheckoutOpen(true)} disabled={sending || !PHONE}>{sending ? "Validando estoque..." : PHONE ? "Informar dados e continuar" : "WhatsApp não configurado"}<ArrowRight size={18}/></button><button type="button" className="secondary-button" onClick={copyOrder}><Copy size={16}/> Copiar resumo do pedido</button></div>}</aside></div>}
    {checkoutOpen && <CustomerCheckout count={count} submitting={sending} onClose={() => setCheckoutOpen(false)} onSubmit={sendOrder} />}
  </div>;
}
