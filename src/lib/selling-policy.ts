import type { Product } from "./types";

/**
 * Política comercial EduTrainer TCG.
 *
 * Para SKUs cujo custo de aquisição foi informado pelo vendedor, o piso de
 * anúncio foi calculado separadamente para preservar >= R$ 20 após uma
 * estimativa de embalagem de R$ 3 e 5% de taxa.
 *
 * Não publicar custos de aquisição neste repositório PÚBLICO.
 * Outros SKUs exigem conferência manual do custo antes da venda efetiva.
 * Esta validação client-side NÃO substitui o controle do vendedor ou uma
 * validação autenticada no servidor de uma futura operação com pagamento.
 */
export const MIN_PROFIT_CENTS = 2000;
/**
 * Valor mínimo de triagem para anúncios SEM custo conhecido.
 * Não equivale a R$20 de lucro; sem custo documentado essa margem não pode
 * ser comprovada. Abaixo desse valor o item vira "Sob consulta" (preço 0).
 */
export const MIN_UNVERIFIED_LISTING_CENTS = 2300;
const PRICE_FLOORS: Readonly<Record<string,number>> = {
  "e56c6eef-2a78-55d6-ad6b-b8e2952b25a1": 16490, // Mewtwo 051/108
  "d52a89b0-f932-569e-98a3-41a6d22b88d2": 7990, // Pikachu 035/108
  "571c8be8-0b3e-54c7-9dea-78adb8b062a3": 7990, // Here Comes Team Rocket! 113/108
  "60485173-ad81-5232-8777-ab50ea19217b": 5990, // Misty's Determination 080/108
  "cd51dde9-3c8d-5e4d-8d8f-64d0121001b6": 3490, // Gastly 047/108
  "fa910605-4159-5e11-ad3c-fcd128ba3672": 8490, // Misty's Wrath 114/132
  "ca1a4390-c3ab-52c1-ace1-2d0a830c5f38": 10990, // Misty's Duel 123/132
};

export function minimumSalePrice(product:Pick<Product,"id">): number | null {
  return PRICE_FLOORS[product.id] ?? null;
}

export function priceBelowPolicy(product:Pick<Product,"id"|"price_cents">):boolean {
  const floor=minimumSalePrice(product);
  // Preço 0 indica "Sob consulta", não venda gratuita.
  if (product.price_cents <= 0) return false;
  return floor !== null
    ? product.price_cents < floor
    : product.price_cents < MIN_UNVERIFIED_LISTING_CENTS;
}

export function enforcePriceFloor<T extends Product>(product:T):T {
  const floor=minimumSalePrice(product);
  if (product.price_cents <= 0) return product;
  if (floor !== null) return product.price_cents < floor ? {...product,price_cents:floor} : product;
  // Não inventar um preço de venda ou lucro sem conhecer o custo da carta.
  return product.price_cents < MIN_UNVERIFIED_LISTING_CENTS
    ? {...product,price_cents:0}
    : product;
}
