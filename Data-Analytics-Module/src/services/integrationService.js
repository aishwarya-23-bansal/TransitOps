/*
 * Read-only adapter for collections owned by the other team members.
 * No external Mongoose models are declared here, so this module does not own
 * Vehicle, Trip, or Maintenance CRUD. Override collection names in .env when
 * teammates use non-standard MongoDB collection names.
 */
const mongoose = require('mongoose');

const collections = {
  vehicles: () => mongoose.connection.collection(process.env.VEHICLES_COLLECTION || 'vehicles'),
  trips: () => mongoose.connection.collection(process.env.TRIPS_COLLECTION || 'trips'),
  maintenance: () => mongoose.connection.collection(process.env.MAINTENANCE_COLLECTION || 'maintenances'),
};

async function getVehicles() { return collections.vehicles().find({}).toArray(); }
async function getCompletedTrips() {
  return collections.trips().find({ status: { $in: ['Completed', 'completed'] } }).toArray();
}
async function getMaintenanceRecords() { return collections.maintenance().find({}).toArray(); }

const vehicleIdOf = (record) => String(record.vehicleId || record.vehicle || '');
const numberOf = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);

module.exports = { getVehicles, getCompletedTrips, getMaintenanceRecords, vehicleIdOf, numberOf };
