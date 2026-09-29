import { useState, useMemo } from 'react'
import { bibleBooks } from '../data/bibleBooks'
import './BookPickerModal.css'

export default function BookPickerModal({
  isOpen,
  onClose,
  currentBook,
  currentChapter,
  onSelectPassage,
}) {
  const [selectedBook, setSelectedBook] = useState(null)
  const [searchFilter, setSearchFilter] = useState('')

  const activeBook = selectedBook || currentBook

  const filteredBooks = useMemo(() => {
    if (!searchFilter.trim()) return bibleBooks
    const q = searchFilter.toLowerCase().trim()
    return bibleBooks.filter((b) => b.name.toLowerCase().includes(q))
  }, [searchFilter])

  const oldTestament = useMemo(
    () => filteredBooks.filter((b) => b.testament === 'Old Testament'),
    [filteredBooks]
  )

  const newTestament = useMemo(
    () => filteredBooks.filter((b) => b.testament === 'New Testament'),
    [filteredBooks]
  )

  if (!isOpen) return null

  const handleSelectChapter = (chap) => {
    onSelectPassage(activeBook, chap)
    setSelectedBook(null)
    setSearchFilter('')
    onClose()
  }

  const handleBackToBooks = () => {
    setSelectedBook(null)
  }

  return (
    <div className="picker-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="picker-container" onClick={(e) => e.stopPropagation()}>
        <div className="picker-header">
          {selectedBook ? (
            <button
              type="button"
              className="picker-back-btn"
              onClick={handleBackToBooks}
            >
              All books
            </button>
          ) : (
            <span className="picker-title">Books of the Bible</span>
          )}

          <button type="button" className="picker-close-btn" onClick={onClose}>
            Close
          </button>
        </div>

        {selectedBook ? (
          <div className="chapters-view">
            <h2 className="chapters-book-name">{selectedBook.name}</h2>
            <p className="chapters-prompt">Select a chapter</p>

            <div className="chapters-grid">
              {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((chap) => {
                const isCurrent =
                  selectedBook.id === currentBook.id && chap === Number(currentChapter)
                return (
                  <button
                    key={chap}
                    type="button"
                    className={`chapter-btn ${isCurrent ? 'is-active' : ''}`}
                    onClick={() => handleSelectChapter(chap)}
                  >
                    {chap}
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="books-view">
            <div className="picker-search-bar">
              <input
                type="text"
                placeholder="Find a book..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="picker-search-input"
                autoFocus
              />
            </div>

            <div className="testaments-columns">
              <div className="testament-group">
                <h3 className="testament-heading">Old Testament</h3>
                <div className="books-list">
                  {oldTestament.map((book) => {
                    const isSelected = book.id === currentBook.id
                    return (
                      <button
                        key={book.id}
                        type="button"
                        className={`book-btn ${isSelected ? 'is-active' : ''}`}
                        onClick={() => setSelectedBook(book)}
                      >
                        <span className="book-name-text">{book.name}</span>
                        <span className="book-chapters-text">{book.chapters}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="testament-group">
                <h3 className="testament-heading">New Testament</h3>
                <div className="books-list">
                  {newTestament.map((book) => {
                    const isSelected = book.id === currentBook.id
                    return (
                      <button
                        key={book.id}
                        type="button"
                        className={`book-btn ${isSelected ? 'is-active' : ''}`}
                        onClick={() => setSelectedBook(book)}
                      >
                        <span className="book-name-text">{book.name}</span>
                        <span className="book-chapters-text">{book.chapters}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
