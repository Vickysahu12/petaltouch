import { useState } from 'react'
import { InstagramLogo, WhatsappLogo, Phone, MapPin } from '@phosphor-icons/react'
import { BRAND } from '../data/products'
import { whatsappLink } from '../lib/cart'
import { NAV_LINKS, useScrollTo } from './Nav'

export default function Footer() {
  const scrollTo = useScrollTo()
  const [name, setName] = useState('')

  const socials = [
    { href: `https://instagram.com/${BRAND.instagram}`, icon: InstagramLogo, label: 'Instagram' },
    { href: whatsappLink('Hi Sonu! 🌸'), icon: WhatsappLogo, label: 'WhatsApp' },
    { href: `tel:+91${BRAND.phone}`, icon: Phone, label: 'Call' },
    { href: `https://instagram.com/${BRAND.personal}`, icon: MapPin, label: 'Find the stall' },
  ]

  const join = (e) => {
    e.preventDefault()
    const text = `Hi Sonu! Please add me to Petal Touch updates for new bouquets and offers.${name.trim() ? `\nName: ${name.trim()}` : ''}`
    window.open(whatsappLink(text), '_blank', 'noopener')
  }

  return (
    <footer id="contact" className="bg-surface">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 pb-10 pt-14 sm:grid-cols-2 md:px-10 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
        <div>
          <p className="font-display text-2xl leading-[1.05] text-accent">
            Petal
            <br />
            Touch
          </p>
          <p className="mt-4 max-w-[34ch] text-[13px] leading-relaxed text-muted">
            Handmade chenille flowers by Sonu in Surat. Bouquets, towers and hampers that are made to order and never need water.
          </p>
          <div className="mt-5 flex gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                aria-label={s.label}
                className="press grid size-8 place-items-center border border-ink/60 text-ink transition-colors hover:border-accent hover:bg-accent hover:text-accent-ink"
              >
                <s.icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer">
          <p className="text-sm font-semibold">Main Menu</p>
          <ul className="mt-4 space-y-2 text-[13px] text-muted">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollTo(l.href)
                  }}
                  className="transition-colors hover:text-accent"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold">Reach Us</p>
          <ul className="mt-4 space-y-2 text-[13px] text-muted">
            <li>
              <a href={`tel:+91${BRAND.phone}`} className="transition-colors hover:text-accent">
                +91 {BRAND.phone}
              </a>
            </li>
            <li>
              <a href={`https://instagram.com/${BRAND.instagram}`} target="_blank" rel="noreferrer" className="transition-colors hover:text-accent">
                @{BRAND.instagram}
              </a>
            </li>
            <li>Stall hours: 5:00 to 7:30 pm</li>
            <li>Deliveries across {BRAND.city}</li>
            <li>DM to order</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Get New Drops</p>
          <p className="mt-4 text-[13px] leading-relaxed text-muted">Join our WhatsApp list to see new bouquets and festive offers first.</p>
          <form onSubmit={join} className="mt-4">
            <label htmlFor="drop-name" className="sr-only">
              Your name
            </label>
            <input
              id="drop-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              autoComplete="name"
              className="h-10 w-full border border-line bg-bg px-3 text-[13px] outline-none placeholder:text-muted focus:border-ink"
            />
            <button type="submit" className="press mt-2 h-10 w-full rounded-[3px] bg-accent text-[13px] font-medium text-accent-ink hover:bg-accent-hover">
              Join Now
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1280px] flex-wrap justify-between gap-2 border-t border-line px-4 py-5 text-xs text-muted md:px-10">
        <p>Copyright © 2026 Petal Touch by Sonu. All Rights Reserved.</p>
        <p>Handmade in Surat with love</p>
      </div>
    </footer>
  )
}
