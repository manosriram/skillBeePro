const express = require("express");
const router = express.Router();
const jsonwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const key = require("../../setup/url").secret;

// Importing Models.
const Student = require("../../models/Student");
const Admin = require("../../models/Admin");

// Basic Start Route..
router.get("/", (req, res) => {
  Student.find()
    .then(student => {
      res.render("index", { payload: student });
    })
    .catch(err => console.log(err));
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/adminRegister", (req, res) => {
  const adminKey = req.body.adminKey;
  const username = req.body.username;
  const password = req.body.password;

  if (adminKey === "admin1234") {
    const newAdmin = new Admin({
      username: username,
      password: password
    });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newAdmin.password, salt, (err, hash) => {
        if (err) throw err;

        // Storing hash in your password DB.
        newAdmin.password = hash;
        newAdmin.save().then(res.json({ success: "Admin Registered!!" }));
      });
    });
  } else {
    res.status(403).json({ noAccess: "Access Forbidden" });
  }
});

router.post("/adminLogin", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!req.cookies.auth_t) {
    Admin.findOne({ username: username })
      .then(admin => {
        if (!admin) {
          return res
            .status(404)
            .json({ incorrectUsername: "User Name Incorrect.." });
        }

        bcrypt
          .compare(password, admin.password)
          .then(isCorrect => {
            if (isCorrect) {
              var payload = {
                username: username,
                password: password
              };

              jsonwt.sign(
                payload,
                key,
                { expiresIn: 90000000 },
                (err, token) => {
                  res.cookie("auth_t", token, { maxAge: 90000000 });
                  res.redirect("/");
                  //   res.json({ success: "User Logged In!" });
                }
              );
            }
          })
          .catch();
      })
      .catch(err => console.log(err));
  } else {
    res.status(403).json({ noAccess: "Already Logged In.." });
  }
});

router.get("/adminLogout", (req, res) => {
  jsonwt.verify(req.cookies.auth_t, key, (err, user) => {
    if (user) {
      res.clearCookie("auth_t");
      req.logout();
      res.status(200).redirect("/");
    } else {
      res.status(403).json({ noAccess: "Access Forbidden." });
    }
  });
});

module.exports = router;
