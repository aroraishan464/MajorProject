require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");


//importing routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const cityRoutes = require("./routes/city");

//connecting to DB
const Database = process.env.MONGODURI ? process.env.MONGODURI: process.env.DATABASE
mongoose.connect( Database, {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true,
  autoIndex: false
}).then(() => {
  console.log("DB CONNECTED");
});

//middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//routes middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", cityRoutes);

app.use(express.static(path.join(__dirname, "client/build")))
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

//port
const port = 8000 || process.env.PORT;

//starting server
app.listen(port, () => {
  console.log(`server connected at port ${port}`)
});