import { els, startLoader, stopLoader, appendMarkdown, renderMarkdown } from "./ui.js";
import { saveToHistory } from "./history.js";

// ─── Construir prompt para el LLM ─────────────────────────────────────────────
// Enfoque principal: atención de clientes molestos
function buildPrompt(text, tone, lang) {
  return `Eres un asistente experto en comunicación empresarial, especializado en atención al cliente y resolución de conflictos.

Redacta un correo profesional en ${lang} con tono ${tone} basado en este contexto:

${text}

IMPORTANTE:
- Usa formato Markdown (## para el asunto, **negritas** para partes clave)
- Incluye: Asunto, Saludo, Cuerpo, Despedida y Firma
- Sé conciso pero completo
- No incluyas explicaciones fuera del correo`;
}

// ─── Generación con streaming vía Ollama ─────────────────────────────────────
export function initGenerate(state) {
  const { generateBtn } = els();
  generateBtn.addEventListener("click", () => generate(state));
}

async function generate(state) {
  const { inputEl, toneEl, langEl, modelEl, generateBtn, btnText, toneBadge, tokenCountEl, resultPreview, resultRaw } = els();

  const text  = inputEl.value.trim();
  const tone  = toneEl.value;
  const lang  = langEl.value;
  const model = modelEl.value;

  if (!text) { inputEl.focus(); return; }
  if (state.isStreaming) return;

  state.isStreaming  = true;
  state.rawMarkdown  = "";
  state.tokenCount   = 0;
  tokenCountEl.textContent    = "0";
  generateBtn.disabled        = true;
  generateBtn.classList.add("loading");
  btnText.textContent         = "Generando...";
  toneBadge.style.display     = "none";
  startLoader(tone);
  resultPreview.innerHTML = `<span class="cursor-blink">▌</span>`;
  resultRaw.value         = "";

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ model, prompt: buildPrompt(text, tone, lang), stream: true }),
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
          if (json.response) appendMarkdown(json.response, state);
        } catch { /* partial JSON — skip */ }
      }
    }

    toneBadge.textContent   = tone;
    toneBadge.style.display = "inline-block";

    saveToHistory({
      tone,
      lang,
      model,
      date:    new Date().toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" }),
      preview: state.rawMarkdown.replace(/[#*`]/g, "").trim().slice(0, 80) + "…",
      content: state.rawMarkdown,
    });

  } catch (err) {
    renderMarkdown(
      `## ❌ Error de conexión\n\nNo se pudo conectar con Ollama en \`localhost:11434\`.\n\n` +
      `**Asegúrate de que Ollama esté corriendo:**\n\`\`\`bash\nollama serve\n\`\`\`\n\n` +
      `Y que el modelo esté instalado:\n\`\`\`bash\nollama run ${model}\n\`\`\``,
      state
    );
    console.error(err);
  } finally {
    state.isStreaming = false;
    generateBtn.disabled = false;
    generateBtn.classList.remove("loading");
    btnText.textContent = "Generar correo";
    stopLoader();
  }
}
