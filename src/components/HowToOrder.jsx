import { motion, useReducedMotion } from 'framer-motion'
import { HandPointing, PaintBrush, WhatsappLogo, Moped } from '@phosphor-icons/react'
import { Button, LineReveal, Reveal, EASE_OUT, EASE_IN_OUT } from './ui'
import { useScrollTo } from './Nav'

const STEPS = [
  { icon: HandPointing, title: 'Pick', text: 'Choose a bouquet from the shop, or start from scratch.' },
  { icon: PaintBrush, title: 'Personalise', text: 'Change colours, add KitKats, a name tag or a nazar charm.' },
  { icon: WhatsappLogo, title: 'Confirm', text: 'Your order opens in WhatsApp. Sonu confirms the date and payment.' },
  { icon: Moped, title: 'Receive', text: 'Delivered across Surat, or pick it up from the evening stall.' },
]

export default function HowToOrder() {
  const reduce = useReducedMotion()
  const scrollTo = useScrollTo()
  return (
    <section id="how" className="bg-surface">
      <div className="mx-auto max-w-[1280px] px-4 py-20 md:px-10 md:py-24">
        <div className="text-center">
          <h2 className="font-display text-[clamp(1.9rem,3.2vw,2.75rem)] leading-tight">
            <LineReveal text="Ordering Is Easy" />
          </h2>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-3 max-w-[48ch] text-[15px] text-muted">Four quick steps from picking a bouquet to holding it in your hands.</p>
          </Reveal>
        </div>

        <div className="relative mt-14">
          {/* Connector that draws across the steps on desktop */}
          <motion.span
            aria-hidden
            className="absolute left-[12.5%] right-[12.5%] top-9 hidden h-px origin-left border-t border-dashed border-ink/40 lg:block"
            initial={{ scaleX: reduce ? 1 : 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.6, ease: EASE_IN_OUT }}
          />
          <ol className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((s, i) => (
              <motion.li
                key={s.title}
                className="group relative text-center"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.18, ease: EASE_OUT }}
              >
                <motion.span
                  className="relative mx-auto grid size-[72px] place-items-center rounded-full border border-line bg-bg text-ink transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink"
                  initial={{ scale: reduce ? 1 : 0.7 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ type: 'spring', duration: 0.6, bounce: 0.4, delay: 0.2 + i * 0.18 }}
                >
                  <s.icon size={30} weight="light" />
                  <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-accent text-[11px] font-semibold text-accent-ink">
                    {i + 1}
                  </span>
                </motion.span>
                <h3 className="font-display mt-5 text-2xl">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-[26ch] text-sm leading-relaxed text-muted">{s.text}</p>
              </motion.li>
            ))}
          </ol>
        </div>

        <Reveal delay={0.2} className="mt-12 flex justify-center">
          <Button onClick={() => scrollTo('#shop')}>Start Your Order</Button>
        </Reveal>
      </div>
    </section>
  )
}
