import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Phone, InstagramLogo, MapPin } from '@phosphor-icons/react'
import { BRAND, images } from '../data/products'
import { whatsappLink } from '../lib/cart'
import { Button, ClipImage, LineReveal, Reveal, EASE_OUT } from './ui'

// Stall hours are in Surat time, whatever timezone the visitor is in
function stallStatus() {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  const mins = now.getHours() * 60 + now.getMinutes()
  const open = BRAND.stall.open[0] * 60 + BRAND.stall.open[1]
  const close = BRAND.stall.close[0] * 60 + BRAND.stall.close[1]
  if (mins >= open && mins < close) return { open: true, label: 'Open now, until 7:30 pm' }
  return { open: false, label: 'Closed now, opens at 5:00 pm' }
}

export default function Visit() {
  const [status, setStatus] = useState(stallStatus)
  useEffect(() => {
    const t = setInterval(() => setStatus(stallStatus()), 60_000)
    return () => clearInterval(t)
  }, [])

  const info = [
    { icon: Clock, label: 'Stall Hours', value: '5:00 to 7:30 pm' },
    { icon: MapPin, label: 'Location', value: `${BRAND.city}, DM for today’s spot` },
    { icon: Phone, label: 'Call or WhatsApp', value: `+91 ${BRAND.phone}`, href: `tel:+91${BRAND.phone}` },
    { icon: InstagramLogo, label: 'Instagram', value: `@${BRAND.instagram}`, href: `https://instagram.com/${BRAND.instagram}` },
  ]

  return (
    <section id="visit" className="mx-auto max-w-[1280px] px-4 py-20 md:px-10 md:py-28">
      <div className="grid gap-6 md:grid-cols-[1fr_1.15fr] md:gap-10">
        <div className="relative">
          <ClipImage src={images.whitePlumeria} alt="A handmade white plumeria held up on a Surat street" className="aspect-[4/5] md:aspect-auto md:h-full md:min-h-[520px]" />
          <motion.div
            className="absolute bottom-4 left-4 right-4 flex items-center gap-3 bg-bg/95 p-3 backdrop-blur md:bottom-6 md:left-6 md:right-auto md:p-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6, ease: EASE_OUT }}
          >
            <img src={images.sunflowerDusk} alt="" className="size-12 object-cover" />
            <span className="text-[13px] leading-snug">
              <span className="block font-medium">Pick a stem on the spot</span>
              <span className="text-muted">Single flowers from ₹69</span>
            </span>
          </motion.div>
        </div>

        <div className="flex flex-col justify-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 bg-surface px-3 py-1.5 text-[13px]">
              <span className="relative flex size-2">
                {status.open && <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />}
                <span className={`relative inline-flex size-2 rounded-full ${status.open ? 'bg-emerald-500' : 'bg-accent'}`} />
              </span>
              {status.label}
            </span>
          </Reveal>
          <h2 className="font-display mt-5 text-[clamp(1.9rem,3.2vw,2.75rem)] leading-[1.08]">
            <LineReveal text="Visit Our Evening" className="block" />
            <LineReveal text="Flower Stall" className="block" delay={0.1} />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-muted">
              See every bloom up close, feel the soft chenille petals and plan a custom bouquet with Sonu in person.
            </p>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {info.map((r, i) => {
              const body = (
                <>
                  <r.icon size={24} weight="thin" className="text-accent transition-transform duration-500 ease-[var(--ease-out-strong)] group-hover:-rotate-12 group-hover:scale-110" />
                  <span className="mt-3 block text-xs text-muted">{r.label}</span>
                  <span className="mt-0.5 block text-[13px] font-medium md:text-sm">{r.value}</span>
                </>
              )
              const cls = 'group block h-full bg-surface p-4 transition-colors duration-300 hover:bg-surface-2 md:p-5'
              return (
                <motion.div
                  key={r.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.6, ease: EASE_OUT }}
                >
                  {r.href ? (
                    <a href={r.href} target={r.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className={cls}>
                      {body}
                    </a>
                  ) : (
                    <div className={cls}>{body}</div>
                  )}
                </motion.div>
              )
            })}
          </div>

          <Reveal delay={0.25} className="mt-8 flex flex-wrap gap-3">
            <Button as="a" href={whatsappLink('Hi Sonu! Where is the stall today? 🌸')} target="_blank" rel="noreferrer">
              Ask for Today’s Spot
            </Button>
            <Button as="a" variant="ghost" href={`tel:+91${BRAND.phone}`}>
              Call Sonu
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
