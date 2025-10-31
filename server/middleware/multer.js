import multer from "multer";
import path from "path";

// Store files temporarily before uploading to Cloudinary
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File type validation (PDF and DOC/DOCX)
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".pdf" || ext === ".doc" || ext === ".docx") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and DOC/DOCX files are allowed!"), false);
  }
};

export const upload = multer({ storage, fileFilter });
