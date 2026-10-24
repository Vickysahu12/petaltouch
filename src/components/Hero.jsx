import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Truck, Flower, HandHeart, Gift, ArrowRight } from '@phosphor-icons/react'
import heroBouquet from '../assets/cutouts/hero-bouquet-clean.webp'
import nazarHand from '../assets/cutouts/nazar-hand.webp'
import sunflowerHand from '../assets/cutouts/sunflower-hand.webp'
import { Button, EASE_OUT, EASE_IN_OUT, Magnetic, Reveal } from './ui'
import { FloatingBlossom } from './Blossom'
import { useScrollTo } from './Nav'

const TITLE = 'PETAL TOUCH'

const BLOOMS = [
  { tone: 'peach', size: 64, className: 'right-[9%] top-[14%]', depth: 1.4, delay: 0.9, spin: 18 },
  { tone: 'pink', size: 76, className: 'left-[11%] top-[46%]', depth: 0.8, delay: 1.0 },
  { tone: 'white', size: 44, className: 'left-[24%] top-[20%]', depth: 1.8, delay: 1.15, spin: -16 },
  { tone: 'blush', size: 52, className: 'right-[20%] top-[52%]', depth: 1.1, delay: 1.2 },
  { tone: 'lilac', size: 38, className: 'right-[33%] top-[9%] hidden md:block', depth: 2.2, delay: 1.3, spin: -20 },
  { tone: 'pink', size: 34, className: 'left-[36%] bottom-[30%] hidden md:block', depth: 2.4, delay: 1.35 },
  { tone: 'white', size: 58, className: 'right-[4%] bottom-[30%] hidden md:block', depth: 0.6, delay: 1.4 },
]

function Clouds() {
  const reduce = useReducedMotion()
  const clouds = [
    'left-[-6%] top-[8%] h-28 w-[42%]',
    'right-[-8%] top-[26%] h-24 w-[38%]',
    'left-[18%] top-[58%] h-20 w-[30%]',
    'right-[10%] bottom-[6%] h-28 w-[40%]',
    'left-[-10%] bottom-[14%] h-24 w-[34%]',
  ]
  return (
    <div aria-hidden className="absolute inset-0">
      {clouds.map((c, i) => (
        <motion.span
          key={c}
          className={`absolute rounded-[50%] bg-white/70 blur-2xl ${c}`}
          animate={reduce ? undefined : { x: [0, i % 2 ? -40 : 40, 0] }}
          transition={{ duration: 18 + i * 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const scrollTo = useScrollTo()
  const { scrollY } = useScroll()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bouquetY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120])
  const titleY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 220])
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.92])
  const bloomScroll = useTransform(scrollY, (v) => (reduce ? 0 : v * 0.25))

  // Pointer drives the blooms and a gentle tilt on the bouquet
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mx = useSpring(rawX, { stiffness: 50, damping: 16 })
  const my = useSpring(rawY, { stiffness: 50, damping: 16 })
  const tilt = useTransform(mx, [-20, 20], [-3, 3])
  const tiltLeft = useTransform(mx, [-20, 20], [-9, -3])
  const tiltRight = useTransform(mx, [-20, 20], [-3, -9])
  const sideY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 200])
  const onMove = (e) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    rawX.set(((e.clientX - r.left) / r.width - 0.5) * 40)
    rawY.set(((e.clientY - r.top) / r.height - 0.5) * 40)
  }

  return (
    <section id="top" className="p-2.5 md:p-5">
      <div
        ref={ref}
        onPointerMove={onMove}
        className="relative isolate min-h-[640px] overflow-hidden rounded-[28px] md:h-[calc(100dvh-40px)] md:min-h-[680px] md:rounded-[36px]"
        style={{ background: 'linear-gradient(180deg, #8fbdf0 0%, #b6d5f6 42%, #dcebfb 78%, #f3f8fe 100%)' }}
      >
        <Clouds />

        <motion.h1
          style={{ y: titleY, scale: titleScale }}
          className="font-wide absolute inset-x-0 top-[104px] z-10 whitespace-nowrap text-center text-[9.6vw] font-extrabold leading-none tracking-[-0.03em] text-white md:top-[14%] md:text-[clamp(4rem,9.6vw,9.25rem)] [text-shadow:0_2px_0_rgb(120_160_215/0.35),0_10px_40px_rgb(50_100_170/0.35)]"
          aria-label="Petal Touch"
        >
          {TITLE.split('').map((ch, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="inline-block"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 60, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.045, ease: EASE_OUT }}
            >
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          className="absolute inset-x-0 top-[calc(104px+11vw)] z-10 px-6 text-center text-[13px] font-medium text-[#1d3557]/80 md:hidden"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9, ease: EASE_OUT }}
        >
          Handmade chenille bouquets from Surat
        </motion.p>

        {BLOOMS.map((b, i) => (
          <FloatingBlossom key={i} {...b} scroll={bloomScroll} mx={mx} my={my} />
        ))}

        {/* Side hands rise a beat after the centre bouquet and sway the other way */}
        <motion.div style={{ y: sideY }} className="absolute bottom-[-12%] left-[-1%] z-[15] hidden md:block md:w-[20%] xl:left-[24%] xl:w-[14%]">
          <motion.img
            src={nazarHand}
            alt="Hand holding the blue nazar bouquet"
            style={{ rotate: tiltLeft }}
            className="w-full origin-bottom object-contain drop-shadow-[0_24px_30px_rgba(60,90,140,0.25)]"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 220 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', duration: 1.5, bounce: 0.2, delay: 0.75 }}
          />
        </motion.div>
        <motion.div style={{ y: sideY }} className="absolute bottom-0 right-[2%] z-[15] hidden md:block md:w-[17%] xl:right-[23%] xl:w-[13%]">
          <div className="-scale-x-100">
          <motion.img
            src={sunflowerHand}
            alt="Hand holding a single sunflower"
            style={{ rotate: tiltRight }}
            className="w-full origin-bottom object-contain drop-shadow-[0_24px_30px_rgba(60,90,140,0.25)]"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 220 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', duration: 1.5, bounce: 0.2, delay: 0.9 }}
          />
          </div>
        </motion.div>

        <motion.div style={{ y: bouquetY }} className="absolute inset-x-0 bottom-0 z-20 flex justify-center">
          <motion.img
            src={heroBouquet}
            alt="Pink lily and tulip chenille bouquet"
            style={{ rotate: tilt }}
            className="h-[48svh] max-h-[460px] w-auto origin-bottom object-contain drop-shadow-[0_30px_40px_rgba(60,90,140,0.3)] md:h-[62%] md:max-h-[640px]"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 180, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', duration: 1.4, bounce: 0.22, delay: 0.45 }}
            fetchPriority="high"
          />
        </motion.div>

        <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col gap-4 p-4 md:flex-row md:items-end md:justify-between md:p-9">
          <motion.div
            className="hidden max-w-[25ch] text-[#1d3557] xl:block"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: EASE_OUT }}
          >
            <p className="text-[15px] font-semibold">Handmade chenille flowers from Surat</p>
            <p className="mt-1 text-sm leading-relaxed text-[#1d3557]/75">
              Bouquets for weddings, birthdays, dates and every warm little surprise. Made by Sonu, built to last forever.
            </p>
          </motion.div>
          <motion.div
            className="flex justify-center gap-2.5 md:ml-auto md:justify-end"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: EASE_OUT }}
          >
            <Magnetic>
              <Button onClick={() => scrollTo('#shop')} icon={<ArrowRight size={15} weight="bold" />}>
                View Catalogue
              </Button>
            </Magnetic>
            <Magnetic>
              <Button variant="white" onClick={() => scrollTo('#gifts')}>
                Custom Order
              </Button>
            </Magnetic>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-2 md:px-5">
        <BrandStrip />
        <Perks />
      </div>
    </section>
  )
}

