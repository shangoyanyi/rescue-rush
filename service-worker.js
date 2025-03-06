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
    "js/modules/libs/google/index-min.js",
    "js/modules/IndexedDBHelper.js",
    "js/dropdown.js",
    "js/nana.js",
    "js/script.js",
    "js/settings.js"
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

// 接收推播通知
self.addEventListener("push", function(event) {
    console.log("📩 收到背景推播事件", event);
    
    let payload;
    try {
        // 嘗試解析 JSON，如果失敗，則當作純文字處理
        payload = event.data ? event.data.json() : { notification: { title: "未知通知", body: "內容解析失敗" }};
    } catch (error) {
        console.warn("⚠️ 無法解析推播內容，改用純文字模式:", error);
        payload = { notification: { title: "通知", body: event.data.text() }};
    }
    console.log("📩 推播通知內容:", payload);

    event.waitUntil(
        (async () => {
            // 存入 IndexedDB
            await saveNotificationToIndexedDB(payload);

            // 顯示 Notification
            const title = payload.notification.title;
            const options = {
                body: payload.notification.body,
                icon: payload.notification.icon || "/images/logo.png",
                badge: "/images/badge.png"
            };
            self.registration.showNotification(title, options)
        })()
    );
});


// Service Worker 內的函式：將 push 事件收到的通知存入 IndexedDB
async function saveNotificationToIndexedDB(notificationData) {
    return new Promise((resolve, reject) => {
        const dbPromise = indexedDB.open("pwaDatabase", 1);

        dbPromise.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('notifications')) {
                db.createObjectStore('notifications', { keyPath: 'id', autoIncrement: true });
            }
        };

        dbPromise.onsuccess = function (event) {
            const db = event.target.result;
            const tx = db.transaction("notifications", "readwrite");
            const store = tx.objectStore("notifications");

            store.add({
                timestamp: Date.now(),
                data: notificationData
            });

            console.log("✅ 推播通知已存入 IndexedDB");
            resolve();
        };

        dbPromise.onerror = function (event) {
            console.error("❌ IndexedDB 存入失敗:", event.target.error);
            reject(event.target.error);
        };
    });
}
