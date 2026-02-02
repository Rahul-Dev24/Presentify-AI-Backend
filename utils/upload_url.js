// import youtubedl from "youtube-dl-exec";
// import { AssemblyAI } from 'assemblyai';
// import { pipeline } from 'node:stream/promises';
// import fs from 'node:fs';
// import { Readable } from 'node:stream';
// import path from 'path';

// const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });

// export async function getAudioAndUpload(youtubeUrl) {
//     try {
//         // 1. Get the restricted stream URL
//         const result = await youtubedl(youtubeUrl, {
//             format: "bestaudio",
//             getUrl: true,
//             noCheckCertificates: true,
//             noWarnings: true,
//             addHeader: ["referer:youtube.com", "user-agent:googlebot"]
//         });

//         const directStreamUrl = Array.isArray(result) ? result[0] : result;

//         // // 2. Define a temp path to save the file
//         // const tempFilePath = path.join(process.cwd(), `temp_audio_${Date.now()}.mp3`);

//         // console.log("Downloading stream to local server...");

//         // // 3. Use Fetch to get the data and Stream it to a file
//         // const response = await fetch(directStreamUrl);
//         // if (!response.ok) throw new Error(`Failed to fetch stream: ${response.statusText}`);

//         // const arrayBuffer = await response.arrayBuffer();
//         // const buffer = Buffer.from(arrayBuffer);

//         // // If the file is generated locally, return the local url
//         // const localUrl = `file://${tempFilePath}`;
//         // fs.writeFileSync(tempFilePath, buffer);

//         // return localUrl;



//         const tempFilePath = path.join(process.cwd(), `temp_audio_${Date.now()}.mp3`);

//         console.log("⚡ Streaming audio directly to disk...");

//         const response = await fetch(directStreamUrl);
//         if (!response.ok) throw new Error(`Failed to fetch stream: ${response.statusText}`);

//         // pipeline connects the download (body) directly to the file (writeStream)
//         // It finishes as soon as the download is done, without holding the whole file in RAM
//         await pipeline(
//             Readable.fromWeb(response.body),
//             fs.createWriteStream(tempFilePath)
//         );

//         return `file://${tempFilePath}`;

//     } catch (err) {
//         console.error("Audio processing failed:", err.message);
//         throw err;
//     }
// }


import youtubedl from "youtube-dl-exec";
import path from "path";

export async function getAudioAndUpload(youtubeUrl) {
    const outputPath = path.join(
        process.cwd(),
        `temp_audio_${Date.now()}.mp3`
    );

    try {
        console.log("⬇️ yt-dlp downloading audio (ANDROID client)...");

        await youtubedl(youtubeUrl, {
            extractAudio: true,
            audioFormat: "mp3",
            audioQuality: "192K",
            output: outputPath,

            noPlaylist: true,

            // REQUIRED
            jsRuntimes: "node",

            // 🔥 THIS FIXES SABR
            extractorArgs: "youtube:player_client=android",

            // Safety
            format: "bestaudio/best",
        });

        console.log("✅ Audio saved:", outputPath);
        return `file://${outputPath}`;

    } catch (err) {
        console.error("yt-dlp stderr:\n", err.stderr);
        throw err;
    }
}
