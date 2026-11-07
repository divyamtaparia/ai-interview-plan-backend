const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLEGENAI_API_KEY,
});

const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100).describe("The percentage match score between the candidate profile and the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question which can asked in the interview"),
        intention: z.string().describe("The intention of the interviewer behind the question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("List of technical questions which can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question which can asked in the interview"),
        intention: z.string().describe("The intention of the interviewer behind the question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("List of behavioral questions which can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill in which the candidate is lacking"),
        severity: z.enum(['low', 'medium', 'high']).describe("The severity of the skill gap")
    })).describe("List of skill gaps in the candidate profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan starting from 1"),
        focus: z.string().describe("The focus of the preparation for the day"),
        tasks: z.array(z.string()).describe("List of tasks to be completed on the day for preparation")
    })).describe("A day-wise preparation plan for the candidate to prepare for the interview"),
    title: z.string().describe("The title of the job for which the interview report is generated, e.g. 'Senior Frontend Engineer Interview at Google'"),
});


async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    
    //Gemini api not working properly with zod schema validation given in config, so we are doing manual cleaning and validation after getting the response from api.

    /*
    const prompt = `Generate an interview report for a candidate with the following details:
                    Resume: ${resume}
                    Self Description: ${selfDescription}
                    Job Description: ${jobDescription}`
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    });

    return JSON.parse(response.text);
}
*/ 

    const prompt = `
    You are an AI interview report generator.

    Return ONLY valid JSON.

    Do not return explanation.
    Do not return markdown.
    Do not return normal text.

    Return data in this EXACT structure:

    {
    "title": "Frontend Developer Interview Plan"
    "matchScore": 85,
    "technicalQuestions": [
        {
        "question": "string",
        "intention": "string",
        "answer": "string"
        }
    ],
    "behavioralQuestions": [
        {
        "question": "string",
        "intention": "string",
        "answer": "string"
        }
    ],
    "skillGaps": [
        {
        "skill": "string",
        "severity": "low"
        }
    ],
    "preparationPlan": [
        {
        "day": 1,
        "focus": "string",
        "tasks": ["string"]
        }
    ]
    }

    Candidate Details:

    Resume:
    ${resume}

    Self Description:
    ${selfDescription}

    Job Description:
    ${jobDescription}`;   


    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    // Extract text
    const rawText = response.text;

    // Clean markdown
    const cleanedText = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    // Parse JSON
    const parsedData = JSON.parse(cleanedText);

    // Validate
    const validatedData = interviewReportSchema.parse(parsedData);

    return validatedData;
}

module.exports = generateInterviewReport;