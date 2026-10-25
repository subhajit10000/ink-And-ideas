import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator"


import { generateAccessToken, generateRefreshToken } from "../config/jwt.js";

const userSchema = new mongoose.Schema(
    {
        username: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
        firstName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 30
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 30
        },
        bio: { type: String, trim: true, maxlength: 300, default: "" },
        profilePhoto: { type: String, default: "" },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            validate: [validator.isEmail, "Invalid Email"],
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false
        },
        phone: {
            type: String,
            default: null
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        isBlocked: {
            type: Boolean,
            default: false
        },


        otp: {
            type: String,
            select: false,
            default: null
        },
        otpExpiry: {
            type: Date,
            select: false,
            default: null
        },
        otpPurpose: {
            type: String,
            enum: ["verifyEmail", "resetPassword", null],
            select: false,
            default: null
        },

        lastLogin: Date,
    },
    {
        timestamps: true
    }
);


userSchema.pre("save", async function () {
    if (!this.username && this.firstName) {
        const base = this.firstName.toLowerCase().replace(/[^a-z0-9]/g, "") || "writer";
        this.username = `${base}${Math.random().toString(36).slice(2, 8)}`;
    }
    if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return generateAccessToken({
        id: this._id,
        email: this.email,
        role: this.role,
    })
};

userSchema.methods.generateRefreshToken = function () {
    return generateRefreshToken({
        id: this._id
    });
};


const User = mongoose.model("User", userSchema);

export default User;


