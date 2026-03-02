import { Router, Request, Response } from "express";
import { identifyContact } from "../services/contactService";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      return res.status(400).json({
        message: "Either email or phoneNumber must be provided"
      });
    }

    const result = await identifyContact(email, phoneNumber);
    return res.status(200).json(result);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;