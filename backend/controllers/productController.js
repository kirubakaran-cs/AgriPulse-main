const db = require("../config/db");

// GET ALL PRODUCTS
exports.getProducts = (req, res) => {
  const sql = `
    SELECT
      p.id,
      p.product_name AS name,
      c.name AS category,
      p.category_id,
      p.price,
      p.stock,
      p.unit,
      p.image,
      p.description,
      p.created_at
    FROM products p
    LEFT JOIN categories c
      ON p.category_id = c.id
    ORDER BY p.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Database error",
      });
    }

    res.json(results);
  });
};

// GET SINGLE PRODUCT
exports.getProductById = (req, res) => {
  const sql = `
    SELECT
      p.id,
      p.product_name AS name,
      c.name AS category,
      p.category_id,
      p.price,
      p.stock,
      p.unit,
      p.image,
      p.description,
      p.created_at
    FROM products p
    LEFT JOIN categories c
      ON p.category_id = c.id
    WHERE p.id = ?
  `;

  db.query(sql, [req.params.id], (err, results) => {
    if (err)
      return res.status(500).json({
        message: "Database error",
      });

    if (results.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(results[0]);
  });
};

// ADD PRODUCT
exports.createProduct = (req, res) => {
  const {
    product_name,
    category_id,
    price,
    stock,
    unit,
    image,
    description,
  } = req.body;

  const sql = `
    INSERT INTO products
    (product_name, category_id, price, stock, unit, image, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      product_name,
      category_id,
      price,
      stock,
      unit,
      image,
      description,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Insert failed",
        });
      }

      res.json({
        message: "Product created",
        id: result.insertId,
      });
    }
  );
};

// UPDATE PRODUCT
exports.updateProduct = (req, res) => {
  const {
    product_name,
    category_id,
    price,
    stock,
    unit,
    image,
    description,
  } = req.body;

  const sql = `
    UPDATE products
    SET
      product_name=?,
      category_id=?,
      price=?,
      stock=?,
      unit=?,
      image=?,
      description=?
    WHERE id=?
  `;

  db.query(
    sql,
    [
      product_name,
      category_id,
      price,
      stock,
      unit,
      image,
      description,
      req.params.id,
    ],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Update failed",
        });
      }

      res.json({
        message: "Product updated",
      });
    }
  );
};

// DELETE PRODUCT
exports.deleteProduct = (req, res) => {
  db.query(
    "DELETE FROM products WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Delete failed",
        });
      }

      res.json({
        message: "Product deleted",
      });
    }
  );
};