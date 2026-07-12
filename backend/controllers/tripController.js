const Trip = require("../models/Trip");
const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");

// Create Trip
const createTrip = async (req, res) => {
  try {
    const {
      source,
      destination,
      vehicle,
      driver,
      cargoWeight,
      plannedDistance,
    } = req.body;

    if (
  !source ||
  !destination ||
  !vehicle ||
  !driver ||
  cargoWeight == null ||
  plannedDistance == null
) {
  return res.status(400).json({
    success: false,
    message: "All fields are required",
  });
}
    // Check Vehicle Exists
    const selectedVehicle = await Vehicle.findById(vehicle);

    if (!selectedVehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // Check Driver Exists
    const selectedDriver = await Driver.findById(driver);

    if (!selectedDriver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }
// Vehicle must be Available
if (selectedVehicle.status !== "Available") {
  return res.status(400).json({
    success: false,
    message: "Vehicle is not available for dispatch",
  });
}

// Driver must be Available
if (selectedDriver.status !== "Available") {
  return res.status(400).json({
    success: false,
    message: "Driver is not available for dispatch",
  });
}
// Driver license should not be expired
const today = new Date();

if (new Date(selectedDriver.licenseExpiryDate) < today) {
  return res.status(400).json({
    success: false,
    message: "Driver license has expired",
  });
}
// Cargo should not exceed vehicle capacity
if (cargoWeight > selectedVehicle.maxLoadCapacity) {
  return res.status(400).json({
    success: false,
    message: "Cargo weight exceeds vehicle capacity",
  });
}
    // Create Trip
    const trip = await Trip.create({
      source,
      destination,
      vehicle,
      driver,
      cargoWeight,
      plannedDistance,
    });

    return res.status(201).json({
      success: true,
      message: "Trip created successfully",
      trip,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Dispatch Trip
const dispatchTrip = async (req, res) => {
  try {
    const { id } = req.params;

    // Find Trip
    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }
if (trip.status !== "Draft") {
  return res.status(400).json({
    success: false,
    message: "Only Draft trips can be dispatched",
  });
}
    // Find Vehicle
    const vehicle = await Vehicle.findById(trip.vehicle);

    // Find Driver
    const driver = await Driver.findById(trip.driver);
    if (!vehicle) {
  return res.status(404).json({
    success: false,
    message: "Vehicle not found",
  });
}

if (!driver) {
  return res.status(404).json({
    success: false,
    message: "Driver not found",
  });
}
    if (vehicle.status !== "Available") {
  return res.status(400).json({
    success: false,
    message: "Vehicle is not available",
  });
}

if (driver.status !== "Available") {
  return res.status(400).json({
    success: false,
    message: "Driver is not available",
  });
}
const today = new Date();

if (new Date(driver.licenseExpiryDate) < today) {
  return res.status(400).json({
    success: false,
    message: "Driver license has expired",
  });
}
    // Update Status
    trip.status = "Dispatched";
    vehicle.status = "On Trip";
    driver.status = "On Trip";

    await trip.save();
    await vehicle.save();
    await driver.save();

    return res.status(200).json({
      success: true,
      message: "Trip dispatched successfully",
      trip,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Complete Trip
const completeTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      finalOdometer,
      fuelConsumed,
      actualDistance,
      revenue,
    } = req.body;

    // Find Trip
    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }
if(trip.status!=="Dispatched"){
    return res.status(400).json({
        success:false,
        message:"Trip is not dispatched"
    })
}
    // Find Vehicle
    const vehicle = await Vehicle.findById(trip.vehicle);

    // Find Driver
    const driver = await Driver.findById(trip.driver);
if (!vehicle || !driver) {
  return res.status(404).json({
    success: false,
    message: "Vehicle or Driver not found",
  });
}
    // Update Trip
    
    if (
  finalOdometer == null ||
  fuelConsumed == null ||
  actualDistance == null
) {
  return res.status(400).json({
    success: false,
    message: "Complete trip details are required",
  });
}
if (finalOdometer < vehicle.odometer) {
  return res.status(400).json({
    success: false,
    message: "Final odometer cannot be less than current odometer",
  });
}
trip.status = "Completed";
    trip.finalOdometer = finalOdometer;
    trip.fuelConsumed = fuelConsumed;
    trip.actualDistance = actualDistance;
    trip.revenue = revenue;

    // Update Vehicle
    vehicle.status = "Available";
    vehicle.odometer = finalOdometer;

    // Update Driver
    driver.status = "Available";

    await trip.save();
    await vehicle.save();
    await driver.save();

    return res.status(200).json({
      success: true,
      message: "Trip completed successfully",
      trip,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Cancel Trip
const cancelTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }
if(trip.status!=="Dispatched"){
    return res.status(400).json({
        success:false,
        message:"Only dispatched trips can be cancelled"
    })
}
    const vehicle = await Vehicle.findById(trip.vehicle);
    const driver = await Driver.findById(trip.driver);
if (!vehicle || !driver) {
  return res.status(404).json({
    success: false,
    message: "Vehicle or Driver not found",
  });
}
    // Update Status
    trip.status = "Cancelled";
   if (vehicle.status !== "Retired") {
    vehicle.status = "Available";
}

driver.status = "Available";

    await trip.save();
    await vehicle.save();
    await driver.save();

    return res.status(200).json({
      success: true,
      message: "Trip cancelled successfully",
      trip,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate("vehicle")
      .populate("driver");

    return res.status(200).json({
      success: true,
      trips,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("vehicle")
      .populate("driver");

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    return res.status(200).json({
      success: true,
      trip,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
  getTrips,
  getTripById
};