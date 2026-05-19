import "./style.css";
import { marked } from "https://cdn.jsdelivr.net/npm/marked@9.1.6/+esm";

const app = document.querySelector("#app");

app.innerHTML = `
  <div class="bg-noise"></div>
  <main class="container">
    <header class="app-header">
      <div class="logo-mark">✉</div>
      <div>
        <h1>AI Mail Assistant</h1>
        <p class="subtitle">Comunicación empresarial con IA local</p>
      </div>
      <div class="header-right">
        <div class="model-badge">
          <span class="dot"></span>
          <span id="model-label">tinyllama</span>
        </div>
        <button class="info-toggle" id="info-toggle" title="Ver tecnologías y roadmap">ℹ</button>
      </div>
    </header>

    <!-- Info Panel: Tech Stack + Roadmap -->
    <div class="info-panel" id="info-panel">
      <div class="info-grid">
        <div class="info-section">
          <div class="info-section-title">
            <span class="info-icon">⚙️</span>
            TECNOLOGÍAS USADAS
          </div>
          <div class="tech-list">
            <div class="tech-item">
              <span class="tech-badge vite">VITE</span>
              <span class="tech-desc">Build tool ultrarrápido con HMR nativo</span>
            </div>
            <div class="tech-item">
              <span class="tech-badge js">JS</span>
              <span class="tech-desc">JavaScript Vanilla — sin frameworks, máximo control</span>
            </div>
            <div class="tech-item">
              <span class="tech-badge ollama">OLLAMA</span>
              <span class="tech-desc">Motor LLM local vía API REST en localhost:11434</span>
            </div>
            <div class="tech-item">
              <span class="tech-badge phi">PHI-3</span>
              <span class="tech-desc">Modelo base — también soporta tinyllama, llama3, mistral</span>
            </div>
            <div class="tech-item">
              <span class="tech-badge marked">MARKED</span>
              <span class="tech-desc">Renderizado Markdown en tiempo real con streaming</span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <div class="info-section-title">
            <span class="info-icon">🗺️</span>
            ROADMAP DE EVOLUCIÓN
          </div>
          <div class="roadmap-list">
            <div class="roadmap-item done">
              <span class="road-status">✓</span>
              <div class="road-content">
                <span class="road-title">Streaming en tiempo real</span>
                <span class="road-desc">Respuesta token a token vía ReadableStream</span>
              </div>
            </div>
            <div class="roadmap-item done">
              <span class="road-status">✓</span>
              <div class="road-content">
                <span class="road-title">Exportar TXT / PDF</span>
                <span class="road-desc">Descarga directa y print-to-PDF con estilos</span>
              </div>
            </div>
            <div class="roadmap-item done">
              <span class="road-status">✓</span>
              <div class="road-content">
                <span class="road-title">Render Markdown</span>
                <span class="road-desc">Vista previa y modo fuente alternables</span>
              </div>
            </div>
            <div class="roadmap-item pending">
              <span class="road-status">○</span>
              <div class="road-content">
                <span class="road-title">Mejorar prompts</span>
                <span class="road-desc">Plantillas por caso de uso y few-shot examples</span>
              </div>
            </div>
            <div class="roadmap-item pending">
              <span class="road-status">○</span>
              <div class="road-content">
                <span class="road-title">Persistencia</span>
                <span class="road-desc">Historial de correos en localStorage / IndexedDB</span>
              </div>
            </div>
            <div class="roadmap-item pending">
              <span class="road-status">○</span>
              <div class="road-content">
                <span class="road-title">Modularizar componentes</span>
                <span class="road-desc">Separar en módulos ES reutilizables</span>
              </div>
            </div>
            <div class="roadmap-item pending">
              <span class="road-status">○</span>
              <div class="road-content">
                <span class="road-title">Nuevas funcionalidades</span>
                <span class="road-desc">Historial, plantillas, multi-destinatario, adjuntos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="editor-grid">
      <div class="panel input-panel">
        <label class="panel-label">CONTEXTO DEL CORREO</label>
        <textarea id="input" placeholder="Ej: Necesito responder a un cliente molesto por un retraso en la entrega. El pedido llegó 3 días tarde..."></textarea>

        <div class="controls-row">
          <div class="control-group">
            <label class="control-label">TONO</label>
            <select id="tone">
              <option value="formal">Formal</option>
              <option value="amigable">Amigable</option>
              <option value="profesional">Profesional</option>
              <option value="empático">Empático</option>
              <option value="persuasivo">Persuasivo</option>
            </select>
          </div>

          <div class="control-group">
            <label class="control-label">IDIOMA</label>
            <select id="lang">
              <option value="español">Español</option>
              <option value="inglés">Inglés</option>
              <option value="portugués">Portugués</option>
            </select>
          </div>

          <div class="control-group">
            <label class="control-label">MODELO</label>
            <select id="model">
              <option value="tinyllama">tinyllama</option>
              <option value="phi3">phi3</option>
              <option value="llama3">llama3</option>
              <option value="mistral">mistral</option>
            </select>
          </div>
        </div>

        <button id="generate" class="btn-generate">
          <span class="btn-icon">⚡</span>
          <span id="btn-text">Generar correo</span>
        </button>

        <!-- Streaming indicator -->
        <div class="stream-indicator" id="stream-indicator">
          <div class="stream-bar">
            <div class="stream-fill"></div>
          </div>
          <span class="stream-label">Generando tokens...</span>
        </div>
      </div>

      <div class="panel result-panel">
        <div class="result-header">
          <label class="panel-label">RESPUESTA IA</label>
          <div class="result-header-right">
            <div class="token-counter" id="token-counter">
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
          <button class="action-btn" id="btn-copy" title="Copiar al portapapeles">
            <span>📋</span> Copiar
          </button>
          <button class="action-btn" id="btn-txt" title="Exportar TXT">
            <span>📄</span> TXT
          </button>
          <button class="action-btn" id="btn-pdf" title="Exportar PDF">
            <span>🖨️</span> PDF
          </button>
          <button class="action-btn" id="btn-clear" title="Limpiar resultado">
            <span>🗑️</span> Limpiar
          </button>
          <div id="copy-toast" class="toast">¡Copiado!</div>
        </div>
      </div>
    </div>
  </main>
`;

