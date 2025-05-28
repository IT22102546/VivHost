import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Create a connection pool instead of a single connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || "node241.r-usdatacenter.register.lk",
  port: process.env.DB_PORT || "3306",
  user: process.env.DB_USER || "faite",
  password: process.env.DB_PASSWORD || "J!7FowuO$mHf",
  database: process.env.DB_NAME || "faiteplu_viwazdvo_viwahaa",
  waitForConnections: true,
  connectionLimit: 10, // Adjust based on your needs
  queueLimit: 0,
  enableKeepAlive: true, // Important for long-running applications
  keepAliveInitialDelay: 10000, // 10 seconds
});

// Test the connection on startup
pool
  .getConnection()
  .then((connection) => {
    console.log("Successfully connected to MySQL database");
    connection.release(); // Release the connection back to the pool
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1); // Exit if initial connection fails
  });

// Handle connection errors
pool.on("error", (err) => {
  console.error("Database pool error:", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.log("Attempting to reconnect...");
  } else {
    throw err;
  }
});

// Graceful shutdown handler
process.on("SIGINT", () => {
  pool
    .end()
    .then(() => {
      console.log("Database pool closed");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error closing database pool:", err);
      process.exit(1);
    });
});

export default pool;
