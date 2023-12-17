const express = require("express");
require("../db/conn");
const User = require("../models/userSchema");
const Jobs = require("../models/jobSchema");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");

//it is working in top to bottom to approach
router.get("/", (req, res) => {
  
  res.send("this is app using router");
});

// using promises

// router.post("/register", (req, res) => {
//   const { name, email, pwsd, cpwsd, age } = req.body;
//   console.log(name);
//   console.log(email);
//   console.log(!name || !email || !pwsd || !cpwsd || !age);
//   //   res.json({ message: req.body });
//   //   res.send("got the data");
//   if (!name || !email || !pwsd || !cpwsd || !age) {
//     return res.status(422).json({ error: "Plz fill all the details" });
//   }
//   User.findOne({ email: email })
//     .then((userExist) => {
//       if (userExist) {
//         return res.status(422).json({ error: "Email already exist" });
//       }
//       const user = new User({ name, email, pwsd, cpwsd, age });
//       user
//         .save()
//         .then(() => {
//           res.status(201).json({ message: "user registered successfully" });
//         })
//         .catch((err) => res.status(500).json({ error: "Failed to register" }));
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

//signin route

router.post("/register", async (req, res) => {
  const { name, email, pwsd, cpwsd, mobilenumber, loc, exp, skills } = req.body;

  //   console.log(name);
  //   console.log(email);
  //   console.log(!name || !email || !pwsd || !cpwsd || !age);
  //   res.json({ message: req.body });
  //   res.send("got the data");

  if (
    !name ||
    !email ||
    !pwsd ||
    !cpwsd ||
    !loc ||
    !mobilenumber ||
    !exp ||
    !skills
  ) {
    return res.status(422).json({ error: "Plz fill all the details" });
  }
  try {
    const userExist = await User.findOne({ email: email });
    console.log(userExist);
    if (userExist) {
      return res.status(422).json({ error: "Email already exist" });
    } else if (pwsd != cpwsd) {
      return res.status(422).json({ error: "password not matching" });
    } else {
      const user = new User({
        name,
        email,
        pwsd,
        cpwsd,
        mobilenumber,
        skills,
        loc,
        exp,
      });
      await user.save();
      res.status(201).json({ message: "user registered successfully" });
    }
  } catch (err) {
    console.log("hi");
    console.log(err);
  }
});

//login route

router.post("/signin", async (req, res) => {
  try {
    let token;
    const { email, pwsd } = req.body;
    console.log(email);
    console.log(pwsd);

    if (!email || !pwsd) {
      return res.status(400).json({ error: "Plz fill the data" });
    }

    const userLogin = await User.findOne({ email: email });
    console.log(userLogin);

    if (userLogin) {
      const isMatch = await bcrypt.compare(pwsd, userLogin.pwsd);

      token = await userLogin.generateAuthToken();
      console.log(token);

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 2589200000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ error: "user error" });
      } else {
        res.json({ messege: "User sign in successful" });
      }
    } else {
      res.status(400).json({ error: "user error" });
    }
  } catch (err) {
    console.log(err);
  }
});

// router.get("/getuser", async (req, res) => {

// });

router.get("/dashboard", authenticate, (req, res) => {
  console.log("dashboard server");
  console.log(res);
  res.send(req.rootUser);
});
router.get("/settings", authenticate, (req, res) => {
  console.log("dashboard server");
  res.send(req.rootUser);
});

//logout

router.get("/logout", (req, res) => {
  console.log("logging out");
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("User logout");
});

router.post("/jobs", async (req, res) => {
  console.log("Putting jobs details ");
  try {
    const data = req.body;
    console.log(data);
    // Jobs.create(data);
    const job = new Jobs(data);
    await job.save();
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});
router.get("/getdata", async (req, res) => {
  console.log("getting data");
  try {
    const data = await Jobs.find({});
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
