import { motion } from 'framer-motion'
import { Check, X } from '@phosphor-icons/react'
import kitkatCut from '../assets/cutouts/kitkat-cut.webp'
import { LineReveal, Reveal, EASE_OUT } from './ui'
import { Blossom } from './Blossom'

const FRESH = ['Wilt within a few days', 'Need water and daily care', 'Drop petals and pollen', 'Limited to the season’s colours']
const OURS = ['Stay bright for years', 'Zero water, zero mess', 'Allergy friendly, no pollen', 'Any colour, any season', 'A keepsake, not a bin-day item']

function Row({ text, good, i }) {
  return (
    <motion.li
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: good ? 12 : -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: EASE_OUT }}
    >
      <span className={`grid size-6 shrink-0 place-items-center rounded-full ${good ? 'bg-white text-accent' : 'bg-ink/10 text-muted'}`}>
        {good ? <Check size={12} weight="bold" /> : <X size={12} weight="bold" />}
      </span>
      <span className={good ? 'font-medium' : 'text-muted line-through decoration-ink/30'}>{text}</span>
    </motion.li>
  )
}

export default function Compare() {
  return (
    <section id="why" className="mx-auto max-w-[1280px] px-4 py-20 md:px-10 md:py-28">
      <div className="text-center">
        <h2 className="font-display text-[clamp(2.1rem,4vw,3.4rem)] leading-[1.05]">
          <LineReveal text="Fresh Flowers Fade." className="block" />
          <LineReveal text="Ours Don’t." className="block italic text-accent" delay={0.1} />
        </h2>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-4 max-w-[46ch] text-[15px] text-muted">Why chenille bouquets make better gifts and function decor.</p>
        </Reveal>
      </div>

      <div className="relative mt-12 grid items-stretch gap-4 md:grid-cols-2 md:gap-6">
        <Reveal className="h-full">
          <div className="h-full bg-surface p-7 md:p-10">
            <p className="font-wide text-xs font-semibold uppercase tracking-[0.2em] text-muted">Fresh flowers</p>
            <p className="font-display mt-3 text-3xl text-muted md:text-4xl">Lovely for a week</p>
            <ul className="mt-8 space-y-4 text-[15px]">
              {FRESH.map((t, i) => (
                <Row key={t} text={t} i={i} />
              ))}
            </ul>
          </div>
        </Reveal>

        <span className="font-wide absolute left-1/2 top-1/2 z-10 hidden size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ink text-sm font-bold text-bg shadow-xl md:grid">
          VS
        </span>

        <Reveal delay={0.1} className="h-full">
          <motion.div
            className="relative h-full overflow-hidden bg-accent p-7 text-accent-ink md:p-10"
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.3 }}
          >
            <Blossom tone="blush" size={140} className="pointer-events-none absolute -right-8 -top-8 opacity-50" />
            <p className="font-wide relative text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Petal Touch</p>
            <p className="font-display relative mt-3 text-3xl md:text-4xl">Lovely for years</p>
            <ul className="relative mt-8 space-y-4 text-[15px]">
              {OURS.map((t, i) => (
                <Row key={t} text={t} good i={i} />
              ))}
            </ul>
            <motion.img
              src={kitkatCut}
              alt=""
              className="pointer-events-none absolute -bottom-6 -right-6 hidden w-48 rotate-[-10deg] drop-shadow-2xl lg:block"
              initial={{ opacity: 0, y: 40, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: -10 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', duration: 1, bounce: 0.3, delay: 0.4 }}
            />
          </motion.div>
        </Reveal>
      </div>
    </section>
  )
}
