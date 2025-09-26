// Import the GoogleGenerativeAI SDK
const { GoogleGenerativeAI } = require("@google/generative-ai");

// The client requires the API key to be passed directly or via an env var
// It defaults to looking for the GEMINI_API_KEY env var.
const ai = new GoogleGenerativeAI("AIzaSyChs4cva8nE49xIPBdCeKVq-Z4y38Pa74k");

async function runTest() {
    console.log("Attempting to connect to Gemini 1.5 Flash using the 'generative-ai' SDK...");
    


    try {
        // The getGenerativeModel method is used here
        const model = ai.getGenerativeModel({ 
            // Correct model name for the public API
            model: "gemini-1.5-flash" 
        });

        const result = await model.generateContent(
            "What is a brief, one-sentence summary of the Gemini 1.5 Flash model?"
        );

        const responseText = result.response.text;

        console.log("✅ Success! Gemini Response Received:");
        console.log("-----------------------------------------");
        console.log(responseText.trim());
        console.log("-----------------------------------------");

    } catch (error) {
        console.error("❌ Gemini API Call Failed.");
        console.error("Details:", error.message);
        console.error("This specific error (404/Publisher Model not found) strongly suggests one of two things:");
        console.error("1. Your API Key is a Google Cloud (Vertex AI) key being used with the public endpoint.");
        console.error("2. A model setting is forcing the client to look at a Vertex AI endpoint.");
        console.error("Please ensure your key is from Google AI Studio.");
    }
}

runTest();