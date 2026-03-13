import { AssemblyAI } from "assemblyai";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY,
});

export async function transcribeYoutubeVideo(audioUrl) {
    try {
        console.log("Uploading and transcribing...");

        const transcript = await client.transcripts.transcribe({
            audio: audioUrl,
            speech_models: ["universal-2"],
            speaker_labels: true,
            punctuate: true,
            format_text: true,
            language_detection: 'en'
        });

        if (transcript.status === "error") {
            throw new Error(transcript.error);
        }

        return transcript.text || "";

    } catch (err) {
        console.error("Transcription failed:", err);
        throw err; // don't hide error
    } finally {
        // delete only if it's a local file
        if (audioUrl && fs.existsSync(audioUrl)) {
            fs.unlinkSync(audioUrl);
        }
    }
}