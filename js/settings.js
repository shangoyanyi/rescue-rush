import {onMessage } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging.js";
import db from './modules/IndexedDBHelper.js';
import { initFirebase, getMessagingObject, getFCMToken } from './modules/fcm.js';

async function saveFirebaseKey(userApiKey) {
    await db.set('settings', 'firebaseApiKey', userApiKey);
    console.log("✅ Firebase API Key 已存入 IndexedDB");
}

async function getFirebaseKey() {
    const key = await db.get('settings', 'firebaseApiKey');
    console.log("🔑 取得 Firebase API Key:", key);
    return key;
}

async function saveUserSettings(theme, notifications) {
    await db.set('settings', 'theme', theme);
    await db.set('settings', 'notifications', notifications);
    console.log("✅ 使用者設定已存入 IndexedDB");
}

async function getAllSettings() {
    const settings = await db.getAll('settings');
    console.log("⚙️ 目前所有設定:", settings);
}

async function deleteFirebaseKey() {
    await db.delete('settings', 'firebaseApiKey');
    console.log("🗑️ 已刪除 Firebase API Key");
}

function testIdb() {
    getAllSettings();
    saveFirebaseKey("test_fiebase_key");
    getFirebaseKey();
    deleteFirebaseKey();
    alert("測試完成");
}






// ✅ 從 IndexedDB 讀取 loadFCMSettings 並填入 `form1`
async function loadFCMSettings() {
    console.log('loadFCMSettings');

    const settings = await db.getAll('settings');
    console.log("⚙️ 目前所有 settings:", settings);

    try {
        const firebaseConfigJSONString = await db.get('settings', "firebaseConfigJSONString");
        const vapidKey = await db.get('settings', "vapidKey");
        const fcmToken = await db.get('settings', "fcmToken");

        // ✅ 填入 `form1`
        document.getElementById("firebaseConfigJSONString").value = firebaseConfigJSONString || "";
        document.getElementById("vapidKey").value = vapidKey || "";
        document.getElementById("fcmToken").textContent = fcmToken || "";

        console.log("✅ loadFCMSettings 完成");

    } catch (error) {
        console.warn("⚠️ loadFCMSettings error");
    }
}


async function saveFCMSettings(){
    console.log('saveFCMSettings');

    // 取得所有輸入框值
    const firebaseConfigJSONString = document.getElementById("firebaseConfigJSONString").value.trim();
    const vapidKey = document.getElementById("vapidKey").value.trim();
    
    console.log("firebaseConfigJSONString:", firebaseConfigJSONString);
    console.log("vapidKey:", vapidKey);
    

    try {
        await db.set('settings', "firebaseConfigJSONString", firebaseConfigJSONString);        
        console.log("✅ firebaseConfigJSONString 已存入 IndexedDB");

        await db.set('settings', "vapidKey", vapidKey);        
        console.log("✅ vapidKey 已存入 IndexedDB");

    } catch (error) {
        console.error(error);
    }
}

// ✅ 取得 FCM Token 並註冊推播監聽
async function getFCMTokenEventHandler(){
    console.log('getFCMTokenEventHandler');

    try {
        const firebaseInitialized = await initFirebase();
        if (!firebaseInitialized) {
          console.error("❌ Firebase 初始化失敗");
          alert("❌ Firebase 初始化失敗", error);
          return;
        }
    
        console.log("✅ Firebase 初始化成功，開始取得 FCM Token...");
        const fcmToken = await getFCMToken();
        if (!fcmToken) {
          console.error("❌ 取得 FCM Token 失敗");
          alert("❌ 取得 FCM Token 失敗", error);
          return;
        }
    

        console.log("✅ 取得 FCM Token 成功，註冊推播監聽...");        
        const messaging = await getMessagingObject();
        if (!messaging) {
            console.warn("⚠️ Firebase Messaging 尚未初始化");
            return;
        }

        onMessage(messaging, (payload) => {
            console.log("📩 收到推播訊息:", payload);
            alert("📩 收到推播訊息", JSON.stringify(payload));
        });        
        console.log("✅ 註冊推播監聽完成");

    } catch (error) {
        console.error("❌ 主執行邏輯錯誤:", error);
        alert("❌ 主執行邏輯錯誤", error);
    }
}




document.addEventListener("DOMContentLoaded", () => {
    loadFCMSettings();

    document.getElementById("btn-test-idb").addEventListener("click", testIdb);    
    document.getElementById("btn-delete-idb").addEventListener("click", async () => {
        if(!confirm("將會刪除整個 indexedDB，確定刪除?")){
            return;
        }
        await db.deleteDatabase();
        console.log("🔥 整個 PWA Database 已被刪除");
        alert("🔥 整個 PWA Database 已被刪除，請更新 PWA")
    });
    

    document.getElementById("btn-form1-submit").addEventListener("click", saveFCMSettings);
    document.getElementById("btn-get-fcm-token").addEventListener("click", getFCMTokenEventHandler);
});




