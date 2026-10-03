import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import './BottomNav.css'

export default function BottomNav({
  book,
  chapter,
  onPrevChapter,
  onNextChapter,
  hasPrev,
  hasNext,
  onOpenBookPicker,
}) {
  return (
    <nav className="bottom-nav-bar" aria-label="Chapter navigation">
      <div className="bottom-nav-inner">
        <div className="bottom-nav-side bottom-nav-left">
          {hasPrev ? (
            <button
              type="button"
              className="bottom-nav-btn"
              onClick={onPrevChapter}
              aria-label="Previous chapter"
            >
              <IconArrowLeft size={16} stroke={1.5} aria-hidden="true" />
              <span className="nav-btn-text-full">Previous chapter</span>
              <span className="nav-btn-text-short">Previous</span>
            </button>
          ) : (
            <div className="bottom-nav-placeholder" aria-hidden="true" />
          )}
        </div>

        <div className="bottom-nav-center">
          <button
            type="button"
            className="bottom-nav-center-btn"
            onClick={onOpenBookPicker}
            aria-label={`Current passage ${book.name} ${chapter}. Choose chapter.`}
          >
            <span className="bottom-nav-passage">
              {book.name} {chapter}
            </span>
          </button>
        </div>

        <div className="bottom-nav-side bottom-nav-right">
          {hasNext ? (
            <button
              type="button"
              className="bottom-nav-btn"
              onClick={onNextChapter}
              aria-label="Next chapter"
            >
              <span className="nav-btn-text-full">Next chapter</span>
              <span className="nav-btn-text-short">Next</span>
              <IconArrowRight size={16} stroke={1.5} aria-hidden="true" />
            </button>
          ) : (
            <div className="bottom-nav-placeholder" aria-hidden="true" />
          )}
        </div>
      </div>
    </nav>
  )
}
