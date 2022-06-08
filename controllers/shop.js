const mongoose = require("mongoose");

const User = require("../models/user");
const Restaurant = require("../models/restaurant");
const FoodItem = require("../models/foodItem");
const Order = require("../models/order");

exports.getRestaurants = async (req, res, next) => {
  
  try {
     
    //Finding all the restaurants
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
    const restaurantId = mongoose.Types.ObjectId(req.body.restaurantId);
    
    //Fetching all the menu items in the specific restaurant
    const allItems = await Restaurant.findOne({ _id: restaurantId }).populate("items");

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

exports.getCart = async (req,res,next) =>{

  try{

    //Fetching the cart of the user
   const user = await User.findOne({ _id: req.userId}).populate("cart.items.productId")

   const products = user.cart.items;

   res.status(200).json({message : "Your cart fetched successfully" , products:products})
  
  }
  catch (err) {
    
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    
    next(err);
  }
}

exports.postCart = async (req,res,next) =>{
   try{
    
    //Getting productId for adding product in the cart
    const { productId } = req.body 
    
    //Finding that food item in db
    const foodItem =  await FoodItem.findById(productId)
   
    const user = await User.findById(req.userId)
    
    //Adding the produt in user cart
    await user.addToCart(foodItem);
   
    res.status(201).json({message:"product added in cart"})

  }catch(err){
    
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    
    next(err);
    }
  
}

exports.postCartDeleteProduct = async (req,res,next) =>{
  try{
    
    //Finding the product to remove from the cart
    const {productId} = req.body
   
    const user = await User.findById(req.userId)
    
    await user.removeFromCart(productId);
   
    res.status(200).json({message:"product deleted from the cart"})
  
  }catch(err){
    
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    
    next(err);
  }
}

exports.getOrders = async (req,res,next) =>{
  try{

     //Fetching all the orders for a user
     const orders = await Order.find({ "user.userId" : req.userId})

      res.status(200).json({message:"Your orders", orders:orders})

  }catch(err){
    
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    
    next(err);
  }
}

exports.postOrder =  async (req,res,next) =>{
     try {

      //Finding the user cart
      const user = await User.findOne({ _id: req.userId}).populate("cart.items.productId")
      
      //Finding all the products in the cart
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      
      //creating an order
      const order = new Order({
        user: {
          name: user.name,
          email: user.email,
          userId: req.userId
        },
        products: products
      });

      await order.save();
     
      //Removing the items from cart 
      await user.clearCart();

      res.status(201).json({message:"Order created", order:order})
       
     } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      
      next(err);
     }
}