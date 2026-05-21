import { TEMPLATES } from "./templates.js";
import { els }       from "./ui.js";

// ─── Renderizar pills de plantillas ──────────────────────────────────────────
export function renderTemplatePills() {
  const { templatesList, inputEl, toneEl } = els();

  templatesList.innerHTML = TEMPLATES.map((t, i) => `
    <button class="template-pill" data-index="${i}">${t.label}</button>
  `).join("");

  templatesList.querySelectorAll(".template-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      const t   = TEMPLATES[+btn.dataset.index];
      inputEl.value = t.text;
      const opt = [...toneEl.options].find(o => o.value === t.tone);
      if (opt) toneEl.value = t.tone;
      inputEl.focus();
    });
  });
}
