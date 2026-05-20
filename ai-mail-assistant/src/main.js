import "./style.css";
import { marked } from "https://cdn.jsdelivr.net/npm/marked@9.1.6/+esm";

// ─── Plantillas predefinidas ───────────────────────────────────────────────────
const TEMPLATES = [
  { label: "Cliente molesto",    tone: "empático",    text: "Necesito responder a un cliente molesto por un retraso en la entrega. El pedido llegó 3 días tarde y quiere una explicación y compensación." },
  { label: "Seguimiento oferta", tone: "persuasivo",  text: "Quiero hacer seguimiento a una propuesta comercial que enviamos hace 1 semana. El cliente aún no ha respondido y me interesa cerrar el trato." },
  { label: "Reunión urgente",    tone: "urgente",     text: "Necesito convocar a mi equipo a una reunión urgente mañana a las 9am para revisar los resultados del proyecto antes de la presentación con el cliente." },
  { label: "Agradecimiento",     tone: "amigable",    text: "Quiero agradecer a un cliente fiel por 2 años de trabajo juntos y aprovechar para informarle sobre nuestros nuevos servicios." },
  { label: "Solicitud de pago",  tone: "diplomático", text: "Necesito recordarle a un cliente que tiene una factura vencida hace 15 días. Es un cliente importante y quiero mantener la relación." },
  { label: "Presentación",       tone: "formal",      text: "Me presento ante un nuevo contacto empresarial al que me refirió un colega. Quiero explorar posibles sinergias entre nuestras empresas." },
];

// ─── Template HTML ────────────────────────────────────────────────────────────
const app = document.querySelector("#app");

