import pinataSDK from "@pinata/sdk";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const router = express.Router();

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataApiSecret = process.env.PINATA_API_SECRET;
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret);

async function storeTokenUriMetadata(metadata) {
    const options = {
        pinataMetadata: {
            name: metadata.name,
        },
    };
    try {
        const response = await pinata.pinJSONToIPFS(metadata, options);
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

router.post("/", async (req, res) => {
    try {
        const metadata = req.body;
        const response = await storeTokenUriMetadata(metadata);
        res.json(response);
    } catch (error) {
        console.error("Error storing Token URI metadata:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