/** Curved hairline, like a soft bracket, used either side of the wordmark. */
function Brace({ flip }) {
  return <span aria-hidden className={`block h-20 w-4 border-ink/60 ${flip ? 'rounded-l-[100%] border-l' : 'rounded-r-[100%] border-r'}`} />
}

function BrandStrip() {
  return (
    <div className="mt-14 md:mt-16">
      <div className="grid items-center gap-6 text-center md:grid-cols-[1fr_auto_1fr] md:gap-10">
        <Reveal>
          <p className="mx-auto max-w-[32ch] text-[15px] leading-relaxed text-muted">
            Petal Touch is Surat’s home for handmade chenille flowers that stay bright for years.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="flex items-center justify-center gap-10">
          <Brace flip />
          <p className="font-display text-[26px] leading-[1.05] text-accent">
            Petal
            <br />
            Touch
          </p>
          <Brace />
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto max-w-[32ch] text-[15px] leading-relaxed text-muted">
            From wedding mandaps to birthday surprises, every bouquet is made to order in your colours.
          </p>
        </Reveal>
      </div>
      <motion.div
        className="mt-8 h-[2px] origin-center bg-gradient-to-r from-transparent via-ink/80 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: EASE_IN_OUT }}
      />
    </div>
  )
}

const PERKS = [
  { icon: Truck, title: 'Surat Delivery', text: 'Doorstep delivery across the city' },
  { icon: Flower, title: 'Never Wilts', text: 'No water, no fading, lasts for years' },
  { icon: HandHeart, title: '100% Handmade', text: 'Every stem twisted by hand by Sonu' },
  { icon: Gift, title: 'Bulk Orders', text: 'Weddings, functions and return gifts' },
]

function Perks() {
  return (
    <ul className="mt-8 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
      {PERKS.map((p, i) => (
        <Reveal as="li" key={p.title} delay={i * 0.06} y={16}>
          <div className="group flex h-full items-center gap-3 bg-surface p-4 transition-colors duration-300 hover:bg-surface-2 md:gap-4 md:px-5">
            <p.icon
              size={34}
              weight="thin"
              className="shrink-0 text-accent transition-transform duration-500 ease-[var(--ease-out-strong)] group-hover:-rotate-12 group-hover:scale-110"
            />
            <span>
              <span className="block text-[13px] font-semibold text-ink md:text-sm">{p.title}</span>
              <span className="mt-0.5 block text-xs leading-snug text-muted md:text-[13px]">{p.text}</span>
            </span>
          </div>
        </Reveal>
      ))}
    </ul>
  )
}
