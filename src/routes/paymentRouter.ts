import { Router } from "express";
import { getPayments, postPayment } from "../controller/paymentController";

const router = Router();

router.post("/payment", postPayment);
router.get("/payment/:userId", getPayments);

export default router;
