const shortid = require("shortid");
// Subida de archivos
const multer = require("multer");

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
  const upload = multer(configuracionMulter).single("archivo");

  upload(req, res, async (error) => {
    console.log(req.file);
    if (!error) {
      res.json({ archivo: req.file.filename });
    } else {
      console.log(error);
      return next();
    }
  });
};

exports.eliminarArchivo = async (req, res) => {};
