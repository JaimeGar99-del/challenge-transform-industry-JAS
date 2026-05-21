import "./style.css";

// ─── Layout ───────────────────────────────────────────────────────────────────
import { renderAppHTML }     from "./layout.js";

// ─── UI ───────────────────────────────────────────────────────────────────────
import {
  initViewToggle,
  initInfoPanel,
  initModelBadge,
  initClearResult,
} from "./ui.js";

// ─── Plantillas ───────────────────────────────────────────────────────────────
import { renderTemplatePills } from "./templatePills.js";

// ─── Exportaciones ────────────────────────────────────────────────────────────
import { initCopy, initExportTxt, initExportPdf } from "./export.js";

// ─── Historial ────────────────────────────────────────────────────────────────
import { initHistory } from "./history.js";

// ─── Generación IA ───────────────────────────────────────────────────────────
import { initGenerate } from "./generate.js";

// ─── Estado global compartido ─────────────────────────────────────────────────
const state = {
  rawMarkdown:     "",
  isStreaming:     false,
  currentView:     "preview",
  tokenCount:      0,
  infoPanelOpen:   false,
  historyPanelOpen: false,
};

// ─── Bootstrap ────────────────────────────────────────────────────────────────
renderAppHTML();          // 1. Montar HTML en #app

renderTemplatePills();    // 2. Plantillas
initViewToggle(state);    // 3. Toggle preview / markdown
initInfoPanel(state);     // 4. Panel de info/roadmap
initModelBadge();         // 5. Badge del modelo activo
initClearResult(state);   // 6. Botón limpiar resultado

initCopy(state);          // 7. Copiar al portapapeles
initExportTxt(state);     // 8. Exportar TXT
initExportPdf(state);     // 9. Exportar PDF

initHistory(state);       // 10. Historial localStorage

initGenerate(state);      // 11. Generación con Ollama (streaming)
