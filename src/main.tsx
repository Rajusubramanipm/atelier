import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { ArrowUpRight, Search, X, ArrowRight, ChevronDown, Sparkles } from 'lucide-react'
import './styles.css'
import './experience.css'
import { SceneStage, ExperienceMotion } from './Experience'
import { GoldHeroSpotlight } from './GoldHeroSpotlight'
import { GoldWaveDivider } from './GoldWaveDivider'
import { AtelierMenu } from './AtelierMenu'
import { GoldCursor } from './GoldCursor'
import { PullartLogo } from './PullartLogo'

type Design = {
  id: string
  name: string
  jewelleryCategory: string
  subCategory: string
  designCategory: 'Plain Gold' | 'Studded' | 'Laser Cut' | 'God-Based'
  designMethod: 'Manual' | 'CAD'
  technique?: 'Casting' | 'Paper Casting' | 'Laser Cut'
  shortDescription: string
  image: string
}

const img = (id: string, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`

const designs: Design[] = [
  {
    id: 'aura',
    name: 'Aura Jhumka',
    jewelleryCategory: 'Earrings',
    subCategory: 'Jhumkas',
    designCategory: 'Plain Gold',
    designMethod: 'Manual',
    technique: 'Casting',
    shortDescription: 'A 24K master study in weight, rhythm and ceremonial ornamental movement.',
    image: img('photo-1617038220319-276d3cfab638'),
  },
  {
    id: 'solace',
    name: 'Solace Ring',
    jewelleryCategory: 'Rings',
    subCategory: 'Ladies Ring',
    designCategory: 'Studded',
    designMethod: 'CAD',
    shortDescription: 'A compact 22K gold composition shaped around luminous pavé brilliance.',
    image: img('photo-1605100804763-247f67b3557e'),
  },
  {
    id: 'vahana',
    name: 'Vahana Pendant',
    jewelleryCategory: 'Pendants',
    subCategory: 'God Pendant',
    designCategory: 'God-Based',
    designMethod: 'Manual',
    technique: 'Paper Casting',
    shortDescription: 'Sacred temple jewellery iconography reinterpreted through high-relief hand engraving.',
    image: img('photo-1599643478518-a784e5dc4c8f'),
  },
  {
    id: 'linea',
    name: 'Linea Bangle',
    jewelleryCategory: 'Bangles',
    subCategory: 'Flexible Bangle',
    designCategory: 'Laser Cut',
    designMethod: 'CAD',
    technique: 'Laser Cut',
    shortDescription: 'Precision 22K openwork geometry made for refractive light and fluid movement.',
    image: img('photo-1515562141207-7a88fb7ce338'),
  },
  {
    id: 'monsoon',
    name: 'Monsoon Haaram',
    jewelleryCategory: 'Haaram',
    subCategory: 'Long Haaram',
    designCategory: 'Plain Gold',
    designMethod: 'Manual',
    shortDescription: 'Layered gold cascades with quiet majesty and heritage royal presence.',
    image: img('photo-1601121141461-9d6647bca1ed'),
  },
  {
    id: 'coda',
    name: 'Coda Bracelet',
    jewelleryCategory: 'Bracelets',
    subCategory: 'Ladies Bracelet',
    designCategory: 'Studded',
    designMethod: 'CAD',
    shortDescription: 'An articulated study of structural gold mesh and diamond accents.',
    image: img('photo-1535632066927-ab7c9ab60908'),
  },
]

const taxonomy = [
  { name: 'Earrings', subs: 'Studs · Stud Drops · Jhumkas · Chandbali' },
  { name: 'Rings', subs: 'Ladies · Gents · God · Vanki · Couple' },
  { name: 'Bracelets', subs: 'Ladies · Gents' },
  { name: 'Bangles', subs: 'Round · Kada · Flexible' },
  { name: 'Pendants', subs: 'Ladies · God · Kids · Double Naka' },
  { name: 'Necklaces', subs: 'Short · Full' },
  { name: 'Mugappu', subs: 'Fancy · God' },
  { name: 'Haaram', subs: 'Short · Long' },
]

function Header({
  onSearch,
  onOpenMenu,
}: {
  onSearch: () => void
  onOpenMenu: () => void
}) {
  const links = ['About', 'Capabilities', 'Jewellery', 'Designs', 'Portfolio', 'Custom Design']

  return (
    <header>
      <a className="brand-logo-link" href="#top" title="Pullart Designs — Haute Jewellery Atelier">
        <PullartLogo size="default" />
      </a>

      <nav>
        {links.map((x) => (
          <a key={x} href={`#${x.toLowerCase().replaceAll(' ', '-')}`}>
            {x}
            {x === 'Jewellery' && <ChevronDown size={13} />}
          </a>
        ))}
      </nav>

      {/* Unified Luxury Capsule Suite for Header CTAs */}
      <div className="head-actions">
        <button
          className="head-search-btn"
          aria-label="Search designs"
          onClick={onSearch}
          title="Search Atelier Portfolio"
        >
          <Search size={16} />
        </button>

        <a className="head-enquire-btn" href="#contact">
          <span>Enquire</span>
          <div className="cta-arrow-circle">
            <ArrowUpRight size={13} />
          </div>
        </a>

        {/* Creative Menu Button (Desktop & Mobile) */}
        <button
          className="head-menu-btn"
          aria-label="Open Atelier Menu"
          onClick={onOpenMenu}
        >
          <span className="menu-btn-sparkle">✦</span>
          <span>Atelier Menu</span>
          <span className="menu-btn-live-dot" />
        </button>
      </div>
    </header>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="eyebrow">
      <span />
      {children}
    </div>
  )
}

