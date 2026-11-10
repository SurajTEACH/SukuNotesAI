import UserModel from "../models/user.model.js";
import Communication from "../models/communication.model.js";
import { askAi } from "../services/openRouter.services.js";

const DEFAULT_TOPICS = [
  {
    id: "pitch-1",
    category: "Elevator Pitch",
    title: "Introduce Yourself Professionally",
    prompt: "Give a 60-second introduction highlighting your background, key technical strengths, and what drives you.",
    tips: "Keep it under 3-4 sentences. Focus on value proposition rather than your full resume.",
  },
  {
    id: "behavioral-1",
    category: "Behavioral & Leadership",
    title: "Handling a Disagreement with a Teammate",
    prompt: "Describe how you would professionally handle a situation where you strongly disagree with a senior colleague's technical decision.",
    tips: "Use the STAR method (Situation, Task, Action, Result). Focus on empathy and data-driven discussion.",
  },
  {
    id: "technical-1",
    category: "Technical Explanation",
    title: "Explain APIs to a 10-Year-Old",
    prompt: "Explain what an Application Programming Interface (API) is to someone who has never touched computer science.",
    tips: "Use vivid real-world analogies like a restaurant waiter or power socket.",
  },
  {
    id: "negotiation-1",
    category: "Business Negotiation",
    title: "Requesting a Project Deadline Extension",
    prompt: "How would you tell a project manager or client that unexpected blockers require extending the delivery timeline by one week?",
    tips: "Take accountability, state the blockers objectively, and offer proactive mitigation options.",
  },
  {
    id: "conflict-1",
    category: "Client & Presentation",
    title: "Pitching an AI Feature to Stakeholders",
    prompt: "Pitch why adopting SukuNotesAI in your university or company will save 20+ hours per student every exam season.",
    tips: "Focus on ROI, student outcomes, and time saved.",
  },
];

export const getTopics = async (req, res) => {
  try {
    return res.status(200).json(DEFAULT_TOPICS);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch topics" });
  }
};

export const evaluateSpeech = async (req, res) => {
  try {
    const { topic, category, userSpeech } = req.body;

    if (!userSpeech || userSpeech.trim().length < 10) {
      return res.status(400).json({
        message: "Speech response is too short. Please speak or write at least one complete sentence.",
      });
    }

    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.credits < 2) {
      return res.status(400).json({
        message: "Not enough credits. Minimum 2 credits required for AI communication evaluation.",
      });
    }

    const messages = [
      {
        role: "system",
        content: `You are an elite executive communications coach and speech evaluator.
Analyze the user's spoken transcript or written response for the given topic and context.

Evaluate on:
1. Grammar & Syntax: Accuracy, tenses, sentence structure.
2. Vocabulary & Range: Professional business diction, conciseness.
3. Fluency & Tone: Confidence, persuasion, clarity.
4. Filler Words: Identify words like "um", "uh", "like", "basically", "actually", "you know".
5. Better Alternative: Rephrase into an articulate, professional, high-impact version.
6. Strengths: 2 specific positive observations.
7. Improvements: 2 actionable tips to level up.

Return strictly valid JSON with this exact schema (no markdown, no backticks, no code fence):
{
  "overallScore": 7.5,
  "grammarScore": 8.0,
  "vocabularyScore": 7.0,
  "fluencyScore": 7.5,
  "fillerWords": [{"word": "like", "count": 2}],
  "betterAlternative": "string",
  "strengths": ["string", "string"],
  "improvements": ["string", "string"],
  "detailedFeedback": "string"
}`,
      },
      {
        role: "user",
        content: `Topic: "${topic || "Professional Communication"}"\nCategory: "${category || "General"}"\nUser's Speech: "${userSpeech.trim()}"`,
      },
    ];

    const aiResponse = await askAi(messages);

    const cleanJson = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.error("Failed to parse communication AI response:", cleanJson);
      parsed = {
        overallScore: 7.0,
        grammarScore: 7.5,
        vocabularyScore: 7.0,
        fluencyScore: 7.0,
        fillerWords: [],
        betterAlternative: userSpeech,
        strengths: ["Clear thought process", "Relevant to topic"],
        improvements: ["Try adding more structured bullet points", "Practice vocal variety"],
        detailedFeedback: "Good response. Continue practicing with active voice and concise phrasing.",
      };
    }

    // Deduct credits
    user.credits -= 2;
    await user.save();

    // Save record to DB
    const record = await Communication.create({
      userId: user._id,
      topic: topic || "General Speaking",
      category: category || "Professional",
      userSpeech: userSpeech.trim(),
      overallScore: Number((parsed.overallScore || 7).toFixed(1)),
      grammarScore: Number((parsed.grammarScore || 7).toFixed(1)),
      vocabularyScore: Number((parsed.vocabularyScore || 7).toFixed(1)),
      fluencyScore: Number((parsed.fluencyScore || 7).toFixed(1)),
      fillerWords: parsed.fillerWords || [],
      betterAlternative: parsed.betterAlternative || "",
      strengths: parsed.strengths || [],
      improvements: parsed.improvements || [],
      detailedFeedback: parsed.detailedFeedback || "",
    });

    return res.status(200).json({
      evaluation: record,
      creditsLeft: user.credits,
    });
  } catch (error) {
    console.error("Communication evaluation error:", error);
    return res.status(500).json({
      message: `Failed to evaluate communication: ${error.message}`,
    });
  }
};

export const getHistory = async (req, res) => {
  try {
    const list = await Communication.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(20);
    return res.status(200).json(list);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch communication history" });
  }
};

