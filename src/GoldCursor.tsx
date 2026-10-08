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
  const [clicked, setClicked] = useState(false)
  const [visible, setVisible] = useState(false)

  const mousePos = useRef({ x: -100, y: -100 })
  const trailingPos = useRef({ x: -100, y: -100 })
  const sparklesRef = useRef<Sparkle[]>([])
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const dotRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Only enable for precision mouse pointers, not touch devices
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    if (!isFinePointer) return
    setMounted(true)

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX
      mousePos.current.y = e.clientY
      if (!visible) setVisible(true)

      // Minimal, subtle stardust particles on movement
      if (Math.random() < 0.22) {
        sparklesRef.current.push({
          id: Math.random(),
          x: e.clientX + (Math.random() - 0.5) * 6,
          y: e.clientY + (Math.random() - 0.5) * 6,
          size: Math.random() * 2 + 0.8,
          opacity: 0.85,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5 - 0.2,
          life: 1,
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
      // Delicate gold sparkle burst on click
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2
        const speed = Math.random() * 1.8 + 0.8
        sparklesRef.current.push({
          id: Math.random(),
          x: mousePos.current.x,
          y: mousePos.current.y,
          size: Math.random() * 2.2 + 1,
          opacity: 0.95,
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

    // Animation loop for smooth trailing ring
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
      const factor = 0.2
      trailingPos.current.x += (mousePos.current.x - trailingPos.current.x) * factor
      trailingPos.current.y += (mousePos.current.y - trailingPos.current.y) * factor

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${trailingPos.current.x}px, ${trailingPos.current.y}px, 0)`
      }

      // Render subtle stardust particles (zero blur on background)
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        for (let i = sparklesRef.current.length - 1; i >= 0; i--) {
          const s = sparklesRef.current[i]
          s.x += s.vx
          s.y += s.vy
          s.life -= 0.035
          s.opacity = Math.max(0, s.life)

          if (s.life <= 0) {
            sparklesRef.current.splice(i, 1)
            continue
          }

          ctx.beginPath()
          ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 238, 160, ${s.opacity * 0.75})`
          ctx.fill()
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
      {/* Light Gold Stardust Canvas (Zero Blur) */}
      <canvas ref={canvasRef} className="gold-cursor-dust-canvas" />

      {/* Trailing Minimalist Gold Ring (Completely Transparent, No Blur, No Text) */}
      <div ref={ringRef} className="gold-cursor-ring" />

      {/* Instantaneous Center Gold Diamond Tip */}
      <div ref={dotRef} className="gold-cursor-dot" />
    </div>
  )
}
