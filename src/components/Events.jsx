import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Minus, Plus, WhatsappLogo } from '@phosphor-icons/react'
import { images } from '../data/products'
import { whatsappLink } from '../lib/cart'
import { LineReveal, Reveal, EASE_OUT, EASE_IN_OUT } from './ui'
import { Blossom } from './Blossom'

// Event copy is demo content. Confirm with Sonu which event services Petal Touch will offer.
const EVENTS = [
  {
    id: 'wedding',
    label: 'Wedding',
    title: 'Florals for the Big Day',
    text: 'Bridesmaid bouquets, table flowers and guest return gifts that stay perfect long after the last dance.',
    image: images.gardenMix,
    picks: ['Bridal bouquet', 'Bridesmaid bunches', 'Return gift stems', 'Table centrepieces'],
  },
  {
    id: 'engagement',
    label: 'Engagement',
    title: 'Ring Ceremony Blooms',
    text: 'Blush lilies and tulips for the couple, with matching mini bunches for both families.',
    image: images.pinkLilyTulip,
    picks: ['Couple bouquet', 'Family mini bunches', 'Ring tray flowers', 'Photo props'],
  },
  {
    id: 'haldi',
    label: 'Haldi & Mehendi',
    title: 'Sunshine for Haldi',
    text: 'Bright yellow sunflowers and daisies for haldi trays, mehendi decor and happy little favours.',
    image: images.sunflowerDusk,
    picks: ['Haldi tray flowers', 'Sunflower favours', 'Hair and wrist stems', 'Decor bunches'],
  },
  {
    id: 'baby',
    label: 'Baby Shower',
    title: 'Soft Pastels for Godh Bharai',
    text: 'Pastel blue, lilac and blush stems for the mom-to-be, plus sweet return gifts for every guest.',
    image: images.lavenderMini,
    picks: ['Mom-to-be bouquet', 'Pastel return gifts', 'Cake-table flowers', 'Name-tag stems'],
  },
  {
    id: 'corporate',
    label: 'Corporate',
    title: 'Gifting That Lasts',
    text: 'Desk bouquets and single stems for launches, Diwali gifting and staff thank-yous, in your brand colours.',
    image: images.nazarBlue,
    picks: ['Diwali gift stems', 'Desk bouquets', 'Brand-colour wraps', 'Client hampers'],
  },
  {
    id: 'party',
    label: 'Birthday Party',
    title: 'Party Favours with a Twist',
    text: 'KitKat bouquets for the birthday star and tiny chenille favours for every friend at the party.',
    image: images.kitkatRose,
    picks: ['KitKat bouquet', 'Kids party favours', 'Cake toppers', 'Balloon-tie stems'],
  },
]

