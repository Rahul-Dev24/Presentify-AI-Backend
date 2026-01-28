import { AssemblyAI } from 'assemblyai';
import fs from 'fs';

const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY
});

export async function transcribeYoutubeVideo(audioUrl) {
    try {

        console.log("2. Uploading and transcribing (this may take a minute)...");

        /**
         * The SDK handles:
         * - Uploading the local file to AssemblyAI storage
         * - Starting the transcription job
         * - Polling the status until it's "completed" or "error"
         */
        const transcript = await client.transcripts.transcribe({
            audio: audioUrl, // Can be a local path, URL, buffer, or stream
            speaker_labels: true, // Identify different speakers
            punctuate: true,      // Add punctuation
            format_text: true     // Capitalize sentences
        });

        if (transcript.status === 'error') {
            throw new Error(`AssemblyAI Error: ${transcript.error}`);
        }

        return transcript.text;

    } catch (err) {
        console.error("Transcription failed:", err.message);
        return "";
    } finally {
        // 3. Clean up: Delete the local file to free up space
        if (fs.existsSync(audioUrl)) {
            fs.unlinkSync(audioUrl);
        }
    }
}