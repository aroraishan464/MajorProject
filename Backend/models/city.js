const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    users: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        unique: false
    }
}, { timestamps: true });

module.exports = mongoose.model("City", citySchema);