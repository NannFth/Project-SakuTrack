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
const recommendationRoutes = require('./routes/recommendationRoutes');
const { startCronJobs } = require('./services/cronService');

const usersOnline = new Map();

io.on("connection", (socket) => {
  socket.on("join", (userData) => {
    const userId = typeof userData === 'object' ? String(userData.id) : String(userData);
    const userName = userData.name || "Unknown User";
    
    socket.join(userId);

    usersOnline.set(socket.id, { userId, userName, time: new Date().toLocaleTimeString() });

    console.log(`\n[+] ONLINE: ${userName} (ID: ${userId}) - Joined Room: ${userId}`);
    console.log(`Total Online: ${usersOnline.size} user`);
  });

  socket.on("disconnect", () => {
    const user = usersOnline.get(socket.id);
    if (user) {
      console.log(`\n[-] OFFLINE: ${user.userName} (ID: ${user.userId})`);
      usersOnline.delete(socket.id);
      console.log(`Total Online: ${usersOnline.size} user`);
    }
  });
});

process.stdin.on('data', (data) => {
  const input = data.toString().trim();
  if (input === 'list') {
    console.log("\nDaftar User Online Saat Ini:");
    if (usersOnline.size === 0) {
      console.log("Tidak Ada User Yang Terkoneksi");
    } else {
      console.table(Array.from(usersOnline.values()));
    }
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/savings', savingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/recommendations', recommendationRoutes); 

app.get('/', (req, res) => {
  res.status(200).send('API SakuTrack is running...');
});

startCronJobs(io);

const port = process.env.PORT || 3000;
const host = '0.0.0.0';

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});