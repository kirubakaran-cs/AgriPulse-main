const express = require("express");
const router = express.Router();

const farmerController = require("../controllers/farmerController");

router.get("/", farmerController.getFarmers);
router.get("/:id", farmerController.getFarmerById);
router.post("/", farmerController.addFarmer);
router.put("/:id", farmerController.updateFarmer);
router.delete("/:id", farmerController.deleteFarmer);

module.exports = router;