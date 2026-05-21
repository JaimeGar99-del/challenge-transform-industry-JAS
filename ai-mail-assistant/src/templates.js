// ─── Plantillas predefinidas ───────────────────────────────────────────────────
// Enfoque principal: atención de clientes molestos y situaciones empresariales
export const TEMPLATES = [
  {
    label: "Cliente molesto",
    tone:  "empático",
    text:  "Necesito responder a un cliente molesto por un retraso en la entrega. El pedido llegó 3 días tarde y quiere una explicación y compensación.",
  },
  {
    label: "Seguimiento oferta",
    tone:  "persuasivo",
    text:  "Quiero hacer seguimiento a una propuesta comercial que enviamos hace 1 semana. El cliente aún no ha respondido y me interesa cerrar el trato.",
  },
  {
    label: "Reunión urgente",
    tone:  "urgente",
    text:  "Necesito convocar a mi equipo a una reunión urgente mañana a las 9am para revisar los resultados del proyecto antes de la presentación con el cliente.",
  },
  {
    label: "Agradecimiento",
    tone:  "amigable",
    text:  "Quiero agradecer a un cliente fiel por 2 años de trabajo juntos y aprovechar para informarle sobre nuestros nuevos servicios.",
  },
  {
    label: "Solicitud de pago",
    tone:  "diplomático",
    text:  "Necesito recordarle a un cliente que tiene una factura vencida hace 15 días. Es un cliente importante y quiero mantener la relación.",
  },
  {
    label: "Presentación",
    tone:  "formal",
    text:  "Me presento ante un nuevo contacto empresarial al que me refirió un colega. Quiero explorar posibles sinergias entre nuestras empresas.",
  },
];

// ─── Mensajes del loader por tono ─────────────────────────────────────────────
export const LOADER_MESSAGES = {
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
