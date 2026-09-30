import { useEffect, useRef, useState, Fragment } from 'react'
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
  const initialRestored = useRef(false)
  const isNavigating = useRef(false)
  const [selectedVerse, setSelectedVerse] = useState(null)
  const [copied, setCopied] = useState(false)

  // Track and restore scroll position and last visible verse
  useEffect(() => {
    setSelectedVerse(null)
    setCopied(false)

    if (isNavigating.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      isNavigating.current = false
    }

    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      )
    }
  }, [book.id, chapter, translation])

  // Restore scroll position upon initial load
  useEffect(() => {
    if (!initialRestored.current && verses.length > 0) {
      const savedBookId = localStorage.getItem('my_bible_book_id')
      const savedChapter = localStorage.getItem('my_bible_chapter')
      const savedScrollY = localStorage.getItem('my_bible_scroll_y')
      const savedVerse = localStorage.getItem('my_bible_last_verse')

      if (
        savedBookId &&
        Number(savedBookId) === book.id &&
        Number(savedChapter) === Number(chapter) &&
        savedScrollY
      ) {
        const scrollYNum = Number(savedScrollY)
        if (scrollYNum > 30) {
          requestAnimationFrame(() => {
            window.scrollTo({ top: scrollYNum, behavior: 'instant' })

            if (savedVerse) {
              const targetEl = document.getElementById(`verse-${savedVerse}`)
              if (targetEl) {
                targetEl.classList.add('resumed-verse-highlight')
                setTimeout(() => {
                  targetEl.classList.remove('resumed-verse-highlight')
                }, 2500)
              }
            }
          })
        }
      }
      initialRestored.current = true
    }
  }, [verses, book.id, chapter])

  // Record scroll position and visible verse as reader scrolls
  useEffect(() => {
    let timeoutId = null

    const recordReadingPosition = () => {
      localStorage.setItem('my_bible_scroll_y', window.scrollY)
      localStorage.setItem('my_bible_book_id', book.id)
      localStorage.setItem('my_bible_chapter', chapter)
      localStorage.setItem('my_bible_book_name', book.name)

      // Identify top visible verse in viewport
      const verseElements = document.querySelectorAll('.verse-item[data-verse]')
      for (const el of verseElements) {
        const rect = el.getBoundingClientRect()
        if (rect.top >= 20 && rect.top <= 260) {
          const vNum = el.getAttribute('data-verse')
          if (vNum) {
            localStorage.setItem('my_bible_last_verse', vNum)
          }
          break
        }
      }
    }

    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(recordReadingPosition, 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('beforeunload', recordReadingPosition)
    window.addEventListener('pagehide', recordReadingPosition)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('beforeunload', recordReadingPosition)
      window.removeEventListener('pagehide', recordReadingPosition)
    }
  }, [book.id, chapter, book.name])

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

  const handlePrev = () => {
    isNavigating.current = true
    onPrevChapter()
  }

  const handleNext = () => {
    isNavigating.current = true
    onNextChapter()
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
              <Fragment key={v.pk || v.verse}>
                <span
                  id={`verse-${v.verse}`}
                  data-verse={v.verse}
                  className={`verse-item ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => handleVerseClick(v)}
                >
                  <sup className="verse-num">{v.verse}</sup>
                  <span className="verse-text">{v.text} </span>
                </span>
                {isSelected && (
                  <div className="verse-inline-actions" onClick={(e) => e.stopPropagation()}>
                    <aside
                      className="verse-action-bar"
                      role="toolbar"
                      aria-label="Verse options"
                    >
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
                  </div>
                )}
              </Fragment>
            )
          })}
        </div>
      )}

      {/* Chapter Navigation */}
      <nav className="chapter-navigation" aria-label="Chapter navigation">
        {hasPrev ? (
          <button
            type="button"
            className="nav-chapter-btn"
            onClick={handlePrev}
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
            onClick={handleNext}
          >
            <span>Next chapter</span>
            <IconArrowRight size={16} stroke={1.5} aria-hidden="true" />
          </button>
        )}
      </nav>
    </article>
  )
}
