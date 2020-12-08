// aqui se manda a llamar el modelo
/** para poder guardar al usuario necesitamos del modelo **/
const { response } = require("express");
const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
exports.nuevoUsuario = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  let { email, password, nombre } = req.body;

  // comprobar si el usuario ya está registrado
  let usuario = await Usuario.findOne({ email });
  if (usuario) {
    return res
      .status(400)
      .json({ msg: "El email ya está registrado con otro usuario" });
  }
  // vueltas para hasehar el password
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  usuario = new Usuario({ nombre, password, email });

  try {
    await usuario.save();
    res.json({ msg: "Usuario Creado Correctamente" });
  } catch (error) {
    console.log(error);
  }
};
