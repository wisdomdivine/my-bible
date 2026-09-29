import { useState, useEffect } from 'react'
import { getVerseComparisons } from '../services/bibleApi'
import './CompareModal.css'

export default function CompareModal({
  isOpen,
  onClose,
  book,
  chapter,
  verse,
}) {
  const [comparisons, setComparisons] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen || !verse) return

    let isMounted = true
    setLoading(true)
    setComparisons([])

    getVerseComparisons(book.id, chapter, verse.verse, ['ESV', 'NIV', 'KJV', 'WEB', 'NLT'])
      .then((data) => {
        if (isMounted) {
          setComparisons(data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [isOpen, book.id, chapter, verse])

  if (!isOpen || !verse) return null

  return (
    <div className="compare-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="compare-container" onClick={(e) => e.stopPropagation()}>
        <div className="compare-header">
          <span className="compare-title">
            {book.name} {chapter}:{verse.verse}
          </span>
          <button type="button" className="compare-close-btn" onClick={onClose}>
            Close
          </button>
        </div>

        <p className="compare-intro">
          Comparing across translations
        </p>

        {loading && (
          <div className="compare-loading">
            <p className="compare-loading-text">Fetching translations...</p>
          </div>
        )}

        {!loading && (
          <div className="compare-list">
            {comparisons.map((item) => (
              <div key={item.translation} className="compare-item">
                <span className="compare-trans-tag">{item.translation}</span>
                <p className="compare-verse-text">{item.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
