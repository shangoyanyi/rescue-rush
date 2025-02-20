
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-messaging.js";
import db from './IndexedDBHelper.js';

// 初始化 Firebase
// const firebaseConfig = {
//     apiKey: "YOUR_API_KEY",
//     authDomain: "YOUR_AUTH_DOMAIN",
//     projectId: "YOUR_PROJECT_ID",
//     storageBucket: "YOUR_STORAGE_BUCKET",
//     messagingSenderId: "YOUR_MESSAGEING_SENDER_ID",
//     appId: "YOUR_APP_KEY",
//     measurementId: "YOUR_MEASUREMENT_ID",
//     vapidKey: "YOUR_VAPID_KEY"
// };

const firebaseConfig = await db.get('settings', 'firebaseConfig');
console.log('load firebaseConfig=', firebaseConfig);

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);


async function requestFCMToken() {
    console.log('取得FCM Token...')
    try{
        // 取得 serviceWorker
        const registration = await navigator.serviceWorker.ready;

        // 檢查 vapidKey 不為空值
        if(firebaseConfig.vapidKey){
            console.log("🔑 取得 Firebase vapidKey:", firebaseConfig.vapidKey);
        }else{
            console.warn("⚠️ vapidKey 為空，請先完成設定");
            return;
        }

        // 取得 FCM Token
        const token = await getToken(messaging, {             
            vapidKey: firebaseConfig.vapidKey,
            serviceWorkerRegistration: registration // 🔹 這一行是關鍵
        });

        if (token) {
            console.log("✅ 取得 FCM Token:", token);
            saveTokenToServer(token); // 🔹 可選，將 Token 傳到後端
        } else {
            console.warn("⚠️ FCM Token 為空，可能是權限問題");
        }
    } catch (error) {
        console.error("❌ 無法取得 FCM Token:", error);
    }
}



// **儲存 Token 到後端（Make Webhook / Firebase / API）**
function saveTokenToServer(token) {
    document.getElementById("text-fcm-token").textContent = token;
    // fetch('https://hook.make.com/你的-make-webhook-url', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ fcm_token: token })
    // }).then(res => res.json())
    // .then(data => console.log("✅ Token 已儲存到後端:", data))
    // .catch(err => console.error("❌ 無法儲存 Token:", err));
}

// **前景推播監聽（當 PWA 打開時會收到通知）**
onMessage(messaging, payload => {
    console.log("📩 收到前景推播:", payload);
    new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: '/images/logo.png'
    });
});


document.getElementById("btn-fcm").addEventListener("click", () => {
    console.log('btn-fcm按鈕點擊事件');
    requestFCMToken();
});





