import type { CSSProperties } from "react";

/** Reusable SVG icon mask. Icons inherit currentColor; parent controls retain accessible labels. */
const files = {
  products: "01-products",
  categories: "02-categories",
  search: "03-search",
  shoppingCart: "04-shopping-cart",
  favorites: "05-favorites",
  promotions: "06-promotions",
  newArrivals: "07-new-arrivals",
  bestSellers: "08-best-sellers",
  freeShipping: "09-free-shipping",
  productDetails: "10-product-details",
  customerSupport: "11-customer-support",
  whatsappOrders: "12-whatsapp-orders",
  storeLocation: "13-store-location",
  storeHours: "14-store-hours",
  myAccount: "15-my-account",
  orderTracking: "16-order-tracking",
  loyaltyProgram: "17-loyalty-program",
  gifts: "18-gifts",
} as const;
export type CatalogIconName = keyof typeof files;

export default function CatalogIcon({ name, size = 24, className }: {
  name: CatalogIconName;
  size?: number;
  className?: string;
}) {
  const url = `url("/icons/catalog/${files[name]}.svg")`;
  const style: CSSProperties = {
    width: size,
    height: size,
    backgroundColor: "currentColor",
    WebkitMaskImage: url,
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    WebkitMaskSize: "contain",
    maskImage: url,
    maskRepeat: "no-repeat",
    maskPosition: "center",
    maskSize: "contain",
  };
  return <span aria-hidden="true" className={className ? `catalog-icon ${className}` : "catalog-icon"} style={style}/>;
}
