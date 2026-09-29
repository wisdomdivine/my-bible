import './SavedModal.css'

export default function SavedModal({
  isOpen,
  onClose,
  savedVerses,
  onSelectSaved,
  onRemoveSaved,
}) {
  if (!isOpen) return null

  return (
    <div className="saved-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="saved-container" onClick={(e) => e.stopPropagation()}>
        <div className="saved-header">
          <span className="saved-title">Saved verses</span>
          <button type="button" className="saved-close-btn" onClick={onClose}>
            Close
          </button>
        </div>

        {savedVerses.length === 0 ? (
          <div className="saved-empty-state">
            <p className="saved-empty-text">
              No saved verses yet. While reading, select any verse to save it here for later.
            </p>
          </div>
        ) : (
          <div className="saved-list">
            {savedVerses.map((item) => (
              <article key={`${item.bookId}-${item.chapter}-${item.verse}`} className="saved-card">
                <div
                  className="saved-content"
                  onClick={() => {
                    onSelectSaved(item)
                    onClose()
                  }}
                >
                  <span className="saved-reference">
                    {item.bookName} {item.chapter}:{item.verse}
                  </span>
                  <p className="saved-verse-quote">"{item.text}"</p>
                  <span className="saved-translation-tag">{item.translation}</span>
                </div>

                <div className="saved-actions">
                  <button
                    type="button"
                    className="saved-remove-btn"
                    onClick={() => onRemoveSaved(item)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
