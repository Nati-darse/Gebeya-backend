const dotenv = require('dotenv');
const connectDB = require('./config/database');
const app = require('./app');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Gebeya Backend Server running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV}`);
});