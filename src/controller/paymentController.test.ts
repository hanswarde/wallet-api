import { Request, Response } from "express";
import { DEBIT_CREDIT } from "../config/constants";
import PaymentNotification from "../models/PaymentNotification";
import Wallet from "../models/Wallet";
import { getPayments, postPayment } from "./paymentController";

jest.mock("../models/PaymentNotification");
jest.mock("../models/Wallet");

const transactionData = [
  {
    id: "1",
    amount: "10.00",
    user_id: "123",
    user_name: "John Doe",
    debit_credit: DEBIT_CREDIT.Credit,
  },
  {
    id: "2",
    amount: "5.00",
    user_id: "456",
    user_name: "Jane Doe",
    debit_credit: DEBIT_CREDIT.Debit,
  },
];

describe("postPayment", () => {
  it("should return 400 for invalid payload", async () => {
    const req = { body: {} } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await postPayment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid payload" });
  });

  it("should process valid transactions and return successful and failed ones", async () => {
    const req = {
      body: {
        transactions: transactionData,
      },
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    (PaymentNotification.prototype.validate as jest.Mock).mockResolvedValue(
      undefined
    );
    (PaymentNotification.prototype.save as jest.Mock)
      .mockResolvedValueOnce(transactionData[0])
      .mockResolvedValueOnce(transactionData[1]);

    (Wallet.findOne as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: "2", user_id: "456", balance: -500 });

    (Wallet.prototype.save as jest.Mock).mockResolvedValueOnce({
      id: "1",
      user_id: "123",
      balance: 1000,
    });

    (Wallet.findOneAndUpdate as jest.Mock).mockResolvedValueOnce({
      balance: 110,
    });

    await postPayment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      successfulTransactions: ["1"],
      failedTransactions: [],
    });
  });

  it("should handle validation errors during processing", async () => {
    const req = {
      body: {
        transactions: transactionData,
      },
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    (PaymentNotification.prototype.validate as jest.Mock).mockRejectedValue(
      new Error("Validation error")
    );

    await postPayment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      successfulTransactions: [],
      failedTransactions: [
        { id: "1", errors: "Validation error" },
        { id: "2", errors: "Validation error" },
      ],
    });
  });
});

describe("getPayments", () => {
  it("should return 400 for missing userId", async () => {
    const req = { params: { userId: "" } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await getPayments(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Required parameter is empty",
    });
  });

  it("should return retrieved payments for a valid userId", async () => {
    const req = { params: { userId: "123" } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    (PaymentNotification.find as jest.Mock).mockResolvedValueOnce([
      { id: "1" },
    ]);

    await getPayments(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ payments: [{ id: "1" }] });
  });

  it("should return 500 for database errors", async () => {
    const req = { params: { userId: "123" } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    (PaymentNotification.find as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    await getPayments(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
  });
});
