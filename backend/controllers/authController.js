const db = require("../config/db");
const bcrypt = require("bcryptjs");

// ================= REGISTER =================
exports.register = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Check if email already exists
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        if (results.length > 0) {
          return res.status(400).json({
            message: "Email already exists",
          });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        db.query(
          "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)",
          [fullName, email, hashedPassword],
          (err, result) => {
            if (err) {
              return res.status(500).json({
                message: err.message,
              });
            }

            res.status(201).json({
              success: true,
              message: "Account created successfully",
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= LOGIN =================
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      const user = results[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
        },
      });
    }
  );
};

// ================= UPDATE PROFILE =================

exports.updateProfile = (req, res) => {

    const { fullName } = req.body;

    db.query(
        "UPDATE users SET full_name=? WHERE id=?",
        [fullName, req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json({
                    message: err.message,
                });
            }

            res.json({
                success: true,
                message: "Profile updated",
            });

        }
    );

};

// ================= CHANGE PASSWORD =================

exports.changePassword = async (req, res) => {

    const { newPassword } = req.body;

    try {

        const hash = await bcrypt.hash(newPassword,10);

        db.query(
            "UPDATE users SET password=? WHERE id=?",
            [hash, req.params.id],
            (err)=>{

                if(err){
                    return res.status(500).json({
                        message:err.message,
                    });
                }

                res.json({
                    success:true,
                    message:"Password updated",
                });

            }
        );

    } catch(err){

        res.status(500).json({
            message:err.message,
        });

    }

};