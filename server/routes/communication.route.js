import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
  evaluateSpeech,
  getHistory,
  getTopics,
} from "../controllers/communication.controller.js";

const communicationRouter = express.Router();

communicationRouter.get("/topics", isAuth, getTopics);
communicationRouter.post("/evaluate", isAuth, evaluateSpeech);
communicationRouter.get("/history", isAuth, getHistory);

export default communicationRouter;
