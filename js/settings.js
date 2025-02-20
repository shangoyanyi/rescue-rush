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
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-idb").addEventListener("click", testIdb);
});



// ✅ 從 IndexedDB 讀取 Firebase 設定並填入 `form1`
async function loadFirebaseConfig() {
    console.log('loadFirebaseConfig');

    try {
        const config = await db.get('settings', 'firebaseConfig');

        // ✅ 填入 `form1`
        document.getElementById("apiKey").value = config.apiKey || "";
        document.getElementById("authDomain").value = config.authDomain || "";
        document.getElementById("projectId").value = config.projectId || "";
        document.getElementById("storageBucket").value = config.storageBucket || "";
        document.getElementById("messagingSenderId").value = config.messagingSenderId || "";
        document.getElementById("appId").value = config.appId || "";
        document.getElementById("measurementId").value = config.measurementId || "";
        document.getElementById("vapidKey").value = config.vapidKey || "";

        console.log("✅ 讀取 Firebase 設定完成");

    } catch (error) {
        console.warn("⚠️ 找不到 Firebase 設定");
    }
}


async function saveFirebaseConfig(e){
    console.log('saveFirebaseConfig');

    e.preventDefault();

    // 取得所有輸入框值
    const firebaseConfig = {
        apiKey: document.getElementById("apiKey").value.trim(),
        authDomain: document.getElementById("authDomain").value.trim(),
        projectId: document.getElementById("projectId").value.trim(),
        storageBucket: document.getElementById("storageBucket").value.trim(),
        messagingSenderId: document.getElementById("messagingSenderId").value.trim(),
        appId: document.getElementById("appId").value.trim(),
        measurementId: document.getElementById("measurementId").value.trim(),
        vapidKey: document.getElementById("vapidKey").value.trim()
    };

    try {
        await db.set('settings', 'firebaseConfig', firebaseConfig);
        console.log("✅ firebaseConfig 已存入 IndexedDB");        
        alert("✅ Firebase 設定已儲存！");

    } catch (error) {
        console.error(error);
    }

    loadFirebaseConfig();

}


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-form1-submit").addEventListener("click", saveFirebaseConfig);
});


loadFirebaseConfig();

