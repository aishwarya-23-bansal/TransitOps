const express = require("express");
const router = express.Router();

const { createTrip,dispatchTrip ,completeTrip,cancelTrip,getTrips,getTripById} = require("../controllers/tripController");


router.get("/", getTrips);
router.post("/", createTrip);
router.put("/:id/dispatch", dispatchTrip);
router.put("/:id/complete", completeTrip);
router.put("/:id/cancel", cancelTrip);
router.get("/:id", getTripById);
module.exports = router;