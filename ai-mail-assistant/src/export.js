import { marked } from "https://cdn.jsdelivr.net/npm/marked@9.1.6/+esm";
import { els }    from "./ui.js";

// ─── Copiar al portapapeles ────────────────────────────────────────────────────
export function initCopy(state) {
  const { btnCopy, copyToast } = els();

  btnCopy.addEventListener("click", () => {
    if (!state.rawMarkdown) return;
    navigator.clipboard.writeText(state.rawMarkdown).then(() => {
      copyToast.classList.add("show");
      setTimeout(() => copyToast.classList.remove("show"), 2000);
    });
  });
}

// ─── Exportar como TXT ────────────────────────────────────────────────────────
export function initExportTxt(state) {
  const { btnTxt } = els();

  btnTxt.addEventListener("click", () => {
    if (!state.rawMarkdown) return;
    const blob = new Blob([state.rawMarkdown], { type: "text/plain;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `correo-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

// ─── Exportar como PDF (HTML descargable) ─────────────────────────────────────
export function initExportPdf(state) {
  const { btnPdf } = els();

  btnPdf.addEventListener("click", () => {
    if (!state.rawMarkdown) return;

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
  ${marked.parse(state.rawMarkdown)}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `correo-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  });
}
