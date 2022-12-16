import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: "String",
        required: true
    },

    email: {
        type: "String",
        required: true,
        unique: true
    },

    password: {
        type: "String",
        required: true,
        select: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    users: [
        {
            full_name: "String",
            email :"String",
            nick_name: "String",
            birth_date: Date,
            gender :"String",
            createdAt: Date
        }
    ],
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    });
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model("User", userSchema);