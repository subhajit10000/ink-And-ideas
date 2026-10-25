import { body, param } from "express-validator";

const updateProfileValidator = [
  body("firstName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("First name is required.")
    .bail()
    .isLength({ min: 2, max: 30 })
    .withMessage("First name must be between 2 and 30 characters"),

  body("lastName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Last name is required.")
    .bail()
    .isLength({ min: 2, max: 30 })
    .withMessage("Last name must be between 2 and 30 characters"),
  body("phone")
    .optional({ values: "falsy" })
    .isMobilePhone("any")
    .withMessage("Invalid phone number"),
];

const changePasswordValidator = [
  body("currentPassword").notEmpty().withMessage("Current password is required."),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required.")
    .isStrongPassword({
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minSymbols: 1,
      minNumbers: 1,
    })
    .withMessage("New password is not strong enough.")
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error(
          "New password must be different from current password.",
        );
      }
      return true;
    }),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required.")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Confirm password does not match new password.");
      }
      return true;
    })
];

// Admin
const userIdParamValidator = [
  param("id").isMongoId().withMessage("Invalid user id."),
];

const updateRoleValidator = [
  ...userIdParamValidator,
  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required.")
    .bail()
    .isIn(["user", "admin"])
    .withMessage("Role must be either 'user' or 'admin'."),
];

const updateStatusValidator = [
  ...userIdParamValidator,
  body("isBlocked")
    .notEmpty()
    .withMessage("isBlocked is required.")
    .bail()
    .isBoolean()
    .withMessage("isBlocked must be true or false.")
    .toBoolean(),
];

export {
  updateProfileValidator,
  changePasswordValidator,
  userIdParamValidator,
  updateRoleValidator,
  updateStatusValidator,
};