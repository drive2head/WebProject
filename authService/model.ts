const mongoose = require("mongoose");
const { Schema } = mongoose;

export const userSchema = new Schema({
    username: String,
    password: String,
    name: String,
    surname: String,
});
export const User = mongoose.model("users", userSchema);