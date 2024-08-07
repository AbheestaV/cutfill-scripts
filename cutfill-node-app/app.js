// Import necessary modules
const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Endpoint to fetch all CutFillData
app.get('/api/cut-fill-data', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM CutFillData');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching CutFillData:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to fetch all MeasurementData
app.get('/api/measurement-data', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM MeasurementData');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching MeasurementData:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to add a new CutFillData entry
app.post('/api/cut-fill-data', async (req, res) => {
  const { cut_value, fill_value } = req.body;
  if (typeof cut_value !== 'number' || typeof fill_value !== 'number') {
    return res.status(400).json({ error: 'Invalid input data' });
  }
  try {
    const [result] = await pool.query('INSERT INTO CutFillData (cut_value, fill_value) VALUES (?, ?)', [cut_value, fill_value]);
    res.status(201).json({ id: result.insertId, cut_value, fill_value });
  } catch (error) {
    console.error('Error adding CutFillData:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to add a new MeasurementData entry
app.post('/api/measurement-data', async (req, res) => {
  const { measurement_name, measurement_value } = req.body;
  if (typeof measurement_name !== 'string' || typeof measurement_value !== 'number') {
    return res.status(400).json({ error: 'Invalid input data' });
  }
  try {
    const [result] = await pool.query('INSERT INTO MeasurementData (measurement_name, measurement_value) VALUES (?, ?)', [measurement_name, measurement_value]);
    res.status(201).json({ id: result.insertId, measurement_name, measurement_value });
  } catch (error) {
    console.error('Error adding MeasurementData:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
