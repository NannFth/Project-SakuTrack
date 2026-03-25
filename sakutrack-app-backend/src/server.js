require('dotenv').config();
require('./config/firebase');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const cors = require('cors');

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.set('socketio', io);

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const savingRoutes = require('./routes/savingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const { startCronJobs } = require('./services/cronService');

io.on('connection', (socket) => {
  console.log('Seseorang terkoneksi ke sistem real-time:', socket.id);

  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User dengan ID ${userId} berhasil bergabung ke room notifikasi.`);
  });

  socket.on('disconnect', () => {
    console.log('Koneksi real-time terputus.');
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/savings', savingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
  res.status(200).send('API SakuTrack is running with Real-time Support...');
});

startCronJobs(io);

const port = process.env.PORT || 3000;
const host = process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0';

server.listen(port, () => {
  console.log(`Server running at http://${host}:${port}`);
});