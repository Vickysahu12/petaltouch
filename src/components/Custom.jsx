import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useSpring, useTransform } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { Check, WhatsappLogo, X } from '@phosphor-icons/react'
import { images, formatINR } from '../data/products'
import { whatsappLink } from '../lib/cart'
import { Button, ClipImage, LineReveal, Reveal, EASE_OUT } from './ui'

// Sample pricing for the demo builder. Swap in Sonu's real rates.
const PER_STEM = 55
const COLOURS = [
  { id: 'red', label: 'Red', hex: '#d2283f' },
  { id: 'pink', label: 'Pink', hex: '#f08cb0' },
  { id: 'yellow', label: 'Sunflower', hex: '#f5b81c' },
  { id: 'blue', label: 'Blue', hex: '#3d6fe0' },
  { id: 'lilac', label: 'Lilac', hex: '#a98ce8' },
  { id: 'white', label: 'White', hex: '#f4f1ea' },
]
const WRAPS = ['Kraft', 'Black', 'Blush pink', 'Clear', 'Newsprint']
const ADDONS = [
  { id: 'kitkat', label: 'KitKat x2', price: 60 },
  { id: 'tag', label: 'Name tag', price: 30 },
  { id: 'nazar', label: 'Nazar charm', price: 50 },
]

function AnimatedPrice({ value }) {
  const spring = useSpring(value, { stiffness: 140, damping: 22 })
  const text = useTransform(spring, (v) => formatINR(Math.round(v)))
  useEffect(() => spring.set(value), [spring, value])
  return <motion.span className="tabular-nums">{text}</motion.span>
}

export default function GiftBox() {
  const [open, setOpen] = useState(false)
  return (
    <section id="gifts" className="mx-auto max-w-[1280px] px-4 pb-20 md:px-10 md:pb-28">
      <div className="grid gap-6 md:grid-cols-[1.05fr_1fr] md:gap-8">
        <ClipImage src={images.sunflowerPrint} alt="Sunflowers wrapped in newsprint" className="aspect-[4/3] md:aspect-auto md:min-h-[420px]" />

        <div className="flex flex-col">
          <h2 className="font-display text-[clamp(1.9rem,3.2vw,2.75rem)] leading-[1.08]">
            <LineReveal text="The Gift Box, Your" className="block" />
            <LineReveal text="Go-To for Sweet Surprises" className="block" delay={0.1} />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-muted">
              Pick your colours, stems and wrap, then add KitKats, a name tag or a nazar charm. Sonu makes it by hand for birthdays,
              anniversaries or just because.
            </p>
          </Reveal>
          <Reveal delay={0.22} className="mt-5">
            <Button size="sm" onClick={() => setOpen(true)}>
              Customize Now
            </Button>
          </Reveal>
          <div className="mt-6 grid flex-1 grid-cols-2 gap-4 md:mt-8">
            <ClipImage src={images.kitkatRose} alt="KitKat rose bouquet" className="aspect-square md:aspect-auto md:min-h-[200px]" delay={0.1} />
            <ClipImage src={images.nazarBlue} alt="Nazar bouquet" className="aspect-square md:aspect-auto md:min-h-[200px]" delay={0.2} />
          </div>
        </div>
      </div>
      <AnimatePresence>{open && <Builder onClose={() => setOpen(false)} />}</AnimatePresence>
    </section>
  )
}

