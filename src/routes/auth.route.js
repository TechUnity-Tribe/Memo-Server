const express = require("express");
const { authenticateUser } = require("../middlewares/auth.middleware");
const { registerUser, userLogin, userProfile } = require("../controllers/auth.controller");


const router = express.Router()

router.post("/signup", registerUser);
router.post("/login", userLogin);
router.get("/profile/:id", authenticateUser, userProfile)

module.exports = router