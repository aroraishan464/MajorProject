const User = require("../models/user");
const jwt = require('jsonwebtoken');
var expressJwt = require("express-jwt");
const nodemailer = require("nodemailer");
const AWS = require("aws-sdk");

const { validationResult } = require("express-validator");

exports.signup = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    const { alias, email, password } = req.body;
    User.findOne({ email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: "User with this email already exist"
            });
        }
        const NewUser = new User({ alias, email, password });
        NewUser.save((err, user) => {
            if (err) {
                return res.status(400).json({
                    err
                });
            }
            return res.json({
                success: "user successfully created",
            });
        });

        // res.json({
        //     success: "Email has been sent. Please activate your account"
        // });

        // //sending token
        // const token = jwt.sign({ alias, email, password }, process.env.SECRET, { expiresIn: "20m" });

        // //sending verification email
        // AWS.config.update({
        //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        //     secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY_ID,
        //     region: process.env.AWS_REGION
        // });

        // const ses = new AWS.SES({ apiVersion: "2010-12-01" });
        // const params = {
        //     Destination: {
        //         ToAddresses: [email] // Email address/addresses that you want to send your email
        //     },
        //     Message: {
        //         Body: {
        //             Html: {
        //                 // HTML Format of the email
        //                 Charset: "UTF-8",
        //                 Data:
        //                     `<h3> Welcome ${alias} to TODO</h3>
        //                     <h1> Click on the activation link below to activate your account: </h1>
        //                     <h3><a href="http://localhost:8000/api/activate/${token}">activate</a></h3>`
        //             },
        //             Text: {
        //                 Charset: "UTF-8",
        //                 Data: `Welcome ${alias} to TODO
        //                        Click on the activation link below to activate your account:
        //                        activate`
        //             }
        //         },
        //         Subject: {
        //             Charset: "UTF-8",
        //             Data: "Test email"
        //         }
        //     },
        //     Source: "gypsydanger464@gmail.com"
        // };

        // const sendEmail = ses.sendEmail(params).promise();

        // sendEmail
        //     .then(data => {
        //         console.log("email submitted to SES", data);
        //     })
        //     .catch(error => {
        //         console.log(error);
        //     });
    });
}

// exports.activate = (req, res) => {
//     const token = req.params.token;
//     jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
//         if (err) {
//             return res.status(400).json({
//                 error: "Invalid or expired link"
//             });
//         }
//         const { name, email, password } = decodedToken;
//         const user = new User({ name, email, password });
//         user.save((err, user) => {
//             if (err) {
//                 return res.status(400).json({
//                     err
//                 });
//             }
//             return res.redirect(process.env.FRONTEND_AUTHPAGE);
//         });
//     });
// }

exports.signin = (req, res) => {
    const errors = validationResult(req);
    const { email, password } = req.body;

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "no user is registered with this email"
            });
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password do not match"
            });
        }

        const token = jwt.sign({ _id: user._id }, process.env.SECRET);
        // res.cookie("token", token, { expire: new Date() + 9999 });
        res.cookie("token", token, { maxAge: 31536000 });

        const { _id, alias, email } = user;
        return res.json({ token, user: { _id, alias, email } });
    });
};

exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "User signout successfully"
    });
};

// exports.checkAndSendForgetEmail = (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(422).json({
//             error: errors.array()[0].msg
//         });
//     }

//     const { email } = req.body;
//     User.findOne({ email }).exec((err, user) => {
//         if (err || !user) {
//             return res.status(400).json({
//                 error: "No user is registered with this email"
//             });
//         }

//         res.json({
//             success: "Please check your email"
//         });

//         //sending token
//         const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: "20m" });

//         //sending verification email
//         AWS.config.update({
//             accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//             secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY_ID,
//             region: process.env.AWS_REGION
//         });

//         const ses = new AWS.SES({ apiVersion: "2010-12-01" });
//         const params = {
//             Destination: {
//                 ToAddresses: [email] // Email address/addresses that you want to send your email
//             },
//             Message: {
//                 Body: {
//                     Html: {
//                         // HTML Format of the email
//                         Charset: "UTF-8",
//                         Data:
//                             `<h1> Click on the below link to reset your password: </h1>
//                              <h3><a href="${process.env.FRONTEND_RESETPASS}/${token}">Reset password</a></h3>
//                              <h4> Please ignore if it wasn't for you </h40>`
//                     },
//                     Text: {
//                         Charset: "UTF-8",
//                         Data: `Click on the below link to reset your account:
//                                 Reset password
//                                 Please ignore if it wasn't for you`
//                     }
//                 },
//                 Subject: {
//                     Charset: "UTF-8",
//                     Data: "Test email"
//                 }
//             },
//             Source: "gypsydanger464@gmail.com"
//         };

//         const sendEmail = ses.sendEmail(params).promise();

//         sendEmail
//             .then(data => {
//                 console.log("email submitted to SES", data);
//             })
//             .catch(error => {
//                 console.log(error);
//             });
//     });
// };

// exports.resetPassword = (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(422).json({
//             error: errors.array()[0].msg
//         });
//     }

//     const { password } = req.body;
//     const token = req.params.token;
//     jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
//         if (err) {
//             return res.status(401).json({
//                 error: "Email link is expired. Please send the verification email again."
//             });
//         }
//         const { email } = decodedToken;
//         User.findOne({ email }).exec((err, user) => {
//             if (err || !user) {
//                 return res.status(400).json({
//                     error: "User with this email already exist"
//                 });
//             }
//             user.password = password;
//             user.save((err, user) => {
//                 if (err || !user) {
//                     return res.status(400).json({ error: "could not set email" });
//                 }
//                 res.json({
//                     success: "successfully reset password"
//                 });
//             })
//         });
//     });
// }

exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
});

exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({
            error: "ACCESS DENIED"
        });
    }
    next();
};

