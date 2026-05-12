const adminCode = "gamepass";
// ... (seletores de DOM iguais ao anterior) ...

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
    const notes = document.getElementById("giftNotes").value;
    
    await fetch('/api/ideas', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name, notes })
    });
    document.getElementById("giftForm").reset();
    loadAdminData();
}

async function removeIdea(id) {
    await fetch(`/api/ideas?id=${id}`, { method: 'DELETE' });
    loadAdminData();
}

async function removeGift(id) {
    await fetch(`/api/gifts?id=${id}`, { method: 'DELETE' });
    loadAdminData();
}

// Funções de renderização seguem a mesma lógica do script.js 
// mas adicionando os botões de remover que chamam removeIdea(item.id) ou removeGift(item.id)

document.getElementById("giftForm").onsubmit = addIdea;
document.getElementById("adminAccessButton").onclick = () => {
    if(document.getElementById("adminPassword").value === adminCode) {
        document.querySelectorAll(".hidden").forEach(el => el.classList.remove("hidden"));
        loadAdminData();
    }
};