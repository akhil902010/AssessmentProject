import dotenv from "dotenv";
import connectionDB from "./db/index.js";
import express from "express";
import path from "node:path";
import cookieParser from "cookie-parser";
import cors from "cors";
import cron from 'node-cron';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import uploadRoutes from "./routes/upload.routes.js";
import searchRoutes from "./routes/search.routes.js";
import aggregateRoutes from "./routes/aggregate.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { Message } from './models/message.models.js';
import getCPUUsage from './utils/monitor.js';
import pm2 from 'pm2';


const app = express();
const port = process.env.PORT || 5000;

dotenv.config({
  path: "./env",
});
connectionDB();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));


app.use("/upload", uploadRoutes);
app.use("/search", searchRoutes);
app.use("/aggregate", aggregateRoutes);
app.use("/message", messageRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  setInterval(() => {
    const cpu = getCPUUsage();
    console.log(`CPU Usage: ${(cpu.usage * 100).toFixed(2)}%`);
    if (cpu.usage > 0.7) {
      console.log('CPU usage exceeds 70%. Restarting server...');
      pm2.restart('server', (err) => {
        if (err) console.error(err);
      });
    }
  }, 10000); // Check CPU usage every 5 seconds
});

pm2.connect((err) => {
  if (err) {
    console.error(err);
    process.exit(2);
  }
  pm2.start({
    script: 'src/app.js',
    name: 'server'
  }, (err, apps) => {
    pm2.disconnect();
    if (err) throw err;
  });
});


// Scheduler to check for messages to insert
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const messagesToInsert = await Message.find({
    inserted: false,
    scheduledDate: { $lte: now }

  });

  messagesToInsert.forEach(async (msg) => {
    console.log(`Inserting message: ${msg.message}`);
    msg.inserted = true;
    await msg.save();
  });
});
