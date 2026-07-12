const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = Number(process.env.PORT) || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`TransitOps API listening on port ${PORT}`));
};

start().catch((error) => {
  console.error('Unable to start API:', error.message);
  process.exit(1);
});
