// src/utils/preguntasIA.js

// Genera un array de preguntas simuladas para el torneo
export const generarPreguntas = (materia, cantidad = 15) => {
  const preguntas = [];
  for (let i = 0; i < cantidad; i++) {
    preguntas.push({
      pregunta: `¿Pregunta ${i + 1} sobre ${materia}?`,
      opciones: ["Opción A", "Opción B", "Opción C", "Opción D"],
      correcta: Math.floor(Math.random() * 4),
      dificultad: "Media",
      explicacion: "Explicación de ejemplo."
    });
  }
  return preguntas;
};