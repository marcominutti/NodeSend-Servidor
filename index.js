/** Toda la configfuracion del proyecto **/
const express = require("express");
const conectarDB = require("./config/db");
const cors = require("cors");
// middleware
//const auth = require("./middleware/auth");
// crear el servidor
const app = express();

// decirle a express que queremos ejecutar el middleware
//app.use(auth);
// Conectar a la base de datos
conectarDB();

// Habilitar cors
const opcionesCors = {
  origin: process.env.FRONTEND_URL,
};
app.use(cors(opcionesCors));

console.log("Comenzando Node Send");
// Puerto de la app
const port = process.env.PORT || 4000;

// Habilitar la lectura de los valores del body cuando los recibe el controlador
app.use(express.json());

// Habilitar carpeta publica
app.use(express.static("uploads"));

// Rutas de la app
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/enlaces", require("./routes/enlaces"));
app.use("/api/archivos", require("./routes/archivos"));
// Arrancar la app
app.listen(port, "0.0.0.0", () => {
  console.log(`El servidor esta funcionando en el puetrto ${port}`);
});
