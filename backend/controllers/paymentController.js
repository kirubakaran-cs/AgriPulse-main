const db = require("../config/db");

// GET ALL TRANSACTIONS
exports.getTransactions = (req, res) => {

    const sql = `
    SELECT
        t.*,
        p.name AS product_name,
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

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });

};
// Get all payments
exports.getPayments = (req, res) => {
    const sql = `
SELECT
    payments.*,
    transactions.id AS transaction_no,
    products.product_name AS product_name
FROM payments
LEFT JOIN transactions
    ON payments.transaction_id = transactions.id
LEFT JOIN products
    ON transactions.product_id = products.id
ORDER BY payments.id DESC
`;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);

    });

};


exports.getPaymentById = (req, res) => {
    db.query(
        "SELECT * FROM payments WHERE id=?",
        [req.params.id],
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            if (result.length === 0) {
                return res.status(404).json({
                    message: "Payment not found"
                });
            }

            res.json(result[0]);
        }
    );
};

// Add payment
exports.createPayment = (req, res) => {
   const {
    transaction_id,
    amount,
    method,
    status,
    date,
    note
} = req.body;

    const sql = `
        INSERT INTO payments
(
transaction_id,
amount,
method,
status,
date,
note
)
VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [transaction_id,amount, method, status, date, note],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Payment created successfully",
                id: result.insertId
            });
        }
    );
};

// Update payment
exports.updatePayment = (req, res) => {
    const { status } = req.body;

    db.query(
        "UPDATE payments SET status=? WHERE id=?",
        [status, req.params.id],
        (err) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Payment updated successfully"
            });
        }
    );
};

// Delete payment
exports.deletePayment = (req, res) => {
    db.query(
        "DELETE FROM payments WHERE id=?",
        [req.params.id],
        (err) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Payment deleted successfully"
            });
        }
    );
};