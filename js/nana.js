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

    if('weather'==option){
        QueryWeather();
    }

    toggleChat(); // 選擇後關閉選單
}

// 查詢後續三天台北市北投區的溫度
async function QueryWeather(){
    let queryString = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-061?Authorization=CWA-18C3369B-2FCC-4258-B6AD-25DB7F724E42&LocationName=%E5%8C%97%E6%8A%95%E5%8D%80&ElementName=%E6%BA%AB%E5%BA%A6';

    // 進行api查詢並取得結果
    try {
        // 發送 API 請求
        let response = await fetch(queryString);
        let data = await response.json();

        // 檢查 API 是否成功回應
        if (!data || !data.records || !data.records.locations || !data.records.locations[0].location) {
            console.error("❌ 無法取得天氣資料");
            return;
        }

        // 取得天氣資料
        let locationData = data.records.locations[0].location[0];
        let temperatureData = locationData.weatherElement.find(e => e.elementName === "溫度");

        if (!temperatureData || !temperatureData.time) {
            console.error("❌ 無法找到溫度數據");
            return;
        }

        // 解析未來三天的溫度
        let weatherResult = [];
        for (let i = 0; i < 3; i++) {
            let timeData = temperatureData.time[i];
            let date = timeData.startTime.split(" ")[0]; // 取得日期
            let temp = timeData.elementValue[0].value; // 取得溫度
            weatherResult.push({ date, temp });
        }

        // 顯示結果
        console.log("📅 未來三天北投區的溫度:");
        weatherResult.forEach(day => {
            console.log(`${day.date}: ${day.temp}°C`);
        });

    } catch (error) {
        console.error("❌ 查詢天氣時發生錯誤:", error);
    }

}