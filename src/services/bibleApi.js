import { get, set } from 'idb-keyval'

/**
 * Strips HTML tags and excessive whitespace from verse text
 */
function cleanVerseText(text) {
  if (!text) return ''
  return text
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/\[\d+\]/g, '')  // remove footnote markers like [1]
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Fetches a chapter from Bolls Bible API with IndexedDB caching
 */
export async function getChapter(translation, bookId, chapter) {
  const cacheKey = `chapter_${translation}_${bookId}_${chapter}`

  try {
    const cached = await get(cacheKey)
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return cached
    }
  } catch {
    // If IndexedDB fails, continue to network fetch
  }

  const url = `https://bolls.life/get-chapter/${translation}/${bookId}/${chapter}/`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Unable to load chapter at this time.')
  }

  const rawVerses = await res.json()
  const cleanedVerses = rawVerses.map((item) => ({
    pk: item.pk,
    verse: item.verse,
    text: cleanVerseText(item.text),
  }))

  try {
    await set(cacheKey, cleanedVerses)
  } catch {
    // Cache write error is non-fatal
  }

  return cleanedVerses
}

/**
 * Fetches a single verse across multiple translations for comparison
 */
export async function getVerseComparisons(bookId, chapter, verseNumber, translationList = ['ESV', 'NIV', 'KJV', 'WEB', 'NLT']) {
  const results = await Promise.allSettled(
    translationList.map(async (trans) => {
      const verses = await getChapter(trans, bookId, chapter)
      const targetVerse = verses.find((v) => Number(v.verse) === Number(verseNumber))
      return {
        translation: trans,
        text: targetVerse ? targetVerse.text : '',
      }
    })
  )

  return results
    .filter((r) => r.status === 'fulfilled' && r.value.text)
    .map((r) => r.value)
}
