import React, { useEffect, useState, useRef } from 'react'

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  vx: number
  vy: number
  life: number
  isStar?: boolean
}

export function GoldCursor() {
  const [mounted, setMounted] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [visible, setVisible] = useState(false)

  const mousePos = useRef({ x: -100, y: -100 })
  const trailingPos = useRef({ x: -100, y: -100 })
  const velocity = useRef({ x: 0, y: 0 })
  const currentAngle = useRef(0)
  const sparklesRef = useRef<Sparkle[]>([])
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const dotRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Only enable for precision desktop mouse pointers, never touch screens
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    if (!isFinePointer) return
    setMounted(true)

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX
      mousePos.current.y = e.clientY
      if (!visible) setVisible(true)

      // Emit soft ambient gold stardust on graceful movement
      if (Math.random() < 0.28) {
        sparklesRef.current.push({
          id: Math.random(),
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          size: Math.random() * 2.2 + 1,
          opacity: 0.9,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4 - 0.15,
          life: 1,
          isStar: Math.random() < 0.35,
        })
      }

      // Check hovered interactive elements
      const target = e.target as HTMLElement | null
      if (target) {
        const interactiveEl = target.closest('a, button, [role="button"], input, select, textarea, .type, .design-card, .scene-stage')
        setHovered(!!interactiveEl)
      }
    }

    const handleMouseDown = () => {
      setClicked(true)
      // Playful diamond burst on click
      for (let i = 0; i < 9; i++) {
        const angle = (i / 9) * Math.PI * 2 + (Math.random() - 0.5) * 0.4
        const speed = Math.random() * 2.2 + 1.2
        sparklesRef.current.push({
          id: Math.random(),
          x: mousePos.current.x,
          y: mousePos.current.y,
          size: Math.random() * 3.2 + 1.4,
          opacity: 1,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          isStar: i % 2 === 0,
        })
      }
    }

    const handleMouseUp = () => setClicked(false)
    const handleMouseLeave = () => setVisible(false)
    const handleMouseEnter = () => setVisible(true)

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    let animId: number
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')

    const updateCanvasSize = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }
    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    const render = () => {
      // Smooth interpolation for the trailing ring
      const factor = 0.22
      const prevX = trailingPos.current.x
      const prevY = trailingPos.current.y

      trailingPos.current.x += (mousePos.current.x - trailingPos.current.x) * factor
      trailingPos.current.y += (mousePos.current.y - trailingPos.current.y) * factor

      velocity.current.x = trailingPos.current.x - prevX
      velocity.current.y = trailingPos.current.y - prevY

      // Smooth dynamic tilt based on velocity (up to ±24 degrees)
      const targetAngle = Math.max(-24, Math.min(24, velocity.current.x * 1.8))
      currentAngle.current += (targetAngle - currentAngle.current) * 0.15

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${trailingPos.current.x}px, ${trailingPos.current.y}px, 0) rotate(${currentAngle.current}deg)`
      }

      // Render stardust on overlay canvas (Zero blur on page background)
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        for (let i = sparklesRef.current.length - 1; i >= 0; i--) {
          const s = sparklesRef.current[i]
          s.x += s.vx
          s.y += s.vy
          s.life -= 0.032
          s.opacity = Math.max(0, s.life)

          if (s.life <= 0) {
            sparklesRef.current.splice(i, 1)
            continue
          }

          if (s.isStar) {
            // Draw 4-point diamond star
            const r = s.size * s.life * 1.4
            ctx.save()
            ctx.beginPath()
            ctx.fillStyle = `rgba(255, 250, 230, ${s.opacity * 0.85})`
            ctx.moveTo(s.x, s.y - r)
            ctx.quadraticCurveTo(s.x, s.y, s.x + r, s.y)
            ctx.quadraticCurveTo(s.x, s.y, s.x, s.y + r)
            ctx.quadraticCurveTo(s.x, s.y, s.x - r, s.y)
            ctx.quadraticCurveTo(s.x, s.y, s.x, s.y - r)
            ctx.fill()
            ctx.restore()
          } else {
            // Draw soft gold stardust dot
            ctx.beginPath()
            ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(223, 186, 83, ${s.opacity * 0.75})`
            ctx.fill()
          }
        }
      }

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      window.removeEventListener('resize', updateCanvasSize)
      cancelAnimationFrame(animId)
    }
  }, [visible])

  if (!mounted) return null

  return (
    <div
      className={`gold-cursor-container ${visible ? 'cursor-visible' : 'cursor-hidden'} ${hovered ? 'cursor-hovered' : ''} ${clicked ? 'cursor-clicked' : ''}`}
      aria-hidden="true"
    >
      {/* Light Gold Stardust Canvas (Zero Blur, No Obstruction) */}
      <canvas ref={canvasRef} className="gold-cursor-dust-canvas" />

      {/* Cute Interactive Solitaire Gold Ring */}
      <div ref={ringRef} className="cute-gold-ring-wrapper">
        <svg
          className="cute-gold-ring-svg"
          viewBox="0 0 52 56"
          width="44"
          height="48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* 24K Royal Gold Metallic Band Gradient */}
            <linearGradient id="cuteRingBandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF9E2" />
              <stop offset="28%" stopColor="#F5D77F" />
              <stop offset="55%" stopColor="#DFBA53" />
              <stop offset="82%" stopColor="#9C751D" />
              <stop offset="100%" stopColor="#FFF2BF" />
            </linearGradient>

            {/* Solitaire Diamond Brilliant Facet Gradient */}
            <linearGradient id="solitaireGemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#F7F2E7" />
              <stop offset="80%" stopColor="#DFBA53" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>

            {/* Subtle Diamond Luster Glow */}
            <filter id="diamondGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Main Circular 24K Gold Ring Shank (Hollow, 100% Transparent Center, Zero Blur) */}
          <circle
            cx="26"
            cy="31"
            r="16.5"
            stroke="url(#cuteRingBandGrad)"
            strokeWidth="3.6"
            strokeLinecap="round"
          />

          {/* 2. Inner Chamfer Rim Highlight */}
          <circle
            cx="26"
            cy="31"
            r="14.5"
            stroke="#FFF4CC"
            strokeWidth="0.75"
            opacity="0.8"
          />

          {/* 3. Outer Rim Gleam */}
          <circle
            cx="26"
            cy="31"
            r="18.5"
            stroke="#FFFDF5"
            strokeWidth="0.6"
            opacity="0.65"
          />

          {/* 4. Gold Crown Prong Collet at Top (12 o'clock) */}
          <path
            d="M 22 17.5 L 24 13 L 28 13 L 30 17.5 Z"
            fill="url(#cuteRingBandGrad)"
            stroke="#FFE79A"
            strokeWidth="0.6"
          />

          {/* 5. Brilliant Solitaire Diamond Gem */}
          <polygon
            points="26,5 31,11 26,16.5 21,11"
            fill="url(#solitaireGemGrad)"
            stroke="#FFFFFF"
            strokeWidth="0.9"
            filter="url(#diamondGlowFilter)"
          />

          {/* 6. Diamond Facet Reflection Triangle */}
          <polygon
            points="26,6.2 29.2,11 26,14.8 22.8,11"
            fill="#FFFFFF"
            opacity="0.85"
          />

          {/* 7. Delicate Golden Prongs holding the diamond */}
          <circle cx="21" cy="11" r="1.1" fill="#FFEAA3" />
          <circle cx="31" cy="11" r="1.1" fill="#FFEAA3" />
          <circle cx="26" cy="5.2" r="1.2" fill="#FFFFFF" />

          {/* 8. Star Diamond Sparkle Reflection (Twinkles on hover) */}
          <path
            className="ring-diamond-sparkle-star"
            d="M 26 2 Q 26 5.5 29.5 5.5 Q 26 5.5 26 9 Q 26 5.5 22.5 5.5 Q 26 5.5 26 2 Z"
            fill="#FFFFFF"
            opacity="0.95"
          />
        </svg>
      </div>

      {/* Microscopic Instantaneous Center Guide Dot */}
      <div ref={dotRef} className="gold-cursor-dot" />
    </div>
  )
}
