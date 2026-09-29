import { translations } from '../data/translations'
import './TranslationPickerModal.css'

export default function TranslationPickerModal({
  isOpen,
  onClose,
  currentTranslation,
  onSelectTranslation,
}) {
  if (!isOpen) return null

  const handleSelect = (transId) => {
    onSelectTranslation(transId)
    onClose()
  }

  return (
    <div className="trans-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="trans-container" onClick={(e) => e.stopPropagation()}>
        <div className="trans-header">
          <span className="trans-title">Translations</span>
          <button type="button" className="trans-close-btn" onClick={onClose}>
            Close
          </button>
        </div>

        <p className="trans-intro">
          Choose a translation to explore scripture from different perspectives.
        </p>

        <div className="trans-list">
          {translations.map((trans) => {
            const isSelected = trans.id === currentTranslation
            return (
              <button
                key={trans.id}
                type="button"
                className={`trans-item-btn ${isSelected ? 'is-active' : ''}`}
                onClick={() => handleSelect(trans.id)}
              >
                <div className="trans-info">
                  <span className="trans-name">{trans.name}</span>
                  <span className="trans-short">{trans.short}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
