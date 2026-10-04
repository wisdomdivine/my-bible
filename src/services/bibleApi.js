import { get, set } from 'idb-keyval'
import { getBookById } from '../data/bibleBooks'

/**
 * Strips HTML tags, Strong's concordance numbers, footnotes, and artifacts from verse text
 */
export function cleanVerseText(text) {
  if (!text) return ''
  return text
    // Remove Strong's concordance numbers and tags (e.g. <S>7225</S>, <S>430</S>)
    .replace(/<S>[^<]*<\/S>/gi, '')
    // Remove footnote/marginal notes tags and contents (e.g. <sup>Heb. ...</sup>)
    .replace(/<sup>[\s\S]*?<\/sup>/gi, '')
    .replace(/<f>[\s\S]*?<\/f>/gi, '')
    .replace(/<x>[\s\S]*?<\/x>/gi, '')
    // Remove pilcrow paragraph marks and section markers
    .replace(/[¶§]/g, '')
    // Keep text content of inline formatting tags like <i>...</i>
    .replace(/<i\b[^>]*>([\s\S]*?)<\/i>/gi, '$1')
    // Remove remaining HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove footnote markers like [1], [a]
    .replace(/\[\w+\]/g, '')
    // Remove zero-width characters and invisible control codes
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // Normalize newlines, carriage returns, and excessive spaces
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Fetches from bible-api.com (pristine public-domain text without Strong's numbers)
 */
async function fetchFromBibleApi(bookName, chapter, translation) {
  const transCode = translation.toLowerCase()
  const query = `${encodeURIComponent(bookName)}+${chapter}`
  const url = `https://bible-api.com/${query}?translation=${transCode}`

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`bible-api.com request failed with status ${res.status}`)
  }

  const data = await res.json()
  if (!data.verses || !Array.isArray(data.verses) || data.verses.length === 0) {
    throw new Error('No verses returned from bible-api.com')
  }

  return data.verses.map((item) => ({
    pk: `${translation}_${bookName}_${chapter}_${item.verse}`,
    verse: item.verse,
    text: cleanVerseText(item.text),
  }))
}

/**
 * Fetches a chapter with multi-source fallback and IndexedDB caching
 */
export async function getChapter(translation, bookId, chapter) {
  const cacheKey = `v3_clean_chapter_${translation}_${bookId}_${chapter}`

  try {
    const cached = await get(cacheKey)
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return cached
    }
  } catch {
    // If IndexedDB fails, continue to network fetch
  }

  const book = getBookById(bookId)
  const bookName = book?.name || 'Genesis'

  // For public domain versions supported by bible-api.com, try it first for 100% clean text
  const bibleApiTranslations = ['KJV', 'WEB', 'ASV', 'BBE', 'DARBY']
  if (bibleApiTranslations.includes(translation.toUpperCase())) {
    try {
      const verses = await fetchFromBibleApi(bookName, chapter, translation)
      if (verses && verses.length > 0) {
        try {
          await set(cacheKey, verses)
        } catch {
          // Cache write error is non-fatal
        }
        return verses
      }
    } catch {
      // Fallback to Bolls Bible API if bible-api.com is unreachable
    }
  }

  // Primary/fallback: Bolls Life Bible API with comprehensive text cleaning
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

/**
 * Fetches all available translations for an entire chapter
 */
export async function getAllTranslationsForChapter(
  bookId,
  chapter,
  translationList = ['ESV', 'NIV', 'KJV', 'WEB', 'NLT', 'CSB17', 'NASB', 'BSB', 'NKJV', 'AMP']
) {
  const results = {}

  for (const tid of translationList) {
    try {
      const data = await getChapter(tid, bookId, chapter)
      if (data && data.length > 0) {
        results[tid] = data
      }
    } catch {
      // Continue to next translation if one fails
    }
    await new Promise((r) => setTimeout(r, 120))
  }

  return results
}

