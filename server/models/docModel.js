import mongoose from "mongoose";
import User from "./userModel.js";

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["MongoDB", "PostgreSQL"],
      default: "Notes",
    },
    fileUrl: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dateOfUpload: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Document = mongoose.model("Document", documentSchema);
