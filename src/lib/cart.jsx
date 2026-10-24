import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { products, BRAND, formatINR } from '../data/products'

const CartContext = createContext(null)
const STORAGE_KEY = 'petal-touch-cart'

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const qty = (state[action.id] || 0) + (action.qty || 1)
      return { ...state, [action.id]: Math.min(qty, 20) }
    }
    case 'set': {
      const next = { ...state }
      if (action.qty <= 0) delete next[action.id]
      else next[action.id] = Math.min(action.qty, 20)
      return next
    }
    case 'clear':
      return {}
    default:
      return state
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    // Drop anything that is no longer in the catalogue
    return Object.fromEntries(Object.entries(parsed).filter(([id, q]) => products.some((p) => p.id === id) && q > 0))
  } catch {
    return {}
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, load)
  const [open, setOpen] = useState(false)
  const [flights, setFlights] = useState([])
  const [toast, setToast] = useState(null)
  const [quick, setQuick] = useState(null)
  const cartIconRef = useRef(null)
  const toastTimer = useRef(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* storage blocked, cart still works for this visit */
    }
  }, [items])

  const lines = useMemo(
    () =>
      Object.entries(items)
        .map(([id, qty]) => ({ product: products.find((p) => p.id === id), qty }))
        .filter((l) => l.product),
    [items],
  )
  const count = lines.reduce((s, l) => s + l.qty, 0)
  const subtotal = lines.reduce((s, l) => s + l.qty * l.product.price, 0)

  const showToast = useCallback((message) => {
    clearTimeout(toastTimer.current)
    setToast({ message, key: Date.now() })
    toastTimer.current = setTimeout(() => setToast(null), 2600)
  }, [])

  // Adds to cart and launches a thumbnail from `fromEl` toward the cart icon
  const add = useCallback(
    (product, fromEl, qty = 1) => {
      const from = fromEl?.getBoundingClientRect()
      let target = cartIconRef.current?.getBoundingClientRect()
      // The nav may be slid up out of view; aim for where it will be once it slides back
      const header = cartIconRef.current?.closest('header')
      if (target && header) {
        const offset = new DOMMatrixReadOnly(getComputedStyle(header).transform).m42
        target = { left: target.left, top: target.top - offset, width: target.width, height: target.height }
      }
      if (from && target && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const id = Math.random().toString(36).slice(2)
        setFlights((f) => [...f, { id, image: product.image, from, to: target }])
      }
      dispatch({ type: 'add', id: product.id, qty })
      showToast(`${product.name} added to your bag`)
    },
    [showToast],
  )

  const setQty = useCallback((id, qty) => dispatch({ type: 'set', id, qty }), [])
  const clear = useCallback(() => dispatch({ type: 'clear' }), [])
  const landFlight = useCallback((id) => setFlights((f) => f.filter((x) => x.id !== id)), [])

  const value = {
    items,
    lines,
    count,
    subtotal,
    open,
    setOpen,
    add,
    setQty,
    clear,
    flights,
    landFlight,
    cartIconRef,
    toast,
    showToast,
    quick,
    setQuick,
  }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)

export function whatsappLink(text) {
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`
}

export function orderMessage(lines, subtotal, { name, date, note }) {
  const rows = lines.map((l) => `• ${l.qty} x ${l.product.name} (${formatINR(l.product.price * l.qty)})`)
  const extras = [name && `Name: ${name}`, date && `Needed by: ${date}`, note && `Note: ${note}`].filter(Boolean)
  return [`Hi Sonu! I'd like to order from Petal Touch 🌸`, '', ...rows, '', `Total: ${formatINR(subtotal)}`, ...extras].join('\n')
}
