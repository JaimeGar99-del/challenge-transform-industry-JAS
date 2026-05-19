import "./style.css";
import { marked } from "https://cdn.jsdelivr.net/npm/marked@9.1.6/+esm";

const app = document.querySelector("#app");
const history = [];

app.innerHTML = `
  <div class="bg-noise"></div>
  <main class="container">
    <header class="app-header">
      <div class="logo-mark">✉</div>
      <div>
        <h1>AI Mail Assistant</h1>
        <p class="subtitle">Comunicación empresarial con IA local</p>
      </div>
      <div class="model-badge">
        <span class="dot"></span>
        <span id="model-label">tinyllama</span>
      </div>
    </header>

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
      </div>

      <div class="panel result-panel">
        <div class="result-header">
          <label class="panel-label">RESPUESTA IA</label>
          <div class="view-toggle">
            <button class="toggle-btn active" id="btn-preview">Vista previa</button>
            <button class="toggle-btn" id="btn-raw">Markdown</button>
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
          <div id="copy-toast" class="toast">¡Copiado!</div>
        </div>
      </div>
    </div>
  </main>
`;

// ─── State ────────────────────────────────────────────────────────────────────
let rawMarkdown = "";
let isStreaming = false;
let currentView = "preview"; // "preview" | "raw"

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
const copyToast = document.querySelector("#copy-toast");
const modelSelect = document.querySelector("#model");
const modelLabel = document.querySelector("#model-label");

// Sync model badge
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
  resultPreview.innerHTML = marked.parse(rawMarkdown);
  resultRaw.value = rawMarkdown;
  // Auto-scroll
  resultPreview.scrollTop = resultPreview.scrollHeight;
}

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
  generateBtn.classList.add("loading");
  btnText.textContent = "Generando...";
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

//actualizado