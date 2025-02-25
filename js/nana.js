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

    if('home'==option){
        location.href = 'index.html';
    }

    if('settings'==option){
        location.href = 'settings.html';
    }

    if('weather'==option){
        QueryWeather();
    }

    if('sayhi'==option){
        nanaSpeak("嗨！我是 Nana，你需要什麼幫助嗎？");
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

        // 取出每日的最高溫 & 最低溫
        let finalWeather = Object.keys(weatherResult).slice(0, 3).map(date => {
            let maxTemp = Math.max(...weatherResult[date]); // 最高溫
            let minTemp = Math.min(...weatherResult[date]); // 最低溫
            return { date, maxTemp, minTemp };
        });

        // 轉換成 JSON 物件
        let weatherJson = {
            today: {
                date: finalWeather[0]?.date || "N/A",
                minTemp: finalWeather[0]?.minTemp || "N/A",
                maxTemp: finalWeather[0]?.maxTemp || "N/A"
            },
            tomorrow: {
                date: finalWeather[1]?.date || "N/A",
                minTemp: finalWeather[1]?.minTemp || "N/A",
                maxTemp: finalWeather[1]?.maxTemp || "N/A"
            }
        };

        console.log(weatherJson);
        return weatherJson;

        // // 構造顯示訊息
        // let weatherMessage = "📅 未來三天北投區的天氣：\n";
        // finalWeather.forEach(day => {
        //     weatherMessage += `📆 ${day.date}\n🌡️ 最高溫: ${day.maxTemp}°C\n❄️ 最低溫: ${day.minTemp}°C\n\n`;
        // });

        // // 顯示結果
        // alert(weatherMessage);


    } catch (error) {
        console.error("❌ 查詢天氣時發生錯誤:", error);
        alert("❌ 查詢天氣時發生錯誤:", error);
    }
}


async function showWeather() {
    console.log("showWeather");
    let weatherJson = await QueryWeather();

    document.getElementById("date-today").textContent = weatherJson.today.date;
    document.getElementById("temp-today").textContent = weatherJson.today.minTemp + "°" + " - " + weatherJson.today.maxTemp + "°";

    document.getElementById("date-tomorrow").textContent = weatherJson.tomorrow.date;
    document.getElementById("temp-tomorrow").textContent = weatherJson.tomorrow.minTemp + "°" + " - " + weatherJson.tomorrow.maxTemp + "°";
}

// 在 overlay 顯示結果
showWeather();




function nanaSpeak(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.lang = "zh-TW"; // ✅ 設定中文
    utterance.voice = synth.getVoices().find(voice => voice.name.includes("Mei-Jia")); // ✅ 選擇台灣語音 (若支援)
    utterance.pitch = 2; // ✅ 聲調 (0 ~ 2)
    utterance.rate = 3;  // ✅ 語速 (0.1 ~ 10)
    utterance.volume = 1; // ✅ 音量 (0 ~ 1)

    synth.speak(utterance);
}

