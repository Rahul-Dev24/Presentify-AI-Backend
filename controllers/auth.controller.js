import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma.js"

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
    const { email, password, fName, lName } = req?.body;

    if (!fName) {
        return res.status(400).json({ success: false, message: "First name is required" });
    }

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser)
        return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    let dbObj = {
        fName,
        email,
        password: hashedPassword
    };

    if (lName)
        dbObj['lName'] = lName;

    const user = await prisma.user.create({
        data: dbObj
    });

    res.json({ success: true, message: "User registered successfully", userId: user.id });
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user)
            return res.status(401).json({ success: false, message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ success: false, message: "Invalid Password" });

        const username = `${user.fName} ${user.lName}`;

        const token = jwt.sign(
            { id: user.id, email: user.email, username },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true ONLY in HTTPS
            sameSite: "lax",
            path: "/",               // 🔥 IMPORTANT
            maxAge: 60 * 60 * 1000,
        });

        res.json({ success: true, message: "Login successful", token });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