function Builder({ onClose }) {
  const lenis = useLenis()
  const [colours, setColours] = useState(['pink', 'white'])
  const [stems, setStems] = useState(7)
  const [wrap, setWrap] = useState('Blush pink')
  const [addons, setAddons] = useState([])

  useEffect(() => {
    lenis?.stop()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      lenis?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [lenis, onClose])

  const toggle = (list, setList, id) => setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id])
  const total = stems * PER_STEM + ADDONS.filter((a) => addons.includes(a.id)).reduce((s, a) => s + a.price, 0)
  const message = [
    'Hi Sonu! I want a custom bouquet 💐',
    '',
    `Colours: ${colours.map((c) => COLOURS.find((x) => x.id === c).label).join(', ') || 'Your pick'}`,
    `Stems: ${stems}`,
    `Wrap: ${wrap}`,
    addons.length ? `Add-ons: ${ADDONS.filter((a) => addons.includes(a.id)).map((a) => a.label).join(', ')}` : null,
    `Estimate on site: ${formatINR(total)}`,
  ]
    .filter((x) => x !== null)
    .join('\n')
  const pct = ((stems - 3) / (15 - 3)) * 100
  const chip = (on) => `press inline-flex h-9 items-center gap-2 rounded-[3px] border px-3.5 text-sm transition-colors ${on ? 'border-ink bg-ink text-bg' : 'border-line hover:border-ink'}`

  return (
    <div className="fixed inset-0 z-[70] grid place-items-end md:place-items-center md:p-6" role="dialog" aria-modal="true" aria-label="Customize your bouquet">
      <motion.button aria-label="Close" className="absolute inset-0 bg-ink/45" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.div
        className="relative max-h-[92dvh] w-full max-w-xl overflow-auto bg-bg p-6 md:p-8"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 32, transition: { duration: 0.2 } }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        data-lenis-prevent
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-3xl leading-tight md:text-4xl">Build your bouquet</h3>
          <button onClick={onClose} className="press grid size-9 shrink-0 place-items-center bg-surface hover:bg-surface-2" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="mt-6 space-y-7">
          <fieldset>
            <legend className="text-sm font-medium">Flower colours</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {COLOURS.map((c) => {
                const on = colours.includes(c.id)
                return (
                  <button key={c.id} type="button" onClick={() => toggle(colours, setColours, c.id)} aria-pressed={on} className={`${chip(on)} pl-1.5`}>
                    <span className="grid size-6 place-items-center rounded-full ring-1 ring-black/10" style={{ background: c.hex }}>
                      <motion.span
                        initial={false}
                        animate={{ scale: on ? 1 : 0.5, opacity: on ? 1 : 0 }}
                        transition={{ type: 'spring', duration: 0.35, bounce: 0.4 }}
                        className={c.id === 'white' || c.id === 'yellow' ? 'text-ink' : 'text-white'}
                      >
                        <Check size={12} weight="bold" />
                      </motion.span>
                    </span>
                    {c.label}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="stems" className="text-sm font-medium">
                Number of stems
              </label>
              <span className="text-2xl font-semibold tabular-nums">{stems}</span>
            </div>
            <input
              id="stems"
              type="range"
              min={3}
              max={15}
              value={stems}
              onChange={(e) => setStems(Number(e.target.value))}
              className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-bg [&::-moz-range-thumb]:bg-accent [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-bg [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow-md"
              style={{ background: `linear-gradient(to right, var(--accent) ${pct}%, var(--surface-2) ${pct}%)` }}
            />
          </div>

          <fieldset>
            <legend className="text-sm font-medium">Wrap</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {WRAPS.map((w) => (
                <button key={w} type="button" onClick={() => setWrap(w)} aria-pressed={wrap === w} className={chip(wrap === w)}>
                  {w}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-medium">Add-ons</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {ADDONS.map((a) => {
                const on = addons.includes(a.id)
                return (
                  <button key={a.id} type="button" onClick={() => toggle(addons, setAddons, a.id)} aria-pressed={on} className={chip(on)}>
                    <motion.span initial={false} animate={{ rotate: on ? 45 : 0 }} transition={{ duration: 0.22, ease: EASE_OUT }}>
                      +
                    </motion.span>
                    {a.label}
                    <span className={on ? 'text-bg/70' : 'text-muted'}>{formatINR(a.price)}</span>
                  </button>
                )
              })}
            </div>
          </fieldset>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 bg-surface p-4">
          <div>
            <p className="text-xs text-muted">Estimated price</p>
            <p className="text-2xl font-bold">
              <AnimatedPrice value={total} />
            </p>
          </div>
          <a
            href={whatsappLink(message)}
            target="_blank"
            rel="noreferrer"
            className="press inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-[3px] bg-accent px-5 text-sm font-medium text-accent-ink hover:bg-accent-hover"
          >
            <WhatsappLogo size={18} weight="fill" /> Send to Sonu
          </a>
        </div>
      </motion.div>
    </div>
  )
}
