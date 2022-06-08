const express = require("express");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const isAdmin = require("../middleware/is-admin");

const router = express.Router();

// POST /api/add/restaurant   
router.post("/add/restaurant", isAuth, isAdmin, adminController.addRestaurant);

//POST /api/add/foodItem
router.post("/add/foodItem", isAuth, isAdmin, adminController.addFoodItem);

module.exports = router;
