import React from 'react'

interface GoldWaveDividerProps {
  flip?: boolean
  subtle?: boolean
  className?: string
}

export function GoldWaveDivider({ flip = false, subtle = false, className = '' }: GoldWaveDividerProps) {
  return (
    <div
      className={`gold-wave-divider ${flip ? 'flipped' : ''} ${className}`}
      aria-hidden="true"
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        lineHeight: 0,
        zIndex: 2,
        transform: flip ? 'rotate(180deg)' : 'none',
        pointerEvents: 'none',
      }}
    >
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{
          display: 'block',
          width: '100%',
          height: subtle ? '48px' : '72px',
        }}
      >
        <defs>
          <linearGradient id={`goldGradPrimary-${flip ? 'f' : 'n'}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#AA771C" stopOpacity="0.3" />
            <stop offset="25%" stopColor="#D4AF37" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#FFF2B2" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#E3BC50" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#8A5C0E" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id={`goldGradBack-${flip ? 'f' : 'n'}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#734B0B" stopOpacity="0.15" />
            <stop offset="45%" stopColor="#B8860B" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#523506" stopOpacity="0.15" />
          </linearGradient>
          <filter id={`goldGlow-${flip ? 'f' : 'n'}`} x="-10%" y="-20%" width="120%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Deep background undulating wave */}
        <path
          d="M0,45 C280,95 480,10 720,55 C960,100 1200,20 1440,65 L1440,120 L0,120 Z"
          fill={`url(#goldGradBack-${flip ? 'f' : 'n'})`}
        />

        {/* Foreground sculpted wave */}
        <path
          d="M0,75 C320,15 560,95 840,40 C1120,-15 1280,85 1440,50 L1440,120 L0,120 Z"
          fill="rgba(14, 12, 8, 0.95)"
        />

        {/* Luminous molten gold wave crest line */}
        <path
          d="M0,75 C320,15 560,95 840,40 C1120,-15 1280,85 1440,50"
          stroke={`url(#goldGradPrimary-${flip ? 'f' : 'n'})`}
          strokeWidth="2.5"
          filter={`url(#goldGlow-${flip ? 'f' : 'n'})`}
        />

        {/* Subtle accent ripple */}
        <path
          d="M0,60 C360,110 680,20 1020,70 C1240,105 1380,35 1440,55"
          stroke="rgba(255, 235, 170, 0.4)"
          strokeWidth="1.2"
          strokeDasharray="4 6"
        />
      </svg>
    </div>
  )
}
