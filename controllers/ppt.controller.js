// import prisma from "../utils/prisma";
import { transcribeYoutubeVideo } from "./Assembly_AI.controller.js";
import { getPrompt } from "../utils/prompt.js";
import { prisma } from "../utils/prisma.js";

export const getHtmlResponse = async (req, res) => {
    const { fileId, slideArray } = req.body;

    try {
        if (!slideArray || !fileId) {
            return res.status(400).json({ success: false, message: "Requeried fields are missing." });
        }

        const file = await prisma.file.findUnique({
            where: {
                id: fileId,
            },
            include: {
                response: {
                    include: {
                        slides: {
                            orderBy: {
                                slideIndex: 'asc', // important for ordered slides
                            },
                        },
                    },
                },
            },
        });
        console.log("file", file);


        if (file?.response?.length > 0) {
            return res.status(200).json({ success: true, message: "Slides fetched successfully", data: file });
        }
        const prompt = getPrompt(slideArray);

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

        // 1️⃣ Call Gemini API
        const apiResponse = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });


        if (!apiResponse.ok) {
            throw new Error(`Gemini API failed: ${apiResponse.status}`);
        }

        const result = await apiResponse.json();

        // 2️⃣ Extract text safely
        const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) {
            return res.status(400).json({ success: false, message: "Empty response from Gemini" });
        }

        // 3️⃣ Parse JSON text into slides array
        let slidesData;
        try {
            slidesData = JSON.parse(rawText);
        } catch (err) {
            return res.status(400).json({ success: false, message: "Failed to parse Gemini JSON output" });
        }

        // 4️⃣ Validate & sort slides
        slidesData.forEach((slide) => {
            if (
                typeof slide.slideIndex !== "number" ||
                !slide.title ||
                !slide.htmlContent
            ) {
                return res.status(400).json({ success: false, message: "Invalid slide structure" });
            }
        });

        slidesData.sort((a, b) => a.slideIndex - b.slideIndex);

        // 5️⃣ Store in DB (transaction)
        const dbResult = await prisma.$transaction(async (tx) => {
            // Create Response
            const responseRecord = await tx.response.create({
                data: {
                    userId: 5,
                    fileId: fileId,
                },
            });

            // Create Slides
            await tx.slides.createMany({
                data: slidesData.map((slide) => ({
                    responseId: responseRecord.id,
                    slideIndex: slide.slideIndex,
                    title: slide.title,
                    htmlContent: slide.htmlContent,
                    detailedNotes: slide.detailedNotes ?? "",
                    speakerNotes: slide.speakerNotes ?? "",
                })),
            });
            const createdSlides = await tx.slides.findMany({
                where: { responseId: responseRecord.id },
                orderBy: { slideIndex: "asc" },
            });
            return ({
                ...responseRecord,
                slides: createdSlides,
            });
        });

        res.status(200).json({ success: true, message: "Html response created successfully", data: dbResult });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


export const getProjectByUserId = async (req, res) => {
    try {
        const { user } = req;
        if (!user) {
            return res.status(400).json({ success: false, message: "Requeried fields are missing." });
        }
        const allProjects = await prisma.response.findMany({
            include: {
                slides: true,
            },
            where: {
                userId: user?.id
            }
        });
        res.status(200).json({
            success: true,
            message: "All projects",
            data: allProjects,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}