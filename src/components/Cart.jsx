import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { X, Minus, Plus, WhatsappLogo, HandbagSimple, Trash, CheckCircle } from '@phosphor-icons/react'
import { useCart, whatsappLink, orderMessage } from '../lib/cart'
import { formatINR } from '../data/products'
import { EASE_OUT } from './ui'
import { useScrollTo } from './Nav'

const DRAWER_EASE = [0.32, 0.72, 0, 1]

export function CartDrawer() {
  const { open, setOpen, lines, subtotal, setQty, count } = useCart()
  const lenis = useLenis()
  const scrollTo = useScrollTo()
  const [form, setForm] = useState({ name: '', date: '', note: '' })

  useEffect(() => {
    if (!open) return
    lenis?.stop()
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      lenis?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [open, lenis, setOpen])

  const [today] = useState(() => new Date().toISOString().slice(0, 10))
  const href = whatsappLink(orderMessage(lines, subtotal, form))
  const field = 'mt-1.5 h-11 w-full border border-line bg-bg px-3.5 text-[15px] text-ink outline-none transition-colors placeholder:text-muted/80 focus:border-ink'

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Your bag">
          <motion.button
            aria-label="Close bag"
            className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.aside
            className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-bg shadow-2xl "
            initial={{ x: '105%' }}
            animate={{ x: 0 }}
            exit={{ x: '105%', transition: { duration: 0.3, ease: DRAWER_EASE } }}
            transition={{ duration: 0.5, ease: DRAWER_EASE }}
          >
            <header className="flex items-center justify-between border-b border-line px-5 py-4 md:px-6">
              <h2 className="font-display text-3xl">
                Your bag <span className="font-sans text-base text-muted">({count})</span>
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="press grid size-9 place-items-center bg-surface hover:bg-surface-2"
                aria-label="Close bag"
              >
                <X size={18} />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <motion.span
                  className="grid size-20 place-items-center bg-surface text-accent"
                  initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: 'spring', duration: 0.6, bounce: 0.35, delay: 0.15 }}
                >
                  <HandbagSimple size={34} weight="light" />
                </motion.span>
                <p className="font-display mt-6 text-3xl">Nothing here yet</p>
                <p className="mt-2 max-w-[28ch] text-muted">Pick a bouquet you love and it will wait for you here.</p>
                <button
                  onClick={() => {
                    setOpen(false)
                    setTimeout(() => scrollTo('#shop'), 250)
                  }}
                  className="press mt-6 h-11 rounded-[3px] bg-accent px-6 text-sm font-medium text-accent-ink"
                >
                  Shop bouquets
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto overscroll-contain px-5 md:px-6" data-lenis-prevent>
                  <ul>
                    <AnimatePresence initial={false}>
                      {lines.map(({ product, qty }) => (
                        <motion.li
                          key={product.id}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: EASE_OUT }}
                          className="overflow-hidden"
                        >
                          <div className="flex gap-4 border-b border-line py-4">
                            <img src={product.image} alt="" className="size-20 shrink-0 object-cover bg-surface" />
                            <div className="flex min-w-0 flex-1 flex-col">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="truncate font-medium">{product.name}</p>
                                  <p className="truncate text-sm text-muted">{product.detail}</p>
                                </div>
                                <button
                                  onClick={() => setQty(product.id, 0)}
                                  className="press -mr-1 grid size-8 shrink-0 place-items-center rounded-full text-muted hover:bg-surface hover:text-accent"
                                  aria-label={`Remove ${product.name}`}
                                >
                                  <Trash size={16} />
                                </button>
                              </div>
                              <div className="mt-auto flex items-center justify-between pt-2">
                                <div className="inline-flex items-center border border-line">
                                  <button
                                    onClick={() => setQty(product.id, qty - 1)}
                                    className="press grid size-8 place-items-center hover:bg-surface"
                                    aria-label="Decrease"
                                  >
                                    <Minus size={12} weight="bold" />
                                  </button>
                                  <span className="w-6 text-center text-sm tabular-nums">{qty}</span>
                                  <button
                                    onClick={() => setQty(product.id, qty + 1)}
                                    className="press grid size-8 place-items-center hover:bg-surface"
                                    aria-label="Increase"
                                  >
                                    <Plus size={12} weight="bold" />
                                  </button>
                                </div>
                                <span className="font-semibold tabular-nums">{formatINR(product.price * qty)}</span>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>

                  <div className="grid gap-4 py-6">
                    <label className="block text-sm font-medium">
                      Your name
                      <input
                        className={field}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        autoComplete="name"
                        placeholder="So Sonu knows who it’s for"
                      />
                    </label>
                    <label className="block text-sm font-medium">
                      Needed by
                      <input
                        type="date"
                        min={today}
                        className={field}
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                      />
                    </label>
                    <label className="block text-sm font-medium">
                      Note or colour changes <span className="font-normal text-muted">(optional)</span>
                      <textarea
                        rows={2}
                        className={`${field} h-auto resize-none py-2.5`}
                        value={form.note}
                        onChange={(e) => setForm({ ...form, note: e.target.value })}
                        placeholder="e.g. make the wrap pink, add a name tag"
                      />
                    </label>
                  </div>
                </div>

                <footer className="border-t border-line px-5 py-5 md:px-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-muted">Subtotal</span>
                    <motion.span key={subtotal} initial={{ opacity: 0.4, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold tabular-nums">
                      {formatINR(subtotal)}
                    </motion.span>
                  </div>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="press mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[3px] bg-accent font-medium text-accent-ink hover:bg-accent-hover"
                  >
                    <WhatsappLogo size={20} weight="fill" /> Order on WhatsApp
                  </a>
                  <p className="mt-3 text-center text-xs leading-relaxed text-muted">
                    Your order opens in WhatsApp. Sonu confirms the date, delivery and payment with you there.
                  </p>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}

/** Thumbnails that arc from the product photo into the bag button. */
export function Flights() {
  const { flights, landFlight, cartIconRef } = useCart()
  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[95]">
      {flights.map((f) => {
        const size = Math.min(f.from.width, 120)
        const startX = f.from.left + f.from.width / 2 - size / 2
        const startY = f.from.top + f.from.height / 2 - size / 2
        const endX = f.to.left + f.to.width / 2 - size / 2
        const endY = f.to.top + f.to.height / 2 - size / 2
        return (
          <motion.img
            key={f.id}
            src={f.image}
            alt=""
            className="absolute left-0 top-0 rounded-full object-cover shadow-xl"
            style={{ width: size, height: size }}
            initial={{ x: startX, y: startY, scale: 1, opacity: 1 }}
            animate={{ x: endX, y: endY, scale: 0.18, opacity: 0.9 }}
            transition={{
              x: { duration: 0.75, ease: [0.4, 0, 0.2, 1] },
              y: { duration: 0.75, ease: [0.6, -0.35, 0.7, 0.2] },
              scale: { duration: 0.75, ease: [0.4, 0, 0.6, 1] },
            }}
            onAnimationComplete={() => {
              landFlight(f.id)
              cartIconRef.current?.animate(
                [{ transform: 'scale(1)' }, { transform: 'scale(1.14)' }, { transform: 'scale(1)' }],
                { duration: 380, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
              )
            }}
          />
        )
      })}
    </div>,
    document.body,
  )
}

export function Toast() {
  const { toast, open, setOpen } = useCart()
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[96] flex justify-center px-4" aria-live="polite">
      <AnimatePresence mode="popLayout">
        {toast && !open && (
          <motion.div
            key={toast.key}
            className="pointer-events-auto flex items-center gap-3 rounded-[4px] bg-ink py-2 pl-4 pr-2 text-sm text-bg shadow-xl"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98, transition: { duration: 0.18 } }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0.2 }}
          >
            <CheckCircle size={18} weight="fill" className="text-accent" />
            <span>{toast.message}</span>
            <button onClick={() => setOpen(true)} className="press rounded-[3px] bg-bg/15 px-3 py-1.5 font-medium hover:bg-bg/25">
              View bag
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
