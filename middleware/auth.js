const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (authHeader) {
    // Obtener el token
    // el token está en el arreglo en la posición 1 despues de bearer
    const token = authHeader.split(" ")[1];

    try {
      // comprobar el token
      const usuario = jwt.verify(token, process.env.SECRETA);
      req.usuario = usuario;
    } catch (error) {
      res.json({ msg: "Error del token" });
    }
  }
  return next();
};
