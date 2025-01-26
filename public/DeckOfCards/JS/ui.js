
export function updateOutput(message) {
    document.getElementById('output').innerText = message;
}

export function displayCard(card) {
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = `
        <div class="card ${card.suit}">
            <div class="value">${card.value}</div>
            <div class="suit">${getSuitSymbol(card.suit)}</div>
        </div>
    `;
}

export function clearUI() {
    document.getElementById('cardContainer').innerHTML = '';
    document.getElementById('discardContainer').innerHTML = '';
    updateOutput("New deck created! Deck is shuffled and ready.");
}

export function addToDiscardPile(card) {
    const discardContainer = document.getElementById('discardContainer');
    const cardElement = document.createElement('div');
    cardElement.classList.add('card-placeholder', 'discard-card', card.suit);

    // Sett overlapp-effekt og z-index for visning (AI - generert sammen med CSS)
    cardElement.style.setProperty('--index', discardContainer.childElementCount);
    cardElement.style.top = `${discardContainer.childElementCount * 5}px`;  
    cardElement.style.zIndex = discardContainer.childElementCount;  

    cardElement.innerHTML = `
        <div class="value">${card.value}</div>
        <div class="suit">${getSuitSymbol(card.suit)}</div>
    `;

    discardContainer.appendChild(cardElement);
}

function getSuitSymbol(suit) {
    switch (suit) {
        case 'hearts': 
        return '♥';

        case 'diamonds': 
        return '♦';

        case 'clubs': 
        return '♣';

        case 'spades': 
        return '♠';

        default: 
        return '';
    }
}

//AI - generert sammen med CSS
document.addEventListener('DOMContentLoaded', () => {
    const cardBacks = document.querySelectorAll('.card-back');

    cardBacks.forEach(cardBack => {
        for (let i = 0; i < 30; i++) {
            const star = document.createElement('span');
            star.innerHTML = '★';

            const left = Math.random() * 100;
            const top = Math.random() * 100;
            star.style.left = `${left}%`;
            star.style.top = `${top}%`;

            const size = Math.floor(Math.random() * (30 - 10) + 10);
            star.style.fontSize = `${size}px`;

            const colors = ['yellow', 'orange', 'lightblue', 'white'];
            star.style.color = colors[Math.floor(Math.random() * colors.length)];

            star.style.animation = `twinkling ${Math.random() * 3 + 2}s infinite alternate ease-in-out`;

            cardBack.appendChild(star);
        }
    });
});