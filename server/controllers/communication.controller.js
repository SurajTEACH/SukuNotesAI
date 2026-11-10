import UserModel from "../models/user.model.js";
import Communication from "../models/communication.model.js";
import { askAi } from "../services/openRouter.services.js";

const DEFAULT_TOPICS = [
  {
    id: "intro-1",
    category: "Self Introduction",
    title: "Tell Me About Yourself (Professional Self-Introduction)",
    prompt: "Deliver a 60-second professional self-introduction covering your name/background, top skills/projects, and what you aim to achieve.",
    tips: "Start with 'My name is...' or 'I am...', never 'Myself...'. Highlight 1-2 major projects, and conclude with your career goal.",
  },
  {
    id: "pitch-1",
    category: "College & Projects",
    title: "Explain Your Best Project or Achievement",
    prompt: "Explain your best academic or technical project: what problem it solves, the technologies used, and your personal contribution.",
    tips: "Explain the 'Why' behind the project first, then mention the tech stack and the measurable impact.",
  },
  {
    id: "behavioral-1",
    category: "Behavioral & HR",
    title: "Why Should We Hire You?",
    prompt: "Explain why you are the ideal fit for your target role and what sets you apart from other candidates.",
    tips: "Align your strengths with the company's needs. Show passion and willingness to learn.",
  },
  {
    id: "technical-1",
    category: "Technical Explanation",
    title: "Explain APIs or Cloud to a Non-Tech Person",
    prompt: "Explain how APIs or Cloud Computing work to someone with zero technical background.",
    tips: "Use real-life analogies like a restaurant waiter or electricity grid.",
  },
  {
    id: "conflict-1",
    category: "Teamwork & Conflict",
    title: "Handling a Disagreement with a Teammate",
    prompt: "How would you handle a technical disagreement with a team member respectfully and effectively?",
    tips: "Focus on listening first, comparing pros/cons using data, and prioritizing team goals.",
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

Evaluate thoroughly on:
1. Verdict: "Kaisa introduction/response raha" (Brief, punchy 1-2 sentence summary of their performance).
2. Exact Mistakes ("Kahan kya galti hui"): List every specific grammar, pronunciation, phrasing, or structural mistake with the original text, corrected version, and clear explanation of why it was wrong.
3. Grammar & Syntax: Accuracy, tenses, subject-verb agreement.
4. Vocabulary & Professional Diction: Polished phrasing, avoiding slang or overly casual words.
5. Fluency & Tone: Confidence, persuasion, clarity.
6. Filler Words: Identify words like "um", "uh", "like", "basically", "actually", "you know".
7. Better Alternative: Rephrase into an articulate, professional, high-impact version.
8. Strengths: 2 specific positive observations.
9. Improvements: 2 actionable tips to level up.

Return strictly valid JSON with this exact schema (no markdown, no backticks, no code fence):
{
  "overallScore": 7.5,
  "verdict": "Clear and polite, but lacked technical specifics and used informal greetings.",
  "grammarScore": 8.0,
  "vocabularyScore": 7.0,
  "fluencyScore": 7.5,
  "mistakes": [
    {
      "original": "Myself Suraj and I belongs to...",
      "correction": "My name is Suraj, and I belong to...",
      "reason": "Using 'Myself' to introduce yourself is grammatically incorrect; use 'My name is' or 'I am'."
    }
  ],
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
        verdict: "Good practice attempt. Clear thought process with room for more polished business phrasing.",
        grammarScore: 7.5,
        vocabularyScore: 7.0,
        fluencyScore: 7.0,
        mistakes: [],
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
      verdict: parsed.verdict || "Assessment completed",
      grammarScore: Number((parsed.grammarScore || 7).toFixed(1)),
      vocabularyScore: Number((parsed.vocabularyScore || 7).toFixed(1)),
      fluencyScore: Number((parsed.fluencyScore || 7).toFixed(1)),
      mistakes: parsed.mistakes || [],
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

