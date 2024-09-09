import { Router } from "express";
import { getWallet } from "../controller/walletController";

const router = Router();

router.get("/wallet/:userId", getWallet);

export default router;
