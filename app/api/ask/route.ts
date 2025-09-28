
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


/**
 * Handles a user's question by forwarding it to the OpenAI API.
 * This endpoint acts as a backend for a financial tutor chatbot.
 *
 * @param {Request} req The incoming HTTP request, expected to contain a JSON body with a 'question' field.
 * @returns {Promise<NextResponse>} A JSON response containing the AI-generated answer or an error message.
 */
export async function POST(req: Request) {
  // --- 1. Input Validation ---
  let question: string;
  try {
    const body = await req.json();
    question = body.question;

    if (!question || typeof question !== "string" || question.trim() === "") {
      return NextResponse.json(
        { error: "The 'question' field must be a non-empty string." },
        { status: 400 }
      );
    }
  } catch (jsonError) {
    return NextResponse.json(
      { error: "Invalid JSON in request body." },
      { status: 400 }
    );
  }

  // --- 2. API Interaction with Error Handling ---
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          // ++ MODIFIED PROMPT ++
          // This new prompt instructs the AI to be direct, brief, and avoid conversational fillers.
          content:
            "You are a financial tutor bot. Provide direct, clear, and brief explanations. Strictly limit responses to 2-3 sentences. Do not use any conversational fillers, introductions, or closing remarks.",
        },
        { role: "user", content: question },
      ],
      temperature: 0.5, // Lowered for more factual, less verbose answers
      max_tokens: 150, // Reduced max tokens for brevity
    });

    const answer =
      completion.choices[0]?.message?.content?.trim() ??
      "I'm sorry, I couldn't come up with a response. Please try again.";

    return NextResponse.json({ answer });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("OpenAI API Error:", error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }

    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request." },
      { status: 500 }
    );
  }
}