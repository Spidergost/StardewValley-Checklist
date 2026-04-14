async function loadTextList(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Impossible de charger le fichier : ${path}`);
  }

  const text = await response.text();

  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .filter(line => !line.startsWith("#"));
}

function createCollectionCheckbox({ groupId, itemLabel }) {
  const wrapper = document.createElement("label");
  wrapper.className = "check-item";

  const input = document.createElement("input");
  input.type = "checkbox";
  input.dataset.checkId = `${groupId}-${slugify(itemLabel)}`;

  const span = document.createElement("span");
  span.textContent = itemLabel;

  wrapper.appendChild(input);
  wrapper.appendChild(span);

  return wrapper;
}

async function renderArtifactsList() {
  const container = document.getElementById("artifacts-list");
  if (!container) return;

  container.innerHTML = '<div class="muted">Chargement des artéfacts...</div>';

  try {
    const artifacts = await loadTextList("./data/artifacts_fr");

    container.innerHTML = "";

    if (artifacts.length === 0) {
      container.innerHTML = '<div class="muted">Aucun artéfact trouvé dans data/artifacts_fr.</div>';
      return;
    }

    artifacts.forEach(name => {
      const item = createCollectionCheckbox({
        groupId: "collections-artifact",
        itemLabel: name
      });

      container.appendChild(item);
    });
  } catch (error) {
    console.error(error);
    container.innerHTML =
      '<div class="muted">Erreur lors du chargement des artéfacts.</div>';
  }
}

async function initCollectionsTab() {
  await renderArtifactsList();
}

window.initCollectionsTab = initCollectionsTab;