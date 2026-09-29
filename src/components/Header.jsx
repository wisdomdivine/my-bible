import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import './Header.css'

export default function Header({
  currentBook,
  currentChapter,
  currentTranslation,
  onOpenBookPicker,
  onOpenTranslationPicker,
  onOpenSearch,
  onOpenSaved,
  savedCount = 0,
}) {
  return (
    <header className="site-header">
      {/* Brand Section */}
      <div className="header-brand-section">
        <div className="brand-group">
          <Logo size={24} />
          <span className="brand-name">Bible</span>
        </div>
      </div>

      {/* Passage & Translation Selectors */}
      <div className="header-passage-section">
        <button
          type="button"
          className="nav-action-pill passage-pill"
          onClick={onOpenBookPicker}
          aria-label="Select book and chapter"
        >
          <span className="passage-label">
            {currentBook.name} {currentChapter}
          </span>
        </button>

        <button
          type="button"
          className="nav-action-pill translation-pill"
          onClick={onOpenTranslationPicker}
          aria-label="Select translation"
        >
          <span className="translation-label">{currentTranslation}</span>
        </button>
      </div>

      {/* Actions & Utilities Section */}
      <div className="header-actions-section">
        <button
          type="button"
          className="nav-text-btn"
          onClick={onOpenSearch}
        >
          Search
        </button>

        <button
          type="button"
          className="nav-text-btn"
          onClick={onOpenSaved}
        >
          Saved {savedCount > 0 ? `(${savedCount})` : ''}
        </button>

        <ThemeToggle />
      </div>
    </header>
  )
}
