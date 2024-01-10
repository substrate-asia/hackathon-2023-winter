// Bad RPC server implementation, will be updated soon.

"use strict";

import Fastify from "fastify";
import { AIDot } from "./core.js";
import { clog, cerror } from "./utils.js";
import { Level } from "level";
import crypto from "crypto";
import cors from "@fastify/cors";
import { MessageQueue } from "./queue.js";
import { getCode } from "./snippet.js";
import { ethers } from "ethers";
import { verifyAuth } from "./auth.js";
import { plans } from "./plans.js"; 

const SHA256 = (message: string) => crypto.createHash("sha256").update(message).digest("hex");
const fastify = Fastify({
    // 10 MB message limit
    bodyLimit: 10485760
});

export interface RPCOptions {
    RPC_PORT: number;
    aiDotClient: AIDot;
}

export interface ReplyBody {
    success: boolean;
    payload: any;
    error: { message: string } | undefined;
}

export class RPC {
    public RPC_PORT: number;
    public aiDotClient: AIDot;
    public db: Level;
    public messageQueue: MessageQueue = new MessageQueue();

    constructor(options: RPCOptions) {
        this.RPC_PORT = options.RPC_PORT || 20297;
        this.aiDotClient = options.aiDotClient;
        this.db = this.aiDotClient.db;
    }

