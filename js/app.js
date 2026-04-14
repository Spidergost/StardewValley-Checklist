let state = loadState();
let activeTabId = TAB_CONFIG[0].id;

const tabsNav = document.getElementById("tabsNav");
const tabContent = document.getElementById("tab-content");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const resetBtn = document.getElementById("resetBtn");
const checkAllBtn = document.getElementById("checkAllBtn");

function updateProgress() {
  const checkboxes = document.querySelectorAll('#tab-content input[type="checkbox"], .hidden-progress-probe');
  const ids = [...document.querySelectorAll('input[type="checkbox"][data-check-id]')].map(input => input.dataset.checkId);

  const uniqueIds = new Set(ids);
  let total = uniqueIds.size;
  let done = 0;

  uniqueIds.forEach(id => {
    if (state[id]) done += 1;
  });

  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  progressText.textContent = `${done} / ${total} objectifs complétés (${percent}%)`;
  progressFill.style.width = `${percent}%`;
}

function bindCheckboxes() {
  const checkboxes = tabContent.querySelectorAll('input[type="checkbox"][data-check-id]');

  checkboxes.forEach(checkbox => {
    const id = checkbox.dataset.checkId;
    checkbox.checked = !!state[id];

    checkbox.addEventListener("change", () => {
      state[id] = checkbox.checked;
      saveState(state);
      updateProgress();
    });
  });
}

async function renderTab(tabId) {
  const tab = TAB_CONFIG.find(item => item.id === tabId);
  if (!tab) return;

  activeTabId = tabId;

  document.querySelectorAll(".tab-button").forEach(button => {
    button.classList.toggle("active", button.dataset.tabId === tabId);
  });

  tabContent.innerHTML = '<div class="loading">Chargement...</div>';

  try {
    const html = await loadTabContent(tab.file);
    tabContent.innerHTML = html;

    if (tab.id === "collections" && typeof window.initCollectionsTab === "function") {
      await window.initCollectionsTab();
    }

    bindCheckboxes();
    updateProgress();
  } catch (error) {
    console.error(error);
    tabContent.innerHTML = `<p class="muted">Erreur de chargement de l'onglet.</p>`;
  }
}

function renderTabsNav() {
  tabsNav.innerHTML = "";

  TAB_CONFIG.forEach(tab => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tab-button";
    button.dataset.tabId = tab.id;
    button.textContent = tab.label;

    button.addEventListener("click", () => {
      renderTab(tab.id);
    });

    tabsNav.appendChild(button);
  });
}

function checkAllCurrentTab() {
  const checkboxes = tabContent.querySelectorAll('input[type="checkbox"][data-check-id]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = true;
    state[checkbox.dataset.checkId] = true;
  });
  saveState(state);
  updateProgress();
}

function resetAll() {
  if (!confirm("Réinitialiser toute la progression ?")) return;
  state = {};
  clearState();
  renderTab(activeTabId);
  updateProgress();
}

async function initApp() {
  renderTabsNav();
  await renderTab(activeTabId);
}

checkAllBtn.addEventListener("click", checkAllCurrentTab);
resetBtn.addEventListener("click", resetAll);

initApp();