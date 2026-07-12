const mongoose = require('mongoose');

const fuelSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true, index: true },
  liters: { type: Number, required: true, min: 0 },
  cost: { type: Number, required: true, min: 0 },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Fuel', fuelSchema);