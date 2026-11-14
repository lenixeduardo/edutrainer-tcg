# Iconografia monoline do catálogo

Os 18 SVGs ficam em `public/icons/catalog/`: viewBox 24×24, stroke de 2px, sem preenchimento, fundo transparente. O componente `src/components/catalog-icon.tsx` usa CSS mask para que os ícones herdem `currentColor` sem exigir variações dos arquivos.

Uso:
```tsx
import CatalogIcon from "./catalog-icon";
<CatalogIcon name="search" size={20}/>
<CatalogIcon name="shoppingCart" size={24}/>
```

Ícones aplicados: `products` (navegação), `categories` (aba Todas), `search` (pesquisa/estado vazio), `shoppingCart` (carrinho e ação de compra), `promotions` (aba Promo), `productDetails` (modal), `customerSupport` (rodapé), `whatsappOrders` (contato e checkout).

Demais ícones ficam disponíveis para versões futuras, sem inserir funções fictícias de favoritos, conta do comprador, rastreamento, fidelidade, brindes ou frete grátis. Os ícones são decorativos, e os controles mantêm os respectivos textos e atributos acessíveis.

Nenhuma regra de negócio, rota, preço, estoque ou política comercial foi modificada.
