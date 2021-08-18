const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    nickname: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    status: {   
        type: String,
        required: true
    },
    avatar: {
        type: String,
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    fcmToken: {
        type: String
    }
})

module.exports = (db) => {
    if (db?.models?.user) {
        return db.models.user;
    } else {
        return mongoose.model("users", UserSchema);
    }
}