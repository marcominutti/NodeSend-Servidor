/** Toda la configfuracion del proyecto **/
const express = require("express");
const conectarDB = require("./config/db");
// crear el servidor
const app = express();

// Conectar a la base de datos
conectarDB();

console.log("Comenzando Node Send");
// Puerto de la app
const port = process.env.PORT || 4000;

// Habilitar la lectura de los valores del body cuando los recibe el controlador
app.use(express.json());

// Rutas de la app
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));
// Arrancar la app
app.listen(port, "0.0.0.0", () => {
  console.log(`El servidor esta funcionando en el puetrto ${port}`);
});
