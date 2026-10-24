import { useId } from 'react'
import { motion, useReducedMotion, useTransform } from 'framer-motion'

const PALETTES = {
  pink: { petal: '#ff9cc0', shade: '#e8578c', core: '#ffe08a', coreShade: '#f2b632' },
  blush: { petal: '#ffd0e0', shade: '#f29bbb', core: '#ffffff', coreShade: '#f6c6d6' },
  white: { petal: '#ffffff', shade: '#e6dde3', core: '#ffd34d', coreShade: '#f0a91e' },
  peach: { petal: '#ffc7a8', shade: '#f08d6a', core: '#fff0b8', coreShade: '#f5c75a' },
  lilac: { petal: '#d9c6ff', shade: '#a487e8', core: '#fff3c4', coreShade: '#f2cf5c' },
}

/** A glossy five-petal bloom, shaded so it reads like a soft, puffy chenille flower. */
export function Blossom({ size = 64, tone = 'pink', className = '', style }) {
  const id = useId().replace(/:/g, '')
  const c = PALETTES[tone]
  return (
    <svg viewBox="-50 -50 100 100" width={size} height={size} className={className} style={style} aria-hidden>
      <defs>
        <radialGradient id={`p${id}`} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="28%" stopColor={c.petal} />
          <stop offset="100%" stopColor={c.shade} />
        </radialGradient>
        <radialGradient id={`c${id}`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="40%" stopColor={c.core} />
          <stop offset="100%" stopColor={c.coreShade} />
        </radialGradient>
      </defs>
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse key={r} cx="0" cy="-24" rx="17" ry="23" fill={`url(#p${id})`} transform={`rotate(${r})`} />
      ))}
      <circle r="13" fill={`url(#c${id})`} />
    </svg>
  )
}

/**
 * A blossom that bobs and spins on its own, drifts with scroll and leans away from the pointer.
 * `scroll` and `mx`/`my` are motion values from the parent so every bloom shares one listener.
 */
export function FloatingBlossom({ tone, size, className, delay = 0, depth = 1, scroll, mx, my, spin = 12 }) {
  const reduce = useReducedMotion()
  const sy = useTransform(scroll, (v) => v * depth * -1)
  const px = useTransform(mx, (v) => v * depth)
  const py = useTransform(my, (v) => v * depth)
  return (
    <motion.div className={`pointer-events-none absolute ${className}`} style={{ y: sy }}>
      <motion.div style={{ x: px, y: py }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 1.1, bounce: 0.35, delay }}
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -10, 0], rotate: [0, spin, 0] }}
            transition={{ duration: 5 + depth * 1.5, repeat: Infinity, ease: 'easeInOut', delay }}
            className="drop-shadow-[0_12px_18px_rgba(160,40,90,0.25)]"
          >
            <Blossom tone={tone} size={size} />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
