import db from './modules/IndexedDBHelper.js';



// **時間格式化函數**
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString("zh-TW", { 
        year: "numeric", month: "2-digit", day: "2-digit", 
        hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
}

// **載入通知訊息**
async function loadNotifications() {
    console.log("📥 讀取 IndexedDB 中的通知...");

    // 載入訊息列表
    const messageList = document.getElementById("message-list"); 
    messageList.innerHTML = ""; // 清空訊息列表

    // 載入訊息樣板
    const template = document.getElementById("message-template");

    if (!template) {
        console.error("❌ 無法找到 #message-template，請檢查 HTML 結構");
        return;
    }

    // 載入訊息資料
    const notifications = await db.getAll('notifications');       

    if (notifications.length === 0) {
        listElement.innerHTML = "<div>⚠️ 目前沒有通知</div>";
        return;
    }


    notifications.forEach(notification => {
        const clone = document.importNode(template.content, true); // 複製 template 內容

        // 設置時間
        clone.querySelector(".message-time").textContent = formatTimestamp(notification.timestamp);

        // 設置標題
        clone.querySelector(".message-title").textContent = notification.data.notification.title;

        // 設置內容
        clone.querySelector(".message-content").textContent = notification.data.notification.body;

        // 將訊息 append 到訊息列表
        messageList.appendChild(clone);
    });

    console.log("✅ 通知已載入:", notifications);
}



document.addEventListener("DOMContentLoaded", () => { 
    // 📥 頁面載入時讀取通知
    loadNotifications();

    // 🔄 註冊重新載入按鈕
    // document.getElementById("refresh-btn").addEventListener("click", loadNotifications);
});