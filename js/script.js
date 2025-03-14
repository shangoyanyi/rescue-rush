// func: PWA 程式更新
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
                        // window.location.reload(true); // 確保強制重新載入最新版本
                        window.location.href = "index.html";
                    });
                });
            } else {
                // window.location.reload(true);
                window.location.href = "index.html";
            }
        });
    } else {
        // window.location.reload(true);
        window.location.href = "index.html";
    }
}


function initFirebase(){
    
}

