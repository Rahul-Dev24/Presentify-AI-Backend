/**
 * Analyze YouTube video with Gemini to identify slides using direct REST API
 */

import fetch from "node-fetch";
import { transcribeYoutubeVideo } from "./Assembly_AI.controller.js";
import { getAudioAndUpload } from "../utils/upload_url.js";
import { getPrompt } from "../utils/prompt.js";

export async function analyzeVideo(youtubeUrl) {
    try {

        const audioUrl = await getAudioAndUpload(youtubeUrl);

        const transcriptText = await transcribeYoutubeVideo(audioUrl);

        if (!transcriptText) {
            console.warn("No transcript found, skipping Gemini analysis");
            return [];
        }

        const prompt = getPrompt(transcriptText);

        console.log('Sending request to Gemini...');
        return
        // Make direct REST API call with YouTube URL support (use v1beta for video features)
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

        const requestBody = {
            contents: [
                {
                    role: "user",
                    parts: [
                        // {
                        //   file_data: {
                        //     file_uri: youtubeUrl,
                        //   },
                        // },
                        {
                            text: prompt,
                        },
                    ],
                },
            ],
            generationConfig: {
                response_mime_type: "application/json",
            },
        };

        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            throw new Error(`Gemini API error: ${apiResponse.status} - ${errorText}`);
        }

        const result = await apiResponse.json();

        // const result = await toJsonArray(apiResponse);
        const response = result.candidates[0].content.parts[0].text;
        // const response = extractGeminiText(result);
        console.log("apiResponse", result);

        console.log('Gemini response received');
        console.log('Raw response:', response);

        // Parse JSON response
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            console.warn('No JSON array found in Gemini response');
            return [];
        }

        const slides = JSON.parse(jsonMatch[0]);

        console.log(`Detected ${slides.length} slides`);
        return slides;
    } catch (error) {
        console.error('Gemini API error:', error);
        throw new Error(`Failed to analyze video with Gemini: ${error.message}`);
    }
}

/**
 * Convert timestamp to seconds
 */
export function timestampToSeconds(timestamp) {
    const parts = timestamp.split(':').map(Number);

    if (parts.length === 2) {
        // MM:SS
        return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
        // HH:MM:SS
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }

    return 0;
}





/* ---------------------------------- */
/* Helper: Convert ANY output to JSON */
/* ---------------------------------- */
// export function toJsonArray(input) {
//   try {
//     // 1. If already an array, return directly
//     if (Array.isArray(input)) return input;

//     // 2. If object, wrap into array
//     if (typeof input === "object" && input !== null) {
//       return [input];
//     }

//     // 3. Convert to string
//     let text = String(input);

//     // 4. Remove code fences and triple quotes
//     text = text
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .replace(/"""/g, '"')
//       .trim();

//     // 5. Extract JSON array if mixed text
//     const arrayMatch = text.match(/\[[\s\S]*\]/);
//     if (arrayMatch) {
//       text = arrayMatch[0];
//     }

//     // 6. Repair broken JSON
//     const repaired = jsonrepair(text);

//     // 7. Parse JSON
//     const parsed = JSON.parse(repaired);
//     // 8. Ensure array output
//     return new Promise((resolve, reject) => {
//       if (Array.isArray(parsed)) {
//         resolve(parsed);
//       } else {
//         resolve([parsed]);
//       }
//     })

//   } catch (error) {
//     console.error("JSON conversion failed:", error.message);
//     return [];
//   }
// }



/* ---------------------------------- */
/* Helper: Safe Gemini text extractor */
/* ---------------------------------- */
// function extractGeminiText(apiResult) {
//   try {
//     return (
//       apiResult?.candidates?.[0]?.content?.parts
//         ?.map(p => p.text || "")
//         .join("") || ""
//     );
//   } catch {
//     return "";
//   }
// }


/* ---------------------------------- */
/* Helper: Fetch YouTube transcript   */
/* ---------------------------------- */
// const transcribeYouTubeVideo = async (videoUrl, apiKey) => {
//   const client = new AssemblyAI({ apiKey });

//   try {
//     console.log("Extracting audio stream from YouTube...");

//     // 1. Get the direct audio URL from YouTube
//     const videoInfo = await youtubeDl(videoUrl, {
//       dumpSingleJson: true,
//       noCheckCertificates: true,
//       preferFreeFormats: true,
//       addHeader: ['referer:youtube.com', 'user-agent:googlebot']
//     });

//     // Find the best audio-only format (m4a is usually most stable)
//     const directAudioUrl = videoInfo.formats.reverse().find(
//       (f) => f.resolution === 'audio only' && f.ext === 'm4a'
//     )?.url;

//     if (!directAudioUrl) {
//       throw new Error("Could not find a valid audio stream for this video.");
//     }

//     console.log("Direct audio URL found. Starting transcription...");

//     // 2. Pass the direct URL to AssemblyAI
//     const transcript = await client.transcripts.transcribe({
//       audio: directAudioUrl,
//       speaker_labels: true,
//     });

//     if (transcript.status === 'error') {
//       throw new Error(`AssemblyAI Error: ${transcript.error}`);
//     }

//     return transcript.text;
//   } catch (error) {
//     console.error("Transcription process failed:", error.message);
//     throw error;
//   }
// };


// async function getAudioUrl(youtubeUrl) {
//   try {
//     const result = await youtubedl(youtubeUrl, {
//       format: "bestaudio",
//       getUrl: true,
//       noCheckCertificates: true,
//       noWarnings: true,
//       preferFreeFormats: true,
//       addHeader: ["referer:youtube.com", "user-agent:googlebot"]
//     });

//     // youtube-dl-exec returns string OR array
//     const res = Array.isArray(result) ? result[0] : result;

//     const audioUrl = await fetch(res)
//     console.log("audioUrl", audioUrl?.Response);

//     // return Array.isArray(result) ? result[0] : result;

//   } catch (err) {
//     console.error("Audio URL extraction failed:", err.message);
//     throw err;
//   }
// }
