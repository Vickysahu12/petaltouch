import { MotionConfig, useReducedMotion } from 'framer-motion'
import { ReactLenis } from 'lenis/react'
import { CartProvider } from './lib/cart'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Story from './components/Story'
import Shop, { QuickView } from './components/Shop'
import GiftBox from './components/Custom'
import Community from './components/Community'
import Occasions from './components/Occasions'
import HowToOrder from './components/HowToOrder'
import Visit from './components/Visit'
import Marquee from './components/Marquee'
import Events from './components/Events'
import Compare from './components/Compare'
import Footer from './components/Footer'
import { CartDrawer, Flights, Toast } from './components/Cart'

export default function App() {
  const reduce = useReducedMotion()
  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: !reduce, anchors: false }}>
      <MotionConfig reducedMotion="user">
        <CartProvider>
          <Nav />
          <main>
            <Hero />
            <Marquee />
            <Story />
            <Occasions />
            <Shop />
            <Events />
            <GiftBox />
            <HowToOrder />
            <Compare />
            <Visit />
            <Community />
          </main>
          <Footer />
          <QuickView />
          <CartDrawer />
          <Flights />
          <Toast />
        </CartProvider>
      </MotionConfig>
    </ReactLenis>
  )
}