// ─── State ────────────────────────────────────────────────────────────────────
let rawMarkdown = "";
let isStreaming = false;
let currentView = "preview";
let tokenCount = 0;

// ─── Elements ─────────────────────────────────────────────────────────────────
const generateBtn = document.querySelector("#generate");
const btnText = document.querySelector("#btn-text");
const resultPreview = document.querySelector("#result-preview");
const resultRaw = document.querySelector("#result-raw");
const btnPreview = document.querySelector("#btn-preview");
const btnRaw = document.querySelector("#btn-raw");
const btnCopy = document.querySelector("#btn-copy");
const btnTxt = document.querySelector("#btn-txt");
const btnPdf = document.querySelector("#btn-pdf");
const btnClear = document.querySelector("#btn-clear");
const copyToast = document.querySelector("#copy-toast");
const modelSelect = document.querySelector("#model");
const modelLabel = document.querySelector("#model-label");
const streamIndicator = document.querySelector("#stream-indicator");
const tokenCounter = document.querySelector("#token-counter");
const tokenCountEl = document.querySelector("#token-count");
const infoToggle = document.querySelector("#info-toggle");
const infoPanel = document.querySelector("#info-panel");

// ─── Info panel toggle ────────────────────────────────────────────────────────
let infoPanelOpen = false;
infoToggle.addEventListener("click", () => {
  infoPanelOpen = !infoPanelOpen;
  infoPanel.classList.toggle("open", infoPanelOpen);
  infoToggle.classList.toggle("active", infoPanelOpen);
});

// ─── Sync model badge ─────────────────────────────────────────────────────────
modelSelect.addEventListener("change", () => {
  modelLabel.textContent = modelSelect.value;
});

