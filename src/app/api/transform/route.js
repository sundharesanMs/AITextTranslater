// import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";
 

function buildInstructions(mode, target, tone) {
    const base = "You are a helpful writing assistant. Be clear, consise, and your responses should be easily reusable. Do not add extra commentary.";

    if(mode == "summarize") {
        return `${base} Summarize the given text into maximum of 5 bullet points`;
    }
    else if(mode == "rewrite") {
        return `${base} Rewrite the given text into a ${tone ? tone : "simple"} tone. You should preserve the meaning.`
    }
    else {
        return `${base} Translate the given statements to ${target}. Do not change the names or products mentioned.`
    }
}
// grqo apu key
export async function POST(req) {
    try {
        const { input, mode, tone, target } = await req.json();

        const cleanedInput = input?.trim();

        if (!cleanedInput) {
            return Response.json({ error: "Text required" }, { status: 400 });
        } 
        const client = new Groq({ apiKey: process.env.GROQ_API_KEY }); 


        const response = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",  // ✅ Groq Free Model
            messages: [
                {
                    role: "system",
                    content: buildInstructions(mode, target, tone)
                },
                {
                    role: "user",
                    content: cleanedInput
                }
            ],
            max_tokens: 1024,
            temperature: 0.7
        });

        const output = response.choices[0]?.message?.content || "";
        console.log("output === ", output); 

        return Response.json({ status: true, Result: output });

    } catch (err) {
        console.error("Groq API Error:", err);
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}





// export async function POST(req) {
//     try {
//         const {input, mode, tone, target} = await req.json();
//         console.log("input", input, "mode", mode, "tone", tone, "target", target); 
//        // return;

//         const cleanedInput = input ? input.trim(): "";

//         if(!cleanedInput) {
//             return Response.json({error: "Text required"}, {status: 400});
//         }

//         const client = new GoogleGenAI(process.env.GOOGLE_API_KEY); 
//         console.log("client", client); 
        

//         const aiResponse = await client.generateContent({
//             model: "gemini-pro",
//             contents: [{
//                 role: "user",
//                 parts: [
//                     { text: buildInstructions(mode, target, tone) },
//                     { text: cleanedInput }
//                 ]
//             }]
//         }); 
//         console.log("aiResponse", aiResponse);
//        // return; 


//         return Response.json({output: aiResponse.output_text || ""});
//     }
//     catch(err) {
//         return Response.json({
//             error: "Server error",
//             status: 500
//         })
//     }
// }  
// export async function POST(req) {
//     try {
//         const { input, mode, tone, target } = await req.json();
//      const client = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

//         const cleanedInput = input?.trim();
//         if (!cleanedInput) {
//             return Response.json({ error: "Text required" }, { status: 400 });
//         }

//         const response = await client.models.generateContent({
//             model: "gemini-2.0-flash",  // ✅ Free model
//             contents: buildInstructions(mode, target, tone) + "\n\n" + cleanedInput
//         });

//         return Response.json({ output: response.text }); // ✅ .text மட்டும் போதும்

//     } catch (err) {
//         console.error(err);
//         return Response.json({ error: "Server error" }, { status: 500 });
//     }
// }

// export async function POST(req) {
//     try {
//         const { input, mode, tone, target } = await req.json();

//         const cleanedInput = input ? input.trim() : "";

//         if (!cleanedInput) {
//             return Response.json({ error: "Text required" }, { status: 400 });
//         }

//         // ✅ சரியான import மற்றும் initialization
//         const client = new GoogleGenAI(process.env.GOOGLE_API_KEY);

//         // ✅ சரியான method
//         const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

//         const prompt = buildInstructions(mode, target, tone) + "\n\n" + cleanedInput;

//         const aiResponse = await model.generateContent(prompt);

//         // ✅ சரியான response extraction
//         const outputText = aiResponse.response.text();

//         return Response.json({ output: outputText });

//     } catch (err) {
//         console.error("API Error:", err);
//         return Response.json({ error: "Server error" }, { status: 500 }); // ✅ status இங்கே வரணும்
//     }
// }



