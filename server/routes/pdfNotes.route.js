import express from "express";
import isAuth from "../middleware/isAuth.js";
import { pdfDownload } from "../controllers/pdfNotes.controller.js";


const pdfNotesRouter = express.Router();

pdfNotesRouter.post("/generate-notes-pdf", isAuth, pdfDownload);

export default pdfNotesRouter