const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const { getUserById, getUser, updateUser, getTodoList, changePassword, updateUserList, getUsersList } = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

router.param("userId", getUserById);
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
// router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

router.put(
    "/user/changePassword/:userId",
    [
        check("oldPassword", "old password should be at least 5 characters").isLength({ min: 5 }),
        check("newPassword", "new password should be at least 5 characters").isLength({ min: 5 })
    ], isSignedIn, isAuthenticated, changePassword);

router.put("/user/updatelist/:userId", isSignedIn, isAuthenticated, updateUserList);

router.get("/user/list/:userId", isSignedIn, isAuthenticated, getUsersList)

module.exports = router;