import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { Plus, Minus, X, WhatsappLogo, Eye } from '@phosphor-icons/react'
import { categories, formatINR, products } from '../data/products'
import { useCart, whatsappLink } from '../lib/cart'
import { Button, EASE_OUT, LineReveal } from './ui'

export default function Shop() {
  const [cat, setCat] = useState(categories[0].id)
  const [all, setAll] = useState(false)
  const { setQuick } = useCart()
  const visible = all ? products : products.filter((p) => p.tags.includes(cat)).slice(0, 4)

  // Occasion tiles elsewhere on the page can pick a tab
  useEffect(() => {
    const onTab = (e) => {
      setCat(e.detail)
      setAll(false)
    }
    window.addEventListener('petal:tab', onTab)
    return () => window.removeEventListener('petal:tab', onTab)
  }, [])

  return (
    <section id="shop" className="mx-auto max-w-[1280px] px-4 pb-20 md:px-10 md:pb-28">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-[clamp(1.9rem,3.2vw,2.75rem)] leading-tight">
          <LineReveal text="Choose Our Best Bouquet" />
        </h2>
        <Button size="sm" onClick={() => setAll((a) => !a)}>
          {all ? 'Show Less' : 'View All'}
        </Button>
      </div>

      <div className="-mx-4 mt-6 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0" role="tablist" aria-label="Filter by flower">
        <div className="flex gap-1 md:gap-6">
          {categories.map((c) => {
            const active = !all && c.id === cat
            return (
              <button
                key={c.id}
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setCat(c.id)
                  setAll(false)
                }}
                className={`press relative whitespace-nowrap px-5 py-1.5 text-sm transition-colors duration-200 ${active ? 'font-medium text-ink' : 'text-muted hover:text-ink'}`}
              >
                {active && <motion.span layoutId="tab-box" className="absolute inset-0 bg-surface" transition={{ type: 'spring', duration: 0.45, bounce: 0.12 }} />}
                <span className="relative">{c.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <LayoutGroup>
        <motion.ul layout className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 md:gap-x-5 lg:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p, i) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.18 } }}
                transition={{ duration: 0.55, delay: Math.min(i, 8) * 0.05, ease: EASE_OUT }}
              >
                <ProductCard product={p} onQuickView={() => setQuick(p)} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>
    </section>
  )
}

