import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, ArrowRight, X, Sparkles, Gem, Compass, ShieldCheck } from 'lucide-react'
import { GoldWaveCanvas } from './GoldWaveCanvas'

interface AtelierMenuProps {
  isOpen: boolean
  onClose: () => void
  onSelectCategory?: (category: string) => void
}

interface NavItem {
  num: string
  label: string
  subtitle: string
  href: string
  previewImg: string
  highlight?: string
}

const navItems: NavItem[] = [
  {
    num: '01',
    label: 'The Atelier',
    subtitle: 'Philosophy, heritage & artisanal vision',
    href: '#about',
    previewImg: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    highlight: 'Handcrafted Heritage',
  },
  {
    num: '02',
    label: 'Craft Capabilities',
    subtitle: 'Manual drafting, CAD precision & casting',
    href: '#capabilities',
    previewImg: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    highlight: '5 Distinct Disciplines',
  },
  {
    num: '03',
    label: 'Design Languages',
    subtitle: 'Plain Gold, Studded, Laser Cut & Sacred',
    href: '#designs',
    previewImg: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    highlight: '4 Design Languages',
  },
  {
    num: '04',
    label: 'Curated Jewellery',
    subtitle: 'Rings, Jhumkas, Bangles, Haaram & Pendants',
    href: '#jewellery',
    previewImg: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=800&q=80',
    highlight: '8 Core Taxonomies',
  },
  {
    num: '05',
    label: 'Haute Portfolio',
    subtitle: 'Interactive 3D showcase of selected masterworks',
    href: '#portfolio',
    previewImg: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80',
    highlight: '24K & 22K Masterpieces',
  },
  {
    num: '06',
    label: 'Design Journey',
    subtitle: 'From initial sketch to volumetric perfection',
    href: '#journey',
    previewImg: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    highlight: '4 Phase Pipeline',
  },
  {
    num: '07',
    label: 'Bespoke Studio',
    subtitle: 'Custom CAD commissions & bridal heirlooms',
    href: '#custom-design',
    previewImg: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    highlight: 'Private Commissions',
  },
  {
    num: '08',
    label: 'Private Concierge',
    subtitle: 'Enquire & reserve design consultation',
    href: '#contact',
    previewImg: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    highlight: 'Direct Atelier Desk',
  },
]

const quickCategories = ['Plain Gold', 'Studded', 'Laser Cut', 'God-Based']
const quickPieces = ['Earrings', 'Rings', 'Bangles', 'Pendants', 'Haaram', 'Necklaces']

