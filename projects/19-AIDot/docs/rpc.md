# How to interact with AIDot's RPC server

## Endpoint

Public RPC endpoint: `http://api.aidot.tech`.

You can also host your own AIDot server to get a local endpoint for testing purposes.

## A brief introduction

A basic AIDot request would look like this:
```js
{
    "method": "rpcMethodToCall",
    "params": {
        ...
    }
}
```

The response would be a json and have the format of:
* `status` (number): Server status, example: `404`.
* `payload` (any): The data that we care about, it's mostly json or null.

Errors are similar:
* `status` (number): Server status, example: `404`.
* `error`:
    * `message` (string): Error message.
* `payload` (any): Most of the time it's null, used for shipping additional data if there is any.

## Account APIs

### Register

Used to register an account.

Method name: `register`.

Request params:
* `username` (string): Account's username.
* `password` (string): Account's password.

Response payload: `null`


## Bot APIs

### Create chat bot

Used to create a new chat bot.

Method name: `createChatBot`.

Request params:
* `username` (string): Account's username.
* `password` (string): Account's password.
* `instructions` (string): Optional, used to systematically instruct the bot what to do.
* `name` (string): Optional, used to set the bot's name.
* `extraFileIds` (string[]): Optional, used to add more files to train the bot.
* `recommendations` (string[]): Optional, used to set suggested conversation starters to ask the bot.

Response payload:
* `botInfo` (Object): OpenAI assistant object.

### Modify chat bot

Used to modify a chat bot.

Method name: `modifyChatBot`.

Request params:
* `username` (string): Account's username.
* `password` (string): Account's password.
* `assistantID` (string): Chat bot's id to modify.
* `instructions` (string): Optional, used to systematically instruct the bot what to do.
* `name` (string): Optional, used to set the bot's name.
* `fileIds` (string[]): Optional, used to set files to train the bot.
* `recommendations` (string[]): Optional, used to set suggested conversation starters to ask the bot.

Response payload:
* `botInfo` (Object): OpenAI assistant object.

### Delete chat bot

Used to delete a chat bot.

Method name: `deleteChatBot`.

Request params:
* `username` (string): Account's username.
* `password` (string): Account's password.
* `assistantID` (string): Chat bot's id to delete.

Response payload:
* `botInfo` (Object): OpenAI assistant deletion info object.

### Get chat bot info

Used to get a chat bot's info.

Method name: `getChatBotInfo`.

Request params:
* `assistantID` (string): Chat bot's id to get info from.

Response payload:
* `botInfo` (Object): OpenAI assistant info object.
* `recommendations` (string[]): Suggested conversation starters to ask the bot.
* `usage` (number): The amount of messages that the bot has handled.
* `limit` (number): The maximum amount of messages that the bot can handle. 150 for free plan, 15000 for advanced plan.

### List chat bot ids

Used to get chat bots' ids owned by an account.

Method name: `listChatBots`.

Request params:
* `username` (string): Account's username.
* `password` (string): Account's password.

Response payload:
* `chatBots` (string[]): An array of bot ids that the account owns.

### Get initial bot id

Used to get initial bot's id.

Method name: `getInitialBotId`.

Response payload:
* `id` (string): Initial bot's id.


## File APIs

### Upload a file

Used to upload a file for training purposes.

Method name: `uploadFile`.

Request params:
* `username` (string): Account's username.
* `password` (string): Account's password.
* `content` (string): Optional, used to upload file's content with `simple` mode.
* `flag` (string): Can either be `simple` or `stream`. If it is `simple`, then the provided `content` will be stored into a file and uploaded to OpenAI's server. If it is `stream`, then the server will initate a file to write to and then respond with a file key to access this file.
* `format` (string): File format, example: `txt`.

Response payload:
* `idCreated` (string): Will be empty if mode is `stream`.
* `fileKeyCreated` (string): Will be empty if mode is `simple`.

### Stream add

Used to write a chunk of data to a file.

Method name: `streamAdd`.

Request params:
* `username` (string): Account's username.
* `password` (string): Account's password.
* `fileKey` (string): Specify which file to write to. Read the previous section if you don't know what it is.
* `chunk` (string): If it does not have a `0x` prefix, the chunk is written as a utf-8 string into the file, if it does, it is converted into a byte buffer and written into file.

Response payload: `null`.

### Stream finish

Used to finalize the file and upload it to OpenAI.

Method name: `streamFinish`.

Request params:
* `username` (string): Account's username.
* `password` (string): Account's password.
* `fileKey` (string): Specify which file to write to. Read the previous section if you don't know what it is.

Response payload:
* `file`: (Object): OpenAI file object.

### Get file info

Used to get OpenAI file info.

Method name: `getFileInfo`.

Request params:
* `username` (string): Account's username.
* `password` (string): Account's password.
* `fileId` (string): Specify which file to get info.

Response payload:
* `file`: (Object): OpenAI file object.


## Message APIs

### Create chat thread

Used to create a chat thread. An user must create a chat thread in order to chat with the bot.

Method name: `createChatThread`.

Response payload:
* `thread`: (Object): OpenAI thread object.

### Send message

Used to send message to a chat thread and make the bot reply.

Method name: `sendMessage`.

Request body:
* `threadID` (string): Thread ID.
* `assistantID` (string): Assistant ID.
* `question` (string): Question to ask the bot.

Response payload:
* `message` (Object): OpenAI message object.
* `run` (Object): OpenAI run object.

### Get messages

Used to get messages from a thread **(current only get the latest message)**.

Method name: `getMessages`.

Request body:
* `threadID` (string): Thread ID.
* `assistantID` (string): Assistant ID.
* `limit` (number): Optional, number of messages to get, `1` by default.
* `onlyNew` (boolean): Optional, only get the latest message if set to `true`, `true` by default.

Response payload:
* `message` (Object): OpenAI message object.
* `run` (Object): OpenAI run object.


## Subscription APIs

### Purchase subscription

Used to purchase a subscription, create a transaction first with the amount of `1` to `0x029B93211e7793759534452BDB1A74b58De22C9c`, then call this RPC method to get the subscription.

Method name: `purchasePack`.

Request body:
* `paywith` (string): Payment option, currently accepts Moonbeam's Moonbase Alpha Testnet (`"glmr"`) and Acala's Mandala Testnet (`"aca"`).
* `username` (string): Username to get the subscription.
* `txHash` (string): Hash of the subscription payment transaction.

Response payload: `null`.

### Get current subscription

Used to get the current subscription of an account.

Method name: `getSubscription`.

Request body:
* `username` (string): Username of the account.

Response payload:
* `subscription` (string): The subscription plan, currently there are `advanced` and `free`.


## Special APIs

* GET `/`: Returns `Beep boop beep boop!`, used to check server liveness.
* GET `/:id`: Returns a code snippet that a dev can use to add an AIDot bot with the given bot `id` to their site.

