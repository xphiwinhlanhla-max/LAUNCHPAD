import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Shared lazy-loaded Gemini AI client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. Direct Mentor Q&A Endpoint (powered by Gemini 3.5 Flash)
app.post("/api/mentor-qa", async (req, res) => {
  const { message, tier = "none", history = [] } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message content is required" });
  }

  const ai = getGeminiClient();

  if (!ai) {
    // Elegant fallback guidance when GEMINI_API_KEY is not defined
    const mockRefAnswers: Record<string, string> = {
      default: `### 👋 Hello! I'm Alex Rivers, your AI Mentor.

Double-check your setup: It looks like the \`GEMINI_API_KEY\` is not fully configured in your **Secrets panel** yet, or you are running in offline mode. 

To give you an idea of how I can mentor you, here is what we can focus on:
1. **SaaS Architectural Choices**: Node.js vs. Serverless, Database selection (Firestore, Spanner, PostgreSQL).
2. **AI Strategy**: Inserting LLMs into search pipelines or recommendation loops.
3. **Funding & Scale**: Preparing your tech pitch deck for seed funding.

*Once the Gemini Secret is configured in Google AI Studio, my live responses will activate instantly!*`
    };
    return res.json({
      text: mockRefAnswers.default,
      grounding: null,
      isDemo: true
    });
  }

  try {
    const tierBonus = tier === 'masterclass' 
      ? "This member is subscribed to the Elite Masterclass ($299/mo) and gets priority highly-detailed, technical, customized architectural deep dives. Answer all their code questions with deep snippets."
      : tier === 'scale'
      ? "This member is a Scale Founder ($99/mo) and gets strategic tech stack evaluations. Offer clear pros/cons."
      : "This member is on the Basic Dev Member level. Keep it friendly, clear, and high-level.";

    const systemInstruction = `You are Alex Rivers, an elite SaaS engineering mentor, ex-Google Principal AI Architect, and a 3x tech startup founder.
Hold a authentic, insightful tech-mentoring dialogue. Your language should be clear, inspiring, professional, and full of dense practical knowledge (less marketing fluff, more engineering wisdom).
When answering backend questions, suggest specific robust tech solutions (such as Firestore, Cloud SQL, Next.js, and @google/genai).

Context on the current user:
- Membership Tier: ${tier}
- Special Perks: ${tierBonus}

Always speak as Alex Rivers. Use clear markdown formatting, code snippets where relevant, and structured key bullet points. Keep responses relatively concise but complete (2-4 paragraphs).`;

    // Construct contents in Gemini chat format
    const contents = history.map((chat: any) => ({
      role: chat.role === "user" ? "user" : "model",
      parts: [{ text: chat.content }]
    }));
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      text: response.text || "I processed your request, but wasn't sure how to reply. Let's try again with a different technical topic!",
      isDemo: false
    });
  } catch (error: any) {
    console.error("Gemini Q&A Error:", error);
    res.status(500).json({ error: "Failed to generate mentor feedback", details: error.message });
  }
});

// 2. Lead Magnet Customizer Endpoint
app.post("/api/generate-lead-magnet", async (req, res) => {
  const { concept, name } = req.body;

  if (!concept || concept.trim() === "") {
    return res.status(400).json({ error: "Startup concept is required" });
  }

  const ai = getGeminiClient();

  if (!ai) {
    // Beautiful default fallback content if API key is not entered yet
    const fallbackTemplate = `# 🚀 Custom AI Tech Architecture Blueprint
### Tailored for: ${name || "A High-Value SaaS Pitch"}

Thank you for requesting this blueprint. Below is a realistic high-level architecture overview based on your concept: **"${concept}"**.

---

### 1. Recommended Core Tech Stack
- **Frontend/Backend SPA**: React + Vite + Typescript running on Cloud Run.
- **Data Stratum**: Google Firestore for real-time document storage (highly scalable).
- **AI Processing**: Server-side @google/genai SDK proxy interfacing with \`gemini-3.5-flash\` for core workloads.

### 2. Immediate MVP Build Phase
1. **Interactive Sandbox**: Build a simple React workspace centering the absolute core user interaction loop (the core utility).
2. **Local Workflows**: Keep user details, states, and preferences stored locally inside \`localStorage\` or React Context first before deploying full servers.
3. **Subscriptions**: Add a Stripe Checkout portal testing user willingness to pay standard Tiers ($29, $99).

> 💡 *Note: To unlock live customized blueprint generations, configure your GEMINI_API_KEY inside the Secrets panel of Google AI Studio!*`;

    return res.json({ blueprint: fallbackTemplate, isDemo: true });
  }

  try {
    const prompt = `Generate a customized Startup Tech Blueprint based on this prompt.
User Startup Idea/Concept: "${concept}"
Target User's Name: "${name || 'Startup Builder'}"

Format the response in gorgeous, professional markdown representing a mentor's customized review. Include these 4 clear sections:
1. Niche & Value Proposition Assessment (How to stand out in this category)
2. Scalable Tech Stack Draft (Recommend specific DBs, frameworks, caching)
3. Step-by-Step MVP Implementation Guide (3-5 granular steps to launch in 14 days)
4. AI/Automation Integrations (Where Gemini or automation adds 10x value)

Keep it action-oriented, professional, and dense with realistic technical advice. Add specific visual dividers so it's clean and pleasant to read.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are Alex Rivers, Ex-Google Principal AI Architect and creator of the SaaS Launch Framework. Provide absolute high-level, practical blueprint advice without generic copy-paste text.",
        temperature: 0.8,
      }
    });

    res.json({
      blueprint: response.text || "Your blueprint is preparing, please try submitting again in a moment!",
      isDemo: false
    });
  } catch (error: any) {
    console.error("Gemini Blueprint Error:", error);
    res.status(500).json({ error: "Failed to generate custom blueprint", details: error.message });
  }
});

// Configure Vite middleware in development, serve compiled assets in production
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Platform Services] Active and listening on host 0.0.0.0 port ${PORT}`);
  });
}

bootstrap();
