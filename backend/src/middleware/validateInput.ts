import { Request, Response, NextFunction } from "express";

export const validateIdentifyInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({
      message: "Either email or phoneNumber must be provided"
    });
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        message: "Invalid email format"
      });
    }
  }

  if (phoneNumber) {
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      return res.status(400).json({
        message: "Invalid phone number format"
      });
    }
  }

  next();
};