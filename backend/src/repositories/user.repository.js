
import User from "../models/User.js";

const createUser = async (userData) => {
    return await User.create(userData);
}

const findUserByEmail = async (email) => {
    return await User.findOne({ email }).select("+password");
}

// Login uses findUserByEmail (needs +password). OTP flows need the OTP
// fields too, which are select:false by default.
const findUserByEmailWithOTP = async (email) => {
    return await User.findOne({ email }).select("+otp +otpExpiry +otpPurpose");
}

const findUserById = async (id) => {
    return await User.findById(id);
}

const findAllUsers = async () => {
  return await User.find({})
    .select("-password")
    .sort({ createdAt: -1 });
};

// changePasswordService needs the current hashed password to compare against.
const findUserByIdWithPassword = async (id) => {
    return await User.findById(id).select("+password");
}

const updateUser = async (id, data) => {
    await User.updateOne({ _id: id }, { $set: data }, { runValidators: true });
    return await User.findById(id);
};

const deleteUser = async (id) => {
    return await User.deleteOne({ _id: id });
}

export {
    createUser,
    findUserByEmail,
    findUserByEmailWithOTP,
    findUserById,
    findUserByIdWithPassword,
    updateUser,
    deleteUser,
    findAllUsers
}

