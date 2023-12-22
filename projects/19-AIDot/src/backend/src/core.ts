import OpenAI from "openai";
import { Level } from "level";
import fs from "fs";
import { clog, cerror } from "./utils.js";
import { RPC, RPCOptions } from "./rpc.js";
import crypto from "crypto";

const SHA256 = (message: string) => crypto.createHash("sha256").update(message).digest("hex");

export interface AIDotOptions {
    resourceFiles: string[];
    rpcOptions: RPCOptions;
    dbPath: string;
    dataPath: string;
    adminUsername: string;
    adminPassword: string;
}

export interface AIDotFile {
    flag: string;
    content?: string;
}

export interface AIDotBotModification {
    name?: string;
    instructions?: string;
    fileIds?: string[];
}

export class AIDot {
    public openai: OpenAI;
    public resourceFiles: string[] = [];
    public rpcOptions: RPCOptions;
    public db: Level;
    public dataPath: string;
    public adminUsername: string;
    public adminPassword: string;
    public initialBotId: string = "";

    constructor(options: AIDotOptions) {
        // Initiate an OpenAI instance
        this.openai = new OpenAI({
            apiKey: process.env["OPENAI_API_KEY"]
        });

        this.resourceFiles = options.resourceFiles;
        this.rpcOptions = options.rpcOptions;
        this.db = new Level(options.dbPath || "./db");
        this.dataPath = options.dataPath || "./data";
        this.adminUsername = options.adminUsername;
        this.adminPassword = options.adminPassword;
    }
    
    async startAI() {
        // Error logger
        process.on("uncaughtException", err => console.log(`\x1b[31mERROR\x1b[0m [${(new Date()).toISOString()}] Uncaught Exception`, err));

        // Create initial bot and admin account
        // If an initial bot does not exist, generate a new one
        // If admin account does not exist, create admin account
        try {
            this.initialBotId = JSON.parse(await this.db.get("INITIAL_BOT")).id;
            await this.db.get("USER_INFO" + this.adminUsername);
        } catch (e) {
            clog("Creating initial bot and admin account...");

            // Create bot on OpenAI
            const bot = await this.createAssistant("", "", []);

            await this.db.put("INITIAL_BOT", JSON.stringify(bot));
            await this.db.put("USER_INFO" + this.adminUsername, JSON.stringify({
                passwordHash: SHA256(this.adminPassword),
                assistantList: [ bot.id ]
            }));

            // Store the recommendations
            await this.db.put("RECOMMENDATIONS" + bot.id, "[]");

            // Store the current usage
            await this.db.put("USAGE" + bot.id, "0");

            this.initialBotId = bot.id;
        }

        // Start RPC server
        const rpc = new RPC({ ...this.rpcOptions, aiDotClient: this });
        
        await rpc.startServer();
    }

    
    /*//////////////////////////////////////////////////////////////
                               Assistants
    //////////////////////////////////////////////////////////////*/

    async createAssistant(instructions: string, name: string, extraFileIds: string[]): Promise<OpenAI.Beta.Assistants.Assistant> {
        // Create initial resources for assistant
        const fileIds: string[] = [];

        for (const filePath of this.resourceFiles) {
            const openAIFile = await this.openai.files.create({
                file: fs.createReadStream(filePath),
                purpose: "assistants",
            });

            fileIds.push(openAIFile.id);
        }

        // Create assistant instance
        const assistant = await this.openai.beta.assistants.create({
            instructions: instructions || "You are a Polkadot blockchain technical support bot. You help answer technical questions. Avoid unrelated questions but be open about it.",
            name: name || "AIDot",
            model: "gpt-3.5-turbo-1106",
            tools: [{"type": "retrieval"}],
            file_ids: [ ...fileIds, ...(extraFileIds || []) ]
        });

        return assistant;
    }

    async getAssistantInfo(assistantID: string): Promise<OpenAI.Beta.Assistants.Assistant> {
        const myAssistant = await this.openai.beta.assistants.retrieve(assistantID);

        return myAssistant;
    }

