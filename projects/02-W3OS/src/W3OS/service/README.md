# W3OS Chat service

## Overview

- W3OS Instant Messaging Service bases on Polkadot account, only with the account, you can start to join Web3.0 world.

- IMS and GCS are deployed on Anchor Network, anybody can run the services by sinlge command. The **nodejs.loader.js** is under the folder `chat2/support`, **nodejs.loader.js** is a single file application, no support needed.

    ```SHELL
        # nodejs.loader.js is the loader for nodeJS
        node nodejs.loader.js anchor://imgc
    ```

- IMS and GCS are basice service for W3OS, you can get in touch with other people just via Polkadot/Substrate account.

## Instant Messaging Service & Group Chat Service

- Language: Javascript
- Framework: NodeJS
- Link between server and client: Websocket

### Build and Put On Chain

- Build the NodeJS project to a single file as follow. Please change the directory to **chat2** and run the command under it.

    ```SHELL
        #please install the esbuild first
        yarn add esbuild

        #package the application by esbuild
        ./node_modules/esbuild/bin/esbuild index.js --bundle --minify --outfile=./chat_server.min.js --platform=node
    ```

### IMS

### GCS

### Vertification By Payment

### Deployment

- Test server `45.63.84.74`
