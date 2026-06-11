const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// RUTA DE ACTIVACIÓN (El "Ping" que usará Apps Script para despertarlo)
app.get('/api/ping', (req, res) => {
  return res.status(200).json({ 
    success: true, 
    message: "Servidor despierto y listo para recibir datos." 
  });
});

// RUTA PRINCIPAL (Donde procesarás la lógica que antes hacía Apps Script)
app.post('/api/webhook-edit', (req, res) => {
  const data = req.body;
  console.log("Datos recibidos desde el Excel:", data);
  
  // Aquí irá tu lógica pesada de lectura/escritura y envío de correos
  
  return res.status(200).json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
