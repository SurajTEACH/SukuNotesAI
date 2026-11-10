import mongoose from "mongoose";

const communicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "Professional Speaking",
    },
    userSpeech: {
      type: String,
      required: true,
    },
    overallScore: {
      type: Number,
      default: 0,
    },
    grammarScore: {
      type: Number,
      default: 0,
    },
    vocabularyScore: {
      type: Number,
      default: 0,
    },
    fluencyScore: {
      type: Number,
      default: 0,
    },
    fillerWords: [
      {
        word: String,
        count: Number,
      },
    ],
    betterAlternative: {
      type: String,
      default: "",
    },
    verdict: {
      type: String,
      default: "",
    },
    mistakes: [
      {
        original: String,
        correction: String,
        reason: String,
      },
    ],
    strengths: [String],
    improvements: [String],
    detailedFeedback: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Communication = mongoose.model("Communication", communicationSchema);
export default Communication;

