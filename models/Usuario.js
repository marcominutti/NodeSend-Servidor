// Se define el schema es decir la forma que van a tener los datos
// Modelo
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usuariosSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  nombre: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
});
module.exports = mongoose.model("Usuarios", usuariosSchema);
