const Enlaces = require("../models/Enlace");
const shortid = require("shortid");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
exports.nuevoEnlace = async (req, res, next) => {
  // Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    //return res.status(400).json({ errores: errores.array() });
  }
  // crear el objeto enlace
  const { nombre_original, nombre } = req.body;
  const enlace = new Enlaces();
  enlace.url = shortid.generate();
  enlace.nombre = nombre;
  enlace.nombre_original = nombre_original;

  //Si el usuario esta autenticado
  if (req.usuario) {
    const { password, descargas } = req.body;
    // Asignar al enlace el numero de descargas
    if (descargas) {
      enlace.descargas = descargas;
    }
    // Asignar el password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      enlace.password = await bcrypt.hash(password, salt);
    }
    enlace.autor = req.usuario.id;
  }

  // guardar en la base de datos
  try {
    await enlace.save();
    return res.json({ msg: `${enlace.url}` });
    //next();
  } catch (error) {
    console.log(error);
    res.json({ msg: "ocurrió un error en enlaces controller" + error });
  }
};

// Obtiene el listado de todos los enlaces
exports.todosEnlaces = async (req, res) => {
  try {
    const enlaces = await Enlaces.find({}).select("url -_id");
    //res.json({ enlaces });
  } catch (error) {
    console.log(error);
  }
};

//Retonar si el enlace tiene password o no
exports.tienePassword = async (req, res, next) => {
  const { url } = req.params;
  // Validar enlace
  const enlace = await Enlaces.findOne({ url });
  if (!enlace) {
    res.status(404).json({ msg: "Ese enlace no existe" });
    return next();
  }
  if (enlace.password) {
    return res.json({ password: true, enlace: enlace.url });
  }
  next();
};

// Verifica que el password sea correcto
exports.verificarPassword = async (req, res, next) => {
  const { url } = req.params;
  const { password } = req.body;
  // Consultar por el enlace
  const enlace = await Enlaces.findOne({ url });
  console.log("desde verificar password:", url);
  console.log("el enlace es: ", enlace);
  // Verificar el password
  if (bcrypt.compareSync(password, enlace.password)) {
    // Permitir la descarga del archivo
    next();
  } else {
    return res.status(401).json({ msg: "Password Incorrecto" });
  }
};

// Obtener el enlace
exports.obtenerEnlace = async (req, res, next) => {
  //console.log("entrando a obtener enlace");
  const { url } = req.params;
  // Validar enlace
  const enlace = await Enlaces.findOne({ url });
  //console.log("enlace de obtener enlace: ", enlace);
  if (!enlace) {
    res.status(404).json({ msg: "Ese enlace no existe" });
    return next();
  }
  // si el enlace existe
  res.json({ archivo: enlace.nombre, password: false });
  next();
};
