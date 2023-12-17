const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config({ path: "./config.env" });
require("./db/conn");

app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
    origin:["https://career-guru-frontend.vercel.app"],
    methods: ["POST","GET"],
    credentials: true
  } 
))

// const users = require("./models/userSchema")

const PORT = process.env.PORT;

// const url =
//   "mongodb+srv://user1:alle1@cluster0.p3phjsx.mongodb.net/?retryWrites=true&w=majority";

// mongoose.connect(
//   "mongodb+srv://user1:alle1@cluster0.p3phjsx.mongodb.net/?retryWrites=true&w=majority",
//   function (err) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("MongoDB connection successfull");
//     }
//   }
// );

//MIDDLEWARE

//it is already called before called by app
app.use(require("./router/auth"));

// // app.get("/", (req, res) => {
// //   res.send("this is app ");
// // });

// app.get("/about", middleware, (req, res) => {
//   console.log("This is about");
//   res.send("this is about ");
// });

// app.get("/sign", (req, res) => {
//   res.send("this is signup ");
// });

// console.log("Hello");

app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
});