export function AtelierMenu({ isOpen, onClose, onSelectCategory }: AtelierMenuProps) {
  const [activeItem, setActiveItem] = useState<NavItem>(navItems[0])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const handleLinkClick = (href: string) => {
    onClose()
    const target = document.querySelector(href)
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth' })
      }, 250)
    }
  }

  const handleCategoryClick = (cat: string) => {
    if (onSelectCategory) onSelectCategory(cat)
    handleLinkClick('#portfolio')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="atelier-menu-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="Atelier Navigation Menu"
        >
          {/* Ambient Liquid Gold Waves in Menu Background */}
          <div className="menu-wave-backdrop">
            <GoldWaveCanvas waveCount={3} speed={0.8} opacity={0.35} interactive={true} />
            <div className="menu-mesh-gradient" />
          </div>

          {/* Top Bar */}
          <div className="menu-topbar">
            <div className="menu-brand">
              <span className="gold-sparkle-icon">✦</span>
              <span className="wordmark">ATELIER <i>Ø</i></span>
              <span className="menu-hallmark-badge">
                <ShieldCheck size={13} /> 916 & 999 Fine Gold Atelier
              </span>
            </div>

            <button
              className="menu-close-btn"
              onClick={onClose}
              aria-label="Close atelier menu"
            >
              <span className="close-label">CLOSE</span>
              <span className="close-icon-wrapper">
                <X size={18} />
              </span>
            </button>
          </div>

          {/* Main Menu Body */}
          <div className="menu-body-grid">
            {/* Left Nav List */}
            <motion.div
              className="menu-nav-column"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05, delayChildren: 0.1 },
                },
              }}
            >
              <div className="menu-nav-eyebrow">
                <span>INDEX OF CHAPTERS</span>
                <em>SELECT DESTINATION</em>
              </div>

              <nav className="menu-links-list">
                {navItems.map((item) => {
                  const isActive = activeItem.num === item.num
                  return (
                    <motion.a
                      key={item.num}
                      href={item.href}
                      className={`menu-link-row ${isActive ? 'active-row' : ''}`}
                      onMouseEnter={() => setActiveItem(item)}
                      onClick={(e) => {
                        e.preventDefault()
                        handleLinkClick(item.href)
                      }}
                      variants={{
                        hidden: { opacity: 0, x: -28 },
                        visible: {
                          opacity: 1,
                          x: 0,
                          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                        },
                      }}
                    >
                      <div className="menu-link-left">
                        <span className="menu-link-num">{item.num}</span>
                        <div className="menu-link-text">
                          <span className="menu-link-title">{item.label}</span>
                          <span className="menu-link-sub">{item.subtitle}</span>
                        </div>
                      </div>

                      <div className="menu-link-right">
                        <span className="menu-link-pill">{item.highlight}</span>
                        <div className="menu-link-arrow">
                          <ArrowRight size={17} />
                        </div>
                      </div>
                    </motion.a>
                  )
                })}
              </nav>
            </motion.div>

            {/* Right Preview & Quick Actions Panel */}
            <motion.div
              className="menu-preview-column"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Dynamic Image Preview of Hovered Chapter */}
              <div className="menu-preview-card">
                <div className="preview-image-container">
                  <img
                    src={activeItem.previewImg}
                    alt={activeItem.label}
                    key={activeItem.num}
                    className="preview-img-dynamic"
                  />
                  <div className="preview-card-overlay">
                    <span className="preview-tag">FEATURED CHAPTER</span>
                    <h3>{activeItem.label}</h3>
                    <p>{activeItem.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Quick Categories Bar */}
              <div className="menu-quick-drawer">
                <div className="drawer-section">
                  <span className="drawer-title">
                    <Sparkles size={12} /> EXPLORE BY DESIGN LANGUAGE
                  </span>
                  <div className="drawer-pills">
                    {quickCategories.map((cat) => (
                      <button
                        key={cat}
                        className="quick-pill-btn"
                        onClick={() => handleCategoryClick(cat)}
                      >
                        {cat}
                        <ArrowUpRight size={11} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="drawer-section">
                  <span className="drawer-title">
                    <Gem size={12} /> POPULAR JEWELLERY
                  </span>
                  <div className="drawer-tags">
                    {quickPieces.map((piece) => (
                      <button
                        key={piece}
                        className="quick-tag-btn"
                        onClick={() => handleLinkClick('#jewellery')}
                      >
                        {piece}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Concierge Shortcut */}
                <div className="menu-concierge-box">
                  <div className="concierge-copy">
                    <strong>BESPOKE COMMISSIONS OPEN</strong>
                    <span>Manual sketches & high-precision CAD models</span>
                  </div>
                  <button
                    className="menu-gold-cta"
                    onClick={() => handleLinkClick('#contact')}
                  >
                    Discuss Design <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Ribbon */}
          <div className="menu-footer-bar">
            <span>© ATELIER Ø — FINE GOLD JEWELLERY DESIGN ARCHIVE</span>
            <span>CRAFTED IN 24K & 22K SOLID GOLD PHILOSOPHY</span>
            <div className="menu-quick-shortcuts">
              <a href="#about" onClick={() => handleLinkClick('#about')}>About</a>
              <a href="#portfolio" onClick={() => handleLinkClick('#portfolio')}>Portfolio</a>
              <a href="#contact" onClick={() => handleLinkClick('#contact')}>Enquire</a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
