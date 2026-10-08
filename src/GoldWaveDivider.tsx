import React, { useEffect, useRef } from 'react'

interface GoldWaveDividerProps {
  flip?: boolean
  subtle?: boolean
  className?: string
  height?: number
}

interface GoldParticle {
  x: number
  y: number
  size: number
  speed: number
  phase: number
  alpha: number
}

export function GoldWaveDivider({
  flip = false,
  subtle = false,
  className = '',
  height = subtle ? 70 : 100,
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

    // Ambient floating stardust motes along the golden wave
    const particles: GoldParticle[] = Array.from({ length: 18 }, () => ({
      x: Math.random() * width,
      y: 0,
      size: Math.random() * 1.5 + 0.6,
      speed: Math.random() * 0.4 + 0.2,
      phase: Math.random() * Math.PI * 2,
      alpha: Math.random() * 0.6 + 0.2,
    }))

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
        e.clientX >= rect.left - 50 &&
        e.clientX <= rect.right + 50 &&
        e.clientY >= rect.top - 80 &&
        e.clientY <= rect.bottom + 80
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
      time += 0.018

      // Smooth mouse interaction dampening
      if (mouse.hovering) {
        mouse.influence += (1 - mouse.influence) * 0.08
      } else {
        mouse.influence += (0 - mouse.influence) * 0.04
      }

      ctx.clearRect(0, 0, width, canvasHeight)

      // Center baseline strictly in the vertical middle so ribbons NEVER touch top or bottom
      const centerY = canvasHeight * 0.5
      const primaryAmp = canvasHeight * (subtle ? 0.14 : 0.2)
      const secondaryAmp = canvasHeight * (subtle ? 0.09 : 0.14)
      const step = 5

      // ===================================================================
      // 1. AMBIENT SOFT GOLDEN AURA (Subtle, diffused, zero hard edges)
      // ===================================================================
      const auraGrad = ctx.createRadialGradient(
        width * 0.5 + Math.sin(time * 0.4) * (width * 0.2),
        centerY,
        10,
        width * 0.5,
        centerY,
        width * 0.6
      )
      auraGrad.addColorStop(0, 'rgba(223, 186, 83, 0.09)')
      auraGrad.addColorStop(0.5, 'rgba(184, 134, 11, 0.03)')
      auraGrad.addColorStop(1, 'rgba(10, 8, 5, 0)')

      ctx.fillStyle = auraGrad
      ctx.fillRect(0, 0, width, canvasHeight)

      // ===================================================================
      // 2. MOLTEN 24K GOLD RIBBON (Enclosed ribbon with natural thickness)
      // ===================================================================
      // Compute upper crest and lower trough paths
      const topPts: { x: number; y: number }[] = []
      const botPts: { x: number; y: number }[] = []

      for (let x = 0; x <= width; x += step) {
        const nx = x / width
        const w1 = Math.sin(nx * Math.PI * 2.2 + time * 0.75)
        const w2 = Math.cos(nx * Math.PI * 4.4 - time * 0.45) * 0.35

        // Organic mouse ripple
        const dist = Math.abs(x - mouse.x)
        const ripple = mouse.influence * Math.sin(dist * 0.04 - time * 3.5) * Math.max(0, 1 - dist / 220) * 14

        const crestY = centerY + (w1 + w2) * primaryAmp + ripple
        const ribbonThickness = 8 + Math.sin(nx * Math.PI * 3 + time) * 4 + (subtle ? 2 : 6)

        topPts.push({ x, y: crestY - ribbonThickness * 0.5 })
        botPts.push({ x, y: crestY + ribbonThickness * 0.5 })
      }

      // Draw enclosed ribbon polygon
      ctx.beginPath()
      ctx.moveTo(topPts[0].x, topPts[0].y)
      for (let i = 1; i < topPts.length; i++) {
        ctx.lineTo(topPts[i].x, topPts[i].y)
      }
      for (let i = botPts.length - 1; i >= 0; i--) {
        ctx.lineTo(botPts[i].x, botPts[i].y)
      }
      ctx.closePath()

      // Gradient inside the ribbon itself
      const ribbonGrad = ctx.createLinearGradient(0, centerY - primaryAmp, width, centerY + primaryAmp)
      ribbonGrad.addColorStop(0, 'rgba(255, 238, 160, 0.28)')
      ribbonGrad.addColorStop(0.35, 'rgba(223, 186, 83, 0.42)')
      ribbonGrad.addColorStop(0.7, 'rgba(184, 134, 11, 0.32)')
      ribbonGrad.addColorStop(1, 'rgba(255, 242, 194, 0.22)')
      ctx.fillStyle = ribbonGrad
      ctx.fill()

      // ===================================================================
      // 3. SECONDARY HARMONIC TRANSLUCENT RIBBON (Counter-phase elegance)
      // ===================================================================
      ctx.beginPath()
      for (let x = 0; x <= width; x += step) {
        const nx = x / width
        const w1 = Math.cos(nx * Math.PI * 2.8 - time * 0.6 + 0.8)
        const w2 = Math.sin(nx * Math.PI * 5.2 + time * 0.5) * 0.25
        const y = centerY + 3 + (w1 + w2) * secondaryAmp
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(255, 235, 170, 0.22)'
      ctx.lineWidth = 1.2
      ctx.stroke()

      // ===================================================================
      // 4. SPECULAR CREST LIGHT LINE WITH TRAVELING DIAMOND GLINT
      // ===================================================================
      ctx.beginPath()
      for (let i = 0; i < topPts.length; i++) {
        const pt = topPts[i]
        if (i === 0) ctx.moveTo(pt.x, pt.y)
        else ctx.lineTo(pt.x, pt.y)
      }

      const crestGrad = ctx.createLinearGradient(0, 0, width, 0)
      const glintCenter = (Math.sin(time * 0.65) * 0.5 + 0.5)
      crestGrad.addColorStop(Math.max(0, glintCenter - 0.22), 'rgba(223, 186, 83, 0.4)')
      crestGrad.addColorStop(glintCenter, 'rgba(255, 255, 245, 0.95)')
      crestGrad.addColorStop(Math.min(1, glintCenter + 0.22), 'rgba(223, 186, 83, 0.4)')

      ctx.strokeStyle = crestGrad
      ctx.lineWidth = 1.6
      ctx.shadowColor = 'rgba(255, 235, 150, 0.5)'
      ctx.shadowBlur = 6
      ctx.stroke()
      ctx.shadowBlur = 0

      // Delicate dotted companion thread
      ctx.beginPath()
      for (let x = 0; x <= width; x += step) {
        const nx = x / width
        const w1 = Math.sin(nx * Math.PI * 3.4 + time * 0.85)
        const y = centerY - 5 + w1 * (secondaryAmp * 0.7)
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(223, 186, 83, 0.25)'
      ctx.lineWidth = 0.85
      ctx.setLineDash([3, 7])
      ctx.stroke()
      ctx.setLineDash([])

      // ===================================================================
      // 5. FLOATING GOLD STARDUST MOTES
      // ===================================================================
      particles.forEach((p) => {
        p.x += p.speed
        if (p.x > width) p.x = 0
        const nx = p.x / width
        const waveY = centerY + Math.sin(nx * Math.PI * 2.2 + time * 0.75) * primaryAmp
        p.y = waveY + Math.sin(time * 2 + p.phase) * 8

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 240, 180, ${p.alpha * (0.6 + Math.sin(time * 3 + p.phase) * 0.4)})`
        ctx.fill()
      })

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
        margin: '-24px 0',
        overflow: 'hidden',
        lineHeight: 0,
        zIndex: 4,
        pointerEvents: 'none',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
        transform: flip ? 'rotate(180deg)' : 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: `${height}px`,
          pointerEvents: 'auto',
        }}
      />
    </div>
  )
}
