// queries/fileStats.ts
import { prisma } from "../utils/prisma.js";
import { FILE_TYPE_META } from "../utils/utils.js";

export const getFileSourceStatsByUser = async (req, res) => {

    const { user } = req.user;

    const grouped = await prisma.file.groupBy({
        by: ["type"],
        where: {
            users: {
                some: { id: user?.id }, // ← filters only this user's files
            },
        },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
    });

    const endRes = grouped.map((row) => ({
        source: row.type.toLowerCase().replace("_", " "),
        count: row._count.id,
        fill: FILE_TYPE_META[row.type]?.fill ?? "#6b7280",
    }));

    res.status(200).json({ success: true, message: "File source fetched successfully", data: endRes });
}


export const getCreditCount = async (req, res) => {
    const { user } = req

    try {
        const userCredits = await prisma.user.findUnique({
            where: {
                id: user?.id, // Ensure userId is an Int
            },
            select: {
                creditCount: true, // Only returns { creditCount: X }
            },
        });

        // Access the value
        const count = userCredits?.creditCount ?? 0;

        res.status(200).json({ success: true, message: "Credit count fetched successfully", data: count });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}