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
        'images/picture8.jpg'
    ],
    arabic: [
        'images/picture9.jpg',
        'images/picture10.jpg',
        'images/picture11.jpg',
        'images/picture12.jpg',
        'images/picture13.jpg',
        'images/picture14.jpg',
        'images/picture15.jpg',
        'images/picture16.jpg'
    ]
};

// 儲存所有卡牌元素
const cards = [];
let firstCard = null;
let secondCard = null;
let countdownInterval;
let countdown;

// 開始遊戲的功能
function startGame() {
    const selectedMode = modeSelect.value;
    let cardCount;

    switch (selectedMode) {
        case '2X2':
            cardCount = 4; // 2對
            break;
        case '4X4':
            cardCount = 16; // 8對
            break;
        case '6X6':
            cardCount = 36; // 18對
            break;
    }

    const selectedTheme = 'finger'; // 使用手指版作為範例
    const cardImages = [...themes[selectedTheme].slice(0, cardCount / 2), ...themes[selectedTheme].slice(0, cardCount / 2)];
    shuffle(cardImages);

    // 清空現有的卡牌
    cardContainer.innerHTML = '';
    cards.length = 0;

    clearInterval(countdownInterval);
    countdown = 10;
    timerDisplay.textContent = countdown;

    cardImages.forEach((imageSrc) => {
        const card = document.createElement('div');
        card.classList.add('card');
        cards.push(card);

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        const frontImage = document.createElement('img');
        frontImage.src = 'images/picture19.jpg'; // 統一正面圖片
        frontImage.alt = 'Front Image';
        frontImage.classList.add('card-image');
        cardFront.appendChild(frontImage);

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        const backImage = document.createElement('img');
        backImage.src = imageSrc;
        backImage.alt = 'Back Image';
        backImage.classList.add('card-image');
        cardBack.appendChild(backImage);

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        cardContainer.appendChild(card);

        card.addEventListener('click', flipCard);
    });

    countdownInterval = setInterval(() => {
        countdown--;
        timerDisplay.textContent = countdown;
        if (countdown === 0) {
            clearInterval(countdownInterval);
            flipAllCardsFront();
        }
    }, 1000);
}

// 卡片翻轉的功能
function flipCard() {
    if (this.classList.contains('flipped')) return;

    this.classList.add('flipped');
    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        checkMatch();
    }
}

// 檢查是否配對成功
function checkMatch() {
    if (firstCard && secondCard) {
        const firstImage = firstCard.querySelector('.card-back img').src;
        const secondImage = secondCard.querySelector('.card-back img').src;

        if (firstImage === secondImage) {
            firstCard.remove(); // 配對成功，隱藏卡牌
            secondCard.remove();
            
            const correctSound = new Audio('sounds/correct.mp3');
            correctSound.play();
            
            resetCards();
        } else {
            const incorrectSound = new Audio('sounds/incorrect.mp3');
            incorrectSound.play();

            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                resetCards();
            }, 1000);
        }
    }
}

// 重置已翻轉的卡牌
function resetCards() {
    firstCard = null;
    secondCard = null;
}

// 翻轉所有卡牌到正面
function flipAllCardsFront() {
    cards.forEach(card => {
        card.classList.add('flipped');
    });
}

// 事件監聽
document.getElementById('startGame').addEventListener('click', startGame);
