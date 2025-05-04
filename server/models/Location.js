const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  code: String,
  name: String,
});

const stateSchema = new mongoose.Schema({
  code: String,
  name: String,
  cities: [citySchema],
});

const countrySchema = new mongoose.Schema({
  code: String,
  name: String,
  states: [stateSchema],
});

module.exports = mongoose.model("Location", countrySchema);
