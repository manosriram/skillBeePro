const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  // Personal Details...
  name: {
    type: String
  },
  profilePic: {
    type: String,
    required: false
  },
  username: {
    type: String
  },
  email: {
    type: String
  },
  gender: {
    type: String,
    required: false
  },

  // Professional Details..
  course: {
    type: String
  },
  yearOfJoining: {
    type: Number
  },
  experience: {
    type: String
  },
  courseLength: {
    type: Number
  },
  memberSince: {
    type: Date,
    default: Date.now
  },
  worksAt: {
    type: String
  },
  worksAs: {
    type: String
  }
});

module.exports = Student = mongoose.model("myStudent", StudentSchema);
