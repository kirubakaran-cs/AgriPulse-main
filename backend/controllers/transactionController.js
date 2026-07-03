const db = require("../config/db");

// ===============================
// GET ALL TRANSACTIONS
// ===============================
exports.getTransactions = (req, res) => {

  const sql = `
    SELECT
      t.*,
      DATE(t.date) AS date,
      p.product_name,
      f.name AS farmer_name,
      b.name AS buyer_name
    FROM transactions t
    LEFT JOIN products p
      ON t.product_id = p.id
    LEFT JOIN farmers f
      ON t.farmer_id = f.id
    LEFT JOIN buyers b
      ON t.buyer_id = b.id
    ORDER BY t.id DESC
  `;

  db.query(sql, (err, results) => {
   if (err) {
    console.error(err);

    return res.status(500).json({
        error: err.sqlMessage,
        code: err.code
    });
}

    res.json(results);
  });
};

// ===============================
// GET SINGLE TRANSACTION
// ===============================
exports.getTransaction = (req, res) => {

  const sql = `
    SELECT
      t.*,
      p.product_name,
      f.full_name AS farmer_name,
      b.full_name AS buyer_name
    FROM transactions t
    LEFT JOIN products p
      ON t.product_id = p.id
    LEFT JOIN farmers f
      ON t.farmer_id = f.id
    LEFT JOIN buyers b
      ON t.buyer_id = b.id
    WHERE t.id = ?
  `;

  db.query(sql, [req.params.id], (err, results) => {

    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Database error",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.json(results[0]);

  });

};

// ===============================
// CREATE TRANSACTION
// ===============================
exports.createTransaction = (req, res) => {

  const {
    product_id,
    farmer_id,
    buyer_id,
    type,
    quantity,
    total_amount,
    status,
    date,
  } = req.body;

  const sql = `
    INSERT INTO transactions
    (
      product_id,
      farmer_id,
      buyer_id,
      type,
      quantity,
      total_amount,
      status,
      date
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      product_id,
      farmer_id,
      buyer_id,
      type,
      quantity,
      total_amount,
      status,
      date,
    ],
    (err, result) => {

      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Failed to create transaction",
        });
      }

      res.json({
        message: "Transaction created successfully",
        id: result.insertId,
      });

    }
  );

};

// ===============================
// UPDATE TRANSACTION
// ===============================
exports.updateTransaction = (req, res) => {

  const {
    product_id,
    farmer_id,
    buyer_id,
    type,
    quantity,
    total_amount,
    status,
    date,
  } = req.body;

  const sql = `
    UPDATE transactions
    SET
      product_id = ?,
      farmer_id = ?,
      buyer_id = ?,
      type = ?,
      quantity = ?,
      total_amount = ?,
      status = ?,
      date = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      product_id,
      farmer_id,
      buyer_id,
      type,
      quantity,
      total_amount,
      status,
      date,
      req.params.id,
    ],
    (err) => {

      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Failed to update transaction",
        });
      }

      res.json({
        message: "Transaction updated successfully",
      });

    }
  );

};

// ===============================
// DELETE TRANSACTION
// ===============================
exports.deleteTransaction = (req, res) => {

  db.query(
    "DELETE FROM transactions WHERE id = ?",
    [req.params.id],
    (err) => {

      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Failed to delete transaction",
        });
      }

      res.json({
        message: "Transaction deleted successfully",
      });

    }
  );

};

// ===============================
// GET TRANSACTIONS BY FARMER
// ===============================
exports.getTransactionsByFarmer = (req, res) => {

  const sql = `
    SELECT
      t.*,
      p.product_name
    FROM transactions t
    LEFT JOIN products p
      ON t.product_id = p.id
    WHERE t.farmer_id = ?
    ORDER BY t.id DESC
  `;

  db.query(sql, [req.params.id], (err, results) => {

    if (err) {
      console.error(err);
      return res.status(500).json({
        message: err.message,
      });
    }

    res.json(results);

  });

};