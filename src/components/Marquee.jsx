import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'
import { useRef } from 'react'
import { Blossom } from './Blossom'

const WORDS = ['Weddings', 'Birthdays', 'Haldi', 'Anniversaries', 'Baby Showers', 'Rakhi', 'Engagements', 'Corporate Gifts']

const wrap = (min, max, v) => {
  const r = max - min
  return ((((v - min) % r) + r) % r) + min
}

/** A tilted pink ribbon of occasions. Drifts on its own; scroll speed pushes it faster and flips its direction. */
export default function Marquee() {
  const reduce = useReducedMotion()
  const base = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const factor = useTransform(velocity, [-1000, 0, 1000], [-4, 0, 4], { clamp: false })
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`)
  const dir = useRef(-1)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    let move = dir.current * 2 * (delta / 1000)
    const f = factor.get()
    if (f < 0) dir.current = 1
    else if (f > 0) dir.current = -1
    move += dir.current * move * f
    base.set(base.get() + move)
  })

  const row = (
    <div className="flex shrink-0 items-center">
      {WORDS.map((w, i) => (
        <span key={w} className="flex items-center">
          <span className="font-wide px-5 text-[clamp(1.4rem,3.4vw,2.75rem)] font-bold uppercase leading-none tracking-tight md:px-8">{w}</span>
          <Blossom tone={i % 2 ? 'white' : 'blush'} size={34} className="shrink-0" />
        </span>
      ))}
    </div>
  )

  return (
    <section aria-label="Occasions we make flowers for" className="relative z-10 -my-2 overflow-hidden py-10 md:py-14">
      <div className="-mx-4 -rotate-2 bg-accent py-4 text-accent-ink shadow-[0_20px_50px_-20px_rgb(210_58_119/0.6)] md:py-5">
        <motion.div className="flex w-max" style={{ x }}>
          {row}
          {row}
        </motion.div>
      </div>
    </section>
  )
}
