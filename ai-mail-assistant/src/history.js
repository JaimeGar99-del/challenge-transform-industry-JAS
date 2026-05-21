import { els, renderMarkdown, toggleHistoryPanel } from "./ui.js";

const HISTORY_KEY = "ai-mail-history";
const MAX_HISTORY = 20;

// ─── Cargar historial desde localStorage ─────────────────────────────────────
export function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
  catch { return []; }
}

// ─── Guardar entrada en historial ─────────────────────────────────────────────
export function saveToHistory(entry) {
  const history = loadHistory();
  history.unshift(entry);
  if (history.length > MAX_HISTORY) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// ─── Renderizar lista del historial ──────────────────────────────────────────
export function renderHistory(state) {
  const { historyList, toneBadge, tokenCountEl } = els();
  const history = loadHistory();

  if (!history.length) {
    historyList.innerHTML = `<span class="placeholder-text">No hay correos en el historial.</span>`;
    return;
  }

  historyList.innerHTML = history.map((item, i) => `
    <div class="history-item" data-index="${i}">
      <div class="history-item-meta">
        <span class="history-tone">${item.tone}</span>
        <span class="history-date">${item.date}</span>
      </div>
      <div class="history-preview">${item.preview}</div>
      <div class="history-actions">
        <button class="action-btn history-load"   data-index="${i}">📂 Cargar</button>
        <button class="action-btn history-delete" data-index="${i}">🗑️</button>
      </div>
    </div>
  `).join("");

  // Cargar correo desde historial
  historyList.querySelectorAll(".history-load").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = loadHistory()[+btn.dataset.index];
      if (!item) return;
      renderMarkdown(item.content, state);
      toneBadge.textContent      = item.tone;
      toneBadge.style.display    = "inline-block";
      tokenCountEl.textContent   = Math.round(item.content.length / 4);
      toggleHistoryPanel(state);
    });
  });

  // Eliminar entrada individual
  historyList.querySelectorAll(".history-delete").forEach(btn => {
    btn.addEventListener("click", () => {
      const hist = loadHistory();
      hist.splice(+btn.dataset.index, 1);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
      renderHistory(state);
    });
  });
}

// ─── Limpiar historial completo ───────────────────────────────────────────────
export function initHistory(state) {
  const { btnHistory, btnClearHistory } = els();

  btnHistory.addEventListener("click", () => {
    toggleHistoryPanel(state);
    if (state.historyPanelOpen) renderHistory(state);
  });

  btnClearHistory.addEventListener("click", () => {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory(state);
  });
}