app.innerHTML = `
  <main class="container">

    <header class="app-header">
      <div class="header-left">
        <div class="header-icon">✉</div>
        <div>
          <h1>AI Mail Assistant</h1>
          <p class="subtitle">Comunicación empresarial con IA</p>
        </div>
      </div>
      <div class="header-right">
        <div class="model-badge">
          <span class="dot"></span>
          <span id="model-label">tinyllama</span>
        </div>
        <button class="icon-btn" id="btn-history" title="Historial de correos">🕐</button>
        <button class="info-toggle" id="info-toggle" title="Ver tecnologías y roadmap">ℹ</button>
      </div>
    </header>

    <!-- ── Info Panel ── -->
    <div class="info-panel" id="info-panel">
      <div class="info-grid">
        <div class="info-section">
          <div class="info-section-title"><span class="info-icon">⚙️</span> TECNOLOGÍAS</div>
          <div class="tech-list">
            <div class="tech-item"><span class="tech-badge vite">VITE</span><span class="tech-desc">Build tool ultrarrápido con HMR nativo</span></div>
            <div class="tech-item"><span class="tech-badge js">JS</span><span class="tech-desc">JavaScript Vanilla — sin frameworks, máximo control</span></div>
            <div class="tech-item"><span class="tech-badge ollama">OLLAMA</span><span class="tech-desc">Motor LLM local vía API REST en localhost:11434</span></div>
            <div class="tech-item"><span class="tech-badge phi">PHI-3</span><span class="tech-desc">Modelo base — soporta tinyllama, llama3, mistral</span></div>
            <div class="tech-item"><span class="tech-badge marked">MARKED</span><span class="tech-desc">Renderizado Markdown en tiempo real con streaming</span></div>
          </div>
        </div>
        <div class="info-section">
          <div class="info-section-title"><span class="info-icon">🗺️</span> ROADMAP</div>
          <div class="roadmap-list">
            <div class="roadmap-item done"><span class="road-status">✓</span><div class="road-content"><span class="road-title">Streaming en tiempo real</span><span class="road-desc">Respuesta token a token vía ReadableStream</span></div></div>
            <div class="roadmap-item done"><span class="road-status">✓</span><div class="road-content"><span class="road-title">Exportar TXT / PDF</span><span class="road-desc">Descarga directa como archivo</span></div></div>
            <div class="roadmap-item done"><span class="road-status">✓</span><div class="road-content"><span class="road-title">Render Markdown</span><span class="road-desc">Vista previa y modo fuente alternables</span></div></div>
            <div class="roadmap-item done"><span class="road-status">✓</span><div class="road-content"><span class="road-title">Multi idioma</span><span class="road-desc">Español, Inglés, Portugués, Francés</span></div></div>
            <div class="roadmap-item done"><span class="road-status">✓</span><div class="road-content"><span class="road-title">Historial de correos</span><span class="road-desc">Persistencia en localStorage</span></div></div>
            <div class="roadmap-item done"><span class="road-status">✓</span><div class="road-content"><span class="road-title">Plantillas inteligentes</span><span class="road-desc">Casos de uso predefinidos</span></div></div>
            <div class="roadmap-item pending"><span class="road-status">○</span><div class="road-content"><span class="road-title">Modularizar componentes</span><span class="road-desc">Separar en módulos ES reutilizables</span></div></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Historial Panel ── -->
    <div class="history-panel" id="history-panel">
      <div class="history-header">
        <span class="info-section-title" style="margin:0">🕐 HISTORIAL</span>
        <button class="action-btn" id="btn-clear-history">🗑️ Limpiar todo</button>
      </div>
      <div class="history-list" id="history-list">
        <span class="placeholder-text">No hay correos en el historial.</span>
      </div>
    </div>

    <!-- ── Plantillas ── -->
    <div class="templates-bar" id="templates-bar">
      <span class="templates-label">Plantillas:</span>
      <div class="templates-list" id="templates-list"></div>
    </div>

    <div class="editor-grid">

      <!-- Input Panel -->
      <div class="panel input-panel">
        <label class="panel-label">CONTEXTO DEL CORREO</label>
        <textarea id="input" placeholder="Ej: Necesito responder a un cliente molesto por un retraso en la entrega..."></textarea>

        <div class="divider"></div>

        <div class="controls-row">
          <div class="field-group">
            <label class="field-label" for="tone">TONO</label>
            <select id="tone">
              <option value="formal">Formal</option>
              <option value="amigable">Amigable</option>
              <option value="profesional" selected>Profesional</option>
              <option value="empático">Empático</option>
              <option value="persuasivo">Persuasivo</option>
              <option value="asertivo">Asertivo</option>
              <option value="urgente">Urgente</option>
              <option value="conciso">Conciso</option>
              <option value="diplomático">Diplomático</option>
              <option value="entusiasta">Entusiasta</option>
            </select>
          </div>
          <div class="field-group">
            <label class="field-label" for="lang">IDIOMA</label>
            <select id="lang">
              <option value="español" selected>Español</option>
              <option value="inglés">English</option>
              <option value="portugués">Português</option>
              <option value="francés">Français</option>
            </select>
          </div>
          <div class="field-group">
            <label class="field-label" for="model">MODELO</label>
            <select id="model">
              <option value="tinyllama" selected>tinyllama</option>
              <option value="phi3">phi3</option>
              <option value="llama3">llama3</option>
              <option value="mistral">mistral</option>
            </select>
          </div>
        </div>

        <button id="generate" class="btn-generate">
          <span class="btn-icon">✦</span>
          <span id="btn-text">Generar correo</span>
        </button>

        <div class="loader-wrap" id="loader">
          <div class="eq-bars" aria-hidden="true">
            <span></span><span></span><span></span><span></span>
          </div>
          <span class="loader-msg" id="loader-msg">Generando tokens...</span>
        </div>
      </div>

      <!-- Result Panel -->
      <div class="panel result-panel">
        <div class="result-header">
          <label class="panel-label">RESPUESTA IA</label>
          <div class="result-header-right">
            <div class="token-counter">
              <span id="token-count">0</span>&nbsp;tokens
            </div>
            <div class="view-toggle">
              <button class="toggle-btn active" id="btn-preview">Vista previa</button>
              <button class="toggle-btn" id="btn-raw">Markdown</button>
            </div>
          </div>
        </div>

        <div class="result-wrapper">
          <div id="result-preview" class="result markdown-body">
            <span class="placeholder-text">La respuesta aparecerá aquí...</span>
          </div>
          <textarea id="result-raw" class="result result-raw" style="display:none;" readonly></textarea>
        </div>

        <div class="action-bar">
          <button class="action-btn" id="btn-copy">📋 Copiar</button>
          <button class="action-btn" id="btn-txt">📄 TXT</button>
          <button class="action-btn" id="btn-pdf">📑 PDF</button>
          <button class="action-btn" id="btn-clear">🗑️ Limpiar</button>
          <span class="tone-badge" id="tone-badge" style="display:none;"></span>
          <div id="copy-toast" class="toast">¡Copiado!</div>
        </div>
      </div>

    </div>
  </main>
`;

