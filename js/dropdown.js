function toggleDropdown() {
    const dropdown = document.querySelector(".dropdown-list");
    const header = document.querySelector(".dropdown-header");
    
    dropdown.classList.toggle("active");
    header.classList.toggle("active");
}

// async function loadBanksData() {
//     try {
//         const response = await fetch('banks.json'); // 讀取 JSON 檔案
//         if (!response.ok) throw new Error("載入 JSON 失敗");
        
//         const banks = await response.json(); // 解析 JSON 成 JS 物件
//         console.log("成功讀取銀行資料:", banks); // 測試輸出

//         return banks;
//     } catch (error) {
//         console.error("讀取 banks.json 失敗:", error);
//         return [];
//     }
// }

function switchTab(tabId) {    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}


function selectBank(bankId) {
    let banks = [
        {
            "id": "esun",
            "name": "玉山銀行",
            "logo": "images/logo-esun.png"        
        },
        {
            "id": "ctbc",
            "name": "中國信託",
            "logo": "images/logo-ctbc.png"        
        }
    ];


    let bank = banks.find(bank => bank.id === bankId) || null;

    document.querySelector(".bank-logo").src = bank.logo;
    document.querySelector(".selected-bank").textContent = bank.name;
    switchTab(bank.id);

    toggleDropdown();
    
}


