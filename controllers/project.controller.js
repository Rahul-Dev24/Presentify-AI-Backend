import { prisma } from "../utils/prisma.js";


export const getProjects = async (req, res) => {
    const { search } = req.query;
    const userId = req.user?.id; // ✅ fix

    try {
        const files = await prisma.file.findMany({
            where: {
                // 🔥 user filter
                users: {
                    some: {
                        id: userId,
                    },
                },

                // 🔥 search filter
                ...(search && {
                    OR: [
                        {
                            title: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            description: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            tags: {
                                hasSome: [search],
                            },
                        },
                        {
                            categories: {
                                hasSome: [search],
                            },
                        },
                    ],
                }),
            },

            include: {
                response: {
                    include: {
                        slides: {
                            orderBy: {
                                slideIndex: "asc",
                            },
                        },
                    },
                },
            },

            orderBy: {
                createdAt: "desc",
            },
        });

        res.json({
            success: true,
            message: "Projects fetched successfully",
            data: files,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const deleteProject = async (req, res) => {

    const { fileId } = req.body;
    const { id } = req.user;

    // Step 1: Check access
    const file = await prisma.file.findFirst({
        where: {
            id: fileId,
            users: {
                some: {
                    id: id,
                },
            },
        },
    });

    if (!file) {
        throw new Error("File not found or access denied");
    }

    // Step 2: Delete ONLY this user's responses
    await prisma.response.deleteMany({
        where: {
            fileId: fileId,
            userId: id,
        },
    });

    // 🔥 Slides auto-deleted because of cascade

    // Step 3: Remove user from file
    const updatedFile = await prisma.file.update({
        where: {
            id: fileId,
        },
        data: {
            users: {
                disconnect: {
                    id: id,
                },
            },
        },
    });

    if (updatedFile) res.json({ success: true, message: "Project deleted successfully" });
    else res.json({ success: false, message: "Project not deleted" });
}