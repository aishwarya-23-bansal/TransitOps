const Trip = require("../models/Trip");
const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");

const createTrip = async (req, res) => {
  try {
    res.status(200).json({
      message: "Create Trip API working",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createTrip,
};