import { Schema, model } from "mongoose";

const walletSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const Wallet = model("Wallet", walletSchema);

export default Wallet;
