const express = require("express");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const isAdmin = require("../middleware/is-admin");

const router = express.Router();

// POST /api/add/restaurant
router.post(
  "/add/restaurant",
  isAuth,
  isAdmin,
  [
    body("title").trim().isLength({ min: 5 }),
    body("description").trim().isLength({ min: 5 }),
  ],
  adminController.addRestaurant
);

//POST /api/add/:id/foodItem
router.post(
  "/add/:id/foodItem",
  isAuth,
  isAdmin,
  [
    body("title").trim().isLength({ min: 5 }),
    body("description").trim().isLength({ min: 5 }),
  ],
  adminController.addFoodItem
)

module.exports = router;
