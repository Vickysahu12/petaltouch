import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { HandbagSimple, List, X, MagnifyingGlass, WhatsappLogo, InstagramLogo } from '@phosphor-icons/react'
import { useCart } from '../lib/cart'
import { BRAND, formatINR, products } from '../data/products'
import { EASE_OUT } from './ui'

export const NAV_LINKS = [
  { href: '#top', label: 'Home' },
  { href: '#shop', label: 'Shop' },
  { href: '#occasions', label: 'Occasions' },
  { href: '#events', label: 'Weddings' },
  { href: '#gifts', label: 'Gift Box' },
  { href: '#visit', label: 'Visit Us' },
  { href: '#contact', label: 'Contact' },
]

export function useScrollTo() {
  const lenis = useLenis()
  return (href) => {
    const el = document.querySelector(href)
    if (!el) return
    if (lenis) lenis.scrollTo(href === '#top' ? 0 : el, { offset: -90, duration: 1.4 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }
}

function Search({ onPick, onClose }) {
  const [q, setQ] = useState('')
  const inputRef = useRef(null)
  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  const term = q.trim().toLowerCase()
  const results = term ? products.filter((p) => (p.name + ' ' + p.detail + ' ' + p.tags.join(' ')).toLowerCase().includes(term)) : products.slice(0, 4)

  return (
    <motion.div
      className="absolute right-0 top-[calc(100%+14px)] w-[min(92vw,380px)] origin-top-right rounded-2xl border border-line bg-bg p-3 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.25)]"
      initial={{ opacity: 0, scale: 0.96, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.12 } }}
      transition={{ duration: 0.18, ease: EASE_OUT }}
    >
      <label className="flex h-10 items-center gap-2 rounded-full border border-line px-3.5 focus-within:border-ink">
        <MagnifyingGlass size={16} className="text-muted" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search sunflowers, lilies, nazar..."
          className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
          aria-label="Search products"
        />
      </label>
      <ul className="mt-2 max-h-80 overflow-auto" data-lenis-prevent>
        {results.length === 0 && <li className="px-2 py-6 text-center text-sm text-muted">No flowers match “{q}”. Try “sunflower”.</li>}
        {results.map((p) => (
          <li key={p.id}>
            <button onClick={() => onPick(p)} className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-surface">
              <img src={p.image} alt="" className="size-11 rounded-lg object-cover" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{p.name}</span>
                <span className="block truncate text-xs text-muted">{p.detail}</span>
              </span>
              <span className="text-sm font-semibold">{formatINR(p.price)}</span>
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export default function Nav() {
  const { count, setOpen, cartIconRef, setQuick } = useCart()
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const [active, setActive] = useState('#top')
  const scrollTo = useScrollTo()

  // Bring the bar back whenever something lands in the bag, so the count is visible
  const lastCount = useRef(count)
  const pinnedUntil = useRef(0)
  useEffect(() => {
    if (count > lastCount.current) {
      setHidden(false)
      pinnedUntil.current = performance.now() + 2500
    }
    lastCount.current = count
  }, [count])

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    if (y > 500 && y > prev + 4) {
      if (performance.now() > pinnedUntil.current && !search) setHidden(true)
    } else if (y < prev - 4) setHidden(false)
  })

  // Underline the link of the section currently in view
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1))
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive('#' + e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  const go = (e, href) => {
    e.preventDefault()
    setMenu(false)
    scrollTo(href)
  }

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-3 z-50 px-3 md:top-5 md:px-8"
        animate={{ y: hidden && !menu ? '-110%' : '0%' }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
      >
        <div className="mx-auto max-w-[1240px]">
          <div className="flex h-14 items-center justify-between rounded-full bg-bg/90 pl-2 pr-2 shadow-[0_10px_40px_-12px_rgb(120_40_70/0.25)] ring-1 ring-black/5 backdrop-blur-xl md:pl-2.5">
            <div className="flex items-center gap-1.5">
              <a href="#top" onClick={(e) => go(e, '#top')} className="press mr-1 flex items-center gap-2" aria-label="Petal Touch home">
                <img src={BRAND.logo} alt="" className="size-10 rounded-full ring-1 ring-line" />
                <span className="font-wide hidden text-[13px] font-semibold uppercase tracking-wide sm:block xl:hidden">Petal Touch</span>
              </a>
              {[
                { href: `https://wa.me/${BRAND.whatsapp}`, icon: WhatsappLogo, label: 'WhatsApp' },
                { href: `https://instagram.com/${BRAND.instagram}`, icon: InstagramLogo, label: 'Instagram' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="press hidden size-8 place-items-center rounded-full bg-[#ff8fb8] text-white transition-transform hover:-rotate-12 hover:bg-accent xl:grid"
                >
                  <s.icon size={16} weight="fill" />
                </a>
              ))}
            </div>

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => go(e, l.href)}
                  className={`relative rounded-full px-3.5 py-1.5 text-[13.5px] transition-colors duration-200 hover:text-ink ${active === l.href ? 'text-ink' : 'text-muted'}`}
                >
                  {active === l.href && (
                    <motion.span layoutId="nav-underline" className="absolute inset-0 rounded-full bg-surface" transition={{ type: 'spring', duration: 0.45, bounce: 0.15 }} />
                  )}
                  <span className="relative">{l.label}</span>
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-1">
              <div className="relative">
                <button
                  onClick={() => setSearch((s) => !s)}
                  className="press grid size-10 place-items-center rounded-full text-ink hover:bg-surface"
                  aria-label="Search"
                  aria-expanded={search}
                >
                  <MagnifyingGlass size={19} />
                </button>
                <AnimatePresence>
                  {search && (
                    <Search
                      onClose={() => setSearch(false)}
                      onPick={(p) => {
                        setSearch(false)
                        setQuick(p)
                      }}
                    />
                  )}
                </AnimatePresence>
              </div>
              <button
                ref={cartIconRef}
                onClick={() => setOpen(true)}
                className="press relative grid size-10 place-items-center rounded-full text-ink hover:bg-surface"
                aria-label={`Open bag, ${count} items`}
              >
                <HandbagSimple size={20} />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      key={count}
                      className="absolute right-0.5 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-ink"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: 'spring', duration: 0.35, bounce: 0.45 }}
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <a
                href={`https://wa.me/${BRAND.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="press ml-1 hidden h-10 items-center rounded-full bg-accent px-5 text-[13px] font-medium text-accent-ink hover:bg-accent-hover sm:inline-flex"
              >
                Order Now
              </a>
              <button
                onClick={() => setMenu((m) => !m)}
                className="press grid size-10 place-items-center text-ink lg:hidden"
                aria-label={menu ? 'Close menu' : 'Open menu'}
                aria-expanded={menu}
              >
                {menu ? <X size={22} /> : <List size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-40 bg-bg px-4 pt-24 lg:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
          >
            <nav className="flex flex-col" aria-label="Mobile">
              {NAV_LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => go(e, l.href)}
                  className="font-display border-b border-line py-4 text-3xl"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.45, ease: EASE_OUT }}
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <a
              href={`https://wa.me/${BRAND.whatsapp}`}
              className="mt-8 inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-medium text-accent-ink"
            >
              Order Now
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
