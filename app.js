const path = require("path");
const fs = require("fs");

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const morgan = require("morgan");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const app = express();

//Creating a path for storing log streams
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

//Using morgan for storing logs in root folder
app.use(morgan("combined", { stream: accessLogStream }));

app.use(express.json());

 //Handling CORS error
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTION, GET,POST,PUT,PATCH,DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api", adminRoutes);
app.use("/api", shopRoutes);
app.use("/api", authRoutes);

  // Error handling
app.use((error, req, res, next) => {
  console.log(error);

  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
 res.status(status).json({ message: message, data: data });
});

const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("MONGODB connected!", `Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
