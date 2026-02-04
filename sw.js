// sw.js - Service Worker for offline support
const CACHE_NAME = 'portfolio-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/privacy.html',
    '/styles/global.css',
    '/styles/navigation.css',
    '/styles/hero.css',
    '/styles/projects.css',
    '/styles/contact.css',
    '/styles/social-proof.css',
    '/styles/footer.css',
    '/styles/responsive.css',
    '/styles/privacy.css',
    '/scripts/main.js',
    '/scripts/animations.js',
    '/components/header.html',
    '/components/hero.html',
    '/components/about.html',
    '/components/experience.html',
    '/components/projects.html',
    '/components/social-proof.html',
    '/components/contact.html',
    '/components/footer.html',
    '/images/logo.png',
    '/images/banner.png',
    '/favicon.ico'
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