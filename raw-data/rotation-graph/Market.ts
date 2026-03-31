/**
 * Thin typed wrapper around market.json.
 * Uses require() to avoid TypeScript inferring a large literal type.
 */

import type { TrailPoint } from '@/organisms'

export interface MarketEntry {
  rs: number
  rm: number
  trail: TrailPoint[]
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const _raw = require('./market.json') as Record<string, MarketEntry>

export const MARKET_DATA: Record<string, MarketEntry> = _raw
