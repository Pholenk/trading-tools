'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import * as d3 from 'd3'
import { cn } from '@/lib/utils'

// --- TYPES ---
export type TrailPoint = {
  rs: number
  rm: number
}

export type RRGDatum = {
  symbol: string
  rs: number
  rm: number
  trail?: TrailPoint[]
}

type Props = {
  data: RRGDatum[]
}

const _generateRandomColor = (existingColors: string[]) => {
  const randomNumber = Math.floor(Math.random() * 16777215)
  let randomHexColor = randomNumber.toString(16)
  randomHexColor = randomHexColor.padStart(6, '0')

  if (existingColors.findIndex((color) => color === randomHexColor) >= 0) {
    return _generateRandomColor(existingColors)
  }

  return randomHexColor
}

const _getCssVar = (name: string) => {
  return typeof window !== 'undefined'
    ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    : '#ffff00'
}

// Quadrant labels — clockwise from top-left.
// Labels sit OUTSIDE the plot area — in the margin band between the SVG
// canvas edge and the axis lines. px-4 (16px) from the canvas edge horizontally,
// pt-4 (16px) from the top edge, pb-4 (16px) from the bottom edge.
const QUADRANT_LABELS = [
  {
    id: 'improving',
    text: 'Improving',
    color: '#0398fc',
    // top-left: 16px from left canvas edge, 16px from top canvas edge
    getX: () => 16,
    getY: () => 16,
    anchor: 'start',
    baseline: 'hanging',
  },
  {
    id: 'leading',
    text: 'Leading',
    color: '#03fc49',
    // top-right: 16px from right canvas edge, 16px from top canvas edge
    getX: (_margin: number, width: number) => width - 16,
    getY: () => 16,
    anchor: 'end',
    baseline: 'hanging',
  },
  {
    id: 'weakening',
    text: 'Weakening',
    color: '#d49102',
    // bottom-right: 16px from right canvas edge, 16px from bottom canvas edge
    getX: (_margin: number, width: number) => width - 16,
    getY: (_margin: number, _width: number, height: number) => height - 16,
    anchor: 'end',
    baseline: 'alphabetic',
  },
  {
    id: 'lagging',
    text: 'Lagging',
    color: '#9c02d4',
    // bottom-left: 16px from left canvas edge, 16px from bottom canvas edge
    getX: () => 16,
    getY: (_margin: number, _width: number, height: number) => height - 16,
    anchor: 'start',
    baseline: 'alphabetic',
  },
] as const

