const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transactionController");

router.get("/", transactionController.getTransactions);

router.get("/:id", transactionController.getTransaction);

router.get("/farmer/:id", transactionController.getTransactionsByFarmer);

router.post("/", transactionController.createTransaction);

router.put("/:id", transactionController.updateTransaction);

router.delete("/:id", transactionController.deleteTransaction);


module.exports = router;