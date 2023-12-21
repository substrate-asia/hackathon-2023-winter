#!/usr/bin/env node
import * as chalk from "chalk";
import * as fs from "fs";
import * as net from "net";
import { ChildProcess, exec, execSync, spawn } from "child_process";

const processes: ChildProcess[] = [];
let db: string = "";
let port = 0;
let rpc = 0;
let binary: string = "";

const admins: string[] = ["alice", "bob", "charlie"];
const chain: string = "local";
const execution: string = "native";

const svarog = async () => {
    const args: string[] = process.argv.slice(2);
    binary = args[0];

    if (args.length !== 1) {
        console.error(
            chalk["red"]("ERROR: ") + "Please provide the node binary name!"
        );
        process.exit(1);
    }

    if (!fs.existsSync("./runners")) {
        console.error(
            chalk["red"]("ERROR: ") +
                "Please ensure that you have the /runners directory!"
        );
        process.exit(1);
    }

    if (!fs.existsSync(`./runners/${binary}`)) {
        console.error(
            chalk["red"]("ERROR: ") +
                "Please ensure that given node binary exists in the /runners directory!"
        );
        process.exit(1);
    }

    if (!checkSvarogCapacity()) {
        console.error(
            chalk["red"]("ERROR: ") +
                "SVAROG can only host a maximum of 3 networks concurrently!"
        );
        process.exit(1);
    }

    try {
        const result = await checkPortAvailability();
        [port, rpc] = result;
    } catch (error) {
        console.error(chalk["red"]("ERROR: ") + ` ${error}`);
        process.exit(1);
    }

    purgeData();

    try {
        db = await getStorageID(binary);
    } catch (error) {
        console.error(chalk["red"]("ERROR: ") + `${error}`);
        process.exit(1);
    }

    if (fs.existsSync(`./data/${db}`)) {
        console.error(
            chalk["red"]("ERROR: ") +
                `An instance of the ${binary.toLocaleUpperCase()} network is already running!`
        );
        process.exit(1);
    }

    if (await hasWSPort(binary)) {
        await launchWSCompatibleNetwork(binary);
    } else {
        await launchRegularNetwork(binary);
    }
};

const checkPortAvailability = async (): Promise<number[]> => {
    let port: number = 10000;
    let rpc: number = 9943;
    let db: number = 0;

    while (true) {
        try {
            if (!(await tryConnection(port))) {
                return [port, rpc, db];
            }

            port += 300;
            rpc += 3;
            db += 1;
        } catch (error) {
            console.error(chalk["red"]("ERROR: ") + `${error}`);
        }
    }
};

const waitForNetworkStart = async (rpc: number) => {
    while (true) {
        try {
            if (await tryConnection(rpc)) {
                return;
            }
        } catch (error) {
            console.error(chalk["red"]("ERROR: ") + `${error}`);
        }
    }
};

const tryConnection = (port: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const client = net.createConnection({
            host: "localhost",
            port: port,
        });

        client.once("connect", () => {
            client.end();
            resolve(true);
        });

        client.once("error", (error: any) => {
            if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
                resolve(false);
            } else {
                killProcess();
                reject(error);
            }
        });
    });
};

const checkSvarogCapacity = (): boolean => {
    try {
        const files = fs.readdirSync("./data");

        return files.length === 4 ? false : true;
    } catch (error) {
        return true;
    }
};

const killProcess = async () => {
    deleteProviderInfo();
    clearData();

    processes.forEach((process) => {
        process.kill();
    });
};

const clearData = () => {
    execSync(`rm -rf ./data/${db}`);

    try {
        const files = fs.readdirSync("./data");

        if (files.length === 1) {
            execSync("rm -rf ./data");
        }
    } catch (e) {
        execSync("rm -rf ./data");
    }
};

const getStorageID = (binary: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const childProcess = spawn(`./runners/${binary}`, ["build-spec"]);

        let output = "";

        childProcess.stdout.on("data", (data) => {
            output += data.toString();
        });

        childProcess.on("close", (code) => {
            if (code === 0) {
                const json = JSON.parse(output.trim());

                resolve(json["id"]);
            } else {
                reject(new Error(`Error while building chain specs (${code})`));
            }
        });

        childProcess.on("error", (error) => {
            reject(error);
        });
    });
};

