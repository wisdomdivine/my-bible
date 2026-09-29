const CACHE_NAME = 'my-bible-cache-v1'

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/favicon.svg',
  '/logo.svg',
  '/logo-light.svg',
  '/logo-dark.svg',
  '/fonts/signifier-light.woff2',
  '/fonts/signifier-regular.woff2',
  '/fonts/signifier-medium.woff2',
  '/fonts/founders-grotesk-regular.otf',
  '/fonts/founders-grotesk-medium.otf',
  '/fonts/neue-haas-grotesk-300.ttf',
  '/fonts/neue-haas-grotesk-400.ttf',
  '/fonts/neue-haas-grotesk-400-italic.ttf',
  '/fonts/neue-haas-grotesk-500.ttf',
  '/fonts/neue-haas-grotesk-700.ttf',
  '/fonts/neue-haas-grotesk-900.ttf',
  // Pre-seed core scripture chapters in ESV
  'https://bolls.life/get-chapter/ESV/1/1/',
  'https://bolls.life/get-chapter/ESV/19/23/',
  'https://bolls.life/get-chapter/ESV/43/1/',
  'https://bolls.life/get-chapter/ESV/43/3/',
]

// Install event: Pre-cache app shell and core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return Promise.allSettled(
          PRECACHE_ASSETS.map((url) =>
            fetch(url).then((response) => {
              if (response.ok) {
                return cache.put(url, response)
              }
            })
          )
        )
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event: Clean up old cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch event: Cache-first with network fallback and background refresh
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // SPA navigation fallback: serve index.html when offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/index.html')
      })
    )
    return
  }

  // Handle Bible API requests (Cache-first for offline reading)
  if (url.origin === 'https://bolls.life') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        // Fetch fresh copy in the background if network is available
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              const clone = networkResponse.clone()
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, clone)
              })
            }
            return networkResponse
          })
          .catch(() => cachedResponse)

        // Return cached version immediately if available, otherwise wait for network
        return cachedResponse || fetchPromise
      })
    )
    return
  }

  // Static assets (CSS, JS, Fonts, Images)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(request).then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (url.origin === self.location.origin || url.pathname.includes('/fonts/'))
        ) {
          const clone = networkResponse.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone)
          })
        }
        return networkResponse
      })
    })
  )
})
