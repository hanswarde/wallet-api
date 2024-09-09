import { Request, Response } from "express";
import Wallet from "../models/Wallet";
import { getWallet } from "./walletController";
jest.mock("../models/Wallet");

describe("getWallet", () => {
  it("should return a 200 status code and wallet data if userId is valid", async () => {
    const req = { params: { userId: "12345" } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    (Wallet.findOne as jest.Mock).mockResolvedValue({
      user_id: "12345",
      user_name: "test name",
      balance: 100,
    });
    await getWallet(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      wallet: {
        user_id: "12345",
        user_name: "test name",
        balance: 100,
      },
    });
  });

  it("should return null if userId is empty", async () => {
    const req = { params: { userId: "" } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await getWallet(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Required parameter is empty",
    });
  });

  it("should return a 500 status code if an error occurs", async () => {
    const req = { params: { userId: "12345" } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    (Wallet.findOne as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    await getWallet(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
  });
});
