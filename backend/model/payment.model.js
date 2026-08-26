// backend/models/payment.model.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transactionId: {
      type: String, // ID de session Stripe (cs_...) ou ID de transaction FedaPay
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "XOF",
    },
    provider: {
      type: String,
      enum: ["stripe", "fedapay"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "declined", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
