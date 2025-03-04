import db from './modules/IndexedDBHelper.js';

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

console.log('hi');

getAllSettings();

function testIdb() {
    saveFirebaseKey("test_fiebase_key");
    getFirebaseKey();
    deleteFirebaseKey();

    alert("測試完成");
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-test-idb").addEventListener("click", testIdb);
});


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

    //window.location.reload(true);
}


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-form1-submit").addEventListener("click", saveFCMSettings);
});


loadFCMSettings();

