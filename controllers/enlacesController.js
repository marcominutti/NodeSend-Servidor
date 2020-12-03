const Enlaces = require("../models/Enlace");
const shortid = require("shortid");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
exports.nuevoEnlace = async (req, res, next) => {
  // Revisar si hay errores
  // Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  // crear el objeto enlace
  const { nombre_original } = req.body;
  const enlace = new Enlaces();
  enlace.url = shortid.generate();
  enlace.nombre = shortid.generate();
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
    next();
  } catch (error) {
    console.log(error);
  }
};

// Obtener el enlace

exports.obtenerEnlace = async (req, res, next) => {
  const { url } = req.params;
  // Validar enlace
  const enlace = await Enlaces.findOne({ url });
  if (!enlace) {
    res.status(404).json({ msg: "Ese enlace no existe" });
    return next();
  }
  // si el enlace existe
  res.json({ archivo: enlace });

  // si las descargas son iguales a 1 borrar el archivo
  const { descargas, nombre } = enlace;
  if (descargas === 1) {
    // Eliminar el archivo
    req.archivo = nombre;
    // Eliminar la entrada de la base de datos
    await Enlaces.findOneAndRemove(req.params.url);

    next();
  } else {
    // si son > a 1 restar una descarga
    enlace.descargas--;
    await enlace.save();
    //res.json({ msg: `Al archivo le quedan ${enlace.descargas} descargas` });
  }
};
