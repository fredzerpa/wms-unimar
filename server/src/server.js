// Libraries
require('dotenv').config();
const http = require('http');
const cron = require('node-cron');
const mongoose = require('mongoose');
const upsertMany = require('@meanie/mongoose-upsert-many');
// Agregamos el plugin para poder usar el method en todos los Schemas
mongoose.plugin(upsertMany); // ! Necesita estar antes que app.js (antes que los Routers)

// Services
const { mongoConnect, mongoBackupDatabase } = require('./services/mongo.services');
// Components
const app = require('./app');

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

// Cargamos los servicios
(async function startServer() {
  await mongoConnect();

  // TODO: set backup
  // Programamos la tarea de actualizacion de Collections y Back-Ups diariamente    
  // cron.schedule(
  //   '0 0 * * *', // Realiza la tarea a las 12:00 AM 
  //   async () => {
  //     await mongoBackupDatabase();
  //   },
  //   {
  //     timezone: 'America/Caracas' // La tarea toma la hora en Venezuela/Caracas
  //   }
  // );

  server.listen(PORT, console.log(`Listening on PORT ${PORT}`));
})()