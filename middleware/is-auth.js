const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  
  //Checking for authorization header
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }

  //Retrieving token from auth header
  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    //verifying the token
    decodedToken = jwt.verify(token, "TGjyXRNCHFzMHmrjjDfCoqOqV");
  } catch {
    error.statusCode = 500;
    throw error;
  }

  if (!decodedToken) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