// ─── State ────────────────────────────────────────────────────────────────────
let rawMarkdown  = "";
let isStreaming  = false;
let currentView  = "preview";
let tokenCount   = 0;

// ─── Elements ─────────────────────────────────────────────────────────────────
const generateBtn     = document.getElementById("generate");
const btnText         = document.getElementById("btn-text");
const inputEl         = document.getElementById("input");
const toneEl          = document.getElementById("tone");
const langEl          = document.getElementById("lang");
const modelEl         = document.getElementById("model");
const modelLabel      = document.getElementById("model-label");
const loader          = document.getElementById("loader");
const loaderMsg       = document.getElementById("loader-msg");
const resultPreview   = document.getElementById("result-preview");
const resultRaw       = document.getElementById("result-raw");
const btnPreview      = document.getElementById("btn-preview");
const btnRaw          = document.getElementById("btn-raw");
const btnCopy         = document.getElementById("btn-copy");
const btnTxt          = document.getElementById("btn-txt");
const btnPdf          = document.getElementById("btn-pdf");
const btnClear        = document.getElementById("btn-clear");
const copyToast       = document.getElementById("copy-toast");
const tokenCountEl    = document.getElementById("token-count");
const infoToggle      = document.getElementById("info-toggle");
const infoPanel       = document.getElementById("info-panel");
const toneBadge       = document.getElementById("tone-badge");
const btnHistory      = document.getElementById("btn-history");
const historyPanel    = document.getElementById("history-panel");
const historyList     = document.getElementById("history-list");
const btnClearHistory = document.getElementById("btn-clear-history");
const templatesList   = document.getElementById("templates-list");

// ─── Loader messages per tone ─────────────────────────────────────────────────
const LOADER_MESSAGES = {
  formal:      ["Redactando con precisión...", "Ajustando tono ejecutivo...", "Verificando estructura..."],
  amigable:    ["Añadiendo calidez...", "Eligiendo las palabras correctas...", "Poniendo buena vibra..."],
  profesional: ["Estructurando el mensaje...", "Optimizando claridad...", "Finalizando redacción..."],
  persuasivo:  ["Construyendo argumentos...", "Aplicando persuasión...", "Puliendo el llamado a la acción..."],
  empático:    ["Procesando el contexto...", "Eligiendo palabras que conectan...", "Humanizando el mensaje..."],
  asertivo:    ["Estableciendo el punto...", "Equilibrando firmeza...", "Revisando claridad..."],
  urgente:     ["Priorizando el mensaje...", "Transmitiendo urgencia...", "Verificando tono..."],
  conciso:     ["Eliminando lo innecesario...", "Condensando la idea...", "Optimizando brevedad..."],
  diplomático: ["Suavizando el enfoque...", "Buscando términos neutros...", "Calibrando tacto..."],
  entusiasta:  ["Cargando energía positiva...", "Eligiendo frases motivadoras...", "Añadiendo chispa..."],
};

let loaderInterval = null;

