const express = require("express");

const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// GET /api/restaurant
router.get("/restaurant", isAuth, shopController.getRestaurants);

//GET /api/menu
router.get("/menu", isAuth, shopController.getMenu);

//GET /api/cart 
router.get("/cart", isAuth, shopController.getCart);

//POST /api/cart/
router.post("/cart", isAuth, shopController.postCart);

//POST /api/cart-delete
router.post("/cart-delete", isAuth, shopController.postCartDeleteProduct);

//GET /api/orders
router.get("/orders", isAuth, shopController.getOrders);

//POST /api/create-order
router.post("/create-order", isAuth, shopController.postOrder);

module.exports = router;
