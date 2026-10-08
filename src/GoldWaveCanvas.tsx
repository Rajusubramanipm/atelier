import React, { useEffect, useRef } from 'react'

interface GoldWaveCanvasProps {
  className?: string
  opacity?: number
  speed?: number
  waveCount?: number
  interactive?: boolean
  ambientDarkness?: number // 0 = luminous, 1 = deep dark gold
}

export function GoldWaveCanvas({
  className = '',
  opacity = 0.85,
  speed = 1,
  waveCount = 4,
  interactive = true,
  ambientDarkness = 0.5,
}: GoldWaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth)
    let height = (canvas.height = canvas.offsetHeight || 600)
    let time = 0

    const mouse = {
      x: width * 0.5,
      y: height * 0.5,
      targetX: width * 0.5,
      targetY: height * 0.5,
    }

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth || window.innerWidth
      height = canvas.height = canvas.offsetHeight || 600
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return
      const rect = canvas.getBoundingClientRect()
      mouse.targetX = e.clientX - rect.left
      mouse.targetY = e.clientY - rect.top
    }

    window.addEventListener('resize', handleResize)
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true })
    }

    // Palette of rich molten golds
    const waveConfigs = [
      {
        baseFreq: 0.0035,
        speedMultiplier: 0.008 * speed,
        amplitude: height * 0.16,
        yOffsetRatio: 0.55,
        colors: ['rgba(255, 235, 160, 0.28)', 'rgba(218, 165, 32, 0.42)', 'rgba(138, 92, 14, 0.12)'],
        phase: 0,
        lineWidth: 2.2,
      },
      {
        baseFreq: 0.0028,
        speedMultiplier: 0.006 * speed,
        amplitude: height * 0.22,
        yOffsetRatio: 0.62,
        colors: ['rgba(250, 218, 122, 0.32)', 'rgba(205, 149, 12, 0.48)', 'rgba(100, 68, 12, 0.15)'],
        phase: 1.4,
        lineWidth: 1.8,
      },
      {
        baseFreq: 0.0042,
        speedMultiplier: 0.011 * speed,
        amplitude: height * 0.14,
        yOffsetRatio: 0.48,
        colors: ['rgba(255, 245, 195, 0.45)', 'rgba(227, 185, 78, 0.55)', 'rgba(166, 118, 25, 0.2)'],
        phase: 2.7,
        lineWidth: 2.5,
      },
      {
        baseFreq: 0.002,
        speedMultiplier: 0.0045 * speed,
        amplitude: height * 0.26,
        yOffsetRatio: 0.7,
        colors: ['rgba(243, 203, 98, 0.25)', 'rgba(184, 134, 11, 0.35)', 'rgba(70, 48, 8, 0.1)'],
        phase: 4.1,
        lineWidth: 1.4,
      },
    ].slice(0, waveCount)

    const render = () => {
      time += 1

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05

      ctx.clearRect(0, 0, width, height)

      // Optional ambient golden radial glow around mouse
      if (interactive) {
        const glowGrad = ctx.createRadialGradient(mouse.x, mouse.y, 10, mouse.x, mouse.y, width * 0.45)
        glowGrad.addColorStop(0, 'rgba(235, 195, 85, 0.09)')
        glowGrad.addColorStop(0.5, 'rgba(180, 130, 30, 0.04)')
        glowGrad.addColorStop(1, 'rgba(10, 8, 5, 0)')
        ctx.fillStyle = glowGrad
        ctx.fillRect(0, 0, width, height)
      }

      const mouseInfluence = ((mouse.x / width) - 0.5) * 1.5

      waveConfigs.forEach((cfg) => {
        const baseY = height * cfg.yOffsetRatio
        const t = time * cfg.speedMultiplier + cfg.phase

        // Draw filled flowing wave ribbon
        ctx.beginPath()
        ctx.moveTo(0, height)
        ctx.lineTo(0, baseY)

        const step = 8
        for (let x = 0; x <= width; x += step) {
          const normX = x / width
          // Multi-harmonic sine waves
          const wave1 = Math.sin(x * cfg.baseFreq + t)
          const wave2 = Math.cos(x * cfg.baseFreq * 1.8 - t * 0.8)
          const wave3 = Math.sin(normX * Math.PI + mouseInfluence) * 0.4
          
          // Mouse deflection
          const distToMouse = Math.abs(x - mouse.x)
          const mouseDamp = Math.max(0, 1 - distToMouse / (width * 0.35))
          const mouseLift = Math.sin((mouse.y / height) * Math.PI) * mouseDamp * 35

          const y = baseY + (wave1 * 0.65 + wave2 * 0.35 + wave3) * cfg.amplitude + mouseLift
          ctx.lineTo(x, y)
        }

        ctx.lineTo(width, height)
        ctx.closePath()

        // Create metallic liquid gold vertical gradient
        const gradient = ctx.createLinearGradient(0, baseY - cfg.amplitude, 0, height)
        gradient.addColorStop(0, cfg.colors[0])
        gradient.addColorStop(0.3, cfg.colors[1])
        gradient.addColorStop(1, cfg.colors[2])

        ctx.fillStyle = gradient
        ctx.globalAlpha = opacity
        ctx.fill()

        // Shimmering crest highlight line
        ctx.beginPath()
        for (let x = 0; x <= width; x += step) {
          const normX = x / width
          const wave1 = Math.sin(x * cfg.baseFreq + t)
          const wave2 = Math.cos(x * cfg.baseFreq * 1.8 - t * 0.8)
          const wave3 = Math.sin(normX * Math.PI + mouseInfluence) * 0.4
          const distToMouse = Math.abs(x - mouse.x)
          const mouseDamp = Math.max(0, 1 - distToMouse / (width * 0.35))
          const mouseLift = Math.sin((mouse.y / height) * Math.PI) * mouseDamp * 35

          const y = baseY + (wave1 * 0.65 + wave2 * 0.35 + wave3) * cfg.amplitude + mouseLift
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = 'rgba(255, 248, 220, 0.45)'
        ctx.lineWidth = cfg.lineWidth
        ctx.stroke()
      })

      ctx.globalAlpha = 1
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove)
      }
      cancelAnimationFrame(animationFrameId)
    }
  }, [speed, waveCount, opacity, interactive, ambientDarkness])

  return (
    <canvas
      ref={canvasRef}
      className={`gold-wave-canvas ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  )
}
