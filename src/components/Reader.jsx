import { useEffect, useRef, useState } from 'react'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import gsap from 'gsap'
import './Reader.css'

export default function Reader({
  book,
  chapter,
  translation,
  verses,
  isLoading,
  error,
  onRetry,
  onPrevChapter,
  onNextChapter,
  hasPrev,
  hasNext,
  onCompareVerse,
  onSaveVerse,
  isVerseSaved,
}) {
  const containerRef = useRef(null)
  const [selectedVerse, setSelectedVerse] = useState(null)
  const [copied, setCopied] = useState(false)

  // Reset selected verse and fade-in smoothly when book or chapter changes
  useEffect(() => {
    setSelectedVerse(null)
    setCopied(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      )
    }
  }, [book.id, chapter, translation])

  const handleVerseClick = (v) => {
    if (selectedVerse?.verse === v.verse) {
      setSelectedVerse(null)
    } else {
      setSelectedVerse(v)
      setCopied(false)
    }
  }

  const handleCopy = () => {
    if (!selectedVerse) return
    const textToCopy = `"${selectedVerse.text}" (${book.name} ${chapter}:${selectedVerse.verse} ${translation})`
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  const handleToggleSave = () => {
    if (!selectedVerse) return
    onSaveVerse({
      bookId: book.id,
      bookName: book.name,
      chapter: Number(chapter),
      verse: Number(selectedVerse.verse),
      text: selectedVerse.text,
      translation,
    })
  }

  const isCurrentSaved =
    selectedVerse &&
    isVerseSaved(book.id, Number(chapter), Number(selectedVerse.verse))

  return (
    <article className="reader-wrapper" ref={containerRef}>
      <header className="chapter-header">
        <h1 className="chapter-book-title">{book.name}</h1>
        <span className="chapter-number-display">{chapter}</span>
      </header>

      {isLoading && (
        <div className="reader-status-message">
          <p className="status-text">Loading scripture...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="reader-status-message">
          <p className="status-text">{error}</p>
          <button type="button" className="retry-btn" onClick={onRetry}>
            Try again
          </button>
        </div>
      )}

      {!isLoading && !error && verses.length > 0 && (
        <div className="verses-body">
          {verses.map((v) => {
            const isSelected = selectedVerse?.verse === v.verse
            return (
              <span
                key={v.pk || v.verse}
                className={`verse-item ${isSelected ? 'is-selected' : ''}`}
                onClick={() => handleVerseClick(v)}
              >
                <sup className="verse-num">{v.verse}</sup>
                <span className="verse-text">{v.text} </span>
              </span>
            )
          })}
        </div>
      )}

      {/* Floating Selected Verse Action Pill */}
      {selectedVerse && (
        <aside className="verse-action-bar" role="toolbar" aria-label="Verse options">
          <div className="action-bar-content">
            <span className="action-reference">
              {book.name} {chapter}:{selectedVerse.verse}
            </span>

            <div className="action-buttons-group">
              <button
                type="button"
                className="action-btn"
                onClick={handleCopy}
              >
                {copied ? 'Copied' : 'Copy'}
              </button>

              <button
                type="button"
                className="action-btn"
                onClick={handleToggleSave}
              >
                {isCurrentSaved ? 'Saved' : 'Save'}
              </button>

              <button
                type="button"
                className="action-btn"
                onClick={() => onCompareVerse(selectedVerse)}
              >
                Compare
              </button>

              <button
                type="button"
                className="action-btn-quiet"
                onClick={() => setSelectedVerse(null)}
              >
                Close
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Chapter Navigation */}
      <nav className="chapter-navigation" aria-label="Chapter navigation">
        {hasPrev ? (
          <button
            type="button"
            className="nav-chapter-btn"
            onClick={onPrevChapter}
          >
            <IconArrowLeft size={16} stroke={1.5} aria-hidden="true" />
            <span>Previous chapter</span>
          </button>
        ) : (
          <span />
        )}

        {hasNext && (
          <button
            type="button"
            className="nav-chapter-btn"
            onClick={onNextChapter}
          >
            <span>Next chapter</span>
            <IconArrowRight size={16} stroke={1.5} aria-hidden="true" />
          </button>
        )}
      </nav>
    </article>
  )
}
