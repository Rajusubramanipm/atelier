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
  // Dimensions based on size
  const iconSize = size === 'large' ? 44 : size === 'compact' ? 28 : 34

  return (
    <div className={`pullart-brand-logo size-${size} ${className}`}>
      {/* Precision Haute Jewellery Hallmark Emblem */}
      <div className="pullart-emblem-wrap" style={{ width: iconSize, height: iconSize }}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="pullart-emblem-svg"
        >
          <defs>
            {/* 24K Royal Gold Gradient */}
            <linearGradient id="pullartGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF8D6" />
              <stop offset="28%" stopColor="#F5D77F" />
              <stop offset="55%" stopColor="#DFBA53" />
              <stop offset="82%" stopColor="#B38318" />
              <stop offset="100%" stopColor="#755006" />
            </linearGradient>

            {/* Inner Gem Facet Highlight Gradient */}
            <linearGradient id="gemFacetGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#AA7A1C" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#FFF2B8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#E3BC50" stopOpacity="0.6" />
            </linearGradient>

            {/* Subtle Gold Aura Glow */}
            <filter id="goldAuraGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Outer Precious Bezel Ring with 8 Alignment Prongs */}
          <circle
            cx="50"
            cy="50"
            r="44"
            stroke="url(#pullartGoldGrad)"
            strokeWidth="1.5"
            strokeDasharray="2 3"
            opacity="0.55"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="url(#pullartGoldGrad)"
            strokeWidth="2"
            filter="url(#goldAuraGlow)"
          />

          {/* 4 Cardinal Diamond Prongs */}
          <circle cx="50" cy="10" r="2.2" fill="#FFF6D1" />
          <circle cx="90" cy="50" r="2.2" fill="#FFF6D1" />
          <circle cx="50" cy="90" r="2.2" fill="#FFF6D1" />
          <circle cx="10" cy="50" r="2.2" fill="#FFF6D1" />

          {/* 2. Architectural Sculpted "P" shaped as a Marquise Jewel Setting & Infinity Flow */}
          {/* Main Stem of "P" - stylized solid gold column with bevel */}
          <path
            d="M34 26 L34 74"
            stroke="url(#pullartGoldGrad)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Base hallmark pedestal line */}
          <path
            d="M27 74 L41 74"
            stroke="url(#pullartGoldGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Top serif flag */}
          <path
            d="M27 26 L37 26"
            stroke="url(#pullartGoldGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Loop of "P" shaped as a Faceted Marquise Gemstone setting */}
          <path
            d="M34 26 C48 26 68 31 68 44 C68 57 48 62 34 62"
            stroke="url(#pullartGoldGrad)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Internal Geometric Facet Lines (CAD & Diamond Cut Symmetry) */}
          <path
            d="M34 44 L68 44"
            stroke="url(#gemFacetGrad)"
            strokeWidth="1.5"
            strokeDasharray="1 2"
          />
          <path
            d="M48 27 L60 44 L48 61 L36 44 Z"
            stroke="url(#gemFacetGrad)"
            strokeWidth="1.5"
            fill="rgba(255, 235, 160, 0.08)"
          />

          {/* 3. Central Radiance Sparkle (Brilliant Cut Diamond Glint) */}
          <g className="emblem-center-sparkle">
            <path
              d="M50 36 L52.5 44 L60.5 44 L54 48.5 L56.5 56.5 L50 51.5 L43.5 56.5 L46 48.5 L39.5 44 L47.5 44 Z"
              fill="url(#pullartGoldGrad)"
              opacity="0.95"
            />
            <circle cx="50" cy="45" r="1.8" fill="#FFFFFF" />
          </g>

          {/* Tiny accent diamond pip */}
          <circle cx="72" cy="28" r="1.5" fill="#FFF2B2" />
        </svg>
      </div>

      {/* Haute Jewellery Wordmark */}
      <div className="pullart-wordmark-group">
        <span className="pullart-name">
          PULLART<span className="name-dot">.</span>
        </span>
        {showTagline && (
          <span className="pullart-tagline">
            <span className="tag-sparkle">✦</span> DESIGNS <span className="tag-sparkle">✦</span>
          </span>
        )}
      </div>
    </div>
  )
}
