import { Router } from "express";
import { sql } from "../config/db.js";
import {
  getTransactionsByUserId,
  createTransaction,
  deleteTransaction,
  getSummary,
} from "../controllers/transactionsController.js";

const router = Router();

router.get("/:userId", getTransactionsByUserId);

router.post("/", createTransaction);

router.delete("/:id", deleteTransaction);

router.get("/summary/:userId", getSummary);

export default router;
