export const config = {
    resourceFiles: [
        // "./resources/Polkadot-whitepaper.pdf",
        "./resources/basic.md",
        "./resources/general.md",
        "./resources/learn.md",
        "./resources/build.md",
        "./resources/maintain.md",
        "./resources/acala.md",
        "./resources/gear.md"
    ],
    rpcOptions: {
        RPC_PORT: 20297
    },
    acalaRpcUrl: "https://eth-rpc-tc9.aca-staging.network",
    mbeamRpcUrl: "https://rpc.api.moonbase.moonbeam.network",
    dbPath: "./db",
    dataPath: "./data",
    adminUsername: "parity",
    adminPassword: "parity123456",
    webUrl: "http://localhost:5173",
    receiverAddress: "0x029B93211e7793759534452BDB1A74b58De22C9c",
    debugMode: false
}
