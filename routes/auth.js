const express = require("express");
const router = express.Router();
const { register, login, updateUser } = require("../controllers/auth");
const auth = require("../middleware/authentication");
const testUserAuth = require("../middleware/testUserAuth");

router.post("/register", register);
router.post("/login", login);
router.patch("/updateuser", auth, testUserAuth, updateUser);
module.exports = router;
