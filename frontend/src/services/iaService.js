const API_URL = 'http://localhost:3000/api';

export const analizarCaso = async (texto) => {
  try {
    const response = await fetch(`${API_URL}/ia/analizar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto })
    });
    return await response.json();
  } catch (error) {
    console.error('Error analizando caso:', error);
    return { success: false, message: 'Error de conexión con el servidor' };
  }
};

export const predecirResolucion = async (datos) => {
  try {
    const response = await fetch(`${API_URL}/ia/predecir`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    return await response.json();
  } catch (error) {
    console.error('Error en predicción:', error);
    return { success: false, message: 'Error de conexión' };
  }
};
