const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const {authSchema}  = require("../utils/joi-validator")

exports.register = async (req, res, next) => {

  //Validating request body using joi
  const {err ,value} = await authSchema.validateAsync(req.body)
  if(err){
   error.statusCode = 422;
   error.message = err.details.message;
    throw error;
  }
 
  try {
  const {email , name , password , role} = req.body;

  //checking if email already exists
  const isEmailExists = await User.findOne({email:email})
  if(isEmailExists){
    const error =  new Error("E-mail already exists");
    error.statusCode = 409;
    throw error;
  }
  
    //Encrypting the password 
    const hashedPw = await bcrypt.hash(password, 12);
    
    //creating the user
    const user = new User({
      email: email,
      password: hashedPw,
      name: name,
      role:role
    });

    const result = await user.save();
    res.status(201).json({ message: "User created!", userId: result._id });
  
  } catch (err) {
    
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  
  }
};

exports.login = async (req, res, next) => {
  
  const {email, password} = req.body;
  
  try {
    //Finding user using email in db
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 401;
      throw error;
    }
    
    //Checking for password equality
    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = new Error("Wrong Password!");
      error.statusCode = 401;
      throw error;
    }
    
    //Creating a jwt token
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      "TGjyXRNCHFzMHmrjjDfCoqOqV",
      { expiresIn: "3h" }
    );
    
    res.status(200).json({ token: token, userId: user._id.toString() });
  
  } catch (err) {
   
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }

};
