import { bibleBooks } from '../data/bibleBooks'
import Logo from './Logo'
import './Sitelinks.css'

export default function Sitelinks({
  onSelectPassage,
  onOpenBookPicker,
  onOpenTranslationPicker,
  onOpenSearch,
  onOpenSaved,
}) {
  const handleJump = (bookName, chapterNum) => {
    const foundBook = bibleBooks.find(
      (b) => b.name.toLowerCase() === bookName.toLowerCase()
    )
    if (foundBook) {
      onSelectPassage(foundBook, chapterNum)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="sitelinks-footer" aria-label="Site directory and links">
      <div className="sitelinks-grid">
        {/* Column 1: Old Testament */}
        <div className="sitelinks-column">
          <span className="sitelinks-heading">Old Testament</span>
          <nav className="sitelinks-nav" aria-label="Old Testament books">
            <button
              type="button"
              className="sitelink-btn"
              onClick={() => handleJump('Genesis', 1)}
            >
              Genesis
            </button>
            <button
              type="button"
              className="sitelink-btn"
              onClick={() => handleJump('Exodus', 1)}
            >
              Exodus
            </button>
            <button
              type="button"
              className="sitelink-btn"
              onClick={() => handleJump('Psalms', 23)}
            >
              Psalms
            </button>
            <button
              type="button"
              className="sitelink-btn"
              onClick={() => handleJump('Proverbs', 3)}
            >
              Proverbs
            </button>
            <button
              type="button"
              className="sitelink-btn"
              onClick={() => handleJump('Isaiah', 40)}
            >
              Isaiah
            </button>
            <button
              type="button"
              className="sitelink-btn-subtle"
              onClick={onOpenBookPicker}
            >
              All 39 books
            </button>
          </nav>
        </div>

        {/* Column 2: New Testament */}
        <div className="sitelinks-column">
          <span className="sitelinks-heading">New Testament</span>
          <nav className="sitelinks-nav" aria-label="New Testament books">
            <button
              type="button"
              className="sitelink-btn"
              onClick={() => handleJump('Matthew', 5)}
            >
              Matthew
            </button>
            <button
              type="button"
              className="sitelink-btn"
              onClick={() => handleJump('John', 3)}
            >
              John
            </button>
            <button
              type="button"
              className="sitelink-btn"
              onClick={() => handleJump('Romans', 8)}
            >
              Romans
            </button>
            <button
              type="button"
              className="sitelink-btn"
              onClick={() => handleJump('1 Corinthians', 13)}
            >
              1 Corinthians
            </button>
            <button
              type="button"
              className="sitelink-btn"
              onClick={() => handleJump('Revelation', 21)}
            >
              Revelation
            </button>
            <button
              type="button"
              className="sitelink-btn-subtle"
              onClick={onOpenBookPicker}
            >
              All 27 books
            </button>
          </nav>
        </div>

        {/* Column 3: Reading Tools */}
        <div className="sitelinks-column">
          <span className="sitelinks-heading">Reading tools</span>
          <nav className="sitelinks-nav" aria-label="Reading tools">
            <button
              type="button"
              className="sitelink-btn"
              onClick={onOpenTranslationPicker}
            >
              Translations
            </button>
            <button
              type="button"
              className="sitelink-btn"
              onClick={onOpenSearch}
            >
              Jump to passage
            </button>
            <button
              type="button"
              className="sitelink-btn"
              onClick={onOpenSaved}
            >
              Saved verses
            </button>
            <button
              type="button"
              className="sitelink-btn"
              onClick={onOpenBookPicker}
            >
              Book directory
            </button>
            <button
              type="button"
              className="sitelink-btn-subtle"
              onClick={handleScrollTop}
            >
              Back to top
            </button>
          </nav>
        </div>
      </div>

      {/* Quiet Brand & Note */}
      <div className="sitelinks-brand-bar">
        <div className="sitelinks-brand">
          <Logo size={20} />
          <span className="sitelinks-brand-text">Bible</span>
        </div>
        <p className="sitelinks-summary">
          A quiet, distraction free reading environment for the Holy Scriptures.
        </p>
      </div>
    </footer>
  )
}
