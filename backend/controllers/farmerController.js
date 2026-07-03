const db = require("../config/db");

// Get all farmers
exports.getFarmers = (req, res) => {
    db.query("SELECT * FROM farmers", (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }

        res.json(result);
    });
};

// Get farmer by id
exports.getFarmerById = (req, res) => {
    db.query(
        "SELECT * FROM farmers WHERE id = ?",
        [req.params.id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            res.json(result[0]);
        }
    );
};

// Add farmer
exports.addFarmer = (req, res) => {
    const { name, phone, email, location, farm_size } = req.body;

    db.query(
        "INSERT INTO farmers(name, phone, email, location, farm_size) VALUES (?, ?, ?, ?, ?)",
        [name, phone, email, location, farm_size],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            res.status(201).json({
                message: "Farmer added successfully",
                id: result.insertId
            });
        }
    );
};
    

// Update farmer
exports.updateFarmer = (req, res) => {
    const { name, phone, email, location, farm_size } = req.body;

    db.query(
        `UPDATE farmers
         SET name=?, phone=?, email=?, location=?, farm_size=?
         WHERE id=?`,
        [name, phone, email, location, farm_size, req.params.id],
        (err) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            res.json({ message: "Farmer updated successfully" });
        }
    );
};

// Delete farmer
// Delete farmer
exports.deleteFarmer = (req, res) => {
    const id = req.params.id;

    db.query(
        "DELETE FROM farmers WHERE id = ?",
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
                message: "Farmer deleted successfully"
            });
        }
    );
};