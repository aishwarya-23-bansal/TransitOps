const express = require("express");
const router = express.Router();

const {
  createMaintenance,
  closeMaintenance,
  getMaintenance
} = require("../controllers/maintenanceController");


router.get("/", getMaintenance);
router.post("/", createMaintenance);
router.patch("/:id/close", closeMaintenance);

module.exports = router;