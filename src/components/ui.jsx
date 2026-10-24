import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

export const EASE_OUT = [0.23, 1, 0.32, 1]
export const EASE_IN_OUT = [0.77, 0, 0.175, 1]

const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

/** Pulls gently toward the cursor. Decorative, so it uses a soft spring. */
export function Magnetic({ children, strength = 0.28, className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  const onMove = (e) => {
    if (reduce || !canHover() || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span ref={ref} onPointerMove={onMove} onPointerLeave={reset} style={{ x: sx, y: sy }} className={`inline-flex ${className}`}>
      {children}
    </motion.span>
  )
}

const btnBase =
  'press group relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-[3px] font-medium select-none'
const btnSizes = {
  sm: 'h-8 px-3.5 text-[13px]',
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-8 text-[15px]',
}
const btnVariants = {
  primary: 'bg-accent text-accent-ink hover:bg-accent-hover',
  ink: 'bg-ink text-bg',
  ghost: 'border border-ink/70 text-ink hover:bg-ink hover:text-bg',
  white: 'bg-white text-ink shadow-sm hover:bg-surface',
}

/** Button with a text roll on hover: label slides up, a copy slides in from below. */
export function Button({ as: Tag = 'button', variant = 'primary', size = 'md', className = '', children, icon, ...props }) {
  return (
    <Tag className={`${btnBase} ${btnSizes[size]} ${btnVariants[variant]} ${className}`} {...props}>
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-300 ease-[var(--ease-out-strong)] [@media(hover:hover)]:group-hover:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 block translate-y-full transition-transform duration-300 ease-[var(--ease-out-strong)] [@media(hover:hover)]:group-hover:translate-y-0"
        >
          {children}
        </span>
      </span>
      {icon && (
        <span className="transition-transform duration-300 ease-[var(--ease-out-strong)] [@media(hover:hover)]:group-hover:translate-x-0.5">
          {icon}
        </span>
      )}
    </Tag>
  )
}

/** Fade + rise when scrolled into view. */
export function Reveal({ children, delay = 0, y = 28, className = '', as = 'div', once = true, amount = 0.25 }) {
  const reduce = useReducedMotion()
  const M = motion[as]
  return (
    <M
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.9, delay, ease: EASE_OUT }}
    >
      {children}
    </M>
  )
}

/** Splits a headline into words that rise out of a mask, staggered. */
export function LineReveal({ text, className = '', delay = 0, stagger = 0.06, inView = true, as = 'span' }) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  const M = motion[as]
  const anim = inView ? { whileInView: 'show', viewport: { once: true, amount: 0.6 } } : { animate: 'show' }
  return (
    <M className={className} initial="hide" {...anim} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hide: reduce ? { opacity: 0 } : { y: '110%' },
              show: { y: '0%', opacity: 1, transition: { duration: 1, ease: EASE_OUT, delay: delay + i * stagger } },
            }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </M>
  )
}

/** Image that unveils with a clip-path wipe and settles from a slight zoom. */
export function ClipImage({ src, alt, className = '', imgClassName = '', delay = 0 }) {
  const reduce = useReducedMotion()
  // The in-view trigger lives on an unclipped wrapper: Chrome counts clip-path when
  // computing intersection, so a fully clipped element would never report as visible.
  return (
    <motion.div className={className} initial="hide" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
      <motion.div
        className="h-full w-full overflow-hidden rounded-[inherit]"
        variants={{
          hide: reduce ? { opacity: 0 } : { clipPath: 'inset(100% 0% 0% 0%)' },
          show: reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.2, delay, ease: EASE_IN_OUT } },
        }}
      >
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          className={`h-full w-full object-cover ${imgClassName}`}
          variants={{
            hide: reduce ? {} : { scale: 1.25 },
            show: { scale: 1, transition: { duration: 1.6, delay, ease: EASE_OUT } },
          }}
        />
      </motion.div>
    </motion.div>
  )
}
