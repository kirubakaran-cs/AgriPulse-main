const express = require("express");
const router = express.Router();

const {
  register,
  login,
   updateProfile,
  changePassword,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.put("/profile/:id", updateProfile);
router.put("/password/:id", changePassword);

module.exports = router;