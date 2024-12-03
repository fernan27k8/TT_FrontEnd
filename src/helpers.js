const helpers = {
  httpGet: async function (url, options = {}) {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...options.headers, // Permite agregar encabezados opcionales
        },
        ...options, // Permite sobrescribir otras opciones como mode, cache, etc.
      });

      if (!response.ok) {
        // Si la respuesta no es 2xx
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error en httpGet:", error.message);
      throw error; // Relanza el error para que pueda manejarse en el componente
    }
  },
};

export default helpers;
