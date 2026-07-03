const db = require("../config/db");

// Get all buyers
exports.getBuyers = (req, res) => {
    db.query("SELECT * FROM buyers", (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
};

// Add buyer
exports.createBuyer = (req, res) => {
    const { name, company, phone, email, address } = req.body;

    const sql = `
        INSERT INTO buyers (name, company, phone, email, address)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, company, phone, email, address],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Buyer created successfully",
                id: result.insertId,
            });
        }
    );
};

// Update buyer
exports.updateBuyer = (req, res) => {
    const { id } = req.params;
    const { name, company, phone, email, address } = req.body;

    const sql = `
        UPDATE buyers
        SET name=?, company=?, phone=?, email=?, address=?
        WHERE id=?
    `;

    db.query(
        sql,
        [name, company, phone, email, address, id],
        (err) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Buyer updated successfully",
            });
        }
    );
};

// Delete buyer
// Delete buyer
exports.deleteBuyer = (req, res) => {
    const id = req.params.id;

    db.query(
        "DELETE FROM buyers WHERE id = ?",
        [id],
        (err) => {
            if (err) {
    console.error("Delete Error:", err);
    return res.status(500).json({
        message: err.message,
        code: err.code
    });
}

            res.json({
                success: true,
                message: "Buyer deleted successfully"
            });

        }
    );
};


exports.getBuyerById = (req, res) => {
    db.query(
        "SELECT * FROM buyers WHERE id=?",
        [req.params.id],
        (err, result) => {
            if (err)
                return res.status(500).json({ message: err.message });

            res.json(result[0]);
        }
    );
};