const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const User = require("../models/user");
const Restaurant = require("../models/restaurant");
const FoodItem = require("../models/foodItem");


exports.addRestaurant = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  const { title, description } = req.body;

  const findRestaurant = await Restaurant.findOne({ title: title });
  if (findRestaurant) {
    res.status(200).json({
      message: "Restaurant already available!",
      creator: { _id: req.userId },
    });
  } else {
    const restaurant = new Restaurant({
      title: title,
      description: description,
      creator: req.userId,
    });

    try {
      await restaurant.save();

      const user = await User.findById(req.userId);

      res.status(201).json({
        message: "Restaurant added Successfully!",
        restaurant: restaurant,
        creator: { _id: user._id, name: user.name },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
};

exports.addFoodItem = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  let restaurantId = mongoose.Types.ObjectId(req.params.id);
  const { title, description, price } = req.body;

  const allItems = await Restaurant.findOne({ _id: restaurantId }).populate(
    "items"
  );

  const ans = allItems.items.map((item) => {
    console.log(item.title)
    return item.title;
  });

 const check = ans.includes(title)

  if (check) {
    res.status(200).json({
      message: "Food Item already available in this restaurant!",
      creator: { _id: req.userId },
    });
  }
  
  else {
    const foodItem = new FoodItem({
      title: title,
      description: description,
      price: price,
      restaurant: restaurantId,
      creator: req.userId,
    });

    try {
      await foodItem.save();

     
      const restaurant = await Restaurant.findById(restaurantId);

     
      restaurant.items.push(foodItem);
      await restaurant.save();

      res.status(201).json({
        message: "Food Item added Successfully!",
        foodItem: foodItem,
        creator: { _id: req.userId },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
};
