import cloudinary from "./cloudinary.config.js";


export const uploadFile = async (file, options = {}) => {
    return await cloudinary.uploader.upload(file, {
        resource_type: "video", // 🔥 THIS FIXES IT
        ...options,
    });
};
