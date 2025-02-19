function switchTab(tabName) {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

function callRescue(phoneNumber) {
    window.location.href = `tel:${phoneNumber}`;
}



function getLocation() {
    const locationInfo = document.getElementById('location-info');

    if (!navigator.geolocation) {
        locationInfo.textContent = "瀏覽器不支援查詢位置";
        return;
    }

    locationInfo.textContent = "正在取得您的位置...";

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`);
            const data = await response.json();

            if (data.display_name) {
                const address = data.address;
                // 組合完整地址
                const fullAddress = [
                    address.country || "",
                    address.city || address.town || address.village || "",
                    address.suburb || address.district || "",
                    address.road || "",
                    address.house_number || ""
                ].filter(Boolean).join(", "); // 過濾掉空值，避免多餘的逗號

                locationInfo.textContent = `${fullAddress}`;
            } else {
                locationInfo.textContent = `無法取得您的位置，請確保已開啟 GPS 權限`;
            }
        },
        () => {
            locationInfo.textContent = "無法取得您的位置，請確保已開啟 GPS 權限";
        }
    );
}

// 取得地點資料
getLocation();


// PWA 程式更新
function updatePWA() {
    // if(!navigator.onLine){
    //     document.getElementById('location-info').textContent = "目前為離線模式";                
    //     return;
    // }

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

// 監聽 PWA 更新事件
document.getElementById("updateBtn").addEventListener("click", updatePWA);
