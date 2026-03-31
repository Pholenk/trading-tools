/**
 * Thin typed wrapper around stock.json.
 *
 * We deliberately use `require()` instead of a static `import` + resolveJsonModule
 * because the file has 983 keys — TypeScript's literal-type inference for that
 * many JSON keys causes a heap OOM during `tsc`. `require()` bypasses that
 * inference; we apply an explicit cast instead.
 */

interface StockEntry {
  rs: number
  rm: number
  trail: Array<{ rs: number; rm: number }>
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const _raw = require('./stock.json') as Record<string, StockEntry>

/** Every ticker symbol present in stock.json */
export const STOCK_TICKERS: string[] = Object.keys(_raw)
