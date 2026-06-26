import { prisma } from "../utils/prisma.js";
export const getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id,
            },
            select: {
                id: true,
                fName: true,
                lName: true,
                email: true,
            },
        });

        if (!user) {
            return res.status(404).json({
                authenticated: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            authenticated: true,
            success: true,
            user: {
                id: user.id,
                username: `${user.fName} ${user.lName}`,
                email: user.email
            },
        });
    } catch (err) {
        return res.status(500).json({
            authenticated: false,
            message: err.message,
            success: false,
        });
    }
};



export const logout = (req, res) => {
    // res.clearCookie("token", {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "none",
    //     path: "/",
    // });

    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        path: "/",
    });

    res.json({
        success: true,
    });
};