// ─── UI: Loader ───────────────────────────────────────────────────────────────
function startLoader(tone) {
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

function stopLoader() {
  clearInterval(loaderInterval);
  loader.classList.remove("visible");
}

// ─── UI: Markdown render ──────────────────────────────────────────────────────
function renderMarkdown(text) {
  rawMarkdown = text;
  resultPreview.innerHTML = marked.parse(text);
  resultRaw.value = text;
}

function appendMarkdown(chunk) {
  rawMarkdown += chunk;
  tokenCount = Math.round(rawMarkdown.length / 4);
  tokenCountEl.textContent = tokenCount;
  resultPreview.innerHTML = marked.parse(rawMarkdown);
  resultRaw.value = rawMarkdown;
  resultPreview.scrollTop = resultPreview.scrollHeight;
}

// ─── UI: View toggle ──────────────────────────────────────────────────────────
function switchView(view) {
  currentView = view;
  const isPreview = view === "preview";
  btnPreview.classList.toggle("active", isPreview);
  btnRaw.classList.toggle("active", !isPreview);
  resultPreview.style.display = isPreview ? "block" : "none";
  resultRaw.style.display     = isPreview ? "none"  : "block";
}
btnPreview.addEventListener("click", () => switchView("preview"));
btnRaw.addEventListener("click",     () => switchView("raw"));

// ─── UI: Info panel toggle ────────────────────────────────────────────────────
let infoPanelOpen = false;
function toggleInfoPanel() {
  infoPanelOpen = !infoPanelOpen;
  infoPanel.classList.toggle("open", infoPanelOpen);
  infoToggle.classList.toggle("active", infoPanelOpen);
  if (infoPanelOpen && historyPanelOpen) toggleHistoryPanel();
}
infoToggle.addEventListener("click", toggleInfoPanel);

// ─── UI: Sync model badge ─────────────────────────────────────────────────────
function syncModelBadge() { modelLabel.textContent = modelEl.value; }
modelEl.addEventListener("change", syncModelBadge);

// ─── UI: Clear result ─────────────────────────────────────────────────────────
function clearResult() {
  rawMarkdown = "";
  tokenCount  = 0;
  tokenCountEl.textContent = "0";
  resultPreview.innerHTML = `<span class="placeholder-text">La respuesta aparecerá aquí...</span>`;
  resultRaw.value = "";
  toneBadge.style.display = "none";
}
btnClear.addEventListener("click", clearResult);

// ─── Action: Copy ─────────────────────────────────────────────────────────────
function copyResult() {
  if (!rawMarkdown) return;
  navigator.clipboard.writeText(rawMarkdown).then(() => {
    copyToast.classList.add("show");
    setTimeout(() => copyToast.classList.remove("show"), 2000);
  });
}
btnCopy.addEventListener("click", copyResult);

// ─── Action: Export TXT ───────────────────────────────────────────────────────
function exportTxt() {
  if (!rawMarkdown) return;
  const blob = new Blob([rawMarkdown], { type: "text/plain;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = `correo-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
btnTxt.addEventListener("click", exportTxt);

// ─── Action: Export PDF (como archivo descargable) ────────────────────────────
function exportPdf() {
  if (!rawMarkdown) return;

  // CSS inline para que el PDF sea legible sin CDN
  const styles = `
    body { font-family: Georgia, serif; padding: 48px 64px; max-width: 800px; margin: auto; color: #1a1a1a; font-size: 14px; line-height: 1.7; }
    h1,h2 { font-size: 1.1rem; margin: 1rem 0 0.4rem; }
    h3 { font-size: 1rem; margin: 0.8rem 0 0.3rem; }
    p { margin: 0.45rem 0; }
    strong { font-weight: 700; }
    code { background: #f3f4f6; padding: 0.1rem 0.35rem; border-radius: 3px; font-size: 0.85rem; font-family: monospace; }
    pre { background: #f3f4f6; padding: 12px; border-radius: 5px; overflow-x: auto; }
    blockquote { border-left: 3px solid #d1d5db; margin: 0; padding-left: 1rem; color: #6b7280; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 1.5rem 0; }
  `;

  const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Correo exportado</title>
  <style>${styles}</style>
</head>
<body>
  ${marked.parse(rawMarkdown)}
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = `correo-${Date.now()}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
btnPdf.addEventListener("click", exportPdf);

// ─── Historial: localStorage ──────────────────────────────────────────────────
const HISTORY_KEY = "ai-mail-history";
const MAX_HISTORY = 20;

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
  catch { return []; }
}

function saveToHistory(entry) {
  const history = loadHistory();
  history.unshift(entry);           // más reciente primero
  if (history.length > MAX_HISTORY) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function renderHistory() {
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
        <button class="action-btn history-load" data-index="${i}">📂 Cargar</button>
        <button class="action-btn history-delete" data-index="${i}">🗑️</button>
      </div>
    </div>
  `).join("");

  // Cargar correo desde historial
  historyList.querySelectorAll(".history-load").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = loadHistory()[+btn.dataset.index];
      if (!item) return;
      renderMarkdown(item.content);
      toneBadge.textContent = item.tone;
      toneBadge.style.display = "inline-block";
      tokenCountEl.textContent = Math.round(item.content.length / 4);
      toggleHistoryPanel();
    });
  });

  // Eliminar entrada individual
  historyList.querySelectorAll(".history-delete").forEach(btn => {
    btn.addEventListener("click", () => {
      const history = loadHistory();
      history.splice(+btn.dataset.index, 1);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      renderHistory();
    });
  });
}

