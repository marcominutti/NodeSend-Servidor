const shortid = require("shortid");
// Subida de archivos
const multer = require("multer");
const fs = require("fs");
const Enlaces = require("../models/Enlace");
exports.subirArchivo = async (req, res, next) => {
  const configuracionMulter = {
    /*  si está autenticado el archivo 
          que puede subir será de 10 megas y si no de 1 mega */
    limits: { fileSize: req.usuario ? 10000000 : 1000000 },
    storage: (fileStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, __dirname + "/../uploads");
      },
      filename: (req, file, cb) => {
        const extension = file.originalname.substring(
          file.originalname.lastIndexOf("."),
          file.originalname.length
        );
        cb(null, `${shortid.generate()}${extension}`);
      },
    })),
  };

  //if(configuracionMulter.limits.fileSize > 1)
  const upload = multer(configuracionMulter).single("archivo");

  upload(req, res, async (error) => {
    //console.log(req.file.filename);
    if (!error) {
      res.json({ archivo: req.file.filename });
    } else {
      console.log(error);
      return next();
    }
  });
};

exports.eliminarArchivo = async (req, res) => {
  console.log(req.archivo);
  try {
    fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
    console.log("Archivo eliminado");
  } catch (error) {
    console.log(error);
  }
};

//Descargar un archivo

exports.descargar = async (req, res, next) => {
  //obtiene el enlcae
  const { archivo } = req.params;
  const enlace = await Enlaces.findOne({ nombre: archivo });

  const archivoDescarga = __dirname + "/../uploads/" + archivo;
  res.download(archivoDescarga);

  //Eliminar el archivo y la entrada de la base ded atos
  // si las descargas son iguales a 1 borrar el archivo
  const { descargas, nombre } = enlace;
  if (descargas === 1) {
    // Eliminar el archivo
    req.archivo = nombre;
    // Eliminar la entrada de la base de datos
    await Enlaces.findOneAndRemove(enlace.id);

    next();
  } else {
    // si son > a 1 restar una descarga
    enlace.descargas--;
    await enlace.save();
    //res.json({ msg: `Al archivo le quedan ${enlace.descargas} descargas` });
  }
};
