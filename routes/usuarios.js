const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { check } = require("express-validator");

router.post(
  "/",
  [
    check("nombre", "el nombre es obligatorio").not().isEmpty(),
    check("email", "Agrega un email válido").isEmail(),
    check(
      "password",
      "El password debe de ser entre 6 y 15 caracteres"
    ).isLength({
      min: 6,
      max: 15,
    }),
  ],
  usuarioController.nuevoUsuario
);
//router.put('/')
//router.get('/')
//router.delete('/')

module.exports = router;
