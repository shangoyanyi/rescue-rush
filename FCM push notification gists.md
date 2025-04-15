# FCM push notification相關

## firebase 設定
1. 取得 firebase 連線參數
2. 取得 vapidKey 參數

## 前端js
1. 使用正確的 firebase 連線參數
2. 使用正確的 vapidKey 參數
3. 可正確取得 fcmToken

## service-worker
service-worker 內需要新增監聽 push 事件程式碼

```
// 監聽 push 事件
self.addEventListener('push', event => {
    console.log("📩 收到 `push` 事件:", event);

    let data = {};
    try {
        data = event.data ? event.data.json() : {};
    } catch (e) {
        console.error("❌ 無法解析 `push` 訊息:", e);
    }

    const title = data.notification?.title || "🔔 你有一則新通知";
    const options = {
        body: data.notification?.body || "請檢查你的通知內容。",
        icon: "/images/logo.png",
        badge: "/images/badge.png"
    };

    event.waitUntil(self.registration.showNotification(title, options));
});
```


## console端相關程式碼片段

### 1. 發送測試通知(本地測試)
方法1. 使用 DevTool 發送 push 測試通知
```
DevTool -> Application -> Service workers -> Push
```

方法2. 使用 postMessage() 直接向 Service Worker 傳遞推播測試數據
```
navigator.serviceWorker.ready.then(reg => {
    reg.active.postMessage({
        type: "push",
        data: {
            notification: {
                title: "測試通知",
                body: "這是一則來自 Console 的測試推播",
                icon: "/images/logo.png"
            }
        }
    });
});
```
如果 console.log("📩 收到 push 事件:", event); 沒有出現，表示 push 事件沒有觸發，請確認 subscription 是否有效。

### 2. 其他狀態檢查

1. 從console檢查訂閱(subscription)是否存在
```
navigator.serviceWorker.ready.then(async reg => {
    const subscription = await reg.pushManager.getSubscription();
    console.log("✅ 當前 `push` 訂閱資訊:", subscription);
});
```
如果 subscription 為 null，代表 push 訂閱遺失，請重新訂閱


2. 從console模擬重新訂閱
```
navigator.serviceWorker.ready.then(async reg => {
    const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: '你的VAPID公鑰'
    });

    console.log("✅ `push` 訂閱成功:", subscription);
});
```


3. 檢查瀏覽器是否支援 PushManager
```
if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log("✅ 瀏覽器支援推播通知");
} else {
    console.error("❌ 瀏覽器不支援推播通知");
}
```

4. 檢查通知權限是否已授權
```
Notification.requestPermission().then(permission => {
    console.log("🔔 當前通知權限:", permission);
});
```
如果 回傳 denied（拒絕），代表 使用者拒絕了通知權限，需要指導用戶手動到 瀏覽器設定 → 允許通知權限。