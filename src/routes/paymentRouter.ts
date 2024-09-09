import { Router } from "express";
import { getPayments, postPayment } from "../controller/paymentController";
// import { hmacAuthMiddleware } from "../middleware/hmac";

const router = Router();

// router.post("/payment", hmacAuthMiddleware, postPayment);
router.post("/payment", postPayment);
router.get("/payment/:userId", getPayments);

export default router;
