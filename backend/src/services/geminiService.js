import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateInterviewQuestions = async ({
  targetRole,
  experienceLevel,
  topics = [],
  count = 10,
}) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
  });

  const prompt = `
You are an interview question generator.

Generate ${count} technical interview questions.

Context:
Target Role: ${targetRole}
Experience Level: ${experienceLevel}
Topics: ${topics.join(", ") || "General"}

Rules:
- Return ONLY a JSON array of strings
- No explanations
- No numbering
- No markdown
- No extra text

Example output:
[
  "Question one?",
  "Question two?"
]
`;

  const result = await model.generateContent(prompt);
  const rawText = result.response.text();

  // 🔥 CLEAN GEMINI OUTPUT
  const cleanedText = rawText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    const parsed = JSON.parse(cleanedText);

    // Extra safety: ensure array of strings
    if (!Array.isArray(parsed)) {
      throw new Error("Gemini did not return an array");
    }

    return parsed;
  } catch (err) {
    console.error("Failed to parse Gemini questions:", cleanedText);

    // ✅ SAFE FALLBACK (never crash interview)
    return Array.from({ length: count }, (_, i) =>
      `Explain a key concept related to ${targetRole} (Question ${i + 1}).`
    );
  }
};
