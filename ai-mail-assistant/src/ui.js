import { marked }          from "https://cdn.jsdelivr.net/npm/marked@9.1.6/+esm";
import { LOADER_MESSAGES } from "./templates.js";

// ─── Referencias a elementos del DOM ──────────────────────────────────────────
export const els = () => ({
  generateBtn:     document.getElementById("generate"),
  btnText:         document.getElementById("btn-text"),
  inputEl:         document.getElementById("input"),
  toneEl:          document.getElementById("tone"),
  langEl:          document.getElementById("lang"),
  modelEl:         document.getElementById("model"),
  modelLabel:      document.getElementById("model-label"),
  loader:          document.getElementById("loader"),
  loaderMsg:       document.getElementById("loader-msg"),
  resultPreview:   document.getElementById("result-preview"),
  resultRaw:       document.getElementById("result-raw"),
  btnPreview:      document.getElementById("btn-preview"),
  btnRaw:          document.getElementById("btn-raw"),
  btnCopy:         document.getElementById("btn-copy"),
  btnTxt:          document.getElementById("btn-txt"),
  btnPdf:          document.getElementById("btn-pdf"),
  btnClear:        document.getElementById("btn-clear"),
  copyToast:       document.getElementById("copy-toast"),
  tokenCountEl:    document.getElementById("token-count"),
  infoToggle:      document.getElementById("info-toggle"),
  infoPanel:       document.getElementById("info-panel"),
  toneBadge:       document.getElementById("tone-badge"),
  btnHistory:      document.getElementById("btn-history"),
  historyPanel:    document.getElementById("history-panel"),
  historyList:     document.getElementById("history-list"),
  btnClearHistory: document.getElementById("btn-clear-history"),
  templatesList:   document.getElementById("templates-list"),
});

// ─── Loader ───────────────────────────────────────────────────────────────────
let loaderInterval = null;

export function startLoader(tone) {
  const { loader, loaderMsg } = els();
  const msgs = LOADER_MESSAGES[tone] || ["Generando tokens..."];
  let i = 0;
  loaderMsg.textContent = msgs[0];
  loaderMsg.classList.remove("fade");
  loader.classList.add("visible");
  loaderInterval = setInterval(() => {
    loaderMsg.classList.add("fade");
    setTimeout(() => {
      i = (i + 1) % msgs.length;
      loaderMsg.textContent = msgs[i];
      loaderMsg.classList.remove("fade");
    }, 250);
  }, 1600);
}

export function stopLoader() {
  const { loader } = els();
  clearInterval(loaderInterval);
  loader.classList.remove("visible");
}

// ─── Markdown: render y append ────────────────────────────────────────────────
export function renderMarkdown(text, state) {
  const { resultPreview, resultRaw } = els();
  state.rawMarkdown = text;
  resultPreview.innerHTML = marked.parse(text);
  resultRaw.value = text;
}

export function appendMarkdown(chunk, state) {
  const { tokenCountEl, resultPreview, resultRaw } = els();
  state.rawMarkdown += chunk;
  state.tokenCount = Math.round(state.rawMarkdown.length / 4);
  tokenCountEl.textContent = state.tokenCount;
  resultPreview.innerHTML = marked.parse(state.rawMarkdown);
  resultRaw.value = state.rawMarkdown;
  resultPreview.scrollTop = resultPreview.scrollHeight;
}

// ─── Vista previa / Markdown raw ──────────────────────────────────────────────
export function initViewToggle(state) {
  const { btnPreview, btnRaw, resultPreview, resultRaw } = els();

  function switchView(view) {
    state.currentView = view;
    const isPreview = view === "preview";
    btnPreview.classList.toggle("active",  isPreview);
    btnRaw.classList.toggle("active",     !isPreview);
    resultPreview.style.display = isPreview ? "block" : "none";
    resultRaw.style.display     = isPreview ? "none"  : "block";
  }

  btnPreview.addEventListener("click", () => switchView("preview"));
  btnRaw.addEventListener("click",     () => switchView("raw"));
}

// ─── Info panel toggle ────────────────────────────────────────────────────────
export function initInfoPanel(state) {
  const { infoToggle, infoPanel } = els();

  function toggleInfoPanel() {
    state.infoPanelOpen = !state.infoPanelOpen;
    infoPanel.classList.toggle("open",  state.infoPanelOpen);
    infoToggle.classList.toggle("active", state.infoPanelOpen);
    if (state.infoPanelOpen && state.historyPanelOpen) toggleHistoryPanel(state);
  }

  infoToggle.addEventListener("click", toggleInfoPanel);
}

// ─── History panel toggle ─────────────────────────────────────────────────────
export function toggleHistoryPanel(state) {
  const { historyPanel, btnHistory } = els();
  state.historyPanelOpen = !state.historyPanelOpen;
  historyPanel.classList.toggle("open",   state.historyPanelOpen);
  btnHistory.classList.toggle("active",   state.historyPanelOpen);
  if (state.historyPanelOpen && state.infoPanelOpen) {
    state.infoPanelOpen = false;
    document.getElementById("info-panel").classList.remove("open");
    document.getElementById("info-toggle").classList.remove("active");
  }
}

// ─── Model badge sync ─────────────────────────────────────────────────────────
export function initModelBadge() {
  const { modelEl, modelLabel } = els();
  modelEl.addEventListener("change", () => {
    modelLabel.textContent = modelEl.value;
  });
}

// ─── Clear result ─────────────────────────────────────────────────────────────
export function initClearResult(state) {
  const { btnClear, tokenCountEl, resultPreview, resultRaw, toneBadge } = els();

  btnClear.addEventListener("click", () => {
    state.rawMarkdown = "";
    state.tokenCount  = 0;
    tokenCountEl.textContent = "0";
    resultPreview.innerHTML  = `<span class="placeholder-text">La respuesta aparecerá aquí...</span>`;
    resultRaw.value          = "";
    toneBadge.style.display  = "none";
  });
}
