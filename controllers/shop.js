const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const User = require("../models/user");
const Restaurant = require("../models/restaurant");
const FoodItem = require("../models/foodItem");

exports.getRestaurants = async (req, res, next) => {
  try {
    const info = await Restaurant.find();

    res
      .status(200)
      .json({ message: "Restaurants fetched successfully", restaurants: info });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getMenu = async (req, res, next) => {
  try {
    const restaurantId = mongoose.Types.ObjectId(req.params.id);

    const allItems = await Restaurant.findOne({ _id: restaurantId }).populate(
      "items"
    );

    res
      .status(200)
      .json({ message: "Menu fetched successfully", menu: allItems.items });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
