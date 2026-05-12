const adminCode = "gamepass";
const giftForm = document.getElementById("giftForm");

async function loadAdminData() {
    const [resIdeas, resGifts] = await Promise.all([
        fetch('/api/ideas'),
        fetch('/api/gifts')
    ]);
    renderAdminIdeas(await resIdeas.json());
    renderAdminGifts(await resGifts.json());
}

async function addIdea(e) {
    e.preventDefault();
    const name = document.getElementById("giftName").value;
    const image = document.getElementById("giftImage").value;
    const notes = document.getElementById("giftNotes").value;
    
    await fetch('/api/ideas', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name, notes, image })
    });
    giftForm.reset();
    loadAdminData();
}

function renderAdminIdeas(ideas) {
    const list = document.getElementById("adminIdeaList");
    list.innerHTML = "";
    ideas.forEach(item => {
        const card = document.createElement("div");
        card.className = "suggestion-card";
        const imgHtml = item.image ? `<img src="${item.image}" class="gift-image">` : '';
        card.innerHTML = `
            ${imgHtml}
            <strong>${item.name}</strong>
            <button class="remove-btn" onclick="removeIdea(${item.id})">Remover Ideia</button>
        `;
        list.appendChild(card);
    });
}

function renderAdminGifts(gifts) {
    const list = document.getElementById("giftList");
    list.innerHTML = "";
    document.getElementById("count").textContent = `${gifts.length} itens`;
    gifts.forEach(item => {
        const li = document.createElement("li");
        li.className = `gift-item ${!item.image ? 'no-image' : ''}`;
        const imgHtml = item.image ? `<img src="${item.image}" class="gift-image">` : '';
        li.innerHTML = `
            ${imgHtml}
            <div><strong>${item.name}</strong></div>
            <button class="remove-btn" onclick="removeGift(${item.id})">Eliminar</button>
        `;
        list.appendChild(li);
    });
}

async function removeIdea(id) {
    await fetch(`/api/ideas?id=${id}`, { method: 'DELETE' });
    loadAdminData();
}

async function removeGift(id) {
    await fetch(`/api/gifts?id=${id}`, { method: 'DELETE' });
    loadAdminData();
}

giftForm.onsubmit = addIdea;
document.getElementById("adminAccessButton").onclick = () => {
    if(document.getElementById("adminPassword").value === adminCode) {
        document.querySelectorAll(".hidden").forEach(el => el.classList.remove("hidden"));
        loadAdminData();
    }
};