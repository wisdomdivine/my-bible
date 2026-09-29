import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import Reader from './components/Reader'
import BookPickerModal from './components/BookPickerModal'
import TranslationPickerModal from './components/TranslationPickerModal'
import SearchModal from './components/SearchModal'
import SavedModal from './components/SavedModal'
import CompareModal from './components/CompareModal'
import { bibleBooks, getBookById } from './data/bibleBooks'
import { defaultTranslation } from './data/translations'
import { getChapter } from './services/bibleApi'
import './App.css'

export default function App() {
  // Current passage and translation state (persisted)
  const [currentBook, setCurrentBook] = useState(() => {
    const savedBookId = localStorage.getItem('my_bible_book_id')
    return savedBookId ? getBookById(savedBookId) : bibleBooks[0] // Genesis
  })

  const [currentChapter, setCurrentChapter] = useState(() => {
    const savedChap = localStorage.getItem('my_bible_chapter')
    return savedChap ? Number(savedChap) : 1
  })

  const [currentTranslation, setCurrentTranslation] = useState(() => {
    return localStorage.getItem('my_bible_translation') || defaultTranslation
  })

  // Chapter content and loading
  const [verses, setVerses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Modals state
  const [isBookPickerOpen, setIsBookPickerOpen] = useState(false)
  const [isTranslationPickerOpen, setIsTranslationPickerOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSavedOpen, setIsSavedOpen] = useState(false)
  const [comparingVerse, setComparingVerse] = useState(null)

  // Saved verses state
  const [savedVerses, setSavedVerses] = useState(() => {
    try {
      const data = localStorage.getItem('my_bible_saved_verses')
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  })

  // Persist navigation and saved verses
  useEffect(() => {
    localStorage.setItem('my_bible_book_id', currentBook.id)
    localStorage.setItem('my_bible_chapter', currentChapter)
  }, [currentBook.id, currentChapter])

  useEffect(() => {
    localStorage.setItem('my_bible_translation', currentTranslation)
  }, [currentTranslation])

  useEffect(() => {
    try {
      localStorage.setItem('my_bible_saved_verses', JSON.stringify(savedVerses))
    } catch {
      // storage quota or error
    }
  }, [savedVerses])

  // Fetch chapter text
  const loadChapter = useCallback(async (bookId, chapterNum, translationId) => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getChapter(translationId, bookId, chapterNum)
      setVerses(data)
      setIsLoading(false)
    } catch {
      setError('Unable to load this chapter right now. Please check your connection.')
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadChapter(currentBook.id, currentChapter, currentTranslation)
  }, [currentBook.id, currentChapter, currentTranslation, loadChapter])

  // Previous Chapter Navigation
  const handlePrevChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter((prev) => prev - 1)
    } else {
      const currentIndex = bibleBooks.findIndex((b) => b.id === currentBook.id)
      if (currentIndex > 0) {
        const prevBook = bibleBooks[currentIndex - 1]
        setCurrentBook(prevBook)
        setCurrentChapter(prevBook.chapters)
      }
    }
  }

  // Next Chapter Navigation
  const handleNextChapter = () => {
    if (currentChapter < currentBook.chapters) {
      setCurrentChapter((prev) => prev + 1)
    } else {
      const currentIndex = bibleBooks.findIndex((b) => b.id === currentBook.id)
      if (currentIndex < bibleBooks.length - 1) {
        const nextBook = bibleBooks[currentIndex + 1]
        setCurrentBook(nextBook)
        setCurrentChapter(1)
      }
    }
  }

  const hasPrev =
    currentChapter > 1 || bibleBooks.findIndex((b) => b.id === currentBook.id) > 0

  const hasNext =
    currentChapter < currentBook.chapters ||
    bibleBooks.findIndex((b) => b.id === currentBook.id) < bibleBooks.length - 1

  // Handle direct passage selection
  const handleSelectPassage = (book, chapterNum) => {
    setCurrentBook(book)
    setCurrentChapter(Number(chapterNum))
  }

  // Saved verses handling
  const isVerseSaved = (bookId, chapterNum, verseNum) => {
    return savedVerses.some(
      (v) =>
        v.bookId === bookId &&
        Number(v.chapter) === Number(chapterNum) &&
        Number(v.verse) === Number(verseNum)
    )
  }

  const handleToggleSaveVerse = (verseObj) => {
    setSavedVerses((prev) => {
      const exists = prev.some(
        (v) =>
          v.bookId === verseObj.bookId &&
          v.chapter === verseObj.chapter &&
          v.verse === verseObj.verse
      )
      if (exists) {
        return prev.filter(
          (v) =>
            !(
              v.bookId === verseObj.bookId &&
              v.chapter === verseObj.chapter &&
              v.verse === verseObj.verse
            )
        )
      }
      return [verseObj, ...prev]
    })
  }

  const handleRemoveSaved = (verseObj) => {
    setSavedVerses((prev) =>
      prev.filter(
        (v) =>
          !(
            v.bookId === verseObj.bookId &&
            v.chapter === verseObj.chapter &&
            v.verse === verseObj.verse
          )
      )
    )
  }

  const handleSelectSaved = (savedItem) => {
    const book = getBookById(savedItem.bookId)
    setCurrentBook(book)
    setCurrentChapter(savedItem.chapter)
  }

  return (
    <div className="app-container">
      <Header
        currentBook={currentBook}
        currentChapter={currentChapter}
        currentTranslation={currentTranslation}
        onOpenBookPicker={() => setIsBookPickerOpen(true)}
        onOpenTranslationPicker={() => setIsTranslationPickerOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSaved={() => setIsSavedOpen(true)}
        savedCount={savedVerses.length}
      />

      <main className="app-main">
        <Reader
          book={currentBook}
          chapter={currentChapter}
          translation={currentTranslation}
          verses={verses}
          isLoading={isLoading}
          error={error}
          onRetry={() => loadChapter(currentBook.id, currentChapter, currentTranslation)}
          onPrevChapter={handlePrevChapter}
          onNextChapter={handleNextChapter}
          hasPrev={hasPrev}
          hasNext={hasNext}
          onCompareVerse={(v) => setComparingVerse(v)}
          onSaveVerse={handleToggleSaveVerse}
          isVerseSaved={isVerseSaved}
        />
      </main>

      {/* Book and Chapter Picker */}
      <BookPickerModal
        isOpen={isBookPickerOpen}
        onClose={() => setIsBookPickerOpen(false)}
        currentBook={currentBook}
        currentChapter={currentChapter}
        onSelectPassage={handleSelectPassage}
      />

      {/* Translation Picker */}
      <TranslationPickerModal
        isOpen={isTranslationPickerOpen}
        onClose={() => setIsTranslationPickerOpen(false)}
        currentTranslation={currentTranslation}
        onSelectTranslation={(trans) => setCurrentTranslation(trans)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectPassage={handleSelectPassage}
      />

      {/* Saved Verses Modal */}
      <SavedModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        savedVerses={savedVerses}
        onSelectSaved={handleSelectSaved}
        onRemoveSaved={handleRemoveSaved}
      />

      {/* Compare Translations Modal */}
      <CompareModal
        isOpen={Boolean(comparingVerse)}
        onClose={() => setComparingVerse(null)}
        book={currentBook}
        chapter={currentChapter}
        verse={comparingVerse}
      />
    </div>
  )
}
