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
        if (!data || !data.records || !data.records.Locations || !data.records.Locations[0].Location) {
            console.error("❌ 無法取得天氣資料");
            return;
        }

        // 取得北投區的天氣資料
        let locationData = data.records.Locations[0].Location.find(loc => loc.LocationName === "北投區");
        if (!locationData) {
            console.error("❌ 找不到北投區的天氣資料");
            return;
        }

        // 找到 "溫度" 的 WeatherElement
        let temperatureData = locationData.WeatherElement.find(e => e.ElementName === "溫度");
        if (!temperatureData) {
            console.error("❌ 無法找到溫度數據");
            return;
        }

        // 解析未來三天的溫度
        let weatherResult = {};
        temperatureData.Time.forEach(timeData => {
            let date = timeData.DataTime.split("T")[0]; // 取得日期
            let temp = timeData.ElementValue[0].Temperature; // 取得溫度
            if (!weatherResult[date]) {
                weatherResult[date] = [];
            }
            weatherResult[date].push(parseInt(temp));
        });

        // // 取出每日的平均溫度
        // let finalWeather = Object.keys(weatherResult).slice(0, 3).map(date => {
        //     let avgTemp = weatherResult[date].reduce((sum, t) => sum + t, 0) / weatherResult[date].length;
        //     return { date, temp: avgTemp.toFixed(1) };
        // });

        // // 顯示結果
        // console.log("📅 未來三天北投區的溫度:");
        // finalWeather.forEach(day => {
        //     console.log(`${day.date}: ${day.temp}°C`);
        // });

        // 取出每日的最高溫 & 最低溫
        let finalWeather = Object.keys(weatherResult).slice(0, 3).map(date => {
            let maxTemp = Math.max(...weatherResult[date]); // 最高溫
            let minTemp = Math.min(...weatherResult[date]); // 最低溫
            return { date, maxTemp, minTemp };
        });

        // 構造顯示訊息
        let weatherMessage = "📅 未來三天北投區的天氣：\n";
        finalWeather.forEach(day => {
            weatherMessage += `📆 ${day.date}\n🌡️ 最高溫: ${day.maxTemp}°C\n❄️ 最低溫: ${day.minTemp}°C\n\n`;
        });

        // 顯示結果
        alert(weatherMessage);

    } catch (error) {
        console.error("❌ 查詢天氣時發生錯誤:", error);
    }

}