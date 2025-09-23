import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import ratelimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();

//middleware
app.use(ratelimiter);
app.use(express.json());

initDB();

app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);
  });
});
