# 📧 AI Mail Assistant

> Asistente de correos empresariales con IA local — especializado en atención de clientes molestos.

---

## 👥 Integrantes del grupo

| Nombre              | Rol                        |
|---------------------|----------------------------|
| Adriano González    | Desarrollo & integración IA |
| Sharick Olmos       | Desarrollo & Diseño UI / UX |
| Jaime García        | Desarrollo & integración IA & Logica del negocio |

---

## 🎯 Enfoque principal

Este proyecto está diseñado para **transformar la atención al cliente** mediante IA generativa local.
Su caso de uso principal es asistir a agentes y representantes en la **redacción de respuestas a clientes
molestos**, ayudando a mantener un tono empático, profesional y eficaz bajo presión.

---

## 🛠️ Tecnologías

| Tecnología | Uso                                              |
|------------|--------------------------------------------------|
| **Vite**   | Build tool ultrarrápido con HMR nativo           |
| **JS**     | JavaScript Vanilla — sin frameworks              |
| **Ollama** | Motor LLM local vía API REST en `localhost:11434`|
| **phi3 / tinyllama / llama3 / mistral** | Modelos de lenguaje soportados |
| **Marked** | Renderizado Markdown en tiempo real con streaming |

---

## 📁 Estructura del proyecto

```
ai-mail-assistant/
├── index.html
├── package.json
└── src/
    ├──main.js                  ← Punto de entrada (orquesta todos los módulos)
    ├── style.css                ← Estilos globales
    ├── layout.js            ← Template HTML de la app
    ├── templates.js         ← Plantillas predefinidas + mensajes del loader
    ├── templatePills.js     ← Renderizado de pills de plantillas (UI)
    ├── ui.js                ← Loader, Markdown, view toggle, paneles, model badge, limpiar
    ├── export.js            ← Copiar, exportar TXT, exportar PDF
    ├── history.js           ← Historial en localStorage (guardar, cargar, limpiar)
    └── generate.js          ← Prompt builder + generación streaming con Ollama
```

---

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/JaimeGar99-del/challenge-transform-industry-JAS.git
cd ai-mail-assistant
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Instalar Ollama

Descarga e instala Ollama desde [https://ollama.com](https://ollama.com) según tu sistema operativo.

### 4. Descargar el modelo de IA

```bash
# Modelo recomendado (liviano, rápido)
ollama pull tinyllama

# Alternativas más potentes
ollama pull phi3
ollama pull llama3
ollama pull mistral
```

---

## ▶️ Ejecutar el programa

### Paso 1 — Iniciar el servidor de Ollama

Abre una terminal y ejecuta:

```bash
ollama run phi3 
```

> Ollama quedará escuchando en `http://localhost:11434`. Mantenla abierta.

### Paso 2 — Iniciar la aplicación web

En otra terminal, dentro del proyecto:

```bash
npm run dev
```

Luego abre tu navegador en:

```
http://localhost:5173
```

---

## 🧩 Cómo usar

1. **Selecciona una plantilla** (ej. "Cliente molesto") o escribe tu propio contexto.
2. **Elige el tono** (empático, diplomático, formal, etc.) y el idioma.
3. **Selecciona el modelo** de IA disponible en tu Ollama.
4. Haz clic en **"Generar correo"** — verás la respuesta en tiempo real (streaming).
5. Usa los botones de acción para **copiar**, exportar en **TXT**, **PDF** o guardar en el **historial**.

---

## 🗂️ Módulos — descripción

| Archivo              | Responsabilidad                                                  |
|----------------------|------------------------------------------------------------------|
| `src/main.js`            | Bootstrap: monta la app y conecta todos los módulos             |
| `src/layout.js`      | Genera e inyecta el HTML completo de la interfaz en `#app`      |
| `src/templates.js`   | Datos de plantillas predefinidas y mensajes de loader por tono  |
| `src/templatePills.js` | Renderiza los botones de plantilla y maneja su selección      |
| `src/ui.js`          | Loader animado, render/append Markdown, toggle vistas, paneles, model badge, limpiar resultado |
| `src/export.js`      | Copiar al portapapeles, descargar como `.txt`, exportar como `.html` (PDF) |
| `src/history.js`     | Guardar, cargar, renderizar y limpiar historial en `localStorage` |
| `src/generate.js`    | Construye el prompt y gestiona el streaming con la API de Ollama |

---

## 🗺️ Roadmap

- [x] Streaming en tiempo real (token a token)
- [x] Exportar TXT / PDF
- [x] Render Markdown con vista previa
- [x] Multi idioma (ES / EN / PT / FR)
- [x] Historial de correos en localStorage
- [x] Plantillas inteligentes por caso de uso
- [x] Modularización en archivos ES Modules
- [ ] Soporte para adjuntar contexto desde archivos
- [ ] Integración con cliente de correo (mailto / API)

---

## Solución de problemas

**Error: No se pudo conectar con Ollama en `localhost:11434`**

Asegúrate de que Ollama esté corriendo:
```bash
ollama run phi3
```

Y de que el modelo esté descargado:
```bash
ollama list          # ver modelos instalados
ollama pull tinyllama
```

---

## 📄 Licencia

MIT — Proyecto académico. Uso libre con atribución.
