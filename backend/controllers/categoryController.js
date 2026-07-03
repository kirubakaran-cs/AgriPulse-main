const db = require("../config/db");

// Get all categories
exports.getCategories = (req, res) => {
  db.query(
    "SELECT * FROM categories ORDER BY name",
    (err, result) => {
      if (err)
        return res.status(500).json({ message: err.message });

      res.json(result);
    }
  );
};

// Add category
exports.createCategory = (req, res) => {
  const { name, description } = req.body;

  db.query(
    "INSERT INTO categories(name,description) VALUES(?,?)",
    [name, description],
    (err, result) => {
      if (err)
        return res.status(500).json({ message: err.message });

      res.json({
        message: "Category created",
        id: result.insertId,
      });
    }
  );
};

// Delete category
exports.deleteCategory = (req, res) => {
  db.query(
    "DELETE FROM categories WHERE id=?",
    [req.params.id],
    (err) => {
      if (err)
        return res.status(500).json({ message: err.message });

      res.json({
        message: "Category deleted",
      });
    }
  );
};