// ─── View toggle ──────────────────────────────────────────────────────────────
btnPreview.addEventListener("click", () => {
  currentView = "preview";
  btnPreview.classList.add("active");
  btnRaw.classList.remove("active");
  resultPreview.style.display = "block";
  resultRaw.style.display = "none";
});

btnRaw.addEventListener("click", () => {
  currentView = "raw";
  btnRaw.classList.add("active");
  btnPreview.classList.remove("active");
  resultRaw.style.display = "block";
  resultPreview.style.display = "none";
});

// ─── Render markdown ──────────────────────────────────────────────────────────
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

// ─── Clear ────────────────────────────────────────────────────────────────────
btnClear.addEventListener("click", () => {
  rawMarkdown = "";
  tokenCount = 0;
  tokenCountEl.textContent = "0";
  resultPreview.innerHTML = `<span class="placeholder-text">La respuesta aparecerá aquí...</span>`;
  resultRaw.value = "";
});

// ─── Generate ─────────────────────────────────────────────────────────────────
generateBtn.addEventListener("click", async () => {
  const input = document.querySelector("#input").value;
  const tone = document.querySelector("#tone").value;
  const lang = document.querySelector("#lang").value;
  const model = document.querySelector("#model").value;

  if (!input.trim()) {
    renderMarkdown("⚠️ **Debes escribir el contexto del correo.**");
    return;
  }

  if (isStreaming) return;
  isStreaming = true;
  rawMarkdown = "";
  tokenCount = 0;
  tokenCountEl.textContent = "0";

  generateBtn.classList.add("loading");
  btnText.textContent = "Generando...";
  streamIndicator.classList.add("active");
  resultPreview.innerHTML = `<span class="cursor-blink">▌</span>`;
  resultRaw.value = "";

  const prompt = `Eres un asistente experto en comunicación empresarial.

Redacta un correo profesional en ${lang} con tono ${tone} basado en este contexto:

${input}

IMPORTANTE:
- Usa formato Markdown (## para el asunto, **negritas** para partes clave, etc.)
- Incluye: Asunto, Saludo, Cuerpo, Despedida y Firma
- Sé conciso pero completo
- No incluyas explicaciones fuera del correo`;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt, stream: true }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    rawMarkdown = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const lines = decoder.decode(value).split("\n").filter(Boolean);
      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.response) {
            appendMarkdown(json.response);
          }
        } catch {
          // partial JSON, skip
        }
      }
    }

  } catch (error) {
    renderMarkdown(`## ❌ Error de conexión\n\nNo se pudo conectar con Ollama en \`localhost:11434\`.\n\n**Asegúrate de que Ollama esté corriendo:**\n\`\`\`bash\nollama serve\n\`\`\`\n\nY que el modelo esté instalado:\n\`\`\`bash\nollama run ${model}\n\`\`\``);
    console.error(error);
  } finally {
    isStreaming = false;
    generateBtn.classList.remove("loading");
    btnText.textContent = "Generar correo";
    streamIndicator.classList.remove("active");
  }
});

// ─── Copy ─────────────────────────────────────────────────────────────────────
btnCopy.addEventListener("click", () => {
  if (!rawMarkdown) return;
  navigator.clipboard.writeText(rawMarkdown).then(() => {
    copyToast.classList.add("show");
    setTimeout(() => copyToast.classList.remove("show"), 2000);
  });
});

// ─── Export TXT ───────────────────────────────────────────────────────────────
btnTxt.addEventListener("click", () => {
  if (!rawMarkdown) return;
  const blob = new Blob([rawMarkdown], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `correo-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
});

// ─── Export PDF ───────────────────────────────────────────────────────────────
btnPdf.addEventListener("click", () => {
  if (!rawMarkdown) return;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Correo exportado</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css@5.5.0/github-markdown-light.min.css">
      <style>
        body { font-family: Georgia, serif; padding: 40px 60px; max-width: 800px; margin: auto; color: #1a1a1a; }
        .markdown-body { font-size: 14px; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body class="markdown-body">
      ${marked.parse(rawMarkdown)}
      <script>window.onload = () => { window.print(); window.close(); }<\/script>
    </body>
    </html>
  `);
  printWindow.document.close();
});