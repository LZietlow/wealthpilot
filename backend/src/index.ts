import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/db';
import authRoute from './routes/authRoute'
import accountRoute from './routes/accountRoutes'
import transactionRoute from './routes/transactionRoutes'

dotenv.config();

const app = express();

// Middleware: läuft bei JEDEM Request, bevor er die Route erreicht
app.use(cors());
app.use(express.json()); // erlaubt es, JSON-Request-Bodies zu lesen (req.body)

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
})


app.use('/auth', authRoute);
app.use('/accounts', accountRoute);
app.use('/transactions', transactionRoute)

// Erste Test-Route: zeigt, dass der Server läuft
app.get('/health', async (req, res) => {
  try {
    await pool.query('Select 1');
    res.json({status: 'ok', message: 'wealthpilot api läuft', db: 'verbunden'});
  } catch (err) {
    console.error('DB-Fehler:', err);
    res.status(500).json({status: 'error', message: "DB nicht erreichbar"});
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});