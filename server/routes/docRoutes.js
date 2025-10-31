import express from "express";
import { upload } from "../middleware/multer.js";

// Controllers
import { uploadFile, getAllNotes } from "../controllers/docController.js";

// Middlewares
import userAuth from "./../middleware/userAuth.js";

// Router
const docRouter = express.Router();

docRouter.post("/upload", userAuth, upload.single("file"), uploadFile);
docRouter.get("/all-notes", getAllNotes);

export default docRouter;
