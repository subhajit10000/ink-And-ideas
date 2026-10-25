import {
  findUserById,
  findUserByIdWithPassword,
  updateUser,
  deleteUser,
  findAllUsers
} from "../repositories/user.repository.js";

import encryptionService from "./encryption.service.js";
import ApiError from "../utils/ApiError.js";
import { revokeAllRefreshTokens } from "./token.service.js";
import Post from "../models/Post.js";
import { deleteImage } from "./imageUpload.service.js";

const removeUserPosts = async (userId) => {
  const posts = await Post.find({ author: userId }).select("imagePublicId");
  await Promise.all(posts.map((p) => deleteImage(p.imagePublicId)));
  await Post.deleteMany({ author: userId });
};

const safeDecrypt = (value) => {
  try { return value ? encryptionService.decrypt(value) : value; } catch { return ""; }
};

//Get User Profile
const getProfileService = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const profile = user.toObject();
  if (profile.phone) {
    profile.phone = safeDecrypt(profile.phone);
  }
  return profile;
};


const getAllUsersService = async () => {
  const users = await findAllUsers();
  return users.map((u) => {
    const obj = u.toObject();
    if (obj.phone) obj.phone = safeDecrypt(obj.phone);
    return obj;
  });
};


//Update User Profile
const updateProfileService = async (userId, payload) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const allowed = {};
  for (const key of ["firstName", "lastName", "bio", "profilePhoto"]) if (payload[key] !== undefined) allowed[key] = payload[key];
  if (payload.username !== undefined) {
    const username = String(payload.username).trim().toLowerCase();
    if (!/^[a-z0-9_]{3,30}$/.test(username)) throw new ApiError(400, "Username must be 3–30 characters and contain only letters, numbers or underscores.");
    const existing = await (await import("../models/User.js")).default.findOne({ username, _id: { $ne: userId } });
    if (existing) throw new ApiError(409, "That username is already taken.");
    allowed.username = username;
  }
  if (payload.phone) allowed.phone = encryptionService.encrypt(payload.phone);
  const updatedUser = await updateUser(userId, allowed);
  const response = updatedUser.toObject();
  if (response.phone) {
    response.phone = safeDecrypt(response.phone);
  }
  return response;
};


//Delete User profile
const deleteProfileService = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  await removeUserPosts(userId);
  await deleteUser(userId);
  await revokeAllRefreshTokens(userId);
  return null;
};

//change password
const changePasswordService = async (userId, currentPassword, newPassword) => {
  const user = await findUserByIdWithPassword(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(400, "Current password is incorrect");
  }
  user.password = newPassword;
  await user.save();

  // Force re-login on all other sessions after a password change.
  await revokeAllRefreshTokens(userId);
  return true;
};



// Admin

const getUserByIdService = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const profile = user.toObject();
  if (profile.phone) {
    profile.phone = safeDecrypt(profile.phone);
  }
  return profile;
};

const updateUserRoleService = async (userId, role, actingAdminId) => {
  if (String(userId) === String(actingAdminId)) {
    throw new ApiError(400, "You cannot change your own role.");
  }
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const updated = await updateUser(userId, { role });
  return updated.toObject();
};

const updateUserStatusService = async (userId, isBlocked, actingAdminId) => {
  if (String(userId) === String(actingAdminId)) {
    throw new ApiError(400, "You cannot block your own account.");
  }
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const updated = await updateUser(userId, { isBlocked });

  // Blocking a user should kill their existing sessions immediately, otherwise a live access token keeps working until it expires.
  if (isBlocked) {
    await revokeAllRefreshTokens(userId);
  }

  return updated.toObject();
};

const adminDeleteUserService = async (userId, actingAdminId) => {
  if (String(userId) === String(actingAdminId)) {
    throw new ApiError(400, "You cannot delete your own admin account from here.");
  }
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  await removeUserPosts(userId);
  await deleteUser(userId);
  await revokeAllRefreshTokens(userId);
  return null;
};

export {
  getProfileService,
  updateProfileService,
  deleteProfileService,
  changePasswordService,
  getUserByIdService,
  updateUserRoleService,
  updateUserStatusService,
  adminDeleteUserService,
  getAllUsersService
};
