const express = require("express");
const router = express.Router();
const jsonwt = require("jsonwebtoken");
const key = require("../../setup/url").secret;
const multer = require("multer");
const path = require("path");
router.use(express.static("../../public/myuploads"));

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, __dirname + "../../../public/myuploads/");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage });

const Admin = require("../../models/Admin");
const Student = require("../../models/Student");

router.get("/", (req, res) => {
  res.json({ message: "Hey Student!" });
});

router.get("/studentSearch", (req, res) => {
  res.render("searchStudent");
});

router.get("/studentBatch", (req, res) => {
  res.render("studentBatch");
});

router.get("/profile", (req, res) => {
  res.render("profile");
});

router.get("/studentRegister", (req, res) => {
  jsonwt.verify(req.cookies.auth_t, key, (err, user) => {
    if (user) {
      res.render("studentForm");
    } else {
      res.status(403).json({ noAccess: "Access Forbidden." });
    }
  });
});

router.post("/studentRegister", upload.single("profilePic"), (req, res) => {
  jsonwt.verify(req.cookies.auth_t, key, (err, user) => {
    if (user) {
      Student.findOne({ email: req.body.email })
        .then(person => {
          if (!person) {
            if (!req.body.email)
              return res.json({ emailRequired: "Email Required.." });
            if (!req.body.name)
              return res.json({ nameRequired: "Name Required.." });
            if (req.body.course == "Course")
              return res.json({
                courseRequired: "Course Required.."
              });
            if (!req.body.courseLength)
              return res.json({
                courseLengthRequired: "Course Length Required.."
              });
            if (!req.body.yearOfJoining)
              return res.json({
                joiningYearRequired: "Joining Year Required.."
              });

            const email = req.body.email;
            const name = req.body.name;
            const username = req.body.username;
            const gender = req.body.gender;
            const course = req.body.course;
            const experience = req.body.experience;
            const courseLength = req.body.courseLength;
            const yearOfJoining = req.body.yearOfJoining;
            const worksAt = req.body.worksAt;
            const worksAs = req.body.worksAs;
            const profilePic = req.file.originalname;

            const newStudent = new Student({
              name: name,
              email: email,
              username: username,
              gender: gender,
              course: course,
              experience: experience,
              courseLength: courseLength,
              yearOfJoining: yearOfJoining,
              worksAt: worksAt,
              worksAs: worksAs,
              profilePic: profilePic
            });
            newStudent.save();
            res.render("profile", { payload: newStudent });
          }
          if (person) {
            res.status(403).json({ noAccess: "Student Already Registered.!" });
          }
        })
        .catch(err => console.log(err));
    } else {
      return res.status(403).json({ noAccess: "Access Forbidden." });
    }
  });
});

router.get("/byBatchYear/:year", (req, res) => {
  Student.find({ yearOfJoining: req.params.year })
    .then(students => {
      res.render("index", { payload: students });
    })
    .catch(err => console.log(err));
});

// Search For A Student By Course.
router.get("/byCourse/:courseName", (req, res) => {
  Student.find({ course: req.params.courseName })
    .then(students => {
      res.render("index", { payload: students });
    })
    .catch(err => console.log(err));
});

router.post("/studentProfile/byName", (req, res) => {
  Student.findOne({ name: req.body.name })
    .then(student => {
      if (!student)
        return res.status(404).json({ notFound: "User Not Found.." });

      res.render("profile", { payload: student });
    })
    .catch(err => console.log(err));
});
router.get("/studentProfile/:name", (req, res) => {
  Student.findOne({ name: req.params.name })
    .then(student => {
      res.render("profile", { payload: student });
    })
    .catch(err => console.log(err));
});

module.exports = router;
