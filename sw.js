// sw.js - Service Worker for offline support
const CACHE_VERSION = '2026-02-02-001'; // Update on each deploy
const CACHE_NAME = `portfolio-${CACHE_VERSION}`;
const urlsToCache = [
    '/',
    '/portfolio/',
    '/portfolio/index.html',
    '/portfolio/privacy.html',
    '/portfolio/styles/global.css',
    '/portfolio/styles/navigation.css',
    '/portfolio/styles/hero.css',
    '/portfolio/styles/projects.css',
    '/portfolio/styles/contact.css',
    '/portfolio/styles/social-proof.css',
    '/portfolio/styles/footer.css',
    '/portfolio/styles/responsive.css',
    '/portfolio/styles/privacy.css',
    '/portfolio/scripts/main.js',
    '/portfolio/scripts/animations.js',
    '/portfolio/components/header.html',
    '/portfolio/components/hero.html',
    '/portfolio/components/about.html',
    '/portfolio/components/experience.html',
    '/portfolio/components/projects.html',
    '/portfolio/components/social-proof.html',
    '/portfolio/components/contact.html',
    '/portfolio/components/footer.html',
    '/portfolio/images/logo.png',
    '/portfolio/images/banner.png',
    '/portfolio/favicon.ico'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version if available
                if (response) {
                    return response;
                }
                
                // Otherwise fetch from network
                return fetch(event.request).then(
                    response => {
                        // Check if we received a valid response
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response to store in cache
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

// Clean up old caches
// Add update notification
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});