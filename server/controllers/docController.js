import User from "../models/userModel.js";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";

import { Document } from "../models/docModel.js";

// Upload file
// POST /api/auth/upload
// Private
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Extract file name (without extension)
    const fileName = req.file.originalname
      ? req.file.originalname.split(".")[0]
      : `document_${Date.now()}`;

    // Upload to Cloudinary with a custom public_id (file name)
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw", // needed for non-image files like pdf/docx
      folder: "documents",
      public_id: fileName, // 👈 this sets the name in Cloudinary
      overwrite: true, // optional, replaces existing file with same name
      use_filename: true, // keeps original filename visible
      unique_filename: false, // avoid Cloudinary adding random chars
    });

    // Remove local temp file
    fs.unlinkSync(req.file.path);

    // Save to MongoDB
    const newDoc = await Document.create({
      title: req.body.title?.trim() || fileName,
      topic: req.body.topic || "General",
      category: req.body.category || "Uncategorized",
      fileUrl: result.secure_url,
      uploadedBy: req.user.userId,
      uploadDate: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      document: newDoc,
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get all file
// POST /api/auth/all-notes
// Public
const getAllNotes = async (req, res) => {
  try {
    // Populate uploader info
    const notes = await Document.find()
      .populate("uploadedBy", "name email") // only fetch name & email
      .sort({ createdAt: -1 });

    // Format response for cleaner frontend data
    const formattedNotes = notes.map((note) => ({
      _id: note._id,
      title: note.title,
      topic: note.topic,
      category: note.category,
      fileUrl: note.fileUrl,
      createdAt: note.createdAt,
      uploadedByName: note.uploadedBy?.name || "Unknown",
      uploadedByEmail: note.uploadedBy?.email || "N/A",
    }));
    res.status(200).json({
      success: true,
      count: formattedNotes.length,
      notes: formattedNotes,
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
    });
  }
};

export default getAllNotes;

export { uploadFile, getAllNotes };
