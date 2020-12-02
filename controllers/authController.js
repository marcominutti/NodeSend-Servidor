const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
exports.autenticarUsuario = async (req, res, next) => {
  // Revisar si hay errores

  //Buscar el usuario
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    res.status(401).json({ msg: "El usuario no existe" });
    return next();
  }
  // Verificar el password y autenticar al usuario
  if (bcrypt.compareSync(password, usuario.password)) {
    // crear json web token
  } else {
    res.status(401).json({ msg: "Password Incorrecto" });
    return next();
  }
};

exports.usuarioAutenticado = (req, res) => {};
