const ideaList = document.getElementById("ideaList");
const giftList = document.getElementById("giftList");
const countLabel = document.getElementById("count");
const refreshButton = document.getElementById("refreshButton");

async function loadFromDatabase() {
    try {
        const [resIdeas, resGifts] = await Promise.all([
            fetch('/api/ideas'),
            fetch('/api/gifts')
        ]);
        const ideas = await resIdeas.json();
        const gifts = await resGifts.json();
        
        renderIdeas(ideas);
        renderGifts(gifts);
    } catch (e) { console.error("Erro ao carregar:", e); }
}

function renderIdeas(ideas) {
    ideaList.innerHTML = "";
    ideas.forEach(idea => {
        const card = document.createElement("div");
        card.className = "suggestion-card";
        card.innerHTML = `<strong>${idea.name}</strong><p>${idea.notes || ""}</p>`;
        card.onclick = () => selectGift(idea.name, idea.notes);
        ideaList.appendChild(card);
    });
}

async function selectGift(name, notes) {
    await fetch('/api/gifts', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name, notes })
    });
    loadFromDatabase();
}

function renderGifts(gifts) {
    giftList.innerHTML = "";
    countLabel.textContent = `${gifts.length} item${gifts.length === 1 ? '' : 's'}`;
    gifts.forEach(gift => {
        const li = document.createElement("li");
        li.className = "gift-item";
        li.innerHTML = `<div><strong>${gift.name}</strong><p>${gift.notes || ""}</p></div>`;
        giftList.appendChild(li);
    });
}

refreshButton.onclick = loadFromDatabase;
loadFromDatabase(); // Carrega ao abrir
setInterval(loadFromDatabase, 5000); // Auto-refresh a cada 5 segundos