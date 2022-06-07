const express = require("express");
const { body } = require("express-validator");

const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// GET /api/restaurant
router.get("/restaurant", isAuth, shopController.getRestaurants);

//GET /api/:id/menu
router.get("/:id/menu", isAuth, shopController.getMenu);

module.exports = router;
