import { Request, Response } from "express";
import { DEBIT_CREDIT } from "../config/constants";
import PaymentNotification from "../models/PaymentNotification";
import Wallet from "../models/Wallet";

type Transaction = {
  id: string;
  created_at: string;
  updated_at: string;
  description: string;
  type: string;
  type_method: string;
  state: string;
  user_id: string;
  user_name: string;
  amount: string;
  currency: string;
  debit_credit: string;
};

type PaymentPayload = {
  transactions: Transaction[];
};

export const postPayment = async (req: Request, res: Response) => {
  const { transactions } = req.body as PaymentPayload;

  if (!transactions || !Array.isArray(transactions)) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const successfulTransactions: string[] = [];
  const failedTransactions: { id: string; errors: string }[] = [];

  for (const transaction of transactions) {
    try {
      const amountInCents = parseFloat(transaction?.amount) * 100;

      const paymentNotification = new PaymentNotification({
        ...transaction,
        amount: amountInCents,
      });
      await paymentNotification.validate();
      const savedPaymentNotif = await paymentNotification.save();

      let walletData = await Wallet.findOne({
        user_id: savedPaymentNotif.user_id,
      });

      if (!walletData) {
        const wallet = new Wallet({
          user_id: savedPaymentNotif.user_id,
          user_name: savedPaymentNotif.user_name,
        });
        walletData = await wallet.save();
      }

      let currentBalance = walletData.balance;

      if (savedPaymentNotif.debit_credit === DEBIT_CREDIT.Credit) {
        currentBalance = currentBalance + savedPaymentNotif.amount;
      } else if (savedPaymentNotif.debit_credit === DEBIT_CREDIT.Debit) {
        currentBalance = currentBalance - savedPaymentNotif.amount;
      }

      const updatedWallet = await Wallet.findOneAndUpdate(
        { user_id: savedPaymentNotif.user_id },
        { balance: currentBalance },
        { new: true }
      );

      console.log(
        "Transaction processing success for transaction" + transaction.id
      );

      updatedWallet && successfulTransactions.push(savedPaymentNotif.id);
    } catch (error: any) {
      console.error(
        "Transaction processing failed for transaction" + transaction.id,
        error
      );
      failedTransactions.push({
        id: transaction.id,
        errors: error.message,
      });
    }
  }

  return res.status(200).json({ successfulTransactions, failedTransactions });
};

export const getPayments = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: "Required parameter is empty" });
  }

  try {
    const payments = await PaymentNotification.find({ user_id: userId });
    return res.status(200).json({ payments });
  } catch (error: any) {
    console.error("Failed to retrieve payments", error);
    return res.status(500).json({ error: error.message });
  }
};
