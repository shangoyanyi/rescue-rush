import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging.js";
import db from './IndexedDBHelper.js';

class FirebaseHelper {
    constructor() {
        console.log(`[${this.constructor.name}] Initialized.`);
        this.firebaseConfig = null;
        this.vapidKey = null;
        this.app = null;
        this.messaging = null;
    }

    /**
     * 初始化 Firebase
     * 1. 從 IndexedDB 取得 firebaseConfig
     * 2. 初始化 Firebase App
     * @returns {Promise<boolean>}
     */
    async initFirebase() {
        if (this.app) {
            console.log("✅ Firebase 已初始化，跳過 init");
            return true;
        }

        console.log("🔍 嘗試從 IndexedDB 讀取 Firebase 設定...");
        const firebaseConfigJSONString = await db.get('settings', 'firebaseConfigJSONString');
        this.firebaseConfig = firebaseConfigJSONString ? JSON.parse(firebaseConfigJSONString) : null;

        if (!this.firebaseConfig) {
            console.warn("⚠️ Firebase 設定未找到，請確認設定是否正確");
            return false;
        }

        try {
            this.app = initializeApp(this.firebaseConfig);
            console.log("✅ Firebase 初始化成功");
            return true;
        } catch (error) {
            console.error("❌ Firebase 初始化失敗:", error);
            return false;
        }
    }

    /**
     * 取得 Firebase App（如果尚未初始化，回傳 null）
     * @returns {object|null}
     */
    getApp() {
        return this.app;
    }

    /**
     * 取得 FCM Token
     * 1. 確保 Firebase 已經初始化
     * 2. 確保使用者同意推播權限
     * 3. 透過 Service Worker 註冊 FCM
     * 4. 呼叫 getToken 取得 FCM Token
     * @returns {Promise<string|null>}
     */
    async getFcmToken() {
        // 確保 Firebase 已初始化
        console.log("🔍 檢查 Firebase 是否初始化...");
        const firebaseInitialized = await this.initFirebase();
        if (!firebaseInitialized) {
            console.error("❌ Firebase 未初始化，無法取得 FCM Token");
            return null;
        }

        try {
            // 檢查使用者是否允許通知
            console.log("🔍 檢查通知權限...");
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                console.warn("❌ 使用者拒絕通知權限");
                return null;
            }
            console.log("✅ 使用者已授權通知");

            // 取得 Service Worker 註冊
            console.log("🔍 取得 Service Worker 註冊...");
            const registration = await navigator.serviceWorker.ready;
            console.log("✅ 取得 Service Worker 註冊完成");

            // 初始化 Messaging 物件
            if (!this.messaging) {
                console.log("🔍 初始化 Messaging 物件...");
                this.messaging = getMessaging(this.app);
                console.log("✅ 初始化 Messaging 物件完成");
            }

            // 取得 VAPID Key
            console.log("🔍 取得 VAPID Key...");
            this.vapidKey = await db.get('settings', 'vapidKey');
            if (!this.vapidKey) {
                console.warn("⚠️ VAPID Key 未設定");
                return null;
            }
            console.log("✅ 取得 VAPID Key:", this.vapidKey);

            // 呼叫 getToken 取得 FCM Token
            console.log("🔍 取得 FCM Token...");
            const token = await getToken(this.messaging, { 
                vapidKey: this.vapidKey,
                serviceWorkerRegistration: registration 
            });

            if (token) {
                console.log("✅ 取得 FCM Token:", token);
                // 儲存 Token 到 IndexedDB（不在 `FirebaseHelper` 負責，但可選擇記錄）
                console.log("🔍 將 FCM Token 存入 IndexedDB...");
                await db.set('settings', 'fcmToken', token);
                console.log("✅ FCM Token 存入 IndexedDB 成功");
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
}

export default new FirebaseHelper();