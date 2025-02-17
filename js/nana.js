function toggleChat() {
    const chatbox = document.querySelector(".chatbox");
    const overlay = document.querySelector(".overlay");

    if (chatbox.classList.contains("show")) {
        chatbox.classList.remove("show");
        overlay.classList.remove("show");
    } else {
        chatbox.classList.add("show");
        overlay.classList.add("show");
    }
}

// 處理選項點擊事件
function handleOption(option) {
    console.log("選擇的選項:", option);
    alert(`你選擇了: ${option}`);
    toggleChat(); // 選擇後關閉選單
}