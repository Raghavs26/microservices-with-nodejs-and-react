import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import { RequestValidationError } from "../errors/request-validation-error";
import { DatabaseConnectionError } from "../errors/database-connection-error";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";

const router = express.Router();

interface LoginRequest {
  email: string;
  password: string;
}

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage("Password must be between 6 and 20"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    console.log("Creating a User....");
    const { email, password }: LoginRequest = req.body;
    console.log(email, password);
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new BadRequestError("Email is in use");
    }

    const user = User.buildUser({ email, password });
    await user.save();
    res.status(201).send(user);
  }
);

export { router as signupRouter };
