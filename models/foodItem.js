const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const foodItemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required:true
  },
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
});

module.exports = mongoose.model("FoodItem", foodItemSchema);
