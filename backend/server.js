require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const driverRoutes = require("./routes/driverRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const tripRoutes = require("./routes/tripRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const exportRoutes = require("./routes/exportRoutes");
const fuelRoutes = require("./routes/fuelRoutes");
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Connect to MongoDB
connectDB();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use("/api/trips", tripRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/fuel', fuelRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('TransitOps API is running...');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});