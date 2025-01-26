const API_BASE_URL = '/temp';

export async function createDeck() {
    const response = await fetch(`${API_BASE_URL}/deck`, { method: 'POST' });
    return await response.json();
}

export async function drawCard(deckId) {
    const response = await fetch(`${API_BASE_URL}/deck/draw/${deckId}`);
    return await response.json();
}

export async function shuffleDeck(deckId) {
    await fetch(`${API_BASE_URL}/deck/shuffle/${deckId}`, { method: 'PATCH' });
}

export async function reshuffleDeck(deckId) {
    const response = await fetch(`${API_BASE_URL}/deck/reshuffle/${deckId}`, { method: 'PATCH' });
    return await response.json();
}