function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
}
btnClearHistory.addEventListener("click", clearHistory);

// ─── UI: History panel toggle ─────────────────────────────────────────────────
let historyPanelOpen = false;
function toggleHistoryPanel() {
  historyPanelOpen = !historyPanelOpen;
  historyPanel.classList.toggle("open", historyPanelOpen);
  btnHistory.classList.toggle("active", historyPanelOpen);
  if (historyPanelOpen) {
    renderHistory();
    if (infoPanelOpen) toggleInfoPanel();
  }
}
btnHistory.addEventListener("click", toggleHistoryPanel);

// ─── Plantillas: render pills ─────────────────────────────────────────────────
function renderTemplates() {
  templatesList.innerHTML = TEMPLATES.map((t, i) => `
    <button class="template-pill" data-index="${i}">${t.label}</button>
  `).join("");

  templatesList.querySelectorAll(".template-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      const t = TEMPLATES[+btn.dataset.index];
      inputEl.value = t.text;
      // Seleccionar el tono correspondiente si existe
      const opt = [...toneEl.options].find(o => o.value === t.tone);
      if (opt) toneEl.value = t.tone;
      inputEl.focus();
    });
  });
}

renderTemplates();

// ─── Core: Build prompt ───────────────────────────────────────────────────────
function buildPrompt(text, tone, lang) {
  return `Eres un asistente experto en comunicación empresarial.

Redacta un correo profesional en ${lang} con tono ${tone} basado en este contexto:

${text}

IMPORTANTE:
- Usa formato Markdown (## para el asunto, **negritas** para partes clave)
- Incluye: Asunto, Saludo, Cuerpo, Despedida y Firma
- Sé conciso pero completo
- No incluyas explicaciones fuera del correo`;
}

// ─── Core: Generate via Ollama (streaming) ────────────────────────────────────
async function generate() {
  const text  = inputEl.value.trim();
  const tone  = toneEl.value;
  const lang  = langEl.value;
  const model = modelEl.value;

  if (!text) { inputEl.focus(); return; }
  if (isStreaming) return;

  isStreaming = true;
  rawMarkdown = "";
  tokenCount  = 0;
  tokenCountEl.textContent = "0";
  generateBtn.disabled = true;
  generateBtn.classList.add("loading");
  btnText.textContent = "Generando...";
  toneBadge.style.display = "none";
  startLoader(tone);
  resultPreview.innerHTML = `<span class="cursor-blink">▌</span>`;
  resultRaw.value = "";

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt: buildPrompt(text, tone, lang), stream: true }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const reader  = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const lines = decoder.decode(value).split("\n").filter(Boolean);
      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.response) appendMarkdown(json.response);
        } catch { /* partial JSON — skip */ }
      }
    }

    toneBadge.textContent = tone;
    toneBadge.style.display = "inline-block";

    // ── Guardar en historial ──
    saveToHistory({
      tone,
      lang,
      model,
      date: new Date().toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" }),
      preview: rawMarkdown.replace(/[#*`]/g, "").trim().slice(0, 80) + "…",
      content: rawMarkdown,
    });

  } catch (err) {
    renderMarkdown(
      `## ❌ Error de conexión\n\nNo se pudo conectar con Ollama en \`localhost:11434\`.\n\n` +
      `**Asegúrate de que Ollama esté corriendo:**\n\`\`\`bash\nollama serve\n\`\`\`\n\n` +
      `Y que el modelo esté instalado:\n\`\`\`bash\nollama run ${model}\n\`\`\``
    );
    console.error(err);
  } finally {
    isStreaming  = false;
    generateBtn.disabled = false;
    generateBtn.classList.remove("loading");
    btnText.textContent = "Generar correo";
    stopLoader();
  }
}

generateBtn.addEventListener("click", generate);