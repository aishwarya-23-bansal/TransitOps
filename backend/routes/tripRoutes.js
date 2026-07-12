const express = require("express");
const router = express.Router();

const { createTrip,dispatchTrip ,completeTrip,cancelTrip,getTrips,getTripById} = require("../controllers/tripController");

// POST /api/trips
router.get("/", getTrips);
router.post("/", createTrip);
router.patch("/:id/dispatch", dispatchTrip);
router.patch("/:id/complete", completeTrip);
router.patch("/:id/cancel", cancelTrip);
router.get("/:id", getTripById);
module.exports = router;