// --- COMPONENT ---
export function RotationGraph({ data }: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)

  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 300,
    height: 300,
  })

  // Increments whenever the theme class on <html> changes so the draw effect
  // re-runs and re-reads CSS variables (e.g. --on-surface) with the new values.
  const [themeVersion, setThemeVersion] = useState(0)

  // --- MIN - MAX SCALE ---
  const { minRS, minRM, maxRS, maxRM } = useMemo(() => {
    const defaultMin = 99
    const defaultMax = 101

    let minRS = defaultMin
    let minRM = defaultMin
    let maxRS = defaultMax
    let maxRM = defaultMax

    for (let x = 0; x < data.length; x++) {
      const trailRS = data[x]?.trail?.map(trailItem => trailItem.rs) ?? []
      const trailRM = data[x]?.trail?.map(trailItem => trailItem.rm) ?? []

      minRS = Math.min(minRS, data[x].rs, ...trailRS)
      maxRS = Math.max(maxRS, data[x].rs, ...trailRS)
      minRM = Math.min(minRM, data[x].rm, ...trailRM)
      maxRM = Math.max(maxRM, data[x].rm, ...trailRM)
    }

    return { minRS, minRM, maxRS, maxRM }
  }, [data])

  // --- COLOR ASSIGNMENT ---
  const colorCollection = useMemo(() => {
    const collection: Record<RRGDatum['symbol'], string> = {}

    for (let x = 0; x < data.length; x++) {
      const symbolColor = _generateRandomColor(Object.values(collection))
      collection[data[x].symbol] =
        data[x].symbol.toLowerCase() === 'composite'
          ? _getCssVar('--on-surface-variant')
          : `#${symbolColor}`
    }

    return collection
  }, [data])

  // --- RESIZE OBSERVER ---
  useEffect(() => {
    if (!wrapperRef.current) return

    const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      const entry = entries[0]
      if (!entry) return

      const { width } = entry.contentRect

      setSize({
        width,
        height: width, // keep square
      })
    })

    observer.observe(wrapperRef.current)

    return () => observer.disconnect()
  }, [])

  // --- THEME OBSERVER ---
  // Watch for class changes on <html> (next-themes toggles .dark) and bump
  // themeVersion so the draw effect re-reads CSS variables on the fly.
  useEffect(() => {
    const root = document.documentElement
    const observer = new MutationObserver(() => {
      setThemeVersion((v) => v + 1)
    })
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // --- DRAW CHART ---
  useEffect(() => {
    if (!svgRef.current || data.length === 0) return

    const { width, height } = size
    const margin = 72

    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current)
    svg.selectAll('*').remove()

    svg.attr('width', width).attr('height', height)

    // --- SCALES ---
    const x = d3
      .scaleLinear()
      .domain([minRS, maxRS])
      .range([margin, width - margin])

    const y = d3
      .scaleLinear()
      .domain([minRM, maxRM])
      .range([height - margin, margin])

    // --- COLOR GENERATOR ---
    const getSymbolColor = (datum: RRGDatum) => {
      const { symbol } = datum
      return colorCollection[symbol]
    }

    // --- AXES ---
    const xAxis = d3.axisBottom(x).ticks(width < 400 ? 4 : 8)
    const yAxis = d3.axisLeft(y).ticks(height < 400 ? 4 : 8)

    svg
      .append('g')
      .attr('transform', `translate(0, ${y(100)})`)
      .call(xAxis)

    svg
      .append('g')
      .attr('transform', `translate(${x(100)}, 0)`)
      .call(yAxis)

    // --- CENTER LINES ---
    svg
      .append('line')
      .attr('x1', x(100))
      .attr('x2', x(100))
      .attr('y1', margin)
      .attr('y2', height - margin)
      .attr('stroke', '#666')

    svg
      .append('line')
      .attr('x1', margin)
      .attr('x2', width - margin)
      .attr('y1', y(100))
      .attr('y2', y(100))
      .attr('stroke', '#666')

    // --- QUADRANT LABELS ---
    QUADRANT_LABELS.forEach((q) => {
      const qx = q.getX(margin, width)
      const qy = q.getY(margin, width, height)

      svg
        .append('text')
        .classed(`quadrant-label quadrant-${q.id} label-large`, true)
        .attr('x', qx)
        .attr('y', qy)
        .attr('text-anchor', q.anchor)
        .attr('dominant-baseline', q.baseline)
        .attr('fill', q.color)
        .text(q.text)
    })

    // Base sizes — hover grows both by 50 %
    const trailDotR = width < 400 ? 2 : 4
    const headR     = width < 400 ? 4 : 6

    // --- HOVER HELPERS ---
    const highlightSymbol = (symbol: string) => {
      // Dim every trail group that isn't this symbol
      svg.selectAll<SVGGElement, unknown>('g[class^="trail-"]')
        .attr('opacity', (_, i, nodes) => {
          const cls = (nodes[i] as SVGGElement).getAttribute('class') ?? ''
          return cls === `trail-${symbol}` ? 1 : 0.15
        })
      // Bold the active trail path
      svg.select(`g.trail-${symbol} path`)
        .attr('stroke-width', 3)
        .attr('opacity', 1)
      // Grow the active trail dots
      svg.selectAll<SVGCircleElement, TrailPoint>(`g.trail-${symbol} circle`)
        .attr('r', trailDotR * 1.5)
      // Grow the active head circle
      svg.selectAll<SVGCircleElement, RRGDatum>('svg > circle, circle.head')
        .filter((hd: RRGDatum) => hd.symbol === symbol)
        .attr('r', headR * 1.5)
      // Dim all other head circles
      svg.selectAll<SVGCircleElement, RRGDatum>('svg > circle, circle.head')
        .filter((hd: RRGDatum) => hd.symbol !== symbol)
        .attr('opacity', 0.15)
      // Bold the active data label
      svg.selectAll<SVGTextElement, RRGDatum>('text.label')
        .filter((hd: RRGDatum) => hd.symbol === symbol)
        .attr('font-weight', 700)
      svg.selectAll<SVGTextElement, RRGDatum>('text.label')
        .filter((hd: RRGDatum) => hd.symbol !== symbol)
        .attr('opacity', 0.3)
    }

    const resetHighlight = () => {
      svg.selectAll<SVGGElement, unknown>('g[class^="trail-"]').attr('opacity', 1)
      svg.selectAll<SVGPathElement, unknown>('g[class^="trail-"] path')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.7)
      svg.selectAll<SVGCircleElement, TrailPoint>('g[class^="trail-"] circle')
        .attr('r', trailDotR)
      svg.selectAll<SVGCircleElement, RRGDatum>('svg > circle, circle.head')
        .attr('r', headR)
        .attr('opacity', 1)
      svg.selectAll<SVGTextElement, RRGDatum>('text.label')
        .attr('font-weight', null)
        .attr('opacity', 1)
    }

    // --- TRAILS ---
    data.forEach((d: RRGDatum) => {
      if (!d.trail || d.trail.length < 2) return
      const graphColor = colorCollection[d.symbol]

      const line = d3
        .line<TrailPoint>()
        .x((p: TrailPoint) => x(p.rs))
        .y((p: TrailPoint) => y(p.rm))
        .curve(d3.curveCatmullRom.alpha(1))

      const fullTrail: TrailPoint[] = [...d.trail, { rs: d.rs, rm: d.rm }]

      const trailGroup = svg.append('g').attr('class', `trail-${d.symbol}`)

      const trailCircle = trailGroup
        .selectAll<SVGCircleElement, TrailPoint>('circle')
        .data(fullTrail)

      trailCircle
        .enter()
        .append('circle')
        .attr('cx', (dt: TrailPoint) => x(dt.rs))
        .attr('cy', (dt: TrailPoint) => y(dt.rm))
        .attr('r', trailDotR)
        .attr('fill', graphColor)
        .attr('stroke', graphColor)

      trailGroup
        .append('path')
        .datum<TrailPoint[]>(fullTrail)
        .attr('fill', 'none')
        .attr('stroke', graphColor)
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.7)
        .attr('d', line)

      // Hover target on the trail group itself
      trailGroup
        .on('mouseenter', () => highlightSymbol(d.symbol))
        .on('mouseleave', resetHighlight)
    })

    // --- HEAD ---
    const circles = svg
      .selectAll<SVGCircleElement, RRGDatum>('circle')
      .data(data, (d: RRGDatum) => d.symbol || '')

    circles
      .enter()
      .append('circle')
      .classed('head', true)
      .attr('cx', (d: RRGDatum) => x(d.rs))
      .attr('cy', (d: RRGDatum) => y(d.rm))
      .attr('r', headR)
      .attr('fill', getSymbolColor)
      .attr('stroke', getSymbolColor)
      .style('cursor', 'pointer')
      .on('mouseenter', (_, d: RRGDatum) => highlightSymbol(d.symbol))
      .on('mouseleave', resetHighlight)

    // --- DATA LABELS ---
    // Read --on-surface at draw time so switching theme re-reads the live value.
    // SVG text does not respond to Tailwind colour utilities (which set CSS
    // `color`) — the fill attribute must be set explicitly.
    if (width > 400) {
      const labelColor = _getCssVar('--on-surface')
      svg
        .selectAll<SVGTextElement, RRGDatum>('.label')
        .data(data)
        .enter()
        .append('text')
        .classed('label label-medium', true)
        .attr('fill', labelColor)
        .attr('x', (d: RRGDatum) => x(d.rs) - 12)
        .attr('y', (d: RRGDatum) => y(d.rm) - 20)
        .text((d: RRGDatum) => d.symbol)
        .style('cursor', 'pointer')
        .on('mouseenter', (_, d: RRGDatum) => highlightSymbol(d.symbol))
        .on('mouseleave', resetHighlight)
    }
  }, [colorCollection, data, maxRM, maxRS, minRM, minRS, size, themeVersion])

  return (
    <div ref={wrapperRef} className='w-full h-full px-5'>
      <svg
        ref={svgRef}
        className={cn(
          'bg-inverse-surface dark:bg-surface-variant',
          'min-h-full min-w-full',
        )}
      />
    </div>
  )
}
