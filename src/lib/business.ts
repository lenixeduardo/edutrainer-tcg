import type { Product, Cart } from "./types";

export const money = (cents: number): string =>
  (Math.max(0, cents) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const normalizePhone = (input: string): string | null => {
  const cleaned = input.replace(/\D/g, "");
  return /^[1-9]\d{9,14}$/.test(cleaned) ? cleaned : null;
};

export const getQuantity = (cart: Cart, id: string) => Math.max(0, Math.trunc(cart[id] ?? 0));

export const updateCart = (cart: Cart, product: Product, delta: number): Cart => {
  const next = Math.max(0, Math.min(product.stock, getQuantity(cart, product.id) + delta));
  const copy = { ...cart };
  if (next === 0) delete copy[product.id];
  else copy[product.id] = next;
  return copy;
};

export const reconcileCart = (cart: Cart, products: Product[]): Cart => {
  const byId = new Map(products.map(product => [product.id, product]));
  const next: Cart = {};
  for (const [id, raw] of Object.entries(cart)) {
    const item = byId.get(id);
    if (item && item.is_published && item.stock > 0 && Number.isFinite(raw)) {
      const quantity = Math.max(0, Math.min(item.stock, Math.trunc(raw)));
      if (quantity > 0) next[id] = quantity;
    }
  }
  return next;
};

export const cartTotal = (cart: Cart, products: Product[]): number =>
  products.reduce((total, product) => total + getQuantity(cart, product.id) * product.price_cents, 0);

export const cartCount = (cart: Cart): number => Object.values(cart).reduce((a, b) => a + Math.max(0, b), 0);

export const whatsAppMessage = (cart: Cart, products: Product[]): string => {
  const selected = products.filter(product => getQuantity(cart, product.id) > 0);
  if (selected.length === 0) return "";
  const lines = ["Olá! Quero consultar a disponibilidade destas cartas da EduTrainer TCG:", ""];
  for (const [index, product] of selected.entries()) {
    const count = getQuantity(cart, product.id);
    lines.push(`${index + 1}. ${count}x ${product.name} (${product.set_name} • ${product.card_number})`);
    lines.push(`   ${product.condition} • ${product.language} • ${product.finish}`);
    lines.push(`   ${money(product.price_cents)} / un. — ${money(count * product.price_cents)}`);
  }
  lines.push("", `Subtotal das cartas: ${money(cartTotal(cart, selected))}`,
    "Frete não incluído. Valores e disponibilidade sujeitos à confirmação.",
    "", "Pode confirmar o estoque e calcular o frete?");
  return lines.join("\n");
};

export const whatsAppUrl = (phone: string, message: string): string | null => {
  const valid = normalizePhone(phone);
  return valid && message ? `https://wa.me/${valid}?text=${encodeURIComponent(message)}` : null;
};

export const parsePrice = (input: string): number | null => {
  const normalized = input.trim().replace(/\s/g, "").replace(/^R\$/i, "").replace(/\./g, "").replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const cents = Math.round(Number(normalized) * 100);
  return Number.isSafeInteger(cents) && cents >= 0 ? cents : null;
};
