# Project Demo

Since this repository is the main repository of the SVAROG npm package, we also provided a demo which utilizes the SVAROG developer framework. The afformentioned demo can be found on the following [link](https://github.com/Ceres-Blockchain-Solutions/svarog-test.git).

# Building the package

If you would like to build the main npm package files, you can do so by running the following commands:

```bash
$ npm install
$ npm build
```

# Intro

Svarog is a development framework that enables developers to run and query local substrate networks of their choosing.

# How to

## Project structure

To run a desired substrate network node first create a **/runners** directory in which you will store the binaries of the networks which you would like to instantiate.

### Notice

The naming of the binary is important as the name itself will be used to start the network and retrieve the network provider.

### Example

If a user wants to run a network that is based on the substrate frame node template he would place the properly named **frame** binary (the substrate frame node binary file) in the **/runners** directory.

## Running a network

After importing your desired library simply run the **npx svarog [binary]** command in your terminal (binary represents the name of your desired node binary).

### Notice

The terminal in which the affirmation command has been run must remain open for the network to keep running. If the terminal is closed the network will shut down.

By default, svarog will instantiate a network which consists of 3 nodes. Svarog can simultaneously run a maximum of 3 different substrate-based networks, as there can not be 2 identical networks running at the same time.

### Port allocation

By default, svarog will use ports 10000 -> 10800 (HTTP ports), 9944 -> 9952 (WS/RPC ports), and 9954 -> 9962 (RPC ports). Please make sure that these ports are available on your local machine to successfully utilize Svarog.

## Connecting to network

To connect to a svarog enabled network simply use the provided **_getNetworkProvider()_** function which will retrieve the desired network connection URL based on the binary name and desired type of connection.

### Example

Following the aforementioned example, if a user instantiates a frame node network and wishes to connect to it via a web socket connection he would use the following code snippet:

```node
import { getNetworkProvider } from "svarog/utils";
import { ApiPromise, WsProvider } from "@polkadot/api";

const main = async () => {
    const url = await getNetworkProvider("frame", "ws");

    const provider = new WsProvider(url);
    const api = await new ApiPromise({ provider }).isReady;
};

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => {
        process.exit(0);
    });
```

## Stopping a network

To stop a network simply press the Ctrl + C in the terminal that is running the initial network start command or simply close the terminal itself.
