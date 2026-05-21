// ─── Template HTML principal ──────────────────────────────────────────────────
export function renderAppHTML() {
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
              <div class="roadmap-item done"><span class="road-status">✓</span><div class="road-content"><span class="road-title">Modularizar componentes</span><span class="road-desc">Separado en módulos ES reutilizables</span></div></div>
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
}
