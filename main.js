
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Start the Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Import routes and middleware
const lightningRoutes = require('./routes/lightning.route');
const {errorHandler} = require('./middleware/errorHandler.middleware');

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/lightning', lightningRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'LNbits Lightning API'
  });
});

// Error handling middleware
app.use(errorHandler);

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Lightning API server running on port ${PORT}`);
  console.log(`⚡ The Lnbits Bitcoin Hackathon is running on : http://localhost:${PORT}`);
  console.log(`📡 LNbits URL: ${process.env.LNBITS_NODE_URL}`);
});