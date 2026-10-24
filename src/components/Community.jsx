import { motion } from 'framer-motion'
import { BRAND, images } from '../data/products'
import { Button, LineReveal, EASE_OUT } from './ui'

// Dates and photos come from Petal Touch's own Instagram posts
const POSTS = [
  { src: images.kitkatRose, date: 'Oct 23, 2026', title: 'Chocolate and Roses, the Sweetest Gift Combo' },
  { src: images.nazarBlue, date: 'Oct 12, 2026', title: 'Meet the Nazar Bouquet That Keeps Bad Vibes Away' },
  { src: images.sunflowerPrint, date: 'Oct 01, 2026', title: 'Sunflowers Wrapped in Vintage Newsprint' },
]

export default function Community() {
  const ig = `https://instagram.com/${BRAND.instagram}`
  return (
    <section id="community" className="mx-auto max-w-[1280px] px-4 pb-20 md:px-10 md:pb-28">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-[clamp(1.9rem,3.2vw,2.75rem)] leading-tight">
          <LineReveal text="Join Our Flower Lover Community" />
        </h2>
        <Button as="a" size="sm" href={ig} target="_blank" rel="noreferrer">
          View All
        </Button>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3 md:gap-5">
        {POSTS.map((p, i) => (
          <motion.article
            key={p.title}
            className="group"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE_OUT }}
          >
            <a href={ig} target="_blank" rel="noreferrer" className="block aspect-[110/80] overflow-hidden bg-surface" tabIndex={-1} aria-hidden>
              <img
                src={p.src}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--ease-out-strong)] group-hover:scale-105"
              />
            </a>
            <p className="mt-3 text-xs text-muted">{p.date}</p>
            <h3 className="mt-1 max-w-[30ch] text-[15px] font-medium leading-snug">{p.title}</h3>
            <a
              href={ig}
              target="_blank"
              rel="noreferrer"
              className="press mt-3 inline-flex h-8 items-center rounded-[3px] border border-ink/70 px-3.5 text-xs font-medium transition-colors hover:border-accent hover:bg-accent hover:text-accent-ink"
            >
              Learn More
            </a>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
