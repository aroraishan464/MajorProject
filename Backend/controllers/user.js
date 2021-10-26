const _ = require("lodash");
const formidable = require("formidable");
const fs = require("fs");
var AWS = require("aws-sdk");
const uuidv1 = require("uuid/v1");
const { validationResult } = require("express-validator");

const User = require("../models/user");
const City = require("../models/city")

exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "No such user is found"
            });
        }

        req.profile = user;
        next();
    });
};

exports.getUser = (req, res) => {
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    return res.json(req.profile);
}

// exports.updateUser = (req, res) => {
//     let form = new formidable.IncomingForm();
//     form.keepExtensions = true;

//     form.parse(req, (err, fields, file) => {
//         if (err) {
//             return res.status(400).json({
//                 error: "problem with image"
//             });
//         }

//         //updation code
//         let user = req.profile;
//         user = _.extend(user, fields);

//         //profile pic update
//         if (file.profilePic.size != 0 ) {

//             const s3FileURL = process.env.AWS_Uploaded_File_URL_LINK;

//             let s3bucket = new AWS.S3({
//                 accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//                 secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY_ID,
//                 region: process.env.AWS_REGION
//             });

//             //Where you want to store your file
//             let profilePicName = req.profile.profilePicName;
//             if (typeof (profilePicName) === "undefined") {
//                 var filename = uuidv1();
//             }
//             else{
//                 var filename = profilePicName;
//             }
//             var params = {
//                 Bucket: process.env.AWS_BUCKET_NAME,
//                 Key: filename,
//                 Body: fs.readFileSync(file.profilePic.path),
//                 ContentType: file.profilePic.type,
//                 ACL: "public-read"
//             };

//             s3bucket.upload(params, (err, data) => {
//                 if (err) {
//                     res.status(500).json({
//                         error: true, Message: err
//                     });
//                 }
//             });
//             user.profilePicLink = s3FileURL + params.Key;
//             user.profilePicName = params.Key;
//         }

//         //save to the DB
//         user.save((err, user) => {
//             if (err || !user) {
//                 return res.status(400).json({
//                     error: "Updation of user failed"
//                 });
//             }
//             return res.json({
//                 success: "user updated successfully changes will applied on the next login"
//             });
//         });
//     });
// }

exports.changePassword = (req, res) => {
    const errors = validationResult(req);
    const { oldPassword, newPassword } = req.body;

    const { email } = req.profile;

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

        if (!user.authenticate(oldPassword)) {
            return res.status(401).json({
                error: "incorrect old password"
            });
        }

        user.password = newPassword;
        user.save((err, user) => {
            if (err || !user) {
                return res.status(400).json({ error: "could not set email" });
            }
            return res.json({
                success: "password successfully changed"
            });
        })
    });
}

exports.getUsersList = (req, res) => {
    User.find({ '_id': { $in: req.profile.userList } }).exec((err, users) => {
        return res.json(users);
    });
}

exports.updateUserList = (req, res) => {
    const { longitude, latitude, city } = req.body;
    const user = req.profile;
    user.coords = [latitude, longitude];
    user.save((err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: "could not update users list" });
        }
        City.findOne({ name: city }, (err, city) => {
            if (err || !city) {
                return res.json({
                    err: "there is no such city in DB"
                })
            }
            const listlength = city.users.length;
            for (let i = 0; i < listlength; i++) {
                for (let j = i + 1; j < listlength; j++) {
                    User.findById(city.users[i]).exec((err, user1) => {
                        if (err || !user1) {
                            return res.status(400).json({
                                error: "No such user1 is found"
                            });
                        }
                        User.findById(city.users[j]).exec((err, user2) => {
                            if (err || !user2) {
                                return res.status(400).json({
                                    error: "No such user is found"
                                });
                            }
                            const dist = getDistanceFromLatLonInKm(user1.coords[0], user1.coords[1], user2.coords[0], user2.coords[1]);
                            if(dist<=1){
                                if(!user1.userList.includes(city.users[j])){
                                    user1.userList.push(user2);
                                    user1.save();
                                    if(!user2.userList.includes(city.users[i])){
                                        user2.userList.push(user1);
                                        user2.save();
                                    }
                                }
                            }
                            else {
                                if(user1.userList.includes(city.users[j])){
                                    removeb(user1.userList, city.users[j])
                                    user1.save();
                                    if(user2.userList.includes(city.users[i])){
                                        removeb(user2.userList, city.users[i])
                                        user2.save();
                                    }
                                }
                            }
                        });
                    });
                }
            }
            return res.json({
                success: "user lists successfully updated"
            });
        })
    })
}

exports.removeUserFromAllList = (req, res, next) => {
    const user = req.profile;
    const {city} = req.body;
    user.userList.forEach((id, index) => {
        User.findById(id, (err, listuser) => {
            if(err || !listuser){
                return res.status(500).json({
                    error: "there is no such user"
                });
            }
            listuser.userList.includes(user._id) && removeb(listuser.userList, user._id);
            listuser.save();
        })
    });
    City.findOne({name: city}, (err, city) => {
        if(err || !city){
            return res.status(500).json({
                error: "no such list in the city"
            }); 
        }
        city.users.includes(user._id) && removeb(city.users, user._id);
        city.save();
    });
    user.userList = [];
    user.save();
    next();
}

function removeb(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

