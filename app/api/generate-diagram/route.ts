import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    console.log("Received prompt:", prompt);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const systemPrompt = `Create a Mermaid flowchart diagram based on the user's description.
    Use only Flowchart syntax with proper line breaks between each line.
    Do not include markdown fences or the word 'mermaid'.
    
    Example format:
    flowchart TD
        A[Start] --> B[Process]
        B --> C{Decision}
        C -->|Yes| D[Action 1]
        C -->|No| E[Action 2]
    
       Rules:
    1. Start with 'flowchart TD'
    2. Use single letters (A, B, C, etc.) for node IDs
    3. Put descriptive text in square brackets [like this]
    4. Use proper indentation (4 spaces)
    5. For conditions, use -->|Yes| or -->|No| format
    6. Each connection must be on a new line

    7. No extra spaces between arrows (-->)
    8. dont add special symbol like #, *,"", etc.

    Return ONLY the diagram syntax, no explanations.`;

    const result = await model.generateContent([
      systemPrompt,
      `Create a diagram for: ${prompt}`
    ]);
    
    const response = await result.response;
    let mermaidScript = response.text().trim();
    
    // Clean up the response
    mermaidScript = mermaidScript
      // Remove markdown fences and mermaid keyword
      .replace(/```mermaid\n?|\n?```/g, '')
      // Ensure proper line breaks
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n    ')
      // Add proper indentation
      .replace(/^/gm, '    ')
      .trim();
    
    // Ensure the script starts with flowchart TD
    if (!mermaidScript.startsWith('flowchart TD')) {
      mermaidScript = 'flowchart TD\n' + mermaidScript;
    }

    console.log("Generated Mermaid script:", mermaidScript);

    return NextResponse.json({ mermaidScript });
  } catch (error) {
    console.error("Diagram generation error:", error);
    // Provide a fallback diagram if generation fails
    const fallbackScript = `flowchart TD
    A[Start] --> B[Process]
    B --> C{Decision}
    C -->|Yes| D[Success]
    C -->|No| E[Failure]`;

    return NextResponse.json({ 
      mermaidScript: fallbackScript,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}