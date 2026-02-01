import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * =====================================
 * FULL INTERVIEW EVALUATION (ONLY)
 * =====================================
 */
export const evaluateInterview = async ({
  targetRole,
  experienceLevel,
  qaPairs, // [{ question, answer }]
}) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
  });

  const formattedQA = qaPairs
    .map(
      (qa, index) => `
Question ${index + 1}:
${qa.question}

Answer:
${qa.answer}
`
    )
    .join("\n");

  const prompt = `
You are a senior technical interviewer evaluating a full interview.

Context:
Target Role: ${targetRole}
Experience Level: ${experienceLevel}

Interview Transcript:
${formattedQA}

Evaluate the candidate OVERALL on a scale of 0–10 for:
- correctness
- completeness
- clarity
- communication

Also compute:
- overallScore (0–100)

Provide:
- short summary
- strengths
- areas for improvement

Output JSON only:
{
  "correctness": number,
  "completeness": number,
  "clarity": number,
  "communication": number,
  "overallScore": number,
  "summary": "string",
  "strengths": "string",
  "improvements": "string"
}
`;

  const result = await model.generateContent(prompt);
  return safeParse(result.response.text());
};

/**
 * =====================================
 * SAFE PARSER
 * =====================================
 */
const safeParse = (rawText) => {
  const cleanedText = rawText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleanedText);
  } catch (err) {
    console.error("Failed to parse Gemini response:", cleanedText);

    return {
      correctness: 5,
      completeness: 5,
      clarity: 5,
      communication: 5,
      overallScore: 50,
      summary: "Evaluation could not be parsed correctly.",
      strengths: "N/A",
      improvements: "Please try to answer more clearly and concisely.",
    };
  }
};
