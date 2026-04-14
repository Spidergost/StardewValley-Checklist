const TAB_CONFIG = [
  { id: "farm", label: "Ferme & progression", file: "./tabs/farm.html" },
  { id: "skills", label: "Compétences", file: "./tabs/skills.html" },
  { id: "collections", label: "Collections", file: "./tabs/collections.html" },
  { id: "relations", label: "Relations", file: "./tabs/relations.html" },
  { id: "special", label: "Objectifs spéciaux", file: "./tabs/special.html" }
];

async function loadTabContent(filePath) {
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`Impossible de charger ${filePath}`);
  }
  return response.text();
}