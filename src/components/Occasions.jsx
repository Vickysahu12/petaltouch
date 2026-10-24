import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
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

/**
 * Native horizontal scroller, so touch swipe, trackpads and momentum all behave like the platform.
 * A mouse can also click-and-drag it; a drag never counts as a tap on a card.
 */
export default function Occasions() {
  const scrollTo = useScrollTo()
  const rail = useRef(null)
  const drag = useRef({ active: false, x: 0, left: 0, moved: false })
  const { scrollXProgress } = useScroll({ container: rail })
  const progress = useSpring(scrollXProgress, { stiffness: 200, damping: 30 })

  const step = (dir) => {
    const el = rail.current
    if (!el) return
    const card = el.querySelector('[data-card]')?.offsetWidth ?? 280
    el.scrollBy({ left: dir * (card + 16) * 2, behavior: 'smooth' })
  }

  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse') return
    drag.current = { active: true, x: e.clientX, left: rail.current.scrollLeft, moved: false }
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d.active) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 5 && !d.moved) {
      d.moved = true
      rail.current.style.scrollSnapType = 'none'
      rail.current.style.scrollBehavior = 'auto'
      rail.current.setPointerCapture(e.pointerId)
    }
    if (d.moved) rail.current.scrollLeft = d.left - dx
  }
  const endDrag = () => {
    if (!drag.current.active) return
    drag.current.active = false
    rail.current.style.scrollSnapType = ''
    rail.current.style.scrollBehavior = ''
    // Let the click that follows a drag see `moved`, then reset
    setTimeout(() => (drag.current.moved = false), 0)
  }

  const open = (o) => {
    if (drag.current.moved) return
    if (o.event) {
      pickEvent(o.event)
      scrollTo('#events')
    } else {
      pickShopTab(o.tab)
      scrollTo('#shop')
    }
  }

  return (
    <section id="occasions" className="pb-20 md:pb-28">
      <div className="mx-auto flex max-w-[1280px] items-end justify-between gap-4 px-4 md:px-10">
        <div>
          <h2 className="font-display text-[clamp(1.9rem,3.2vw,2.75rem)] leading-tight">
            <LineReveal text="Shop by Occasion" />
          </h2>
          <p className="mt-2 text-[15px] text-muted">From the mandap to the birthday cake. Swipe to explore.</p>
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

      <motion.div
        ref={rail}
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
        data-lenis-prevent-wheel
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        className="mt-8 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth px-4 py-1 [scrollbar-width:none] md:cursor-grab md:scroll-px-[max(2.5rem,calc((100vw-1280px)/2+2.5rem))] md:gap-5 md:px-[max(2.5rem,calc((100vw-1280px)/2+2.5rem))] md:active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
      >
        {OCCASIONS.map((o) => (
          <button
            key={o.title}
            data-card
            onClick={() => open(o)}
            className="group relative h-[380px] w-[74vw] max-w-[300px] shrink-0 snap-start overflow-hidden bg-surface text-left md:h-[420px] md:w-[290px]"
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
            {o.event && <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-accent">Events</span>}
            <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
              <span>
                <span className="font-display block text-[1.75rem] leading-tight">{o.title}</span>
                <span className="mt-1 block text-[13px] text-white/80">{o.text}</span>
              </span>
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-accent-ink transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:rotate-45">
                <ArrowUpRight size={16} weight="bold" />
              </span>
            </span>
          </button>
        ))}
        {/* Trailing spacer so the last card can snap clear of the edge */}
        <span aria-hidden className="w-px shrink-0" />
      </motion.div>

      <div className="mx-auto mt-6 max-w-[1280px] px-4 md:px-10">
        <div className="h-[3px] overflow-hidden rounded-full bg-surface-2">
          <motion.div className="h-full origin-left rounded-full bg-accent" style={{ scaleX: progress }} />
        </div>
      </div>
    </section>
  )
}
