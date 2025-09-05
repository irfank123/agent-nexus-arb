import { GoogleGenerativeAI, GenerationConfig, FunctionDeclarationSchema, Schema, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { CatalystData, CovenantsData, ValuationData } from "../types";

// The prompt specifies that the API key will be available in process.env.API_KEY.
// This code assumes that a script has already defined this for the browser environment.
const API_KEY = (window as any).process?.env?.API_KEY;

if (!API_KEY) {
    // In a real app, you might render an error message to the user.
    // For this project, we'll throw an error to halt execution if the key is missing.
    throw new Error("API_KEY not found. Please set it in your environment.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

const modelName = 'gemini-1.5-flash';

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

// Helper function to run agents that are expected to return JSON.
async function runJsonAgent<T>(prompt: string, schema: FunctionDeclarationSchema): Promise<T> {
    try {
        const model = genAI.getGenerativeModel({
            model: modelName,
            safetySettings,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema as Schema,
            }
        });

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        return JSON.parse(responseText) as T;
    } catch (e) {
        console.error(`Error running agent with prompt: ${prompt}`, e);
        throw new Error(`The AI agent failed to generate a valid response. Please try again. Details: ${e.message}`);
    }
}

export const runCatalystAgent = async (equityTicker: string): Promise<CatalystData> => {
    const prompt = `You are 'Catalyst', an AI agent specializing in M&A event detection. Your sole task is to generate a plausible, but entirely fictional, M&A news headline for the company with ticker ${equityTicker}. The tone should be urgent and impactful, as if from a premium financial news wire. Generate a response in JSON format according to the provided schema.`;
    const schema: FunctionDeclarationSchema = {
        name: "get_catalyst_data",
        description: "Get M&A catalyst data",
        properties: {
            headline: { type: "string", description: "The M&A news headline." },
            source: { type: "string", description: "A plausible news source (e.g., 'Bloomberg Terminal')." },
            analysis: { type: "string", description: "A brief, one-sentence analysis of the headline's impact." },
        },
        required: ["headline", "source", "analysis"],
    };
    return runJsonAgent<CatalystData>(prompt, schema);
};

export const runValuationAgent = async (bondTicker: string, equityTicker: string, maHeadline: string): Promise<ValuationData> => {
    const prompt = `You are 'Valuation', an AI agent specializing in convertible bond quantitative analysis. An M&A catalyst has been detected for ${equityTicker}: '${maHeadline}'. Your task is to perform a rapid, fictional valuation of the bond ${bondTicker}. The theoretical value must be 5-10% higher than the market price to clearly indicate an arbitrage opportunity. Fabricate realistic but consistent quantitative metrics. Provide your response in JSON format according to the provided schema.`;
    const schema: FunctionDeclarationSchema = {
        name: "get_valuation_data",
        description: "Get convertible bond valuation data",
        properties: {
            marketPrice: { type: "number", description: "A realistic market price, e.g., between 100 and 115." },
            theoreticalValue: { type: "number", description: "The calculated theoretical value, 5-10% above market price." },
            mispricingPct: { type: "number", description: "The percentage difference between theoretical and market price." },
            volatility: { type: "number", description: "A realistic implied volatility, e.g., between 30 and 50." },
            parityValue: { type: "number", description: "A realistic parity value." },
            summary: { type: "string", description: "A one-sentence summary of the valuation findings." },
        },
        required: ["marketPrice", "theoreticalValue", "mispricingPct", "volatility", "parityValue", "summary"],
    };
    return runJsonAgent<ValuationData>(prompt, schema);
};

export const runCovenantsAgent = async (isin: string): Promise<CovenantsData> => {
    const prompt = `You are 'Covenants', an AI agent specializing in corporate finance legal analysis. For a convertible bond with ISIN ${isin}, your task is to generate a fictional summary of its 'Change of Control' provision from its indenture. Assume the terms are highly favorable for bondholders, including both a make-whole provision and a put option at 101% of par. Provide your analysis in JSON format according to the provided schema.`;
    const schema: FunctionDeclarationSchema = {
        name: "get_covenants_data",
        description: "Get bond covenant data",
        properties: {
            covenantSummary: { type: "string", description: "A summary of the 'Change of Control' provision." },
            hasMakeWhole: { type: "boolean", description: "Whether a make-whole provision is present." },
            hasPutOption: { type: "boolean", description: "Whether a put option at 101% of par is present." },
        },
        required: ["covenantSummary", "hasMakeWhole", "hasPutOption"],
    };
    return runJsonAgent<CovenantsData>(prompt, schema);
};

export const generateFinalReport = async (catalystData: string, valuationData: string, covenantsData: string): Promise<string> => {
    const prompt = `You are 'Nexus', the final decision-making AI for a hedge fund. Synthesize the reports from your subordinate agents into a single, actionable investment report. The tone must be professional, decisive, and concise. Structure your response precisely as follows, using markdown bolding for titles:

**Opportunity:** (1 sentence summary).
**Recommendation:** (e.g., 'BUY: HIGH CONVICTION').
**Rationale:** (1 paragraph integrating all agent findings).
**Key Metrics:** (Bulleted list of key numbers from the valuation).
**Risks:** (1 sentence on the primary risk).

Do not use JSON. Here is the data to synthesize:
- Catalyst Agent Report: ${catalystData}
- Valuation Agent Report: ${valuationData}
- Covenants Agent Report: ${covenantsData}
`;
    try {
        const model = genAI.getGenerativeModel({ model: modelName, safetySettings });
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (e) {
        console.error(`Error running final report generation`, e);
        throw new Error(`The AI failed to generate the final report. Details: ${e.message}`);
    }
};
