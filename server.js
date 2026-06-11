/**
 * ====================================================================
 * ARCHIVO: server.js
 * DESCRIPCIÓN: Servidor principal en Node.js para procesamiento en la nube.
 * ENTORNO: Render / Node.js
 * ====================================================================
 */

const express = require('express');
const cors = require('cors');

const app = express();
// El puerto lo define automáticamente Render mediante variables de entorno, o usa el 3000 localmente.
const PORT = process.env.PORT || 3000;

// MIDDLEWARES
// Permite que el servidor entienda datos en formato JSON de hasta 10MB (útil para payloads grandes de Sheets)
app.use(express.json({ limit: '10mb' }));
// Habilita CORS por seguridad si necesitas interactuar desde peticiones de navegador externas
app.use(cors());

/**
 * --------------------------------------------------------------------
 * RUTA 1: GET /api/ping
 * PROPÓSITO: Ruta de precalentamiento (Cold Start Mitigation).
 * Sirve para que el botón del Frontend despierte al servidor
 * cuando se encuentra en modo hibernación en la capa gratuita.
 * --------------------------------------------------------------------
 */
app.get('/api/ping', (req, res) => {
  console.log(`[${new Date().toISOString()}] Ping recibido. Confirmando estado ONLINE.`);
  
  return res.status(200).json({
    success: true,
    status: "online",
    message: "Servidor en la nube activo y listo para procesar automatizaciones.",
    timestamp: new Date()
  });
});

/**
 * --------------------------------------------------------------------
 * RUTA 2: POST /api/webhook-edit
 * PROPÓSITO: Punto de entrada para el activador de edición del Excel.
 * Recibe los datos procesados en tiempo real por el formulario 
 * o la edición de celdas.
 * --------------------------------------------------------------------
 */
app.post('/api/webhook-edit', async (req, res) => {
  const logPrefix = `[Webhook ${new Date().toISOString()}]`;
  console.log(`${logPrefix} Petición de ejecución recibida desde Google Sheets.`);

  try {
    const data = req.body;

    // Validación básica del cuerpo de la petición
    if (!data || Object.keys(data).length === 0) {
      console.warn(`${logPrefix} Advertencia: Se recibió un payload vacío.`);
      return res.status(400).json({
        success: false,
        error: "El cuerpo de la petición (payload) está vacío."
      });
    }

    // Registro de los datos mínimos recibidos para depuración
    console.log(`${logPrefix} Datos de la acción:`, JSON.stringify(data));

    /**
     * ================================================================
     * ESPACIO RESERVADO PARA REPLICAR TU LÓGICA DE NEGOCIO
     * Aquí migraremos las funciones de 'Code-notificador.gs' y 'DateManagement.gs'
     * para procesar los envíos de correos y actualización de fechas.
     * ================================================================
     */

    // Respuesta exitosa temporal al Frontend de Google
    return res.status(200).json({
      success: true,
      message: "Datos recibidos correctamente en el servidor en la nube.",
      processedAt: new Date()
    });

  } catch (error) {
    console.error(`${logPrefix} Error crítico procesando la petición:`, error.message);
    
    return res.status(500).json({
      success: false,
      error: "Error interno en el servidor de Render: " + error.message
    });
  }
});

/**
 * --------------------------------------------------------------------
 * MANEJO DE RUTAS NO ENCONTRADAS (404)
 * --------------------------------------------------------------------
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `La ruta ${req.originalUrl} no existe en este servidor.`
  });
});

/**
 * --------------------------------------------------------------------
 * INICIALIZACIÓN DEL SERVIDOR
 * --------------------------------------------------------------------
 */
app.listen(PORT, () => {
  console.log(`====================================================================`);
  console.log(`🚀 SERVIDOR EN EJECUCIÓN`);
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`📅 Hora de inicio: ${new Date().toLocaleString()}`);
  console.log(`====================================================================`);
});
