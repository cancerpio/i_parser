import type { PriceBand } from './types'

export const PRICE_BANDS: PriceBand[] = [
    { id: 'all', label: 'All', min: 0, max: null },
    { id: '10000-20000', label: '10,000–20,000', min: 10_000, max: 20_000 },
    { id: '20000-30000', label: '20,000–30,000', min: 20_000, max: 30_000 },
    { id: '30000-40000', label: '30,000–40,000', min: 30_000, max: 40_000 },
    { id: '40000+', label: '40,000+', min: 40_000, max: null },
]

export function isPriceInBand(price: number, band: PriceBand): boolean {
    if (price < band.min) return false
    if (band.max == null) return true
    return price < band.max
}
