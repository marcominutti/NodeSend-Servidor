// aqui se manda a llamar el modelo
/** para poder guardar al usuario necesitamos del modelo **/
const { response } = require("express");
const Usuario = require("../models/Usuario");
exports.nuevoUsuario = async (req, res) => {
  // comprobar si el usuario ya está registrado
  const { email, password, nombre } = req.body;
  if (!email || !password || !nombre) {
    return res.status(400).json({ msg: "Todos los datos son obligatorios" });
  }
  let usuario = await Usuario.findOne({ email });
  if (usuario) {
    return res
      .status(400)
      .json({ msg: "El email ya está registrado con otro usuario" });
  }

  usuario = await new Usuario(req.body);
  usuario.save();
  res.json({ mensaje: "Usuario Creado" });
};
