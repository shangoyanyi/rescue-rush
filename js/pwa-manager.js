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
