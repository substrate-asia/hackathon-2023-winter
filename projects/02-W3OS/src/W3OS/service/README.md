# Instant Messaging & Group Chat Service

## Overview

- The IMGC (Instant Messaging & Group Chat) service is based on NodeJS. It is the basic service of W3OS - this is the MVP version, including full IM and GC capabilities, but only Payment Verification in isolated nodes.

- IMGC is based on ss58 accounts - you can start joining the Web3.0 world without any coins. 

- The IMGC service source code is deployed on the Anchor Network. You can run it with a single command using the Loader for NodeJS:

```shell
# nodejs.loader.js is the loader for NodeJS
node nodejs.loader.js anchor://imgc  
```

## Technical Details

- Basic functions are based on websocket.

- Verification is based on @polkadot/api. 

- The link process is as follows:

  1. The client (e.g. W3OS frontend) creates a websocket link to the IMGC server.

  2. The IMGC server creates a unique string called **spam** and sends it to the client.

  3. The client registers the account (SS58 account string) with **spam**. After this step, the IMGC server checks **spam** to retrieve the account.

  4. The client sends a message to perform the desired action.

## Functions  

### Instant Messaging Service

- **active** function: Register SS58 account on IMGC server.

- **to** function: Send message to target SS58 account.  

- **online** function: Client declares online status, IMGC server checks chat history and sends to client.

- **offline** function: Client declares offline status.

### Group Chat Service

- **create** function: Create group by members.

- **detail** function: Get group details by ID.  

- **join** function: Join target group with single account.

- **members** function: Change group members, automatically add and remove accounts.

- **leaver** function: Leave the group.  

- **divert** function: Set new group manager.

- **deport** function: [Not yet] Add account to block list.  

- **recover** function: [Not yet] Remove accounts from block list.

- **destory** function: Destroy the group.

- **chat** function: Chat in the group.

- **notice** function: Send notice to group. 

- **update** function: Update group details like name and announcement.

### Payment Verification 

- **reg** function: Get amount and target account for verification.

- **token** function: [Not yet], get token when payment is verified.

### System Features

- Autorecover: IMGC service backs up group list and cached messages at intervals. On start, it checks backups and recovers data.

- IMGC monitors Anchor Network to confirm payment verification.

## Code

- GitHub: [https://github.com/ff13dfly/W3OS/tree/main/service](https://github.com/ff13dfly/W3OS/tree/main/service)

- **chat2** folder has IMGC service code.  

- **UI** folder has basic chat function, mocks 4 accounts.

- **chat** folder has only IM service, abandoned.

## Unit Testing  

- Only unit tests for IMGC service in **chat2/test** folder. Isolated test cases for GC service.

## Deployment

- Target server address is [wss://chat.metanchor.net](wss://chat.metanchor.net). Nginx transports data from port to service port.  

- When trying Anchor version of IMGC, only one command is needed:

```shell
# nodejs.loader.js is the NodeJS loader
node nodejs.loader.js anchor://imgc
```
