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
  // Scaling factors
  const width = size === 'large' ? 240 : size === 'compact' ? 140 : 185
  const height = size === 'large' ? 68 : size === 'compact' ? 40 : 52

  return (
    <div className={`pullart-creative-brand size-${size} ${className}`}>
      <svg
        viewBox="0 0 280 82"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="pullart-logo-svg"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <defs>
          {/* Luminous 24K Royal Gold Gradient */}
          <linearGradient id="auroraGoldGrad" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#FFF7D6" />
            <stop offset="22%" stopColor="#F5D882" />
            <stop offset="50%" stopColor="#DFBA53" />
            <stop offset="78%" stopColor="#B8861B" />
            <stop offset="100%" stopColor="#7E5607" />
          </linearGradient>

          {/* Accent Diamond Sparkle Gradient */}
          <linearGradient id="auroraSparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#FFF8D9" />
            <stop offset="75%" stopColor="#DFBA53" />
            <stop offset="100%" stopColor="#A87515" />
          </linearGradient>

          {/* Soft Gold Ambient Glow */}
          <filter id="auroraGlow" x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ------------------------------------------------------------------
            TYPOGRAPHIC WORDMARK: "Pullart" in High-Fashion Editorial Serif
            Inspired by the reference image's organic ligatures and luxury curves
            ------------------------------------------------------------------ */}
        <g fill="url(#auroraGoldGrad)" className="logo-letterforms">
          {/* ====== 'P' ====== */}
          {/* Elegant hairline arch loop on the left */}
          <path
            d="M20 54 C13 54 9 44 14 30 C17 21 24 16 33 16 C34 16 34.5 16.2 35 16.5 L35 18 C28 18 19 23 16.5 32 C14 41 16 52 23 52 L26 52 L26 54 Z"
          />
          {/* Main bold stem of P with flared base */}
          <path
            d="M24 16 L35 16 L35 54 L24 54 Z"
          />
          {/* P loop / bowl with fine contrast */}
          <path
            d="M34 16 C47 16 58 22 58 32 C58 43 46 48 34 48 L34 44 C43 44 51 40 51 32 C51 24 42 20 34 20 Z"
          />

          {/* ====== 'u' ====== */}
          {/* Left upright */}
          <path
            d="M66 28 L73 28 L73 45 C73 48 76 50 81 50 C86 50 89 47 89 42 L89 28 L96 28 L96 43 C96 50 90 54 81 54 C72 54 66 49 66 42 Z"
          />

          {/* ====== First 'l' ====== */}
          {/* Tall architectural stem with high-fashion terminal */}
          <path
            d="M104 16 L111 16 L111 50 C111 52 113 54 117 54 L117 55.5 L104 55.5 C104 53 104 50 104 46 Z"
          />

          {/* ====== Second 'l' ====== */}
          <path
            d="M123 16 L130 16 L130 50 C130 52 132 54 136 54 L136 55.5 L123 55.5 C123 53 123 50 123 46 Z"
          />

          {/* ====== 'a' ====== */}
          {/* Teardrop curved bowl */}
          <path
            d="M144 41 C144 33 151 27 160 27 C169 27 175 33 175 42 L175 54 L168 54 L168 50 C165 53 161 54.5 156 54.5 C148 54.5 143 50 143 43 C143 36 150 32 168 31.5 L168 30.5 C168 28 165 26 160 26 C155 26 151 28 150 31 Z M168 37 C155 37.5 150 40 150 43.5 C150 46.5 153 49 158 49 C164 49 168 45 168 40 Z"
          />

          {/* ====== 'r' ====== */}
          {/* Upright and delicate rounded branch */}
          <path
            d="M184 28 L191 28 L191 33 C193 29 198 27 204 27 L204 34 C198 34 191 36 191 43 L191 54 L184 54 Z"
          />

          {/* ====== 't' ====== */}
          {/* Crossbar and curved foot */}
          <path
            d="M211 21 L217 21 L217 28 L227 28 L227 33 L217 33 L217 48 C217 51 219 52.5 223 52.5 C225 52.5 227 52 229 51 L229 55 C226 55.5 223 56 220 56 C213 56 210 52 210 46 L210 33 L206 33 L206 28 L210 28 L210 21 Z"
          />
        </g>

        {/* ------------------------------------------------------------------
            THE SIGNATURE JEWELLERY DIAMOND STAR (As seen on the reference 'O')
            Perched gracefully on the crest of the letter 'P'
            ------------------------------------------------------------------ */}
        <g className="aurora-signature-star" filter="url(#auroraGlow)">
          {/* 4-Point Concave Diamond Star */}
          <path
            d="M48 10 C48 14 52 18 56 18 C52 18 48 22 48 26 C48 22 44 18 40 18 C44 18 48 14 48 10 Z"
            fill="url(#auroraSparkleGrad)"
          />
          {/* Center pure white brilliant facet */}
          <circle cx="48" cy="18" r="1.3" fill="#FFFFFF" />
        </g>

        {/* ------------------------------------------------------------------
            BOTTOM SUB-BAR: "— ✦ — DESIGNS — ✦ —"
            Echoing the fine horizontal divider and diamond star from reference
            ------------------------------------------------------------------ */}
        {showTagline && (
          <g className="aurora-tagline-group">
            {/* Left thin hairline rule */}
            <line
              x1="32"
              y1="72"
              x2="85"
              y2="72"
              stroke="url(#auroraGoldGrad)"
              strokeWidth="0.75"
              opacity="0.65"
            />

            {/* Left accent 4-point diamond star */}
            <path
              d="M93 68.5 C93 70.5 94.5 72 96.5 72 C94.5 72 93 73.5 93 75.5 C93 73.5 91.5 72 89.5 72 C91.5 72 93 70.5 93 68.5 Z"
              fill="url(#auroraSparkleGrad)"
            />

            {/* Centered DESIGNS in high-fashion micro tracking */}
            <text
              x="138"
              y="74.5"
              textAnchor="middle"
              fontFamily="'Manrope', -apple-system, sans-serif"
              fontSize="7"
              fontWeight="600"
              letterSpacing="0.44em"
              fill="url(#auroraGoldGrad)"
              className="designs-caption-text"
            >
              DESIGNS
            </text>

            {/* Right accent 4-point diamond star */}
            <path
              d="M183 68.5 C183 70.5 184.5 72 186.5 72 C184.5 72 183 73.5 183 75.5 C183 73.5 181.5 72 179.5 72 C181.5 72 183 70.5 183 68.5 Z"
              fill="url(#auroraSparkleGrad)"
            />

            {/* Right thin hairline rule */}
            <line
              x1="191"
              y1="72"
              x2="244"
              y2="72"
              stroke="url(#auroraGoldGrad)"
              strokeWidth="0.75"
              opacity="0.65"
            />
          </g>
        )}
      </svg>
    </div>
  )
}
