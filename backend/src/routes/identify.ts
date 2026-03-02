import { Router} from "express";
import { identifyContact } from "../services/contactService";
import { validateIdentifyInput } from "../middleware/validateInput";

const router = Router();

router.post("/", validateIdentifyInput, async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;

    const result = await identifyContact(email, phoneNumber);
    return res.status(200).json(result);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;