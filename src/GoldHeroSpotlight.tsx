import React, { useEffect, useRef } from 'react'

export function GoldHeroSpotlight() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth)
    let height = (canvas.height = canvas.offsetHeight || window.innerHeight)
    let time = 0

    const mouse = {
      x: width * 0.65,
      y: height * 0.45,
      targetX: width * 0.65,
      targetY: height * 0.45,
    }

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth || window.innerWidth
      height = canvas.height = canvas.offsetHeight || window.innerHeight
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.targetX = e.clientX - rect.left
      mouse.targetY = e.clientY - rect.top
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Tiny ethereal floating ambient gold motes (very subtle & sparse)
    const motes = Array.from({ length: 18 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speedY: Math.random() * 0.3 + 0.1,
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }))

    const render = () => {
      time += 0.015

      // Smooth lag for lighting focus
      mouse.x += (mouse.targetX - mouse.x) * 0.04
      mouse.y += (mouse.targetY - mouse.y) * 0.04

      ctx.clearRect(0, 0, width, height)

      // 1. Primary Theatrical Gold Spotlight on the 3D Sculpture Area (right side)
      const spotlightX = width * 0.66 + Math.sin(time * 0.5) * 20
      const spotlightY = height * 0.42 + Math.cos(time * 0.6) * 15
      const spotlightRadius = Math.max(width, height) * 0.52

      const mainSpotlight = ctx.createRadialGradient(
        spotlightX,
        spotlightY,
        40,
        spotlightX,
        spotlightY,
        spotlightRadius
      )
      mainSpotlight.addColorStop(0, 'rgba(235, 195, 95, 0.22)')
      mainSpotlight.addColorStop(0.35, 'rgba(212, 168, 55, 0.11)')
      mainSpotlight.addColorStop(0.7, 'rgba(120, 85, 20, 0.04)')
      mainSpotlight.addColorStop(1, 'rgba(10, 8, 5, 0)')

      ctx.fillStyle = mainSpotlight
      ctx.fillRect(0, 0, width, height)

      // 2. Focused Subtle Mouse Ambient Follower
      const mouseAura = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        10,
        mouse.x,
        mouse.y,
        width * 0.38
      )
      mouseAura.addColorStop(0, 'rgba(255, 225, 130, 0.08)')
      mouseAura.addColorStop(0.5, 'rgba(190, 140, 35, 0.03)')
      mouseAura.addColorStop(1, 'rgba(10, 8, 5, 0)')

      ctx.fillStyle = mouseAura
      ctx.fillRect(0, 0, width, height)

      // 3. Very Soft Golden Light Beam Angled across the banner
      ctx.save()
      const beamGrad = ctx.createLinearGradient(width * 0.85, 0, width * 0.35, height)
      beamGrad.addColorStop(0, 'rgba(255, 230, 140, 0.07)')
      beamGrad.addColorStop(0.4, 'rgba(223, 186, 83, 0.03)')
      beamGrad.addColorStop(0.8, 'rgba(180, 130, 20, 0.005)')
      beamGrad.addColorStop(1, 'transparent')

      ctx.fillStyle = beamGrad
      ctx.beginPath()
      ctx.moveTo(width * 0.4, 0)
      ctx.lineTo(width, 0)
      ctx.lineTo(width, height * 0.85)
      ctx.lineTo(width * 0.15, height)
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      // 4. Subtle Floating Gold Dust Motes
      motes.forEach((m) => {
        m.y -= m.speedY
        m.x += m.speedX + Math.sin(time + m.phase) * 0.15
        if (m.y < -10) {
          m.y = height + 10
          m.x = Math.random() * width
        }

        const pulse = 0.5 + Math.sin(time * 2 + m.phase) * 0.5
        ctx.beginPath()
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 235, 160, ${m.opacity * pulse * 0.6})`
        ctx.shadowColor = 'rgba(223, 186, 83, 0.8)'
        ctx.shadowBlur = 6
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
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="hero-spotlight-canvas"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        display: 'block',
        zIndex: 1,
      }}
    />
  )
}
