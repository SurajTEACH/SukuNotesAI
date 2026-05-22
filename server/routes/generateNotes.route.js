

import express from "express";
import isAuth from "../middleware/isAuth.js";
import { generateNotes } from "../controllers/generateNotes.controllers.js";
import { getMyNotes, getSingleNotes } from "../controllers/notesHistroy.controller.js";

const  notesRouter = express.Router();

notesRouter.post("/generate-notes", isAuth, generateNotes )
notesRouter.get("/get-notes", isAuth, getMyNotes);
notesRouter.get("/:id", isAuth, getSingleNotes);

export default notesRouter