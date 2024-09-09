import { Schema, model } from "mongoose";

const paymentNotificationSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
    },
    updated_at: {
      type: Date,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
    },
    type_method: {
      type: String,
    },
    state: {
      type: String,
    },
    user_id: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
    },
    debit_credit: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PaymentNotification = model(
  "PaymentNotification",
  paymentNotificationSchema
);

export default PaymentNotification;
