import express from "express";
import dotenv from "dotenv";
import identifyRouter from "./routes/identify";
import pool from "./config/db";
import cors from "cors";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json());

app.use("/identify", identifyRouter);

app.get("/", (_req, res) => {
  res.send("Bitespeed Identity Reconciliation API Running");
});

pool.getConnection()
  .then(conn => {
    console.log("DB Connected Successfully");
    conn.release();
  })
  .catch(err => {
    console.error("DB Connection Failed:", err);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

