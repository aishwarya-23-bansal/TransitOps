const Fuel = require('../models/Fuel');
const { REVENUE_PER_KM } = require('../constants/analytics');
const integration = require('./integrationService');

const makeTotals = (records, amountField) => records.reduce((totals, record) => {
  const id = integration.vehicleIdOf(record);
  if (id) totals.set(id, (totals.get(id) || 0) + integration.numberOf(record[amountField]));
  return totals;
}, new Map());

const fixed = (number, digits = 2) => Number(number.toFixed(digits));
const mapKeys = (...maps) => new Set(maps.flatMap((map) => [...map.keys()]));

async function getInputs() {
  const [fuelLogs, maintenance, trips, vehicles] = await Promise.all([
    Fuel.find().lean(), integration.getMaintenanceRecords(), integration.getCompletedTrips(), integration.getVehicles(),
  ]);
  return { fuelLogs, maintenance, trips, vehicles };
}

async function operationalCosts() {
  const { fuelLogs, maintenance } = await getInputs();
  const fuel = makeTotals(fuelLogs, 'cost');
  const maintenanceCost = makeTotals(maintenance, 'cost');
  return [...mapKeys(fuel, maintenanceCost)].map((vehicleId) => {
    const fuelCost = fixed(fuel.get(vehicleId) || 0);
    const maintenanceValue = fixed(maintenanceCost.get(vehicleId) || 0);
    return { vehicleId, fuelCost, maintenanceCost: maintenanceValue, operationalCost: fixed(fuelCost + maintenanceValue) };
  });
}

async function fuelEfficiency() {
  const { fuelLogs, trips } = await getInputs();
  const fuel = makeTotals(fuelLogs, 'liters');
  const distance = makeTotals(trips, 'actualDistance');
  return [...mapKeys(fuel, distance)].map((vehicleId) => {
    const totalFuel = fixed(fuel.get(vehicleId) || 0);
    const totalDistance = fixed(distance.get(vehicleId) || 0);
    return { vehicleId, distance: totalDistance, fuel: totalFuel, fuelEfficiency: totalFuel ? fixed(totalDistance / totalFuel) : 0 };
  });
}

async function fleetUtilization() {
  const vehicles = await integration.getVehicles();
  const totalVehicles = vehicles.length;
  const onTripVehicles = vehicles.filter((vehicle) => String(vehicle.status).toLowerCase() === 'on trip').length;
  return { totalVehicles, onTripVehicles, fleetUtilization: totalVehicles ? fixed((onTripVehicles / totalVehicles) * 100) : 0 };
}

async function vehicleRoi() {
  const { fuelLogs, maintenance, trips, vehicles } = await getInputs();
  const fuel = makeTotals(fuelLogs, 'cost');
  const maintenanceCost = makeTotals(maintenance, 'cost');
  const distance = makeTotals(trips, 'actualDistance');
  const vehicleMap = new Map(vehicles.map((vehicle) => [String(vehicle._id), vehicle]));
  const ids = mapKeys(fuel, maintenanceCost, distance, vehicleMap);
  return [...ids].map((vehicleId) => {
    const vehicle = vehicleMap.get(vehicleId) || {};
    const totalDistance = fixed(distance.get(vehicleId) || 0);
    const revenue = fixed(totalDistance * REVENUE_PER_KM);
    const fuelCost = fixed(fuel.get(vehicleId) || 0);
    const maintenanceValue = fixed(maintenanceCost.get(vehicleId) || 0);
    const acquisitionCost = fixed(integration.numberOf(vehicle.acquisitionCost));
    return {
      vehicleId, distance: totalDistance, revenue, fuelCost, maintenanceCost: maintenanceValue,
      acquisitionCost, roi: acquisitionCost ? fixed((revenue - (fuelCost + maintenanceValue)) / acquisitionCost) : 0,
    };
  });
}

async function dashboard() {
  const [costs, efficiencies, utilization, roi] = await Promise.all([operationalCosts(), fuelEfficiency(), fleetUtilization(), vehicleRoi()]);
  const totalFuelCost = fixed(costs.reduce((total, item) => total + item.fuelCost, 0));
  const totalOperationalCost = fixed(costs.reduce((total, item) => total + item.operationalCost, 0));
  const validEfficiencies = efficiencies.filter((item) => item.fuel > 0);
  const averageFuelEfficiency = validEfficiencies.length
    ? fixed(validEfficiencies.reduce((total, item) => total + item.fuelEfficiency, 0) / validEfficiencies.length) : 0;
  const topVehicle = roi.sort((a, b) => b.revenue - a.revenue)[0] || {};
  return { fleetUtilization: utilization.fleetUtilization, totalFuelCost, totalOperationalCost, averageFuelEfficiency, topVehicle };
}

module.exports = { operationalCosts, fuelEfficiency, fleetUtilization, vehicleRoi, dashboard };