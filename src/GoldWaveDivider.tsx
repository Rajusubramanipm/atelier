import React, { useEffect, useRef } from 'react'

interface GoldWaveDividerProps {
  flip?: boolean
  subtle?: boolean
  className?: string
  height?: number
}

export function GoldWaveDivider({
  flip = false,
  subtle = false,
  className = '',
  height = subtle ? 54 : 80,
}: GoldWaveDividerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let width = (canvas.width = container.offsetWidth || window.innerWidth)
    let canvasHeight = (canvas.height = height)
    let time = 0

    const mouse = {
      x: -1000,
      y: -1000,
      hovering: false,
      influence: 0,
    }

    const handleResize = () => {
      if (!canvas || !container) return
      width = canvas.width = container.offsetWidth || window.innerWidth
      canvasHeight = canvas.height = height
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      if (
        e.clientX >= rect.left - 40 &&
        e.clientX <= rect.right + 40 &&
        e.clientY >= rect.top - 60 &&
        e.clientY <= rect.bottom + 60
      ) {
        mouse.x = e.clientX - rect.left
        mouse.y = e.clientY - rect.top
        mouse.hovering = true
      } else {
        mouse.hovering = false
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    const render = () => {
      time += 0.02

      // Smooth mouse interaction dampening
      if (mouse.hovering) {
        mouse.influence += (1 - mouse.influence) * 0.08
      } else {
        mouse.influence += (0 - mouse.influence) * 0.04
      }

      ctx.clearRect(0, 0, width, canvasHeight)

      const baseWaveY = canvasHeight * 0.52
      const amp1 = canvasHeight * 0.28
      const amp2 = canvasHeight * 0.18

      // ===================================================================
      // LAYER 1: Deep Molten Gold Ambient Ribbon (Volumetric Depth)
      // ===================================================================
      ctx.beginPath()
      ctx.moveTo(0, canvasHeight)
      ctx.lineTo(0, baseWaveY)

      const step = 6
      for (let x = 0; x <= width; x += step) {
        const nx = x / width
        const w1 = Math.sin(nx * Math.PI * 2.2 + time * 0.8)
        const w2 = Math.cos(nx * Math.PI * 4.1 - time * 0.5) * 0.4

        // Realistic mouse ripple deflection
        const dist = Math.abs(x - mouse.x)
        const ripple = mouse.influence * Math.sin(dist * 0.04 - time * 4) * Math.max(0, 1 - dist / 220) * 16

        const y = baseWaveY + (w1 + w2) * amp1 + ripple + Math.sin(time * 0.6) * 4
        ctx.lineTo(x, y)
      }

      ctx.lineTo(width, canvasHeight)
      ctx.closePath()

      const deepGrad = ctx.createLinearGradient(0, 0, width, canvasHeight)
      deepGrad.addColorStop(0, 'rgba(122, 82, 8, 0.25)')
      deepGrad.addColorStop(0.5, 'rgba(184, 134, 11, 0.45)')
      deepGrad.addColorStop(1, 'rgba(90, 60, 6, 0.25)')
      ctx.fillStyle = deepGrad
      ctx.fill()

      // ===================================================================
      // LAYER 2: Radiant Liquid 24K Gold Body Wave
      // ===================================================================
      ctx.beginPath()
      ctx.moveTo(0, canvasHeight)
      ctx.lineTo(0, baseWaveY + 8)

      for (let x = 0; x <= width; x += step) {
        const nx = x / width
        const w1 = Math.sin(nx * Math.PI * 2.8 + time * 1.1 + 1.2)
        const w2 = Math.sin(nx * Math.PI * 5.4 - time * 0.7) * 0.35

        const dist = Math.abs(x - mouse.x)
        const ripple = mouse.influence * Math.cos(dist * 0.05 - time * 3.5) * Math.max(0, 1 - dist / 240) * 20

        const y = baseWaveY + 6 + (w1 + w2) * amp2 + ripple
        ctx.lineTo(x, y)
      }

      ctx.lineTo(width, canvasHeight)
      ctx.closePath()

      const midGrad = ctx.createLinearGradient(0, baseWaveY - amp2, width, canvasHeight)
      midGrad.addColorStop(0, 'rgba(255, 238, 160, 0.45)')
      midGrad.addColorStop(0.25, 'rgba(223, 186, 83, 0.75)')
      midGrad.addColorStop(0.65, 'rgba(184, 134, 11, 0.65)')
      midGrad.addColorStop(1, 'rgba(110, 78, 10, 0.3)')
      ctx.fillStyle = midGrad
      ctx.fill()

      // ===================================================================
      // LAYER 3: Glistening Specular Crest Line with Moving Light Glint
      // ===================================================================
      ctx.beginPath()
      for (let x = 0; x <= width; x += step) {
        const nx = x / width
        const w1 = Math.sin(nx * Math.PI * 2.8 + time * 1.1 + 1.2)
        const w2 = Math.sin(nx * Math.PI * 5.4 - time * 0.7) * 0.35

        const dist = Math.abs(x - mouse.x)
        const ripple = mouse.influence * Math.cos(dist * 0.05 - time * 3.5) * Math.max(0, 1 - dist / 240) * 20

        const y = baseWaveY + 6 + (w1 + w2) * amp2 + ripple
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }

      // Specular highlight line
      const crestGrad = ctx.createLinearGradient(0, 0, width, 0)
      const lightPos = (Math.sin(time * 0.75) * 0.5 + 0.5)
      crestGrad.addColorStop(Math.max(0, lightPos - 0.25), 'rgba(223, 186, 83, 0.6)')
      crestGrad.addColorStop(lightPos, 'rgba(255, 255, 240, 0.98)')
      crestGrad.addColorStop(Math.min(1, lightPos + 0.25), 'rgba(223, 186, 83, 0.6)')

      ctx.strokeStyle = crestGrad
      ctx.lineWidth = 2.2
      ctx.shadowColor = 'rgba(255, 235, 150, 0.75)'
      ctx.shadowBlur = 8
      ctx.stroke()
      ctx.shadowBlur = 0

      // ===================================================================
      // Subtle Filament Accent Wire
      // ===================================================================
      ctx.beginPath()
      for (let x = 0; x <= width; x += step) {
        const nx = x / width
        const w1 = Math.cos(nx * Math.PI * 3.2 - time * 0.9)
        const y = baseWaveY - 4 + w1 * (amp2 * 0.7)
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(255, 238, 170, 0.35)'
      ctx.lineWidth = 1
      ctx.setLineDash([3, 5])
      ctx.stroke()
      ctx.setLineDash([])

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animId)
    }
  }, [flip, subtle, height])

  return (
    <div
      ref={containerRef}
      className={`gold-wave-divider-wrapper ${flip ? 'wave-flipped' : ''} ${className}`}
      aria-hidden="true"
      style={{
        position: 'relative',
        width: '100%',
        height: `${height}px`,
        overflow: 'hidden',
        lineHeight: 0,
        zIndex: 2,
        transform: flip ? 'rotate(180deg)' : 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: `${height}px`,
        }}
      />
    </div>
  )
}
