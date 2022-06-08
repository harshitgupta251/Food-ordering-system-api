const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

//PUT /api/register
router.put("/register",authController.register);

//POST /api/login
router.post("/login", authController.login);

module.exports = router;