    async deleteAssistant(assistantID: string): Promise<OpenAI.Beta.Assistants.AssistantDeleted> {
        const response = await this.openai.beta.assistants.del(assistantID);

        return response;
    }

    async modifyAssistant(assistantID: string, options: AIDotBotModification): Promise<OpenAI.Beta.Assistants.Assistant> {
        const myUpdatedAssistant = await this.openai.beta.assistants.update(
            assistantID,
            {
                name: options.name,
                instructions: options.instructions,
                file_ids: options.fileIds
            }
        );

        return myUpdatedAssistant;
    }


    /*//////////////////////////////////////////////////////////////
                                  Files
    //////////////////////////////////////////////////////////////*/

    async uploadFile(fileObj: AIDotFile, format: string = ".txt"): Promise<{ idCreated: string, fileKeyCreated: string }> {        
        const randomFilename = crypto.randomBytes(20).toString("hex");
        
        if (fileObj.flag === "simple" && typeof fileObj.content === "string") {
            fs.writeFileSync(`${this.dataPath}/` + randomFilename + format, fileObj.content);

            const openAIFile = await this.openai.files.create({
                file: fs.createReadStream(`${this.dataPath}/` + randomFilename + format),
                purpose: "assistants",
            });

            fs.unlinkSync(`${this.dataPath}/` + randomFilename + format);

            return { idCreated: openAIFile.id, fileKeyCreated: "" };
        } else if (fileObj.flag === "stream") {
            fs.writeFileSync(`${this.dataPath}/` + randomFilename + format, "");

            return { idCreated: "", fileKeyCreated: randomFilename};
        } else {
            throw new Error("Invalid flag submitted.");
        }
    }

    streamAdd(fileKey: string, chunk: string, format: string = ".txt") {
        const finalChunk = chunk.slice(0, 2) === "0x" ? Buffer.from(chunk.slice(2), "hex") : Buffer.from(chunk);

        fs.appendFileSync(`${this.dataPath}/` + fileKey + format, finalChunk);
    }

    async streamFinish(fileKey: string, format: string = ".txt"): Promise<OpenAI.Files.FileObject> {
        const openAIFile = await this.openai.files.create({
            file: fs.createReadStream(`${this.dataPath}/` + fileKey + format),
            purpose: "assistants",
        });

        fs.unlinkSync(`${this.dataPath}/` + fileKey + format);

        return openAIFile;
    }

    async getFileInfo(fileId: string): Promise<OpenAI.Files.FileObject> {
        const openAIFile = await this.openai.files.retrieve(fileId);

        return openAIFile;
    }


    /*//////////////////////////////////////////////////////////////
                                Messages
    //////////////////////////////////////////////////////////////*/

    async createThread(): Promise<OpenAI.Beta.Threads.Thread> {
        // Create thread instance
        const emptyThread = await this.openai.beta.threads.create();

        return emptyThread;
    }

    async createMessage(threadID: string, question: string): Promise<OpenAI.Beta.Threads.Messages.ThreadMessage> {
        // Create message instance
        const message = await this.openai.beta.threads.messages.create(
            threadID,
            { role: "user", content: question }
        );

        return message;
    }

    async runThread(threadID: string, assistantID: string): Promise<OpenAI.Beta.Threads.Runs.Run> {
        // Create run instance
        const run = await this.openai.beta.threads.runs.create(
            threadID,
            { assistant_id: assistantID }
        );

        return run;
    }

    async getMessages(threadID: string, assistantID: string, onlyNew: boolean = true, limit: number = 1): Promise<OpenAI.Beta.Threads.Messages.ThreadMessage[]> {
        const threadMessages = await this.openai.beta.threads.messages.list(threadID, {
            limit
        });

        const messagesFromAssistant: OpenAI.Beta.Threads.Messages.ThreadMessage[] = [];

        for (const messageObj of threadMessages.data) {
            console.log(messageObj.content[0]);

            if (messageObj.assistant_id === assistantID) {
                messagesFromAssistant.push(messageObj);

                if (onlyNew) return messagesFromAssistant;
            }
        }

        return messagesFromAssistant;
    }
}
