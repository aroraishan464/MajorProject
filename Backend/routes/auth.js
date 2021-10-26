const express = require("express");
const router = express.Router();

const { check } = require("express-validator");
const { signup, signin, signout } = require("../controllers/auth");
const { removeUserFromAllList, getUserById } = require("../controllers/user");


router.param("userId", getUserById);

//signup and activation routes
router.post(
    "/signup",
    [
        check("alias", "alias should be at least 3 characters").isLength({ min: 3 }),
        check("email", "email is required").isEmail(),
        check("password", "password should be at least 5 characters").isLength({ min: 5 })
    ], signup);

// router.get("/activate/:token", activate);

//signin and signout routes
router.post(
    "/signin",
    [
        check("email", "email is required").isEmail(),
        check("password", "password should be at least 5 characters").isLength({ min: 5 })
    ], signin);

router.post("/signout/:userId", removeUserFromAllList, signout);

//sending forget password email and reset password
// router.post(
//     "/checkAndSendForgetEmail",
//     [
//         check("email", "email is required").isEmail(),
//     ], checkAndSendForgetEmail);

// router.put(
//     "/resetPassword/:token",
//     [
//         check("password", "password should be at least 5 characters").isLength({ min: 5 })
//     ], resetPassword);

module.exports = router;