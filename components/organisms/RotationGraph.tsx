'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import * as d3 from 'd3'

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

// --- COMPONENT ---
export function RotationGraph({ data }: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)

  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 300,
    height: 300,
  })

  // --- MIN - MAX SCALE ---
  const { minRS, minRM, maxRS, maxRM } = useMemo(() => {
    const defaultMin = 99
    const defaultMax = 101

    let minRS = defaultMin
    let minRM = defaultMin
    let maxRS = defaultMax
    let maxRM = defaultMax

    for (let x = 0; x < data.length; x++) {
      const minTrailRS = Math.min(data[x].rs)
      const maxTrailRS = Math.max(data[x].rs)
      const minTrailRM = Math.min(data[x].rm)
      const maxTrailRM = Math.max(data[x].rm)

      minRS = Math.min(minRS, minTrailRS, data[x].rs)
      maxRS = Math.max(maxRS, maxTrailRS, data[x].rs)
      minRM = Math.min(minRM, minTrailRM, data[x].rm)
      maxRM = Math.max(maxRM, maxTrailRM, data[x].rm)
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

  // --- DRAW CHART ---
  useEffect(() => {
    if (!svgRef.current || data.length === 0) return

    // TODO: Remove this before commit and use data instead
    const usedData = data.slice(0, 4)

    const { width, height } = size
    const margin = 50

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

    // --- TRAILS ---
    usedData.forEach((d: RRGDatum) => {
      if (!d.trail || d.trail.length < 2) return
      const graphColor = getSymbolColor(d)

      const line = d3
        .line<TrailPoint>()
        .x((p: TrailPoint) => x(p.rs))
        .y((p: TrailPoint) => y(p.rm))
        .curve(d3.curveCatmullRom.alpha(1))

      // Include the head position as the final trail point so the path
      // terminates exactly at the head circle with no gap.
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
        .attr('r', width < 400 ? 2 : 4)
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
    })

    // --- HEAD ---
    const circles = svg
      .selectAll<SVGCircleElement, RRGDatum>('circle')
      .data(usedData, (d: RRGDatum) => d.symbol || '')

    circles
      .enter()
      .append('circle')
      .attr('cx', (d: RRGDatum) => x(d.rs))
      .attr('cy', (d: RRGDatum) => y(d.rm))
      .attr('r', width < 400 ? 4 : 6)
      .attr('fill', getSymbolColor)
      .attr('stroke', '#111')

    // --- LABELS ---
    if (width > 400) {
      svg
        .selectAll<SVGTextElement, RRGDatum>('.label')
        .data(usedData)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', (d: RRGDatum) => x(d.rs) + 6)
        .attr('y', (d: RRGDatum) => y(d.rm) - 6)
        .text((d: RRGDatum) => d.symbol)
        .style('font-size', '10px')
    }
  }, [colorCollection, data, maxRM, maxRS, minRM, minRS, size])

  return (
    <div
      ref={wrapperRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '300px',
      }}
    >
      <svg ref={svgRef} />
    </div>
  )
}
