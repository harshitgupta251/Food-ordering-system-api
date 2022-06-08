const mongoose = require("mongoose");

const User = require("../models/user");
const Restaurant = require("../models/restaurant");
const FoodItem = require("../models/foodItem");

const {  restaurantSchema, productSchema } = require("../utils/joi-validator")


exports.addRestaurant = async (req, res, next) => {
  
  //checking for validation error
  const {err ,value} = await restaurantSchema.validateAsync(req.body)
  if(err){
    error.statusCode = 422;
    error.message = err.details.message;
     throw error;
  }
 
  const { title, description } = req.body;
  
  //Checking if restaurant already added
  const isRestaurantAvailable = await Restaurant.findOne({ title: title });
  
  if (isRestaurantAvailable) {
    res.status(409).json({
      message: "Restaurant already available!",
      creator: { _id: req.userId },
    });
  
  } else {
    
    //Creating and adding a restaurant
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

  //checking for validation error
  const {err ,value} = await productSchema.validateAsync(req.body)
  if(err){
    error.statusCode = 422;
    error.message = err.details.message;
     throw error;
  }

  const restaurantId = mongoose.Types.ObjectId(req.body.restaurantId);
  const { title, description, price } = req.body;

  //Populating the specific restaurant menu
  const allItems = await Restaurant.findOne({ _id: restaurantId }).populate("items");
  
 //Mapping through each menu item 
  const menu = allItems.items.map((item) => {
    return item.title;
  });

// Checking for availability of the menu item 
 const isItemAvailable = menu.includes(title)

  if (isItemAvailable) {
    res.status(409).json({
      message: "Food Item already available in this restaurant!",
      creator: { _id: req.userId },
    });
  }
  
  else {
    
    //Creating and adding a fooditem
    const foodItem = new FoodItem({
      title: title,
      description: description,
      price: price,
      restaurant: restaurantId,
      creator: req.userId,
    });

    try {

      await foodItem.save();

      //Finding the restaurant 
      const restaurant = await Restaurant.findById(restaurantId);

     //Adding the food item to that specific restaurant
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
