const City = require('../models/city');

exports.addUserInCityList = (req, res) => {
    const { name } = req.body;
    const { id } = req.profile;
    City.findOne({ name }, (err, city) => {
        if (err || !city) {
            const newCity = new City({
                name: name,
                users: [id]
            });
            newCity.save((err, city) => {
                if (err) {
                    return res.status(400).json({
                        err
                    });
                }
                return res.json({
                    msg: "city successfully created",
                    city: city
                });
            });
        }

        else if (!city.users.includes(req.profile._id)) {
            city.users.push(req.profile);

            City.findByIdAndUpdate(
                { _id: city._id },
                { "users": city.users },
                { new: true, useFindAndModify: false },
                (err, city) => {
                    if (err) {
                        return res.status(400).json({
                            error: "You are not authorized to update the list"
                        });
                    }
                    return res.json({
                        success: "The city list is updated",
                        city: city
                    });
                }
            )
        }

        else {
            return res.json({
                error: "There already exist this user in the city list"
            })
        }
    });
};
