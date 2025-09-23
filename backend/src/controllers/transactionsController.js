async function getTransactionsByUserId() {
  try {
    const { userId } = req.params;

    const transactions = await sql`
        SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
    res.status(200).json(transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
}
async function createTransaction() {
  //title, amount , cat , user_Id
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !user_id || !category || amount === undefined) {
      return res
        .status(400)
        .json({ message: "all fields are required to make an entry" });
    }

    const transaction = await sql`
        INSERT INTO transactions(user_id,title,amount,category)
        VALUES(${user_id},${title},${amount},${category})
        RETURNING *
        `;
    res.status(201).json(transaction[0]);
    console.log("entry created successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
}
async function deleteTransaction() {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "invalid id" });
    }
    const result = await sql`
                DELETE FROM transactions WHERE id=${id} RETURNING *
            `;
    if (result.length === 0) {
      return res.status(404).json({ message: "transaction not found" });
    }

    res.status(200).json({ message: "transaction deleted successfully" });
  } catch (error) {
    console.log(error);
  }
}
async function getSummary() {
  try {
    const { userId } = req.params;
    const balanceResult = await sql`
            SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${userId}
        `;

    const incomeResult = await sql`
            SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id = ${userId} AND amount>0
        `;

    const expensesResult = await sql`
            SELECT COALESCE(SUM(amount),0) as expenses FROM transactions WHERE user_id = ${userId} AND amount<0
        `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.log(error);
  }
}

export {
  getTransactionsByUserId,
  createTransaction,
  deleteTransaction,
  getSummary,
};
