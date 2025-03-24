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

        // 設置 data-id 為通知的 ID (用於後續刪除)
        clone.querySelector(".message-wrapper").setAttribute("data-id", notification.id); 

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


async function initMessageSwipeDelete() {
    const messages = document.querySelectorAll(".message-wrapper");

    messages.forEach((wrapper) => {
        // 取得通知編號 (來自 data-id 屬性，用於自 indexDB 刪除資料)
        const messageId = wrapper.getAttribute("data-id");

        // 觸控偵測初參數始化
        let startX, currentX, isSwiping = false;
        const message = wrapper.querySelector(".message");
        const deleteBtn = wrapper.querySelector(".delete-btn");

        // 觸控開始
        wrapper.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
            isSwiping = false;
        });

        // 觸控滑動
        wrapper.addEventListener("touchmove", (e) => {
            currentX = e.touches[0].clientX;
            let diffX = startX - currentX;
            
            if (diffX > 20) { // 滑動距離
                wrapper.classList.add("swiped");
                isSwiping = true;
            } else if (diffX < -20) {
                wrapper.classList.remove("swiped");
                isSwiping = false;
            }
        });

        // 滑鼠拖曳 (桌面版)
        wrapper.addEventListener("mousedown", (e) => {
            startX = e.clientX;
            isSwiping = false;
        });

        wrapper.addEventListener("mousemove", (e) => {
            if (!startX) return;
            currentX = e.clientX;
            let diffX = startX - currentX;

            if (diffX > 20) {
                wrapper.classList.add("swiped");
                isSwiping = true;
            } else if (diffX < -20) {
                wrapper.classList.remove("swiped");
                isSwiping = false;
            }
        });

        wrapper.addEventListener("mouseup", () => {
            startX = null;
        });

        // 刪除訊息
        deleteBtn.addEventListener("click", () => {
            wrapper.style.transition = "opacity 0.3s, transform 0.3s";
            wrapper.style.opacity = "0";
            wrapper.style.transform = "translateX(-100%)";

            // **延遲刪除 (確保動畫跑完)**
            setTimeout(async () => {
                // 移除 wrapper dom 物件
                wrapper.remove();
                
                // **從 IndexedDB 刪除**
                console.log(`🗑️ 刪除通知 (ID=${messageId})`);
                await db.delete("notifications", Number(messageId));
                console.log("✅ 已從 IndexedDB 刪除通知");
            }, 300);
        });
    });
}



document.addEventListener("DOMContentLoaded", async () => { 
    // 載入頁面初始資料
    // 載入通知訊息
    console.log("✅ 讀取 DB 內通知訊息");
    await loadNotifications();

    // 初始化滑動刪除功能
    console.log("✅ 初始化訊息滑動刪除功能");
    await initMessageSwipeDelete();

    // 綁定事件監聽
    // ...
});