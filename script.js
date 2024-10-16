// 隨機打亂陣列的函數
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 動態生成卡牌數量和圖片路徑
const cardContainer = document.getElementById('cardContainer');
const timerDisplay = document.getElementById('timer');
const modeSelect = document.getElementById('modeSelect');

// 圖片路徑
const themes = {
    finger: [
        'images/picture1.jpg',
        'images/picture2.jpg',
        'images/picture3.jpg',
        'images/picture4.jpg',
        'images/picture5.jpg',
        'images/picture6.jpg',
        'images/picture7.jpg',
        'images/picture8.jpg',
        'images/picture9.jpg'
    ],
    arabic: [
        'images/picture10.jpg',
        'images/picture11.jpg',
        'images/picture12.jpg',
        'images/picture13.jpg',
        'images/picture14.jpg',
        'images/picture15.jpg',
        'images/picture16.jpg',
        'images/picture17.jpg',
        'images/picture18.jpg'
    ]
};

// 儲存所有卡牌元素
const cards = [];

// 跟蹤已翻開的卡牌
let firstCard = null;
let secondCard = null;

// 用於倒數計時的變數
let countdownInterval;
let countdown;

// 開始遊戲的功能
// 開始遊戲的功能
function startGame() {
    const selectedMode = modeSelect.value;
    let cardImages = [];

    switch (selectedMode) {
        case '2X2':
            cardImages = [...themes.finger.slice(0, 2), ...themes.finger.slice(0, 2)]; // 2對卡牌 (4張)
            break;
        case '4X4':
            cardImages = [...themes.arabic.slice(0, 8), ...themes.arabic.slice(0, 8)]; // 8對卡牌 (16張)
            break;
        case '6X6':
            // 確保每對卡牌的圖片不重複
            const fingerImages = themes.finger.slice(0, 9); // 取前9張圖片
            const arabicImages = themes.arabic.slice(0, 9); // 取前9張圖片
            cardImages = [...fingerImages, ...fingerImages, ...arabicImages, ...arabicImages]; // 18對卡牌 (36張)
            break;
    }

    shuffle(cardImages); // 打亂卡牌圖片的排列

    // 清空現有的卡牌
    cardContainer.innerHTML = '';
    cards.length = 0; // 清空卡牌數組

    // 設定不同模式的卡片佈局
    switch (selectedMode) {
        case '2X2':
            cardContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
            break;
        case '4X4':
            cardContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
            break;
        case '6X6':
            cardContainer.style.gridTemplateColumns = 'repeat(6, 1fr)'; // 設定 6X6 格式
            break;
    }

    cardImages.forEach((imageSrc) => {
        // 創建卡片的元素
        const card = document.createElement('div');
        card.classList.add('card');
        cards.push(card); // 儲存卡牌以便後續操作
        
        // 創建卡片內部結構
        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');
        
        // 創建正面
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        const frontImage = document.createElement('img');
        frontImage.src = 'images/picture19.jpg'; // 統一正面圖片
        frontImage.alt = 'Front Image';
        frontImage.classList.add('card-image');
        cardFront.appendChild(frontImage);
        
        // 創建背面
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        const backImage = document.createElement('img');
        backImage.src = imageSrc; // 背面隨機圖案
        backImage.alt = 'Back Image';
        backImage.classList.add('card-image');
        cardBack.appendChild(backImage);
        
        // 將正面和背面添加到卡片內部
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        cardContainer.appendChild(card);

        // 添加點擊事件
        card.addEventListener('click', flipCard);
    });

    // 開始倒數計時
    countdown = 10; // 設定倒數計時的秒數
    timerDisplay.textContent = countdown; // 顯示倒數秒數
    countdownInterval = setInterval(() => {
        countdown--;
        timerDisplay.textContent = countdown;
        if (countdown === 0) {
            clearInterval(countdownInterval);
            flipAllCardsBack(); // 倒數結束，翻轉所有卡牌回背面
        }
    }, 1000); // 每秒減少一次
}

// 翻轉所有卡牌到背面
function flipAllCardsBack() {
    cards.forEach(card => {
        card.classList.remove('flipped');
    });
}


// 卡片翻轉的功能
function flipCard() {
    if (this.classList.contains('flipped')) return; // 如果已經翻轉過則不執行

    this.classList.add('flipped'); // 翻轉卡片
    // 檢查是否已翻開兩張卡牌
    if (!firstCard) {
        firstCard = this; // 記錄第一張卡牌
    } else {
        secondCard = this; // 記錄第二張卡牌
        checkMatch(); // 檢查配對
    }
}

// 檢查是否配對成功
function checkMatch() {
    if (firstCard && secondCard) {
        const firstImage = firstCard.querySelector('.card-back img').src;
        const secondImage = secondCard.querySelector('.card-back img').src;

        if (firstImage === secondImage) {
            // 配對成功，隱藏卡牌
            firstCard.remove();
            secondCard.remove();
            
            const correctSound = new Audio('sounds/correct.mp3');
            correctSound.play(); // 播放成功音效
            
            resetCards(); // 重置選擇
        } else {
            const incorrectSound = new Audio('sounds/incorrect.mp3');
            incorrectSound.play(); // 播放失敗音效

            setTimeout(() => {
                firstCard.classList.remove('flipped'); // 錯誤時翻回
                secondCard.classList.remove('flipped');
                resetCards(); // 重置選擇
            }, 1000); // 延遲1秒
        }
    }
}

// 重置已翻轉的卡牌
function resetCards() {
    firstCard = null;
    secondCard = null;
}

// 翻轉所有卡牌到背面
function flipAllCardsBack() {
    cards.forEach(card => {
        card.classList.remove('flipped');
    });
}

// 事件監聽
document.getElementById('startGame').addEventListener('click', startGame);
document.getElementById('flipAllFront').addEventListener('click', () => {
    cards.forEach(card => {
        card.classList.add('flipped');
    });
});
document.getElementById('flipAllBack').addEventListener('click', flipAllCardsBack);
