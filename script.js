const ideaList = document.getElementById("ideaList");
const giftList = document.getElementById("giftList");
const countLabel = document.getElementById("count");

async function loadFromDatabase() {
    try {
        const [resIdeas, resGifts] = await Promise.all([
            fetch('/api/ideas'),
            fetch('/api/gifts')
        ]);
        renderIdeas(await resIdeas.json());
        renderGifts(await resGifts.json());
    } catch (e) { console.error("Erro ao carregar:", e); }
}

function renderIdeas(ideas) {
    ideaList.innerHTML = "";
    ideas.forEach(idea => {
        const card = document.createElement("div");
        card.className = "suggestion-card";
        
        const imgHtml = idea.image ? `<img src="${idea.image}" class="gift-image" alt="${idea.name}">` : '';
        
        card.innerHTML = `
            ${imgHtml}
            <strong>${idea.name}</strong>
            <p>${idea.notes || ""}</p>
        `;
        card.onclick = () => selectGift(idea.name, idea.notes, idea.image);
        ideaList.appendChild(card);
    });
}

async function selectGift(name, notes, image) {
    await fetch('/api/gifts', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name, notes, image })
    });
    loadFromDatabase();
}

function renderGifts(gifts) {
    giftList.innerHTML = "";
    countLabel.textContent = `${gifts.length} item${gifts.length === 1 ? '' : 's'}`;
    gifts.forEach(gift => {
        const li = document.createElement("li");
        li.className = `gift-item ${!gift.image ? 'no-image' : ''}`;
        
        const imgHtml = gift.image ? `<img src="${gift.image}" class="gift-image" alt="${gift.name}">` : '';
        
        li.innerHTML = `
            ${imgHtml}
            <div>
                <strong>${gift.name}</strong>
                <p>${gift.notes || ""}</p>
            </div>
        `;
        giftList.appendChild(li);
    });
}

loadFromDatabase();
setInterval(loadFromDatabase, 5000);