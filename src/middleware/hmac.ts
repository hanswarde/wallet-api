import crypto from "crypto";
import { NextFunction, Request, Response } from "express";

const HMAC_KEY = process.env.HMAC_KEY ?? "";

if (HMAC_KEY === "") {
  console.error("Error on auth: HMAC_KEY is empty");
  process.exit(1);
}

export const verifyHmacSignature = (payload: string, signature: string) => {
  const expectedSignature = crypto
    .createHmac("sha256", HMAC_KEY)
    .update(payload)
    .digest("hex");

  return expectedSignature === signature;
};

export const hmacAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers["authorization"] as string;
  const [scheme, signature] = authorizationHeader
    ? authorizationHeader.split(" ")
    : [];

  if (scheme !== "HMAC_SHA256" || !signature) {
    return res.status(401).json({
      message: "Unauthorized: Missing or invalid Authorization header",
    });
  }

  const payload = JSON.stringify(req.body);

  if (!verifyHmacSignature(payload, signature)) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid HMAC signature" });
  }

  next();
};
