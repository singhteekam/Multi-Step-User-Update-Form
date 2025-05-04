const mongoose = require("mongoose");

const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
  profilePhoto: {
    type: String, // URL or path to the uploaded image
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  currentPassword: {
    type: String,
    required: true
  },
  newPassword: {
    type: String,
    required: true
  },
  profession: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: function() {
      return this.profession === 'Entrepreneur';
    }
  },
  addressLine1: {
    type: String,
    required: true
  },
  country: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  subscriptionPlan: {
    type: String,
    default: 'Basic'
  },
  newsletter: {
    type: Boolean,
    default: true
  },
  dob: {
    type: Date,
  },
  gender: {
    type: String,
  },
  customGender: {
    type: String,
    required: function () {
      return this.gender === 'Other';
    }
  }
}, { timestamps: true });


module.exports = User = mongoose.model("users", userSchema);
