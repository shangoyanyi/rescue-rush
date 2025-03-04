// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging.js";

import db from './IndexedDBHelper.js';


// 從 idb 取得 firebaseConfig
async function getFirebaseConfigFromIdb() {
  console.log("檢查 idb 內的 firebaseConfigJSONString...");
  const firebaseConfigJSONString = await db.get('settings', 'firebaseConfigJSONString');

  if(!firebaseConfigJSONString){
    console.warn("firebaseConfigJSONString 不存在，請先進行設定");
    return;
  }else{
    console.log("取得 firebaseConfigJSONString=", firebaseConfigJSONString);
  }

  return JSON.parse(firebaseConfigJSONString);
}

// 將 firebaseConfig 存入 idb
async function saveFirebaseConfigtoIdb(firebaseConfigJSONString) {
  console.log("save firebaseConfigJSONString to idb...");
  
  let key = "firebaseConfigJSONString";
  return db.put('settings', { key, firebaseConfigJSONString });
}


// 從 idb 取得 vapidKey
async function getVapidKeyFromIdb() {
  console.log("檢查 idb 內的 vapidKey...");
  const vapidKey = await db.get('settings', 'vapidKey');

  if(!vapidKey){
    console.warn("vapidKey 不存在，請先進行設定");
    return;
  }else{
    console.log("取得 vapidKey=", vapidKey);
  }

  return vapidKey;
}

// 將 vapidKey 存入 idb
async function saveVapidKeytoIdb(vapidKey) {
  console.log("save vapidKey to idb...");
  
  let key = "vapidKey";
  return db.put('settings', { key, vapidKey });
}




// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "<YOUR-API-KEY>",
//   authDomain: "<YOUR-AUTH-DOMAIN>",
//   projectId: "<YOUR-PROJECT-ID>",
//   storageBucket: "<YOUR-STORAGE-BUCKET>",
//   messagingSenderId: "<YOUR-MESSAGING-SENDER-ID>",
//   appId: "<YOUR-APP-ID>",
//   measurementId: "<YOUR-MEASUREMENT-ID>"
// };

// let vapidKey = "<YOUR-VAPID-KEY>";


// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);



// *** 取得 FCM Token ***
// 檢查 idb 內是否已有 FCM Token
// 請求通知權限
// 確保 Service Worker 註冊
// 請求 FCM Token
async function getFCMToken() {
    try {           
        console.log("📢 請求通知權限...");
        const permission = await Notification.requestPermission();

        if (!permission === "granted") {
          console.warn("❌ 使用者拒絕通知權限");
          return;
        }  
        console.log("✅ 通知權限已授權");


        console.log("檢查 idb 內的 fcmToken...");
        const fcmToken = await db.get('settings', 'fcmToken');
        
        console.log("fcmToken = ", fcmToken);
        if(fcmToken){
          console.log("fcmToken 已存在");
          return fcmToken;          
        }
        console.log("fcmToken 不存在，重新取得...");


        // Initialize Firebase
        console.log("初始化 firebase...");
        const firebaseConfig = await getFirebaseConfigFromIdb();
        console.log("firebaseConfig:", firebaseConfig);
        if(!firebaseConfig){
          console.warn("firebaseConfig is NULL");
          return;
        }

        const vapidKey = await getVapidKeyFromIdb();
        console.log("vapidKey:", vapidKey);
        if(!vapidKey){
          console.warn("vapidKey is NULL");
          return;
        }
        
        const app = initializeApp(firebaseConfig);
        const messaging = getMessaging(app);
        console.log("firebase初始化完成");


        //get fcm token        
        console.log("📢 請求 FCM Token...");
        const registration = await navigator.serviceWorker.ready;
        const token = await getToken(messaging, { vapidKey: vapidKey, serviceWorkerRegistration: registration });

        if (token) {
            console.log("✅ 取得 FCM Token:", token);
            // 將 token 寫回 idb
            await db.set('settings', 'fcmToken', token);
            console.log("fcmToken 已存入 idb!")

            // 這裡可以將 Token 傳送到後端
            // ...
            return token;

        } else {
            console.warn("⚠️ 無法獲取 FCM Token，請檢查權限");
            return;
        }
      
    } catch (error) {
        console.error("❌ 取得 FCM Token 失敗:", error);
        return;
    }
}


getFCMToken();
