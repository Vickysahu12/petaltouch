import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { images } from '../data/products'
import { Button, LineReveal, Reveal, EASE_IN_OUT } from './ui'
import { useScrollTo } from './Nav'

function ParallaxTile({ src, alt, className, range = 40 }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-range, range])
  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden bg-surface ${className}`}
      initial={reduce ? { opacity: 0 } : { clipPath: 'inset(10% 10% 10% 10%)' }}
      whileInView={reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.2, ease: EASE_IN_OUT }}
    >
      <motion.img src={src} alt={alt} loading="lazy" style={{ y, scale: 1.2 }} className="absolute inset-0 h-full w-full object-cover" />
    </motion.div>
  )
}

export default function Story() {
  const scrollTo = useScrollTo()
  return (
    <section id="about" className="mx-auto max-w-[1280px] px-4 py-20 md:px-10 md:py-28">
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-[3fr_4fr_3fr] md:gap-x-6">
        <ParallaxTile src={images.skyLily} alt="Sky blue lily bouquet" className="aspect-[4/5] md:aspect-[128/160]" />

        <div className="col-span-2 row-start-2 md:col-span-1 md:row-start-auto md:pt-1">
          <h2 className="font-display text-[clamp(2rem,3.4vw,2.9rem)] leading-[1.05]">
            <LineReveal text="Your One-Stop" className="block" />
            <LineReveal text="Flower Shop" className="block" delay={0.1} />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-muted">
              Petal Touch is a haven for flower lovers in Surat, with handmade blooms for every occasion. From sunny sunflowers to soft
              lilies and lucky nazar charms, every stem is shaped by hand and made to last forever.
            </p>
          </Reveal>
          <Reveal delay={0.25} className="mt-6">
            <Button size="sm" onClick={() => scrollTo('#shop')}>
              Learn More
            </Button>
          </Reveal>
        </div>

        <div className="flex items-end">
          <ParallaxTile src={images.sunflowerPrint} alt="Sunflowers wrapped in newsprint" className="aspect-[4/5] w-full md:mt-8" range={60} />
        </div>
      </div>
    </section>
  )
}
