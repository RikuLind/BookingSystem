// src/validators/resource.validators.js
import { body } from "express-validator";

// Validation rules for POST /api/resources
export const resourceValidators = [
  body("action")
    .exists({ checkFalsy: true })
    .withMessage("is required")
    .trim()
    .isIn(["create"])
    .withMessage("must be 'create'"),

  body("resourceName")
    .exists({ checkFalsy: true })
    .withMessage("is required")
    .isString()
    .withMessage("must be a string")
    .trim()
    .matches(/^[A-Za-z0-9 ]+$/)
    .withMessage("can only contain letters, numbers, and spaces")
    .isLength({ min: 5, max: 30 })
    .withMessage("must be 5-30 characters"),

  body("resourceDescription")
    .exists({ checkFalsy: true })
    .withMessage("is required")
    .isString()
    .withMessage("must be a string")
    .trim()
    .matches(/^[A-Za-z0-9 ]+$/)
    .withMessage("can only contain letters, numbers, and spaces")
    .isLength({ min: 10, max: 50 })
    .withMessage("must be 10-50 characters"),

  body("resourceAvailable")
    .exists()
    .withMessage("is required")
    .isBoolean()
    .withMessage("must be boolean"),

  body("resourcePrice")
    .exists()
    .withMessage("is required")
    .isFloat({ min: 0 })
    .withMessage("must be a non-negative number"),

  body("resourcePriceUnit")
    .exists({ checkFalsy: true })
    .withMessage("is required")
    .isString()
  .withMessage("must be a string")
    .trim()
    .isIn(["hour", "day", "week", "month"])
    .withMessage("must be 'hour', 'day', 'week', or 'month'"),
];