/** "Shop Now" adds to the bag, then the button becomes a quantity stepper. */
export function AddControl({ product, imgRef, size = 'sm' }) {
  const { items, add, setQty } = useCart()
  const qty = items[product.id] || 0
  const lg = size === 'lg'
  const h = lg ? 'h-12' : 'h-8'

  return (
    <div className={`relative ${h} ${lg ? 'w-full' : ''}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        {qty === 0 ? (
          <motion.button
            key="add"
            onClick={() => add(product, imgRef?.current)}
            className={`press inline-flex ${h} items-center justify-center gap-1.5 rounded-[3px] border font-medium transition-colors ${
              lg
                ? 'w-full border-accent bg-accent text-[15px] text-accent-ink hover:bg-accent-hover'
                : 'border-ink/70 px-3 text-xs text-ink hover:border-accent hover:bg-accent hover:text-accent-ink'
            }`}
            initial={{ opacity: 0, filter: 'blur(3px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(3px)' }}
            transition={{ duration: 0.18 }}
            aria-label={`Add ${product.name} to bag`}
          >
            {lg ? `Add to Cart, ${formatINR(product.price)}` : 'Shop Now'}
          </motion.button>
        ) : (
          <motion.div
            key="stepper"
            className={`inline-flex ${h} items-center rounded-[3px] bg-accent text-accent-ink ${lg ? 'w-full justify-between' : ''}`}
            initial={{ opacity: 0, filter: 'blur(3px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(3px)' }}
            transition={{ duration: 0.18 }}
          >
            <button
              onClick={() => setQty(product.id, qty - 1)}
              className={`press grid ${h} aspect-square place-items-center hover:bg-black/10`}
              aria-label={`Remove one ${product.name}`}
            >
              <Minus size={12} weight="bold" />
            </button>
            <span className="relative w-5 overflow-hidden text-center text-xs font-semibold tabular-nums">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={qty}
                  className="block"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.22, ease: EASE_OUT }}
                >
                  {qty}
                </motion.span>
              </AnimatePresence>
            </span>
            <button
              onClick={() => add(product, imgRef?.current)}
              className={`press grid ${h} aspect-square place-items-center hover:bg-black/10`}
              aria-label={`Add one more ${product.name}`}
            >
              <Plus size={12} weight="bold" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ProductCard({ product, onQuickView }) {
  const imgRef = useRef(null)
  return (
    <article className="group">
      <motion.button
        layoutId={`img-${product.id}`}
        onClick={onQuickView}
        className="relative block aspect-[105/100] w-full overflow-hidden bg-surface"
        aria-label={`Quick view ${product.name}`}
        transition={{ type: 'spring', duration: 0.55, bounce: 0.1 }}
      >
        <img
          ref={imgRef}
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--ease-out-strong)] [@media(hover:hover)]:group-hover:scale-[1.06]"
        />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-full items-center justify-center gap-1.5 bg-ink/85 py-2.5 text-xs font-medium tracking-wide text-bg transition-transform duration-300 ease-[var(--ease-out-strong)] [@media(hover:hover)]:flex group-hover:translate-y-0">
          <Eye size={14} /> Quick View
        </span>
      </motion.button>
      <p className="mt-3 truncate text-[13px] md:text-sm">
        <span className="font-medium">{product.name}</span>
        <span className="text-muted"> ({product.detail})</span>
      </p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-[17px] font-bold tabular-nums md:text-lg">{formatINR(product.price)}</span>
        <AddControl product={product} imgRef={imgRef} />
      </div>
    </article>
  )
}

export function QuickView() {
  const { quick: product, setQuick } = useCart()
  return <AnimatePresence>{product && <QuickViewPanel key={product.id} product={product} onClose={() => setQuick(null)} />}</AnimatePresence>
}

function QuickViewPanel({ product, onClose }) {
  const lenis = useLenis()
  const reduce = useReducedMotion()
  const imgRef = useRef(null)

  useEffect(() => {
    lenis?.stop()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      lenis?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [lenis, onClose])

  return (
    <div className="fixed inset-0 z-[70] grid place-items-end md:place-items-center md:p-6" role="dialog" aria-modal="true" aria-label={product.name}>
      <motion.button
        aria-label="Close"
        className="absolute inset-0 bg-ink/45"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      />
      <motion.div
        className="relative grid max-h-[92dvh] w-full max-w-4xl overflow-auto bg-bg md:grid-cols-2"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 32, transition: { duration: 0.2 } }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        data-lenis-prevent
      >
        <motion.div
          layoutId={`img-${product.id}`}
          className="relative aspect-square overflow-hidden bg-surface md:aspect-auto md:min-h-[520px]"
          transition={{ type: 'spring', duration: 0.55, bounce: 0.1 }}
        >
          <img ref={imgRef} src={product.image} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
        </motion.div>
        <div className="flex flex-col p-6 md:p-9">
          <button onClick={onClose} className="press ml-auto grid size-9 place-items-center bg-surface hover:bg-surface-2" aria-label="Close quick view">
            <X size={16} />
          </button>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.45, ease: EASE_OUT }}
            className="flex flex-1 flex-col"
          >
            <p className="text-sm text-muted">{product.detail}</p>
            <h3 className="font-display mt-1 text-4xl leading-tight">{product.name}</h3>
            <p className="mt-2 text-2xl font-bold tabular-nums">{formatINR(product.price)}</p>
            <p className="mt-5 text-[15px] leading-relaxed text-muted">{product.blurb}</p>
            <ul className="mt-5 space-y-1.5 text-sm text-muted">
              <li>Handmade to order by Sonu</li>
              <li>Delivery across Surat, or pick up at the stall</li>
              <li>Colours can be changed on request</li>
            </ul>
            <div className="mt-auto flex flex-col gap-2.5 pt-8">
              <AddControl product={product} imgRef={imgRef} size="lg" />
              <a
                href={whatsappLink(`Hi Sonu! I have a question about the ${product.name}.`)}
                target="_blank"
                rel="noreferrer"
                className="press inline-flex h-12 items-center justify-center gap-2 rounded-[3px] border border-ink/70 text-sm font-medium hover:bg-ink hover:text-bg"
              >
                <WhatsappLogo size={18} /> Ask Sonu on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
