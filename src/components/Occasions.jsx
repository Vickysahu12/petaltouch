import { useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@phosphor-icons/react'
import { images } from '../data/products'
import { LineReveal, EASE_OUT } from './ui'
import { useScrollTo } from './Nav'

// Event occasions open the Weddings & Functions planner, the rest open a shop tab
const OCCASIONS = [
  { title: 'Weddings', text: 'Bridal bouquets and return gifts', image: images.gardenMix, event: 'wedding' },
  { title: 'Engagement', text: 'Blush lilies for the ring ceremony', image: images.pinkLilyTulip, event: 'engagement' },
  { title: 'Haldi & Mehendi', text: 'Sunshine yellow everything', image: images.sunflowerDusk, event: 'haldi' },
  { title: 'Birthdays', text: 'KitKat bouquets and bright mixes', image: images.kitkatRose, tab: 'gifts' },
  { title: 'Anniversaries', text: 'Soft lilies, sweet notes', image: images.skyLily, tab: 'lilies' },
  { title: 'Festive & Rakhi', text: 'Lucky nazar blooms', image: images.nazarBlue, tab: 'nazar' },
  { title: 'Baby Shower', text: 'Pastel stems for godh bharai', image: images.lavenderMini, event: 'baby' },
  { title: 'Just Because', text: 'Single stems from ₹69', image: images.sunflowerStem, tab: 'singles' },
]

export function pickShopTab(tab) {
  window.dispatchEvent(new CustomEvent('petal:tab', { detail: tab }))
}
export function pickEvent(id) {
  window.dispatchEvent(new CustomEvent('petal:event', { detail: id }))
}

export default function Occasions() {
  const scrollTo = useScrollTo()
  const viewport = useRef(null)
  const track = useRef(null)
  const x = useMotionValue(0)
  const [bounds, setBounds] = useState({ left: 0, right: 0 })
  const dragged = useRef(false)

  useEffect(() => {
    const measure = () => {
      if (!viewport.current || !track.current) return
      setBounds({ left: Math.min(0, viewport.current.offsetWidth - track.current.scrollWidth), right: 0 })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const step = (dir) => {
    const card = track.current?.firstElementChild?.offsetWidth ?? 300
    const next = Math.max(bounds.left, Math.min(0, x.get() - dir * (card + 20) * 2))
    animate(x, next, { type: 'spring', stiffness: 260, damping: 32 })
  }

  const open = (o) => {
    if (dragged.current) return
    if (o.event) {
      pickEvent(o.event)
      scrollTo('#events')
    } else {
      pickShopTab(o.tab)
      scrollTo('#shop')
    }
  }

  return (
    <section id="occasions" className="overflow-hidden pb-20 md:pb-28">
      <div className="mx-auto flex max-w-[1280px] items-end justify-between gap-4 px-4 md:px-10">
        <div>
          <h2 className="font-display text-[clamp(1.9rem,3.2vw,2.75rem)] leading-tight">
            <LineReveal text="Shop by Occasion" />
          </h2>
          <p className="mt-2 text-[15px] text-muted">From the mandap to the birthday cake. Drag to explore.</p>
        </div>
        <div className="hidden gap-2 md:flex">
          {[
            { dir: -1, icon: ArrowLeft, label: 'Previous occasions' },
            { dir: 1, icon: ArrowRight, label: 'Next occasions' },
          ].map((b) => (
            <button
              key={b.label}
              onClick={() => step(b.dir)}
              aria-label={b.label}
              className="press grid size-11 place-items-center rounded-full border border-ink/70 transition-colors hover:border-accent hover:bg-accent hover:text-accent-ink"
            >
              <b.icon size={18} />
            </button>
          ))}
        </div>
      </div>

      <div ref={viewport} className="mx-auto mt-8 max-w-[1280px] px-4 md:px-10">
        <motion.div
          ref={track}
          className="flex cursor-grab gap-4 active:cursor-grabbing md:gap-5"
          style={{ x }}
          drag="x"
          dragConstraints={bounds}
          dragElastic={0.12}
          onDragStart={() => (dragged.current = true)}
          onDragEnd={() => setTimeout(() => (dragged.current = false), 50)}
        >
          {OCCASIONS.map((o, i) => (
            <motion.button
              key={o.title}
              onClick={() => open(o)}
              className="group relative h-[360px] w-[240px] shrink-0 overflow-hidden bg-surface text-left md:h-[420px] md:w-[290px]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: Math.min(i, 5) * 0.07, ease: EASE_OUT }}
              aria-label={`${o.title}: ${o.text}`}
            >
              <img
                src={o.image}
                alt=""
                draggable={false}
                loading="lazy"
                className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-[var(--ease-out-strong)] group-hover:scale-[1.08]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              {o.event && (
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-accent">Events</span>
              )}
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
                <span>
                  <span className="font-display block text-[1.75rem] leading-tight">{o.title}</span>
                  <span className="mt-1 block text-[13px] text-white/80">{o.text}</span>
                </span>
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-accent-ink transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:rotate-45">
                  <ArrowUpRight size={16} weight="bold" />
                </span>
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
