// backend/server.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const DB_USER = "root";         // e.g. "root" or "tracker_user"
const DB_PASSWORD = "root"; // replace with your password
const DB_NAME = "expense_tracker";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "expense_tracker"
});

db.connect(err => {
  if (err) {
    console.error("❌ DB connection failed:", err);
  } else {
    console.log("✅ MySQL Connected...");
  }
});

// optional root route so visiting http://localhost:5000/ shows a message
app.get("/", (req, res) => res.send("✅ Expense Tracker Backend is running"));

// Add transaction
app.post("/api/transactions", (req, res) => {
  const { amount, type, date } = req.body;
  const sql = "INSERT INTO transactions (amount, type, date) VALUES (?, ?, ?)";
  db.query(sql, [amount, type, date], (err, result) => {
    if (err) {
      console.error("❌ Insert error:", err);
      return res.status(500).json({ error: "Failed to save transaction" });
    }
    res.json({ message: "Transaction added", id: result.insertId });
  });
});

// Fetch all transactions
app.get("/api/transactions", (req, res) => {
  db.query("SELECT * FROM transactions ORDER BY id DESC", (err, results) => {
    if (err) {
      console.error("❌ Fetch error:", err);
      return res.status(500).json({ error: "Failed to fetch transactions" });
    }
    res.json(results);
  });
});

// Delete a transaction
app.delete("/api/transactions/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM transactions WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("❌ Delete error:", err);
      return res.status(500).json({ error: "Failed to delete transaction" });
    }
    res.json({ message: "Transaction deleted" });
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));