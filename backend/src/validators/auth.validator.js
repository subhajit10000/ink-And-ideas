import { body } from "express-validator";


const registerValidator = [

    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("First name is required.")
        .bail()
        .isLength({ min: 2, max: 30 })
        .withMessage("First name must be between 2 and 30 characters"),

    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("Last name is required.")
        .bail()
        .isLength({ min: 2, max: 30 })
        .withMessage("Last name must be between 2 and 30 characters"),


    body("email")
        .trim()
        .toLowerCase()
        .isEmail()
        .withMessage("please provide a valid email address."),

    body("password")
        .isStrongPassword({
            minLength: 8,
            minUppercase: 1,
            minLowercase: 1,
            minSymbols: 1,
            minNumbers: 1
        })
        .withMessage("Password must be Strong."),

    body("phone")
        .optional({ values: "falsy" })
        .isMobilePhone("any")
        .withMessage("Invalid phone number")
]

const loginValidator = [
    body("email")
        .trim()
        .toLowerCase()
        .isEmail()
        .withMessage("please provide a valid email address."),

    body("password")
        .notEmpty()
        .withMessage("Password is reqired."),
]

export { registerValidator, loginValidator };