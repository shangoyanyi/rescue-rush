// call 救援電話
function callRescue(phoneNumber) {
    window.location.href = `tel:${phoneNumber}`;
}

// 取得地點並更新 locationInfo 內容
function updateLocationInfo() {
    const locationInfo = document.getElementById('location-info');

    if (!navigator.geolocation) {
        locationInfo.textContent = "瀏覽器不支援查詢位置";
        return;
    }

    if(!navigator.onLine){
        locationInfo.textContent = "目前為離線模式";                
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



/* ==== js 進入點 ==== */
document.addEventListener("DOMContentLoaded", async () => {
    console.log("✅ DOM 加載完成，初始化 PWA...");

    // 註冊 service-worker
    if ("serviceWorker" in navigator) {
        try {
            const registration = await navigator.serviceWorker.getRegistration();
            if (!registration) {
                const reg = await navigator.serviceWorker.register("/service-worker.js");
                console.log("✅ Service Worker Registered!", reg);
            } else {
                console.log("🔄 Service Worker 已經註冊過了:", registration);
            }
        } catch (err) {
            console.error("❌ Service Worker 註冊失敗:", err);
        }
    }


    // 資料初始化
    // 取得所在地點資料
    updateLocationInfo();
    
    // 事件監聽
    // PWA 更新按鈕點擊事件
    document.getElementById("updateBtn").addEventListener("click", updatePWA);

    // 初始化 firebase (fcm 功能)
    // initFirebase();
});