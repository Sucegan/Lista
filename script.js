const ideaList = document.getElementById("ideaList");
const giftList = document.getElementById("giftList");
const countLabel = document.getElementById("count");

const STORAGE_IDEAS = "giftIdeas";
const STORAGE_GIFTS = "giftList";
const SYNC_KEY = "giftSync";

let giftIdeas = loadData(STORAGE_IDEAS, []);
let gifts = loadData(STORAGE_GIFTS, []);
let lastSync = localStorage.getItem(SYNC_KEY) || "";

window.setInterval(() => {
  const currentSync = localStorage.getItem(SYNC_KEY) || "";
  if (currentSync !== lastSync) {
    lastSync = currentSync;
    giftIdeas = loadData(STORAGE_IDEAS, []);
    gifts = loadData(STORAGE_GIFTS, []);
    render();
  }
}, 1000);

function loadData(key, fallback) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  localStorage.setItem(SYNC_KEY, Date.now().toString());
}

// Sincronização automática entre abas
window.addEventListener("storage", (e) => {
  if ([STORAGE_IDEAS, STORAGE_GIFTS, SYNC_KEY].includes(e.key)) {
    giftIdeas = loadData(STORAGE_IDEAS, []);
    gifts = loadData(STORAGE_GIFTS, []);
    render();
  }
});


function render() {
  renderIdeas();
  renderList();
}

function renderIdeas() {
  ideaList.innerHTML = "";
  if (giftIdeas.length === 0) {
    ideaList.innerHTML = '<p class="subtitle">Nenhuma sugestão disponível.</p>';
    return;
  }

  giftIdeas.forEach((idea) => {
    const card = document.createElement("div");
    card.className = "suggestion-card";
    let html = "";
    if (idea.image) {
      html += `<img class="gift-image" src="${idea.image}" alt="${idea.name}">`;
    }
    html += `<strong>${idea.name}</strong><p>${idea.notes || "Sem observações."}</p>`;
    card.innerHTML = html;
    
    card.addEventListener("click", () => {
      gifts.push({ name: idea.name, image: idea.image, notes: idea.notes });
      saveData(STORAGE_GIFTS, gifts);
      renderList();
    });
    
    ideaList.appendChild(card);
  });
}

function renderList() {
  giftList.innerHTML = "";
  countLabel.textContent = `${gifts.length} item${gifts.length === 1 ? "" : "s"}`;

  if (gifts.length === 0) {
    giftList.innerHTML = '<li class="subtitle">Lista vazia.</li>';
    return;
  }

  gifts.forEach((gift) => {
    const li = document.createElement("li");
    li.className = "gift-item";
    let content = "";
    if (gift.image) {
      content += `<img class="gift-image" src="${gift.image}" alt="${gift.name}">`;
    } else {
      li.classList.add("no-image");
    }
    content += `<div><strong>${gift.name}</strong><p>${gift.notes || ""}</p></div>`;
    li.innerHTML = content;
    giftList.appendChild(li);
  });
}

render();