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


// ✅ 從 IndexedDB 讀取 UserData 並填入 `form1`
async function loadUserData() {
    console.log('loadUserData');

    try {
        const name = await db.get('userData', 'name');
        const idNumber = await db.get('userData', 'idNumber');
        const licensePlateNumber = await db.get('userData', 'licensePlateNumber');

        // ✅ 填入 `form1`
        document.getElementById("name").value = name || "";
        document.getElementById("idNumber").value = idNumber || "";
        document.getElementById("licensePlateNumber").value = licensePlateNumber || "";
        

        console.log("✅ 讀取 userData 完成");

    } catch (error) {
        console.warn("⚠️ 找不到 userData");
    }
}


async function saveUserData(){
    console.log('saveUserData');

    // 取得所有輸入框值
    const name = document.getElementById("name").value.trim();
    const idNumber = document.getElementById("idNumber").value.trim();
    const licensePlateNumber = document.getElementById("licensePlateNumber").value.trim();


    try {
        await db.set('userData', 'name', name);
        await db.set('userData', 'idNumber', idNumber);
        await db.set('userData', 'licensePlateNumber', licensePlateNumber);
        console.log("✅ userData 已存入 IndexedDB");        
        alert("✅ userData 已儲存！");

    } catch (error) {
        console.error(error);
    }

    window.location.reload(true);
}


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-form1-submit").addEventListener("click", saveUserData);
});


loadUserData();

