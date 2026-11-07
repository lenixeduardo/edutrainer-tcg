import type { Product } from "./types";
import { DEMO_PRODUCTS } from "./demo-data";
import { isDemo, supabase } from "./supabase";

const KEY = "edutrainer:demo-products:v4";
const LEGACY_KEY = "edutrainer:demo-products:v3";
const OLDER_KEY = "edutrainer:demo-products:v2";

export async function loadProducts(): Promise<Product[]> {
  if (isDemo) {
    if (typeof window === "undefined") return DEMO_PRODUCTS;
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed as Product[] : DEMO_PRODUCTS;
      }
      const legacy = localStorage.getItem(LEGACY_KEY) ?? localStorage.getItem(OLDER_KEY);
      if (!legacy) return DEMO_PRODUCTS;
      const old: unknown = JSON.parse(legacy);
      const previous = Array.isArray(old) ? old.filter((item): item is Product => Boolean(item && typeof item.id === "string")) : [];
      const merged: Product[] = DEMO_PRODUCTS.map(seed => {
        const saved = previous.find(item => item.id === seed.id);
        return saved ? { ...seed, price_cents: saved.price_cents, stock: saved.stock, is_published: saved.is_published } : seed;
      });
      for (const oldProduct of previous) if (!merged.some(item => item.id === oldProduct.id)) merged.push(oldProduct);
      localStorage.setItem(KEY, JSON.stringify(merged));
      return merged;
    }
    catch { return DEMO_PRODUCTS; }
  }
  const db = supabase()!;
  const { data, error } = await db.from("products").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(`Falha ao carregar catálogo: ${error.message}`);
  return data as Product[];
}

export async function saveProduct(product: Product): Promise<void> {
  if (isDemo) {
    const items = await loadProducts();
    const index = items.findIndex(item => item.id === product.id);
    if (index >= 0) items[index] = product;
    else items.unshift(product);
    localStorage.setItem(KEY, JSON.stringify(items));
    return;
  }
  const db = supabase()!;
  const { error } = await db.from("products").upsert(product);
  if (error) throw new Error(error.message);
}

export async function uploadPhoto(file: File): Promise<string> {
  if (!file.type.startsWith("image/") || !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) {
    throw new Error("Aceitamos apenas imagens JPEG, PNG, WebP ou AVIF.");
  }
  if (file.size > 6 * 1024 * 1024) throw new Error("A foto deve ter no máximo 6 MB.");
  if (isDemo) {
    if (file.size > 350 * 1024) throw new Error("No modo demo, a foto deve ter até 350 KB. Para fotos maiores, configure o Supabase.");
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Falha ao ler imagem."));
      reader.readAsDataURL(file);
    });
  }
  const db = supabase()!;
  const extension = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
  const path = `${crypto.randomUUID()}/image.${extension}`;
  const { error } = await db.storage.from("card-images").upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  return db.storage.from("card-images").getPublicUrl(path).data.publicUrl;
}
