const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
  title: {
    type: String,
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
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "FoodItem",
      required: true,
    },
  ],
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