    async startServer() {
        await fastify.register(cors, { 
            origin: true
        })

        fastify.get("/", async (req, reply) => {
            reply.send("Beep boop beep boop!");
        });

        fastify.get("/:id", async (req, reply) => {
            const params: any = req.params;
            const id = params.id;

            reply.send(getCode(id));
        });

        fastify.post("/", async (req: any, reply: any) => {

            function throwError(message: string, status: number, payload: any = null) {
                reply.status(status);

                reply.send({
                    success: false,
                    payload: null,
                    error: { message }
                });
            }

            function respond(payload: any) {
                reply.send({
                    success: true,
                    payload
                })
            }

            if (typeof req.body !== "object" || typeof req.body.params !== "object" || typeof req.body.method !== "string") {
                throwError("Bad request form.", 400);

                return;
            }

            switch (req.body.method) {
                case "getAuthKey":
                    // Generate authkey
                    const authkey = crypto.randomBytes(32).toString("hex");

                    // Get authkey through username-password
                    if (typeof req.body.params.username === "string" && typeof req.body.params.password === "string") {
                        // Get user info and verify password
                        let userInfo;

                        try {
                            userInfo = JSON.parse(await this.db.get("USER_INFO" + req.body.params.username));
    
                            // Verify password
                            if (userInfo.passwordHash !== SHA256(req.body.params.password)) {
                                throwError("Incorrect password.", 400);
                                return;
                            }
                        } catch (e) {
                            throwError("Account does not exist.", 400);
                            return;
                        }
                        
                        // Store authkey info
                        await this.db.put("AUTHKEY" + authkey, JSON.stringify({
                            owner: req.body.params.username
                        }));
                        // Add authkey into user's authkey list
                        userInfo.authkeys.push(authkey);
                        await this.db.put("USER_INFO" + req.body.params.username, JSON.stringify(userInfo));

                        respond({ authkey });
                    }
                    // Get authkey through signature
                    else if (
                        typeof req.body.params.sig === "string" && 
                        typeof req.body.params.salt === "string" &&
                        typeof req.body.params.username === "string" // Username in this case is a blockchain address
                    ) {
                        // Check if salt has been used before
                        try {
                            await this.db.get("SALT" + req.body.params.username + req.body.params.salt);

                            throwError("Salt has already been used", 400);
                            return;
                        } catch (e) {}

                        // Verify sig
                        const hash = ethers.utils.solidityKeccak256(["string"], ["AIDOT_AUTH_MESSAGE" + req.body.params.salt]);
                        const sig = ethers.utils.splitSignature(req.body.params.sig);
                        const recoveredAddress = ethers.utils.recoverAddress(
                            ethers.utils.solidityKeccak256(["string", "bytes32"] , ["\x19Ethereum Signed Message:\n32", hash]),
                            sig
                        );

                        if (recoveredAddress !== req.body.params.username) {
                            throwError("Incorrect signature.", 400);
                            return;
                        }

                        // Get the user info
                        let userInfo;

                        try {
                            userInfo = JSON.parse(await this.db.get("USER_INFO" + req.body.params.username));
                        } catch (e) { // If user does not exist yet, create a new account
                            userInfo = {
                                passwordHash: "",
                                assistantList: [],
                                authkeys: []
                            }

                            await this.db.put("USER_INFO" + req.body.params.username, JSON.stringify(userInfo));
                        }

                        // Store authkey info
                        await this.db.put("AUTHKEY" + authkey, JSON.stringify({
                            owner: req.body.params.username
                        }));
                        // Add authkey into user's authkey list
                        userInfo.authkeys.push(authkey);
                        await this.db.put("USER_INFO" + req.body.params.username, JSON.stringify(userInfo));
                        // Store salt
                        await this.db.put("SALT" + req.body.params.username + req.body.params.salt, "");

                        respond({ authkey });
                    }
                    // Bad request form
                    else {
                        throwError("Bad request form.", 400);
                    }

                    break;

                case "register":
                    if (typeof req.body.params.username !== "string" || typeof req.body.params.password !== "string") { 
                        throwError("Bad request form.", 400);
                        return;
                    } else {
                        try {
                            await this.db.get("USER_INFO" + req.body.params.username);
                        } catch (e) {
                            await this.db.put("USER_INFO" + req.body.params.username, JSON.stringify({
                                passwordHash: SHA256(req.body.params.password),
                                assistantList: [],
                                authkeys: []
                            }));

                            clog(`New account created: ${req.body.params.username}`);

                            respond(null);

                            return;
                        }

                        throwError("Username already exists.", 400);
                    }

                    break;

                case "getSubscription":
                    let subscription = "free";
                    
                    try {
                        subscription = await this.db.get("SUBSCRIPTION" + req.body.params.username); 
                    } catch (e) {}

                    respond({ subscription });

                    break;
                
                case "createChatBot":
                    {
                        // Authentication
                        let userInfo;

                        const authResult = await verifyAuth({
                            username: req.body.params.username,
                            password: req.body.params.password,
                            authkey: req.body.params.authkey
                        }, this.db);

                        if (authResult.error) {
                            throwError(authResult.message, 400);        
                            return;
                        }

                        userInfo = authResult.message;

                        // Main process
                        try {
                            // Check 
                            let subscription = "free";
                            try {
                                subscription = await this.db.get("SUBSCRIPTION" + req.body.params.username); 
                            } catch (e) {}

                            // Admin can bypass anything
                            if (req.body.params.username !== this.aiDotClient.adminUsername && userInfo.assistantList.length >= plans[subscription].botLimit) {
                                throwError("Bot limit exceeded.", 400);
                                return;
                            }

                            // Create a new openai assistant for user
                            const assistant = await this.aiDotClient.createAssistant(
                                req.body.params.instructions,
                                req.body.params.name,
                                req.body.params.extraFileIds
                            );

                            // Store the assistant ID into DB
                            userInfo.assistantList.push(assistant.id);
                            await this.db.put("USER_INFO" + req.body.params.username, JSON.stringify(userInfo));

                            // Store the recommendations
                            await this.db.put("RECOMMENDATIONS" + assistant.id, JSON.stringify(req.body.params.recommendations || []));

                            // Store the current usage
                            await this.db.put("USAGE" + assistant.id, "0");

                            // Store the usage limit of paid plans
                            if (subscription === "advanced") {
                                await this.db.put("USAGE_LIMIT" + assistant.id, "15000");
                            }

                            clog(`New chat bot created: ${assistant.id}`);

                            respond({ botInfo: assistant });
                        } catch (e) {
                            if (this.aiDotClient.debugMode) console.log(e);

                            throwError("An unexpected error occurred when creating a new chat bot.", 400);
                            return;
                        }
                    }

                    break;
                
                case "listChatBots":
                    {
                        // Authentication
                        let userInfo;

                        const authResult = await verifyAuth({
                            username: req.body.params.username,
                            password: req.body.params.password,
                            authkey: req.body.params.authkey
                        }, this.db);

                        if (authResult.error) {
                            throwError(authResult.message, 400);        
                            return;
                        }

                        userInfo = authResult.message;

                        respond({ chatBots: userInfo.assistantList });
                    }

                    break;
                
                case "getChatBotInfo":
                    try {
                        // Retrieve assistant info
                        const assistant = await this.aiDotClient.getAssistantInfo(req.body.params.assistantID);

                        // Get the recommendations
                        const recommendations = JSON.parse(await this.db.get("RECOMMENDATIONS" + assistant.id));

                        // Get the current usage
                        const usage = parseInt(await this.db.get("USAGE" + assistant.id));

                        // Get the usage limit, usage limit only exists on paid bots, default is 150 for every free account
                        let limit = 150;
                        try {
                            limit = parseInt(await this.db.get("USAGE_LIMIT" + assistant.id));
                        } catch (e) {}

                        respond({ botInfo: assistant, recommendations, usage, limit });
                    } catch (e) {
                        if (this.aiDotClient.debugMode) console.log(e);

                        throwError("An unexpected error occurred when retrieving chat bot info.", 400);
                        return;
                    }

                    break;

                case "deleteChatBot":
                    {
                        // Authentication
                        let userInfo;

                        const authResult = await verifyAuth({
                            username: req.body.params.username,
                            password: req.body.params.password,
                            authkey: req.body.params.authkey
                        }, this.db);

                        if (authResult.error) {
                            throwError(authResult.message, 400);        
                            return;
                        }

                        userInfo = authResult.message;

                        // Main process
                        
                        // Admin bot can not be deleted
                        try {
                            const initialBotId = JSON.parse(await this.db.get("INITIAL_BOT")).id;

                            if (initialBotId === req.body.params.assistantID) {
                                throwError("Admin bot can not be deleted.", 400);
                                return;
                            }
                        } catch (e) {
                            throwError("An unexpected error occurred when verifying bot ID.", 400);
                            return;   
                        }

                        try {
                            // Delete openai assistant
                            const assistant = await this.aiDotClient.deleteAssistant(req.body.params.assistantID);

                            // Remove the assistant ID from DB
                            userInfo.assistantList = userInfo.assistantList.filter((assistantID: string) => assistantID !== req.body.params.assistantID);
                            await this.db.put("USER_INFO" + req.body.params.username, JSON.stringify(userInfo));

                            // Remove the recommendations
                            await this.db.del("RECOMMENDATIONS" + assistant.id);

                            // Remove the usage
                            await this.db.del("USAGE" + assistant.id);

                            clog(`Chat bot deleted: ${assistant.id}`);

                            respond({ botInfo: assistant });
                        } catch (e) {
                            if (this.aiDotClient.debugMode) console.log(e);

                            throwError("An unexpected error occurred when deleting the chat bot.", 400);
                            return;
                        }
                    }
                
                    break;

                case "modifyChatBot":
                    {
                        // Authentication
                        let userInfo;

                        const authResult = await verifyAuth({
                            username: req.body.params.username,
                            password: req.body.params.password,
                            authkey: req.body.params.authkey
                        }, this.db);

                        if (authResult.error) {
                            throwError(authResult.message, 400);        
                            return;
                        }

                        userInfo = authResult.message;

                        // Main process
                        try {
                            // Modify openai assistant
                            const assistant = await this.aiDotClient.modifyAssistant(req.body.params.assistantID, {
                                name: req.body.params.name,
                                instructions: req.body.params.instructions,
                                fileIds: req.body.params.fileIds
                            });

                            // Modify the recommendations
                            if (Array.isArray(req.body.params.recommendations)) {
                                await this.db.put("RECOMMENDATIONS" + assistant.id, JSON.stringify(req.body.params.recommendations));
                            }

                            clog(`Chat bot modified: ${assistant.id}`);

                            respond({ botInfo: assistant });
                        } catch (e) {
                            if (this.aiDotClient.debugMode) console.log(e);

                            throwError("An unexpected error occurred when modifying the chat bot.", 400);
                            return;
                        }
                    }

                    break;
                
                case "purchasePack":
                    if (req.body.params.paywith === "aca" || req.body.params.paywith === "glmr") {
                        let txReceipt;

                        // Check if payment is already used before
                        try {
                            await this.db.get("PAYMENT_HASH" + req.body.params.txHash);
                            throwError("Transaction hash is already used before to make another purchase.", 400);
                            return;
                        } catch (e) {}

                        // Get the user's payment receipt
                        try {
                            if (req.body.params.paywith === "aca") {
                                txReceipt = await this.aiDotClient.acalaProvider.getTransaction(req.body.params.txHash);
                            } else {
                                txReceipt = await this.aiDotClient.mbeamProvider.getTransaction(req.body.params.txHash);
                            }
                        } catch (e) {
                            if (this.aiDotClient.debugMode) console.log(e);

                            throwError("Can not find payment.", 400);
                            return;
                        }

                        // Check if the receiver is us
                        if (txReceipt.to !== this.aiDotClient.receiverAddress) {
                            throwError("Payment is made but not to us.", 400);
                            return;
                        }

                        // Get payer's bot list
                        let assistantList = [];
                        try {
                            const userInfo = JSON.parse(await this.db.get("USER_INFO" + req.body.params.username));
                            assistantList = userInfo.assistantList;
                        } catch (e) {
                            throwError("Can not get payer's account.", 400);
                            return;    
                        }

                        /*if (txReceipt.value.toBigInt() >= ethers.utils.parseEther("100").toBigInt()) {

                        } else */ 
                        
                        if (txReceipt.value.toBigInt() >= ethers.utils.parseEther("1").toBigInt()) {
                            try {
                                // Update usage limits for each bot
                                for (const assistantID of assistantList) {
                                    await this.db.put("USAGE_LIMIT" + assistantID, "15000");
                                }
                                // Store the payment hash so it can not be reused again
                                await this.db.put("PAYMENT_HASH" + req.body.params.txHash, "");
                                // Store the user's subscription details
                                await this.db.put("SUBSCRIPTION" + req.body.params.username, "advanced");
                                // Store the expiration date (1 month)
                                await this.db.put("EXPIRATION" + req.body.params.username, (Date.now() + 2592000000).toString());

                                respond(null);
                            } catch (e) {
                                if (this.aiDotClient.debugMode) console.log(e);

                                throwError("An unexpected error occurred when updating usage limit.", 400);
                                return;
                            }
                        } else {
                            throwError("Invalid purchasing option.", 400);
                            return;
                        }
                    } else {
                        throwError("Invalid payment method.", 400);
                        return;
                    }

                    break;
                

                /*//////////////////////////////////////////////////////////////
                                              Files
                //////////////////////////////////////////////////////////////*/
                
                case "uploadFile":
                    {
                        // Authentication
                        let userInfo;

                        const authResult = await verifyAuth({
                            username: req.body.params.username,
                            password: req.body.params.password,
                            authkey: req.body.params.authkey
                        }, this.db);

                        if (authResult.error) {
                            throwError(authResult.message, 400);        
                            return;
                        }

                        userInfo = authResult.message;

                        // Main process
                        try {
                            const uploadInfo = await this.aiDotClient.uploadFile(
                                {
                                    flag: req.body.params.flag,
                                    content: req.body.params.content,
                                },
                                "." + req.body.params.format || ".txt"
                            );

                            if (uploadInfo.fileKeyCreated !== "") {
                                await this.db.put(
                                    "FILE_FORMAT" + req.body.params.username + uploadInfo.fileKeyCreated,
                                    "." + req.body.params.format || ".txt"
                                );
                            }

                            clog(`New file created with ID "${uploadInfo.idCreated}" and file key "${uploadInfo.fileKeyCreated}"`);

                            respond(uploadInfo);
                        } catch (e) {
                            if (this.aiDotClient.debugMode) console.log(e);

                            throwError("An unexpected error occurred when uploading the file.", 400);
                            return;
                        }
                    }

                    break;

                case "streamAdd":
                    {
                        // Authentication
                        let userInfo;

                        const authResult = await verifyAuth({
                            username: req.body.params.username,
                            password: req.body.params.password,
                            authkey: req.body.params.authkey
                        }, this.db);

                        if (authResult.error) {
                            throwError(authResult.message, 400);        
                            return;
                        }

                        userInfo = authResult.message;

                        // Verify if account has permission to edit this file and get file format in the mean time
                        let fileFormat: string;

                        try {
                            fileFormat = await this.db.get("FILE_FORMAT" + req.body.params.username + req.body.params.fileKey);
                        } catch (e) {
                            throwError("Account does not have permission to edit file with given file key.", 400);
                            return;
                        }

                        // Main process
                        try {
                            // Add chunk to file
                            this.aiDotClient.streamAdd(req.body.params.fileKey, req.body.params.chunk, fileFormat);

                            respond(null);
                        } catch (e) {
                            if (this.aiDotClient.debugMode) console.log(e);

                            throwError("An unexpected error occurred when adding data to file.", 400);
                            return;
                        }
                    }

                    break;
                
                case "streamFinish":
                    {
                        // Authentication
                        let userInfo;

                        const authResult = await verifyAuth({
                            username: req.body.params.username,
                            password: req.body.params.password,
                            authkey: req.body.params.authkey
                        }, this.db);

                        if (authResult.error) {
                            throwError(authResult.message, 400);        
                            return;
                        }

                        userInfo = authResult.message;

                        // Verify if account has permission to edit this file and get file format in the mean time
                        let fileFormat: string;

                        try {
                            fileFormat = await this.db.get("FILE_FORMAT" + req.body.params.username + req.body.params.fileKey);
                        } catch (e) {
                            throwError("Account does not have permission to edit file with given file key.", 400);
                            return;
                        }

                        // Main process
                        try {
                            // Upload file to openai
                            const file = await this.aiDotClient.streamFinish(req.body.params.fileKey, fileFormat);

                            // Remove file key permission
                            await this.db.del("FILE_FORMAT" + req.body.params.username + req.body.params.fileKey);

                            clog(`New file uploaded with ID "${file.id}"`);
                            
                            respond({ file });
                        } catch (e) {
                            if (this.aiDotClient.debugMode) console.log(e);

                            throwError("An unexpected error occurred when uploading file to openai.", 400);
                            return;
                        }
                    }

                    break;
                
                case "getFileInfo":
                    {
                        // Authentication
                        let userInfo;

                        const authResult = await verifyAuth({
                            username: req.body.params.username,
                            password: req.body.params.password,
                            authkey: req.body.params.authkey
                        }, this.db);

                        if (authResult.error) {
                            throwError(authResult.message, 400);        
                            return;
                        }

                        userInfo = authResult.message;

                        // Main process
                        try {
                            // Retrieving file info
                            const file = await this.aiDotClient.getFileInfo(req.body.params.fileId);

                            clog(`A file retrieved with ID "${file.id}"`);
                            
                            respond({ file });
                        } catch (e) {
                            if (this.aiDotClient.debugMode) console.log(e);

                            throwError("An unexpected error occurred when retrieving file from openai.", 400);
                            return;
                        }
                    }

                    break;


                /*//////////////////////////////////////////////////////////////
                                            Messages
                //////////////////////////////////////////////////////////////*/

                case "createChatThread":
                    try {
                        // Create a new thread for user
                        const thread = await this.aiDotClient.createThread();

                        clog(`New chat thread created: ${thread.id}`);

                        respond({ thread });
                    } catch (e) {
                        if (this.aiDotClient.debugMode) console.log(e);

                        throwError("An unexpected error occurred when creating a new thread.", 400);
                        return;
                    }

                    break;

                case "sendMessage":            
                    try {
                        await new Promise((resolve, reject) => {
                            const queueCallback = async () => {
                                // Get usage
                                const usage = parseInt(await this.db.get("USAGE" + req.body.params.assistantID));
                                // Get the usage limit, usage limit only exists on paid bots, default is 150 for every free account
                                let usageLimit = 150;
                                try {
                                    usageLimit = parseInt(await this.db.get("USAGE_LIMIT" + req.body.params.assistantID));
                                } catch (e) {} 

                                if (usage > usageLimit && req.body.params.assistantID !== this.aiDotClient.initialBotId) {
                                    throwError("Response limit exceeded.", 400);
                                    return;
                                }
    
                                // Create a message
                                const message = await this.aiDotClient.createMessage(
                                    req.body.params.threadID,
                                    req.body.params.question
                                );
    
                                // Let the assistant reply to the message
                                const run = await this.aiDotClient.runThread(
                                    req.body.params.threadID,
                                    req.body.params.assistantID
                                );
    
                                // Update usage
                                await this.db.put("USAGE" + req.body.params.assistantID, (usage + 1).toString());
    
                                respond({ message, run });

                                resolve(null);
                            }
    
                            this.messageQueue.add(queueCallback);
                        });
                    } catch (e) {
                        if (this.aiDotClient.debugMode) console.log(e);

                        throwError("An unexpected error occurred when sending message.", 400);
                        return;
                    }

                    break;
                
                case "getMessages":
                    let onlyNew = true, limit = 1;
                
                    if (typeof req.body.params.onlyNew === "boolean") {
                        onlyNew = req.body.params.onlyNew;
                    }

                    if (typeof req.body.params.limit === "number") {
                        limit = req.body.params.limit;
                    }

                    try {
                        // Get 20 latest messages
                        const messages = await this.aiDotClient.getMessages(
                            req.body.params.threadID, 
                            req.body.params.assistantID,
                            onlyNew,
                            limit
                        );

                        respond({ messages });
                    } catch (e) {
                        if (this.aiDotClient.debugMode) console.log(e);

                        throwError("An unexpected error occurred when creating a new thread.", 400);
                        return;
                    }

                    break;


                case "getInitialBotId":
                    try {
                        respond({ id: JSON.parse(await this.db.get("INITIAL_BOT")).id });
                    } catch (e) {
                        if (this.aiDotClient.debugMode) console.log(e);

                        throwError("An unexpected error occurred when getting initial bot ID.", 400);
                    }
                    
                    break;

                /*
                case "getMessageHistory":
                    break;*/
                
                /*
                case "listChatThreads":
                    if (typeof req.body.params.username !== "string" || typeof req.body.params.password !== "string") { 
                        throwError("Bad request form.", 400);

                        return;
                    } else {
                        try {
                            const userInfo = JSON.parse(await this.db.get("USER_INFO" + req.body.params.username));

                            // Verify password
                            if (userInfo.passwordHash !== SHA256(req.body.params.password)) {
                                throwError("Incorrect password.", 400);
    
                                return;
                            }

                            respond({ threads: userInfo.threadList });
                        } catch (e) {
                            throwError("Unexpected error while getting user's chat threads", 400);
                        }
                    }

                    break;*/

                default:
                    throwError("Invalid method.", 404);
            }
        });

        fastify.listen(this.RPC_PORT, "0.0.0.0", (err, address) => {
            if (err) {
                cerror(`Error at RPC server: Fastify: ` + err);
                process.exit(1);
            }
    
            clog(`AIDot RPC server listening at address ${address}`);
        });

        /*
        try {
            await fastify.listen(this.RPC_PORT, "0.0.0.0");
            clog(`AIDot RPC server listening on PORT ${this.RPC_PORT}`);
        } catch (err) {
            cerror(`Error at RPC server: Fastify: ` + err);
            process.exit(1);
        }*/
    }
}
