import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { User } from "../models/user";
import { validateRequest } from "../middleware/validate-request";
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
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password }: LoginRequest = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new BadRequestError("Email is in use");
    }

    const user = User.buildUser({ email, password });
    await user.save();

    const userJWT = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!
    );
    //store token in session object
    req.session = {
      jwt: userJWT,
    };
    return res.status(201).send(user);
  }
);

export { router as signupRouter };