const hasWSPort = async (binary: string): Promise<boolean> => {
    let result: boolean = false;

    exec(`./runners/${binary} --ws-port`, (error, stdout, stderr) => {
        if (stderr.includes("required")) {
            result = true;
        } else {
            result = false;
        }
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return result;
};

const launchWSCompatibleNetwork = async (binary: string) => {
    let ws = rpc;
    rpc = ws + 10;

    for (let admin of admins) {
        const command = `./runners/${binary} --${admin} -d ./data/${db}/${admin} --port ${port} --rpc-port ${rpc} --ws-port ${ws} --chain ${chain} --execution ${execution} &`;

        processes.push(exec(command));

        console.log(
            chalk["green"]("STARTED: ") +
                `${binary.toLocaleUpperCase()} network node (${admin}) PORT: ${port} RPC-PORT: ${rpc} WS-PORT: ${ws}`
        );

        port += 100;
        ws++;
        rpc++;
    }

    saveProviderInfo(ws);

    console.log(
        chalk["yellow"]("NOTICE: ") +
            "To stop the network use the CTRL + C command"
    );

    const lastRPCPort = rpc - 1;

    try {
        await waitForNetworkStart(lastRPCPort);
    } catch (error) {
        console.error(chalk["red"]("ERROR: ") + `${error}`);
        killProcess();
        process.exit(1);
    }

    console.log(
        chalk["magenta"]("RUNNING: ") + `${binary.toLocaleUpperCase()} Network`
    );
};

const launchRegularNetwork = async (binary: string) => {
    for (let admin of admins) {
        const command = `./runners/${binary} --${admin} -d ./data/${db}/${admin} --port ${port} --rpc-port ${rpc} --chain ${chain} --execution ${execution} &`;

        processes.push(exec(command));

        console.log(
            chalk["green"]("STARTED: ") +
                `${binary.toLocaleUpperCase()} network node (${admin}) PORT: ${port} RPC-PORT: ${rpc}`
        );

        port += 100;
        rpc++;
    }

    console.log(
        chalk["yellow"]("NOTICE: ") +
            "To stop the network use the CTRL + C command"
    );

    const lastRPCPort = rpc - 1;

    try {
        await waitForNetworkStart(lastRPCPort);
    } catch (error) {
        console.error(chalk["red"]("ERROR: ") + `${error}`);
        killProcess();
        process.exit(1);
    }

    saveProviderInfo(rpc);

    console.log(
        chalk["magenta"]("RUNNING: ") + `${binary.toLocaleUpperCase()} Network`
    );
};

const getProviderInfo = (): Providers => {
    try {
        const rawJSON = fs.readFileSync("./data/providers.json", "utf-8");
        const json = JSON.parse(rawJSON);

        return json;
    } catch (error) {
        return { providers: [] };
    }
};

const saveProviderInfo = (port: number) => {
    const providerInfo: Providers = getProviderInfo();
    const basePort = port - 2;

    providerInfo.providers.push({
        name: binary,
        basePort: basePort,
        http: `http://127.0.0.1:${basePort}`,
        ws: `ws://127.0.0.1:${basePort}`,
    });

    createDataFolder();

    fs.writeFileSync(
        "./data/providers.json",
        JSON.stringify(providerInfo),
        "utf-8"
    );
};

const deleteProviderInfo = () => {
    let providerInfo = getProviderInfo();
    providerInfo.providers = providerInfo.providers.filter(
        (provider) => provider.name != binary
    );

    fs.writeFileSync(
        "./data/providers.json",
        JSON.stringify(providerInfo),
        "utf-8"
    );
};

const createDataFolder = () => {
    if (!fs.existsSync("./data")) fs.mkdirSync("./data");
};

const purgeData = () => {
    if (!checkRunningNodes()) {
        execSync("rm -rf ./data");
    }
};

const checkRunningNodes = (): boolean => {
    let nodesRunning: boolean = false;

    for (let port = 9942; port <= 9952; port++) {
        try {
            execSync(`lsof -i :${port}`);
            nodesRunning = true;
        } catch (e) {}
    }

    return nodesRunning;
};

interface Providers {
    providers: Provider[];
}

interface Provider {
    name: string;
    basePort: number;
    http: string;
    ws: string;
}

process.on("SIGINT", () => {
    killProcess();
});

process.on("SIGTERM", () => {
    killProcess();
});

svarog();
