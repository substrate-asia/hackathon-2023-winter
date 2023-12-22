import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import awsRoutes from "./routes/aws.js";
import pinataRoutes from "./routes/pinata.js";
import polkadotRoutes from "./routes/polkadot.js"

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    next();
});
app.use(cors());

app.use("/aws", awsRoutes);
app.use("/pinata", pinataRoutes);
app.use("/transfer", polkadotRoutes);

app.get("/", (req, res) => res.send("App is running"));

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port ${process.env.PORT || "3000"}`);
});