export default function Events() {
  const [active, setActive] = useState(EVENTS[0].id)
  const [qty, setQty] = useState(50)
  const [date, setDate] = useState('')
  const ev = EVENTS.find((e) => e.id === active)

  // Occasion cards elsewhere can open a specific event
  useEffect(() => {
    const onEvent = (e) => EVENTS.some((x) => x.id === e.detail) && setActive(e.detail)
    window.addEventListener('petal:event', onEvent)
    return () => window.removeEventListener('petal:event', onEvent)
  }, [])

  const message = [
    `Hi Sonu! I'm planning a ${ev.label.toLowerCase()} and would love Petal Touch flowers 💐`,
    '',
    `Approx. pieces: ${qty}`,
    date && `Event date: ${date}`,
    '',
    'Could you share options and pricing?',
  ]
    .filter((x) => x !== false)
    .join('\n')

  const change = (d) => setQty((q) => Math.min(500, Math.max(10, q + d)))

  return (
    <section id="events" className="relative overflow-hidden bg-surface">
      <Blossom tone="blush" size={180} className="pointer-events-none absolute -left-16 top-10 opacity-60" />
      <Blossom tone="white" size={120} className="pointer-events-none absolute -right-8 bottom-16 opacity-80" />

      <div className="relative mx-auto max-w-[1280px] px-4 py-20 md:px-10 md:py-28">
        <div className="text-center">
          <Reveal>
            <p className="font-wide text-xs font-semibold uppercase tracking-[0.22em] text-accent">Weddings & Functions</p>
          </Reveal>
          <h2 className="font-display mt-4 text-[clamp(2.2rem,4.4vw,3.75rem)] leading-[1.05]">
            <LineReveal text="Flowers for Every" className="block" />
            <LineReveal text="Celebration" className="block italic text-accent" delay={0.1} />
          </h2>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-4 max-w-[52ch] text-[15px] leading-relaxed text-muted">
              Planning something big? Sonu makes bulk orders for weddings, family functions and office events, in any colour you
              like.
            </p>
          </Reveal>
        </div>

        <div className="-mx-4 mt-10 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0" role="tablist" aria-label="Event type">
          <div className="mx-auto flex w-max gap-1 rounded-full bg-bg p-1 shadow-sm ring-1 ring-line">
            {EVENTS.map((e) => (
              <button
                key={e.id}
                role="tab"
                aria-selected={active === e.id}
                onClick={() => setActive(e.id)}
                className={`press relative whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors duration-200 md:px-5 ${
                  active === e.id ? 'text-accent-ink' : 'text-muted hover:text-ink'
                }`}
              >
                {active === e.id && (
                  <motion.span layoutId="event-pill" className="absolute inset-0 rounded-full bg-accent" transition={{ type: 'spring', duration: 0.5, bounce: 0.18 }} />
                )}
                <span className="relative">{e.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 bg-bg p-3 shadow-[0_30px_80px_-40px_rgb(150_40_90/0.35)] md:grid-cols-[1.1fr_1fr] md:gap-10 md:p-4">
          <div className="relative aspect-[4/3] overflow-hidden bg-surface md:aspect-auto md:min-h-[480px]">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.img
                key={ev.id}
                src={ev.image}
                alt={`${ev.label} flowers by Petal Touch`}
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ clipPath: 'inset(0% 0% 0% 100%)', scale: 1.1 }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.3 } }}
                transition={{ clipPath: { duration: 0.8, ease: EASE_IN_OUT }, scale: { duration: 1.2, ease: EASE_OUT } }}
              />
            </AnimatePresence>
          </div>

          <div className="flex flex-col p-3 md:py-8 md:pr-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(4px)', transition: { duration: 0.18 } }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
              >
                <h3 className="font-display text-[clamp(1.75rem,2.6vw,2.4rem)] leading-tight">{ev.title}</h3>
                <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-muted">{ev.text}</p>
                <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3">
                  {ev.picks.map((p, i) => (
                    <motion.li
                      key={p}
                      className="flex items-center gap-2 text-sm"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.12 + i * 0.05, duration: 0.35, ease: EASE_OUT }}
                    >
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-blush text-accent">
                        <Check size={11} weight="bold" />
                      </span>
                      {p}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 grid gap-4 border-t border-line pt-6 sm:grid-cols-2 md:mt-auto">
              <div>
                <p className="text-sm font-medium">Approx. pieces</p>
                <div className="mt-2 flex h-11 items-center justify-between rounded-full border border-line px-1.5">
                  <button onClick={() => change(-10)} className="press grid size-8 place-items-center rounded-full hover:bg-surface" aria-label="Fewer pieces">
                    <Minus size={14} weight="bold" />
                  </button>
                  <span className="relative overflow-hidden text-center font-semibold tabular-nums">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span key={qty} className="block" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }}>
                        {qty}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <button onClick={() => change(10)} className="press grid size-8 place-items-center rounded-full hover:bg-surface" aria-label="More pieces">
                    <Plus size={14} weight="bold" />
                  </button>
                </div>
              </div>
              <label className="block text-sm font-medium">
                Event date
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-2 h-11 w-full rounded-full border border-line bg-bg px-4 text-sm outline-none focus:border-ink"
                />
              </label>
              <a
                href={whatsappLink(message)}
                target="_blank"
                rel="noreferrer"
                className="press inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent text-sm font-medium text-accent-ink hover:bg-accent-hover sm:col-span-2"
              >
                <WhatsappLogo size={18} weight="fill" /> Enquire for {ev.label}
              </a>
              <p className="text-center text-xs text-muted sm:col-span-2">Bulk pricing is shared on WhatsApp. Share your date early for big events.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
