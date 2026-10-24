import sunflowerDusk from '../assets/ig/sunflower-dusk.jpg'
import pinkLilyTulip from '../assets/ig/pink-lily-tulip.jpg'
import kitkatRose from '../assets/ig/kitkat-rose.jpg'
import skyLily from '../assets/ig/sky-lily.jpg'
import nazarBlue from '../assets/ig/nazar-blue.jpg'
import nazarPair from '../assets/ig/nazar-pair.jpg'
import lavenderMini from '../assets/ig/lavender-mini.jpg'
import sunflowerPrint from '../assets/ig/sunflower-print.jpg'
import whitePlumeria from '../assets/ig/white-plumeria.jpg'
import gardenMix from '../assets/ig/garden-mix.jpg'
import sunflowerStem from '../assets/ig/sunflower-stem.jpg'
import logo from '../assets/ig/logo.jpg'

export const BRAND = {
  name: 'Petal Touch',
  maker: 'Sonu',
  phone: '9974779636',
  whatsapp: '919974779636',
  instagram: 'petal_touch25',
  personal: 'iluv.sonu',
  city: 'Surat',
  stall: { open: [17, 0], close: [19, 30] },
  logo,
}

export const images = {
  sunflowerDusk,
  pinkLilyTulip,
  kitkatRose,
  skyLily,
  nazarBlue,
  nazarPair,
  lavenderMini,
  sunflowerPrint,
  whitePlumeria,
  gardenMix,
  sunflowerStem,
}

// Prices are sample values for the demo. Confirm with Sonu before launch.
// Background-free versions of each product photo, shown on blush tiles in the catalogue
const cutouts = import.meta.glob('../assets/products/*.webp', { eager: true, import: 'default' })
const cutoutFor = (id) => cutouts[`../assets/products/${id}.webp`]

export const products = [
  {
    id: 'sunflower-dusk',
    name: 'Sunflower Dusk',
    detail: '6 sunflowers, daisies',
    price: 649,
    image: sunflowerDusk,
    tags: ['sunflowers'],
    tint: '#f6e7c8',
    blurb: 'Six golden sunflowers with tiny white daisies, wrapped in smoky taupe paper. Bright enough to fix anyone’s Monday.',
  },
  {
    id: 'pink-lily-tulip',
    name: 'Blush Lily & Tulip',
    detail: '3 lilies, tulip, buds',
    price: 749,
    image: pinkLilyTulip,
    tags: ['lilies'],
    tint: '#f8d9e3',
    blurb: 'Soft pink lilies around a single tall tulip, with curled green fern stems and baby blossoms. Our most asked-for bouquet.',
  },
  {
    id: 'kitkat-rose',
    name: 'KitKat Rose',
    detail: '2 roses, 2 KitKats',
    price: 599,
    image: kitkatRose,
    tags: ['gifts'],
    tint: '#f7d4d0',
    blurb: 'Two red chenille roses, two KitKats and a curly ribbon. Flowers they keep, chocolate they don’t.',
  },
  {
    id: 'nazar-blue',
    name: 'Nazar Bouquet',
    detail: 'Evil-eye charm, blue lilies',
    price: 799,
    image: nazarBlue,
    tags: ['nazar', 'lilies', 'gifts'],
    tint: '#d8e2f6',
    blurb: 'Cobalt and sky-blue lilies, white tulips and a hand-made nazar charm to keep the bad vibes away.',
  },
  {
    id: 'sky-lily',
    name: 'Sky Lily',
    detail: '5 lilies, jasmine buds',
    price: 699,
    image: skyLily,
    tags: ['lilies'],
    tint: '#dbe9f4',
    blurb: 'Pale blue lilies with jasmine-white buds and long leaves. Calm, airy and very easy to love.',
  },
  {
    id: 'garden-mix',
    name: 'Garden Mix',
    detail: '12+ mixed stems',
    price: 899,
    image: gardenMix,
    tags: ['lilies', 'sunflowers', 'gifts'],
    tint: '#efdcf0',
    blurb: 'Lilies, tulips, sunflowers and plumeria in every colour Sonu has. The big “I couldn’t choose” bouquet.',
  },
  {
    id: 'sunflower-print',
    name: 'Newsprint Sunflowers',
    detail: '3 sunflowers, daisies',
    price: 549,
    image: sunflowerPrint,
    tags: ['sunflowers'],
    tint: '#f3e6c6',
    blurb: 'Three sunflowers and a cluster of daisies wrapped in vintage newsprint. A little bit café, a little bit Paris.',
  },
  {
    id: 'lavender-mini',
    name: 'Lavender Mini',
    detail: '2 lilies, clear wrap',
    price: 349,
    image: lavenderMini,
    tags: ['lilies'],
    tint: '#e4def4',
    blurb: 'A small clear-wrapped bunch of lilac and blue lilies with a golden ribbon. Perfect for a just-because gift.',
  },
  {
    id: 'white-plumeria',
    name: 'Moon Plumeria',
    detail: 'Single stem',
    price: 79,
    image: whitePlumeria,
    tags: ['singles'],
    tint: '#eeeae2',
    blurb: 'One oversized white plumeria with a fuzzy yellow heart. Tuck it in a vase, a bag or a bun.',
  },
  {
    id: 'sunflower-stem',
    name: 'Sunflower Stem',
    detail: 'Single stem',
    price: 69,
    image: sunflowerStem,
    tags: ['singles', 'sunflowers'],
    tint: '#f6e5bd',
    blurb: 'A single sunflower with a heart-shaped centre. The smallest way to say a big thing.',
  },
  {
    id: 'nazar-pair',
    name: 'Nazar Blooms',
    detail: 'Set of 2',
    price: 149,
    image: nazarPair,
    tags: ['singles', 'nazar'],
    tint: '#d9e0f5',
    blurb: 'Two evil-eye flowers in royal blue. Pin them to a bag, a mirror or a dashboard.',
  },
]

export const categories = [
  { id: 'sunflowers', label: 'Sunflowers' },
  { id: 'lilies', label: 'Lilies' },
  { id: 'gifts', label: 'Gift Picks' },
  { id: 'nazar', label: 'Nazar' },
  { id: 'singles', label: 'Single Stems' },
]

for (const p of products) p.cutout = cutoutFor(p.id)

export const formatINR = (n) => '₹' + n.toLocaleString('en-IN')
