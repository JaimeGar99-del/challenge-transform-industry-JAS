import "./style.css";
 
const app = document.querySelector("#app");
 
app.innerHTML = `
  <main class="container">
 
    <div class="header">
      <div class="header-icon">✉️</div>
      <div>
        <h1>AI Mail Assistant</h1>
        <p>Redacta correos profesionales en segundos</p>
      </div>
    </div>
 
    <div class="card">
      <label class="field-label" for="input">¿Qué necesitas comunicar?</label>
      <textarea id="input" placeholder="Ej: Necesito responder a un cliente molesto por un retraso en su pedido..."></textarea>
 
      <div class="divider"></div>
 
      <div class="controls-row">
        <div class="field-group">
          <label class="field-label" for="tone">Tono</label>
          <select id="tone">
            <option value="formal">Formal</option>
            <option value="amigable">Amigable</option>
            <option value="profesional" selected>Profesional</option>
            <option value="persuasivo">Persuasivo</option>
            <option value="empático">Empático</option>
            <option value="asertivo">Asertivo</option>
            <option value="urgente">Urgente</option>
            <option value="conciso">Conciso</option>
            <option value="diplomático">Diplomático</option>
            <option value="entusiasta">Entusiasta</option>
          </select>
        </div>
        <div class="field-group">
          <label class="field-label" for="lang">Idioma</label>
          <select id="lang">
            <option value="español" selected>Español</option>
            <option value="inglés">English</option>
            <option value="portugués">Português</option>
            <option value="francés">Français</option>
          </select>
        </div>
      </div>
 
      <button id="generate">
        <span>✦</span>
        <span id="btn-text">Generar correo</span>
      </button>
 
      <div class="loader-wrap" id="loader">
        <div class="eq-bars" aria-hidden="true">
          <span></span><span></span><span></span><span></span>
        </div>
        <span class="loader-msg" id="loader-msg">Generando...</span>
      </div>
    </div>
 
    <section class="result-section" id="result-section">
      <div class="result-header">
        <div class="result-header-left">
          <span class="result-label">Correo generado</span>
          <span class="tone-badge" id="tone-badge">profesional</span>
        </div>
        <button class="copy-btn" id="copy-btn">
          📋 Copiar
        </button>
      </div>
      <div class="result-box" id="result-box"></div>
    </section>
 
  </main>
`;
 
/* ── Elements ── */
const button      = document.getElementById("generate");
const btnText     = document.getElementById("btn-text");
const inputEl     = document.getElementById("input");
const toneEl      = document.getElementById("tone");
const langEl      = document.getElementById("lang");
const loader      = document.getElementById("loader");
const loaderMsg   = document.getElementById("loader-msg");
const resultSec   = document.getElementById("result-section");
const resultBox   = document.getElementById("result-box");
const toneBadge   = document.getElementById("tone-badge");
const copyBtn     = document.getElementById("copy-btn");
 
/* ── Loader messages per tone ── */
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
 
function startLoader(tone) {
  const msgs = LOADER_MESSAGES[tone] || ["Generando respuesta..."];
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
 
/* ── Generate ── */
button.addEventListener("click", async () => {
  const text = inputEl.value.trim();
  const tone = toneEl.value;
  const lang = langEl.value;
 
  if (!text) {
    inputEl.focus();
    return;
  }
 
  resultSec.classList.remove("visible");
  startLoader(tone);
  button.disabled = true;
  btnText.textContent = "Generando...";
 
  const prompt = `Actúa como un asistente empresarial experto en comunicación.
Redacta un correo profesional en ${lang} con tono ${tone} basado en esta situación:
 
${text}
 
Responde SOLO con el correo redactado, sin explicaciones adicionales.`;
 
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
 
    const data = await response.json();
    const output = (data.content || [])
      .map((b) => b.text || "")
      .join("");
 
    toneBadge.textContent = tone;
    resultBox.textContent = output || "No se pudo generar el correo.";
    resultSec.classList.add("visible");
  } catch (error) {
    resultBox.textContent = "Error al conectar con la IA.";
    resultSec.classList.add("visible");
    console.error(error);
  } finally {
    stopLoader();
    button.disabled = false;
    btnText.textContent = "Generar correo";
  }
});
 
/* ── Copy ── */
copyBtn.addEventListener("click", () => {
  const txt = resultBox.textContent;
  if (!txt) return;
  navigator.clipboard.writeText(txt).then(() => {
    copyBtn.textContent = "✅ Copiado";
    setTimeout(() => {
      copyBtn.textContent = "📋 Copiar";
    }, 2000);
  });
});