import { useRef, useEffect } from 'react'
import './VersionBar.css'

export default function VersionBar({
  translations,
  currentTranslation,
  onSelectTranslation,
}) {
  const scrollRef = useRef(null)

  // Scroll active item smoothly into view when translation changes
  useEffect(() => {
    if (!scrollRef.current) return
    const activeEl = scrollRef.current.querySelector('.version-pill.is-active')
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [currentTranslation])

  return (
    <div className="version-bar-container">
      <div
        className="version-bar-scroll"
        ref={scrollRef}
        role="tablist"
        aria-label="Bible translations"
      >
        <button
          type="button"
          role="tab"
          aria-selected={currentTranslation === 'ALL'}
          className={`version-pill ${currentTranslation === 'ALL' ? 'is-active' : ''}`}
          onClick={() => onSelectTranslation('ALL')}
        >
          All
        </button>

        {translations.map((t) => {
          const isActive = currentTranslation === t.id
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`version-pill ${isActive ? 'is-active' : ''}`}
              onClick={() => onSelectTranslation(t.id)}
              title={t.name}
            >
              {t.short || t.id}
            </button>
          )
        })}
      </div>
    </div>
  )
}