function DesignCard({
  design,
  onClick,
}: {
  design: Design
  onClick: () => void
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.65 }}
      whileHover={{ y: -6 }}
      className="design-card"
      role="button"
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <div className="image-wrap">
        <img
          src={design.image}
          alt={`${design.name}, ${design.jewelleryCategory} design`}
          loading="lazy"
        />
        <div className="view">
          View Gold Study <ArrowUpRight size={15} />
        </div>
      </div>
      <div className="card-copy">
        <h3>{design.name}</h3>
        <p>
          {design.jewelleryCategory} · {design.designCategory}
        </p>
      </div>
    </motion.article>
  )
}

function EnquiryForm() {
  return (
    <form
      className="enquiry-form"
      onSubmit={(e) => {
        e.preventDefault()
        alert('Thank you — your bespoke enquiry has been sent to the Atelier desk.')
      }}
    >
      <div>
        <label>
          Name <b>*</b>
          <input required placeholder="Your full name" />
        </label>
        <label>
          Company / Brand
          <input placeholder="Company name (optional)" />
        </label>
      </div>
      <div>
        <label>
          Email Address <b>*</b>
          <input type="email" required placeholder="name@luxury-brand.com" />
        </label>
        <label>
          Jewellery Category
          <select defaultValue="">
            <option value="" disabled>
              Select a category
            </option>
            {taxonomy.map((t) => (
              <option key={t.name}>{t.name}</option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Design Specifications <b>*</b>
        <textarea
          required
          placeholder="Share your jewellery requirement, karat preference (24K / 22K / 18K), weight estimate, or design reference."
        />
      </label>
      <button className="gold-button">
        Submit Bespoke Request <ArrowRight size={16} />
      </button>
    </form>
  )
}

function App() {
  const [search, setSearch] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Design | null>(null)
  const [filter, setFilter] = useState('All')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const filtered = designs.filter(
    (d) =>
      (filter === 'All' || d.designCategory === filter || d.designMethod === filter) &&
      (d.name + d.jewelleryCategory + d.designCategory)
        .toLowerCase()
        .includes(query.toLowerCase())
  )

  const handleFilterSelect = (newFilter: string) => {
    setFilter(newFilter)
    const portfolioElem = document.getElementById('portfolio')
    if (portfolioElem) {
      portfolioElem.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div id="top" className={scrolled ? 'scrolled' : ''}>
      {/* Innovative Jeweller's Loupe & Liquid Gold Dust Cursor */}
      <GoldCursor />

      <ExperienceMotion />

      {/* Primary Header */}
      <Header
        onSearch={() => setSearch(true)}
        onOpenMenu={() => setMenuOpen(true)}
      />

      {/* Creative Atelier Luxury Menu Overlay */}
      <AtelierMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSelectCategory={handleFilterSelect}
      />

      <main>
        {/* ================= HERO SECTION WITH LIGHT-FOCUSED SPOTLIGHT ================= */}
        <section className="hero premium-hero">
          {/* Focused Theatrical Spotlight Gradient Background */}
          <div className="hero-ambient-lights" />

          {/* Clean Focused Light Beam & Sparse Gold Motes (Uncluttered) */}
          <GoldHeroSpotlight />

          {/* 3D Gold Jewellery Sculpture under Spotlight */}
          <SceneStage kind="hero" label="24K Sculptural Study / 001" interactive={false} />

          {/* Hero Content */}
          <div className="hero-content">
            <motion.div
              className="hero-badge-gold"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span>✦</span> PULLART DESIGNS • HAUTE GOLD JEWELLERY ATELIER
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.15 }}
            >
              The poetry<br />
              of <i>pure gold.</i>
            </motion.h1>

            {/* Harmonized Hero CTAs with Matching Proportions */}
            <div className="hero-actions-group">
              <motion.a
                className="hero-explore"
                href="#portfolio"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Explore Selected Works <ArrowUpRight size={16} />
              </motion.a>

              <motion.button
                type="button"
                className="hero-menu-cta"
                onClick={() => setMenuOpen(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
              >
                <Sparkles size={13} />
                Open Atelier Menu
              </motion.button>
            </div>
          </div>

          <a className="hero-scroll" href="#about">
            <span>DISCOVER THE ATELIER</span>
            <span>↓</span>
          </a>

          <span className="hero-edition">24K & 22K SOLID GOLD ARCHIVE</span>
        </section>

        {/* Sculpted Wave Transition into About */}
        <GoldWaveDivider />

        {/* ================= ABOUT / PHILOSOPHY ================= */}
        <section id="about" className="intro section">
          <div>
            <Eyebrow>OUR PHILOSOPHY</Eyebrow>
            <h2>
              From raw gold lines to<br />
              <i>sculptural magnificence.</i>
            </h2>
          </div>
          <div className="intro-side">
            <p>
              Jewellery design combines creativity, proportion, detailing and an understanding of
              how pure gold breathes under the artisan’s flame. Our atelier unites Manual freehand
              sketches and high-precision CAD engineering across heirloom jewellery categories and
              specialised casting techniques.
            </p>
            <a className="text-link" href="#capabilities">
              Discover Craft Capabilities <ArrowUpRight size={14} />
            </a>
          </div>
          <img
            src={img('photo-1515562141207-7a88fb7ce338')}
            alt="Gold jewellery detail in a warm studio"
            loading="lazy"
          />
        </section>

        {/* Wave Divider */}
        <GoldWaveDivider flip subtle />

        {/* ================= CAPABILITIES ================= */}
        <section id="capabilities" className="capabilities">
          <SceneStage kind="craft" label="01 / Anatomy of Gold Craft" />
          <div className="cap-intro">
            <div>
              <Eyebrow>DESIGN CAPABILITIES</Eyebrow>
              <p>Every discipline expands the horizon of precious form.</p>
            </div>
          </div>

          {[
            [
              '01',
              'Manual Drafting',
              'Craft begins with a pure line.',
              'Original jewellery concepts developed by hand, where balance, ergonomics and ceremonial detailing take shape through the master artisan’s pencil.',
            ],
            [
              '02',
              'CAD Precision Engineering',
              'Micron-level digital symmetry.',
              'Complex three-dimensional jewellery models engineered in CAD for accurate weight estimation, stone setting clearance, and flawless manufacturing.',
            ],
            [
              '03',
              'Vacuum & Centrifugal Casting',
              'Molten gold shaped for endurance.',
              'Structural hollows, spruing pathways, and wall thickness engineered to preserve structural density while maximizing surface luster.',
            ],
            [
              '04',
              'Specialised Paper Casting',
              'Tactile relief & sacred textures.',
              'Heritage artisanal methods that capture delicate temple reliefs and organic surfaces unreachable by machine alone.',
            ],
            [
              '05',
              'Laser Cut Filigree',
              'Geometric openwork & brilliance.',
              'Intricate contemporary openwork patterns laser-cut into solid gold sheets for dramatic weight-to-visual ratio.',
            ],
          ].map((c, i) => (
            <article className={`capability cap-${i}`} key={c[0]}>
              <span>{c[0]}</span>
              <div>
                <h3>{c[1]}</h3>
                <h2>{c[2]}</h2>
              </div>
              <p>{c[3]}</p>
            </article>
          ))}
        </section>

        {/* Wave Divider */}
        <GoldWaveDivider />

        {/* ================= DESIGN LANGUAGES ================= */}
        <section id="designs" className="section design-types">
          <Eyebrow>DESIGN LANGUAGES</Eyebrow>
          <h2>
            Four distinct dialects,<br />
            <i>one golden heritage.</i>
          </h2>
          <div className="type-grid">
            {[
              ['Plain Gold Jewellery', 'Pure form. Undiluted luster & weight.'],
              ['Studded Jewellery', 'Designed around pavé brilliance & prong geometry.'],
              ['Laser Cut Jewellery', 'Precision filigree becomes modern ornament.'],
              ['God-Based Jewellery', 'Sacred iconography interpreted for posterity.'],
            ].map((x, i) => {
              const catName = ['Plain Gold', 'Studded', 'Laser Cut', 'God-Based'][i]
              return (
                <a
                  href="#portfolio"
                  onClick={() => handleFilterSelect(catName)}
                  className={`type type-${i}`}
                  key={x[0]}
                >
                  <span>0{i + 1} // CHAPTER</span>
                  <div>
                    <div>
                      <h3>{x[0]}</h3>
                      <p>{x[1]}</p>
                    </div>
                    <ArrowUpRight size={22} />
                  </div>
                </a>
              )
            })}
          </div>
        </section>

        {/* Wave Divider */}
        <GoldWaveDivider flip />

        {/* ================= JEWELLERY TAXONOMIES ================= */}
        <section id="jewellery" className="jewellery-section">
          <div className="jewellery-title">
            <Eyebrow>CURATED JEWELLERY</Eyebrow>
            <h2>
              Designs for every<br />
              expression of form.
            </h2>
            <p>
              From a close-set stud to an opulent ceremonial haaram, each category possesses its
              own architectural grammar, hinge movement, and drape.
            </p>
          </div>
          <SceneStage kind="collection" label="02 / Material & Proportion" />
          <div className="category-list">
            {taxonomy.map((t, i) => (
              <a
                href="#portfolio"
                key={t.name}
                onClick={() => handleFilterSelect('All')}
              >
                <em>0{i + 1}</em>
                <strong>{t.name}</strong>
                <span>{t.subs}</span>
                <ArrowUpRight size={17} />
              </a>
            ))}
          </div>
        </section>

        {/* Wave Divider */}
        <GoldWaveDivider subtle />

        {/* ================= PORTFOLIO ================= */}
        <section id="portfolio" className="section portfolio">
          <div className="portfolio-top">
            <div>
              <Eyebrow>SELECTED WORKS</Eyebrow>
              <h2>
                A closer study of<br />
                our gold portfolio.
              </h2>
            </div>
            <p>
              Interactive archives of physical form, CAD renders, and cast golds.
              <br />
              <small>Click any piece for detailed metallurgical notes.</small>
            </p>
          </div>

          <div className="filters">
            {['All', 'Plain Gold', 'Studded', 'Laser Cut', 'God-Based', 'Manual', 'CAD'].map((x) => (
              <button
                className={filter === x ? 'active' : ''}
                onClick={() => setFilter(x)}
                key={x}
              >
                {x}
              </button>
            ))}
          </div>

          <div className="masonry">
            {filtered.map((d) => (
              <DesignCard design={d} onClick={() => setSelected(d)} key={d.id} />
            ))}
          </div>
        </section>

        {/* Wave Divider */}
        <GoldWaveDivider flip />

        {/* ================= DESIGN JOURNEY ================= */}
        <section id="journey" className="journey">
          <SceneStage kind="journey" label="03 / From Line to Volume" />
          <div>
            <Eyebrow>THE CREATIVE JOURNEY</Eyebrow>
            <h2>
              From concept<br />
              to <i>solid form.</i>
            </h2>
          </div>
          <p>
            Every commission begins with an open exchange between design inspiration, ergonomic
            testing, and computational modeling.
          </p>
          <span>
            01 — Architectural Concept Brief<br />
            02 — Hand Sketches & Proportions<br />
            03 — Digital CAD & Prototype Cast<br />
            04 — Final Hallmark & Finish
          </span>
        </section>

        {/* Wave Divider */}
        <GoldWaveDivider />

        {/* ================= CUSTOM BESPOKE ================= */}
        <section id="custom-design" className="custom">
          <SceneStage kind="custom" label="04 / Bespoke Possibilities" />
          <div className="custom-content">
            <Eyebrow>BESPOKE COMMISSIONS</Eyebrow>
            <h2>
              Have a golden design<br />
              in mind?
            </h2>
            <p>
              Share your jewellery category, karat specifications or heirloom reference with us to
              initiate a dedicated private CAD study.
            </p>
            <a href="#contact" className="button-light">
              Discuss Your Project <ArrowRight size={15} />
            </a>
          </div>
        </section>

        {/* Wave Divider */}
        <GoldWaveDivider flip subtle />

        {/* ================= CONTACT & ENQUIRY ================= */}
        <section id="contact" className="contact section">
          <div>
            <Eyebrow>COMMISSION DESK</Eyebrow>
            <h2>
              Let’s discuss your<br />
              next piece.
            </h2>
            <p>
              Whether you need CAD support for an existing manufacturing line or a bespoke bridal
              collection, begin the conversation with our design team.
            </p>
            <small>Direct replies within 24 business hours.</small>
          </div>
          <EnquiryForm />
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer>
        <div>
          <a className="brand-logo-link" href="#top" title="Pullart Designs">
            <PullartLogo size="large" />
          </a>
          <p style={{ marginTop: '16px' }}>Haute Jewellery Design Studio</p>
          <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
            24K & 22K Solid Gold • Manual & CAD Systems
          </span>
        </div>

        <div>
          <p>Artisanal Integrity</p>
          <p style={{ fontSize: '14px', fontFamily: 'Manrope', color: 'var(--text-muted)' }}>
            Bridging age-old Indian goldsmithing traditions with modern digital engineering.
          </p>
        </div>

        <div className="footer-links">
          <a href="#about">The Atelier</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#jewellery">Jewellery</a>
          <a href="#designs">Languages</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#contact">Enquire</a>
        </div>

        <p className="placeholder">
          PULLART DESIGNS COPYRIGHT © 2026. ALL RIGHTS RESERVED. HALLMARKED GOLD CRAFT ARCHIVE.
        </p>
      </footer>

      {/* ================= DESIGN DETAIL MODAL ================= */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            role="dialog"
            aria-modal="true"
          >
            <button
              aria-label="Close design detail"
              onClick={() => setSelected(null)}
            >
              <X size={20} />
            </button>
            <motion.div
              className="design-detail"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selected.image} alt={selected.name} />
              <div>
                <Eyebrow>
                  {selected.jewelleryCategory} / {selected.subCategory}
                </Eyebrow>
                <h2>{selected.name}</h2>
                <p>{selected.shortDescription}</p>
                <dl>
                  <dt>Design Category</dt>
                  <dd>{selected.designCategory}</dd>
                  <dt>Design Method</dt>
                  <dd>{selected.designMethod} Design</dd>
                  {selected.technique && (
                    <>
                      <dt>Casting Technique</dt>
                      <dd>{selected.technique}</dd>
                    </>
                  )}
                  <dt>Purity Standard</dt>
                  <dd>22K / 24K Hallmarked Solid Gold</dd>
                </dl>
                <a
                  className="gold-button"
                  href="#contact"
                  onClick={() => setSelected(null)}
                >
                  Enquire About This Design <ArrowRight size={16} />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= SEARCH OVERLAY ================= */}
      <AnimatePresence>
        {search && (
          <motion.div
            className="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setSearch(false)}
              aria-label="Close search"
            >
              <X size={20} />
            </button>
            <div>
              <Eyebrow>SEARCH THE PULLART GOLD ARCHIVE</Eyebrow>
              <input
                autoFocus
                placeholder="Search by name, category, or casting method…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="search-results">
                {designs
                  .filter((d) =>
                    (d.name + d.jewelleryCategory + d.designCategory)
                      .toLowerCase()
                      .includes(query.toLowerCase())
                  )
                  .map((d) => (
                    <button
                      key={d.id}
                      onClick={() => {
                        setSearch(false)
                        setSelected(d)
                      }}
                    >
                      <img src={d.image} alt={d.name} />
                      <span>
                        {d.name}
                        <small>
                          {d.jewelleryCategory} · {d.designCategory}
                        </small>
                      </span>
                      <ArrowUpRight size={18} />
                    </button>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <MotionConfig reducedMotion="user">
    <App />
  </MotionConfig>
)
