const User = require("../models/user");

module.exports = async (req, res, next) => {

  // Check if the requesting user is marked as admin in database
  const user = await User.findById(req.userId)
 
  let role = user.role  

  if (role == "Admin") {
    next();
  } else {
    const error = new Error("You do not have permission to access it.");
    error.statusCode = 401;
    throw error;
  }
  
};
