// descargar expres
// guardar en una variable todas las ufnciones de express
const express = require('express');
const app = express();
// cuando escuchen el servidor 3000 realizar la funcion encender
const server = app.listen(3000, encender)
function encender() {
  console.log('servidor encendido');
}
app.use(express.static('public'))
