import { Request, Response } from "express";
import Wallet from "../models/Wallet";

export const getWallet = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!userId || userId === "") {
    return res.status(400).json({ message: "Required parameter is empty" });
  }

  try {
    const wallet = await Wallet.findOne({ user_id: userId });
    return res.status(200).json({ wallet });
  } catch (error: any) {
    console.error("Failed to retrieve wallet", error);
    return res.status(500).json({ error: error.message });
  }
};
