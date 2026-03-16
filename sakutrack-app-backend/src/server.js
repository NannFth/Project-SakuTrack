require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const savingRoutes = require('./routes/savingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/savings', savingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', authRoutes);

app.get('/', (req, res) => {
  res.status(200).send('API SakuTrack is running...');
});

const port = process.env.PORT || 3000;
const host = process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0';

app.listen(port, () => {
  console.log(`Server running at http://${host}:${port}`);
});