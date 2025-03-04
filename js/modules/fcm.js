// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging.js";
import db from './IndexedDBHelper.js';

let firebaseConfig = null;
let vapidKey = null;
let app = null;
let messaging = null;

// *** 取得 Firebase 設定 ***
async function getFirebaseConfigFromIdb() {
  const firebaseConfigJSONString = await db.get('settings', 'firebaseConfigJSONString');
  return firebaseConfigJSONString ? JSON.parse(firebaseConfigJSONString) : null;
}

// *** 取得 VAPID Key ***
async function getVapidKeyFromIdb() {
  return await db.get('settings', 'vapidKey');
}

// *** 初始化 Firebase ***
async function initFirebase() {
  console.log("✅ initFirebase...");
  firebaseConfig = await getFirebaseConfigFromIdb();
  vapidKey = await getVapidKeyFromIdb();

  if (!firebaseConfig || !vapidKey) {
    console.warn("⚠️ FirebaseConfig 或 VAPID Key 未設定");
    return false;
  }


  app = initializeApp(firebaseConfig);
  console.log("✅ initializeApp(firebaseConfig) 成功");

  try {    
    messaging = getMessaging(app);
    console.log("✅ Firebase Messaging 初始化完成");  
  } catch (error) {
    console.error("❌ 無法初始化 Firebase Messaging:", error);
    return false;
  }
  console.log("✅ initFirebase 完成");

  return true;
}

// *** 取得 messagingObject ***
async function getMessagingObject() {
  return messaging;
}



// *** 取得 FCM Token ***
async function getFCMToken() {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("❌ 使用者拒絕通知權限");
      return;
    }

    const fcmToken = await db.get('settings', 'fcmToken');
    if (fcmToken) return fcmToken; // 如果已存在，直接回傳

    const registration = await navigator.serviceWorker.ready;
    const token = await getToken(messaging, { vapidKey: vapidKey, serviceWorkerRegistration: registration });

    if (token) {
      console.log("✅ 取得 FCM Token:", token);
      await db.set('settings', 'fcmToken', token);
      return token;
    } else {
      console.warn("⚠️ 無法獲取 FCM Token");
      return null;
    }
  } catch (error) {
    console.error("❌ 取得 FCM Token 失敗:", error);
    return null;
  }
}

// *** 註冊前景推播監聽 (sample code) ***
function registerOnMessageHandler() {
  if (!messaging) {
    console.warn("⚠️ Firebase Messaging 尚未初始化");
    return;
  }
  
  console.log("📩 註冊前景推播監聽...");
  onMessage(messaging, (payload) => {
    console.log('📩 收到前景推播:', payload);
    alert("📩 收到推播訊息", JSON.stringify(payload));
  });
}

// *** 模組導出 ***
export { initFirebase, getMessagingObject, getFCMToken };
