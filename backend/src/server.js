import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import ratelimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import job from "./config/cron.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();

//middleware
app.use(ratelimiter);
app.use(express.json());

if (process.env.NODE_ENV === "production") job.start();

app.get("/api/health", (req,res)=>{
  res.status(200).json({message:"status is ok"})
})
initDB();
app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);
  });
});
