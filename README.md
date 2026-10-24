# Petal Touch by Sonu

Demo storefront for [@petal_touch25](https://instagram.com/petal_touch25), handmade chenille bouquets from Surat.

## Stack

- React 19 + Vite, Tailwind CSS v4
- Framer Motion for all animation, Lenis for smooth scrolling
- Phosphor icons, Bodoni Moda (display) + Geist (body), self-hosted via Fontsource

## Run

```bash
npm install
npm run dev
```

## Where things live

- `src/data/products.js`: catalogue, prices, brand contact details. **Prices are sample values.**
- `src/lib/cart.jsx`: cart state (saved in localStorage) and the WhatsApp order message
- `src/components/`: one file per page section, plus `Cart.jsx` (drawer, fly-to-bag, toast) and `ui.jsx` (shared motion helpers)
- `src/assets/ig/`: product photos taken from the brand's Instagram

Checkout currently hands the order to WhatsApp (`wa.me`) with the bag contents pre-filled. Swap `orderMessage` / the drawer footer when a payment flow is chosen.
