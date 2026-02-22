const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// Function to upload an image to Cloudinary
const uploadtToCloudiinary = async(imageData, folder= 'employees') =>{
    try {
        const result = await cloudinary.uploader.upload(imageData, {
            folder,
            allowed_formats: ['jpg', 'jpeg', 'png'],
            transformation: [
                { width: 500, height: 500, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' }
            ]
        });
        return result;
    }
    catch (error) {
        throw new Error('Failed to upload image to Cloudinary: ' + error.message);
    }
}

// Delete image from Cloudinary
const deleteFromCloudinary = async(publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    }
    catch (error) {
        throw new Error('Failed to delete image from Cloudinary: ' + error.message);
    }
}

module.exports = {
    cloudinary,
    uploadtToCloudiinary,
    deleteFromCloudinary
}