require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require("./routes/authRoutes");
// const vehicleRoutes = require("./routes/vehicleRoutes");
// const driverRoutes = require("./routes/driverRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const tripRoutes = require("./routes/tripRoutes");

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/vehicles', vehicleRoutes);
// app.use('/api/drivers',driverRoutes);
app.use('/api/maintenance',maintenanceRoutes );
app.use("/api/trips", tripRoutes);


// NOTE for Member 4: add your routes here, e.g.
// app.use('/api/fuel-logs', require('./routes/fuelLogRoutes'));
// app.use('/api/expenses', require('./routes/expenseRoutes'));
// app.use('/api/reports', require('./routes/reportRoutes'));

// Health check
app.get('/', (req, res) => {
  res.send('TransitOps API is running...');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
