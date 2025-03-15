import db from './modules/IndexedDBHelper.js';

async function loadNotifications() {
    console.log("📥 讀取 IndexedDB 中的通知...");
    const notifications = await db.getAll('notifications');

    const listElement = document.getElementById("notifications-list");
    listElement.innerHTML = ""; // 清空舊列表

    if (notifications.length === 0) {
        listElement.innerHTML = "<li>⚠️ 目前沒有通知</li>";
        return;
    }

    notifications.forEach(notification => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${new Date(notification.timestamp).toLocaleString()}</strong><br>
            <b>${notification.data.notification.title}</b><br>
            ${notification.data.notification.body}
        `;
        listElement.appendChild(li);
    });

    console.log("✅ 通知已載入:", notifications);
}


document.addEventListener("DOMContentLoaded", () => { 
    // 📥 頁面載入時讀取通知
    loadNotifications();

    // 🔄 註冊重新載入按鈕
    document.getElementById("refresh-btn").addEventListener("click", loadNotifications);
});