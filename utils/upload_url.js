import youtubedl from "youtube-dl-exec";
import path from "path";
import fs from "fs";
import { uploadFile } from "./cloud.utils.js";
import { getYoutubeVideoId } from "../controllers/video.controller.js";

// export async function getAudioVideoAndUpload(youtubeUrl) {
//     return new Promise(async (resolve, reject) => {
//         const id = Date.now();

//         // const audioTemplate = path.join(process.cwd(), `audio_${id}.%(ext)s`);
//         const videoTemplate = path.join(process.cwd(), `video_${id}.%(ext)s`);

//         let audioPath, videoPath;

//         const youtubeId = getYoutubeVideoId(youtubeUrl);

//         try {

//             // 1️⃣ Download audio + video
//             await Promise.all([
//                 // AUDIO
//                 // await youtubedl(youtubeUrl, {
//                 //     extractAudio: true,
//                 //     audioFormat: "mp3",
//                 //     audioQuality: "128K",
//                 //     output: audioTemplate,
//                 //     noPlaylist: true,
//                 //     jsRuntimes: "node",
//                 //     extractorArgs: "youtube:player_client=android",
//                 // }),

//                 // VIDEO (FORCE MP4)
//                 await youtubedl(youtubeUrl, {
//                     format: "bestvideo[height<=480]+bestaudio/best",
//                     mergeOutputFormat: "mp4",   // 🔥 IMPORTANT
//                     output: videoTemplate,
//                     noPlaylist: true,
//                     jsRuntimes: "node",
//                     extractorArgs: "youtube:player_client=android",
//                 }),
//             ]);

//             audioPath = fs.readdirSync(process.cwd())
//                 .find(f => f.startsWith(`audio_${id}`));

//             videoPath = fs.readdirSync(process.cwd())
//                 .find(f => f.startsWith(`video_${id}`));

//             if (!audioPath || !videoPath) {
//                 throw new Error("Download failed: output files not found");
//             }

//             audioPath = path.join(process.cwd(), audioPath);
//             videoPath = path.join(process.cwd(), videoPath);

//             const metadata = await getYoutubeMetadata(youtubeUrl);

//             console.log("☁️ Uploading to Cloudinary...");

//             // 3️⃣ Upload in parallel
//             const [audioUpload, videoUpload] = await Promise.all([
//                 uploadFile(audioPath),
//                 uploadFile(videoPath, {
//                     resource_type: "video",
//                     quality: "auto:low",
//                     fetch_format: "mp4",
//                 }),
//             ]);

//             // 4️⃣ Cleanup
//             fs.unlinkSync(audioPath);
//             fs.unlinkSync(videoPath);

//             resolve({
//                 youtube: {
//                     ...metadata
//                 },
//                 cloudinary: {
//                     audioUrl: audioUpload.secure_url,
//                     audioObj: audioUpload,
//                     videoUrl: videoUpload.secure_url,
//                     videoObj: videoUpload,
//                 },
//             });

//         } catch (err) {
//             reject(err);
//         }
//     })
// }


export async function getAudioVideoAndUpload(youtubeUrl) {
    return new Promise(async (resolve, reject) => {
        const id = Date.now();

        const videoTemplate = path.join(process.cwd(), `video_${id}.%(ext)s`);

        let videoPath;

        const youtubeId = getYoutubeVideoId(youtubeUrl);

        try {

            // 1️⃣ Download VIDEO only
            await Promise.all([
                await youtubedl(youtubeUrl, {
                    format: "bestvideo[height<=480]+bestaudio/best",
                    mergeOutputFormat: "mp4",   // 🔥 IMPORTANT
                    output: videoTemplate,
                    noPlaylist: true,
                    jsRuntimes: "node",
                    extractorArgs: "youtube:player_client=android",
                }),
            ]);

            videoPath = fs.readdirSync(process.cwd())
                .find(f => f.startsWith(`video_${id}`));

            if (!videoPath) {
                throw new Error("Download failed: video file not found");
            }

            videoPath = path.join(process.cwd(), videoPath);

            const metadata = await getYoutubeMetadata(youtubeUrl);

            console.log("☁️ Uploading to Cloudinary...");

            // 3️⃣ Upload VIDEO only
            const videoUpload = await uploadFile(videoPath, {
                resource_type: "video",
                quality: "auto:low",
                fetch_format: "mp4",
            });

            // 4️⃣ Cleanup
            fs.unlinkSync(videoPath);
            const audio = cloudinaryVideoToAudio(videoUpload.secure_url);

            resolve({
                youtube: {
                    ...metadata
                },
                cloudinary: {
                    videoUrl: videoUpload.secure_url,
                    videoObj: videoUpload,
                    audioUrl: audio
                },
            });

        } catch (err) {
            reject(err);
        }
    })
}




export function getYoutubeMetadata(youtubeUrl) {
    return new Promise(async (resolve, reject) => {
        try {
            const metadata = await youtubedl(youtubeUrl, {
                dumpSingleJson: true,
                noPlaylist: true,

                // keep same config as your audio downloader
                jsRuntimes: "node",
                extractorArgs: "youtube:player_client=android",
            });

            resolve({
                id: metadata.id,
                title: metadata.title,
                description: metadata.description,

                channel: metadata.channel,
                channelId: metadata.channel_id,
                uploader: metadata.uploader,

                duration: metadata.duration,
                durationString: metadata.duration_string,

                uploadDate: metadata.upload_date,
                viewCount: metadata.view_count,
                likeCount: metadata.like_count,

                thumbnail: metadata.thumbnail,
                thumbnails: metadata.thumbnails,

                tags: metadata.tags,
                categories: metadata.categories,

                webpageUrl: metadata.webpage_url,
            });

        } catch (err) {
            reject(err);
        }
    });
}


function cloudinaryVideoToAudio(videoUrl, options = {}) {
    const {
        format = "mp3",     // mp3 | wav | m4a
        audioQuality,       // e.g. 32, 64, 128
        startOffset,        // seconds
        duration            // seconds
    } = options;

    if (!videoUrl.includes("/video/upload/")) {
        throw new Error("Invalid Cloudinary video URL");
    }

    const transformations = [];

    if (startOffset !== undefined) transformations.push(`so_${startOffset}`);
    if (duration !== undefined) transformations.push(`du_${duration}`);
    transformations.push(`f_${format}`);
    if (audioQuality) transformations.push(`aq_${audioQuality}`);

    const transformationString = transformations.join(",");

    return videoUrl
        .replace("/video/upload/", `/video/upload/${transformationString}/`)
        .replace(/\.\w+$/, `.${format}`);
}