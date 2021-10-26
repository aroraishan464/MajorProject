const express = require("express");
const router = express.Router();
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const { addUserInCityList, deleteUserFromCityList } = require("../controllers/city");

router.param("userId", getUserById);
router.post("/city/:userId", isSignedIn, isAuthenticated, addUserInCityList);

module.exports = router;