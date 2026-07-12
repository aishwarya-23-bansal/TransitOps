# TransitOps - Data & Analytics Module

This Express + MongoDB module is the Member 4 deliverable. It owns only Fuel and Expense data. Vehicle, Trip, and Maintenance data are read through a read-only integration adapter; it does not create models, routes, or CRUD for those modules.

## Run

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

Set `MONGO_URI` in `.env`. The default external collection names match the existing team schemas: `vehicles`, `trips`, and `maintenances`. Change the collection environment values only if another module uses a different MongoDB collection name.

## Integration contract

Analytics expects Vehicle documents to have `_id`, `status`, and `acquisitionCost`; Trip documents to have `vehicle` (or `vehicleId`), `actualDistance`, and `status: "Completed"`; Maintenance documents to have `vehicle` (or `vehicleId`) and `cost`. Fuel and Expense use `vehicleId`.

`REVENUE_PER_KM` is configured once in `.env` and defaults to `25`. ROI is `(distance * REVENUE_PER_KM - (fuel + maintenance)) / acquisitionCost`. A zero acquisition cost returns ROI `0` instead of dividing by zero. Dashboard `topVehicle` is the vehicle with the greatest completed-trip revenue.

## Endpoints

All JSON endpoints return `200` on successful reads/updates, `201` on creates, and `204` on successful deletes. Invalid input returns `400`; missing resource returns `404`; unhandled errors return `500` as `{ "message": "..." }`.

### Fuel logs

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/fuel` | Create fuel log (`201`) |
| GET | `/api/fuel` | List fuel logs |
| GET | `/api/fuel/:id` | Get a fuel log |
| PUT | `/api/fuel/:id` | Partially update a fuel log |
| DELETE | `/api/fuel/:id` | Delete a fuel log (`204`) |

Create request:

```json
{ "vehicleId": "6651e15b6ec67c6a6b2ab123", "liters": 40, "cost": 4200, "date": "2026-07-12" }
```

Example response (`201`):

```json
{ "_id": "6651e1a86ec67c6a6b2ab124", "vehicleId": "6651e15b6ec67c6a6b2ab123", "liters": 40, "cost": 4200, "date": "2026-07-12T00:00:00.000Z" }
```

`vehicleId` is required and must be a MongoDB ObjectId; `liters` and `cost` must be greater than zero. Example validation response: `{ "message": "liters must be greater than 0." }`.

### Expenses

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/expenses` | Create expense (`201`) |
| GET | `/api/expenses` | List expenses |
| GET | `/api/expenses/:id` | Get expense |
| PUT | `/api/expenses/:id` | Partially update expense |
| DELETE | `/api/expenses/:id` | Delete expense (`204`) |

Create request:

```json
{ "vehicleId": "6651e15b6ec67c6a6b2ab123", "type": "Toll", "amount": 300, "description": "Mumbai-Pune expressway", "date": "2026-07-12" }
```

Example response (`201`):

```json
{ "_id": "6651e1a86ec67c6a6b2ab125", "vehicleId": "6651e15b6ec67c6a6b2ab123", "type": "Toll", "amount": 300, "description": "Mumbai-Pune expressway" }
```

`amount` must be greater than zero. `type` must be `Toll`, `Parking`, or `Other`; `vehicleId` is required when creating.

### Analytics

| Method | Endpoint | Output |
| --- | --- | --- |
| GET | `/api/analytics/operational-cost` | Fuel + Maintenance cost by vehicle |
| GET | `/api/analytics/fuel-efficiency` | Completed trip distance / fuel by vehicle |
| GET | `/api/analytics/fleet-utilization` | On Trip / total vehicle percentage |
| GET | `/api/analytics/vehicle-roi` | Revenue, costs, acquisition cost, and ROI per vehicle |
| GET | `/api/analytics/dashboard` | Dashboard summary |

Operational cost example:

```json
[{ "vehicleId": "6651e15b6ec67c6a6b2ab123", "fuelCost": 1000, "maintenanceCost": 500, "operationalCost": 1500 }]
```

Fuel-efficiency example:

```json
[{ "vehicleId": "6651e15b6ec67c6a6b2ab123", "distance": 540, "fuel": 40, "fuelEfficiency": 13.5 }]
```

Fleet-utilization example:

```json
{ "totalVehicles": 27, "onTripVehicles": 20, "fleetUtilization": 74.07 }
```

ROI example:

```json
[{ "vehicleId": "6651e15b6ec67c6a6b2ab123", "distance": 540, "revenue": 13500, "fuelCost": 1000, "maintenanceCost": 500, "acquisitionCost": 100000, "roi": 0.12 }]
```

Dashboard example:

```json
{ "fleetUtilization": 74.07, "totalFuelCost": 9000, "totalOperationalCost": 18000, "averageFuelEfficiency": 13.4, "topVehicle": { "vehicleId": "6651e15b6ec67c6a6b2ab123", "revenue": 13500 } }
```

### Exports

| Method | Endpoint | Status | Result |
| --- | --- | --- | --- |
| GET | `/api/export/csv` | `200` | Download `transitops-report.csv` containing fuel logs, expense logs, and every analytics section |
| GET | `/api/export/pdf` | `200` | Download `transitops-report.pdf` with the same report data |

## Structure

```
backend/
  src/
    config/db.js
    constants/analytics.js
    controllers/
    middlewares/
    models/Fuel.js, Expense.js
    routes/
    services/analyticsService.js, integrationService.js, reportService.js
    utils/csvGenerator.js, pdfGenerator.js
    app.js
  server.js
```

`src/` is used to keep the new module isolated from legacy teammate files currently at the backend root. This makes it easy to merge routes into a shared application later without moving or duplicating their CRUD modules.
