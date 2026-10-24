import { asyncHandler } from '../utils/asyncHandler.js';
import sendResponse from "../helpers/response.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadImage } from "../services/imageUpload.service.js";
import { issueTokenPair } from "../services/token.service.js";
import { setAuthCookies } from "../helpers/cookies.js";
import {
    getProfileService,
    updateProfileService,
    deleteProfileService,
    changePasswordService,
    getUserByIdService,
    getAllUsersService,
    updateUserRoleService,
    updateUserStatusService,
    adminDeleteUserService,
} from "../services/user.service.js";

const getProfile = asyncHandler(async (req, res) => {
    const user = await getProfileService(req.user._id);
    return sendResponse(res, 200, "Profile fetched successfully", user);
});


const updateProfile = asyncHandler(async (req, res) => {
    const updatedUser = await updateProfileService(req.user._id, req.body);
    return sendResponse(res, 200, "Profile updated successfully", updatedUser);
});

const updateProfilePhoto = asyncHandler(async (req, res) => {
    if (!req.file) return sendResponse(res, 400, "Choose an image to upload.");
    const uploaded = await uploadImage(req.file.buffer, "ink-ideas/profiles");
    const updatedUser = await updateProfileService(req.user._id, { profilePhoto: uploaded.url });
    return sendResponse(res, 200, "Profile photo updated successfully", updatedUser);
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsersService();

  return res.status(200).json(
    new ApiResponse(
      200,
      "Users fetched successfully",
      users
    )
  );
});

const deleteProfile = asyncHandler(async (req, res) => {
    await deleteProfileService(req.user._id);
    return sendResponse(res, 200, "Profile deleted successfully");
});


const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await changePasswordService(req.user._id, currentPassword, newPassword);
    // All sessions were revoked; keep the current device signed in with a fresh pair.
    const tokens = await issueTokenPair(req.user, req);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    return sendResponse(res, 200, "Password changed successfully", { accessToken: tokens.accessToken });
})


//  Admin 

const getUserById = asyncHandler(async (req, res) => {
    const user = await getUserByIdService(req.params.id);
    return sendResponse(res, 200, "User fetched successfully", user);
});

const updateUserRole = asyncHandler(async (req, res) => {
    const user = await updateUserRoleService(req.params.id, req.body.role, req.user._id);
    return sendResponse(res, 200, "User role updated successfully", user);
});

const updateUserStatus = asyncHandler(async (req, res) => {
    const user = await updateUserStatusService(req.params.id, req.body.isBlocked, req.user._id);
    return sendResponse(res, 200, "User status updated successfully", user);
});

const adminDeleteUser = asyncHandler(async (req, res) => {
    await adminDeleteUserService(req.params.id, req.user._id);
    return sendResponse(res, 200, "User deleted successfully");
});

export {
    getProfile,
    updateProfile,
    deleteProfile,
    changePassword,
    getUserById,
    updateUserRole,
    updateUserStatus,
    adminDeleteUser,
    getAllUsers,
    updateProfilePhoto
};
