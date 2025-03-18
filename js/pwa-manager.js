// 更新 PWA (註銷 SW 並導向 index.html，讓該頁重新註冊 SW)
function updatePWA() {
    if (!confirm("⚠️ 更新並重新啟動 PWA 嗎？")){
        return;
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(registration => {
            if (registration) {
                registration.unregister().then(() => {
                    caches.keys().then(cacheNames => {
                        return Promise.all(
                            cacheNames.map(cacheName => caches.delete(cacheName))
                        );
                    }).then(() => {                        
                        window.location.href = "index.html";
                    });
                });
            } else {                
                window.location.href = "index.html";
            }
        });
    } else {        
        window.location.href = "index.html";
    }
}



// 集中管理 SW 註冊，所有頁面都載入這支 js
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then((registration) => {
        if (!registration) {
            // 只有當沒有 SW 註冊時才會註冊
            navigator.serviceWorker.register('/service-worker.js')
                .then(reg => console.log("✅ Service Worker Registered!", reg))
                .catch(err => console.log("❌ Service Worker Failed!", err));
        } else {
            console.log("🔄 Service Worker 已經註冊過了:", registration);
        }
    });
}
