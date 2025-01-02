import OpenAI from "openai";
import { isCandidateMatch, type ParsedSkills } from "~/types/types";

const SYSTEM_PROMPT = `You are a skills analysis assistant that MUST ONLY respond with JSON. Do not include any markdown, explanations, or other text.

Analyze the skills listed in a job vacancy and compare them with the skills of a job candidate to assess suitability.

Your response must be a single JSON object with exactly these fields:
{
  "matched_skills": string[],
  "missing_skills": string[],
  "additional_skills": string[],
  "suitability_summary": string
}

Rules:
- Output MUST be valid JSON only
- Do not include markdown formatting
- Do not include explanations
- Do not include the word "json" or any code fences
- The response should be parseable by JSON.parse()

Example output:
{
  "matched_skills": ["Python"],
  "missing_skills": ["Data Analysis", "Project Management"],
  "additional_skills": ["SQL", "Communication"],
  "suitability_summary": "The candidate is partially suitable, possessing some key skills required for the job."
}`;

const SKILLS_EXTRACTION_PROMPT = `I have a job vacancy document and would like to analyze how well a candidate's skills match the requirements. The candidate has experience with:

Technical Skills (strong experience):

JavaScript (6+ years, including ES6)
TypeScript (strong experience, particularly in geo-information applications)
React (multiple roles and projects, both front-end and full-stack)
Node.js (used across multiple positions)
Express.js
Remix (used at Columba Software for new applications)
Next.js
HTML5 & CSS3
SQL (PostgreSQL, MySQL, SQLite)
NoSQL (Elasticsearch, MongoDB)
Redis (caching)
Git
GraphQL
API development and integration
AI (OpenAI, Claude)

Technical Skills (some experience):

Nest.js
Docker
Kubernetes
Various cloud platforms (Azure, AWS)
Multiple frameworks including Gatsby, Capacitor
Authentication systems (Auth0)

Non-Technical Skills:

Mentoring experience (particularly with junior developers)
Code review expertise
Pair programming
SCRUM methodology
Strong collaborative skills
Multilingual communication (English & French work environments)
UI/UX implementation
Experience with translating Figma designs to code
Continuous learning mindset

Could you please analyze the vacancy document and evaluate how well this experience aligns with the job requirements?`;

async function createAssistant(openai: OpenAI) {
  return await openai.beta.assistants.create({
    name: "Job Skills Extractor",
    description: "Extracts skills from job descriptions",
    instructions: SYSTEM_PROMPT,
    model: "gpt-4o",
    tools: [{ type: "file_search" }],
  });
}

async function setupThread(openai: OpenAI, threadId: string, fileId: string) {
  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: SKILLS_EXTRACTION_PROMPT,
    attachments: [{ file_id: fileId, tools: [{ type: "file_search" }] }],
  });
}

async function parseAssistantResponse(
  responseText: string
): Promise<ParsedSkills> {
  const cleanedText = responseText
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
  const parsedResponse = JSON.parse(cleanedText);

  // check if parsedResponse is of type candidateMatch
  if (!isCandidateMatch(parsedResponse)) {
    throw new Error("Invalid response structure: not a candidate type match");
  }

  return {
    candidateMatch: parsedResponse,
    rawText: responseText,
  };
}

async function cleanup(openai: OpenAI, fileId: string, assistantId: string) {
  await Promise.all([
    openai.files.del(fileId),
    openai.beta.assistants.del(assistantId),
  ]);
}

export async function extractSkillsFromFile(
  uploadedFile: File,
  apiKey: string
): Promise<ParsedSkills> {
  const openai = new OpenAI({ apiKey });

  try {
    // Upload file to OpenAI
    const file = await openai.files.create({
      file: uploadedFile,
      purpose: "assistants",
    });

    // Create assistant
    const assistant = await createAssistant(openai);

    // Create thread and setup messages
    const thread = await openai.beta.threads.create();
    await setupThread(openai, thread.id, file.id);

    // Run the assistant
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistant.id,
    });

    if (run.status !== "completed") {
      throw new Error(`Run failed with status: ${run.status}`);
    }

    // Get messages
    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data[0].content[0];

    if (!("text" in lastMessage)) {
      throw new Error("Unexpected response format");
    }

    // Clean up resources
    await cleanup(openai, file.id, assistant.id);

    // Parse and return the response
    return await parseAssistantResponse(lastMessage.text.value);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
