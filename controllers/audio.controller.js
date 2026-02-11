import { prisma } from "../utils/prisma";

export async function getAudioById(audioId) {
}

export async function uploadAudio(req, res) {
    try {
        const { title, asset_id, audioUrl, durationString, tags, category } = req.body;

        if (!title || !asset_id || !audioUrl || !durationString) {
            return res.status(400).json({ success: false, message: "Requeried fields are missing." });
        }

        const audio = await prisma.audio.create({
            data: {
                userId: 4,
                title: title,
                audioId: asset_id,
                audioUrl: audioUrl,
                description: "",
                tags: tags || [],
                durationString: durationString,
                categories: category || [],
                type: "AUDIO"
            }
        });

        res.status(200).json({ success: true, message: "Audio uploaded successfully", data: audio });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}