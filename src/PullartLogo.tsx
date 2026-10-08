import React from 'react'

interface PullartLogoProps {
  size?: 'compact' | 'default' | 'large'
  className?: string
  showTagline?: boolean
}

export function PullartLogo({
  size = 'default',
  className = '',
  showTagline = true,
}: PullartLogoProps) {
  return (
    <div className={`pullart-brand-logo size-${size} ${className}`}>
      {/* Minimalist Haute Jewellery Solitaire Diamond Hallmark */}
      <div className="pullart-jewel-hallmark">
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="jewel-hallmark-svg"
        >
          <defs>
            <linearGradient id="logoGoldGradIcon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF9DC" />
              <stop offset="35%" stopColor="#F5D77F" />
              <stop offset="70%" stopColor="#DFBA53" />
              <stop offset="100%" stopColor="#946B0E" />
            </linearGradient>
            <filter id="logoGoldGlowIcon" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer fine hallmark circle with 4 prong ticks */}
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke="url(#logoGoldGradIcon)"
            strokeWidth="1.2"
            opacity="0.6"
          />
          {/* Cardinal prongs */}
          <circle cx="16" cy="2" r="1.2" fill="#FFF8D6" />
          <circle cx="30" cy="16" r="1.2" fill="#FFF8D6" />
          <circle cx="16" cy="30" r="1.2" fill="#FFF8D6" />
          <circle cx="2" cy="16" r="1.2" fill="#FFF8D6" />

          {/* Central 24K Solid Gold Hallmark Crest */}
          <path
            d="M16 5 L17.8 12.5 L24 10 L19.5 14.8 L27 16 L19.5 17.2 L24 22 L17.8 19.5 L16 27 L14.2 19.5 L8 22 L12.5 17.2 L5 16 L12.5 14.8 L8 10 L14.2 12.5 Z"
            fill="url(#logoGoldGradIcon)"
            filter="url(#logoGoldGlowIcon)"
          />
          {/* Central solid gold hallmark core */}
          <circle cx="16" cy="16" r="2.2" fill="url(#logoGoldGradIcon)" stroke="#FFEAA8" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Crystal-Clear Premium Typography */}
      <div className="pullart-wordmark-wrap">
        <span className="pullart-wordmark-title">PULLART</span>
        {showTagline && (
          <span className="pullart-wordmark-sub">
            <span className="sub-sparkle">✦</span> DESIGNS <span className="sub-sparkle">✦</span>
          </span>
        )}
      </div>
    </div>
  )
}
