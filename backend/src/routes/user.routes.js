import express from "express";

import {
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
} from "../controllers/user.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

import {
  updateProfileValidator,
  changePasswordValidator,
  userIdParamValidator,
  updateRoleValidator,
  updateStatusValidator,
} from "../validators/user.validator.js";

import validator from "../middlewares/validation.middleware.js";


const router = express.Router();
router.use(authMiddleware);



router.get("/profile", getProfile);
router.put("/profile", updateProfileValidator, validator, updateProfile);
router.post("/profile/photo", upload.single("image"), updateProfilePhoto);
router.put("/password", changePasswordValidator, validator, changePassword);
router.delete("/profile", deleteProfile);



//admin section
router.get("/all", authMiddleware, roleMiddleware("admin"), getAllUsers );
router.get("/:id", authorize("admin"), userIdParamValidator, validator, getUserById);
router.patch("/:id/role", authorize("admin"), updateRoleValidator, validator, updateUserRole);
router.patch("/:id/status", authorize("admin"), updateStatusValidator, validator, updateUserStatus);
router.delete("/:id", authorize("admin"), userIdParamValidator, validator, adminDeleteUser);

export default router;
