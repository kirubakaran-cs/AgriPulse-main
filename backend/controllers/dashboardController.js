const db = require("../config/db");

exports.getDashboard = (req, res) => {
  const dashboard = {};

  // Total Farmers
  db.query("SELECT COUNT(*) AS total FROM farmers", (err, farmers) => {
    if (err) return res.status(500).json({ message: err.message });

    dashboard.totalFarmers = farmers[0].total;

    // Total Buyers
    db.query("SELECT COUNT(*) AS total FROM buyers", (err, buyers) => {
      if (err) return res.status(500).json({ message: err.message });

      dashboard.totalBuyers = buyers[0].total;

      // Total Products
      db.query("SELECT COUNT(*) AS total FROM products", (err, products) => {
        if (err) return res.status(500).json({ message: err.message });

        dashboard.totalProducts = products[0].total;

        // Total Transactions
        db.query(
          "SELECT COUNT(*) AS total FROM transactions",
          (err, transactions) => {
            if (err) return res.status(500).json({ message: err.message });

            dashboard.totalTransactions = transactions[0].total;

            // Revenue
            db.query(
              "SELECT IFNULL(SUM(total_amount),0) AS revenue FROM transactions",
              (err, revenue) => {
                if (err)
                  return res.status(500).json({ message: err.message });

                dashboard.totalRevenue = revenue[0].revenue;

                // Recent Transactions
                db.query(
                  "SELECT * FROM transactions ORDER BY id DESC LIMIT 5",
                  (err, recent) => {
                    if (err)
                      return res.status(500).json({ message: err.message });

                    dashboard.recentTransactions = recent;

                    // Monthly Revenue
db.query(
  `SELECT
      DATE_FORMAT(date,'%b') AS month,
      SUM(total_amount) AS revenue
   FROM transactions
   GROUP BY MONTH(date)
   ORDER BY MONTH(date)`,
  (err, monthlyRevenue) => {

    if (err)
      return res.status(500).json({ message: err.message });

    dashboard.monthlyRevenue = monthlyRevenue;

    // Transaction Types
    db.query(
      `SELECT
          type,
          COUNT(*) AS count
       FROM transactions
       GROUP BY type`,
      (err, transactionTypes) => {

        if (err)
          return res.status(500).json({ message: err.message });

        dashboard.transactionTypes = transactionTypes;

        res.json(dashboard);

      }
    );

  }
);
                  }
                );
              }
            );
          }
        );
      });
    });
  });
};