const adminPasswordInput = document.getElementById("adminPassword");
const adminAccessButton = document.getElementById("adminAccessButton");
const adminMessage = document.getElementById("adminMessage");
const formCard = document.querySelector(".form-card");
const adminIdeaSection = document.getElementById("adminIdeaSection");
const adminListSection = document.getElementById("adminListSection");
const adminIdeaList = document.getElementById("adminIdeaList");
const giftForm = document.getElementById("giftForm");
const giftNameInput = document.getElementById("giftName");
const giftImageInput = document.getElementById("giftImage");
const giftNotesInput = document.getElementById("giftNotes");
const giftList = document.getElementById("giftList");
const countLabel = document.getElementById("count");

const STORAGE_IDEAS = "giftIdeas";
const STORAGE_GIFTS = "giftList";
const SYNC_KEY = "giftSync";
const adminCode = "gamepass"; // Senha padrão

let giftIdeas = loadData(STORAGE_IDEAS, []);
let gifts = loadData(STORAGE_GIFTS, []);

function loadData(key, fallback) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  localStorage.setItem(SYNC_KEY, Date.now().toString());
}

function renderAdmin() {
  renderAdminIdeas();
  renderAdminList();
}

function renderAdminIdeas() {
  adminIdeaList.innerHTML = "";
  giftIdeas.forEach((idea, index) => {
    const card = document.createElement("div");
    card.className = "suggestion-card";
    let html = "";
    if (idea.image) {
      html += `<img class="gift-image" src="${idea.image}" alt="${idea.name}">`;
    }
    html += `<strong>${idea.name}</strong><p>${idea.notes || ""}</p>`;
    card.innerHTML = html;
    
    const btn = document.createElement("button");
    btn.textContent = "Remover Ideia";
    btn.className = "remove-btn";
    btn.onclick = () => {
      giftIdeas.splice(index, 1);
      saveData(STORAGE_IDEAS, giftIdeas);
      renderAdminIdeas();
    };
    
    card.appendChild(btn);
    adminIdeaList.appendChild(card);
  });
}

function renderAdminList() {
  giftList.innerHTML = "";
  countLabel.textContent = `${gifts.length} item${gifts.length === 1 ? "" : "s"}`;
  
  gifts.forEach((gift, index) => {
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
    
    const delBtn = document.createElement("button");
    delBtn.textContent = "Eliminar";
    delBtn.className = "remove-btn";
    delBtn.onclick = () => {
      gifts.splice(index, 1);
      saveData(STORAGE_GIFTS, gifts);
      renderAdminList();
    };
    
    li.appendChild(delBtn);
    giftList.appendChild(li);
  });
}

adminAccessButton.addEventListener("click", () => {
  if (adminPasswordInput.value === adminCode) {
    formCard.classList.remove("hidden");
    adminIdeaSection.classList.remove("hidden");
    adminListSection.classList.remove("hidden");
    adminMessage.textContent = "Acesso autorizado.";
    adminMessage.style.color = "var(--primary)";
    renderAdmin();
  } else {
    adminMessage.textContent = "Senha incorreta.";
    adminMessage.style.color = "#ff6a6a";
  }
});

giftForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = giftNameInput.value.trim();
  const image = giftImageInput.value.trim();
  const notes = giftNotesInput.value.trim();
  
  if (name) {
    giftIdeas.push({ name, image, notes });
    saveData(STORAGE_IDEAS, giftIdeas);
    giftForm.reset();
    renderAdminIdeas();
  }
});

// Sync
window.addEventListener("storage", () => {
  giftIdeas = loadData(STORAGE_IDEAS, []);
  gifts = loadData(STORAGE_GIFTS, []);
  renderAdmin();
});