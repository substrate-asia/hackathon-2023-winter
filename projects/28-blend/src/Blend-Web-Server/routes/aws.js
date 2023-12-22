import express from "express";
import AWS from "aws-sdk";
import multer from "multer";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const router = express.Router();

const upload = multer();

async function uploadImageToS3(imageFile) {
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_ID_KEY,
        secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
        region: "ap-southeast-1",
    });
    const s3 = new AWS.S3();
    const params = {
        Bucket: "upload-selfie-image",
        Key: imageFile.fieldname,
        Body: imageFile.buffer,
    };

    try {
        const data = await s3.upload(params).promise();
        return { imageURL: data.Location };
    } catch (error) {
        console.error("Error uploading image to S3:", error);
        return { error: `Error uploading image to S3 ${error}` };
    }
}

export async function sendImageToFlask(imageFile) {
    const formData = new FormData();
    // Create a Blob from the Buffer
    const fileBlob = new Blob([imageFile.buffer], {
        type: imageFile.mimetype,
    });

    // Append the Blob to the FormData
    formData.append("imageFile", fileBlob, imageFile.originalname);

    //   const flaskEndpoint = "http://18.141.247.246:3200/import.meta-image";
    const flaskEndpoint = "http://18.141.247.246:3200/process-image";
    try {
        const response = await axios.post(flaskEndpoint, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error sending image to Flask server:", error);
        return { error: `Error sending image to Flask server: ${error}` };
    }
}

router.post("/upload", upload.single("image"), async (req, res) => {
    try {
        const imageFile = req.file;
        const result = await uploadImageToS3(imageFile);
        res.json(result);
    } catch (error) {
        console.error("Error handling image upload:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/send", upload.single("image"), async (req, res) => {
    try {
        const imageFile = req.file;
        console.log(imageFile);
        const result = await sendImageToFlask(imageFile);
        res.json(result);
    } catch (error) {
        console.error("Error handling image upload and forwarding:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
