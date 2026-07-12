const Maintenance = require("../models/Maintenance");
const Vehicle = require("../models/Vehicle");

// Create Maintenance
const createMaintenance = async (req, res) => {
  try {
    const { vehicle, title, description, cost } = req.body;
if (!vehicle || !title || cost == null) {
  return res.status(400).json({
    success: false,
    message: "Vehicle, title and cost are required",
  });
}
    const selectedVehicle = await Vehicle.findById(vehicle);

    if (!selectedVehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    if (selectedVehicle.status === "In Shop") {
      return res.status(400).json({
        success: false,
        message: "Vehicle is already under maintenance",
      });
    }
    if(selectedVehicle.status==="Retired"){
    return res.status(400).json({
        success:false,
        message:"Retired vehicle cannot be maintained"
    })
}

    const maintenance = await Maintenance.create({
      vehicle,
      title,
      description,
      cost,
    });

    selectedVehicle.status = "In Shop";
    await selectedVehicle.save();

    return res.status(201).json({
      success: true,
      message: "Maintenance record created successfully",
      maintenance,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Close Maintenance
const closeMaintenance = async (req, res) => {
  try {
    const { id } = req.params;

    const maintenance = await Maintenance.findById(id);

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: "Maintenance record not found",
      });
    }
if (maintenance.status === "Closed") {
  return res.status(400).json({
    success: false,
    message: "Maintenance is already closed",
  });
}
    const vehicle = await Vehicle.findById(maintenance.vehicle);
if (!vehicle) {
  return res.status(404).json({
    success: false,
    message: "Vehicle not found",
  });
}
    maintenance.status = "Closed";
    maintenance.endDate = new Date();

    if (vehicle.status !== "Retired") {
      vehicle.status = "Available";
    }

await Promise.all([
  maintenance.save(),
  vehicle.save(),
]);

    return res.status(200).json({
      success: true,
      message: "Maintenance closed successfully",
      maintenance,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.find()
      .populate("vehicle");

    return res.status(200).json({
      success: true,
      maintenance,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createMaintenance,
  closeMaintenance,
  getMaintenance
};