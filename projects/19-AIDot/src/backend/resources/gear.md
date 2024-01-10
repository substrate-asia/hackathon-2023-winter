This document is only about Gear, only use this for questions about Gear, don't use these information to answer questions about Polkadot

---
sidebar_position: 1
sidebar_label: Gear React application template
---

# Gear React application template

Introducing Gear React Application Template: Accelerate Your Decentralized App Development

Are you looking to swiftly launch your decentralized application (dApp) on Gear-powered blockchains? Look no further! Gear React Application Template, also known as `create-gear-app`, is a pre-configured application template designed to streamline the development process. With its well-thought-out infrastructure and convenient features, it allows developers to quickly create and deploy their dApps on Gear-powered blockchains.

Gear React Application Template can be found on [GitHub](https://github.com/gear-foundation/dapps-react-app). This template is packed with a range of benefits and features that make it an ideal choice for developers seeking efficiency and simplicity in their dApp development workflow.

## Features

Let's delve into the key features that Gear React Application Template has to offer:

1. Gear API Connections: Integrating your dApp with Gear-powered blockchains is made seamless with pre-configured API connections, saving developers the hassle of manually setting up the necessary connections. By leveraging Gear's powerful infrastructure, developers can easily interact with the blockchain and access essential blockchain functionalities.

2. Login Interface: User authentication is a critical aspect of any application, and Gear React Application Template includes a pre-built login interface. This feature enables developers to quickly implement user authentication and securely manage user access to their dApps. With this functionality readily available, developers can focus on building the core features of their dApp without worrying about the authentication process.

3. Gear React-Hooks Support: Gear React Application Template is designed to take advantage of Gear's react-hooks library, providing developers with a smooth and intuitive development experience. The template includes all the necessary environments and configurations to seamlessly integrate react-hooks into your dApp.

4. Branded UI-Kit: User experience plays a crucial role in the success of any application. Gear React Application Template offers a branded UI-kit that ensures a visually appealing and consistent user interface. The UI-kit is designed to align with Gear's branding guidelines, providing developers with a head start in creating an attractive and professional-looking dApp. This feature allows developers to focus on developing the unique aspects of their application while maintaining a polished and cohesive design.

Gear React Application Template is an invaluable resource for various developers in the blockchain space. Whether you are a seasoned blockchain developer or just starting your journey, this template can significantly speed up your dApp development process. It simplifies the integration with Gear-powered blockchains, provides a robust login interface, offers support for Gear react-hooks, and includes a branded UI-kit for a visually appealing application.

Furthermore, Gear React Application Template is particularly beneficial for developers who prioritize efficiency and value a well-structured and standardized development workflow. By leveraging the template's pre-configured infrastructure, developers can save precious time and effort that would otherwise be spent on setting up and integrating the various components required for a blockchain application.

## Installation

Simply clone this repo to your local folder:

```sh
git clone https://github.com/gear-foundation/dapps-react-app.git d-app
```


---
sidebar_position: 2
sidebar_label: Meta CLI
---

:::warning Deprecation Notice

This CLI tool is deprecated and will be removed in the future.

Please use `getProgramMetadata` from `@gear-js/api` instead as described [here](/docs/api/metadata-type-creation.md).

:::

# Gear Meta CLI

CLI tool to encode/decode payloads and work with .meta.wasm files.

## Installation

```sh
npm install -g @gear-js/gear-meta
```

or

```sh
yarn global add @gear-js/gear-meta
```

## Usage

### Full list of commands

```sh
gear-meta --help
```

### Available commands

**decode** - _Decode payload from hex_

**encode** - _Encode payload to hex_

**meta** - _Display metadata from .meta.wasm_

**type** - _Display type structure for particular type from .meta.wasm_

You can simply run these commands and you will be prompted to enter the necessary data. Or you can specify data through options:

**-t, --type** - _Type to encode or decode the payload. If it is not specified you can select it later_

**-m, --meta** - _Path to .meta.wasm file with program's metadata_

**-o --output** - _Output JSON file. If it doesn't exist it will be created_

**-j --payloadFromJson** - _If need to take the payload from json_

All of these options are available for `decode` and `encode` commands
`-o --output` option is available for `meta` command
`-m, --meta` option is available for `type` command

## Examples

```sh
gear-meta encode '{"amount": 8, "currency": "GRT"}' -t init_input -m ./path/to/demo_meta.meta.wasm

# Output:
  # Result:
  # 0x080c475254
```

```sh
gear-meta decode '0x080c475254' -t init_input -m ./path/to/demo_meta.meta.wasm

# Output:
  # Result:
  # { amount: '8', currency: 'GRT' }
```

```sh
gear-meta type handle_input -m ./path/to/demo_meta.meta.wasm

# Output:
  # TypeName:  MessageIn
  # { id: { decimal: 'u64', hex: 'Bytes' } }
```

```sh
gear-meta meta ./path/to/demo_meta.meta.wasm

# Output:
  # Result:
  # {
  #   types: '0x50000824646...0000023800',
  #   init_input: 'MessageInitIn',
  #   init_output: 'MessageInitOut',
  #   async_init_input: 'MessageInitAsyncIn',
  #   async_init_output: 'MessageInitAsyncOut',
  #   handle_input: 'MessageIn',
  #   handle_output: 'MessageOut',
  #   async_handle_input: 'MessageHandleAsyncIn',
  #   async_handle_output: 'MessageHandleAsyncOut',
  #   title: 'Example program with metadata',
  #   meta_state_input: 'Option<Id>',
  #   meta_state_output: 'Vec<Wallet>',
  #   meta_state: undefined
  # }
```



---
sidebar_position: 3
sidebar_label: React-hooks
---

# Gear React-hooks

Hooks allow functional components to have access to programs running on Gear networks and significantly simplify the development of front-end applications.

For example, refer to [this article](/examples/NFTs/nft-marketplace/nft-application.md) that demonstrates the creation of a React application that connects to an [NFT smart contract](/examples/Standards/gnft-721.md) running on the blockchain.

## Installation

```sh
npm install @gear-js/react-hooks
```

or

```sh
yarn add @gear-js/react-hooks
```

## Getting started

Simple as it is, here's a quick example:

```jsx
import { useReadFullState } from '@gear-js/react-hooks';
import { useMetadata } from './use-metadata'

import meta from 'assets/meta/meta.txt';

function State() {
  const programId = '0x01';
  const { metadata } = useMetadata(meta);

  const { state } = useReadFullState(programId, meta);

  return <div>{JSON.stringify(state)}</div>;
}

export { State };
```

## Cookbook

:::info
In order for these hooks to work, the application must be wrapped in the appropriate Providers. As it is presented in the [example](https://github.com/gear-tech/gear-js/blob/main/utils/create-gear-app/gear-app-template/template/src/hocs/index.tsx). If you use `create-gear-app`, then all the necessary environment has already been provided.
:::

### useApi

`useApi` provides access to the Gear API connected to the selected RPC-node.

```js
import { useApi } from '@gear-js/react-hooks';

const { api, isApiReady } = useApi();
```

### useAccount

`useAccount` provides interaction with `Polkadot-js` extension API, allows to manage accounts from it (for example to sign transactions).

```js
import { useAccount } from '@gear-js/react-hooks';

const { account, isAccountReady } = useAccount();
```

### useAlert

`useAlert` shows any alert in the application context.

```js
import { useAlert } from '@gear-js/react-hooks';

const alert = useAlert();

// type?: 'info' | 'error' | 'loading' | 'success';
alert.success('success message')
```

### useMetadata

This hook is auxiliary and it is not pre-installed in the react-hook library. `useMetadata` allows converting the program's metadata (`.txt` file) into the required format.

```js
import { useEffect, useState } from 'react';
import {
  getProgramMetadata,
  ProgramMetadata
} from '@gear-js/api';
import { Buffer } from 'buffer';

export const useMetadata = (source: RequestInfo | URL) => {
  const [data, setData] = useState<ProgramMetadata>();

  useEffect(() => {
    fetch(source)
      .then((res) => res.text())
      .then((raw) => getProgramMetadata(`0x${raw}`))
      .then((meta) => setData(meta));
  }, [source]);

  return { metadata: data };
};
```

### useWasmMetadata

This hook is auxiliary and it is not pre-installed in the react-hook library. `useWasmMetadata` allows getting Buffer array from the program `meta.wasm`. Buffer is required always when using custom functions to query specific parts of the program State.

```js
import { useEffect, useState } from 'react';
import { Buffer } from 'buffer';

export const useWasmMetadata = (source: RequestInfo | URL) => {

  const [data, setData] = useState<Buffer>();

  useEffect(() => {
    if (source) {
      fetch(source)
        .then((response) => response.arrayBuffer())
        .then((array) => Buffer.from(array))
        .then((buffer) => setData(buffer))
        .catch(({ message }: Error) => console.error(`Fetch error: ${message}`));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  return { buffer: data };
};
```

### useSendMessage

`useSendMessage` allows sending messages to the program.

```js
import { useSendMessage } from '@gear-js/react-hooks';
import { useMetadata } from './useMetadata';
import meta from 'assets/meta/meta.txt';

function sendMessage() {
  const programId = '0x01';
  const { metadata } = useMetadata(meta);

  return useSendMessage(programId, metadata);
}
```

### useReadFullState

`useReadFullState` allows reading full program State.

```js
import { useReadFullState } from '@gear-js/react-hooks';
import { useMetadata } from './useMetadata';
import meta from 'assets/meta/meta.txt';

function readFullState() {
  const programId = '0x01';
  const { metadata } = useMetadata(meta);

  const { state } = useReadFullState(programId, metadata);

  return state;
}
```

### useReadWasmState

`useReadWasmState` allows reading program `State` using specific functions.

```js
import { useReadWasmState } from '@gear-js/react-hooks';
import { useWasmMetadata } from './useMetadata';
import stateMetaWasm from 'assets/wasm/state.meta.wasm';

function useProgramState<T>(functionName: string, payload?: any) {
  const programId = '0x01';
  const { buffer } = useWasmMetadata(stateMetaWasm);

  return useReadWasmState<T>(
    programId,
    buffer,
    functionName,
    payload,
  );
}

function firstState() {
  const payload = 'some_payload'
  const { state } = useProgramState('foo_1', payload);
  return state;
}

function secondState() {
  // if program state function doesn't have initial payload
  const { state } = useProgramState('foo_2', null);
  return state;
}
```

### useCreateHandler

`useCreateHandler` provides a tool for uploading the Gear program to the chain.

```js
import { useCreateHandler } from '@gear-js/react-hooks';
import meta from 'assets/meta/meta.txt';
import { useMetadata } from './useMetadata';

export function useCreateProgram(onSuccess: (programId: Hex) => void) {
  const codeHash = '0x01';
  const { metadata } = useMetadata(meta);
  const createProgram = useCreateHandler(codeHash, meta);

  return (payload) => createProgram(payload, { onSuccess });
}
```



---
sidebar_position: 3
sidebar_label: Calculate Gas
---

# Calculate gas

Gear nodes charge gas fees for all network operations, whether that be executing a program’s code or processing a message. This gas is paid for by the initiator of these actions.

They guarantee successful message processing and to avoid errors like `Gaslimit exceeded`, you can simulate the execution in advance to calculate the exact amount of gas that will be consumed.

## Calculate gas for messages

To find out the minimum gas amount required to send extrinsic, use `api.program.calculateGas.[method]`. Depending on the conditions, you can calculate gas for initializing a program or processing a message in `handle()` or `reply()`.

:::info

Gas calculation returns the GasInfo object, which contains 5 parameters:

- `min_limit` - minimum gas limit required for the execution
- `reserved` - gas amount that will be reserved for other on-chain interactions
- `burned` - number of gas burned during message processing
- `may_be_returned` - value that can be returned in some cases
- `waited` - notifies that the message will be added to the waitlist

:::

### Init (for upload_program extrinsic)

```javascript
const code = fs.readFileSync('demo_ping.opt.wasm');

const gas = await api.program.calculateGas.initUpload(
  '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d', // source id
  code,
  '0x00', // payload
  0,      // value
  true,   // allow other panics
);

console.log(gas.toHuman());
```

### Init (for create_program extrinsic)

```javascript
const codeId = '0x…';

const gas = await api.program.calculateGas.initCreate(
  '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d', // source id
  codeId,
  '0x00', // payload
  0,      // value
  true,   // allow other panics
);
console.log(gas.toHuman());
```

### Handle

```javascript
import { getProgramMetadata } from '@gear-js/api';
const metadata = await getProgramMetadata('0x' + fs.readFileSync('demo_new_meta.meta.txt'));
const gas = await api.program.calculateGas.handle(
  '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d', // source id
  '0xa178362715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d', // program id
  {
    id: {
      decimal: 64,
      hex: '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
    },
  },      // payload
  0,      // value
  false,  // allow other panics
  metadata,
);
console.log(gas.toHuman());
```

### Reply to a message

```javascript
import { getProgramMetadata } from '@gear-js/api';
const metadata = await getProgramMetadata('0x' + fs.readFileSync('demo_async.meta.txt'));
const gas = await api.program.calculateGas.reply(
  '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d', // source id
  '0x518e6bc03d274aadb3454f566f634bc2b6aef9ae6faeb832c18ae8300fd72635', // message id
  'PONG', // payload
  0,      // value
  true,   // allow other panics
  metadata,
);
console.log(gas.toHuman());
```


---
sidebar_position: 10
sidebar_label: Events
---

# Events

Events are generated for certain operations during execution. The following sections describe events that are part of the default Gear runtime.

To subscribe to all events:

```javascript
const unsub = await api.query.system.events((events) => {
  console.log(events.toHuman());
});
// Unsubscribe
unsub();
```

## Gear Events Types

### MessageQueued

**Summary:** When a user successfully sends a message to a program and it gets added to the Gear message queue.

```rust

MessageQueued {
    /// Generated id of the message.
    id: MessageId,
    /// Account id of the source of the message.
    source: T::AccountId,
    /// Program id, who is the message's destination.
    destination: ProgramId,
    /// Entry point for processing of the message.
    /// On the sending stage, the processing function
    /// of the program is always known.
    entry: MessageEntry,
}

```

### UserMessageSent

**Summary:** When someone has sent a message to the user.

```rust
UserMessageSent {
    /// Message sent.
    message: UserMessage,
    /// Block number of expiration from `Mailbox`.
    ///
    /// Equals `Some(_)` with block number when message
    /// will be removed from `Mailbox` due to some
    /// reasons (see #642, #646 and #1010).
    ///
    /// Equals `None` if message wasn't inserted to
    /// `Mailbox` and appears as only `Event`.
    expiration: Option<T::BlockNumber>,
}
```

### UserMessageRead

**Summary:** When a message has been marked as "read" and it has been removed from the `Mailbox`. This event only affects messages, which were already prior inserted into the `Mailbox`.

```rust
UserMessageRead {
    /// Id of the message read.
    id: MessageId,
    /// The reason for the reading (removal from `Mailbox`).
    ///
    /// NOTE: See more docs about reasons at `gear_common::event`.
    reason: UserMessageReadReason,
}
```

### MessagesDispatched

**Summary:** The result of when a message is processed within the block.

```rust
MessagesDispatched {
    /// Total amount of messages removed from message queue.
    total: MessengerCapacityOf<T>,
    /// Execution statuses of the messages, which were already known
    /// by `Event::MessageQueued` (sent from user to program).
    statuses: BTreeMap<MessageId, DispatchStatus>,
    /// Ids of programs, which state changed during queue processing.
    state_changes: BTreeSet<ProgramId>,
}
```

### MessageWaited

**Summary:** When a message's execution has been delayed and it has been added to the Gear waitlist.

```rust
MessageWaited {
    /// Id of the message waited.
    id: MessageId,
    /// Origin message id, which started messaging chain with programs,
    /// where currently waited message was created.
    ///
    /// Used to identify by the user that this message associated
    /// with him and the concrete initial message.
    origin: Option<GasNodeId<MessageId, ReservationId>>,
    /// The reason of the waiting (addition to `Waitlist`).
    ///
    /// NOTE: See more docs about reasons at `gear_common::event`.
    reason: MessageWaitedReason,
    /// Block number of expiration from `Waitlist`.
    ///
    /// Equals block number when message will be removed from `Waitlist`
    /// due to some reasons (see #642, #646 and #1010).
    expiration: T::BlockNumber,
}
```

### MessageWoken

**Summary:** When a message is ready to continue its execution and has been removed from the `Waitlist`.

```rust
MessageWoken {
    /// Id of the message woken.
    id: MessageId,
    /// The reason of the waking (removal from `Waitlist`).
    ///
    /// NOTE: See more docs about reasons at `gear_common::event`.
    reason: MessageWokenReason,
}
```

### CodeChanged

**Summary:** When a program's code has been altered.

```rust
CodeChanged {
    /// Id of the code affected.
    id: CodeId,
    /// Change applied on code with current id.
    ///
    /// NOTE: See more docs about change kinds at `gear_common::event`.
    change: CodeChangeKind<T::BlockNumber>,
}
```

### ProgramChanged

**Summary:** Any data related to program changed.

```rust
ProgramChanged {
    /// Id of the program affected.
    id: ProgramId,
    /// Change applied on program with current id.
    ///
    /// NOTE: See more docs about change kinds at `gear_common::event`.
    change: ProgramChangeKind<T::BlockNumber>,
}
```

### ProgramResumeSessionStarted

**Summary:** Program resume session has been started.

```rust
ProgramResumeSessionStarted {
  /// Id of the session.
  session_id: SessionId,
  /// Owner of the session.
  account_id: T::AccountId,
  /// Id of the program affected.
  program_id: ProgramId,
  /// Block number when the session will be removed if not finished.
  session_end_block: T::BlockNumber
}
        
```

## Check what the event is

```javascript
api.query.system.events((events) => {
  events
    .filter(({ event }) => api.events.gear.MessageQueued.is(event))
    .forEach(({ event: { data } }) => {
      console.log(data.toHuman());
    });

  events
    .filter(({ event }) => api.events.balances.Transfer.is(event))
    .forEach(({ event: { data } }) => {
      console.log(data.toHuman());
    });
});
```

## Subscribe to specific gear events

### Subscribe to messages sent from a program

```javascript
const unsub = api.gearEvents.subscribeToGearEvent(
  'UserMessageSent',
  ({
    data: {
      message: { id, source, destination, payload, value, reply },
    },
  }) => {
    console.log(`
  messageId: ${id.toHex()}
  source: ${source.toHex()}
  payload: ${payload.toHuman()}
  `);
  },
);
// Unsubscribe
unsub();
```

### Subscribe to messages intended for a program

```javascript
const unsub = api.gearEvents.subscribeToGearEvent(
  'MessageQueued',
  ({ data: { id, source, destination, entry } }) => {
    console.log({
      messageId: id.toHex(),
      programId: destination.toHex(),
      userId: source.toHex(),
      entry: entry.isInit
        ? entry.asInit
        : entry.isHandle
        ? entry.asHandle
        : entry.asReply,
    });
  },
);
// Unsubscribe
unsub();
```

### Subscribe to Transfer events

```javascript
const unsub = await api.gearEvents.subscribeToTransferEvents(
  ({ data: { from, to, amount } }) => {
    console.log(`
    Transfer balance:
    from: ${from.toHex()}
    to: ${to.toHex()}
    amount: ${+amount.toString()}
    `);
  },
);
// Unsubscribe
unsub();
```

### Subscribe to new blocks

```javascript
const unsub = await api.gearEvents.subscribeToNewBlocks((header) => {
  console.log(
    `New block with number: ${header.number.toNumber()} and hash: ${header.hash.toHex()}`,
  );
});
// Unsubscribe
unsub();
```



---
sidebar_position: 11
sidebar_label: Cookbook
---

# Cookbook

Here is collected a set of useful code snippets in a question-answer format:

### Get block data

```javascript
const data = await api.blocks.get(blockNumberOrBlockHash);
console.log(data.toHuman());
```

### Get block timestamp

```javascript
const ts = await api.blocks.getBlockTimestamp(blockNumberOrBlockHash);
console.log(ts.toNumber());
```

### Get blockHash by block number

```javascript
const hash = await api.blocks.getBlockHash(blockNumber);
console.log(hash.toHex());
```

### Get block number by blockhash

```javascript
const hash = await api.blocks.getBlockNumber(blockHash);
console.log(hash.toNumber());
```

### Get all block's events

```javascript
const events = await api.blocks.getEvents(blockHash);
events.forEach((event) => {
  console.log(event.toHuman());
});
```

### Get all block's extrinsics

```javascript
const extrinsics = await api.blocks.getExtrinsics(blockHash);
extrinsics.forEach((extrinsic) => {
  console.log(extrinsic.toHuman());
});
```

## Get transaction fee

```javascript
const api = await GearApi.create();
api.program.submit({ code, gasLimit });
// same for api.message, api.reply and others
const paymentInfo = await api.program.paymentInfo(alice);
const transactionFee = paymentInfo.partialFee.toNumber();
consolg.log(transactionFee);
```

## Sign data

Create signature

```javascript
import { GearKeyring } from '@gear-js/api';
const message = 'your message';
const signature = GearKeyring.sign(keyring, message);
```

Validate signature

```javascript
import { signatureIsValid } from '@gear-js/api';
const publicKey = keyring.address;
const verified = signatureIsValid(publicKey, signature, message);
```

## Convert public keys into ss58 format and back

Use `encodeAddress` and `decodeAddress` functions to convert the public key into ss58 format and back.

Convert to raw format

```javascript
import { decodeAddress } from '@gear-js/api';
console.log(decodeAddress('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'));
```

Convert to ss58 format

```javascript
import { encodeAddress } from '@gear-js/api';
console.log(
  encodeAddress(
    '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
  ),
);
```

---
sidebar_position: 1
sidebar_label: Getting Started
---

# Getting started

## Gear-JS API

The Gear-JS API provides a set of utilities, libraries and tools that enable JavaScript applications to interact with smart contracts running in the Gear network via queries to a Gear node.

Sections below describe tools that you can use in your JS application to implement basic functions such as managing your key pair (account), calculating gas required for network operations, uploading program in the network, sending a message to a program, reading program's state, getting messages from the user's mailbox, working with metadata and more. Some useful code snippets are provided in the Cookbook section.

The basic API is implemented on the Substrate layer and is the same for all Substrate-based networks. The Gear-JS API code is available on [GitHub](https://github.com/gear-tech/gear-js). Complete API overview can be found on the [Polkadot documentation portal](https://polkadot.js.org/docs/).

:::note
Since Vara and Vara Testnet can have different runtime versions, they may have different extrinsic signatures. If your application is operating on the Vara Network, it is more convenient to use the `VaraApi` class instead of `GearApi` and `VaraTestnetApi` for the Vara Testnet Network.
:::

## Installation

```sh
npm install @gear-js/api
```

or

```sh
yarn add @gear-js/api
```

## Getting started

Start the API connection to the local running RPC node:

```javascript
import { GearApi } from '@gear-js/api';

const gearApi = await GearApi.create();
```

You can also connect to a different node:

```javascript
const gearApi = await GearApi.create({
  providerAddress: 'ws[s]://someIP[:somePort]',
});
```

:::note

Below are a few entry points for interact with Gear RPC Node.

For connection to local node use:

```bash
ws://127.0.0.1:9944
```

For connection to Vara Network Testnet use:

```bash
wss://testnet.vara.network
```

:::


Getting node info

```javascript
const chain = await gearApi.chain();
const nodeName = await gearApi.nodeName();
const nodeVersion = await gearApi.nodeVersion();
const genesis = gearApi.genesisHash.toHex();
```

## Example

This simple example describes how to subscribe to a new blocks and get chain spec:

```js
async function connect() {
  const gearApi = await GearApi.create({
    providerAddress: 'wss://testnet.vara.network',
  });

  const [chain, nodeName, nodeVersion] = await Promise.all([
    gearApi.chain(),
    gearApi.nodeName(),
    gearApi.nodeVersion(),
  ]);

  console.log(
    `You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`,
  );

  const unsub = await gearApi.gearEvents.subscribeToNewBlocks((header) => {
    console.log(
      `New block with number: ${header.number.toNumber()} and hash: ${header.hash.toHex()}`,
    );
  });
}

connect().catch(console.error);
```

Also, refer to the [article](./../examples/NFTs/nft-marketplace/nft-application) that demonstrates the creation of a React application that connects to an [NFT smart contract](./../examples/Standards/gnft-721) running on the blockchain.


---
sidebar_position: 2
sidebar_label: Keyring
---

# Keyring

Keyring enables you to manage your key pair (account) to perform a wide range of operations, including signing, verifying and encrypting/decrypting. The SecretKey is never exposed to the outside.

## Create keyring

Creating a new keyring

```javascript
import { GearKeyring } from '@gear-js/api';
const { keyring, json } = await GearKeyring.create('keyringName', 'passphrase');
```

Getting a keyring from JSON

```javascript
const jsonKeyring = fs.readFileSync('path/to/keyring.json').toString();
const keyring = GearKeyring.fromJson(jsonKeyring, 'passphrase');
```

Getting JSON for keyring

```javascript
const json = GearKeyring.toJson(keyring, 'passphrase');
```

Getting a keyring from seed

```javascript
const seed = '0x496f9222372eca011351630ad276c7d44768a593cecea73685299e06acef8c0a';
const keyring = await GearKeyring.fromSeed(seed, 'name');
```

Getting a keyring from mnemonic

```javascript
const mnemonic = 'slim potato consider exchange shiver bitter drop carpet helmet unfair cotton eagle';
const keyring = GearKeyring.fromMnemonic(mnemonic, 'name');
```

Generate mnemonic and seed

```javascript
const { mnemonic, seed } = GearKeyring.generateMnemonic();

// Getting a seed from mnemonic
const { seed } = GearKeyring.generateSeed(mnemonic);
```

## Default Accounts

In most cases on development chains, Substrate has a number of standard accounts that are pre-funded. Generally when operating on development chains, you will be introduced to characters such as `Alice`, `Bob`, `Charlie`, `Dave`, `Eve` and `Ferdie`. To create keyring from pre-installed accounts use:

```javascript
const keyring = await GearKeyring.fromSuri('//Alice');
```



---
sidebar_position: 9
sidebar_label: Mailbox
---

# Mailbox

The mailbox contains messages from the program that are waiting for user action.

## Read messages from Mailbox

```javascript
const api = await GearApi.create();
const mailbox = await api.mailbox.read(
  '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
);
console.log(mailbox);
```

## Claim value

To claim value from a message in the mailbox use `api.mailbox.claimValue.submit` method.

```javascript
const api = await GearApi.create();
const submitted = await api.mailbox.claimValue.submit(messageId);
await api.mailbox.claimValue.signAndSend(/* ... */);
```

## Waitlist

To read the program's waitlist use `api.waitlist.read` method.

```javascript
const api = await GearApi.create();
const programId = '0x1234…';
const waitlist = await api.waitlist.read(programId);
console.log(waitlist);
```



---
sidebar_position: 8
sidebar_label: Metadata & Type Creation
---

# Basics & Metadata / Type creation

Metadata enables interaction between the client side (JavaScript application) and the smart-contract (Rust program). Metadata is a kind of interface map that can help to identify and order a set of bytes into an understandable structure and indicates the function it is intended for.

There are two types of metadata.

## ProgramMetadata

`ProgramMetadata` is used to encode/decode messages to/from a program and to read the **entire program's** `State`. In this case, metadata looks like a hex string and generates automatically while the Gear program compiles.

To get program metadata, use the `getProgramMetadata` function:

```javascript
import { getProgramMetadata } from '@gear-js/api';

const metadata = getProgramMetadata('0x…');

// The function getProgramMetadata() takes the program's metadata in the format of a hex string.
// It returns an object of the `ProgramMetadata` class with the property `types` containing all program types.

metadata.types.init.input; // can be used to encode input message for init entrypoint of the program
metadata.types.init.output; // can be used to decode output message for init entrypoint of the program
// the same thing available for all entrypoints of the program

metadata.types.state; // contains type for decoding state output
```

## StateMetadata

This is the most convenient way to work with metadata. It enables creating arbitrary custom functions to query only specific parts of the program state instead of reading the entire program’s state. This will be especially useful for large programs with big state.

In order to use a custom implementation of reading a program `State`, you should call the `StateMetadata` function to get metadata.
The function takes `meta.wasm` as `Buffer` to read the `State`. It returns the object of the `StateMetadata` class that has functions to query the program's `State`.

```js
import { getStateMetadata } from '@gear-js/api';

const fileBuffer = fs.readFileSync('path/to/state.meta.wasm');
const metadata = await getStateMetadata(fileBuffer);
metadata.functions; // is an object whose keys are names of functions and values are objects of input/output types
```

## Metadata class methods

Both `ProgramMetadata` and `StateMetadata` classes have a few methods that can help to understand what one or another type is as well as get the name of a type (because types are represented as numbers in the registry). Also, there is some method for encoding and decoding data.

```js
import { ProgramMetadata } from '@gear-js/api`;

const metadata = getProgramMetadata('0x…');

// returns the name of the type with this index
metadata.getTypeName(4);

// returns the structure of this type
metadata.getTypeDef(4);

// if you need to get a type structure with an additional field (name, type, kind, len) you have to pass the second argument
metadata.getTypeDef(4, true);

// returns all custom types that existed in the registry of the program
metadata.getAllTypes();

// encode or decode payload with indicated type
metadata.createType(4, { value: 'value' });
```

## Type creation

More information about the basic types and methods of work can be found in the main documentation of Polkadot [here](https://polkadot.js.org/docs/api/start/types.basics)

If for some reason you need to create a type "manually" to encode/decode any payload:

```javascript
import { CreateType } from '@gear-js/api';

// If "TypeName" already registered.
// Learn more https://polkadot.js.org/docs/api/start/types.create#choosing-how-to-create
const result = CreateType.create('TypeName', somePayload);

// Otherwise need to add metadata containing TypeName and all required types
const result = CreateType.create('TypeName', somePayload, metadata);
```
The result of this function is data of type `Codec` and it has the following methods:

```javascript
result.toHex();     // returns a hex represetation of the value
result.toHuman();   // returns human-friendly object representation of the value
result.toString();  // returns a string representation of the value
result.toU8a();     // encodes the value as a Unit8Array
result.toJSON();    // converts the value to JSON
```



---
sidebar_position: 5
sidebar_label: Pay Program rent
sidebar_class_name: hidden
---

To pay program rent, use the following JavaScript code:

```javascript

// program.payRent has params:
// programId
// blockCount - number of blocks for which we want to extend
const tx = await api.program.payRent('0x...', 100_000);

tx.signAndSend(account, (events) => {
   events.forEach(({ event }) => console.log(event.toHuman()));
});

```

You can calculate the current rent price using the following code:

```javascript

const price = api.program.calculatePayRent(blockCount);

```

If a program was paused and its pages removed from storage, you can restore it using the `api.program.resumeSession` methods:

- `init`: Start a new session to resume the program.
- `push`: Push a bunch of program pages.
- `commit`: Finish the resume session.

Here's how you can resume a paused program:

```javascript

const program = await api.programStorage.getProgram(programId, oneBlockBeforePauseHash);
const initTx = api.program.resumeSession.init({
  programId,
  allocations: program.allocations,
  codeHash: program.codeHash.toHex(),
});

let sessionId;
initTx.signAndSend(account, ({ events }) => {
  events.forEach(({ event: { method, data } }) => {
    if (method === 'ProgramResumeSessionStarted') {
      sessionId = data.sessionId.toNumber();
    }
  });
});

const pages = await api.programStorage.getProgramPages(programId, program, oneBlockBeforePauseHash);
for (const memPage of Object.entries(page)) {
  const tx = api.program.resumeSession.push({ sessionId, memoryPages: [memPage] });
  tx.signAndSend(account);
}

const tx = api.program.resumeSession.commit({ sessionId, blockCount: 20_000 });
tx.signAndSend(account);

```



---
sidebar_position: 5
sidebar_label: Pay Program rent
sidebar_class_name: hidden
---

To pay program rent, use the following JavaScript code:

```javascript

// program.payRent has params:
// programId
// blockCount - number of blocks for which we want to extend
const tx = await api.program.payRent('0x...', 100_000);

tx.signAndSend(account, (events) => {
   events.forEach(({ event }) => console.log(event.toHuman()));
});

```

You can calculate the current rent price using the following code:

```javascript

const price = api.program.calculatePayRent(blockCount);

```

If a program was paused and its pages removed from storage, you can restore it using the `api.program.resumeSession` methods:

- `init`: Start a new session to resume the program.
- `push`: Push a bunch of program pages.
- `commit`: Finish the resume session.

Here's how you can resume a paused program:

```javascript

const program = await api.programStorage.getProgram(programId, oneBlockBeforePauseHash);
const initTx = api.program.resumeSession.init({
  programId,
  allocations: program.allocations,
  codeHash: program.codeHash.toHex(),
});

let sessionId;
initTx.signAndSend(account, ({ events }) => {
  events.forEach(({ event: { method, data } }) => {
    if (method === 'ProgramResumeSessionStarted') {
      sessionId = data.sessionId.toNumber();
    }
  });
});

const pages = await api.programStorage.getProgramPages(programId, program, oneBlockBeforePauseHash);
for (const memPage of Object.entries(page)) {
  const tx = api.program.resumeSession.push({ sessionId, memoryPages: [memPage] });
  tx.signAndSend(account);
}

const tx = api.program.resumeSession.commit({ sessionId, blockCount: 20_000 });
tx.signAndSend(account);

```


---
sidebar_position: 7
sidebar_label: Read State
---

# Read State

There are two different ways to query the program `State`:

1. Query the full `State` of the program. To read the full `State` of the program, you need to have only the `metadata` of this program. You can call `api.programState.read` method to get the state.

```javascript
import { GearApi } from '@gear-js/api';
const api = await GearApi.create({
  providerAddress: 'wss://testnet.vara.network',
});
await api.programState.read({ programId: '0x…' }, programMetadata);
```

Also, you can read the `State` of the program at some specific block specified by its hash:

```javascript
await api.programState.read(
  { programId: '0x…', at: '0x…' },
  programMetadata,
);
```

2. If you are using the custom functions to query only specific parts of the program State ([see more](/docs/developing-contracts/metadata#generate-metadata)), then you should call `api.programState.readUsingWasm` method:

```js
// ...
import { getStateMetadata } from '@gear-js/api';
const stateWasm = readFileSync('path/to/state.meta.wasm');
const metadata = await getStateMetadata(stateWasm);

const state = await api.programState.readUsingWasm(
  {
    programId: '0x…',
    fn_name: 'name_of_function_to_execute',
    stateWasm,
    argument: { input: 'payload' },
  },
  metadata,
);
```

## Cookbook

To read state in JavaScript applications you can use `fetch` browser API to get buffer from `meta.wasm`:

```javascript
// ...

const res = await fetch(metaFile);
const arrayBuffer = await res.arrayBuffer();
const buffer = await Buffer.from(arrayBuffer);
const metadata = await getStateMetadata(buffer);

// get State only of the first wallet
const firstState = await api.programState.readUsingWasm(
  { programId: '0x…', fn_name: 'first_wallet', buffer },
  metadata,
);

// get wallet State by id
const secondState = await api.programState.readUsingWasm(
  { programId: '0x…', fn_name: 'wallet_by_id', buffer,  argument: { decimal: 1, hex: '0x01' } },
  metadata,
);

```


---
sidebar_position: 6
sidebar_label: Send Message
---

# Send Message

Use `api.message.send` method to send messages to the program:

```javascript
try {
  const message = {
    destination: destination, // programId
    payload: somePayload,
    gasLimit: 10000000,
    value: 1000,
    // prepaid: true,
    // account: accountId,
    // if you send message with issued voucher
  };
  // In that case payload will be encoded using meta.types.handle.input type
  let extrinsic = api.message.send(message, meta);
  // So if you want to use another type you can specify it
  extrinsic = api.message.send(message, meta, meta.types.other.input);
} catch (error) {
  console.error(`${error.name}: ${error.message}`);
}
try {
  await extrinsic.signAndSend(keyring, (event) => {
    console.log(event.toHuman());
  });
} catch (error) {
  console.error(`${error.name}: ${error.message}`);
}
```

:::note

In real conditions to ensure successful message processing, the calculation of the required gas for processing the message should be performed by using `api.program.calculateGas` method.

[more info](/docs/api/calculate-gas)
:::

### Send reply message

When you need to reply to a message received from a program, use `api.message.reply`:

```javascript
try {
  const reply = {
    replyToId: messageId,
    payload: somePayload,
    gasLimit: 10000000,
    value: 1000,
    // prepaid: true,
    // account: accountId,
    // if you send message with issued voucher
  };
  // In this case payload will be encoded using `meta.types.reply.input` type.
  const extrinsic = api.message.sendReply(reply, meta);
} catch (error) {
  console.error(`${error.name}: ${error.message}`);
}
try {
  await extrinsic(keyring, (events) => {
    console.log(event.toHuman());
  });
} catch (error) {
  console.error(`${error.name}: ${error.message}`);
}
```


---
sidebar_position: 5
sidebar_label: Upload Code
---

# Upload code

If you need to load the program code into the chain without initialization use `GearApi.code.upload` method to create `upload_code` extrinsic:

```javascript
const code = fs.readFileSync('path/to/program.opt.wasm');

const { codeHash } = await api.code.upload(code);

api.code.signAndSend(alice, () => {
  events.forEach(({ event: { method, data } }) => {
    if (method === 'ExtrinsicFailed') {
      throw new Error(data.toString());
    } else if (method === 'CodeChanged') {
      console.log(data.toHuman());
    }
  });
});
```

## Create program from uploaded code on chain

Use `api.program.create` method to create `create_program` extrinsic:

```javascript
const codeId = '0x…';

const program = {
  codeId,
  gasLimit: 1000000,
  value: 1000,
  initPayload: somePayload,
};

const { programId, salt, extrinsic } = api.program.create(program, meta);

await extrinsic.signAndSend(keyring, (event) => {
  console.log(event.toHuman());
});
```



---
sidebar_position: 4
sidebar_label: Upload Program
---

# Upload Program

A smart contract compiled to Wasm can be uploaded to the Gear network as a program. During uploading it is initialized in the network to be able to send and receive messages with other actors in the network (programs and users).

Use `api.program.upload` method to create `upload_program` extrinsic

```javascript
const code = fs.readFileSync('path/to/program.wasm');

const program = {
  code,
  gasLimit: 1000000,
  value: 1000,
  initPayload: somePayload,
};

try {
  const { programId, codeId, salt, extrinsic } = api.program.upload(
    program,
    meta,
  );
} catch (error) {
  console.error(`${error.name}: ${error.message}`);
}

try {
  await extrinsic.signAndSend(keyring, (event) => {
    console.log(event.toHuman());
  });
} catch (error) {
  console.error(`${error.name}: ${error.message}`);
}
```

:::note

For the calculation of the required gas for `init` message processing should use `api.program.calculateGas.initUpload()` method.

[more info](/docs/api/calculate-gas)
:::


---
sidebar_position: 7
sidebar_label: Vouchers
---

# Gas vouchers

Vouchers, issued by any actor empower users with gas-free interactions, enabling them to send messages to specific programs seamlessly.

An example of using vouchers is shown in the [Battleship](/examples/Gaming/battleship.md) game. Users without tokens on their balance can make moves by sending messages to a program using a voucher.

### Issue a voucher

Use `api.voucher.issue` method to issue a new voucher for a user to be used to pay for sending messages to `program_id` program.

```javascript
  import { VoucherIssued } from '@gear-js/api';

  const programId = '0x..';
  const account = '0x...';
  const tx = api.voucher.issue(account, programId, 10000);
  tx.signAndSend(account, (events) => {
    const voucherIssuedEvent = events.events.filter(({event: {method}}) => method === 'VoucherIssued') as VoucherIssued;
    console.log(voucherIssuedEvent.toJSON());
  })
```

### Check voucher

Use `api.voucher.exists` method to check that the voucher exists for a particular user and program:

```javascript
const voucherExists = await api.voucher.exists(programId, accountId);
```

### Send a message using voucher

To send message with voucher you can use `api.voucher.call` method:

```javascript
  const messageTx = api.message.send({
    destination: destination,
    payload: somePayload,
    gasLimit: 10000000,
    value: 1000
  }, meta);

  const voucherTx = api.voucher.call({ SendMessage: messageTx });
  await voucherTx.signAndSend(account, (events) => {
    console.log(events.toHuman());
  });
```
### Send a reply using voucher

Sending a reply with issued voucher works similar to sending message with voucher:

```javascript
  const messageTx = api.message.sendReply(...);

  const voucherTx = api.voucher.call({ SendReply: messageTx });
  await voucherTx.signAndSend(account, (events) => {
    console.log(events.toHuman());
  });
```




---
sidebar_label: Data Encoding/Decoding
sidebar_position: 6
---

# Data encoding/decoding

To optimize how data is sent and received over the network, Gear uses the [`parity-scale-codec`](https://docs.rs/parity-scale-codec) - a Rust implementation of the SCALE Codec. This codec is used by the Substrate nodes' internal runtime. SCALE is a lightweight format that enables the serialization and deserialization of data. Encoding (and decoding) data using SCALE makes it highly suitable for resource-constrained execution environments like blockchain runtimes and low-power/low-memory devices.

To use SCALE codec in your program, you should add it in `Cargo.toml`:

```toml
[dependencies]

// ...
codec = { package = "parity-scale-codec", version = "3.6", default-features = false }
```

```rust
use codec::{Decode, Encode};

#[derive(Encode, Decode)]
enum MyType {
    MyStruct { field: ... },
    ...
}
```

:::info

We only need the `Encode` and `Decode` traits when using wrapped methods from `gstd`, such as: [`msg::load`](https://docs.gear.rs/gstd/msg/fn.load.html), [`msg::send`](https://docs.gear.rs/gstd/msg/fn.send.html), [`msg::reply`](https://docs.gear.rs/gstd/msg/fn.reply.html), [`msg::send_for_reply`](https://docs.gear.rs/gstd/msg/fn.send_for_reply.html) etc.

In methods like [`msg::load_bytes`](https://docs.gear.rs/gstd/msg/fn.load_bytes.html), [`msg::send_bytes`](https://docs.gear.rs/gstd/msg/fn.send_bytes.html), or [`msg::reply_bytes`](https://docs.gear.rs/gstd/msg/fn.reply_bytes.html) we operate with a set of bytes, so nothing needs to be decoded/encoded.

:::

Learn more about SCALE Codec [here](https://github.com/paritytech/parity-scale-codec).

## `scale-info`

[`scale-info`](https://docs.rs/scale-info/) is a library to describe Rust types, intended for providing information about the structure of encodable SCALE types.

The definitions provide third party tools (e.g. a UI client) with information about how they are able to decode types agnostic of language. The interface that uses `scale-info` for Gear programs is called **metadata**. It defines incoming and outgoing types for all necessary entry points and allows contracts and the client part to understand each other.

:::info

[Learn more](./metadata.md) how to use metadata in contract.

:::

To use `scale-info` in your project:

```toml
[dependencies]

// ...
scale-info = { version = "2.9", default-features = false, features = ["derive"] }
```

Learn more about `scale-info` [here](https://github.com/paritytech/scale-info)




---
sidebar_label: Create Program
sidebar_position: 7
---

# Create program from program

Business logic of an arbitrary decentralized application may require the program (smart contract) the possibility of creating, initializing and launching one or several other programs in the network. It can be necessary when external parties (users) need access to their own instance of the typical smart contract.

Let’s take for example a contract that implements loan functionality. In this case, the program developer can create a loan factory contract that will create instances of loan smart contracts on demand and operate them.

Firstly, to create a program, you have to submit program code to the network using an extrinsic [`gear.uploadCode`](https://docs.gear.rs/pallet_gear/pallet/struct.Pallet.html#method.upload_code) and get its code hash. Submit program code does not initialize the program.

:::info

To submit code you can use our GUI at [Gear IDEA](https://idea.gear-tech.io/) or just submit it via @gear-js/api library. Also you can use `Gear Program` CLI - https://github.com/gear-tech/gear/tree/master/gcli

:::

After the code has been submitted, it can be used to create a new program:

```rust
use gstd::{prog::ProgramGenerator, CodeHash, msg};

#[no_mangle]
extern "C" fn handle() {
    let submitted_code: CodeHash =
        hex_literal::hex!("abf3746e72a6e8740bd9e12b879fbdd59e052cb390f116454e9116c22021ae4a")
            .into();

    // ProgramGenerator returs ProgramId

    let program_id =  ProgramGenerator::create_program_with_gas(submitted_code, b"payload", 10_000_000_000, 0)
        .expect("Unable to create program");

    msg::send(program_id, b"hello", 0).expect("Unable to send message");
}
```

More info about `gstd::prog` module see in https://docs.gear.rs/gstd/prog/index.html



---
sidebar_label: Delayed Messages
sidebar_position: 9
---

# Delayed messages for smart contracts automation

The usual way that smart contracts on other blockchains continue to function is by relying on external, centralized resources. This means that the code of these contracts will not run and make changes to the blockchain's state until it is triggered by an on-chain transaction.

The external transaction serves as a "poke" to activate the smart contract and initiate its logic. For instance, we can start an auction by sending a message to the auction contract. When the auction time has passed, the contract will need to process the result of the auction. However, this will not happen until someone sends the appropriate message to the contract to trigger this action.

Gear Protocol solves this issue by introducing delayed messaging functionality. The smart contracts in Gear Networks are able to execute themselves an **unlimited** number of blocks, as long as enough gas for execution is kept available. The [gas reservation](./gas-reservation.md) option allows you to ensure this. As a result the need for including centralized components in dApps is eliminated, allowing them to function **totally on-chain**.

[`msg::send_delayed`](https://docs.gear.rs/gstd/msg/fn.send_delayed.html) function allows sending a message after a specified delay. The function takes the following parameters:

- `program` - the program (or user) to which the message will be sent
- `payload` - the payload of the message
- `value` - the amount of tokens to be sent with the message
- `delay` - the delay in blocks after which the message will be sent

The delayed message will be executed after the specified `delay` measured in blocks. For example, on a network with a block producing time of 3 seconds, a delay of 20 is equal to 1 minute.

We can make the message processing to be paid with the reserved gas by using the [`msg::send_delayed_from_reservation`](https://docs.gear.rs/gstd/msg/fn.send_delayed_from_reservation.html) function which takes a reservation ID as the first parameter.

Considering the example with auction, we can start the auction by sending a message to the auction contract. After completing all the necessary logic, the auction contract will send a delayed message to itself, which will settle the auction after the indicated time.


---
sidebar_label: Upload Program
sidebar_position: 12
---

# Upload smart contracts

Following the principles of Actor model for communication, uploading a program in the network is just one of the specific types of transactions that contain a Wasm file as a payload.

Uploading a new program (smart-contract) to the blockchain takes place by calling the custom extrinsic `gear.uploadProgram(code, salt, initPayload, gasLimit, value)`.
Where:

- `code: Bytes` - binary Wasm code
- `salt: Bytes` - the random data that is added to the hashing process to force their uniqueness
- `initPayload: Bytes`- the init message payload that will be processed by the init() function during program initialization
- `gasLimit: u64` - the amount of gas that users are willing to spend on processing the upload of a new program
- `value: u128` - the value that will be transferred to a balance of the newly created account for the program

## Program upload events

> Note: while extrinsics represent information from the outside world, events represent information from the chain. Extrinsics can trigger events.

The extrinsic that was called to upload a program triggers a series of events. Learn more about events [here](/docs/api/events#gear-events-types).

## How to upload

There are several ways to upload a program:

### Upload via Gear GUI

The easiest way to upload the program is to use the “Upload program” option in the Gear Idea portal - **[idea.gear-tech.io](https://idea.gear-tech.io)**.

![img alt](./img/idea-upload.png)

### Via gear-js library

The Gear-js library provides a simple and intuitive way to connect Gear Component APIs, including interaction with programs. More details: [Gear API](/docs/api/getting-started).

### Via `gear-program`

`gear-program` is the command line (CLI) utility for interacting with the blockchain network. Refer to [gear-program GitHub repo](https://github.com/gear-tech/gear-program) for details.


---
sidebar_label: Consistency and Reliability
sidebar_position: 9
---

# Ensuring reliability in asynс programming

One of the key features of the Gear Protocol is its use of the Actor model for message-passing communication. The Actor model framework enables asynchronous messaging and parallel computation, which  drastically improves the achievable speed and scalability of dApps. In the Actor model, programs do not share state and instead communicate with each other through messages. If a program sends an asynchronous message to another program, it has to wait for a reply from the other program before it can proceed with the next operation.

When a program interacts with another program, the transaction becomes "distributed." A distributed transaction is a set of operations performed across multiple databases or, in the case of the Gear Protocol, across multiple actors with their own states. Distributed transactions must possess these properties:
- Atomicity - all data changes are treated as if they were a single operation. That is, either all of the modifications are made, or none of them are made;
- Consistency - this property implies that when a transaction begins and ends, the state of data is consistent.

For example, transactions on the Ethereum blockchain are atomic, meaning that if a transaction fails due to an error, all of its effects on the global state are rolled back as if the transaction never occurred. Many blockchain applications rely on the atomicity of transactions, but this can be a problem when building asynchronous applications using the programming paradigm used on Ethereum, as you may encounter the problem of not being able to recover program state after a failed transaction.

Consider a simple token exchange where a user wants to swap tokens A for tokens B in a liquidity pool. The swap contract would send a message to the token A contract and a message to the token B contract. If one of these messages succeeds and the other fails for some reason, the state of the token A contract would be changed while the state of the token B contract would remain unchanged. This can cause inconsistencies in the state of the data and make it difficult to recover from failed transactions. As a result, it is important to consider different programming paradigms for implementing distributed transactions.

Let's look at different programming methods using the example of a token exchange.

## Splitting a token swap transaction into 3 separate transactions

Consider the following situation: we have a liquidity pool of token A and token B, and also a user who wants to exchange his tokens A for tokens B.

`Step 1` : A user sends a `MakeOrder` message to the swap contract. During that transaction the contract sends a message to the fungible token contract. The result of executing this message can be a success or a failure. The worst case scenario is having a lack of gas when processing a message in the token contract or in the subsequent execution of the swap contract. However, since the token contract supports idempotency, the user can simply restart the transaction and complete it.

![img alt](./img/1.step1.png#gh-light-mode-only)
![img alt](./img/1.step1-dark.png#gh-dark-mode-only)

`Step 2`:  A user sends an `ExecuteOrder` message to the swap contract. The swap contract just calculates the amount of tokens a user will receive and saves the new state of the liquidity poll.

![img alt](./img/1.step2.png#gh-light-mode-only)
![img alt](./img/1.step2-dark.png#gh-dark-mode-only)

`Step 3`:  A user sends a `Withdraw` message to the swap contract and receives tokens B. The situation here is the same as in the first step.

![img alt](./img/1.step3.png#gh-light-mode-only)
![img alt](./img/1.step3-dark.png#gh-dark-mode-only)

It is possible to execute a swap in one transaction. To resolve the problem of atomicity we can use the following patterns here:
- `2 PC - 2 Phase Commit protocol` (And also its extension - 3 phase commit protocol);
- `Saga Pattern`.

## Two phase commit protocol

**Theory**:
We have a coordinator that sends messages to participants. The `two-phase commit protocol` has two parts: the `prepare` phase and the `commit` phase.

**Preparation phase:**
During the preparation phase, the coordinator and participants perform the following dialog:
- `Coordinator`:
The coordinator directs each participant database server to prepare to commit the transaction.
- `Participants`:
Every participant notifies the coordinator whether it can commit to its transaction branch.
- `Coordinator`:
The coordinator, based on the response from each participant, decides whether to commit or roll back the transaction. It decides to commit only if all participants indicate that they can commit to their transaction branches. If any participant indicates that it is not ready to commit to its transaction branch (or if it does not respond), the coordinator decides to end the global transaction.

**Commit phase:**

During the commit phase, the coordinator and participants perform the following dialog:
- `Coordinator`:
The coordinator writes the commit record or rollback record to the coordinator's logical log and then directs each participant to either commit or roll back the transaction.
- `Participants`:
If the coordinator issued a commit message, the participants commit the transaction by writing the commit record to the logical log and then sending a message to the coordinator acknowledging that the transaction was committed. If the coordinator issued a rollback message, the participants roll back the transaction but do not send an acknowledgment to the coordinator.
- `Coordinator`:
If the coordinator issues a message to commit the transaction, it waits to receive acknowledgment from each participant before it ends the global transaction. If the coordinator issued a message to roll back the transaction, it does not wait for acknowledgments from the participants.

Let's see how it can be used in the example of a token swap contract. We consider the following situation: the account wants to exchange his tokens (let’s call it tokenA) for other tokens (tokenB) using the liquidity pool in the swap contract.

In that case the swap contract is a coordinator contract and tokens contracts are participants.

The swap contract makes the following steps:

**Prepare phase**

- `Swap contract:`
Swap contract sends the messages to token contracts to prepare transfer tokens (Messages can be sent in parallel). In fact, token contracts must lock funds at this stage.
- `Token contract`:
Token contracts make all necessary checks, and in case of success, lock funds and reply to the swap contract that they are ready to make a transaction.
- `Swap contract`:
Swap contract handles the messages from the token contracts and decides whether to commit or abort the global transaction.
receives tokens B. The situation here is the same as in the first step.

![img alt](./img/2.prepare.png#gh-light-mode-only)
![img alt](./img/2.prepare-dark.png#gh-dark-mode-only)

**Commit phase**

- `Swap contract`:
If token contracts confirm their readiness to execute the transaction, the swap contract sends them a message to commit the state. Otherwise, the swap contract tells them to abort the transaction.
- `Token contract`:
Token contracts finally change their state and send replies to the swap contract;
- `Swap contracts:
Swap contract handles the messages from the token contracts and saves the result about transaction execution.

![img alt](./img/2.commit.png#gh-light-mode-only)
![img alt](./img/2.commit-dark.png#gh-dark-mode-only)

Of course, all that workflow handles the case when the gas runs out during the message execution.

`Pros:`
- Messages can be sent in parallel;
- If cases with a lack of gas are taken into account, then the data consistency is achieved.

`Cons:`
- The participants have to wait for the message from the coordinator, they can’t commit or abort themselves;
- The coordinator plays an important role: if it fails to send the message then all participants go to the blocked state (in our example: the funds in token contracts are blocked).

## Three phase commit protocol.

**Theory**: It is similar to two-phase commit protocol but it tries to solve the problems with blocking the state of participants and to give the participants the opportunity to recover their states themselves.

**Prepare phase:**
The same steps of two phase commit protocol are followed here:
- `Coordinator`:
The coordinator sends a prepare message to all participants and waits for replies;
- `Participants`:
If the participants are ready to commit a transaction they send the ready message, otherwise they send no message to the coordinator.
- `Coordinator`:
Based on replies the coordinator decides either to go to the next state or not. If any of the participants respond with no message or if any of the participants fails to respond within a defined time, the coordinator sends an abort message to every participant.  It is important to highlight the differences from two phase commit protocol:
   - The coordinator limits the response time from the participant. We can implement this by sending a message with an indicated amount of gas or indicated number of blocks the coordinator is ready to wait;
   - If the coordinator fails at this state, then the participants are able to abort the transaction (i.e. unlock their state) using delayed messages. So, in that phase, the timeout cases abort.

**Prepare-to-commit phase:**
- `Coordinator`:
The coordinator sends a prepare-to-commit message to all participants and gets acknowledgements from everyone;
- `Participants`:
Receiving a prepare-to-commit message, a participant knows that the unanimous decision was to commit. As was already mentioned in the prepare phase, if a participant fails to receive this message in time, then it aborts. However, if a participant receives an abort message then it can immediately abort the transaction.
The possible problem: the coordinator fails during sending a prepare-to-commit to participants. So some participants are in phase 2, others are in phase 1. It's a disaster because the first group will commit, the second group will abort in case of timeout.
So we have to make sure that If one of the participants has received a precommit message, they can all commit. If the coordinator falls, any of the participants, being at the second stage, can become the coordinator itself and continue the transaction.
- `Coordinator`:
Having received acknowledgements from all the participants, the coordinator goes to the next phase.

The three-phase commit protocol accomplishes two things:
1. Enables use of a `recovery coordinator` (it can be a coordinator itself that starts a new transaction, or a participant). If a coordinator died, a recovery coordinator can query a participant.
   - If the participant is found to be in phase 2, that means that every participant has completed phase 1 and voted on the outcome. The completion of phase 1 is guaranteed. It is possible that some participants may have received commit requests (phase 3). The recovery coordinator can safely resume at phase 2.
   - If the participant was in phase 1, that means NO participant has started commits or aborts. The protocol can start at the beginning.
   - If the participant was in phase 3, the coordinator can continue in phase 3 – and make sure everyone gets the commit/abort request
2. Every phase can now time out – there is no indefinite wait as in the two-phase commit protocol.
   - `Phase 1`:
Participant aborts if it doesn’t hear from a coordinator in time;
Coordinator sends aborts to all if it doesn’t hear from any participant.
   - `Phase 2`:
If a participant times out waiting for a coordinator, elect a new coordinator.

Let’s get back to our swap contract.

**Preparation phase**:
The following cases are possible:
- all token contracts receive the message;
- the swap contract fails to wait for response from any token contract
- the swap contract fails itself.

In the case of a fall, if a transaction isn't restarted, the swap contract will not move to the second phase and the token contracts will unlock their state using delayed messages.

![img alt](./img/3.prepare.png#gh-light-mode-only)
![img alt](./img/3.prepare-dark.png#gh-dark-mode-only)

**Pre-Commit phase**:
At this stage we can have a failure in the swap contract or in the token contract only due to the lack of gas.  To solve this problem we can use gas reservation as follows:
- The swap contract receives the information about error in its `handle_signal`;
- Using gas reservation (so, it’s necessary to care about gas reservations before), the swap contract sends a message to itself to restart the transaction from the second phase. (The same logic can also be used in the `preparation phase`).

![img alt](./img/3.precommit.png#gh-light-mode-only)
![img alt](./img/3.precommit-dark.png#gh-dark-mode-only)

**Commit phase**:
As in the previous stage we can have a failure only due to the lack of gas. Here it is not so critical, since at this stage all participants can commit themselves.

## Saga pattern
**Theory**:
A `saga` is a sequence of local transactions. Each local transaction updates the database and publishes a message or event to trigger the next local transaction in the saga. If a local transaction fails because it violates a business rule then the saga executes a series of compensating transactions that undo the changes that were made by the preceding local transactions. Thus, Saga consists of multiple steps whereas `2PC` acts like a single request.
There are two ways of coordination sagas:

- `Choreography` - each local transaction publishes domain events that trigger local transactions in other services;
- `Orchestration` - an orchestrator (object) tells the participants what local transactions to execute.

We will consider the `orchestration based Saga` where there would be an orchestrator (swap contract) to manage the entire operation from one center.

The swap operation consists of the following steps:

1. Swap contract receives a message to exchange tokens in the liquidity pool. So, it must transfer tokens A from the account to its address and then transfer tokens B to the user.
2. It creates the first task: transfer tokens from the user to the swap contract. It also creates a compensating transaction for the first task: transfer tokens from the swap contract back to the user. The second task is to transfer tokens from the swap contract to the user.
3. It starts executing the first task. If the execution fails, it cancels the transaction. If it’s successful, the swap contract executes the second task;
4. If the execution of the second task is successful, the transaction is completed. Otherwise, the swap contract executes the compensation transaction for the first task.

![img alt](./img/saga.png#gh-light-mode-only)
![img alt](./img/Saga-dark.png#gh-dark-mode-only)

It is important to note that compensatory transactions should not fail due to any logical error. They can only fall due to lack of gas. If this happens, then you need to restart the transaction again or use the gas reservation. The `idempotency` of the token contract guarantees that the transaction will be completed to the end without any duplicate transactions.


---
sidebar_position: 8
---

# Gas Reservation

Gas reservation is the powerful feature of Gear Protocol that enables the new approach to smart-contract programming and modern [use cases](../gear/distinctive-features).

Briefly, a program can send a message using gas that was reserved before instead of using gas from the currently processing message.

One of the key advantage of this feature is an ability of sending [messages delayed](./delayed-messages.md) in time automatically to any actor in the network - a user or another smart contract as well as to **itself**. In fact, a program is able to execute itself **unlimited** number of blocks (provided that enough gas for execution is kept available).

A program developer can provide a special function in the program's code which takes some defined amount of gas from the amount available for this program and reserves it. A reservation gets a unique identifier that can be used by a program to get this reserved gas and use it later.

To reserve the amount of gas for further usage use the [`ReservationId::reserve`](https://docs.gear.rs/gstd/struct.ReservationId.html#method.reserve) function:

```rust
let reservation_id = ReservationId::reserve(RESERVATION_AMOUNT, TIME)
    .expect("Reservation across executions");
```

You also have to indicate the block count within which the reserve must be used. Gas reservation is not free: the reservation for one block costs some gas. The `reserve` function returns [`ReservationId`](https://docs.gear.rs/gstd/struct.ReservationId.html), which one can use for sending a message with that gas. To send a message using the reserved gas:

```rust
msg::send_from_reservation(reservation_id, program, payload, value)
    .expect("Failed to send message from reservation");
```

If gas is not needed within the time specified during the reservation, it can be unreserved and the gas will be returned to the user who made the reservation.

```rust
id.unreserve().expect("Unreservation across executions");
```

Programs can have different executions, change state and evaluate somehow, but when it is necessary, a program can send a message with this reserved gas instead of using its own gas.

For example, let's consider the game that works completely on-chain. The players are smart contracts that compete with each other by implementing various playing strategies. Usually, in these types of games, there is a master contract that starts the game and controls the move order between the players.

To start the game, someone sends a message to the contract. The gas attached to this message is spent on the players' contracts, which in turn spend gas on their execution. Since the game can last quite a lot of rounds, the attached gas may not be enough to complete the game. You can send a message asking the program to continue the game, or you can use the gas reservation and make a fully automatic play.

Using gas reservation the contract will be able to hold the game without interruption.



---
sidebar_position: 2
---

# Gear Library

The Gear Protocol’s library `gstd` provides all the necessary and sufficient functions and methods for developing smart-contracts.

## Importing familiar types via prelude

The `gstd` default prelude lists things that Rust automatically imports into every program. It re-imports default `std` modules and traits. `std` can be safely replaced with `gstd` in the Gear programs on Rust.

See more details [here](https://docs.gear.rs/gstd/prelude/index.html).

## Message handling

The Gear Protocol allows users and programs to interact with other users and programs via messages. Messages can contain a `payload` that will be able to be processed during message execution. Interaction with messages is possible thanks to the module `msg`:

```rust
use gstd::msg;
```

Message processing is possible only inside the defined functions `init()`, `handle()`, `hadle_reply()`, and `state()`. They also define the context for processing such messages.

- Get a payload of the message currently being processed and decode it:

```rust
#![no_std]
use gstd::{msg, prelude::*};

#[no_mangle]
extern "C" fn handle() {
    let payload_string: String = msg::load().expect("Unable to decode `String`");
}
```

- Reply to the message with payload:

```rust
#![no_std]
use gstd::msg;

#[no_mangle]
extern "C" fn handle() {
    msg::reply("PONG", 0).expect("Unable to reply");
}
```

- Send message to user:

```rust
#![no_std]
use gstd::{msg, prelude::*};

#[no_mangle]
extern "C" fn handle() {
    // ...
    let id = msg::source();
    let message_string = "Hello there".to_string();
    msg::send(id, message_string, 0).expect("Unable to send message");
}
```

You can see more cases of using the `msg` module in our [documentation](https://docs.gear.rs/gstd/msg/index.html).

## Execution info

A program can get some useful information about the current execution context by using the `exec` module:

```rust
use gstd::exec;
```

- Send a reply after the block timestamp reaches the indicated date:

```rust
#![no_std]
use gstd::{exec, msg};

#[no_mangle]
extern "C" fn handle() {
    // Timestamp is in milliseconds since the Unix epoch
    if exec::block_timestamp() >= 1672531200000 {
        msg::reply(b"Current block has been generated after January 01, 2023", 0)
            .expect("Unable to reply");
    }
}
```

- Get self value balance of a program:

```rust
#![no_std]
use gstd::exec;

#[no_mangle]
extern "C" fn handle() {
    // Get self value balance in program
    let my_balance = exec::value_available();
}
```

You can read more about program syscalls [here](https://docs.gear.rs/gstd/exec/index.html).

## Logging inside the contracts

Macro `gstd::debug` provides an ability to debug contract during program execution:

```rust
#![no_std]
use gstd::{debug, msg, prelude::*};

#[no_mangle]
extern "C" fn handle() {
    let payload_string: String = msg::load().expect("Unable to decode `String`");
    debug!("Received message: {payload_string:?}");
}
```

:::note

The `debug!` macro is available only when the `"debug"` feature is enabled for the `gstd` crate.

```toml
[dependencies]
gstd = { git = "https://github.com/gear-tech/gear.git", tag = "v1.0.2", features = ["debug"] }
```

:::



---
sidebar_label: Asynchronous Programming
sidebar_position: 6
---

# Asynchronous Programming

Asynchronous interaction between Gear programs is similar to the usual asynchronous request in using `await` and implemented by sending a message.

## Program entry points

If a program's logic implies asynchronous messaging, its main executable functions must differ from those used in synchronous communications.

### async init()

In case of an asynchronous call in the program initialization, the `async init()` must be used instead of `init()`. Also, it should be preceded by the [`gstd::async_init`](https://docs.gear.rs/gstd/attr.async_init.html) macro:

```rust
#[gstd::async_init]
async fn init() {
    gstd::debug!("Hello world!");
}
```

### async main()

The same for asynchronous messages, the `async main()` must be used instead of `handle()` and `handle_reply()`. Also, it should be preceded by the [`gstd::async_main`](https://docs.gear.rs/gstd/attr.async_main.html) macro:

```rust
#[gstd::async_main]
async fn main() {
    gstd::debug!("Hello world!");
}
```

:::info

`async init` сan be used together with `async main`. But functions `init`, `handle_reply` cannot be specified if this macro is used.

:::

# Cross-program message

To send a message to a Gear program, use the [`msg::send_for_reply()`](https://docs.gear.rs/gstd/msg/fn.send_for_reply.html) function. In this function:

- `program` - the address of the program to send the message for;
- `payload` - the message to the program;
- `value` - the funds attached to the message (zero if no value is attached);
- `reply_deposit` - used to provide gas for future reply handling (skipped if zero).

To get an encoded reply from another actor use the [`msg::send_for_reply_as()`](https://docs.gear.rs/gstd/msg/fn.send_for_reply_as.html) function.

```rust
pub fn send_for_reply_as<E: Encode, D: Decode>(
    program: ActorId,
    payload: E,
    value: u128,
    reply_deposit: u64
) -> Result<CodecMessageFuture<D>>
```

Usage example:

```rust
let reply: SomeEvent = msg::send_for_reply_as(
    receiver_id,
    SomeAction {
        command: 42,
    },
    0,
    0,
)
.expect("Unable to send message")
.await
.expect("Error in receiving reply");
```



---
sidebar_label: Introduction
sidebar_position: 1
---

# Attention developers!

:::important
 Want to take your blockchain development skills to the next level? Join **[Gear Academy's](https://academy.gear.foundation/)** free course, "Gear Smart Contract Developer." In this comprehensive course, you'll learn the ins and outs of developing on the Gear Protocol, from deploying programs onto the blockchain and interacting with them, to testing your programs on the Gear Network. You'll also gain hands-on experience navigating the `@gear-js` library for interacting with contracts on the client side and developing real-world applications, including contracts and frontends. Don't miss this opportunity to become a pro Gear blockchain developer. Enroll now in Gear Academy's **"[Gear Smart Contract Developer](https://academy.gear.foundation/course/tamagotchi)"** course!
:::

## What is a Gear smart contract?

Gear smart contract a just a program that runs on the Gear Protocol. It is a piece of code compiled to Wasm that is deployed to the blockchain and can be executed by anyone who sends a message to it. The program can store data, receive and send messages, and perform any other actions that are allowed by the Gear Protocol.

Every program should have a set of exported functions that can be called by the Gear Protocol. These functions are called entry points. The Gear Protocol has a set of predefined entry points that are used to initialize the program, handle incoming messages, and process replies to previously sent messages.

But we can't implement any business logic without using imported functions that form the API for the program. The Gear Protocol has a set of predefined API functions that can be used by any program. There are low-level functions that allow us to load incoming message's payload, send messages, and perform other actions. And there are higher-level libraries that allow us to interact with the Gear Protocol in a more convenient way.

## Predefined entry points (exported functions)

The central exported function of the Gear smart contract is `handle()`. It is called every time the program receives an incoming message. Below is the Rust example code:

```rust
#[no_mangle]
extern "C" fn handle() {
    // Execute this code during explicitly incoming message
}
```

This function is obligatory to be defined in the program.

In this function, we are to define the main business logic of our program. For example, we can check the incoming message and perform some actions depending on the message type. Also, we can send a message to another program. Finally, we can send a reply to the message that was received by the program.

As with any other program intended to be executed in some environment, Gear smart contract has its own lifecycle. It is initialized, receives messages, and can be terminated. We are to define the optional `init()` function if we want to perform some actions during the initialization of the program. For example, we can store some data in the program's memory. The `init()` function is called only once during the program initialization.

```rust
#[no_mangle]
extern "C" fn init() {
    // Execute this code during contract initialization
}
```

If there is no `init()` function in the program, the program will be initialized without any custom actions.

And the third most important function is `handle_reply()`. It is called when the program receives a reply to the message that was sent by the program. For example, we can check the reply and perform some actions depending on the reply type.

```rust
#[no_mangle]
extern "C" fn handle_reply() {
    // Execute this code during handling reply on the previously sent message
}
```

There is no need to define the `handle_reply()` function if the program doesn't intend to receive replies. In this case, the program will ignore all incoming replies.

The reply message is similar to the ordinary message, but it has some differences:

- The reply message is sent to the user or program that has sent the original message. We can't set the destination of the reply message explicitly.
- We can send only one reply message per execution. We get an error if we try to send more than one reply message.
- Even if the program execution is failed (for example, panic is called or the gas limit is exceeded), the reply message will be sent anyway.
- The reply message is processed in `handle_reply()` function instead of `handle()` function for the ordinary message. We have mentioned this above but it is worth to underline it again.

## API functions (imported functions)

There are a lot of imported functions that can be used by the Gear smart contract. They are called API functions. These functions are provided by the runtime that executes the Gear smart contract. The most convenient way to use these functions is to use the Gear standard library called [`gstd`](https://docs.gear.rs/gstd/). It is a set of high-level functions that are implemented on top of the low-level API functions.

More details about the Gear standard library can be found in the [Gear Library](/docs/developing-contracts/gstd.md) section.

## Basic stages of the Gear smart contract lifecycle

Let's explore the typical lifecycle of a Gear smart contract. We will use the Rust programming language for the examples, but the same principles are applied to any other language that can be compiled into Wasm.

**Step 1.** Write the program code.

You can find the minimal example in the [Getting Started](/docs/getting-started-in-5-minutes.md) section. It is a simple program that stores the counter, can increment and decrement it, and return the current value of the counter.

More advanced examples can be found in the Gear Fooundation organization on GitHub: https://github.com/gear-foundation

**Step 2.** Test the program.

We recommend using the [`gtest`](https://docs.gear.rs/gtest/) crate for testing Gear smart contracts. It allows us to write unit tests for the program and run them in the local environment.

The more advanced way to test the program is to use the [`gclient`](https://docs.gear.rs/gclient/) crate that allows you to run the program in the blockchain network. It is useful when you need to test the program in a real environment.

You can find more details about testing in the [Program Testing](./testing.md) section.

**Step 3.** Compile the program into Wasm.

We recommend using the [`gear-wasm-builder`](https://docs.gear.rs/gear_wasm_builder/) crate in a custom build script `build.rs`.

Add it to the `[build-dependencies]` section in the `Cargo.toml` file:

```toml
[build-dependencies]
gear-wasm-builder = { git = "https://github.com/gear-tech/gear.git", tag = "v1.0.2", features = ["wasm-opt"] }
```

And add the following code to the `build.rs` file:

```rust
fn main() {
    gear_wasm_builder::build();
}
```

You can find built Wasm files in the `target/wasm32-unknown-unknown/release` directory.

**Step 4.** Deploy the program to the blockchain.

Program deployment is a process of storing the program's Wasm code on the blockchain and its initialization. The user pays a fee for the deployment transaction. The program is deployed to the blockchain only once. After that, it can be executed by anyone by sending a message to it.

If initialization fails (for example, the program panics in the `init()` function), the program is not deployed and the user gets an error.

Also, it is important to underline that someone should pay rent for keeping the program in the blockchain after a free period that is equal to 5 million blocks (it is about 2 months for networks with 1 block per second production). It is possible to add funds for rent using the [`pay_program_rent`](https://docs.gear.rs/pallet_gear/pallet/struct.Pallet.html#method.pay_program_rent) extrinsic (by the user) or with the [`gstd::exec::pay_program_rent`](https://docs.gear.rs/gstd/exec/fn.pay_program_rent.html) API function (by the program). If the rent is not paid, the program state changes to pause, its persistent memory is removed from the storage, and the program can't be executed. The program can be resumed by uploading its memory pages to the blockchain and paying the rent.

You can find more details about program deployment in the [Upload Program](./deploy.md) section.

**Step 5.** Execute the program.

The program can be executed by sending a message to it. The message can be sent by the user or by another program. The user pays a fee for the message execution. The program can send a reply to the message. The reply is sent to the user or program that has sent the original message.

**Step 6.** Terminate the program.

The program can be terminated by calling the [`gstd::exec::exit`](https://docs.gear.rs/gstd/exec/fn.exit.html) function. Also, the program is paused if the rent is not paid.

The program can't be executed after termination.

## Smart contract key features

Gear smart contracts have a lot of features that make them unique. Let's explore the most important of them.

### State function

Gear smart contracts can store the state in persistent memory. Anyone can read this memory from the blockchain.

To make state reading more convenient, Gear smart contracts can define the `state()` function.

```rust
#[no_mangle]
extern "C" fn state() {
    msg::reply(any_encodable_data, 0).expect("Failed to share state");
}
```

This function is stored in the blockchain in the same Wasm blob with `handle()` and `init()` functions. But unlike them, it is not executed using extrinsic and doesn't affect the blockchain state. It can be executed for free by any node with a fully synchronized blockchain state. There is a dedicated [`read_state`](https://docs.gear.rs/pallet_gear_rpc/trait.GearApiServer.html#tymethod.read_state) RPC call for this.

The data returned by the `state()` function can be converted to any convenient representation by using a state-conversion program. This is a separate program compiled into Wasm and dedicated to being executed on the off-chain runner. It should contain a set of meta-functions that accept the data returned by the `state()` function and return the data in a convenient format. There is a dedicated [`read_state_using_wasm`](https://docs.gear.rs/pallet_gear_rpc/trait.GearApiServer.html#tymethod.read_state_using_wasm) RPC call for reading the program state using the state-conversion program.

More details about state functions can be found in the [State Functions](./state.md) section.

### Asynchronous programming

In some cases, it is more convenient to express some concepts in an asynchronous programming style. For example, when you need to wait for a reply from another program or wait for a certain time.

Under the hood, the `async`/`await` syntax is a kind of syntactic sugar that generates a state machine around [`gstd::exec::wait`](https://docs.gear.rs/gstd/exec/fn.wait.html) and [`gstd::exec::wake`](https://docs.gear.rs/gstd/exec/fn.wake.html) functions. The state machine is stored in the program's persistent memory.

Note that in case of using async functions, you are to declare the `async main()` function with `#[async_main]` attribute instead of the `handle()` function:

```rust
#[gstd::async_main]
async fn main() {
    // Async code here
}
```

The initialization function can also be declared as an async function:

```rust
#[gstd::async_init]
async fn init() {
    // Async init code here
}
```

You can find more details about asynchronous programming in the [Asynchronous Programming](./interactions-between-programs.md) section.

### Creating programs from programs

Both users and programs are actors in terms of the Gear smart contract model. Therefore, any actor can create a new program and deploy it to the blockchain.

The only pre-requisite is that the code of the program should be stored in the blockchain. This can be done by using the [`upload_code`](https://docs.gear.rs/pallet_gear/pallet/struct.Pallet.html#method.upload_code) extrinsic that returns an identifier of the uploaded code. The code can be uploaded only once, then it can be used for creating multiple programs.

There are several helper functions for creating programs from programs in the [`gstd::prog`](https://docs.gear.rs/gstd/prog/) module.

More details about creating programs from programs can be found in the [Create Program](./create.md) section.

### Gas reservation

Gear smart contracts use gas for measuring the complexity of the program execution. The user pays a fee for the gas used by the program. Some part of the gas limit may be reserved during the current execution to be spent later. This gas reserving mechanism can be used to shift the burden of paying for program execution from one user to another. Also, it makes it possible to run some deferred actions using delayed messages described below.

You can find more details about gas reservation in the [Gas Reservation](./gas-reservation.md) section.

### Delayed messages

Gear smart contracts can send messages to other actors not only during the current execution but also after some time. This mechanism can be used to implement deferred actions.

Use functions with `*_delayed` suffix from [`gstd::msg`](https://docs.gear.rs/gstd/msg/index.html) module to send a delayed message to a program or user. The message will be sent after the specified number of blocks.

More details about delayed messages can be found in the [Delayed Messages](./delayed-messages.md) section.

### System signals

Sometimes the system that executes the program should communicate with it in some manner. For example, the program should be notified when the rent is not paid. This can be done by using system signals.

The `handle_signal()` function should be declared in the program to handle system signals. It is executed when the program receives a system signal.

```rust
 #[no_mangle]
extern "C" fn handle_signal() {
    // Handle system signal here
}
```

You can find more details about system signals in the [System Signals](./system-signals.md) section.

### Reply deposit

Usually the reply sender pays a gas fee for the reply message execution. But sometimes it is more convenient to shift this burden to the program that receives the reply. This can be done by using the reply deposit mechanism.

The reply deposit is a part of the gas limit reserved during the current execution to be spent later. The reserved gas can be used to pay for the reply message execution. To do this, the program should call the [`gstd::exec::reply_deposit`](https://docs.gear.rs/gstd/exec/fn.reply_deposit.html) function. This function provides a gas deposit from the current message to handle the reply message on the given message ID. This message ID should be sent within the execution. Once the destination actor or system sends a reply to it, the gas limit ignores it; if the program gives a deposit, only it will be used for the execution of `handle_reply`.

You can find more details about reply deposit in the [Reply Deposit](./reply-deposit.md) section.



---
sidebar_position: 3
---

# Mailbox

When the program sends a message to the user (e.g., using the [`msg::send`](https://docs.gear.rs/gstd/msg/fn.send.html) function), this message is placed in the user's mailbox. Actually, the mailbox is a dedicated storage that keeps a message received from a program.

The user can detect a message received by subscribing to the [`UserMessageSent`](https://docs.gear.rs/pallet_gear/pallet/enum.Event.html#variant.UserMessageSent) event. It's important to note that the reply (sent using the [`msg::reply`](https://docs.gear.rs/gstd/msg/fn.reply.html) function) doesn't go to the mailbox, it just generates an event.

When using the IDEA website one should go to the https://idea.gear-tech.io/mailbox section.

:::note

A message is charged for being in the mailbox. Therefore, a message can be in the mailbox for a limited time.

:::

Let's explore possible user reactions to the mailbox's message.

## User sends a reply to the message

The program can send a message to the user and wait for a reply from him. The user can reply using a [`send_reply`](https://docs.gear.rs/pallet_gear/pallet/struct.Pallet.html#method.send_reply) extrinsic. The value associated with the message is transferred to the user's account, the message is removed from the mailbox, and the new reply message is added to the message queue.

## User claims value from a message in the mailbox

If a message in the mailbox has an associated value, the user can claim it using a [`claim_value`](https://docs.gear.rs/pallet_gear/pallet/struct.Pallet.html#method.claim_value) extrinsic. Value is transferred to the user's account and the message is removed from the mailbox.

## User ignores a message in the mailbox

A message is charged for every block in the mailbox within its gas limit. If the message hasn't an explicit gas limit, gas is borrowed from the origin's limit (e.g. an actor that has initiated the execution).

When the message's gas runs out, the message is removed from the mailbox, and the associated value transferred back to the message sender.



---
sidebar_label: Metadata
sidebar_position: 5
---

# Metadata

Metadata is a kind of interface map that helps to transform a set of bytes into an understandable structure and indicates the function this structure is intended for. Metadata determines how all incoming and outgoing data will be encoded/decoded.

Metadata allows dApp’s parts - the smart-contract and the client side (JavaScript), to understand each other and exchange data.

To describe metadata interface use `gmeta` crate:

```rust
use gmeta::{InOut, Metadata, Out};

pub struct ProgramMetadata;

// Be sure to describe all the types.
// But if any of the endpoints is missing in your program, you can use ();
// as indicated in the case of `type Signal`.

impl Metadata for ProgramMetadata {
    type Init = InOut<MessageInitIn, MessageInitOut>;
    type Handle = InOut<MessageIn, MessageOut>;
    type Others = InOut<MessageAsyncIn, Option<u8>>;
    type Reply = String;
    type Signal = ();
    type State = Out<Vec<Wallet>>;
}
```

As we can see, metadata enables you to determine the expected data at the input/output for the contract at each endpoint. Where:

- `Init` - describes incoming/outgoing types for `init()` function.
- `Handle` - describes incoming/outgoing types for `handle()` function.
- `Others` - describes incoming/outgoing types for `main()` function in case of asynchronous interaction.
- `Reply` - describes an incoming type of message performed using the `handle_reply` function.
- `Signal` - describes only the outgoing type from the program while processing the system signal.
- `State` - describes the types for the queried State

## Generate metadata

To generate metadata, the following `build.rs` file in the root of your project folder is required:

```rust
// build.rs
// Where ProgramMetadata is your metadata structure

use meta_io::ProgramMetadata;

fn main() {
    gear_wasm_builder::build_with_metadata::<ProgramMetadata>();
}
```

As a result of the smart-contract compilation, a `*.meta.txt` file will be generated. This metadata file can be used in the UI applications that will interact with this smart-contract. The file’s content looks like a hex string:

```
0002000000010000000001000000000000000000010100000009021c00082c74656d706c6174655f696f2050696e67506f6e670001081050696e6700000010506f6e670001000004000002080008000004080c18000c10106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004001001205b75383b2033325d000010000003200000001400140000050300180000050700
```


---
sidebar_label: Program Rent
sidebar_position: 12
sidebar_class_name: hidden
---

# Program Rent

Gear Protocol utilizes a rent-based program management system. When developers upload a program (smart contract) to the network, its expiration date is assigned. The expiration period is measured in blocks.

After the expiration date, the program is automatically removed from storage, unless the owner chooses to extend its life by paying rent. The owner must indicate the number of additional blocks they can pay for, and they need to pay the rent in utility tokens to keep the program active beyond its initial expiration date.

:::info
Current initial rent period: ***5,000,000*** blocks (on Vara it will be around 173 days)
:::

After uploading a program, you can observe a similar event:

`gear.ProgramChanged`

```json
{
    "id": "0xde76e4cf663ff825d94944d6f060204e83fbb5e24f8dfdbbdc25842df4f4135d",
    "change": {
        "Active": {
            "expiration": "12,834,248"
        }
    }
}
```

## How to extend the rent of the program?

To extend the rent period of a program, simply call the special extrinsic `gear.payProgramRent(programId, blockCount)`. [See more](/docs/api/program-rent)

## Can I restore a deleted program?

Yes. Since the blockchain stores all states for the entire history, you can restore the program's state to the previous block before it was deleted.

## Why does Gear use the program rent system?

- Optimization and efficient resource usage
- Stimulating utility token usage


---
sidebar_label: Reply Deposit
sidebar_position: 11
---

# Reply deposit

When a program or user sends a reply to a message, it should provide gas for the reply handling. The user replies using [`gear.sendReply`](https://docs.gear.rs/pallet_gear/pallet/struct.Pallet.html#method.send_reply) extrinsic. The program uses the [`msg::reply`](https://docs.gear.rs/gstd/msg/fn.reply.html) or [`msg::reply_with_gas`](https://docs.gear.rs/gstd/msg/fn.reply_with_gas.html) function.

Sometimes, it is more convenient to provide gas for the reply handling in advance. For example, if the program sends a message to another program and waits for a reply, it can provide gas for the reply handling in advance. In this case, the program doesn't need to provide gas for the reply handling when it sends a reply.

To provide gas for the reply handling in advance, the program should use the [`exec::reply_deposit`](https://docs.gear.rs/gstd/exec/fn.reply_deposit.html) function:

```rust
let message_id =
    msg::send(msg::source(), b"Outgoing message", 0).expect("Failed to send message");
exec::reply_deposit(message_id, 1_000_000_000).expect("Error during reply deposit");

#[no_mangle]
extern "C" fn handle_reply() {
    // The reply handling will be paid with the deposited gas
}
```

The program can deposit gas when using the [`msg::send_for_reply`](https://docs.gear.rs/gstd/msg/fn.send_for_reply.html) function by setting the `reply_deposit` parameter. The `reply_deposit` parameter is the amount of gas that will be reserved for the reply handling. The `reply_deposit` parameter is optional. If the `reply_deposit` parameter is zero, the program should provide gas for the reply handling when it sends a reply.

```rust
let message_id = msg::send_for_reply(
    msg::source(),
    b"Outgoing message",
    0,
    1_000_000_000,
).expect("Failed to send message");

#[no_mangle]
extern "C" fn handle_reply() {
    // The reply handling will be paid with the deposited gas
}
```



---
sidebar_label: State Functions
sidebar_position: 4
---

# Store data

Persistent data of the Gear smart contract is stored in the same way as in a classic program and does not require initialization of the external storage.

```rust
// Describe state structure
#[derive(TypeInfo, Decode, Encode, Clone)]
pub struct Wallet {
    pub id: ActorId,
    pub person: String,
}

// Declare and initialize the state
static mut WALLETS: Vec<Wallet> = Vec::new();
```

If you're programming in Rust or other object-oriented languages, you should be familiar with most types. However, the `ActorId` type is something new when developing contracts via the Gear Protocol.

:::info

[`ActorId`](https://docs.gear.rs/gstd/struct.ActorId.html) is a special type that represents an 32 bytes array and defines any `ID` in Gear Protocol.

:::

## State functions

To display the contract state information, the `state()` function is used. It allows you to instantly read the contract status (for example, contract balance). Reading state is a free function and does not require gas costs.

Example of the returning all wallets defined above:

```rust
#[no_mangle]
extern "C" fn state() {
    msg::reply(unsafe { WALLETS.clone() }, 0).expect("Failed to share state");
}
```

Additionally, you can handle incoming payload and return only the necessary part of the state. For example, you can return only the selected wallet:

```rust
#[no_mangle]
extern "C" fn state() {
    let index: usize = msg::load().expect("Unable to decode `usize`");
    let wallets = unsafe { WALLETS.clone() };
    if index < wallets.len() => {
        msg::reply(wallets[index], 0).expect("Failed to share state");
    } else {
        panic!("Wallet index out of bounds");
    }
}
```

## Custom program to read the state

Additionally, you can create your own program to read the state. This wrapper will allow you to implement custom functions for the client side, not depending on the main program.

This has a number of advantages, for example, you will always be able to read the state even if the program changes (as long as the incoming or outgoing types have not changed). Or you are creating a service based on an already existing program and you need some of your own functions to get your own chanks of data from the state.

To do this, we need to create an independent program and describe the necessary functions inside the `metawasm` trait. For example:

```rust
// ...
use gmeta::metawasm;

#[metawasm]
pub mod metafns {
    pub type State = Vec<Wallet>;

    pub fn all_wallets(state: State) -> Vec<Wallet> {
        state
    }

    pub fn first_wallet(state: State) -> Option<Wallet> {
        state.first().cloned()
    }

    pub fn last_wallet(state: State) -> Option<Wallet> {
        state.last().cloned()
    }
}
```

Or more complex example:

```rust
// ...
use gmeta::metawasm;

#[metawasm]
pub mod metafns {
    pub type State = Vec<Wallet>;

    pub fn wallet_by_id(state: State, id: Id) -> Option<Wallet> {
        state.into_iter().find(|w| w.id == id)
    }

    pub fn wallet_by_person(state: State, person: String) -> Option<Wallet> {
        state.into_iter().find(|w| w.person == person)
    }
}
```

To build `*.meta.wasm`, the following `build.rs` file in the root of your project is required:

```rust
fn main() {
    gear_wasm_builder::build_metawasm();
}
```

[Learn more](./metadata.md) how metadata works.



---
sidebar_label: System Signals
sidebar_position: 10
---

# System signals

The Gear Protocol ensures system and program's state consistency via introducing special handling mechanisms for potential issues and corner cases.

Gear actors have three common entry points - `init`, `handle`, `handle_reply`. Another special system entry point introduced by the Gear Protocol is `handle_signal`. It allows the system to communicate with programs if it is necessary to notify (signal) that some event related to the program's messages has happened. Only the system (Gear node runtime) can send signal messages to a program.

First of all, it can be useful to free up resources occupied by the program. A custom async logic in Gear implies storing `Futures` in a program's memory. The execution context of `Futures` can occupy some significant amount of memory in the case of many futures. When a program sends a message and waits for a reply to be woken, the reply can not be received. So there might be the case that if the initial message in the waitlist runs out of gas or the gas amount is not enough to properly finish the execution, the program’s state will be rolled back and `Future` will never be freed.

In this case, `Futures` remain in memory pages forever. Other messages are not aware of `Futures` associated with other messages. Over time, `Futures` accumulate in the program's memory so eventually a large amount of Futures limits the max amount of space the program can use.

In case a message has been removed from the waitlist due to gas constraints, the system sends a system message (signal) that is baked by an amount of [reserved gas](/developing-contracts/gas-reservation.md), which informs the program that it’s message was removed from the waitlist. Based on this info, a program can clean up its used system resources (`Futures`).

The `gstd` library provides a separate [`exec::system_reserve_gas`](https://docs.gear.rs/gstd/exec/fn.system_reserve_gas.html) function for reserving gas specifically for system signal messages. It cannot be used for sending other regular cross-actor messages:

```rust
exec::system_reserve_gas(1_000_000_000).expect("Error during system gas reservation");
```

Even if this function hasn't been called, the system will reserve gas for system messages automatically with the [default amount](https://docs.gear.rs/gstd/struct.Config.html#structfield.system_reserve) of `1_000_000_000`.

If a signal message appears, it uses gas specifically reserved for such kinds of messages. If no gas has been reserved for system messages, they are just skipped and the program will not receive them.

If gas has been reserved but no system messages occur during the current execution, then this gas returns back from where it was taken. The same relates to gas reserved for non-system messages - gas returns back after a defined number of blocks or by the program’s command.

`handle_signal` has a default implementation if the smart contract has `async init` or/and `async main` functions (see [Asynchronous Programming](/developing-contracts/interactions-between-programs.md) for more details about async entry points). To define your own signal handler, you need to use the [`gstd::async_init`](https://docs.gear.rs/gstd/attr.async_init.html)/[`gstd::async_main`](https://docs.gear.rs/gstd/attr.async_main.html) macro with the specified `handle_signal` argument. For example:

```rust
#[gstd::async_main(handle_signal = my_handle_signal)]
async fn main() {
    // ...
}

fn my_handle_signal() {
    // ...
}
```

:::info

Note that the custom signal handler derives its default behavior.

:::

Some useful functions that can be used in `handle_signal`:

- [`msg::signal_from`](https://docs.gear.rs/gstd/msg/fn.signal_from.html) - returns an identifier of the message which caused the signal;
- [`msg::signal_code`](https://docs.gear.rs/gstd/msg/fn.signal_code.html) - returns the reason code of the signal (see [`SignalCode`](https://docs.gear.rs/gstd/errors/enum.SignalCode.html) enum for more details).

It can be useful for a developer when writing communication between programs. Developer can define `my_handle_signal` function and implement some logic there. For example, `Program A` sent a message to `Program B`. `Program A` is waiting for a reply from `Program B` but `Program B` runs out of gas. The current execution will be interrupted, but the system will send a signal to `Program A` and indicates the message identifier during which the execution was interrupted.
So, `Program A` sends a message and saves the message identifier:

```rust
exec::system_reserve_gas(2_000_000_000)
    .expect("Error during system gas reservation");
let result = msg::send_for_reply(address, payload, value, reply_deposit);

let (msg_id, msg_future) = if let Ok(msg_future) = result {
    (msg_future.waiting_reply_to, msg_future)
} else {
    // handle the error here
};

// save the `msg_id` in program state
unsafe { STATE.msg_id == msg::id() };

let reply = msg_future.await;
```
The execution fails in `Program B`, and `Program A` receives a signal:
```rust
#[no_mangle]
extern "C" fn my_handle_signal() {
    if unsafe { STATE.msg_id == msg::signal_from() } {
        // write logic here
    }
}
```
However, it is important to understand that the execution of `my_handle_signal` should not be long and should not consume a lot of gas. It can be used for tracking failures during the transaction. The program can use the information about failures the next time it is executed.

For programs written using the Gear Protocol's `gstd` library, such signals can be sent to programs automatically under the hood when applicable. If a smart contract developer implements a program using `gcore` or Gear's syscalls, then such signals should be considered in the program's code explicitly.


---
sidebar_position: 15
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

# Testing with `gclient`

`gclient` is intended to be used as a tool for testing Gear programs with a real blockchain network. It allows you to send extrinsics and RPCs by connecting to the network. We recommend using `gclient` for end-to-end testing to ensure the program works as expected in the real blockchain world.

It is essential to underline that testing with `gclient` requires the running node as the second part of the test suite. The `gclient` interacts with the node over the WebSocket protocol. Depending on the purpose of testing, `gclient` can communicate with either a local or a remote node. The best choice is to use the **local node in developer mode** for initial debugging and continuous integration.

Testing with `gclient` is slower than `gtest` and produces more build artifacts, so it is better suited as the last mile in quality control. However, `gclient` gives the most accurate test results.

## Import `gclient` lib

To use the `gclient` library, you must import it into your `Cargo.toml` file in the `[dev-dependencies]` block. Also, you need to add some external crates that are used together with `gclient`:

```toml
[package]
name = "first-gear-app"
version = "0.1.0"
authors = ["Your Name"]
edition = "2021"

[dependencies]
gstd = { git = "https://github.com/gear-tech/gear.git", tag = "v1.0.2", features = ["debug"] }

[build-dependencies]
gear-wasm-builder = { git = "https://github.com/gear-tech/gear.git", tag = "v1.0.2" }

[dev-dependencies]
gclient = { git = "https://github.com/gear-tech/gear.git", tag = "v1.0.2" }
tokio = { version = "1", features = ["full"] }
```

## Running the node

The best way is to download the latest node binary for your operating system from https://get.gear.rs. Then unpack the package and run the node. Here and below, we assume the node is running in developer mode.

````mdx-code-block
<Tabs>
<TabItem value="linux" label="Linux x86-64" className="unique-tabs" default>

Terminal:

```bash
curl https://get.gear.rs/gear-v1.0.2-x86_64-unknown-linux-gnu.tar.xz | tar xJ
```

or

**Linux x86-64**: [gear-v1.0.2-x86_64-unknown-linux-gnu.tar.xz](https://get.gear.rs/gear-v1.0.2-x86_64-unknown-linux-gnu.tar.xz)

You can try to run the node:

```
❯ ./gear --version
gear 1.0.2-d02d306f97c
```

</TabItem>

<TabItem value="mac-arm" label="macOS ARM">

Terminal:

```bash
curl https://get.gear.rs/gear-v1.0.2-aarch64-apple-darwin.tar.xz | tar xJ
```

or

**macOS ARM**: [gear-v1.0.2-aarch64-apple-darwin.tar.xz](https://get.gear.rs/gear-v1.0.2-aarch64-apple-darwin.tar.xz)

You can try to run the node:

```
❯ ./gear --version
gear 1.0.2-d02d306f97c
```

</TabItem>
<TabItem value="mac-intel" label="macOS x86-64">

Terminal:

```bash
curl https://get.gear.rs/gear-v1.0.2-x86_64-apple-darwin.tar.xz | tar xJ
```

or

**macOS x86-64**: [gear-v1.0.2-x86_64-apple-darwin.tar.xz](https://get.gear.rs/gear-v1.0.2-x86_64-apple-darwin.tar.xz)

You can try to run the node:

```
❯ ./gear --version
gear 1.0.2-d02d306f97c
```

</TabItem>

<TabItem value="win64" label="Windows x86-64">

Terminal:

```bash
curl -O https://get.gear.rs/gear-v1.0.2-x86_64-pc-windows-msvc.zip
```

or

**Windows x86-64**: [gear-v1.0.2-x86_64-pc-windows-msvc.zip](https://get.gear.rs/gear-v1.0.2-x86_64-pc-windows-msvc.zip)

Unzip the downloaded package then you can try to run the node:

```
❯ gear.exe --version
gear.exe 1.0.2-d02d306f97c
```

</TabItem>
</Tabs>
````

Open the second terminal window and run tests using `cargo` as it was described in the [previous section](/developing-contracts/testing.md#building-a-program-in-test-mode).

## Simple example

Let's add an end-to-end test to our `first-gear-app` introduced in the [Getting Started](getting-started-in-5-minutes.md#creating-your-first-gear-smart-contract) section.

Add the `tests` directory next to the `src` directory and create the `end2end.rs` file in it.

```
└── first-gear-app
    ├── Cargo.toml
    ├── src
    │   └── lib.rs
    └── tests
        └── end2end.rs
```

`end2end.rs`:

```rust
use gclient::{EventProcessor, GearApi, Result};

const WASM_PATH: &str = "./target/wasm32-unknown-unknown/release/first_gear_app.opt.wasm";

#[tokio::test]
#[ignore]
async fn test_example() -> Result<()> {
    // Create API instance
    let api = GearApi::dev().await?;

    // Subscribe to events
    let mut listener = api.subscribe().await?;

    // Check that blocks are still running
    assert!(listener.blocks_running().await?);

    // Calculate gas amount needed for initialization
    let gas_info = api
        .calculate_upload_gas(
            None,
            gclient::code_from_os(WASM_PATH)?,
            vec![],
            0,
            true,
            None,
        )
        .await?;

    // Upload and init the program
    let (message_id, program_id, _hash) = api
        .upload_program_bytes_by_path(
            WASM_PATH,
            gclient::now_micros().to_le_bytes(),
            vec![],
            gas_info.min_limit,
            0,
        )
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());

    let payload = b"PING".to_vec();

    // Calculate gas amount needed for handling the message
    let gas_info = api
        .calculate_handle_gas(None, program_id, payload.clone(), 0, true, None)
        .await?;

    // Send the PING message
    let (message_id, _hash) = api
        .send_message_bytes(program_id, payload, gas_info.min_limit, 0)
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());

    Ok(())
}
```

Run the following command and wait for all tests to be green:

```shell
cargo test --release -- --include-ignored
```

It's recommended to mark with the `#[ignore]` attribute tests with `gclient` to separate their slow execution from the rest. To execute ignored tests with Cargo, add the `--include-ignored` flag after a double dash (`--`) as shown above.

Let's explore what we've done in the test function above.

Firstly, we instantiate the API that allows interaction with the node by calling correspondent extrinsics. Then we create an event listener, as getting the feedback from the node is possible only by subscribing to events. We use the API instance both for invoking RPC calls (e.g., calculating the gas amount needed for processing) and sending extrinsics (e.g., uploading the program and sending a message). Events listener allows us to get the result of operation.

## More details about `gclient`

Please refer to the [`gclient` docs](https://docs.gear.rs/gclient/) for more information about its capabilities and use cases.


---
sidebar_position: 14
---

# Testing with `gtest`

`gtest` simulates a real network by providing mockups of the user, program, balances, mailbox, etc. Since it does not include parts of the actual blockchain, it is fast and lightweight. But being a model of the blockchain network, `gtest` cannot be a complete reflection of the latter.

As we said earlier, `gtest` is excellent for unit and integration testing. It is also helpful for debugging Gear program logic. Nothing other than the Rust compiler is required for running tests based on `gtest`. It is predictable and robust when used in continuous integration.

## Import `gtest` lib

To use the `gtest` library, you must import it into your `Cargo.toml` file in the `[dev-dependencies]` block to fetch and compile it for tests only:

```toml
[package]
name = "first-gear-app"
version = "0.1.0"
authors = ["Your Name"]
edition = "2021"

[dependencies]
gstd = { git = "https://github.com/gear-tech/gear.git", tag = "v1.0.2" }

[build-dependencies]
gear-wasm-builder = { git = "https://github.com/gear-tech/gear.git", tag = "v1.0.2" }

[dev-dependencies]
gtest = { git = "https://github.com/gear-tech/gear.git", tag = "v1.0.2" }
```

## `gtest` capabilities

- Initialization of the common environment for running smart contracts:
```rust
    // This emulates node's and chain's behavior.
    //
    // By default, sets:
    // - current block equals 0
    // - current timestamp equals UNIX timestamp of your system.
    // - minimal message id equal 0x010000..
    // - minimal program id equal 0x010000..
    let sys = System::new();
```
- Program initialization:
```rust
    // Initialization of program structure from file.
    //
    // Takes as arguments reference to the related `System` and the path to wasm binary relatively
    // the root of the crate where the test was written.
    //
    // Sets free program id from the related `System` to this program. For this case it equals 0x010000..
    // Next program initialized without id specification will have id 0x020000.. and so on.
    let _ = Program::from_file(
        &sys,
        "./target/wasm32-unknown-unknown/release/demo_ping.wasm",
    );

    // Also, you may use the `Program::current()` function to load the current program.
    let _ = Program::current(&sys);

    // We can check the id of the program by calling `id()` function.
    //
    // It returns `ProgramId` type value.
    let ping_pong_id = ping_pong.id();

    // There is also a `from_file_with_id` constructor to manually specify the id of the program.
    //
    // Every place in this lib, where you need to specify some ids,
    // it requires generic type 'ID`, which implements `Into<ProgramIdWrapper>`.
    //
    // `ProgramIdWrapper` may be built from:
    // - u64;
    // - [u8; 32];
    // - String;
    // - &str;
    // - ProgramId (from `gear_core` one's, not from `gstd`).
    //
    // String implementation means the input as hex (with or without "0x")

    // Numeric
    let _ = Program::from_file_with_id(
        &sys,
        105,
        "./target/wasm32-unknown-unknown/release/demo_ping.wasm",
    );

    // Hex with "0x"
    let _ = Program::from_file_with_id(
        &sys,
        "0xe659a7a1628cdd93febc04a4e0646ea20e9f5f0ce097d9a05290d4a9e054df4e",
        "./target/wasm32-unknown-unknown/release/demo_ping.wasm",
    );

    // Hex without "0x"
    let _ = Program::from_file_with_id(
        &sys,
        "e659a7a1628cdd93febc04a4e0646ea20e9f5f0ce097d9a05290d4a9e054df5e",
        "./target/wasm32-unknown-unknown/release/demo_ping.wasm",
    );

    // Array [u8; 32] (e.g. filled with 5)
    let _ = Program::from_file_with_id(
        &sys,
        [5; 32],
        "./target/wasm32-unknown-unknown/release/demo_ping.wasm",
    );

    // If you initialize program not in this scope, in cycle, in other conditions,
    // where you didn't save the structure, you may get the object from the system by id.
    let _ = sys.get_program(105);
```
- Getting the program from the system:
```rust
    // If you initialize program not in this scope, in cycle, in other conditions,
    // where you didn't save the structure, you may get the object from the system by id.
    let _ = sys.get_program(105);
```
- Initialization of styled `env_logger`:
```rust
    // Initialization of styled `env_logger` to print logs (only from `gwasm` by default) into stdout.
    //
    // To specify printed logs, set the env variable `RUST_LOG`:
    // `RUST_LOG="target_1=logging_level,target_2=logging_level" cargo test`
    //
    // Gear smart contracts use `gwasm` target with `debug` logging level
    sys.init_logger();
```
- Sending messages:
```rust
    To send message to the program need to call one of two program's functions:
    // `send()` or `send_bytes()` (or `send_with_value` and `send_bytes_with_value` if you need to send a message with attached funds).
    //
    // Both of the methods require sender id as the first argument and the payload as second.
    //
    // The difference between them is pretty simple and similar to `gstd` functions
    // `msg::send()` and `msg::send_bytes()`.
    //
    // The first one requires payload to be CODEC Encodable, while the second requires payload
    // implement `AsRef<[u8]>`, that means to be able to represent as bytes.
    //
    // `send()` uses `send_bytes()` under the hood with bytes from payload.encode().
    //
    // First message to the initialized program structure is always the init message.
    let res = program.send_bytes(100001, "INIT MESSAGE");
```
- Processing the result of the program execution:
```rust
    // Any sending functions in the lib returns `RunResult` structure.
    //
    // It contains the final result of the processing message and others,
    // which were created during the execution.
    //
    // It has 4 main functions.

    // Returns the reference to the Vec produced to users messages.
    // You may assert them as you wish, iterating through them.
    assert!(res.log().is_empty());

    // Returns bool which shows that there was panic during the execution
    // of the main message.
    assert!(!res.main_failed());

    // Returns bool which shows that there was panic during the execution
    // of the created messages during the main execution.
    //
    // Equals false if no others were called.
    assert!(!res.others_failed());

    // Returns bool which shows that logs contain a given log.
    //
    // Syntax sugar around `res.log().iter().any(|v| v == arg)`.
    assert!(!res.contains(&Log::builder()));

    // To build a log for assertion you need to use `Log` structure with its builders.
    // All fields here are optional.
    // Assertion with Logs from core are made on the Some(..) fields
    // You will run into panic if you try to set the already specified field.
    //
    // Constructor for success log.
    let _ = Log::builder();

    // Constructor for error reply log.
    //
    // Note that error reply never contains payload.
    // And its exit code equals 1, instead of 0 for success replies.
    let _ = Log::error_builder();

    // Let’s send a new message after the program has been initialized.
    // The initialized program expects to receive a byte string "PING" and replies with a byte string "PONG".
    let res = ping_pong.send_bytes(100001, "PING");

    // Other fields are set optionally by `dest()`, `source()`, `payload()`, `payload_bytes()`.
    //
    // The logic for `payload()` and `payload_bytes()` is the same as for `send()` and `send_bytes()`.
    // First requires an encodable struct. The second requires bytes.
    let log = Log::builder()
        .source(ping_pong_id)
        .dest(100001)
        .payload_bytes("PONG");

    assert!(res.contains(&log));

    let wrong_log = Log::builder().source(100001);

    assert!(!res.contains(&wrong_log));

    // Log also has `From` implementations from (ID, T) and from (ID, ID, T),
    // where ID: Into<ProgramIdWrapper>, T: AsRef<[u8]>
    let x = Log::builder().dest(5).payload_bytes("A");
    let x_from: Log = (5, "A").into();

    assert_eq!(x, x_from);

    let y = Log::builder().dest(5).source(15).payload_bytes("A");
    let y_from: Log = (15, 5, "A").into();

    assert_eq!(y, y_from);

    assert!(!res.contains(&(ping_pong_id, ping_pong_id, "PONG")));
    assert!(res.contains(&(1, 100001, "PONG")));
```
- Spending blocks:
```rust
    // You may control time in the system by spending blocks.
    //
    // It adds the amount of blocks passed as arguments to the current block of the system.
    // Same for the timestamp. Note, that for now 1 block in Gear network is 1 sec duration.
    sys.spend_blocks(150);
```
<!--
- Reading the program state:
```rust
    // To read the program state you need to call one of two program's functions:
    // `meta_state()` or `meta_state_with_bytes()`.
    //
    // The methods require the payload as the input argument.
    //
    // The first one requires payload to be CODEC Encodable, while the second requires payload
    // implement `AsRef<[u8]>`, that means to be able to represent as bytes.
    //
    // Let we have the following contract state and `meta_state` function:
    #[derive(Encode, Decode, TypeInfo)]
    pub struct ContractState {
        a: u128,
        b: u128,
    }

    pub enum State {
        A,
        B,
    }

    pub enum StateReply {
        A(u128),
        B(u128),
    }

    #[no_mangle]
    unsafe extern "C" fn meta_state() -> *mut [i32; 2] {
        let query: State = msg::load().expect("Unable to decode `State`");
        let encoded = match query {
            State::A => StateReply::A(STATE.a),
            State::B => StateReply::B(STATE.b),
        }.encode();
        gstd::util::to_leak_ptr(encoded)
    }

    // Let's send a query from gtest:
    let reply: StateReply = self
            .meta_state(&State::A)
            .expect("Meta_state failed");
    let expected_reply = StateReply::A(10);
    assert_eq!(reply,expected_reply);

    // If your `meta_state` function doesn't require input payloads,
    // you can use `meta_state_empty` or `meta_state_empty_with_bytes` functions
    // without any arguments.
```
-->
- Balance:
```rust
    // If you need to send a message with value you have to mint balance for the message sender:
    let user_id = 42;
    sys.mint_to(user_id, 5000);
    assert_eq!(sys.balance_of(user_id), 5000);

    // To give the balance to the program you should use `mint` method:
    let prog = Program::current(&sys);
    prog.mint(1000);
    assert_eq!(prog.balance(), 1000);
```


---
sidebar_label: Program Testing
sidebar_position: 13
---

# How to test a Gear program

## Basics

Gear uses the standard testing mechanism for Rust programs: build and run testing executables using `cargo`.

Following basic concepts and testing methods described in [Rustbook](https://doc.rust-lang.org/book/ch11-00-testing.html), you can organize tests in two main categories: **unit tests** and **integration** tests.

The **unit tests** enable testing of each unit of code in isolation from the rest of the code. It helps to quickly find where the code works as expected and where it does not. One should place unit tests in the `src` directory in each file with the code they test.

Even when code units work correctly, it is crucial to test if several library parts work together correctly. For **integration tests**, a separate `tests` directory is required at the top level of your project directory, next to `src`. You can make as many test files in this directory as you need. `cargo` will compile each file as an individual crate.

# How to test a program

There are at least two ways how to test and debug Gear programs.

The first is the off-chain testing using a low-level [`gtest`](https://docs.gear.rs/gtest/) crate. This approach is recommended for unit and integration tests.

The second is the on-chain testing with a higher level [`gclient`](https://docs.gear.rs/gclient/) crate. It perfectly fits the needs of end-to-end testing.

Although `gclient` is aimed at end-to-end testing, tests can be written as unit or integration tests in terms of Rust. We recommend using the integration-like approach with separate test files in the `tests` directory when using the `gclient` crate.

## Building a program in test mode

First, be sure you have a compiled Wasm file of the program you want to test. You can refer to [Getting Started](getting-started-in-5-minutes.md) for additional details.

1. Usually, the following command is used for the regular compilation of Gear smart contracts:

    ```bash
    cd ~/gear/contracts/first-gear-app/
    cargo build --release
    ```

    The nightly compiler is required if some unstable features have been used:

    ```bash
    cargo +nightly build --release
    ```

2. The minimal command for running tests is:

    ```bash
    cargo test
    ```

    The nightly compiler is required if your contract uses unstable Rust features, and the compiler will ask you to enable `nightly` if necessary.

    ```bash
    cargo +nightly test
    ```

    Build tests in release mode, so they run faster:

    ```bash
    cargo test --release
    ```

## Dig deeper

In the following two sections, we will describe how to test the Gear program using both `gtest` and `gclient` crates.


---
title: Why do we build Gear?
sidebar_position: 1
---

## Global aspect

Blockchain technology launched a rapid transition from a centralized, server-based internet (Web2) to a decentralized, distributed one (Web3). Its distinctive features are: no single point of failure (the network can still function even if a large proportion of participants are attacked/taken out), censorship resistance, anyone in the network has the possibility to use the service (permissionless).

Web3 introduces new types of decentralized applications (dApps) and assets such as: decentralized finances (DeFi), decentralized currency exchanges (DEX), decentralized marketplaces and gaming platforms, NFTs, Social Tokens and more.

Today the industry is still in its infancy, which presents the opportunity for rapid growth. What's more, with the demand for Web3 developers currently at its all time high, adoption seems to be growing faster than ever.

Gear was built for the purpose of becoming an essential platform for building the Web3 ecosystem.

### Blockchains evolution

At their core, blockchains store a history of transactions between parties in a form that can be accessible by anybody. They ensure decentralized, immutable and permissionless access to data in the blockchain.

Networks that were at the dawn of blockchain technology have a number of significant issues:
- Lack of scalability, low transaction speed, high transaction costs - all of it hinders the growth of applications in Web3
- Domain-specific development languages lead to high barriers to entry. The need to learn new programming language and paradigms holds back the growth of developers entering Web3
- Complex and inefficient native consensus protocols
- Absence of intercommunication between networks

## Dotsama ecosystem (Polkadot/Kusama networks)

The solution has been found in Parity Technologies, which is focused on creating a Layer-0 technology that connects blockchains together into one big network - Polkadot.

Polkadot provides a system in which blockchains coexist and complement each other. Different parallel blockchains (parachains) are built on Substrate as well as Polkadot and connected to the relay chain and have a native connection. This allows for different nodes to run different application logic, keeping each chain on its own platform. All parachains are interconnected, creating a massive network of multifunctional blockchain services. Parachains compose the Layer-1 of the Polkadot ecosystem, the main difference in connection with other standalone Layer-1 blockchain networks like Ethereum, Bitcoin, Solana, etc. is that parachains are connected through Substrate Cumulus library and standalone blockchains through bridges.

Polkadot and its testnet Kusama are designed to be a fully extensible and scalable blockchain development, deployment and interaction test bed. It is built to be a largely future-proof harness able to assimilate new blockchain technology as it becomes available without over-complicated decentralized coordination or hard forks.

Today Polkadot is one of the fastest-growing multi-chain networks. Although it has an adaptive architecture for building smart-contract platforms and rapid technology development for decentralized applications, it is not a smart contract platform by itself.

<!---
As a smart contract platform built on Substrate, Gear was built so that it can be used to deploy a Layer-1 parachain on Polkadot or Kusama, or a standalone network independent of Polkadot or Kusama, any of which being a “Gear Network”. A Gear Network enables developers to deploy their dApps in mere minutes in the easiest and most efficient way possible. This will enable developers to build dApps on Polkadot and Kusama to take advantage of the benefits of each unique network without the traditional significant time and financial expense associated with doing so.
--->

Built on Substrate, Gear Protocol facilitates access to the deployment infrastructure of Layer-1 parachains or a standalone network. Gear simplifies the dApp deployment process thanks to Gear's technical development, software, and utility, which enable network participation and functionality for broader information access and technical support.

There are several components in the Polkadot architecture, namely:
- Relay Chain
- Parachains
- Bridges

### Relay Chain

Relay Chain is the heart of Polkadot, responsible for the network’s security, consensus and cross-chain interoperability. It allows specialized blockchains and public blockchains to connect within the unified and interoperable Polkadot network. The Relay Chain can be understood as a Layer-0 platform.

The Relay Chain has minimal functionality, which naturally means that advanced functionality features, like smart contracts, for example, are not supported. Other specific work is delegated to the parachains, which each have different implementations and features.

The main task of the Relay Chain is to coordinate the overall system and its connected parachains to build a scalable and interoperable network.

It’s also the Relay Chain that is responsible for the network’s shared security, consensus and cross-chain interoperability.

### Parachains

Parachains are sovereign blockchains that can have their own tokens and optimize their functionality for specific use cases.

Parachains must be connected to the Relay Chain to ensure interoperability with other networks. For this, parachains lease a slot for continuous connectivity or they can pay as they go (in this case they are called Parathreads). Parachains compose the Layer-2 of the Polkadot ecosystem.

Parachains are validatable by validators of the Relay Chain and they get their name from the concept of parallelizable chains that run parallel to the main Relay Chain. Due to their parallel nature, they are able to parallelize transaction processing which helps improve the scalability of the Polkadot network.

Parachains optimize their functionality for specific use cases and, in many instances, support their own tokens.

In order to become a parachain on Polkadot and Kusama, projects have to participate in a [parachain auction](https://parachains.info/auctions).

### Bridges

A blockchain bridge is a special connection that allows the Polkadot ecosystem to connect to and communicate with external networks like Ethereum, Bitcoin and others. Such networks can be considered as Layer-1. A Bridge connection enables the transfer of tokens or arbitrary data from one blockchain to another.

## Gear’s role within the Dotsama ecosystem

<!-- As a Polkadot/Kusama parachain network, Gear Protocol-powered networks are intended for hosting Layer-2 smart contracts. This enables anyone to deploy any dApp on Polkadot and Kusama to take advantage of all the benefits of their ecosystems, yet at the minimal financial expense.
-->

Like Polkadot, the Gear Protocol uses a Substrate framework. This simplifies the creation of different blockchains for specific applications. Substrate provides extensive functionality out-of-the-box and allows one to focus on creating a custom engine on top of the protocol. Projects building on Gear Protocol can seamlessly integrate their solutions into the whole Polkadot/Kusama ecosystem.

The central aspect of Polkadot is its ability to route arbitrary messages between chains. Both Polkadot and Gear networks speak the same language — asynchronous messages — so all the projects built using Gear easily integrate into the Polkadot and Kusama networks. The asynchronous messaging architecture allows Gear networks to be efficient and easy-to-use parachains.

The majority of developers and inspirers of the Gear Protocol were directly involved in creating Polkadot and Substrate technologies. Gear is developing, taking into account, the features of the architecture and design of its older brother. We rely on the high security and flexibility of our product, just like Polkadot.

Gear networks scale naturally as hardware improves as it utilizes all CPU cores. Anyone with a standard computer can run a Gear node today and always. With its shardable design, Gear networks can scale by deploying across multiple parachain slots and can be sharded as a standalone network for additional scalability.

For additional details, refer to the [Gear Whitepaper](https://whitepaper.gear.foundation).



---
title: About Vara Network
sidebar_position: 1
sidebar_label: Vara Network
---

**[Vara Network](https://vara.network/)** is the first stand-alone layer-1 decentralized network built and running on top of Gear Protocol.

The fast and scalable non-fork upgradable Vara Network enables the best playground for next-gen Gaming, Financial-based applications, experimental features but not only. Any other modern use cases are perfectly suited for running on Vara. Building on Vara Network is ideal for both developers already in Web3 as well as those migrating from Web2 seeking the most secure, efficient, scalable environment for deploying their decentralized applications.

Many next-generation apps, like gaming and payments, require low latency execution. The Vara standalone network provides the fastest on-ramp for these applications and unlocks new potential applications.

The main features of Vara network are:

- Fastest truly decentralized L1 ever
- Testbed for new features and optimizations
- Stable and upgradable network thanks to Substrate
- Little to no governance

There are several ways other than developing and running dApps to support Vara Network:
- Become a Validator by providing computing resources for programs execution, blocks producing and participation in consensus mechanism. It makes the Vara Network secure, performant and censorship-resistant.
- Become a Nominator by staking tokens and nominating validators. Elected validators that produce blocks redistribute rewards to their nominators.
- Become Ambassador to create educational awareness, community engagement, and decentralization around Vara Network and Gear Protocol.

For more info about Vara Network and how to become a part of the community, refer to **[Vara Wiki](https://wiki.vara.network/)**.



---
sidebar_position: 3
sidebar_label: Smart Contracts
---

# What are Smart Contracts?

Smart contracts are transactional computer programs that can execute the terms of an agreement automatically without the need for intervention. They were first proposed by Nick Szabo in the early ‘90s, but due to technological constraints they couldn’t function properly. It wasn’t until improvements were made to fundamental blockchain technology that application of smart contracts became possible.

In terms of blockchains, smart contracts are digital agreements that are stored and executed on a blockchain once predetermined criteria are met. Once a specific input has been made, a predetermined and specific output is automatically executed.

Smart contracts can be written in multiple different languages, with Solidity being one of the most popular. But thanks to recent advances in technology, smart contracts can now be written in more traditional programming languages, compiled and deployed on the WebAssembly virtual machine. Not only does this make deploying smart contracts much easier, but it also provides efficiency and speed benefits. You can find out more about this [here](https://medium.com/@gear_techs/why-gear-uses-webassembly-35b705341241).

## How do smart contracts work?

Smart contracts have three main functions.

- They store rules
- They verify rules
- They self-execute rules

Smart contracts do this by following simple “if, when & then” statements that are written in programmable code.

Once a specific input criteria is met, a predetermined output is executed. Once this occurs, a network of computers, that helped facilitate the transaction in the first place, records the transaction on the blockchain where it gets encrypted and becomes immutable.


## Why are smart contracts significant?

Fundamentally, smart contracts,

- Significantly improve slow, expensive, centralized and insecure transactional processes

- Enable transactional processes to become more efficient, transparent and autonomous

- Remove the need for third parties and intermediaries to alleviate human error and significant time and financial costs

This presents opportunities to automate and streamline industries that are long-winded and in need for more efficient transactional processes.

## What are some real world applications of smart contracts?

Smart contracts best suit industries where an automatic executing process would be useful. For instance, the implementation of smart contracts would be great in industries which require an extreme amount of intermediation. This would help automate routine and repetitive processes which individuals currently pay sizable fees for. Processes where the trading of assets are extremely long-winded, like real estate for example, would witness exponential efficiency improvements as well as other benefits like enhanced security and reduced costs.

To date, smart contracts have been used in the financial industry to disintermediate and decentralize financial services; in the gaming industry to change the ways that modern games are played; in the legal industry to automatically execute legally binding contracts; and in the emerging technology industry to facilitate complex computational tasks like those involved in machine learning and artificial intelligence.

## Will smart contracts enable complete decentralization and automation?

Smart contracts present more disruptive opportunities than simply improving singular transactional processes alone. They also facilitate the creation of completely decentralized applications that run on the blockchain. These decentralized applications, also called dApps, combine easy to use interfaces that emulate conventional web applications with the new added possibilities of programmable smart contracts and blockchain technology.

DApps provide numerous significant improvements to traditional web applications and services. The most notable improvement is the significant focus on privacy and data security. Recorded data is secured by cryptographic encryption and it’s immutable which means that it cannot be tampered with. DApps also greatly improve user experience by making interactions with decentralized services more simpler. Because they’re hosted on a network that is maintained by thousands of network operators, most dApps have zero downtime. And the removal of third parties and intermediaries means that dApps can operate with reduced costs and increased transaction speeds.

Smart contracts also enable more than just applications to run autonomously without centralized control. They also allow entire organizations to function without centralized involvement. These organizations are often referred to as decentralized autonomous organizations (DAOs) and you can think of them as businesses that are run on the blockchain and collectively owned by their community.

DAOs represent a revolutionary new form of corporate governance that enables global collaboration between individuals who do not personally know one another. This means that users no longer need to “trust” each other before they collaborate. Instead, users only need to trust the DAO’s smart contracts, which are completely transparent and verifiable by anyone. DAOs open up new and exciting opportunities for global collaboration and they have the potential to change the way that institutions are governed worldwide.


---
sidebar_position: 6
sidebar_label: DAO
---

# What are DAOs?

DAOs are an effective and safe way to work with like-minded people around the globe. Essentially, they’re safe ways to collaborate with strangers and commit funds to a specific cause. You can think of DAOs as magic internet organizations that’re collectively owned and managed by its members.

The backbone of a DAO is the smart contract. The contract defines the rules of the organisation and holds the group's treasury. Once the contract is live, no one can change the rules except by a vote. If anyone tries to do something that's not covered by the rules and logic in the code, it will fail.

This means that DAOs don't need a central authority, which is their biggest superpower. Instead, the group makes decisions collectively via votes and the execution of those votes are authorised automatically when a vote passes. This means that there is no need for human handling and that error and that fraudulent or malicious manipulation is severely minimised.

DAOs differ from traditional organisations in many ways, but the most noticeable is that they’re usually flat and fully democratised instead of hierarchical. This is different from traditional organisations because they usually have a sole decision maker. DAOs are also fully transparent and public instead of private with certain information limited to executives and managers.

The concept of DAOs are extremely exciting as they promise to revolutionize organizational structure as we know it. DAOs solve almost everything that’s wrong with how modern day organisations are run. A perfectly structured DAO gives every member the opportunity to shape the organisation, which can help shape an entire industry.


---
sidebar_position: 2
sidebar_label: dApps
---

# What are dApps?

Decentralized Applications, or dApps, are applications that offer similar functionality to traditional applications but the main difference is that they are run on decentralized peer-to-peer networks, such as blockchains. Decentralized applications offer the services that make up the Web3 revolution.

Because dApps are decentralized, there isn’t a single entity that has control over the application. Instead these applications are open-source and their data is publicly available. DApps use cryptographic tokens to help keep the network secure and they are totally permissionless, which means that anyone, anywhere can interact with them.

What makes dApps so innovative apart from their inclusive nature and exceptionally low barrier to entry is that they are censorship-resistant. This means that because there is no single point of failure, it’s very difficult to restrict access to a decentralized application. This lack of a single point of failure also means that dApps are very difficult to attack and that there is often zero downtime.

In most cases, to interact with a dApp, users must possess that application's native cryptocurrency.


---
sidebar_position: 4
sidebar_label: DeFi
---

# What is DeFi?

Decentralized finance is a collection of financial services that are an alternative to the current financial system.

While the traditional financial sector is opaque, tightly controlled and outdated, DeFi empowers individuals by providing them with more personal control over their finances. DeFi applications enable individuals to borrow, save, invest and trade without having to rely on third parties like banks, exchanges or lending institutions. It’s able to do this because it’s built on blockchain technology, making use of cryptocurrencies and smart contracts which can execute transactions automatically and instantaneously.

DeFi solves many problems within the traditional financial system. For a start, it makes financial services more accessible and inclusive. This is significant because it enables over 1.7 billion people, who were previously excluded, to have access to a safe and secure financial industry.

On top of that, DeFi is much faster and more efficient than traditional financial services because applications are powered by smart contracts. This removes the requirement for intermediaries, which removes a lot of the incurred costs associated with financial services.

DeFi applications can be accessed 24/7, anywhere in the world, meaning that individuals are not limited to operating on and at specific dates and times or in specific time zones.


---
sidebar_position: 5
sidebar_label: NFT
---

# What are NFTs?

A Non-Fungible Token (NFT) is a unique type of cryptographic token that enables the tokenization of unique units of data to be stored on a blockchain.

NFTs can essentially represent anything that is unique, with their most common use case today being tokens that represent digital artwork.

However, contrary to many beliefs, NFT’s use cases do not stop at verifying true authenticity and ownership of artwork alone.

NFTs can represent anything that is not fungible. This means that anything with unique properties now has a way to be cryptographically represented in order to be stored on a blockchain to benefit from its unique features.

NFTs can be used to represent anything from the deeds to a house to a receipt for a product or service.

In the future, it’s likely that all unique units of data will be represented as NFTs in one way or another because they’re securer ways of storing valuable data and they’re extremely accessible, which makes traditionally illiquid assets much more liquid.


---
sidebar_position: 1
sidebar_label: Web3
---

# What is Web3?

Web 3.0 is a new iteration of the internet that’s powered by new technologies like artificial intelligence, machine learning and most importantly, blockchain technology.

Web 3.0 aims to create a more open, connected and intelligent internet that is permissionless and open to everyone without monetizing personal data.

With Web3, anyone who is on the network has permission to use all Web3 services. There isn’t a central authority who can block or deny access. Because Web3 is entirely decentralized, there isn’t a single entity that owns or controls the network. Rather, the community are the ones who control the network. And because the infrastructure that powers Web3 is turing-complete, pretty much anything imaginable can get programmed as a decentralized application.

On top of that, most interactions and transactions that occur on Web3 will benefit in terms of security, speed and cost thanks to the unique nature of blockchain technology.

The value proposition is simple. The main advantage of Web3 is that it addresses the biggest problem that’s resulted from Web2 - the collection and monetization of personal data.

Web3 empowers the user and it creates a more efficient, secure and transparent Internet.


---
sidebar_label: Create Account
sidebar_position: 1
---

# How to create an account

## Key information and security

Account represents an identity - typically a person or an organization, that is capable of making transactions or holding funds. Users can upload smart-contracts and interact with them through transactions in blockchain networks built on top of Gear Protocol. To make this happen, users need to connect a Substrate account. Gear Idea portal can work with Substrate accounts in any connected Gear-powered networks. Moreover this account can be used for holding funds and making transactions in any network of the Dotsama ecosystem and even [more](https://docs.substrate.io/fundamentals/accounts-addresses-keys/).

There are several ways to create a Substrate account, depending on whether you are using a desktop or a mobile device.

There are two main features that make up an account - an address and a key:
- An address is the public aspect of the account. This is essentially a location that can be shared with others in order to send transactions to and from.
- A key is the private part of the account. This is what enables you as an account owner to access the address. The only way to access your account is via your private key (using the mnemonic phrase, seed, or your account's JSON file and a password).

### Storing your accounts

:::tip
**Seed phrase**

Your seed or mnemonic phrase is the key to your account. If you lose seed you will lose access to your account. We recommend that you store your seed in secure places like encrypted hard drives, non-digital devices or ideally, paper. Never share your private key with anyone.
:::

:::tip
**JSON file**

JSON file is a backup of your account encrypted with a password. By using JSON, you can import/ restore your account in any wallet. Without a password, you will not be able to restore access to your account. If you use JSON, store the file and passwords in a safe place.
:::

## How to create account

### Via Talisman Wallet

`Talisman` is a popular and user-friendly wallet for creating and managing Substrate accounts. Being connected to web3 applications across various networks, Talisman browser extension allows to store, send and receive assets.

1. Install Talisman extension for your browser [here](https://talisman.xyz/)

2. Open the extension by clicking on the logo in the menu bar.

3. In the opened application, click "New wallet":

![img alt](./img/talisman-1.png)

4. Enter a strong password:

![img alt](./img/talisman-2.png)

And that's it. Your wallet has been created:

![img alt](./img/talisman-3.png)

### Via Subwallet

Subwallet is another advanced wallet for managing Substrate as well as EVM accounts.

1. To install Subwallet follow this [link](https://subwallet.app/download.html)

2. Open Subwallet by clicking on its logo in the browser menu bar.

3. Click "Create new account":

![img alt](./img/subwallet-1.png)

4. Select the type of account you want to create (Subwallet allows you to create Substrate-like and Ethereum accounts at once). Copy your seed phrase and keep it in the same place:

![img alt](./img/subwallet-2.png)

5. Provide your password in the next step. And click "Add the account with the generated seed"

![img alt](./img/subwallet-3.png)

Congratulations, your wallet has been successfully created!

### Via Polkadot.js browser extension

The polkadot.js browser extension is the original application created by Parity Technologies for managing Substate accounts. This method involves installing the polkadot.js plugin and using it as a "virtual vault" that's separate from your browser to store your private keys and sign transactions.

1. You can install the extension via the following links.

Install on [Chromium](https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd?hl=en)-based browser.

Install on [FireFox](https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension).

2. Open the extension by clicking on the logo in the menu bar

3. Click the large plus button to create a new account. Alternatively, you can navigate to the smaller plus icon in the top right and select "Create New Account".

[img alt](./img/create-account-1.png)

4. Save the `seed phrase` in a safe place using the security advices at the beginning of this article.

![img alt](./img/create-account-2.png)

 5. Specify the name of your account and a strong password for making transactions. Click "Add the account with the generated seed".

![img alt](./img/create-account-3.png)

:::note
The password that you choose here will be used to encrypt this account's information. You will need to re-enter it when attempting to process any kind of outgoing transaction, or when using it to cryptographically sign a message. This password is stored locally on the browser extension.
:::

You've now successfully created a new account using the polkadot.js browser extension.

### Via mobile app

If you need access to your accounts on a mobile device, then you can use the following mobile wallets for the Polkadot/Kusama ecosystem:

[![img alt](./img/nova-logo.png)](https://novawallet.io/)

[![img alt](./img/subwallet-logo.png)](https://subwallet.app/)

All supported wallets you can check [here](https://wiki.polkadot.network/docs/build-wallets).

### Via console

If you have `Gear node` installed, you can generate a new `seed phrase` using the command:

```sh
./gear key generate | grep phrase
```

And then `import` the generated seed phrase into any convenient wallet.

## Frequently Asked Questions

#### Is this account portable?

> Yes, you can access your account on a different device or wallet of your choice as long as you have the account's seed
> phrase or JSON file associated with the account.

#### Can I transact directly in the polkadot.js browser extension?

> There isn't functionality to make transactions directly in the polkadot.js browser extension.
> To make transactions, you need to launch [Gear Idea](https://idea.gear-tech.io) on your browser.
> Before you can make any transactions, you have to allow Gear Idea to access your account.
> The browser extension is what holds your account information. You choose which websites get to access this information.



---
sidebar_label: SS58 account format
sidebar_position: 2
---

# SS58 Address Format

SS58 is a simple address format designed for Substrate based chains. The basic idea is a base-58 encoded value which can identify a specific account on the Substrate chain. For more details about the format, please check [https://docs.substrate.io/v3/advanced/ss58/](https://docs.substrate.io/v3/advanced/ss58/).

# Select address format to use with Gear test network

Gear Idea backend uses Substrate address format. When you take part in activities and events that are organized by Gear, like workshops and live AMAs, to receive bonus tokens, you have to specify an account address in the Substrate address format.

If you already have a Polkadot account, Kusama account, or any other Substrate-based network account, you can set the address format for your wallets in polkadot.js extension:

1. Open polkadot.js extension in your browser and click the Settings icon on the top right corner.

2. In the opened window click on the dropdown menu "Display address format for" and select "Substrate":

![img alt](./img/address-format.png)

# SS58 Address converter
Unfortunately, addresses in the SS58 format are inconvenient for working with smart contracts in Gear IDEA, because they accept addresses as a 256-bit public key (also known as an actor ID). You can convert an address to a key by yourself or use this simple online converter: https://ss58.org (don't forget to select the **Address → Key** tab).


---
sidebar_label: IDEA Overview
sidebar_position: 1
---

# Gear IDEA online

Gear IDEA is a convenient tool that’s purpose is to familiarize users with the Gear platform. It provides smart-contract developers with the easiest and fastest way to write, compile, test and upload smart-contracts to a test network directly in their browser without additional configuration.

This is the demo application that implements all of the possibilities of interaction with smart-contracts in Gear, which also manages accounts, balances, events and more.

You can start experimenting right now at https://idea.gear-tech.io/.

# IDEA components and microservices

[frontend](https://github.com/gear-tech/gear-js/tree/main/idea/frontend)

React application that provides the user interface for working with smart-contracts on Gear IDEA.

[indexer](https://github.com/gear-tech/gear-js/tree/master/idea/indexer)

Microservice is responsible for blockchain indexing and storing information about programs and their messages as well as for storing programs metadata.

[test-balance](https://github.com/gear-tech/gear-js/tree/main/idea/test-balance)

Microservice provides the opportunity to obtain test tokens.

[api-gateway](https://github.com/gear-tech/gear-js/tree/main/idea/api-gateway)

Microservice provides any interaction between `indexer` / `test-balance` services and an external user


---
sidebar_label: Backup and Restore
sidebar_position: 4
---

# Backup and restore the node

## Data structure

Gear node stores its data in a dedicated directory.

- Linux: `$HOME/.local/share/gear`
- macOS: `$HOME/Library/Application Support/gear`
- Windows: `%USERPROFILE%\AppData\Local\gear.exe`

For example if you run the node as the root user on Linux (`$HOME` = `/root`) the absolute path of node's data directory will be:

    /root/.local/share/gear

Let's explore the data that the node stores in this directory.

```
└── gear
    └── chains
        ├── dev
        │   └── ...
        ├── gear_staging_testnet_v7
        │   ├── db
        │   │   └── full
        │   ├── keystore
        │   └── network
        └── vara_network
            ├── db
            │   └── full
            ├── keystore
            └── network
```

### Chains

The node can connect to different chains. The chain can be selected using the `--chain` argument. The default chain is the staging test network at the moment. Its data is located in `gear/chains/gear_staging_testnet_v7` directory.

If you connect to the Vara network, the chain subdirectory name will be `vara_network` resulting in the `gear/chains/vara_network` path.

If you start the node with the `--dev` argument, the virtual network in development mode will run with the data stored in the `gear/chains/dev` directory.

### Database

The database keeps the blockchain state in the local node storage. It synchronizes with other nodes over a peer-to-peer protocol. One can choose the DB format using the `--database` argument. Possible options are:

- `rocksdb` (default): use RocksDB as database engine, data is stored in `<chain>/db/full` subdirectory.
- `paritydb`: use ParityDB as database engine, data is stored in `<chain>/paritydb/full` subdirectory.
- `paritydb-experimental`: deprecated experimental mode of the ParityDB engine (will be removed in future releases), data is stored in `<chain>/paritydb/full` subdirectory.

Note that the database contents depends on the pruning mode of the node. By default the node keeps only the last 256 blocks. To keep all the blocks use the `--pruning=archive` argument when running the node.

The database can be deleted and synchronized from scratch at any time. Use the `gear purge-chain` command to completely delete the DB.

### Network key

The network private key is used to calculate the unique peer identifier (started with `12D3KooW`). This key is stored in `<chain>/network/secret_ed25519` file. The key file is the binary file containing 32 bytes of the Ed25519 (by default) private key. You can use `hexdump` command to read the key:

```shell
hexdump -e '1/1 "%02x"' /root/.local/share/gear/chains/gear_staging_testnet_v7/network/secret_ed25519

# 42bb2fdd46edfa4f41a5f0f9c1a5a1d407a39bafbce6f07456a2c8d9963c8f5c
```

You can override this key by running the node with the `--node-key` argument:

```shell
gear --node-key=42bb2fdd46edfa4f41a5f0f9c1a5a1d407a39bafbce6f07456a2c8d9963c8f5c

# Discovered new external address for our node: /ip4/127.0.0.1/tcp/30333/ws/p2p/12D3KooWMRApe2S5QMdhHwmcDapDxZ7xf2Xa3z2HfCCYoHTmjiXV
```

If there is no `--node-key` argument, the node uses the key from the `secret_ed25519` file. If it does not exist, it is created with a newly generated secret key.

The network key file cannot be recovered if lost. Therefore, you are to keep it (or the private key itself) to have the possibility to run the node with the same peer ID.

## Moving the node

To move the node to a new server you are to backup then restore the following (provided paths are for default Staging Testnet V7 node's parameters):

- The network private key of the node:

    - Linux: `$HOME/.local/share/gear/chains/gear_staging_testnet_v7/network/secret_ed25519`
    - macOS: `$HOME/Library/Application Support/gear/chains/gear_staging_testnet_v7/network/secret_ed25519`
    - Windows: `%USERPROFILE%\AppData\Local\gear.exe\chains\gear_staging_testnet_v7\network\secret_ed25519`

- (optional) The database:

    - Linux: `$HOME/.local/share/gear/chains/gear_staging_testnet_v7/db/full`
    - macOS: `$HOME/Library/Application Support/gear/chains/gear_staging_testnet_v7/db/full`
    - Windows: `%USERPROFILE%\AppData\Local\gear.exe\chains\gear_staging_testnet_v7\db\full`

- (optional) The service configuration if you've configured the node as a service:

    - Linux: `/etc/systemd/system/gear-node.service`

If you don't backup the database, you can always synchronize it from scratch, but keep in mind that this process may take some time.

:::info

Don't forget to stop the node before backing up the database. Otherwise you can get a corrupted database.

```shell
sudo systemctl stop gear-node
```

:::


---
sidebar_label: Dev Net Mode
sidebar_position: 5
---

# Running Gear node in Dev Net mode

Dev net is helpful for the development and debugging of your smart contracts. You can upload your program directly to a local node, send messages to a program and validate the program's logic.

To run the Gear node in a dev net mode:

1. Compile or download nightly build for your operating system as described in [setting-up](/docs/node/setting-up).

2. Run the node in dev mode (we assume the executable is in `/usr/bin` directory):

```bash
gear --dev
```

3. Follow https://idea.gear-tech.io/ and connect to a local dev node. Click network selection via the left top button, choose Development -> Local node, and click the Switch button. Use the Idea portal for sending messages, reading the program's state, etc.

4. To purge any existing dev chain state, use:

```bash
gear purge-chain --dev
```

5. To start a dev chain with detailed logging, use:

```bash
RUST_LOG=debug RUST_BACKTRACE=1 gear -lruntime=debug --dev
```


---
sidebar_label: Multi-Node Mode
sidebar_position: 6
---

# Creating a Multi-Node local testnet

For more advanced smart contracts debugging and testing closer to the real network environment, you can build your local testnet that consists of several interconnected nodes. This mode allows to see the multi-node consensus algorithm in action.

Run a local testnet with two validator nodes, Alice and Bob, that have been [configured](https://github.com/gear-tech/gear/blob/master/node/src/chain_spec.rs) as the initial authorities of the `local` testnet chain and endowed with testnet units.

Note: this will require two terminal sessions (one for each node).

1. Start Alice's node first. The command below uses the default TCP port (30333) and specifies `/tmp/alice` as the chain database location. Alice's node ID will be `12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp` (legacy representation: `QmRpheLN4JWdAnY7HGJfWFNbfkQCb6tFf4vvA6hgjMZKrR`); this is determined by the node-key.

  ```bash
  gear \
    --base-path /tmp/alice \
    --chain=local \
    --alice \
    --node-key 0000000000000000000000000000000000000000000000000000000000000001 \
    --telemetry-url "wss://telemetry.rs/submit 0"
  ```

  The Alice node will be run in idle mode at block #0 waiting for the second validator node.

  ```
  Gear Node
  ✌️ version 1.0.2-d02d306f97c
  ❤️ by Gear Technologies, 2021-2023
  📋 Chain specification: Vara Local Testnet
  🏷 Node name: Alice
  👤 Role: AUTHORITY
  💾 Database: RocksDb at /tmp/alice/chains/gear_local_testnet/db/full
  ⛓ Native runtime: vara-1020 (vara-1.tx1.au1)
  👶 Creating empty BABE epoch changes on what appears to be first startup.
  Using default protocol ID "sup" because none is configured in the chain specs
  🏷 Local node identity is: 12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp
  💻 Operating system: macos
  💻 CPU architecture: aarch64
  📦 Highest known block at #0
  〽️ Prometheus exporter started at 127.0.0.1:9615
  Running JSON-RPC HTTP server: addr=127.0.0.1:9933, allowed origins=Some(["http://localhost:*", "http://127.0.0.1:*", "https://localhost:*", "https://127.0.0.1:*", "https://polkadot.js.org"])
  Running JSON-RPC WS server: addr=127.0.0.1:9944, allowed origins=Some(["http://localhost:*", "http://127.0.0.1:*", "https://localhost:*", "https://127.0.0.1:*", "https://polkadot.js.org"])
  🏁 CPU score: 1020MB/s
  🏁 Memory score: 37732MB/s
  🏁 Disk score (seq. writes): 1496MB/s
  🏁 Disk score (rand. writes): 421MB/s
  👶 Starting BABE Authorship worker
  💤 Idle (0 peers), best: #0 (0x22c7…6847), finalized #0 (0x22c7…6847), ⬇ 0 ⬆ 0
  💤 Idle (0 peers), best: #0 (0x22c7…6847), finalized #0 (0x22c7…6847), ⬇ 0 ⬆ 0
  💤 Idle (0 peers), best: #0 (0x22c7…6847), finalized #0 (0x22c7…6847), ⬇ 0 ⬆ 0
  💤 Idle (0 peers), best: #0 (0x22c7…6847), finalized #0 (0x22c7…6847), ⬇ 0 ⬆ 0
  ```

  Also, you can find the `Alice` node name on the telemetry site (https://telemetry.rs) under the **Gear Local Testnet** tab.

2. In another terminal, use the following command to start Bob's node on a different TCP port (`30334`) and with a chain database location of `/tmp/bob`. The `--bootnodes` option will connect this node to the Alice's one on TCP port `30333`:

  ```bash
  gear \
    --base-path /tmp/bob \
    --bootnodes /ip4/127.0.0.1/tcp/30333/p2p/12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp \
    --chain=local \
    --bob \
    --port 30334 \
    --ws-port 9945 \
    --telemetry-url "wss://telemetry.rs/submit 0"
  ```

  After running the second validator the network starts to produce new blocks.

  ```
  Gear Node
  ✌️ version 1.0.2-d02d306f97c
  ❤️ by Gear Technologies, 2021-2023
  📋 Chain specification: Vara Local Testnet
  🏷 Node name: Bob
  👤 Role: AUTHORITY
  💾 Database: RocksDb at /tmp/bob/chains/gear_local_testnet/db/full
  ⛓ Native runtime: vara-1020 (vara-1.tx1.au1)
  🔨 Initializing Genesis block/state (state: 0xf470…d2dc, header-hash: 0x22c7…6847)
  👴 Loading GRANDPA authority set from genesis on what appears to be first startup.
  👶 Creating empty BABE epoch changes on what appears to be first startup.
  Using default protocol ID "sup" because none is configured in the chain specs
  🏷 Local node identity is: 12D3KooWHpsf9Gp59ct6t6d1MmKHxbmZRvSWcUej7cUNmWNBdvZE
  💻 Operating system: macos
  💻 CPU architecture: aarch64
  📦 Highest known block at #0
  Running JSON-RPC HTTP server: addr=127.0.0.1:61429, allowed origins=Some(["http://localhost:*", "http://127.0.0.1:*", "https://localhost:*", "https://127.0.0.1:*", "https://polkadot.js.org"])
  Running JSON-RPC WS server: addr=127.0.0.1:9945, allowed origins=Some(["http://localhost:*", "http://127.0.0.1:*", "https://localhost:*", "https://127.0.0.1:*", "https://polkadot.js.org"])
  🏁 CPU score: 875MB/s
  🏁 Memory score: 38353MB/s
  🏁 Disk score (seq. writes): 1497MB/s
  🏁 Disk score (rand. writes): 421MB/s
  👶 Starting BABE Authorship worker
  discovered: 12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp /ip4/192.168.1.4/tcp/30333
  discovered: 12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp /ip6/::1/tcp/30333
  discovered: 12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp /ip4/127.0.0.1/tcp/30333
  🙌 Starting consensus session on top of parent 0x22c70bb6baf611e5c9a6b1886b307dfa25cf1972b3400e70eb15d624c8b96847
  🎁 Prepared block for proposing at 1 (0 ms) [hash: 0x1f55c4a9daf8c35d4388313ad67deec4ff5e472659e2fec310bd3032bcbdfe71; parent_hash: 0x22c7…6847; extrinsics (2): [0x8bbd…2a85, 0x7d5c…0b86]]
  🔖 Pre-sealed block for proposal at 1. Hash now 0xe46f6031bb73710e239665d0da4212fbdcca77d57f9504d357c078f3b315389e, previously 0x1f55c4a9daf8c35d4388313ad67deec4ff5e472659e2fec310bd3032bcbdfe71.
  👶 New epoch 0 launching at block 0xe46f…389e (block slot 1667197557 >= start slot 1667197557).
  👶 Next epoch starts at slot 1667198157
  ✨ Imported #1 (0xe46f…389e)
  🙌 Starting consensus session on top of parent 0xe46f6031bb73710e239665d0da4212fbdcca77d57f9504d357c078f3b315389e
  🎁 Prepared block for proposing at 2 (0 ms) [hash: 0x66281c25f34157c713876cda6f39324a0da6a9a50c0c32310683bca875c1ab4c; parent_hash: 0xe46f…389e; extrinsics (2): [0xcb81…f7c3, 0x7d5c…0b86]]
  🔖 Pre-sealed block for proposal at 2. Hash now 0x2ab179fe98969cab0970df085b86e03dbee33daed527f6595bcdbeffebc64175, previously 0x66281c25f34157c713876cda6f39324a0da6a9a50c0c32310683bca875c1ab4c.
  ✨ Imported #2 (0x2ab1…4175)
  🙌 Starting consensus session on top of parent 0x2ab179fe98969cab0970df085b86e03dbee33daed527f6595bcdbeffebc64175
  🎁 Prepared block for proposing at 3 (0 ms) [hash: 0xb5b9be01adb191671e0421f4673f8bee0751481aaac7ea453d806161e3b46dd7; parent_hash: 0x2ab1…4175; extrinsics (2): [0x7771…de48, 0x7d5c…0b86]]
  🔖 Pre-sealed block for proposal at 3. Hash now 0xf2ed128d41d96da623281745555a0fe00a033630aacf57ac02acc31ced267db0, previously 0xb5b9be01adb191671e0421f4673f8bee0751481aaac7ea453d806161e3b46dd7.
  ✨ Imported #3 (0xf2ed…7db0)
  ```

3. The network is live! If you want to stop it, just press <kbd>Ctrl</kbd> + <kbd>C</kbd> in both running sessions.


---
sidebar_label: Node as a Service
sidebar_position: 2
---

# Сonfiguring a node as a Linux service

## Prerequisites

You need to download or compile the `gear` executable file for your OS. [See more](/docs/node/setting-up#install-with-pre-build-binary)

## Configuration

Copy the `gear` executable to the `/usr/bin` directory:

```bash
sudo cp gear /usr/bin
```

To run the Gear node as one of the Linux services, you need to configure the systemd file:

```bash
cd /etc/systemd/system
sudo nano gear-node.service
```

Configure and save:

```toml
[Unit]
Description=Gear Node
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/
ExecStart=/usr/bin/gear --name "NODE_NAME" --telemetry-url "wss://telemetry.rs/submit 0"
Restart=always
RestartSec=3
LimitNOFILE=10000

[Install]
WantedBy=multi-user.target
```

:::note
Declaration `ExecStart` points to the location of the `gear` binary file. In this case, it is in `/usr/bin` directory.
With -- additional launch parameters are indicated, but not mandatory.
:::

That’s it. We can now start the service.

## Starting the node

Run to start the service:

```sh
sudo systemctl start gear-node
```

Automatically get it to start on boot:

```sh
sudo systemctl enable gear-node
```

How to check status of gear-node service?

```sh
sudo systemctl status gear-node
```

## Checking logs

You may see the service logs by running the following command:

```sh
journalctl -u gear-node
```

Use navigation keys to browse the logs and <kbd>q</kbd> key to exit.

You may see the last 50 lines of logs by adding `-n 50` parameter:

```sh
journalctl -u gear-node -n 50
```

Add `-f` parameter to see the last lines of logs in continuous mode (press Ctrl+C to exit):

```sh
journalctl -u gear-node -fn 50
```

## Update the node with the new version

After the node has been running for a while, you may need to update it to the latest version.

You just need to replace the node executable (`gear`) with the latest version and restart the execution. For example, if your Linux executable is located at `/usr/bin/gear` (as we've configured above) you are to run:

```
curl https://get.gear.rs/gear-v1.0.2-x86_64-unknown-linux-gnu.tar.xz | sudo tar -xJC /usr/bin
sudo systemctl restart gear-node
```

## Remove the node

If you no longer need to run the node, you can completely purge it from the disk.

:::warning

Note that once you delete the node, you will not be able to fully restore it. Refer to the [Backup and Restore](/docs/node/backup-restore) article to know about the important data to be backed up.

:::

You are to remove the node's storage, the service configuration, and the executable itself:

```
sudo systemctl stop gear-node
sudo systemctl disable gear-node
sudo rm -rf /root/.local/share/gear
sudo rm /etc/systemd/system/gear-node.service
sudo rm /usr/bin/gear
```


---
sidebar_label: Node FAQ
sidebar_position: 7
---

# Node FAQ

## Can I run the Gear node now?

Yes, follow the instructions from this article on how to set up and run Gear node under MacOS, Linux and Windows:
[Setting Up](/docs/node/setting-up)

## What are hardware requirements for Gear node?

There are no special hardware requirements except SSD for running Gear node connected to a test net or in a dev net mode. For nodes in a production network, the hardware requirements will be provided further.

Please refer to the [System Requirements](/docs/node/setting-up#system-requirements) to see the actual hardware requirements.

## I have an error when trying to run the node

Please refer to the [Troubleshooting](/docs/node/troubleshooting) section to find typical errors and solutions.

## Are there rewards for running nodes?

Running a node in a production network will be incentivized. There are no regular rewards for running nodes in a test net, but participation in community events is also incentivized. Stay tuned.

## Could we run collator/validator now?

Not at the moment. Stay tuned.

## If my node is shown in the telemetry, and syncing blocks, is that all OK?

Yes.

## What do we have to do after running a node?

That's all at the moment, but stay tuned for future updates.

## How do I make the node work in the background?

The solution is to configure the [Gear node as a service](/docs/node/node-as-service).

## My host provider claims the node abuses their network.

This should be resolved by adding `--no-private-ipv4` argument when running the node.
 If for some reason, that argument doesn't solve the issue for you, then you can deny egress traffic to:
```bash
10.0.0.0/8
172.16.0.0/12
192.168.0.0/16
100.64.0.0/10
169.254.0.0/16
```
For example you can use this manual: https://community.hetzner.com/tutorials/block-outgoing-traffic-to-private-networks

## I've configured the node as a service. How can I update it?

You just need to replace the node executable (`gear`) with the latest version and restart the execution. For example, if your Linux executable is located at `/usr/bin` you are to run:

```shell
curl https://get.gear.rs/gear-v1.0.2-x86_64-unknown-linux-gnu.tar.xz | sudo tar -xJC /usr/bin
sudo systemctl restart gear-node
```

## My node stopped to increment the block height after some block number.

[Update](/docs/node/node-as-service#update-the-node-with-the-new-version) the node binary to the latest version.

## How do I change the port number if the default one is already used by another software?

Use one of the supported flags when running the node:

```
--port <PORT>
    Specify p2p protocol TCP port

--prometheus-port <PORT>
    Specify Prometheus exporter TCP Port

--rpc-port <PORT>
    Specify HTTP RPC server TCP port

--ws-port <PORT>
    Specify WebSockets RPC server TCP port
```

Default ports are:

- P2P: `30333`
- Prometheus: `9615`
- HTTP RPC: `9933`
- WebSocket RPC: `9944`

## How to see Gear node service logs?

See the [Checking logs](/docs/node/node-as-service#checking-logs) section for details.

## What is the node syncing time?

The full node syncing time may be calculated using the info from the log:

$$
syncing\char`_time \text{ [secs]} = \frac{target\char`_block - finalized\char`_block} {bps}
$$

For example, let's calculate the syncing time from the following log record:

```
... ⚙️ Syncing 143.1 bps, target=#3313788 ... finalized #3223552 ...
```

$$
syncing\char`_time = \frac {3313788 - 3223552} {143.1} \approx 630 \text{ secs } (10.5 \text{ mins})
$$

## Is the node visible in telemetry during syncing?

Yes, it is visible on the telemetry portal - https://telemetry.rs. It will be gray until the block height becomes up to date.

## Should I associate my wallet with the node?

No, not at the moment.

## Is there any command to check for new updates for the node?

There is no such command.


---
sidebar_label: Setting Up
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

# Setting Up Gear Node

## Introduction

This guide covers the steps required to install and run the Gear node.

There are two ways to get started with the Gear node. First, you can download a pre-built binary file and run it, or second, you can compile the binary file and configure it by yourself. Using a ready-made build is a quick and convenient way to get started as you can skip the installation of Rust and all its dependencies and you can also skip the node compiling process. On the other hand, if you decide that you want to go through the process of creating your development node, it may take about twenty minutes or more depending on your hardware.

:::info

### System requirements:

Gear node doesn't have any special hardware requirements excepting at least 64 Gbytes of free space on the SSD disk.

:::

## Install with pre-build binary

Depending on your OS you need to download the last release build of Gear node from https://get.gear.rs:

````mdx-code-block
<Tabs>
<TabItem value="linux" label="Linux x86-64" className="unique-tabs" default>

Terminal:

```bash
curl https://get.gear.rs/gear-v1.0.2-x86_64-unknown-linux-gnu.tar.xz | tar xJ
```

or

**Linux x86-64**: [gear-v1.0.2-x86_64-unknown-linux-gnu.tar.xz](https://get.gear.rs/gear-v1.0.2-x86_64-unknown-linux-gnu.tar.xz)

You can try to run the node:

```
❯ ./gear --version
gear 1.0.2-d02d306f97c
```

</TabItem>

<TabItem value="mac-arm" label="macOS ARM">

Terminal:

```bash
curl https://get.gear.rs/gear-v1.0.2-aarch64-apple-darwin.tar.xz | tar xJ
```

or

**macOS ARM**: [gear-v1.0.2-aarch64-apple-darwin.tar.xz](https://get.gear.rs/gear-v1.0.2-aarch64-apple-darwin.tar.xz)

You can try to run the node:

```
❯ ./gear --version
gear 1.0.2-d02d306f97c
```

</TabItem>
<TabItem value="mac-intel" label="macOS x86-64">

Terminal:

```bash
curl https://get.gear.rs/gear-v1.0.2-x86_64-apple-darwin.tar.xz | tar xJ
```

or

**macOS x86-64**: [gear-v1.0.2-x86_64-apple-darwin.tar.xz](https://get.gear.rs/gear-v1.0.2-x86_64-apple-darwin.tar.xz)

You can try to run the node:

```
❯ ./gear --version
gear 1.0.2-d02d306f97c
```

</TabItem>

<TabItem value="win64" label="Windows x86-64">

Terminal:

```bash
curl -O https://get.gear.rs/gear-v1.0.2-x86_64-pc-windows-msvc.zip
```

or

**Windows x86-64**: [gear-v1.0.2-x86_64-pc-windows-msvc.zip](https://get.gear.rs/gear-v1.0.2-x86_64-pc-windows-msvc.zip)

Unzip the downloaded package then you can try to run the node:

```
❯ gear.exe --version
gear.exe 1.0.2-d02d306f97c
```

</TabItem>
</Tabs>
````

:::info

You can use [nightly builds](https://get.gear.rs/#gear-nightly) if you want the latest features.

:::

## Compile Gear node by yourself

Compiling the build will take some time and requires the installation of some dependencies.

:::warning Note

Windows users may encounter some problems related to the installation of Rust components and dependencies.
It is highly recommended to use Linux or macOS for compiling Gear node and smart-contracts.

:::

### Prerequisites

Linux users should generally install `GCC` and `Clang`, according to their distribution’s documentation. Also, one should install `binaryen` toolset that contains required `wasm-opt` tool.

For example, on Ubuntu use:

```bash
sudo apt install -y clang build-essential binaryen cmake protobuf-compiler
```

On macOS, you can get a compiler toolset and `binaryen` by running:

```bash
xcode-select --install
brew install binaryen
```

### Install Rust:

If you already have Rust installed, you can skip this step.

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

And then you should reboot your terminal.

### Install Wasm Toolchains:

```bash
rustup toolchain add nightly
rustup target add wasm32-unknown-unknown --toolchain nightly
```

### Clone Gear repo

```
git clone https://github.com/gear-tech/gear.git
cd gear
# Checkout to the latest release tag
git checkout v1.0.2 -b release-1.0.2
```

:::info

If you need to use the latest or experimental Gear functions, you should compile the node from `master` branch. It is the default branch after clone, but you can switch back to the `master` branch using a command:

```bash
git checkout master
```

:::

### Compile

```bash
cargo build -p gear-cli --release
```

or

```bash
make node-release
```

:::note

You can find the final build at the following location: `gear/target/release/gear`

Go to:

```bash
cd target/release
```

:::

## Run Gear Node

:::info

It doesn't matter if you downloaded the prebuild binary or built it yourself. Being in the directory where the gear node is installed to run it without special arguments to get a node connected to the testnet:

:::

```bash
./gear
```

To run Gear node in dev mode use the following command:

```bash
./gear --dev
```

## Command Flags and Options

```code
gear [subcommand] [options]
```

- `--chain=testnet`

  Connect the node to the test network (default option).

- `--chain=vara`

  Connect the node to the Vara network.

- `--dev`

  Run a local node in development mode for testing purposes. This node will not be connected to any external network and will store the state in temporary storage.

- `purge-chain`

  Remove storage of the selected chain type. Needs to specify the chain connection type `--chain=testnet`, `--chain=vara`, or `--dev`.

- `help`, `--help`

  Print the available subcommands/options or the help of the given subcommand.

## Special environment variables

To run Gear node with logs from contracts use:

```code
RUST_LOG="gwasm=debug" gear [subcommand] [options]
```


---
sidebar_label: Node Monitoring
sidebar_position: 3
---

# Sending Gear node telemetry

The health of each Gear node and the entire network needs to be monitored to ensure truly decentralized and robust operations. This includes the various block production metrics as well as node uptime which is vital in PoS networks.

As any other Substrate based nodes, Gear node can be connected to an arbitrary telemetry backend using the `--telemetry-url`.

To start sending telemetry messages to the arbitrary telemetry server instance, one needs to specify an additional key during node run that will enable sending telemetry to specified http address.

If you want to participate and share your telemetry, run your node with the flag (we assume the executable is in `/usr/bin` directory):

```sh
gear --telemetry-url "wss://telemetry.rs/submit 0"
```

Also, you can provide your node name using the `--name` flag:

```sh
gear --name "NODE NAME"
```

For example, to start a node with telemetry, run the command:

```sh
gear --telemetry-url "wss://telemetry.rs/submit 0" --name "My_Gear_node_name"
```

You can send more information (e.g., the validator address) by increasing the verbosity level:

```sh
gear --telemetry-url "wss://telemetry.rs/submit 1" --name "My_validator_name"
```

To check telemetry for currently running nodes, visit the web address: [https://telemetry.rs](https://telemetry.rs).

You can find some additional information about monitoring in the [Substrate docs](https://docs.substrate.io/maintain/monitor/).


---
sidebar_label: Troubleshooting
sidebar_position: 8
---

# Troubleshooting

Typical errors and solutions are described here.

## Unavailable `LOCK` file

- **Error:** `IO error: While lock file /root/.local/share/gear/chains/gear_staging_testnet_v7/db/full/LOCK: Resource temporarily unavailable`

- **Solution:** You seem to be running several Gear node instances. Note that only one node instance is allowed to run. You likely have configured the node as a service and then ran the second instance from the command line. You should either stop the service or don't run the Gear node from the command line.

    You can see the current node processes by running the command:

    ```shell
    ps aux | grep gear
    ```

    If you want to break all node processes you may run:

    ```shell
    pkill -sigint gear
    ```

    Note that the SystemD service can't be stopped by the command above. Run instead:

    ```shell
    sudo systemctl stop gear-node
    ```

## Unexpected argument when starting the node service

- **Error:** `Found argument '\' which wasn't expected, or isn't valid in this context`

- **Solution:** The `gear-node.service` configuration file seems to be misconfigured. Some versions of SystemD do not accept the backslash character (`\`) as a line break. Therefore, it is better to write each of the config entry on one line.

    Refer to https://wiki.gear-tech.io/node/node-as-service for properly configuring the node as a service.

    Don't forget to restart the node after fixing the service configuration:

    ```shell
    sudo systemctl daemon-reload
    sudo systemctl restart gear-node
    ```

## Corrupted data base

- **Error:** `Database version cannot be read from existing db_version file`

- **Alternative error:** `Invalid argument: Column families not opened: ..., col2, col1, col0`

- **Solution:** The root of this problem is the lack of the disk free space. You may check the free space using the following command:

    ```shell
    df -h
    ```

    Also, you may check how many space is used by the blockchain DB:

    ```shell
    du -h $HOME/.local/share/gear/chains/gear_staging_testnet_v7/db/full
    ```

    Please refer to the [System Requirements](/docs/node/setting-up#system-requirements) to see the minimum disk space required.

    You need to free more space then purge the chain:

    ```shell
    sudo systemctl stop gear-node
    # Provide more free space on the disk
    gear purge-chain
    sudo systemctl start gear-node
    ```

## Node executable file obsolescence

- **Error:** `Verification failed for block <block-id> received from peer <peer-id>`

- **Alternative error:** `runtime requires function imports which are not present on the host`

- **Solution:** [Update](/docs/node/node-as-service#update-the-node-with-the-new-version) the node binary to the latest version.

## Masked service

- **Error:** `Failed to start gear-node.service: Unit gear-node.service is masked.`

- **Solution:** Please check: https://askubuntu.com/questions/1017311/what-is-a-masked-service




