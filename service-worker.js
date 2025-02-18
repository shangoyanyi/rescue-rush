const CACHE_NAME = "pwa-cache-v1";
const FILES_TO_CACHE = [
    "index.html",
    "settings.html",
    "manifest.json",
    "css/dropdown.css",
    "css/nana.css",
    "css/styles.css",
    "images/angle-down-solid.svg",
    "images/logo-ctbc.png",
    "images/logo-esun.png",
    "images/logo.png",
    "images/nana_1.png",
    "images/nana_2.png",
    "images/nana_3.png",
    "images/nana_4.png",
    "js/dropdown.js",
    "js/nana.js",
    "js/script.js"
];

// 安裝 Service Worker 並快取文件
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

// 攔截請求，提供離線模式
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});