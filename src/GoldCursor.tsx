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
}

export function GoldCursor() {
  const [mounted, setMounted] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [hoveredText, setHoveredText] = useState('')
  const [clicked, setClicked] = useState(false)
  const [visible, setVisible] = useState(false)

  const mousePos = useRef({ x: -100, y: -100 })
  const trailingPos = useRef({ x: -100, y: -100 })
  const sparklesRef = useRef<Sparkle[]>([])
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const dotRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Check if device has a fine pointer (mouse/trackpad), not touch
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    if (!isFinePointer) return
    setMounted(true)

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX
      mousePos.current.y = e.clientY
      if (!visible) setVisible(true)

      // Emit gold stardust sparkles on movement
      if (Math.random() < 0.35) {
        sparklesRef.current.push({
          id: Math.random(),
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          size: Math.random() * 2.8 + 1,
          opacity: 0.9,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8 - 0.3,
          life: 1,
        })
      }

      // Check hovered interactive elements
      const target = e.target as HTMLElement | null
      if (target) {
        const interactiveEl = target.closest('a, button, [role="button"], input, select, textarea, .type, .design-card, .scene-stage')
        if (interactiveEl) {
          setHovered(true)
          if (interactiveEl.classList.contains('design-card')) {
            setHoveredText('VIEW')
          } else if (interactiveEl.classList.contains('scene-stage')) {
            setHoveredText('3D')
          } else {
            setHoveredText('')
          }
        } else {
          setHovered(false)
          setHoveredText('')
        }
      }
    }

    const handleMouseDown = () => {
      setClicked(true)
      // Burst of sparkles on click
      for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * Math.PI * 2
        const speed = Math.random() * 2 + 1.2
        sparklesRef.current.push({
          id: Math.random(),
          x: mousePos.current.x,
          y: mousePos.current.y,
          size: Math.random() * 3 + 1.5,
          opacity: 1,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
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

    // Animation loop for smooth spring physics and stardust canvas
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
      const factor = 0.18
      trailingPos.current.x += (mousePos.current.x - trailingPos.current.x) * factor
      trailingPos.current.y += (mousePos.current.y - trailingPos.current.y) * factor

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${trailingPos.current.x}px, ${trailingPos.current.y}px, 0)`
      }

      // Render gold stardust particles
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        for (let i = sparklesRef.current.length - 1; i >= 0; i--) {
          const s = sparklesRef.current[i]
          s.x += s.vx
          s.y += s.vy
          s.life -= 0.03
          s.opacity = Math.max(0, s.life)

          if (s.life <= 0) {
            sparklesRef.current.splice(i, 1)
            continue
          }

          ctx.save()
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 235, 150, ${s.opacity * 0.85})`
          ctx.shadowColor = 'rgba(223, 186, 83, 0.9)'
          ctx.shadowBlur = 8
          ctx.fill()

          // Tiny diamond cross sparkle
          if (s.size > 2) {
            ctx.strokeStyle = `rgba(255, 248, 220, ${s.opacity})`
            ctx.lineWidth = 0.75
            ctx.beginPath()
            ctx.moveTo(s.x - s.size * 1.5, s.y)
            ctx.lineTo(s.x + s.size * 1.5, s.y)
            ctx.moveTo(s.x, s.y - s.size * 1.5)
            ctx.lineTo(s.x, s.y + s.size * 1.5)
            ctx.stroke()
          }
          ctx.restore()
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
      {/* Golden Stardust Canvas */}
      <canvas
        ref={canvasRef}
        className="gold-cursor-dust-canvas"
      />

      {/* Trailing Jeweller's Loupe Ring */}
      <div
        ref={ringRef}
        className="gold-cursor-loupe"
      >
        <div className="loupe-inner-glint" />
        {hoveredText && <span className="loupe-text">{hoveredText}</span>}
      </div>

      {/* Immediate Precision Gem Facet Dot */}
      <div
        ref={dotRef}
        className="gold-cursor-dot"
      >
        <span className="dot-sparkle">✦</span>
      </div>
    </div>
  )
}
