const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

router.post("/", usuarioController.nuevoUsuario);
//router.put('/')
//router.get('/')
//router.delete('/')

module.exports = router;
