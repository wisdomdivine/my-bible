import { useState, useMemo } from 'react'
import { bibleBooks, findBookByName } from '../data/bibleBooks'
import './SearchModal.css'

const SUGGESTIONS = [
  { bookName: 'Psalms', chapter: 23, description: 'The Lord is my shepherd' },
  { bookName: 'John', chapter: 1, description: 'In the beginning was the Word' },
  { bookName: 'Romans', chapter: 8, description: 'Life in the Spirit' },
  { bookName: '1 Corinthians', chapter: 13, description: 'The way of love' },
  { bookName: 'Isaiah', chapter: 40, description: 'Comfort my people' },
  { bookName: 'Matthew', chapter: 5, description: 'The Beatitudes' },
]

export default function SearchModal({
  isOpen,
  onClose,
  onSelectPassage,
}) {
  const [query, setQuery] = useState('')

  // Parse natural queries like "John 3", "1 Cor 13", "Gen 1"
  const parsedResult = useMemo(() => {
    const raw = query.trim()
    if (!raw) return null

    const match = raw.match(/^((?:\d\s*)?[a-zA-Z\s]+?)\s*(\d+)?$/)
    if (!match) return null

    const bookPart = match[1].trim()
    const chapterPart = match[2] ? Number(match[2]) : 1

    const foundBook = findBookByName(bookPart)
    if (!foundBook) return null

    const safeChapter = Math.min(Math.max(1, chapterPart), foundBook.chapters)
    return { book: foundBook, chapter: safeChapter }
  }, [query])

  // Also match book names
  const matchingBooks = useMemo(() => {
    const raw = query.trim().toLowerCase()
    if (!raw) return []
    return bibleBooks.filter((b) => b.name.toLowerCase().includes(raw)).slice(0, 6)
  }, [query])

  if (!isOpen) return null

  const handleSelect = (book, chapter) => {
    onSelectPassage(book, chapter)
    setQuery('')
    onClose()
  }

  return (
    <div className="search-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="search-container" onClick={(e) => e.stopPropagation()}>
        <div className="search-header">
          <span className="search-title">Jump to passage</span>
          <button type="button" className="search-close-btn" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Type a passage, like John 3 or Psalm 23..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input-field"
            autoFocus
          />
        </div>

        {parsedResult && (
          <div className="direct-match-section">
            <button
              type="button"
              className="direct-match-btn"
              onClick={() => handleSelect(parsedResult.book, parsedResult.chapter)}
            >
              <span className="match-title">
                Go to {parsedResult.book.name} {parsedResult.chapter}
              </span>
              <span className="match-sub">{parsedResult.book.testament}</span>
            </button>
          </div>
        )}

        {query.trim() && matchingBooks.length > 0 && !parsedResult && (
          <div className="matching-books-section">
            <span className="section-label">Books</span>
            <div className="matching-books-list">
              {matchingBooks.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className="match-book-item"
                  onClick={() => handleSelect(b, 1)}
                >
                  <span className="match-book-name">{b.name}</span>
                  <span className="match-book-chap">{b.chapters} chapters</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {!query.trim() && (
          <div className="suggestions-section">
            <span className="section-label">Suggested chapters</span>
            <div className="suggestions-list">
              {SUGGESTIONS.map((item) => {
                const book = bibleBooks.find((b) => b.name === item.bookName)
                if (!book) return null
                return (
                  <button
                    key={`${item.bookName}-${item.chapter}`}
                    type="button"
                    className="suggestion-item"
                    onClick={() => handleSelect(book, item.chapter)}
                  >
                    <span className="suggestion-ref">
                      {item.bookName} {item.chapter}
                    </span>
                    <span className="suggestion-desc">{item.description}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
