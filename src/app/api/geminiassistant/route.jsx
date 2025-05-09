import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function POST(request) {
    try {
        const { prompts } = await request.json();
        if (!Array.isArray(prompts) || prompts.length === 0) {
            return NextResponse.json({ error: "Missing or invalid prompts" }, { status: 400 });
        }

        const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

        const results = await Promise.all(
            prompts.map(async (prompt) => {
                try {
                    const result = await model.generateContent({
                        contents: [
                            {
                                role: "user",
                                parts: [
                                    {
                                        text: `You are a Salesforce expert.so give salesforce related answer`,
                                    },
                                    {
                                        text: prompt,
                                    },
                                ],
                            },
                        ],
                        generationConfig: {
                            temperature: 0.2,
                            maxOutputTokens: 1024,
                        },
                    });

                    const generatedText = result.response.text().trim();
                    const cleaned = generatedText.replace(/```soql|```/gi, "").trim();

                    if (!cleaned.toUpperCase().startsWith("SELECT")) {
                        return { prompt, error: "Invalid SOQL generated" };
                    }

                    return { prompt, query: cleaned };
                } catch (err) {
                    console.error("Error generating SOQL for prompt:", prompt, err);
                    return { prompt, error: err?.message || "Error generating SOQL" };
                }
            })
        );

        return NextResponse.json({
            success: true,
            results,
            provider: "gemini-2.0-flash",
        });
    } catch (err) {
        console.error("Gemini error:", err);
        return NextResponse.json(
            { error: err?.message || "Something went wrong" },
            { status: 500 }
        );
    }
}
