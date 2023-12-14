import * as fs from "fs";

interface Providers {
    providers: Provider[];
}

interface Provider {
    name: string;
    basePort: number;
    http: string;
    ws: string;
}

type providerType = "http" | "ws";

const loadNetworkProviders = (): Providers => {
    try {
        const rawJSON = fs.readFileSync("./data/providers.json", "utf-8");
        const json = JSON.parse(rawJSON);

        return json;
    } catch (error) {
        return { providers: [] };
    }
};

/**
 * Retrieves the url for the desired type of connection to the running substrate network.
 * @param {string} binary - The binary which is run for the network.
 * @param {providerType} type - The desired connection type.
 * @returns {string} The url of the desired connection type.
 * @example
 * getNetworkProvider("frame", "ws");
 *
 * // Returns ws://127.0.0.1:9944
 * // Notice: If the frame network is the first one to be run by svarog
 */
const getNetworkProvider = (
    binary: string,
    type: providerType
): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        const providers: Providers = loadNetworkProviders();

        const provider: Provider | undefined = providers.providers.find(
            (provider) => provider.name === binary
        );

        if (provider) {
            if (type === "http") {
                resolve(provider.http);
            } else {
                resolve(provider.ws);
            }
        }

        if (providers.providers.length === 0) {
            reject("No networks are currently running");
        } else {
            const availableProviders: string[] = providers.providers.map(
                (provider) => provider.name
            );

            reject(
                `No such provider exists. Available providers: ${availableProviders.join(
                    ", "
                )}`
            );
        }
    });
};

export { getNetworkProvider };
