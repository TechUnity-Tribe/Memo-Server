const mongoose = require("mongoose");

const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('User', userSchema)