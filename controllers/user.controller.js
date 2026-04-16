import { use } from "react";
import { prisma } from "../utils/prisma.js";

export async function updateUser(req, res) {
    const user = req.user;
    const { fName, lName, email } = req.body;
    if (!fName || !email) return res.status(400).json({ success: false, message: "userName and email are required" });

    try {
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                fName,
                lName: lName || '',
                email
            }
        });
        res.status(200).json({ success: true, message: "User updated successfully", data: updatedUser });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}


export const userData = async (req, res) => {
    const user = req.user;
    if (!user) return res.status(400).json({ success: false, message: "User is required" });
    try {
        const userData = await prisma.user.findUnique({
            where: { id: user.id }
        });
        res.status(200).json({ success: true, message: "User data fetched successfully", data: userData });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}