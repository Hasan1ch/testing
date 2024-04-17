/* Import dependencies */
const express = require("express");
const mysql = require("mysql2");

/* Create express instance */
const app = express();
const port = 3000;

/* Setup database connection */
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST || "localhost",
  user: "user",
  password: "password",
  database: "world",
});

/* Landing route */
app.get("/", (req, res) => {
  res.send("Hello world!");
});

// Sample API route
app.get("/ping", (req, res) => {
  res.send("pong");
});

// Returns an array of cities from the database
app.get("/cities", async (req, res) => {
  const [rows, fields] = await db.execute("SELECT * FROM `city`");
  return res.send(rows);
});
// Run server!
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
