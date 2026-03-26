require('dotenv').config();
require('./config/firebase');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000", "http://13.229.64.163"];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});
app.set('socketio', io);

const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const savingRoutes = require('./routes/savingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const { startCronJobs } = require('./services/cronService');

io.on('connection', (socket) => {
  console.log('Seseorang terkoneksi ke sistem real-time:', socket.id);

  socket.on('join', (userId) => {
    if (userId) {
      socket.join(String(userId));
      console.log(`User dengan ID ${userId} berhasil bergabung ke room: ${userId}`);
    }
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
const host = '0.0.0.0';

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});