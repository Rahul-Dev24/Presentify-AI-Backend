
import { getAudioVideoAndUpload } from "../utils/upload_url.js";
import { validateYouTubeUrl } from "../utils/validators.js";
import { prisma } from "../utils/prisma.js"

export async function getAllVideo(req, res) {
    const { page, limit } = req.body;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 12;

    try {
        const allVideos = await prisma.file.findMany({
            where: {
                userId: 4
            },
            skip: (page - 1) * limit,
            take: limit
        });
        const count = await prisma.file.count({
            where: {
                userId: 4
            }
        });
        const totalPages = Math.ceil(count / limit);

        res.status(200).json({
            success: true,
            message: "All videos",
            data: allVideos,
            pagination: {
                page,
                limit,
                totalPages
            }
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export async function updateVideo(req, res) {
    try {
        const id = req.params.id;
        const { title, description, tags, categories } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: "id is required" });
        }

        const updatedVideo = await prisma.file.update({
            where: {
                id: id
            },
            data: {
                title: title,
                description: description,
                tags: tags || [],
                categories: categories || []
            }
        });

        res.status(200).json({ success: true, message: "Video updated successfully", data: updatedVideo });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export async function youtubeVideoUpload(req, res) {
    try {
        const { youtubeUrl } = req.body;

        const videoId = getYoutubeVideoId(youtubeUrl);

        // Validate input
        if (!youtubeUrl) {
            return res.status(400).json({ success: false, error: 'YoutubeUrl and email are required' });
        }

        if (!validateYouTubeUrl(youtubeUrl) && !videoId) {
            return res.status(400).json({ success: false, error: 'Invalid YouTube URL' });
        }

        const file = await prisma.file.findUnique({
            where: {
                youtubeId: videoId
            }
        });

        if (file) {
            return res.status(200).json({ success: true, message: 'Video already exists', data: file });
        } else {
            const videoMetaData = await getAudioVideoAndUpload(youtubeUrl);

            const newFile = await prisma.file.create({
                data: {
                    userId: 2,
                    videoId: videoMetaData?.youtube?.id,
                    title: videoMetaData?.youtube?.title,
                    description: videoMetaData?.youtube?.description,
                    durationString: videoMetaData?.youtube?.durationString,
                    thumbnail: videoMetaData?.youtube?.thumbnail,
                    tags: videoMetaData?.youtube?.tags,
                    categories: videoMetaData?.youtube?.categories,
                    videoUrl: videoMetaData?.cloudinary?.videoUrl,
                    videoId: videoMetaData?.cloudinary?.videoObj?.asset_id,
                    audioUrl: videoMetaData?.cloudinary?.audioUrl,
                    audioId: videoMetaData?.cloudinary?.audioObj?.asset_id,
                    youtubeId: videoMetaData?.youtube?.id,
                    type: 'YOUTUBE',
                }
            });

            return res.json({
                success: true,
                message: 'Video uploaded successfully',
                data: newFile
            });
        }

    } catch (error) {
        console.error('Error creating Video:', error);
        res.status(500).json({ success: false, error: 'Failed to create job' });
    }
}


export async function deleteVideo(req, res) {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ success: false, message: "id is required" });
        }

        const deletedVideo = await prisma.file.delete({
            where: {
                id: id
            }
        });

        res.status(200).json({ success: true, message: "Video deleted successfully", data: deletedVideo });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}




export const getYoutubeVideoId = (url) => {
    try {
        const parsedUrl = new URL(url);

        // 1️⃣ Standard watch URL
        const v = parsedUrl.searchParams.get("v");
        if (v) return v;

        // 2️⃣ youtu.be short URL
        if (parsedUrl.hostname === "youtu.be") {
            return parsedUrl.pathname.slice(1);
        }

        // 3️⃣ /embed/VIDEO_ID
        if (parsedUrl.pathname.includes("/embed/")) {
            return parsedUrl.pathname.split("/embed/")[1];
        }

        // 4️⃣ /shorts/VIDEO_ID
        if (parsedUrl.pathname.includes("/shorts/")) {
            return parsedUrl.pathname.split("/shorts/")[1];
        }

        return null;
    } catch {
        return null;
    }
};


export const storeLocalVideo = async (req, res) => {
    const { videoId, title, tags, type, audioUrl, videoUrl, categories, duration } = req.body;
    if (!videoId || !title || !type || !audioUrl || !videoUrl || !duration) {
        return res.status(400).json({ success: false, message: "Requeried fields are missing." });
    }
    try {
        const newFile = await prisma.file.create({
            data: {
                userId: 2,
                videoId: videoId,
                title: title,
                durationString: duration,
                thumbnail: "https://res.cloudinary.com/dowonjpws/image/upload/v1770634332/Gemini_Generated_Image_a06kqua06kqua06k_scbs9l.png",
                tags: tags,
                categories: categories,
                videoUrl: videoUrl,
                videoId: videoId,
                audioUrl: audioUrl,
                youtubeId: null,
                type: type,
                description: "This video is uploaded by local device",
            }
        });

        return res.json({
            success: true,
            message: 'Video uploaded successfully',
            data: newFile
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};