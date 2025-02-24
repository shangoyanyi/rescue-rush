function toggleDropdown() {
    const dropdown = document.querySelector(".dropdown-list");
    const header = document.querySelector(".dropdown-header");
    
    dropdown.classList.toggle("active");
    header.classList.toggle("active");
}

function switchTab(tabId) {    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}


function selectBank(bankId) {
    // let banks = [
    //     {
    //         "id": "esun",
    //         "name": "玉山銀行",
    //         "logo": "images/logo-esun.png"        
    //     },
    //     {
    //         "id": "ctbc",
    //         "name": "中國信託",
    //         "logo": "images/logo-ctbc.png"        
    //     }
    // ];


    let bank = banks.find(bank => bank.id === bankId) || null;

    document.querySelector(".bank-logo").src = bank.logo;
    document.querySelector(".selected-bank").textContent = bank.name;
    switchTab(bank.id);

    toggleDropdown();
    
}


function initDropdownList(){
    // 依據banks新增dropdown list內選項
    const dropdownList = document.getElementById("dropdown-list-banks");
    const template = document.getElementById("dropdown-item-template").content;

    // 清空舊內容，避免重複渲染
    dropdownList.innerHTML = "";

    // 動態生成 `li`
    banks.forEach(bank => {
        const clone = document.importNode(template, true); // 複製 `template`

        // 設定銀行 Logo
        const img = clone.querySelector(".bank-logo");
        img.src = bank.logo;
        img.alt = `${bank.name} Logo`;

        // 設定銀行名稱
        clone.querySelector(".bank-name").textContent = bank.name;

        // 設定 `onclick` 事件
        clone.querySelector("li").setAttribute("onclick", `selectBank('${bank.id}')`);

        // 插入 `dropdown-list`
        dropdownList.appendChild(clone);
    });
}


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

initDropdownList();