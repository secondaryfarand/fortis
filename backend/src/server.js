// dotenv.config();
import 'dotenv/config'; 
import express from 'express';
// import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.config.js';
import mainRouter from './routes/router.js';


connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10kb' })); 

app.use('/api/v1', mainRouter);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    system: 'Fortis API Gateway',
    version: '1.0.0',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Server] Fortis App Backend running on port ${PORT} succesfully`);
});

export default app;