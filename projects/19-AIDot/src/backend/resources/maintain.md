---
id: maintain-bootnode
title: Set up a Boot Node
sidebar_label: Set up a Boot Node
description: Steps on setting up a boot node.
keywords: [bootnode, web socket, remote, connection, secure websocket]
slug: ../maintain-bootnode
---

:::note

When you first start a node, it has to find a way to find other nodes in the network. For that
purpose, you need "bootnodes". After the first bootnode is found, it can use that node’s connections
to continue expanding and play its role in the network, like participating as a validator.

:::

## Accessing the Bootnode

The consensus is that bootnodes have to be accessible in three ways:

- **p2p**: the p2p port, which can be set by `--listen-addr /ip4/0.0.0.0/tcp/<port>`. This port is
  not automatically set on a non-validator node (for example, an archive RPC node).
- **p2p/ws**: the WebSocket version, which can be set by `--listen-addr /ip4/0.0.0.0/tcp/<port>/ws`.
- **p2p/wss**: the _secure_ websocket version. An SSL-secured connection to the p2p/ws port must be
  achieved by a proxy since the node cannot include certificates. It is needed for light clients.
  See [here](/docs/maintain-wss) for info about setting this up.

## Network Key

Starting a node creates its node key in the `chains/<chain>/network/secret_ed25519` file. You can
also create a node-key by `polkadot key generate-node-key` and use that node-key in the startup
command line.

It is essential you backup the node key, especially if it gets included in the polkadot binary
because it gets hardcoded in the binary and needs to be recompiled to change.

## Running the Bootnode

Say we are running a polkadot node with
`polkadot --chain polkadot --name dot-bootnode --listen-addr /ip4/0.0.0.0/tcp/30310 --listen-addr /ip4/0.0.0.0/tcp/30311/ws`
then we would have the p2p on port 30310 and p2p/ws on port 30311. For the p2p/wss port, we need to
set up a proxy, a DNS name, and a corresponding certificate. These concepts and example setups are
described [here](https://wiki.polkadot.network/docs/maintain-wss#secure-the-ws-port). The following
example is for the popular nginx server and enables p2p/wss on port 30312 by proxying the p2p/ws
port 30311:

_/etc/nginx/sites-enabled/dot-bootnode_

```
server {
       listen       30312 ssl http2 default_server;
       server_name  dot-bootnode.stakeworld.io;
       root         /var/www/html;

       ssl_certificate "<your_cert";
       ssl_certificate_key "<your_key>";

       location / {
         proxy_buffers 16 4k;
         proxy_buffer_size 2k;
         proxy_pass http://localhost:30311;
         proxy_http_version 1.1;
         proxy_set_header Upgrade $http_upgrade;
         proxy_set_header Connection "Upgrade";
         proxy_set_header Host $host;
   }

}
```

## Testing Bootnode Connection

If we have the above node running with DNS name `dot-bootnode.stakeworld.io`, proxied with a valid
certificate and node-id `12D3KooWAb5MyC1UJiEQJk4Hg4B2Vi3AJdqSUhTGYUqSnEqCFMFg` then the following
commands should give you a: "syncing 1 peers".

:::tip

You can add `-lsub-libp2p=trace` on the end to get libp2p trace logging for debugging purposes.

:::

**p2p**:

```bash
polkadot --chain polkadot --base-path /tmp/node --name "Bootnode testnode" --reserved-only --reserved-nodes "/dns/dot-bootnode.stakeworld.io/tcp/30310/p2p/12D3KooWAb5MyC1UJiEQJk4Hg4B2Vi3AJdqSUhTGYUqSnEqCFMFg" --no-hardware-benchmarks
```

**p2p/ws**:

```bash
polkadot --chain polkadot --base-path /tmp/node --name "Bootnode testnode" --reserved-only --reserved-nodes "/dns/dot-bootnode.stakeworld.io/tcp/30311/ws/p2p/12D3KooWAb5MyC1UJiEQJk4Hg4B2Vi3AJdqSUhTGYUqSnEqCFMFg" --no-hardware-benchmarks
```

**p2p/wss**:

```bash
polkadot --chain polkadot --base-path /tmp/node --name "Bootnode testnode" --reserved-only --reserved-nodes "/dns/dot-bootnode.stakeworld.io/tcp/30312/wss/p2p/12D3KooWAb5MyC1UJiEQJk4Hg4B2Vi3AJdqSUhTGYUqSnEqCFMFg" --no-hardware-benchmarks
```



---
id: maintain-endpoints
title: Node Endpoints
sidebar_label: Node Endpoints
description: List of node endpoints and examples of use.
keywords: [endpoints, network, connect]
slug: ../maintain-endpoints
---

Ideally, one may run their own node when interacting with the
[Polkadot network](https://polkadot.network/) via [Polkadot-JS Apps](https://polkadot.js.org/apps/)
or other UIs and programmatic methods. Another option would be to connect to one of the several
public endpoints provided by infrastructure and API service providers. For development convenience,
[Parity Tech](https://www.parity.io/) maintains archive nodes for Polkadot, Kusama, and their test
networks with public endpoints. These endpoints can be used with
[Polkadot-JS API](https://polkadot.js.org/docs/api) to interact with their respective chains. The
tables below list these endpoints.

### Network Endpoints

#### Main Networks

| Network  | URL                          |
| -------- | ---------------------------- |
| Polkadot | wss://rpc.polkadot.io        |
| Kusama   | wss://kusama-rpc.polkadot.io |

#### Test Networks

| Network | URL                           |
| ------- | ----------------------------- |
| Westend | wss://westend-rpc.polkadot.io |
| Rococo  | wss://rococo-rpc.polkadot.io  |

#### Example usage with Polkadot-JS API

To connect to the Parity node, use the endpoint in your JavaScript apps like so:

```javascript {5}
// Using the Polkadot Mainnet Endpoint
const { ApiPromise, WsProvider } = require('@polkadot/api');
async () => {
  // Construct a provider with the endpoint URL
  const provider = new WsProvider('wss://rpc.polkadot.io/');
  // Create an API instance for Polkadot
  const api = await ApiPromise.create({ provider });
  // ...
```

#### Substrate Connect

[Substrate connect](https://substrate.io/developers/substrate-connect/) builds on Polkadot JS so
building an app is the same experience as with using a traditional RPC server node. It is a fast,
secure, and decentralized way to interact with Polkadot, Kusama, and their parachains right in the
browser.

:::info

Substrate Connect is still under
[active development](https://github.com/paritytech/substrate-connect).

:::

### Third Party Providers

There are a number of third-party providers of RPC infrastructure to the Polkadot and Kusama
communities, commonly providing access to multiple networks and parachains in a single service. They
provide additional services such as higher rate limits, potentially more reliable and scalable
service, and additional metrics.

- [OnFinality](https://onfinality.io)
- [Dwellir](https://dwellir.com)
- [Pinknode](https://pinknode.io)
- [Radium Block](https://radiumblock.com/)
- [1RPC](https://1rpc.io/)

:::note

The list of third party RPC endpoints above for Polkadot and Kusama is directly fetched from
[Polkdot-JS UI](https://polkadot.js.org/apps/#/explorer)

:::

---
id: maintain-errors
title: Errors and How to Resolve Them
sidebar_label: Resolving Errors
description: Common errors you might encounter and how they can be resolved.
keywords: [errors, common errors, fix errors]
slug: ../maintain-errors
---

Errors in Substrate-based chains are usually accompanied by descriptive messages. However, to read
these messages, a tool parsing the blockchain data needs to request _chain metadata_ from a node.
That metadata explains how to read the messages. One such tool with a built-in parser for chain
metadata is the [Polkadot-JS Apps UI](https://polkadot.js.org/apps).

If this page does not answer your question, try searching for your problem at the
[Polkadot Knowledge Base](https://support.polkadot.network/) for more information on troubleshooting
your issue.

## PolkadotJS Apps Explorer

Here's how to find out the detailed error description through Polkadot-JS Apps.

A typical failed transactions looks something like this:

![Error while sending a transaction](../assets/errors/01.jpg)

The image displays only the error name as defined in the code, not its error message. Despite this
error being rather self-explanatory, let's find its details.

In the [explorer tab](https://polkadot.js.org/apps/#/explorer), find the block in which this failure
occurred. Then, expand the `system.ExtrinsicFailed` frame:

![Error described](../assets/errors/02.jpg)

Notice how the `details` field contains a human-readable description of the error. Most errors will
have this, if looked up this way.

[This block](https://polkadot.js.org/apps/#/explorer/query/0xa10104ed21dfe409c7871a975155766c5dd97e1e2ac7faf3c90f1f8dca89104b)
is a live example of the above.

If you cannot look up the error this way, or there is no message in the `details` field, consult the
table below.

## Polkascan and Subscan

Polkascan and Subscan show the `ExtrinsicFailed` event when a transaction does not succeed
([example](https://polkascan.io/polkadot/event/2836233-3)). This event gives us the `error` and
`index` indices of the error but does not give us a nice message to understand what it means. We
will look up the error in the codebase ourselves to understand what went wrong.

First, we should understand that the `index` number is the index of the pallet in the runtime from
which the error originated. The `error` is likewise the index of that pallet's errors which is the
exact one we're looking for. Both of these indices start counting from 0.

For example, if `index` is 5 and `error` is 3, as in the example linked above, we need to look at
the runtime for the fourth error (index 3) in the sixth pallet (index 5).

By looking at the
[runtime code](https://github.com/paritytech/polkadot/blob/master/runtime/polkadot/src/lib.rs) we
see that the pallet at index 5 is `Balances`. Now we will check the Balances pallet's code which is
hosted in the Substrate repository, and look for the fourth error in the `Error enum`. According to
its source the error that we got is `InsufficientBalance`, or in other words, "Balance too low to
send value".

## Common Errors

The table below lists the most commonly encountered errors and ways to resolve them.

| Error              | Description                                                                                                  | Solution                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BadOrigin          | You are not allowed to do this operation, e.g. trying to create a council motion with a non-council account. | Either switch to an account that has the necessary permissions, or check if the operation you're trying to execute is permitted at all (e.g. calling `system.setCode` to do a runtime upgrade directly, without voting).                                                                                                                                                                  |
| BadProof           | The transaction's signature seems invalid.                                                                   | It's possible that the node you're connected to is following an obsolete fork - trying again after it catches up usually resolves the issue. To check for bigger problems, inspect the last finalized and current best block of the node you're connected to and compare the values to chain stats exposed by other nodes - are they in sync? If not, try connecting to a different node. |
| Future             | Transaction nonce too high, i.e. it's "from the future", **see note below**.                                 | Reduce the nonce to +1 of current nonce. Check current nonce by inspecting the address you're using to send the transaction.                                                                                                                                                                                                                                                              |
| Stale              | Transaction nonce too low.                                                                                   | Increase the nonce to +1 of current nonce. Check current nonce by inspecting the address you're using to send the transaction.                                                                                                                                                                                                                                                            |
| ExhaustsResources  | There aren't enough resources left in the current block to submit this transaction.                          | Try again in the next block.                                                                                                                                                                                                                                                                                                                                                              |
| Payment            | Unable to pay for TX fee.                                                                                    | You might not have enough free balance to cover the fee this transaction would incur.                                                                                                                                                                                                                                                                                                     |
| Temporarily banned | The transaction is temporarily banned.                                                                       | The tx is already in pool. Either try on a different node, or wait to see if the initial transaction goes through.                                                                                                                                                                                                                                                                        |

:::note Future Error

This error will not cause the TX to be discarded immediately. Instead, it will be sent to the
[futures queue](https://docs.substrate.io/main-docs/fundamentals/transaction-lifecycle/), where it
will wait to be executed at the correct place in the nonce sequence OR it will get discarded due to
some other error (ex. the validity period expires).\*

:::

## Error Table

The below table is a reference to the errors that exists in Polkadot. It is generated from the
runtime's metadata.

| Pallet                  | Error                                  | Documentation                                                                                                                                    |
| ----------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| System (0)              |                                        |                                                                                                                                                  |
|                         | InvalidSpecName (0)                    | The name of specification does not match between the current runtime and the new runtime.                                                        |
|                         | SpecVersionNeedsToIncrease (1)         | The specification version is not allowed to decrease between the current runtime and the new runtime.                                            |
|                         | FailedToExtractRuntimeVersion (2)      | Failed to extract the runtime version from the new runtime. Either calling `Core_version` or decoding `RuntimeVersion` failed.                   |
|                         | NonDefaultComposite (3)                | Suicide called when the account has non-default composite data.                                                                                  |
|                         | NonZeroRefCount (4)                    | There is a non-zero reference count preventing the account from being purged.                                                                    |
| Scheduler (1)           |                                        |                                                                                                                                                  |
|                         | FailedToSchedule (0)                   | Failed to schedule a call                                                                                                                        |
|                         | NotFound (1)                           | Cannot find the scheduled call.                                                                                                                  |
|                         | TargetBlockNumberInPast (2)            | Given target block number is in the past.                                                                                                        |
|                         | RescheduleNoChange (3)                 | Reschedule failed because it does not change scheduled time.                                                                                     |
| Balances (5)            |                                        |                                                                                                                                                  |
|                         | VestingBalance (0)                     | Vesting balance too high to send value                                                                                                           |
|                         | LiquidityRestrictions (1)              | Account liquidity restrictions prevent withdrawal                                                                                                |
|                         | Overflow (2)                           | Got an overflow after adding                                                                                                                     |
|                         | InsufficientBalance (3)                | Balance too low to send value                                                                                                                    |
|                         | ExistentialDeposit (4)                 | Value too low to create account due to existential deposit                                                                                       |
|                         | KeepAlive (5)                          | Transfer/payment would kill account                                                                                                              |
|                         | ExistingVestingSchedule (6)            | A vesting schedule already exists for this account                                                                                               |
|                         | DeadAccount (7)                        | Beneficiary account must pre-exist                                                                                                               |
| Authorship (6)          |                                        |                                                                                                                                                  |
|                         | InvalidUncleParent (0)                 | The uncle parent not in the chain.                                                                                                               |
|                         | UnclesAlreadySet (1)                   | Uncles already set in the block.                                                                                                                 |
|                         | TooManyUncles (2)                      | Too many uncles.                                                                                                                                 |
|                         | GenesisUncle (3)                       | The uncle is genesis.                                                                                                                            |
|                         | TooHighUncle (4)                       | The uncle is too high in chain.                                                                                                                  |
|                         | UncleAlreadyIncluded (5)               | The uncle is already included.                                                                                                                   |
|                         | OldUncle (6)                           | The uncle isn't recent enough to be included.                                                                                                    |
| Staking (7)             |                                        |                                                                                                                                                  |
|                         | NotController (0)                      | Not a controller account.                                                                                                                        |
|                         | NotStash (1)                           | Not a stash account.                                                                                                                             |
|                         | AlreadyBonded (2)                      | Stash is already bonded.                                                                                                                         |
|                         | AlreadyPaired (3)                      | Controller is already paired.                                                                                                                    |
|                         | EmptyTargets (4)                       | Targets cannot be empty.                                                                                                                         |
|                         | DuplicateIndex (5)                     | Duplicate index.                                                                                                                                 |
|                         | InvalidSlashIndex (6)                  | Slash record index out of bounds.                                                                                                                |
|                         | InsufficientValue (7)                  | Can not bond with value less than minimum balance.                                                                                               |
|                         | NoMoreChunks (8)                       | Can not schedule more unlock chunks.                                                                                                             |
|                         | NoUnlockChunk (9)                      | Can not rebond without unlocking chunks.                                                                                                         |
|                         | FundedTarget (10)                      | Attempting to target a stash that still has funds.                                                                                               |
|                         | InvalidEraToReward (11)                | Invalid era to reward.                                                                                                                           |
|                         | InvalidNumberOfNominations (12)        | Invalid number of nominations.                                                                                                                   |
|                         | NotSortedAndUnique (13)                | Items are not sorted and unique.                                                                                                                 |
|                         | AlreadyClaimed (14)                    | Rewards for this era have already been claimed for this validator.                                                                               |
|                         | OffchainElectionEarlySubmission (15)   | The submitted result is received out of the open window.                                                                                         |
|                         | OffchainElectionWeakSubmission (16)    | The submitted result is not as good as the one stored on chain.                                                                                  |
|                         | SnapshotUnavailable (17)               | The snapshot data of the current window is missing.                                                                                              |
|                         | OffchainElectionBogusWinnerCount (18)  | Incorrect number of winners were presented.                                                                                                      |
|                         | OffchainElectionBogusWinner (19)       | One of the submitted winners is not an active candidate on chain (index is out of range in snapshot).                                            |
|                         | OffchainElectionBogusCompact (20)      | Error while building the assignment type from the compact. This can happen if an index is invalid, or if the weights _overflow_.                 |
|                         | OffchainElectionBogusNominator (21)    | One of the submitted nominators is not an active nominator on chain.                                                                             |
|                         | OffchainElectionBogusNomination (22)   | One of the submitted nominators has an edge to which they have not voted on chain.                                                               |
|                         | OffchainElectionSlashedNomination (23) | One of the submitted nominators has an edge which is submitted before the last non-zero slash of the target.                                     |
|                         | OffchainElectionBogusSelfVote (24)     | A self vote must only be originated from a validator to ONLY themselves.                                                                         |
|                         | OffchainElectionBogusEdge (25)         | The submitted result has unknown edges that are not among the presented winners.                                                                 |
|                         | OffchainElectionBogusScore (26)        | The claimed score does not match with the one computed from the data.                                                                            |
|                         | OffchainElectionBogusElectionSize (27) | The election size is invalid.                                                                                                                    |
|                         | CallNotAllowed (28)                    | The call is not allowed at the given time due to restrictions of election period.                                                                |
|                         | IncorrectHistoryDepth (29)             | Incorrect previous history depth input provided.                                                                                                 |
|                         | IncorrectSlashingSpans (30)            | Incorrect number of slashing spans provided.                                                                                                     |
| Session (9)             |                                        |                                                                                                                                                  |
|                         | InvalidProof (0)                       | Invalid ownership proof.                                                                                                                         |
|                         | NoAssociatedValidatorId (1)            | No associated validator ID for account.                                                                                                          |
|                         | DuplicatedKey (2)                      | Registered duplicate key.                                                                                                                        |
|                         | NoKeys (3)                             | No keys are associated with this account.                                                                                                        |
| Grandpa (11)            |                                        |                                                                                                                                                  |
|                         | PauseFailed (0)                        | Attempt to signal GRANDPA pause when the authority set isn't live (either paused or already pending pause).                                      |
|                         | ResumeFailed (1)                       | Attempt to signal GRANDPA resume when the authority set isn't paused (either live or already pending resume).                                    |
|                         | ChangePending (2)                      | Attempt to signal GRANDPA change with one already pending.                                                                                       |
|                         | TooSoon (3)                            | Cannot signal forced change so soon after last.                                                                                                  |
|                         | InvalidKeyOwnershipProof (4)           | A key ownership proof provided as part of an equivocation report is invalid.                                                                     |
|                         | InvalidEquivocationProof (5)           | An equivocation proof provided as part of an equivocation report is invalid.                                                                     |
|                         | DuplicateOffenceReport (6)             | A given equivocation report is valid but already previously reported.                                                                            |
| ImOnline (12)           |                                        |                                                                                                                                                  |
|                         | InvalidKey (0)                         | Non existent public key.                                                                                                                         |
|                         | DuplicatedHeartbeat (1)                | Duplicated heartbeat.                                                                                                                            |
| Democracy (14)          |                                        |                                                                                                                                                  |
|                         | ValueLow (0)                           | Value too low                                                                                                                                    |
|                         | ProposalMissing (1)                    | Proposal does not exist                                                                                                                          |
|                         | BadIndex (2)                           | Unknown index                                                                                                                                    |
|                         | AlreadyCanceled (3)                    | Cannot cancel the same proposal twice                                                                                                            |
|                         | DuplicateProposal (4)                  | Proposal already made                                                                                                                            |
|                         | ProposalBlacklisted (5)                | Proposal still blacklisted                                                                                                                       |
|                         | NotSimpleMajority (6)                  | Next external proposal not simple majority                                                                                                       |
|                         | InvalidHash (7)                        | Invalid hash                                                                                                                                     |
|                         | NoProposal (8)                         | No external proposal                                                                                                                             |
|                         | AlreadyVetoed (9)                      | Identity may not veto a proposal twice                                                                                                           |
|                         | NotDelegated (10)                      | Not delegated                                                                                                                                    |
|                         | DuplicatePreimage (11)                 | Preimage already noted                                                                                                                           |
|                         | NotImminent (12)                       | Not imminent                                                                                                                                     |
|                         | TooEarly (13)                          | Too early                                                                                                                                        |
|                         | Imminent (14)                          | Imminent                                                                                                                                         |
|                         | PreimageMissing (15)                   | Preimage not found                                                                                                                               |
|                         | ReferendumInvalid (16)                 | Vote given for invalid referendum                                                                                                                |
|                         | PreimageInvalid (17)                   | Invalid preimage                                                                                                                                 |
|                         | NoneWaiting (18)                       | No proposals waiting                                                                                                                             |
|                         | NotLocked (19)                         | The target account does not have a lock.                                                                                                         |
|                         | NotExpired (20)                        | The lock on the account to be unlocked has not yet expired.                                                                                      |
|                         | NotVoter (21)                          | The given account did not vote on the referendum.                                                                                                |
|                         | NoPermission (22)                      | The actor has no permission to conduct the action.                                                                                               |
|                         | AlreadyDelegating (23)                 | The account is already delegating.                                                                                                               |
|                         | Overflow (24)                          | An unexpected integer overflow occurred.                                                                                                         |
|                         | Underflow (25)                         | An unexpected integer underflow occurred.                                                                                                        |
|                         | InsufficientFunds (26)                 | Too high a balance was provided that the account cannot afford.                                                                                  |
|                         | NotDelegating (27)                     | The account is not currently delegating.                                                                                                         |
|                         | VotesExist (28)                        | The account currently has votes attached to it and the operation cannot succeed until these are removed, either through `unvote` or `reap_vote`. |
|                         | InstantNotAllowed (29)                 | The instant referendum origin is currently disallowed.                                                                                           |
|                         | Nonsense (30)                          | Delegation to oneself makes no sense.                                                                                                            |
|                         | WrongUpperBound (31)                   | Invalid upper bound.                                                                                                                             |
|                         | MaxVotesReached (32)                   | Maximum number of votes reached.                                                                                                                 |
|                         | InvalidWitness (33)                    | The provided witness data is wrong.                                                                                                              |
|                         | TooManyProposals (34)                  | Maximum number of proposals reached.                                                                                                             |
| Council (15)            |                                        |                                                                                                                                                  |
|                         | NotMember (0)                          | Account is not a member                                                                                                                          |
|                         | DuplicateProposal (1)                  | Duplicate proposals not allowed                                                                                                                  |
|                         | ProposalMissing (2)                    | Proposal must exist                                                                                                                              |
|                         | WrongIndex (3)                         | Mismatched index                                                                                                                                 |
|                         | DuplicateVote (4)                      | Duplicate vote ignored                                                                                                                           |
|                         | AlreadyInitialized (5)                 | Members are already initialized!                                                                                                                 |
|                         | TooEarly (6)                           | The close call was made too early, before the end of the voting.                                                                                 |
|                         | TooManyProposals (7)                   | There can only be a maximum of `MaxProposals` active proposals.                                                                                  |
|                         | WrongProposalWeight (8)                | The given weight bound for the proposal was too low.                                                                                             |
|                         | WrongProposalLength (9)                | The given length bound for the proposal was too low.                                                                                             |
| TechnicalCommittee (16) |                                        |                                                                                                                                                  |
|                         | NotMember (0)                          | Account is not a member                                                                                                                          |
|                         | DuplicateProposal (1)                  | Duplicate proposals not allowed                                                                                                                  |
|                         | ProposalMissing (2)                    | Proposal must exist                                                                                                                              |
|                         | WrongIndex (3)                         | Mismatched index                                                                                                                                 |
|                         | DuplicateVote (4)                      | Duplicate vote ignored                                                                                                                           |
|                         | AlreadyInitialized (5)                 | Members are already initialized!                                                                                                                 |
|                         | TooEarly (6)                           | The close call was made too early, before the end of the voting.                                                                                 |
|                         | TooManyProposals (7)                   | There can only be a maximum of `MaxProposals` active proposals.                                                                                  |
|                         | WrongProposalWeight (8)                | The given weight bound for the proposal was too low.                                                                                             |
|                         | WrongProposalLength (9)                | The given length bound for the proposal was too low.                                                                                             |
| ElectionsPhragmen (17)  |                                        |                                                                                                                                                  |
|                         | UnableToVote (0)                       | Cannot vote when no candidates or members exist.                                                                                                 |
|                         | NoVotes (1)                            | Must vote for at least one candidate.                                                                                                            |
|                         | TooManyVotes (2)                       | Cannot vote more than candidates.                                                                                                                |
|                         | MaximumVotesExceeded (3)               | Cannot vote more than maximum allowed.                                                                                                           |
|                         | LowBalance (4)                         | Cannot vote with stake less than minimum balance.                                                                                                |
|                         | UnableToPayBond (5)                    | Voter can not pay voting bond.                                                                                                                   |
|                         | MustBeVoter (6)                        | Must be a voter.                                                                                                                                 |
|                         | ReportSelf (7)                         | Cannot report self.                                                                                                                              |
|                         | DuplicatedCandidate (8)                | Duplicated candidate submission.                                                                                                                 |
|                         | MemberSubmit (9)                       | Member cannot re-submit candidacy.                                                                                                               |
|                         | RunnerSubmit (10)                      | Runner cannot re-submit candidacy.                                                                                                               |
|                         | InsufficientCandidateFunds (11)        | Candidate does not have enough funds.                                                                                                            |
|                         | NotMember (12)                         | Not a member.                                                                                                                                    |
|                         | InvalidCandidateCount (13)             | The provided count of number of candidates is incorrect.                                                                                         |
|                         | InvalidVoteCount (14)                  | The provided count of number of votes is incorrect.                                                                                              |
|                         | InvalidRenouncing (15)                 | The renouncing origin presented a wrong `Renouncing` parameter.                                                                                  |
|                         | InvalidReplacement (16)                | Prediction regarding replacement after member removal is wrong.                                                                                  |
| Treasury (19)           |                                        |                                                                                                                                                  |
|                         | InsufficientProposersBalance (0)       | Proposer's balance is too low.                                                                                                                   |
|                         | InvalidIndex (1)                       | No proposal or bounty at that index.                                                                                                             |
|                         | ReasonTooBig (2)                       | The reason given is just too big.                                                                                                                |
|                         | AlreadyKnown (3)                       | The tip was already found/started.                                                                                                               |
|                         | UnknownTip (4)                         | The tip hash is unknown.                                                                                                                         |
|                         | NotFinder (5)                          | The account attempting to retract the tip is not the finder of the tip.                                                                          |
|                         | StillOpen (6)                          | The tip cannot be claimed/closed because there are not enough tippers yet.                                                                       |
|                         | Premature (7)                          | The tip cannot be claimed/closed because it's still in the countdown period.                                                                     |
|                         | UnexpectedStatus (8)                   | The bounty status is unexpected.                                                                                                                 |
|                         | RequireCurator (9)                     | Require bounty curator.                                                                                                                          |
|                         | InvalidValue (10)                      | Invalid bounty value.                                                                                                                            |
|                         | InvalidFee (11)                        | Invalid bounty fee.                                                                                                                              |
|                         | PendingPayout (12)                     | A bounty payout is pending. To cancel the bounty, you must unassign and slash the curator.                                                       |
| Claims (24)             |                                        |                                                                                                                                                  |
|                         | InvalidEthereumSignature (0)           | Invalid Ethereum signature.                                                                                                                      |
|                         | SignerHasNoClaim (1)                   | Ethereum address has no claim.                                                                                                                   |
|                         | SenderHasNoClaim (2)                   | Account ID sending tx has no claim.                                                                                                              |
|                         | PotUnderflow (3)                       | There's not enough in the pot to pay out some unvested amount. Generally implies a logic error.                                                  |
|                         | InvalidStatement (4)                   | A needed statement was not included.                                                                                                             |
|                         | VestedBalanceExists (5)                | The account already has a vested balance.                                                                                                        |
| Vesting (25)            |                                        |                                                                                                                                                  |
|                         | NotVesting (0)                         | The account given is not vesting.                                                                                                                |
|                         | ExistingVestingSchedule (1)            | An existing vesting schedule already exists for this account that cannot be clobbered.                                                           |
|                         | AmountLow (2)                          | Amount being transferred is too low to create a vesting schedule.                                                                                |
| Identity (28)           |                                        |                                                                                                                                                  |
|                         | TooManySubAccounts (0)                 | Too many subs-accounts.                                                                                                                          |
|                         | NotFound (1)                           | Account isn't found.                                                                                                                             |
|                         | NotNamed (2)                           | Account isn't named.                                                                                                                             |
|                         | EmptyIndex (3)                         | Empty index.                                                                                                                                     |
|                         | FeeChanged (4)                         | Fee is changed.                                                                                                                                  |
|                         | NoIdentity (5)                         | No identity found.                                                                                                                               |
|                         | StickyJudgement (6)                    | Sticky judgement.                                                                                                                                |
|                         | JudgementGiven (7)                     | Judgement given.                                                                                                                                 |
|                         | InvalidJudgement (8)                   | Invalid judgement.                                                                                                                               |
|                         | InvalidIndex (9)                       | The index is invalid.                                                                                                                            |
|                         | InvalidTarget (10)                     | The target is invalid.                                                                                                                           |
|                         | TooManyFields (11)                     | Too many additional fields.                                                                                                                      |
|                         | TooManyRegistrars (12)                 | Maximum amount of registrars reached. Cannot add any more.                                                                                       |
|                         | AlreadyClaimed (13)                    | Account ID is already named.                                                                                                                     |
|                         | NotSub (14)                            | Sender is not a sub-account.                                                                                                                     |
|                         | NotOwned (15)                          | Sub-account isn't owned by sender.                                                                                                               |
| Proxy (29)              |                                        |                                                                                                                                                  |
|                         | TooMany (0)                            | There are too many proxies registered or too many announcements pending.                                                                         |
|                         | NotFound (1)                           | Proxy registration not found.                                                                                                                    |
|                         | NotProxy (2)                           | Sender is not a proxy of the account to be proxied.                                                                                              |
|                         | Unproxyable (3)                        | A call which is incompatible with the proxy type's filter was attempted.                                                                         |
|                         | Duplicate (4)                          | Account is already a proxy.                                                                                                                      |
|                         | NoPermission (5)                       | Call may not be made by proxy because it may escalate its privileges.                                                                            |
|                         | Unannounced (6)                        | Announcement, if made at all, was made too recently.                                                                                             |
| Multisig (30)           |                                        |                                                                                                                                                  |
|                         | MinimumThreshold (0)                   | Threshold must be 2 or greater.                                                                                                                  |
|                         | AlreadyApproved (1)                    | Call is already approved by this signatory.                                                                                                      |
|                         | NoApprovalsNeeded (2)                  | Call doesn't need any (more) approvals.                                                                                                          |
|                         | TooFewSignatories (3)                  | There are too few signatories in the list.                                                                                                       |
|                         | TooManySignatories (4)                 | There are too many signatories in the list.                                                                                                      |
|                         | SignatoriesOutOfOrder (5)              | The signatories were provided out of order; they should be ordered.                                                                              |
|                         | SenderInSignatories (6)                | The sender was contained in the other signatories; it shouldn't be.                                                                              |
|                         | NotFound (7)                           | Multisig operation not found when attempting to cancel.                                                                                          |
|                         | NotOwner (8)                           | Only the account that originally created the multisig is able to cancel it.                                                                      |
|                         | NoTimepoint (9)                        | No timepoint was given, yet the multisig operation is already underway.                                                                          |
|                         | WrongTimepoint (10)                    | A different timepoint was given to the multisig operation that is underway.                                                                      |
|                         | UnexpectedTimepoint (11)               | A timepoint was given, yet no multisig operation is underway.                                                                                    |
|                         | WeightTooLow (12)                      | The maximum weight information provided was too low.                                                                                             |
|                         | AlreadyStored (13)                     | The data to be stored is already stored.                                                                                                         |


---
id: maintain-guides-async-backing
title: Upgrade Parachain for Asynchronous Backing Compatibility
sidebar_label: Async Backing Upgrade
description:
  Steps on how to upgrade a parachain to be compatible with the relay chain's async backing feature.
keywords: [async, backing, parachain, consensus]
slug: ../maintain-guides-async-backing
---

:::info Who is this guide for?

This guide is relevant for cumulus based parachain projects started in 2023 or before. Later
projects should already be async backing compatible. If starting a new parachain project, please use
an async backing compatible template such as
[`cumulus/parachain-template`](https://github.com/paritytech/cumulus/tree/rh-test-async-backing).

:::

The rollout process for Async Backing has three phases. Phases 1 and 2 below put new infrastructure
in place. Then we can simply turn on async backing in phase 3. But first, some pre-reqs and context
to set the stage.

## Async Backing Prerequisites

:::info

For more contextual information about asynchronous backing, see
[this page](../learn/learn-async-backing.md).

:::

Pull the latest version of Cumulus for use with your parachain. It contains necessary changes for
async backing compatibility. Latest on master branch of
[Polkadot-SDK](https://github.com/paritytech/polkadot-sdk) is currently sufficient. Any 2024 release
will work as well.

## Async Backing Terminology and Parameters

Time for a bit of context before we get started. The following concepts will aid in demystifying the
collator side of Async Backing and establish a basic understanding of the changes being made:

- **Unincluded segment** - From the perspective of a parachain block under construction, the
  unincluded segment describes a chain of recent block ancestors which have yet to be included on
  the relay chain. The ability to build new blocks on top of the unincluded segment rather than on
  top of blocks freshly included in the relay chain is the core of asynchronous backing.
- **Capacity** - The maximum size of the unincluded segment. The longer this is, the farther ahead a
  parachain can work, producing new candidates before the ancestors of those candidates have been
  seen as included on-chain. Practically, a capacity of 2-3 is sufficient to realize the full
  benefits of asynchronous backing, at least until the release of elastic scaling.
- **Velocity** - The base rate at which a parachain should produce blocks. A velocity of 1 indicates
  that 1 parachain block should be produced per relay chain block. In order to fill the unincluded
  segment with candidates, collators may build up to `Velocity + 1` candidates per aura slot while
  there is remaining capacity. When elastic scaling has been released velocities greater than 1 will
  be supported.
- **AllowMultipleBlocksPerSlot** - If this is `true`, Aura will allow slots to stay the same across
  sequential parablocks. Otherwise the slot number must increase with each block. To fill the
  unincluded segment as described above we need this to be `true`.
- **FixedVelocityConsensusHook** - This is a variety of `ConsensusHook` intended to be passed to
  `parachain-system` as part of its `Config`. It is triggered on initialization of a new runtime. An
  instance of `FixedVelocityConsensusHook` is defined with both a fixed capacity and velocity. It
  aborts the runtime early if either capacity or velocity is exceeded, as the collator shouldn’t be
  creating additional blocks in that case.
- **AsyncBackingParams.max_candidate_depth** - This parameter determines the maximum unincluded
  segment depth the relay chain will support. Candidates sent to validators which exceed
  `max_candidate_depth` will be ignored. `Capacity`, as mentioned above, should not exceed
  `max_candidate_depth`.
- **AsyncBackingParams.allowed_ancestry_len** - Each parachain block candidate has a `relay_parent`
  from which its execution and validation context is derived. Before async backing the
  `relay_parent` for a candidate not yet backed was required to be the fresh head of a fork. With
  async backing we can relax this requirement. Instead we set a conservative maximum age in blocks
  for the `relay_parent`s of candidates in the unincluded segment. This age, `allowed_ancestry_len`
  lives on the relay chain and is queried by parachains when deciding which block to build on top
  of.
- **Lookahead Collator** - A collator for Aura that looks ahead of the most recently included
  parachain block when determining what to build upon. This collator also builds additional blocks
  when the maximum backlog is not saturated. The size of the backlog is determined by invoking the
  AuraUnincludedSegmentApi. If that runtime API is not supported, this assumes a maximum backlog
  size of 1.

## Phase 1 - Update Parachain Runtime

This phase involves configuring your parachain’s runtime to make use of async backing system.

1. Establish constants for `capacity` and `velocity` and set both of them to 1 in
   `/runtime/src/lib.rs`.

2. Establish a constant relay chain slot duration measured in milliseconds equal to `6000` in
   `/runtime/src/lib.rs`.

![capacity-velocity](../assets/async/async-backing-capacity-velocity.png)

3. Establish constants `MILLISECS_PER_BLOCK` and `SLOT_DURATION` if not already present in
   `/runtime/src/lib.rs`.

![capacity-velocity](../assets/async/async-backing-slot-duration.png)

4. Configure `cumulus_pallet_parachain_system` in `runtime/src/lib.rs`

   - Define a `FixedVelocityConsensusHook` using our capacity, velocity, and relay slot duration
     constants. Use this to set the parachain system `ConsensusHook` property.

   ![consensus-hook](../assets/async/async-backing-consensus-hook.png)

   - Set the parachain system property `CheckAssociatedRelayNumber` to
     `RelayNumberMonotonicallyIncreases`

   ![Associated-Relay-number](../assets/async/async-backing-associated-relay.png)

5. Configure `pallet_aura` in `runtime/src/lib.rs`

   - Set `AllowMultipleBlocksPerSlot` to false
   - Define `pallet_aura::SlotDuration` using our constant `SLOT_DURATION`

   ![Aura-config](../assets/async/async-backing-config-aura.png)

6. Update `aura_api::SlotDuration()` to match the constant `SLOT_DURATION`

   ![Aura-spi](../assets/async/async-backing-aura-api.png)

7. Implement the AuraUnincludedSegmentApi, which allows the collator client to query its runtime to
   determine whether it should author a block.

   - Add the dependency `cumulus-primitives-aura` to the `runtime/Cargo.toml` file for your runtime

     ![cargo-toml](../assets/async/async-backing-cargo.png)

   - Inside the `impl_runtime_apis!` block for your runtime, implement the
     `AuraUnincludedSegmentApi` as shown below.

     ![unincluded-segment](../assets/async/async-backing-unincluded-segment.png)

     Important note: With a capacity of 1 we have an effective velocity of ½ even when velocity is
     configured to some larger value. This is because capacity will be filled after a single block
     is produced and will only be freed up after that block is included on the relay chain, which
     takes 2 relay blocks to accomplish. Thus with capacity 1 and velocity 1 we get the customary 12
     second parachain block time.

8. If your `runtime/src/lib.rs` provides a `CheckInherents` type to `register_validate_block`,
   remove it. `FixedVelocityConsensusHook` makes it unnecessary. The following example shows how
   `register_validate_block` should look after removing `CheckInherents`.

   ![register-validate-block](../assets/async/async-backing-register-validate.png)

## Phase 2 - Update Parachain Nodes

This phase consists of plugging in the new lookahead collator node.

1. Import `cumulus_primitives_core::ValidationCode` to `node/src/service.rs`

![import-validation-code](../assets/async/async-backing-cumulus-primitives.png)

2. In `node/src/service.rs`, modify `sc_service::spawn_tasks` to use a clone of `Backend` rather
   than the original

![spawn-tasks](../assets/async/async-backing-spawn-tasks.png)

3. Add `backend` as a parameter to `start_consensus()` in `node/src/service.rs`

![start-consensus-1](../assets/async/async-backing-start-consensus.png)

![start-consensus-2](../assets/async/async-backing-start-consensus-2.png)

4. In `start_consensus()` import the lookahead collator rather than the basic collator

![lookahead-collator](../assets/async/async-backing-lookahead-collator.png)

5. In `start_consensus()` replace the `BasicAuraParams` struct with `AuraParams`
   - Change the struct type from `BasicAuraParams` to `AuraParams`
   - In the `para_client` field, pass in a cloned para client rather than the original
   - Add a `para_backend` parameter after `para_client`, passing in our para backend
   - Provide a `code_hash_provider` closure like that shown below
   - Increase `authoring_duration` from 500 milliseconds to 1500

Note: Set `authoring_duration` to whatever you want, taking your own hardware into account. But if
the backer who should be slower than you due to reading from disk, times out at two seconds your
candidates will be rejected.

![Aura-params](../assets/async/async-backing-aura-params.png)

6. In `start_consensus()` replace `basic_aura::run` with `aura::run`

![Aura-run](../assets/async/async-backing-aura-run.png)

## Phase 3 - Activate Async Backing

This phase consists of changes to your parachain’s runtime that activate async backing feature.

1. Configure `pallet_aura`, setting `AllowMultipleBlocksPerSlot` to true in `runtime/src/lib.rs`.

![Aura-allow-multiple-blocks](../assets/async/async-backing-allow-multiple.png)

2. Increase the maximum unincluded segment capacity in `runtime/src/lib.rs`.

![Unincluded-segment-capacity](../assets/async/async-backing-unincluded-segment.png)

3. Decrease `MILLISECS_PER_BLOCK` to 6000.

- Note: For a parachain which measures time in terms of its own block number rather than by relay
  block number it may be preferable to increase velocity. Changing block time may cause
  complications, requiring additional changes. See the section “Timing by Block Number”.

![block-time](../assets/async/async-backing-block-time.png)

4. Update `MAXIMUM_BLOCK_WEIGHT` to reflect the increased time available for block production.

![block-weight](../assets/async/async-backing-maxblock-weight.png)

5. Add a feature flagged alternative for `MinimumPeriod` in `pallet_timestamp`. The type should be
   `ConstU64<0>` with the feature flag experimental, and `ConstU64<{SLOT_DURATION / 2}>` without.

![minimum-period](../assets/async/async-backing-minimum-period.png)

## Timing by Block Number

With asynchronous backing it will be possible for parachains to opt for a block time of 6 seconds
rather than 12 seconds. But modifying block duration isn’t so simple for a parachain which was
measuring time in terms of its own block number. It could result in expected and actual time not
matching up, stalling the parachain.

One strategy to deal with this issue is to instead rely on relay chain block numbers for timing.
Relay block number is kept track of by each parachain in `pallet-parachain-system` with the storage
value `LastRelayChainBlockNumber`. This value can be obtained and used wherever timing based on
block number is needed.



---
id: maintain-guides-avoid-slashing
title: Validator Best Practices
sidebar_label: Validator Best Practices
description: Best practices to avoid slashing.
keywords: [validator, rewards, slashing]
slug: ../maintain-guides-avoid-slashing
---

## Best practices to prevent slashing

Slashing is implemented as a deterrent for validators to misbehave. Slashes are applied to a
validator’s total stake (own + nominated) and can range from as little as 0.01% or rise to 100%. In
all instances, slashes are accompanied by a loss of nominators.

A slash may occur under four circumstances:

1.  Unresponsiveness – Slashing starts when 10% of the active validators set are offline and
    increases in a linear manner until 44% of the validator set is offline; at this point, the slash
    is held at 7%
2.  Equivocation – A slash of 0.01% is applied with as little as a single evocation. The slashed
    amount increases to 100% incrementally as more validators also equivocate.
3.  Malicious action – This may result from a validator trying to represent the contents of a block
    falsely. Slashing penalties of 100% may apply.
4.  Application related (bug or otherwise) – The amount is unknown and may manifest as scenarios 1,
    2, and 3 above.

This article provides some best practices to prevent slashing based on lessons learned from previous
slashes. It provides comments and guidance for all circumstances except for malicious action by the
node operator.

## Unresponsiveness

An offline event occurs when a validator does not produce a BLOCK or IMONLINE message within an
EPOCH. Isolated offline events do not result in a slash; however, the validator would not earn any
era points while offline. A slash for unresponsiveness occurs when 10% or more of the active
validators are offline at the same time. Check the Wiki section on
[slashing due to unresponsiveness](../learn/learn-staking-advanced.md#unresponsiveness) to learn
more about its specifics.

The following are recommendations to validators to avoid slashing under liveliness for servers that
have historically functioned:

1.  Utilize systems to host your validator instance. Systemd should be configured to auto reboot the
    service with a minimum 60-second delay. This configuration should aid with re-establishing the
    instance under isolated failures with the binary.
2.  A validator instance can demonstrate un-lively behaviour if it cannot sync new blocks. This may
    result from insufficient disk space or a corrupt database.
3.  Monitoring should be implemented that allows node operators to monitor connectivity network
    connectivity to the peer-to-peer port of the validator instance. Monitoring should also be
    implemented to ensure that there is <50 Block ‘drift’ between the target and best blocks. If
    either event produces a failure, the node operator should be notified. The following are
    recommendations to validators to avoid liveliness for new servers / migrated servers:
4.  Ensure that the `--validator` flag is used when starting the validator instance
5.  If switching keys, ensure that the correct session keys are applied
6.  If migrating using a two-server approach, ensure that you don’t switch off the original server
    too soon.
7.  Ensure that the database on the new server is fully synchronized.
8.  It is highly recommended to avoid hosting on providers that other validators may also utilize.
    If the provider fails, there is a probability that one or more other validators would also fail
    due to liveliness building to a slash.  
    There is a precedent that a slash may be forgiven if a single validator faces an offline event
    when a larger operator also faces multiple offline events, resulting in a slash.

## Equivocation

Equivocation events can occur when a validator produces two or more of the same block; under this
condition, it is referred to as a BABE equivocation. Equivocation may also happen when a validator
signs two or more of the same consensus vote; under this condition, it is referred to as a GRANDPA
Equivocation. Equivocations usually occur when duplicate signing keys reside on the validator host.
If keys are never duplicated, the probability of an equivocation slash decreases to near 0. Check
the Wiki section on [Equivocation](../learn/learn-staking-advanced.md#equivocation) to learn more
about its specifics.

The following are scenarios that build towards slashes under equivocation:

1.  Cloning a server, i.e., copying all contents when migrating to new hardware. This action should
    be avoided. If an image is desired, it should be taken before keys are generated.
2.  High Availability (HA) Systems – Equivocation can occur if there are any concurrent operations,
    either when a failed server restarts or if false positive event results in both servers being
    online simultaneously. HA systems are to be treated with extreme caution and are not advised.
3.  The keystore folder is copied when attempting to copy a database from one instance to another.  
    It is important to note that equivocation slashes occur with a single incident. This can happen
    if duplicated keystores are used for only a few seconds. A slash can result in losing
    nominators, and funds, removal from the Thousand Validator Programme, and reputational damage.
    An offline event results in losing some funds but the retention of nominators and a fault under
    the Thousand Validator Programme.

## Application Related

In the past, there have been releases with bugs that lead to slashes; these issues are not as
prevalent in current releases. The following are advised to node operators to ensure that they
obtain pristine binaries or source code and to ensure the security of their node:

1.  Always download either source files or binaries from the official Parity repository
2.  Verify the hash of downloaded files.
3.  Use the W3F secure validator setup or adhere to its principles
4.  Ensure essential security items are checked, use a firewall, manage user access, use SSH
    certificates
5.  Avoid using your server as a general-purpose system. Hosting a validator on your workstation or
    one that hosts other services increases the risk of maleficence.

## Examples

| Network  | Era  | Event Type              | Details                                                                                                                                                                                                                                                                                                                       | Action Taken                                                                                                                                                                                                                                                                     |
| -------- | ---- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Polkadot | 774  | Small Equivocation      | [The validator](https://matrix.to/#/!NZrbtteFeqYKCUGQtr:matrix.parity.io/$165562246360408hKCfC:matrix.org?via=matrix.parity.io&via=corepaper.org&via=matrix.org) migrated servers and cloned the keystore folder. The on-chain event can be viewed [here](https://polkadot.subscan.io/extrinsic/11190109-0?event=11190109-5). | The validator did not submit a request for the slash to be canceled.                                                                                                                                                                                                             |
| Kusama   | 3329 | Small Equivocation      | The validator operated a test machine with cloned keys; the test machine was online at the same time as the primary, which resulted in a slash. Details can be found [here](https://kusama.polkassembly.io/post/1343).                                                                                                        | The validator requested a cancellation of the slash, but the council declined.                                                                                                                                                                                                   |
| Kusama   | 3995 | Small Equivocation      | The validator noticed several errors, after which the client crashed, and a slash was applied. The validator recorded all events and opened GitHub issues to allow for technical opinions to be shared. Details can be found [here](https://kusama.polkassembly.io/post/1733).                                                | The validator requested to cancel the slash. The council approved the request as they believed the error was not operator related.                                                                                                                                               |
| Kusama   | 4543 | Medium Unresponsiveness | A large amount of disputes flooded the network resulting in an application fault. The fault caused the client software to hang and as a result ~197 unique validators become unresponsive. Further details can be found [here](https://kusama.polkassembly.io/referenda/16).                                                  | The pending slash was cancelled and with runtime [9350](https://kusama.polkassembly.io/referenda/24) all lost nominations were restored. The application bug was addressed with client version [0.9.36](https://forum.polkadot.network/t/polkadot-release-analysis-v0-9-36/1529) |


---
id: maintain-guides-democracy
title: Participate in Democracy
sidebar_label: Participate in Democracy
description: Steps on how to participate in democracy.
keywords: [democracy, council, action, proposal]
slug: ../maintain-guides-democracy
---

:::caution Polkadot OpenGov is Live! This document will soon be archived.

Polkadot OpenGov: Polkadot’s next generation of decentralized governance is live on Polkadot and
Kusama. Check the [Polkadot OpenGov page](../learn/learn-polkadot-opengov.md) for a detailed
explanation of the latest features of Polkadot governance. The democracy pallet (Gov1) will soon be
deprecated.

:::

The public referenda chamber is one of the three bodies of on-chain governance as it's instantiated
in Polkadot and Kusama. The other two bodies are the
[council](maintain-guides-how-to-join-council.md) and the
[technical committee](../learn/learn-governance.md#technical-committee).

Public referenda can be proposed and voted on by any token holder in the system as long as they
provide a bond. After a proposal is made, others can agree with it by _endorsing_ it and putting up
tokens equal to the original bond. During every launch period, the most endorsed proposal will be
moved to the public referenda table where it can be voted upon. Voters who are willing to lock up
their tokens for a greater duration of time can do so and get their votes amplified. For more
details on the governance system please see [here](../learn/learn-governance.md).

This guide will instruct token holders how to propose and vote on public referenda using the
Democracy module. Below are a few links to stay informed and directly engage with the community.

- [Polkadot Direction](https://matrix.to/#/#Polkadot-Direction:parity.io) - a place to discuss
  governance and the future of Polkadot.
- [Kusama Direction](https://matrix.to/#/#Kusama-Direction:parity.io) - a place to discuss
  governance and the future of Kusama.
- [Polkadot](https://polkadot.polkassembly.io) and [Kusama](https://kusama.polkassembly.io)
  Polkassembly - for current referenda, latest proposals, motions, treasury proposals, tips,
  bounties, and more.
- [Polkadot Daily Digest](https://matrix.to/#/#dailydigest:web3.foundation) - News about what is
  happening in the Polkadot ecosystem, published every weekday except holidays.

## Important Parameters

The important parameters to be aware of when voting using the Democracy module are as follows:

**Launch Period** - How often new public referenda are launched.

**Voting Period** - How often votes for referenda are tallied.

**Emergency Voting Period** - The minimum voting period for a fast-tracked emergency referendum.

**Minimum Deposit** - The minimum amount to be used as a deposit for a public referendum proposal.

**Enactment Period** - The minimum period for locking funds _and_ the period between a proposal
being approved and enacted.

**Cooloff Period** - The period in blocks where a proposal may not be re-submitted after being
vetoed.

## Proposing an Action

Proposing an action to be taken requires you to bond some tokens. In order to ensure you have enough
tokens to make the minimum deposit, you can check the parameter in the chain state. Navigate to
Developer > Chain State > Constants > selected constant query: democracy > minimumDeposit: u128 and
then click on the plus button. The bonded tokens will only be released once the proposal is tabled
(that is, brought to a vote); there is no way for the user to "revoke" their proposal and get the
bond back before it has become a referendum. Since it is essentially impossible to predict
definitely when a proposal may become a referendum (if ever), this means that any tokens bonded will
be locked for an indeterminate amount of time.

:::info Proposals cannot be revoked by the proposer, even if they never turn into a referendum

It is important to realize that there is no guarantee that DOT you use for proposing or endorsing a
proposal will be returned to that account in any given timeframe.

::: On Polkadot Apps, you can navigate to the Governance -> Democracy tab to make a new proposal. In
order to submit a proposal, you will need to submit what's called the preimage hash. The preimage
hash is simply the hash of the proposal to be enacted. The easiest way to get the preimage hash is
by clicking on the "Submit preimage" button and configuring the action that you are proposing.

The example below demonstrates the creation of a proposal on Kusama (**the same procedure applies to
Polkadot**). If you wanted to propose that a remark "Expect Chaos!" is added, the preimage hash
would be `0x8ac3f722caf7677254e25ca4ad77d533ca893c7d2ad4009e258d749f2004ef94`. You can copy this
preimage hash and save it for the next step. There is no need to click Submit Preimage at this
point, though you could. We'll go over that in the next section.

![submit preimage](../assets/democracy/submit_preimage.png)

Now you will click on the "Submit proposal" button and enter the preimage hash in the input titled
"preimage hash" and _at least_ the minimum deposit into the "locked balance" field. Click on the
"Submit proposal" button and confirm the transaction. You should now see your proposal appear in the
"proposals" column on the page.

![submit proposal](../assets/democracy/submit_proposal.png)

Now your proposal is visible to anyone who accesses the chain and others can endorse it or submit a
preimage. However, it's hard to tell what exactly this proposal does since it shows the hash of the
action. Other holders will not be able to make a judgement on whether they endorse it or not until
someone submits the actual preimage for this proposal. In the next step, you will submit the
preimage.

![proposal hash](../assets/democracy/proposal-hash.png)

## Submitting a Preimage

The act of making a proposal is split from submitting the preimage for the proposal since the
storage cost of submitting a large preimage could be pretty expensive. Allowing for the preimage
submission to come as a separate transaction means that another account could submit the preimage
for you if you don't have the funds to do so. It also means that you don't have to pay so many funds
right away as you can prove the preimage hash out-of-band.

However, at some point before the proposal passes you will need to submit the preimage or else the
proposal cannot be enacted. The guide will now show you how to do this.

Click on the blue "Submit preimage" button and configure it to be the same as what you did before to
acquire the preimage hash. This time, instead of copying the hash to another tab, you will follow
through and click "Submit preimage" and confirm the transaction.

![submit preimage](../assets/democracy/submit_preimage.png)

Once the transaction is included you should see the UI update with the information for your already
submitted proposal.

![proposals](../assets/democracy/proposals.png)

## Endorsing a Proposal

Endorsing a proposal means that you are agreeing with the proposal and backing it with an equal
amount of deposit as was originally locked. The bonded tokens will be released once the proposal is
tabled (that is, brought to a vote), just like the original proposer's bond. By endorsing a proposal
you will move it higher up the rank of proposals. The most endorsed proposal &mdash; in value, not
the number of supporters &mdash; will be brought to a referendum every launch period.

It is important to note that there is no way to stop or cancel endorsing a proposal once it has been
done. Therefore, the DOT that was endorsed will be reserved until the proposal is tabled as a
referendum. This is an indeterminate amount of time, since there is no guarantee that a proposal
will become a referendum for a given period, as other proposals may be proposed and tabled before
it.

Note that it is possible for a single account to endorse a proposal multiple times. This is by
design; it is the value, not the number of endorsements _per se_, that counts in terms of weighting.
If there were a limit of one endorsement per account, it would be trivial for a user with, for
example, 1000 DOT to create ten accounts with 100 DOT instead of a single account with 1000 DOT.
Thus, no restrictions are made on the number of times a single account can endorse a proposal.

To endorse a proposal, navigate to the proposal you want to endorse and click on the "Endorse"
button.

![endorsement button](../assets/democracy/endorse1.png)

You will be prompted with the full details of the proposal (if the preimage has been submitted!) and
can then broadcast the transaction by clicking the blue "Endorse" button.

![endorsement confirmed](../assets/democracy/endorse.png)

Once successful, you will see your endorsement appear in the dropdown in the proposal details.

![endorsement result](../assets/democracy/endorsed-list.png)

## Voting on a Proposal

At the end of each launch period, the most endorsed proposal will move to a referendum. During this
time you can cast a vote for or against the proposal. You may also lock up your tokens for a greater
length of time to weigh your vote more strongly. During the time your tokens are locked, you are
unable to transfer them, however they can still be used for further votes. Locks are layered on top
of each other, so an eight-week lock does not become a 15-week lock if you vote again a week later,
rather another eight-week lock is placed to extend the lock just one extra week.

:::info Voting and staking locks can overlap

- A user can use staked funds to vote on referenda (and/or to vote for Councillors).
- A user is only prohibited from transferring these funds to another account.

:::

To vote on a referendum, navigate to the
["Democracy" tab of Polkadot Apps](https://polkadot.js.org/apps/#/democracy/). Any active referendum
will show in the "referenda" column. Click the blue button "Vote" to cast a vote for the referendum.

If you would like to cast your vote for the proposal select the "Aye, I approve" option. If you
would like to cast your vote against the proposal in the referendum you will select "Nay, I do not
approve" option.

The endorsement option is to select your conviction for this vote. The longer you are willing to
lock your tokens, the stronger your vote will be weighted. The timeline for the conviction starts
after the voting period ends; tokens used for voting will always be locked until the end of the
voting period, no matter what conviction you vote with. Unwillingness to lock your tokens means that
your vote only counts for 10% of the tokens that you hold, while the maximum lock-up of 896 days
means you can make your vote count for 600% of the tokens that you hold. It is possible to vote with
tokens already locked by staking.

When you are comfortable with the decision you have made, click the blue "Vote" button to submit
your transaction and wait for it to be included in a block.

![voting](../assets/democracy/voting.png)

## Unlocking Locked Tokens

Like [vesting](../learn/learn-DOT.md#lazy-vesting), the tokens that are locked in democracy are
unlocked lazily. This means that you, the user, must explicitly call an unlock extrinsic to make
your funds available again after the lock expires. Unbonding is another term you hear a lot in
Polkadot, it means withdrawing your DOT that was used in staking. To know more about it, please see
[here](maintain-guides-how-to-nominate-polkadot.md).

You can do this from the "Accounts" page in
[Polkadot-JS Apps](https://polkadot.js.org/apps/#/accounts), unless you use Ledger (see below).
First, check that your account has a "democracy" lock by opening the details on your balance. In the
example below the account has 150 KSM locked in democracy.

![democracy balance details](../assets/democracy_balance_details.png)

Now you can click the menu button (the three dots) and find the option that says "Clear expired
democracy locks". After selecting this option you may confirm the transaction and your locks will be
cleared when successful.

![democracy clear locks](../assets/democracy_clear_locks.png)

#### With a Ledger hardware wallet or Unlocking Very Old Locks

If you do not see an option to clear expired democracy votes, it may be that the lock is very old.
Or, if you are using the Ledger hardware wallet, you will not be able to issue the batch Unlock
action from the UI.

Instead, you must clear the lock by directly issuing the correct extrinsics.

Navigate to the [Extrinsics page](https://polkadot.js.org/apps/#/extrinsics) and submit the
following extrinsic: `democracy.removeVote(index)` using the account that you voted with. For the
index number (ReferendumIndex), enter the number of the referendum for which you voted ("12" in the
image below).

The number of the referendum for which you voted is visible in an explorer such as Polkascan.

You need to press the "Submit Transaction" button to submit the extrinsic.

![democracy clear_lock_extrinsic_1](../assets/democracy_clear_lock_extrinsic_1.png)

Now submit the following extrinsic: `democracy.unlock(target), where the target is your account
address.

![democracy clear_lock_extrinsic_2](../assets/democracy_clear_lock_extrinsic_2.png)

If you return to the [Accounts page](https://polkadot.js.org/apps/#/accounts), you should see that
the democracy lock has been released.

Note that this applies only to locked DOT that were used for voting on referenda. In order to unlock
DOT locked by voting for members of the Polkadot Council, you need to go to the
[Council](https://polkadot.js.org/apps/#/council) page, click "Vote", and then click on "Unvote
All".

## Delegate a Vote

If you are too busy to keep up and vote on upcoming referenda, there is an option to delegate your
vote to another account whose opinion you trust. When you delegate to another account, that account
gets the added voting power of your tokens along with the conviction that you set. The conviction
for delegation works just like the conviction for regular voting, except your tokens may be locked
longer than they would normally since locking resets when you undelegate your vote.

The account that is being delegated to does not make any special action once the delegation is in
place. They can continue to vote on referenda how they see fit. The difference is now when the
Democracy system tallies votes, the delegated tokens now are added to whatever vote the delegatee
has made.

You can delegate your vote to another account and even attach a "Conviction" to the delegation.
Navigate to the ["Accounts" tab on Polkadot-JS UI](https://polkadot.js.org/apps/#/accounts) and
click on the three vertical dots and select "Delegate democracy votes" option for the account of
your choice. Then you would be presented with a pop-up window which lets you enter the account
details of the delegated account, delegated amount and conviction. You can enter the relevant
details and click on the delegate button and then sign and submit the transaction.

![delegate](../assets/democracy/delegate-vote.png)

Your delegation will count toward whatever account you delegated for votes on until you explicitly
undelegate your vote.

:::tip Query the chain state for an account's delegation preferences

It is possible to query the delegation preferences of any actively delegating account on the network
through `democracy.votingOf` extrinsic.

![query delegation](../assets/democracy/query-delegation.png)

:::

## Undelegate a Vote

:::caution

If there is an existing lock due to a previous delegation change or undelegation, any new change or
undelegation will restart the lock period for the larger DOT amount and the longest conviction
period between the existing and the new lock.

This will only matter to accounts with conviction, as the accounts with no conviction don't have any
lock period.

Examples:

1. Delegate 500 DOT with 1x conviction, then change delegation to 1000 DOT with 1x conviction, the
   lock period will reset for 1000 DOT with 1x conviction.

2. Delegate 500 DOT with 3x conviction, then change the delegation to 1000 DOT with 1x conviction,
   the lock period will reset for 1000 DOT with 3x conviction.

3. Delegate 500 DOT with 1x conviction, then change the delegation to 200 DOT with 1x conviction,
   the lock period will reset for 500 DOT with 1x conviction.

To understand this in further detail checkout
[this stackexchange post.](https://substrate.stackexchange.com/questions/5067/delegating-and-undelegating-during-the-lock-period-extends-it-for-the-initial-am)

:::

You may decide at some point in the future to remove your delegation to a target account. In this
case, your tokens will be locked for the maximum amount of time in accordance with the conviction
you set at the beginning of the delegation. For example, if you chose "2x" delegation for four weeks
of lock-up time, your tokens will be locked for 4 weeks after sending the `undelegate` transaction.
Once your vote has been undelegated, you are in control of making votes with it once again. You can
start to vote directly, or choose a different account to act as your delegate.

The `undelegate` transaction must be sent from the account that you wish to clear of its delegation.
For example, if Alice has delegated her tokens to Bob, Alice would need to be the one to call the
`undelegate` transaction to clear her delegation.

The easiest way to do this is from the
["Accounts" tab on Polkadot-JS UI](https://polkadot.js.org/apps/#/accounts) where you can manage the
delegation of your account.

![manage delegation](../assets/democracy/manage-delegation.png)

When you click on "manage delegation", you would be presented with a pre-populated pop-up window
with that account's delegation preferences. Here, you have an option to undelegate or save the
modifications made to the account's delegation preferences.

![undelegate](../assets/democracy/undelegate-save.png)

## Voting with a Governance Proxy

Making a vote on behalf of a stash requires a "proxy" transaction from the Proxy pallet. When you
choose this transaction from the "Extrinsics" tab, it will let you select "vote" from the Democracy
pallet, and you will specify the index of the referendum that is being voted, the judgement (i.e.
"Aye" for approval or "Nay" for rejection), and the conviction, just like a normal vote.

For more material on adding and removing Governance proxies, as well as other types, please see the
[Proxy page](../learn/learn-proxies.md).

## Interpreting On-Chain Voting Data

Consider the following example showcasing how votes would be displayed on a block explorer.

```
Nay 0.1x => 0
Nay 1x => 1
Nay 2x => 2
Nay 3x => 3
Nay 4x => 4
Nay 5x => 5
Nay 6x => 6
Aye 0.1x => 128
Aye 1x => 129
Aye 2x => 130
Aye 3x => 131
Aye 4x => 132
Aye 5x => 133
Aye 6x => 134
```

At first glance, it may be difficult to interpret what you voted on. We need to take a step back and
consider the "voting data" at the binary level.

The vote is stored as a byte using a bitfield data structure and displayed on the block explorer as
a decimal integer. The bitfield stores both the conviction and aye/nay boolean, where the boolean is
represented using the MSB of the byte. This would mean that the grouping of the 7 remaining bits is
used to store the conviction.



---
id: maintain-guides-how-to-chill
title: How to Chill
sidebar_label: How to Chill
description: Steps on chilling as a network participant.
keywords: [chill, chilling, pause]
slug: ../maintain-guides-how-to-chill
---

import RPC from "./../../components/RPC-Connection";

Staking bonds can be in any of the three states: validating, nominating, or chilled (neither
validating nor nominating). When a staker wants to temporarily pause their active engagement in
staking but does not want to unbond their funds, they can choose to "chill" their involvement and
keep their funds bonded.

An account can step back from participating in active staking by clicking "Stop" under the Network >
Staking > Account actions page in [PolkadotJS Apps](https://polkadot.js.org/apps) or by calling the
`chill` extrinsic in the
[staking pallet](https://paritytech.github.io/substrate/master/pallet_staking/pallet/enum.Call.html#variant.chill).
When an account chooses to chill, it becomes inactive in the next era. The call must be signed by
the _staking proxy_ account, not the _stash_.

:::note Primer on stash and staking proxy accounts

If you need a refresher on the different responsibilities of the stash and staking proxy account
when staking, take a look at the [accounts](../learn/learn-staking.md#accounts) section in the
general staking guide.

:::

![staking](../assets/NPoS/staking-keys-stash-proxy.png)

## Consideration for Staking Election

A bond that is actively participating in staking but chilled would continue to participate in
staking for the rest of the current era. If the bond was chilled in sessions 1 through 4 and
continues to be chilled for the rest of the era, it would NOT be selected for election in the next
era. If a bond was chilled for the entire session 5, it would not be considered in the next
election. If the bond was chilled in session 6, its participation in the next era's election would
depend on its state in session 5.

## Chilling as a Nominator

When you chill after being a nominator, your nominations will be reset. This means that when you
decide to start nominating again you will need to select validators to nominate once again. These
can be the same validators if you prefer, or, a completely new set. Just be aware - your nominations
will not persist across chills.

Your nominator will remain bonded when it is chilled. When you are ready to nominate again, you will
not need to go through the whole process of bonding again, rather, you will issue a new nominate
call that specifies the new validators to nominate.

## Chilling as a Validator

When you voluntarily chill after being a validator, your nominators will remain. As long as your
nominators make no action, you will still have the nominations when you choose to become an active
validator once again. You bond however would not be listed as a nominable validator thus any
nominators issuing new or revisions to existing nominations would not be able to select your bond.

When you become an active validator, you will also need to reset your validator preferences
(commission, etc.). These can be configured as the same values set previously or something
different.

## Involuntary Chills

If a validator was unresponsive for an entire session, the validator bond would be chilled in a
process known as _involuntary chilling._ When a validator has been involuntarily chilled, it may
restrict the validator from being selected in the next election depending on the session in which it
was chilled (see considerations above). A chilled validator may re-declare the intent to validate at
any time. However, it is recommended that the validator attempts to determine the source of the
chill before doing so.

Slashing may also result in an involuntary chill. However, in that scenario, the validator would
also lose their nominations. By this action, even if the validator re-declares its intent to
validate before session 5, there wouldn't be sufficient nominations to re-elect the node into the
active set.

Nominators have the option to renominate a slashed validator using a display row in Polkadot-JS UI.
This row is displayed in the "Account Actions" tab for the nominator under a heading that says
"Renomination required".

## Chill Other

An unbounded and unlimited number of nominators and validators in Polkadot's NPoS is not possible
due to constraints in the runtime. As a result, multiple checks are incorporated to keep the size of
staking system manageable, like mandating minimum active bond requirements for both nominators and
validators. When these requirements are modified through on-chain governance, they can be enforced
only on the accounts that newly call `nominate` or `validate` after the update. The changes to the
bonding parameters would not automatically chill the active accounts on-chain which do not meet the
requirements.

:::note Chill Threshold

`ChillThreshold` defines how close to the max nominators or validators we must reach before users
can start chilling one-another. This value is currently set to
{{ polkadot: <RPC network="polkadot" path="query.staking.chillThreshold" defaultValue={90}/>% :polkadot }}
{{ kusama: <RPC network="kusama" path="query.staking.chillThreshold" defaultValue={90}/>% :kusama }}

:::

For instance, let us consider a scenario where the minimum staking requirement for nominators is
changed from 80 DOTs to 120 DOTs. An account that was actively nominating with 80 DOTs before this
update would still keep receiving staking rewards. To handle this corner case, the `chillOther`
extrinsic was incorporated which also helps to keep things backwards compatible and safe. The
`chillOther` extrinsic is permissionless and any third party user can target it on an account where
the minimum active bond is not satisfied, and chill that account. The list of addresses of all the
active validators and their nominators can be viewed by running
[validator stats](https://github.com/w3f/validator-stats) script.

:::info Chill Other on Polkadot Network

Through [Referendum 90](https://polkadot.polkassembly.io/referendum/90), `maxNominatorCount` on
Polkadot is set to `None` eliminating the upper bound on the number of nominators on the network.
Due to this, the `chillOther` extrinsic on Polkadot network has no effect as the chill threshold
will never be met.

:::


---
id: maintain-guides-how-to-join-council
title: Join the Council
sidebar_label: Join the Council
description: Steps on how to join the official on-chain council.
keywords: [council, how to join council, governance, candidate]
slug: ../maintain-guides-how-to-join-council
---

The council is an elected body of on-chain accounts that are intended to represent the passive
stakeholders of Polkadot and/or Kusama. The council has two major tasks in governance: proposing
referenda and vetoing dangerous or malicious referenda. For more information on the council, see the
[governance page](../learn/learn-governance.md#council). This guide will walk you through entering
your candidacy to the council.

## Submit Candidacy

Submitting your candidacy for the council requires a small bond of DOT / KSM. Unless your candidacy
wins, the bond will be forfeited. You can receive your bond back if you manually renounce your
candidacy before losing. Runners-up are selected after every round and are reserved members in case
one of the winners gets forcefully removed.

:::note

Currently the bond for submitting a council candidacy on Polkadot is 100 DOT, and 0.0033 KSM on
Kusama.

:::

It is a good idea to announce your council intention before submitting your candidacy so that your
supporters will know when they can start to vote for you. You can also vote for yourself in case no
one else does.

Go to [Polkadot Apps Dashboard](https://polkadot.js.org/apps) and navigate to the "Council" tab.
Click the button on the right that says "Submit Candidacy."

![submit candidacy button](../assets/council/polkadotjs_submit_candidancy.png)

After making the transaction, you will see your account appear underneath the row "Candidates."

![candidates list](../assets/council/polkadotjs_candidates.png)

It is a good idea now to lead by example and give yourself a vote.

## Voting on Candidates

Next to the button to submit candidacy is another button titled "Vote." You will click this button
to make a vote for yourself (optional).

![voting button on UI](../assets/council/polkadotjs_vote_button.png)

The council uses [Phragmén](../learn/learn-phragmen.md) approval voting, which is also used in the
validator elections. This means that you can choose up to 16 distinct candidates to vote for and
your stake will equalize between them. For this guide, choose to approve your own candidacy by
clicking on the switch next to your account and changing it to say "Aye."

![voting pop up on UI](../assets/council/polkadotjs_voting.png)

## Winning

If you are one of the lucky ones to win a council election you will see your account move underneath
the row "Members".

![council members list](../assets/council/polkadotjs_council_members.png)

Now you are able to participate on the council by making motions or voting proposals. To join in on
the active discussions, join the
[Polkadot Direction channel](https://matrix.to/#/#Polkadot-Direction:parity.io).



---
id: maintain-guides-how-to-monitor-your-node
title: Monitor your node
sidebar_label: Monitor your node
descriptions: Tips on how to monitor your node.
keywords: [node, monitor, dashboard]
slug: ../maintain-guides-how-to-monitor-your-node
---

This guide will walk you through how to set up [Prometheus](https://prometheus.io/) with
[Grafana](https://grafana.com/) to monitor your node using Ubuntu 18.04 or 20.04.

A Substrate-based chain exposes data such as the height of the chain, the number of connected peers
to your node, CPU, memory usage of your machine, and more. To monitor this data, Prometheus is used
to collect metrics and Grafana allows for displaying them on the dashboard.

## Preparation

First, create a user for Prometheus by adding the `--no-create-home` flag to disallow `prometheus`
from logging in.

```bash
sudo useradd --no-create-home --shell /usr/sbin/nologin prometheus
```

Create the directories required to store the configuration and executable files.

```bash
sudo mkdir /etc/prometheus
sudo mkdir /var/lib/prometheus
```

Change the ownership of these directories to `prometheus` so that only prometheus can access them.

```bash
sudo chown -R prometheus:prometheus /etc/prometheus
sudo chown -R prometheus:prometheus /var/lib/prometheus
```

## Installing and Configuring Prometheus

After setting up the environment, update your OS, and install the latest Prometheus. You can check
the latest release by going to their GitHub repository under the
[releases](https://github.com/prometheus/prometheus/releases/) page.

```bash
sudo apt-get update && apt-get upgrade
wget https://github.com/prometheus/prometheus/releases/download/v2.26.0/prometheus-2.26.0.linux-amd64.tar.gz
tar xfz prometheus-*.tar.gz
cd prometheus-2.26.0.linux-amd64
```

The following two binaries are in the directory:

- prometheus - Prometheus main binary file
- promtool

The following two directories (which contain the web interface, configuration files examples and the
license) are in the directory:

- consoles
- console_libraries

Copy the executable files to the `/usr/local/bin/` directory.

```bash
sudo cp ./prometheus /usr/local/bin/
sudo cp ./promtool /usr/local/bin/
```

Change the ownership of these files to the `prometheus` user.

```bash
sudo chown prometheus:prometheus /usr/local/bin/prometheus
sudo chown prometheus:prometheus /usr/local/bin/promtool
```

Copy the `consoles` and `console_libraries` directories to `/etc/prometheus`

```bash
sudo cp -r ./consoles /etc/prometheus
sudo cp -r ./console_libraries /etc/prometheus
```

Change the ownership of these directories to the `prometheus` user.

```bash
sudo chown -R prometheus:prometheus /etc/prometheus/consoles
sudo chown -R prometheus:prometheus /etc/prometheus/console_libraries
```

Once everything is done, run this command to remove `prometheus` directory.

```bash
cd .. && rm -rf prometheus*
```

Before using Prometheus, it needs some configuration. Create a YAML configuration file named
`prometheus.yml` by running the command below.

```bash
sudo nano /etc/prometheus/prometheus.yml
```

The configuration file is divided into three parts which are `global`, `rule_files`, and
`scrape_configs`.

- `scrape_interval` defines how often Prometheus scrapes targets, while `evaluation_interval`
  controls how often the software will evaluate rules.

- `rule_files` block contains information of the location of any rules we want the Prometheus server
  to load.

- `scrape_configs` contains the information which resources Prometheus monitors.

The configuration file should look like this below:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  # - "first.rules"
  # - "second.rules"

scrape_configs:
  - job_name: "prometheus"
    scrape_interval: 5s
    static_configs:
      - targets: ["localhost:9090"]
  - job_name: "substrate_node"
    scrape_interval: 5s
    static_configs:
      - targets: ["localhost:9615"]
```

With the above configuration file, the first exporter is the one that Prometheus exports to monitor
itself. As we want to have more precise information about the state of the Prometheus server we
reduced the `scrape_interval` to 5 seconds for this job. The parameters `static_configs` and
`targets` determine where the exporters are running. The second exporter is capturing the data from
your node, and the port by default is `9615`.

You can check the validity of this configuration file by running
`promtool check config /etc/prometheus/prometheus.yml`.

Save the configuration file and change the ownership of the file to `prometheus` user.

```bash
sudo chown prometheus:prometheus /etc/prometheus/prometheus.yml
```

## Starting Prometheus

To test that Prometheus is set up properly, execute the following command to start it as the
`prometheus` user.

```bash
sudo -u prometheus /usr/local/bin/prometheus --config.file /etc/prometheus/prometheus.yml --storage.tsdb.path /var/lib/prometheus/ --web.console.templates=/etc/prometheus/consoles --web.console.libraries=/etc/prometheus/console_libraries
```

The following messages indicate the status of the server. If you see the following messages, your
server is set up properly.

```bash
level=info ts=2021-04-16T19:02:20.167Z caller=main.go:380 msg="No time or size retention was set so using the default time retention" duration=15d
level=info ts=2021-04-16T19:02:20.167Z caller=main.go:418 msg="Starting Prometheus" version="(version=2.26.0, branch=HEAD, revision=3cafc58827d1ebd1a67749f88be4218f0bab3d8d)"
level=info ts=2021-04-16T19:02:20.167Z caller=main.go:423 build_context="(go=go1.16.2, user=root@a67cafebe6d0, date=20210331-11:56:23)"
level=info ts=2021-04-16T19:02:20.167Z caller=main.go:424 host_details="(Linux 5.4.0-42-generic #46-Ubuntu SMP Fri Jul 10 00:24:02 UTC 2020 x86_64 ubuntu2004 (none))"
level=info ts=2021-04-16T19:02:20.167Z caller=main.go:425 fd_limits="(soft=1024, hard=1048576)"
level=info ts=2021-04-16T19:02:20.167Z caller=main.go:426 vm_limits="(soft=unlimited, hard=unlimited)"
level=info ts=2021-04-16T19:02:20.169Z caller=web.go:540 component=web msg="Start listening for connections" address=0.0.0.0:9090
level=info ts=2021-04-16T19:02:20.170Z caller=main.go:795 msg="Starting TSDB ..."
level=info ts=2021-04-16T19:02:20.171Z caller=tls_config.go:191 component=web msg="TLS is disabled." http2=false
level=info ts=2021-04-16T19:02:20.174Z caller=head.go:696 component=tsdb msg="Replaying on-disk memory mappable chunks if any"
level=info ts=2021-04-16T19:02:20.175Z caller=head.go:710 component=tsdb msg="On-disk memory mappable chunks replay completed" duration=1.391446ms
level=info ts=2021-04-16T19:02:20.175Z caller=head.go:716 component=tsdb msg="Replaying WAL, this may take a while"
level=info ts=2021-04-16T19:02:20.178Z caller=head.go:768 component=tsdb msg="WAL segment loaded" segment=0 maxSegment=4
level=info ts=2021-04-16T19:02:20.193Z caller=head.go:768 component=tsdb msg="WAL segment loaded" segment=1 maxSegment=4
level=info ts=2021-04-16T19:02:20.221Z caller=head.go:768 component=tsdb msg="WAL segment loaded" segment=2 maxSegment=4
level=info ts=2021-04-16T19:02:20.224Z caller=head.go:768 component=tsdb msg="WAL segment loaded" segment=3 maxSegment=4
level=info ts=2021-04-16T19:02:20.229Z caller=head.go:768 component=tsdb msg="WAL segment loaded" segment=4 maxSegment=4
level=info ts=2021-04-16T19:02:20.229Z caller=head.go:773 component=tsdb msg="WAL replay completed" checkpoint_replay_duration=43.716µs wal_replay_duration=53.973285ms total_replay_duration=55.445308ms
level=info ts=2021-04-16T19:02:20.233Z caller=main.go:815 fs_type=EXT4_SUPER_MAGIC
level=info ts=2021-04-16T19:02:20.233Z caller=main.go:818 msg="TSDB started"
level=info ts=2021-04-16T19:02:20.233Z caller=main.go:944 msg="Loading configuration file" filename=/etc/prometheus/prometheus.yml
level=info ts=2021-04-16T19:02:20.234Z caller=main.go:975 msg="Completed loading of configuration file" filename=/etc/prometheus/prometheus.yml totalDuration=824.115µs remote_storage=3.131µs web_handler=401ns query_engine=1.056µs scrape=236.454µs scrape_sd=45.432µs notify=723ns notify_sd=2.61µs rules=956ns
level=info ts=2021-04-16T19:02:20.234Z caller=main.go:767 msg="Server is ready to receive web requests."

```

Go to `http://SERVER_IP_ADDRESS:9090/graph` to check whether you are able to access the Prometheus
interface or not. If it is working, exit the process by pressing on `CTRL + C`.

Next, we would like to automatically start the server during the boot process, so we have to create
a new `systemd` configuration file with the following config.

```bash
sudo nano /etc/systemd/system/prometheus.service
```

```bash
[Unit]
  Description=Prometheus Monitoring
  Wants=network-online.target
  After=network-online.target

[Service]
  User=prometheus
  Group=prometheus
  Type=simple
  ExecStart=/usr/local/bin/prometheus \
  --config.file /etc/prometheus/prometheus.yml \
  --storage.tsdb.path /var/lib/prometheus/ \
  --web.console.templates=/etc/prometheus/consoles \
  --web.console.libraries=/etc/prometheus/console_libraries
  ExecReload=/bin/kill -HUP $MAINPID

[Install]
  WantedBy=multi-user.target
```

Once the file is saved, execute the command below to reload `systemd` and enable the service so that
it will be loaded automatically during the operating system's startup.

```bash
sudo systemctl daemon-reload && systemctl enable prometheus && systemctl start prometheus
```

Prometheus should be running now, and you should be able to access its front again end by
re-visiting `IP_ADDRESS:9090/`.

## Installing Grafana

In order to visualize your node metrics, you can use Grafana to query the Prometheus server. Run the
following commands to install it first.

```bash
sudo apt-get install -y adduser libfontconfig1
wget https://dl.grafana.com/oss/release/grafana_7.5.4_amd64.deb
sudo dpkg -i grafana_7.5.4_amd64.deb
```

If everything is fine, configure Grafana to auto-start on boot and then start the service.

```bash
sudo systemctl daemon-reload
sudo systemctl enable grafana-server
sudo systemctl start grafana-server
```

You can now access it by going to the `http://SERVER_IP_ADDRESS:3000/login`. The default user and
password is admin/admin.

:::note

If you want to change the port on which Grafana runs (3000 is a popular port), edit the file
`/usr/share/grafana/conf/defaults.ini` with a command like
`sudo vim /usr/share/grafana/conf/defaults.ini` and change the `http_port` value to something else.
Then restart grafana with `sudo systemctl restart grafana-server`.

:::

![1-grafana-login](../assets/guides/how-to-monitor/1-grafana-login.png)

In order to visualize the node metrics, click _settings_ to configure the `Data Sources` first.

![2-add-data-source](../assets/guides/how-to-monitor/2-add-data-source.png)

Click `Add data source` to choose where the data is coming from.

![2-add-data-source-2](../assets/guides/how-to-monitor/2-add-data-source-2.png)

Select `Prometheus`.

![3-select-prometheus](../assets/guides/how-to-monitor/3-select-prometheus.png)

The only thing you need to input is the `URL` that is `https://localhost:9090` and then click
`Save & Test`. If you see `Data source is working`, your connection is configured correctly.

![4-configure-data-source](../assets/guides/how-to-monitor/4-configure-data-source.png)

Next, import the dashboard that lets you visualize your node data. Go to the menu bar on the left
and mouse hover "+" then select `Import`.

`Import via grafana.com` - It allows you to use a dashboard that someone else has created and made
public. You can check what other dashboards are available via
[https://grafana.com/grafana/dashboards](https://grafana.com/grafana/dashboards). In this guide, we
use ["My Polkadot Metrics"](https://grafana.com/grafana/dashboards/12425), so input "12425" under
the id field and click `Load`.

![5-import-dashboard](../assets/guides/how-to-monitor/5-import-dashboard.png)

Once it has been loaded, make sure to select "Prometheus" in the Prometheus dropdown list. Then
click `Import`.

![5-import-dashboard-2](../assets/guides/how-to-monitor/5-import-dashboard-2.png)

In the meantime, start your Polkadot node by running `./polkadot`. If everything is done correctly,
you should be able to monitor your node's performance such as the current block height, CPU, memory
usage, etc. on the Grafana dashboard.

![6-dashboard-metric](../assets/guides/how-to-monitor/6-dashboard-metric.png)

## Installing and Configuring Alertmanager (Optional)

In this section, let's configure the Alertmanager that helps to predict the potential problem or
notify you of the current problem in your server. Alerts can be sent in Slack, Email, Matrix, or
others. In this guide, we will show you how to configure the email notifications using Gmail if your
node goes down.

First, download the latest binary of AlertManager and unzip it by running the command below:

```bash
wget https://github.com/prometheus/alertmanager/releases/download/v0.26.0/alertmanager-0.26.0.linux-amd64.tar.gz
tar -xvzf alertmanager-0.26.0.linux-amd64.tar.gz
mv alertmanager-0.26.0.linux-amd64/alertmanager /usr/local/bin
```

### Gmail Setup

To allow AlertManager to send an email to you, you will need to generate something called an
`app password` in your Gmail account. For details, click
[here](https://support.google.com/accounts/answer/185833?hl=en) to follow the whole setup.

You should see something like below:

![grafana-am-1](../assets/guides/how-to-monitor/1-alert-manager.png)

Copy and save it somewhere else first.

### AlertManager Configuration

There is a configuration file named `alertmanager.yml` inside the directory that you just extracted
in the previous command, but that is not of our use. We will create our `alertmanager.yml` file
under `/etc/alertmanager` with the following config.

:::note

Ensure to change the ownership of "/etc/alertmanager" to `prometheus` by executing

```bash
sudo chown -R prometheus:prometheus /etc/alertmanager
```

:::

```
global:
 resolve_timeout: 1m

route:
 receiver: 'gmail-notifications'

receivers:
- name: 'gmail-notifications'
  email_configs:
  - to: YOUR_EMAIL
    from: YOUR_EMAIL
    smarthost: smtp.gmail.com:587
    auth_username: YOUR_EMAIL
    auth_identity: YOUR_EMAIL
    auth_password: YOUR_APP_PASSWORD
    send_resolved: true
```

With the above configuration, alerts will be sent using the the email you set above. Remember to
change `YOUR_EMAIL` to your email and paste the app password you just saved earlier to the
`YOUR_APP_PASSWORD`.

Next, create another `systemd` configuration file named `alertmanager.service` by running the
command `sudo nano /etc/systemd/system/alertmanager.service` with the following config.

:::info SERVER_IP

Change to your host IP address and make sure port 9093 is opened.

:::

```
[Unit]
Description=AlertManager Server Service
Wants=network-online.target
After=network-online.target

[Service]
User=root
Group=root
Type=simple
ExecStart=/usr/local/bin/alertmanager --config.file /etc/alertmanager/alertmanager.yml --web.external-url=http://SERVER_IP:9093 --cluster.advertise-address='0.0.0.0:9093'


[Install]
WantedBy=multi-user.target
```

To the start the Alertmanager, run the following commands:

```
sudo systemctl daemon-reload && sudo systemctl enable alertmanager && sudo systemctl start alertmanager && sudo systemctl status alertmanager
```

```
● alertmanager.service - AlertManager Server Service
   Loaded: loaded (/etc/systemd/system/alertmanager.service; enabled; vendor preset: enabled)
   Active: active (running) since Thu 2020-08-20 22:01:21 CEST; 3 days ago
 Main PID: 20592 (alertmanager)
    Tasks: 70 (limit: 9830)
   CGroup: /system.slice/alertmanager.service
```

You should see the process status is "active (running)" if you have configured properly.

There is a Alertmanager plugin in Grafana that can help you to monitor the alert information. To
install it, execute the command below:

```
sudo grafana-cli plugins install camptocamp-prometheus-alertmanager-datasource
```

And restart Grafana once the plugin is successfully installed.

```
sudo systemctl restart grafana-server
```

Now go to your Grafana dashboard `SERVER_IP:3000` and configure the Alertmanager datasource.

![grafana-am-5](../assets/guides/how-to-monitor/5-alert-manager.png)

Go to Configuration -> Data Sources, search "Prometheus AlertManger" if you cannot find it at the
top.

![grafana-am-2](../assets/guides/how-to-monitor/2-alert-manager.png)

Fill in the `URL` to your server location followed by the port number used in the Alertmanager.

Then click "Save & Test" at the bottom to test the connection.

![grafana-am-3](../assets/guides/how-to-monitor/3-alert-manager.png)

To monitor the alerts, let's import dashboard "[8010](https://grafana.com/dashboards/8010)" that is
used for Alertmanager. And make sure to select the "Prometheus AlertManager" in the last column.
Then click "Import".

You will end up having the following:

![grafana-am-4](../assets/guides/how-to-monitor/4-alert-manager.png)

### AlertManager Integration

To let the Prometheus server be able to talk to the AlertManager, we will need to add the following
config in the `etc/prometheus/prometheus.yml`.

```
rule_files:
  - 'rules.yml'

alerting:
  alertmanagers:
  - static_configs:
    - targets:
      - localhost:9093
```

That is the updated `etc/prometheus/prometheus.yml`.

```
global:
  scrape_interval:     15s
  evaluation_interval: 15s

rule_files:
  - 'rules.yml'

alerting:
  alertmanagers:
  - static_configs:
    - targets:
      - localhost:9093

scrape_configs:
  - job_name: 'prometheus'
    scrape_interval: 5s
    static_configs:
      - targets: ['localhost:9090']
  - job_name: 'substrate_node'
    scrape_interval: 5s
    static_configs:
      - targets: ['localhost:9615']
```

We will need to create a new file called "rules.yml" under `/etc/prometheus/` that is defined all
the rules we would like to detect. If any of the rules defined in this file is fulfilled, an alert
will be triggered. The rule below checks whether the instance is down. If it is down for more than 5
minutes, an email notification will be sent. If you would like to learn more about the details of
the rule defining, go
[here](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/). There are other
interesting alerts you may find useful [here](https://awesome-prometheus-alerts.grep.to/rules.html).

```
groups:
  - name: alert_rules
    rules:
      - alert: InstanceDown
        expr: up == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Instance [{{ $labels.instance }}] down"
          description: "[{{ $labels.instance }}] of job [{{ $labels.job }}] has been down for more than 1 minute."
```

Change the ownership of this file to `prometheus` instead of `root` by running:

```bash
sudo chown prometheus:prometheus rules.yml
```

To check the rules defined in the "rules.yml" is syntactically correct, run the following command:

```bash
sudo -u prometheus promtool check rules rules.yml
```

Finally, restart everything by running:

```bash
sudo systemctl restart prometheus && sudo systemctl restart alertmanager
```

Now if one of your target instances down, you will receive an alert on the AlertManager and Gmail
like below.

![grafana-am-6](../assets/guides/how-to-monitor/6-alert-manager.png)




---
id: maintain-guides-how-to-nominate-polkadot
title: Become a Nominator on Polkadot
sidebar_label: Nominator Guides
description: Steps on how to nominate on Polkadot.
keywords: [nominate, how to nominate, nominator, stake]
slug: ../maintain-guides-how-to-nominate-polkadot
---

import RPC from "./../../components/RPC-Connection";

:::tip New to Staking?

Start your staking journey or explore more information about staking on
[Polkadot's Home Page](https://polkadot.network/staking/). You can learn how staking works by
reading [this dedicated page](../learn/learn-staking.md).

Discover the new [**Staking Dashboard**](https://staking.polkadot.network/#/overview) that makes
staking much easier and check this
[extensive article list](https://support.polkadot.network/support/solutions/articles/65000182104) to
help you get started.
{{ kusama: All the examples presented on Polkadot also apply to Kusama. :kusama }}

:::

:::info

The following information applies to the Polkadot network. If you want to nominate on Kusama, check
out the [Kusama guide](https://guide.kusama.network/docs/maintain-guides-how-to-nominate-kusama/)
instead.

:::

Nominators are one type of participant in the staking subsystem of Polkadot. They appoint their
stake to the validators, the second type of participant. By appointing their stake, they can elect
the active set of validators and share in the rewards that are paid out.

While the [validators](maintain-guides-how-to-validate-polkadot.md) are active participants in the
network that engage in the block production and finality mechanisms, nominators take a slightly more
passive role. Being a nominator does not require running a node of your own or worrying about online
uptime. However, a good nominator performs due diligence on the validators that they elect. When
looking for validators to nominate, a nominator should pay attention to their own reward percentage
for nominating a specific validator - as well as the risk that they bear of being slashed if the
validator gets slashed.

If you are a beginner, please watch the video below for detailed instructions.

[![Staking Tutorial](https://img.youtube.com/vi/F59N3YKYCRs/0.jpg)](https://www.youtube.com/watch?v=F59N3YKYCRs)

## Setting up Stash and Staking Proxy Accounts

Nominators are recommended to set up separate stash and staking proxy accounts. Explanation and the
reasoning for generating distinct accounts for this purpose is elaborated in the
[keys](../learn/learn-cryptography.md#keys) section of the Wiki.

You can generate your stash and staking proxy account via any of the recommended methods, which are
detailed on the [account generation](../learn/learn-accounts.md#account-generation) page.

Starting with runtime version v23 natively included in the client version
[0.8.23](https://github.com/paritytech/polkadot/releases/tag/v0.8.23), payouts can go to any custom
address. If you'd like to redirect payments to an account that is neither the staking proxy nor the
stash account, set one up. Note that setting an exchange address as the recipient of the staking
rewards is extremely unsafe.

## Using the Polkadot Staking Dashboard

:::info Walk-through Video Tutorials

- [**Nominating**](https://youtu.be/F59N3YKYCRs): Stake your tokens, choose your best validators,
  and start your staking journey on Polkadot.
- [**Becoming a Pool Member**](https://youtu.be/dDIG7QAApig): Start becoming a part of the Polkadot
  movement, keep Polkadot secure by staking minimum 1 DOT and receiving staking rewards.
- [**Dashboard Walkthrough**](https://youtu.be/hvXLc4H7rA4): Become a Pro using the Staking
  Dashboard.
- [**After Staking**](https://youtu.be/58pIe8tt2o4): Nominating on Polkadot is not a set-and-forget
  action, learn what you can do with the dashboard after you started staking.

:::

## Why am I not receiving Staking Rewards?

:::info Bags List & Minimum Active Bond

See [**this video tutorial**](https://youtu.be/hIIZRJLrBZA) and read
[**this support article**](https://support.polkadot.network/support/solutions/articles/65000181018-i-have-more-than-the-minimum-bonded-but-i-m-not-getting-rewards)
to understand why in some cases you might not receive staking rewards and how to avoid those
situations.

:::

## Using Polkadot-JS UI

:::info Using Polkadot-JS UI as a Nominator

Here is the list of basic nominator actions that can be performed using the Polkadot-JS UI.

- [How to Bond Tokens and Nominate](https://support.polkadot.network/support/solutions/articles/65000168057-polkadot-js-ui-how-do-i-stake-nominate-on-polkadot-)
- [How to Select Validators](https://support.polkadot.network/support/solutions/articles/65000150130-how-do-i-know-which-validators-to-choose-)
- [How to Stop Nominating & Unbond Tokens](https://support.polkadot.network/support/solutions/articles/65000167902-how-can-i-unstake-my-tokens-again-)
- [How to Rebond Tokens](https://support.polkadot.network/support/solutions/articles/65000170241-polkadot-js-ui-how-to-rebond-tokens-during-the-unbonding-period)

:::

:::info Video Tutorials

- [How to Nominate/Stake](https://youtu.be/FCXC0CDhyS4?t=219)
- [Staking with a Ledger and PolkadotJS Apps](https://youtu.be/7VlTncHCGPc)
- [Staking with a Ledger and Ledger Live](https://www.youtube.com/watch?v=jL-N_IWiYVA)

:::

## Using Command-Line Interface (CLI)

Apart from using Polkadot-JS Apps to participate in staking, you can do all these things in CLI
instead. The CLI approach allows you to interact with the Polkadot network without going to the
Polkadot-JS Apps dashboard.

### Step 1: Install @polkadot/api-cli

We assume you have installed [NodeJS with npm](https://nodejs.org). Run the following command to
install the `@polkadot/api-cli` globally:

```bash
npm install -g @polkadot/api-cli
```

### Step 2. Bond your DOT

:::info Controller accounts are deprecated

Controller accounts are deprecated. For more information, see
[this discussion](https://forum.polkadot.network/t/staking-controller-deprecation-plan-staking-ui-leads-comms/2748).

:::

Executing the following command:

```bash
polkadot-js-api --seed "MNEMONIC_PHRASE" tx.staking.bond CONTROLLER_ADDRESS NUMBER_OF_TOKENS REWARD_DESTINATION --ws WEBSOCKET_ENDPOINT
```

`CONTROLLER_ADDRESS`: An address you would like to bond to the stash account. (Controller accounts
are now deprecated. Refer to
[this discussion](https://forum.polkadot.network/t/staking-controller-deprecation-plan-staking-ui-leads-comms/2748)
for additional context)

`NUMBER_OF_TOKENS`: The number of DOT you would like to stake to the network.

:::note Decimal places

DOT has ten decimal places and is always represented as an integer with zeros at the end. So 1 DOT =
10_000_000_000 Plancks.

:::

`REWARD_DESTINATION`:

- `Staked` - Pay into the stash account, increasing the amount at stake accordingly.
- `Stash` - Pay into the stash account, not increasing the amount at stake.
- `Account` - Pay into a custom account, like so:
  `Account DMTHrNcmA8QbqRS4rBq8LXn8ipyczFoNMb1X4cY2WD9tdBX`.
- `Controller` - Pay into the controller account.

Example:

```bash
polkadot-js-api --seed "xxxx xxxxx xxxx xxxxx" tx.staking.bond DMTHrNcmA8QbqRS4rBq8LXn8ipyczFoNMb1X4cY2WD9tdBX 1000000000000 Staked --ws wss://rpc.polkadot.io
```

Result:

```bash
...
...
    "status": {
      "InBlock": "0x0ed1ec0ba69564e8f98958d69f826adef895b5617366a32a3aa384290e98514e"
    }
```

You can check the transaction status by using the value of the `InBlock` in
[Polkascan](https://polkascan.io/polkadot-cc1). Also, you can verify the bonding state under the
[Staking](https://polkadot.js.org/apps/#/staking/actions) page on the Polkadot-JS Apps Dashboard.

### Step 3. Nominate a validator

To nominate a validator, you can execute the following command:

```bash
polkadot-js-api --seed "MNEMONIC_PHRASE" tx.staking.nominate '["VALIDATOR_ADDRESS"]' --ws WS_ENDPOINT
```

```bash
polkadot-js-api --seed "xxxx xxxxx xxxx xxxxx" tx.staking.nominate '["CmD9vaMYoiKe7HiFnfkftwvhKbxN9bhyjcDrfFRGbifJEG8","E457XaKbj2yTB2URy8N4UuzmyuFRkcdxYs67UvSgVr7HyFb"]' --ws wss://rpc.polkadot.io
```

After a few seconds, you should see the hash of the transaction, and if you would like to verify the
nomination status, you can check that on the Polkadot-JS UI as well.



---
id: maintain-guides-how-to-stop-validating
title: How to Stop Validating
sidebar_label: How to Stop Validating
description: Steps on how to stop validating.
keywords: [validating, how to stop validating, validate, chill]
slug: ../maintain-guides-how-to-stop-validating
---

If you wish to remain a validator or nominator (e.g. you're only stopping for planned downtime or
server maintenance), submitting the `chill` extrinsic in the `staking` pallet should suffice. It is
only if you wish to unbond funds or reap an account that you should continue with the following.

To ensure a smooth stop to validation, make sure you should do the following actions:

- Chill your validator
- Purge validator session keys
- Unbond your tokens

These can all be done with [PolkadotJS Apps](https://polkadot.js.org/apps) interface or with
extrinsics.

## Chill Validator

To chill your validator or nominator, call the `staking.chill()` extrinsic. See the
[How to Chill](maintain-guides-how-to-chill.md) page for more information. You can also
[claim your rewards](../learn/learn-staking-advanced.md) at this time.

## Purge validator session keys

Purging the validator's session keys removes the key reference. This can be done through the
`session.purgeKeys()` extrinsic. The key reference exists on the account that originally called the
`session.set_keys()` extrinsic, which could be the stash or the staking proxy (at the time the keys
were set).

:::caution Purge keys using the same account that set the keys

Make sure to call the session.purge_keys() extrinsic from the same account that set the keys in the
first place in order for the correct reference to be removed. Calling the `session.purge_keys()`
from the wrong account, although it may succeed, will result in a reference on the other account
that **cannot** be removed, and as a result that account cannot be reaped.

:::

:::caution

**If you skip this step, you will not be able to reap your stash account**, and you will also need
to rebond, purge the session keys, unbond, and wait the unbonding period again before being able to
transfer your tokens.

See [Unbonding and Rebonding](maintain-guides-how-to-nominate-polkadot.md) for more details.

:::

## Unbond your tokens

Unbonding your tokens can be done through the `Network > Staking > Account actions` page in
PolkadotJS Apps by clicking the corresponding stash account dropdown and selecting "Unbond funds".
This can also be done through the `staking.unbond()` extrinsic with the staking proxy account.



---
id: maintain-guides-how-to-systemd
title: Using systemd for a Validator Node
sidebar_label: Using systemd for a Validator Node
description: Using a service manager for your validator node.
keywords: [systemd, validate, node]
slug: ../maintain-guides-how-to-systemd
---

You can run your validator as a [systemd](https://en.wikipedia.org/wiki/Systemd) process so that it
will automatically restart on server reboots or crashes (and helps to avoid getting slashed!).

Before following this guide you should have already set up your validator by following the
[How to validate](../learn/learn-validator.md) article.

First create a new unit file called `polkadot-validator.service` in `/etc/systemd/system/`.

```bash
touch /etc/systemd/system/polkadot-validator.service
```

In this unit file you will write the commands that you want to run on server boot / restart.

```
[Unit]
Description=Polkadot Validator

[Service]
ExecStart=PATH_TO_POLKADOT_BIN --validator --name SHOW_ON_TELEMETRY
Restart=always
RestartSec=120

[Install]
WantedBy=multi-user.target
```

:::warning

It is recommended to delay the restart of a node with `RestartSec` in the case of node crashes. It's
possible that when a node crashes, consensus votes in GRANDPA aren't persisted to disk. In this
case, there is potential to equivocate when immediately restarting. What can happen is the node will
not recognize votes that didn't make it to disk, and will then cast conflicting votes. Delaying the
restart will allow the network to progress past potentially conflicting votes, at which point other
nodes will not accept them.

:::

To enable this to autostart on bootup run:

```bash
systemctl enable polkadot-validator.service
```

Start it manually with:

```bash
systemctl start polkadot-validator.service
```

You can check that it's working with:

```bash
systemctl status polkadot-validator.service
```

You can tail the logs with `journalctl` like so:

```bash
journalctl -f -u polkadot-validator
```



---
id: maintain-guides-how-to-upgrade
title: How to Upgrade Your Validator
sidebar_label: How to Upgrade Your Validator
descriptions: Steps on how to upgrade your validator node.
keywords: [upgrade, node, validator, release, session]
slug: ../maintain-guides-how-to-upgrade
---

Validators perform critical functions for the network, and as such, have strict uptime requirements.
Validators may have to go offline for short-periods of time to upgrade client software or to upgrade
the host machine. Usually, standard client upgrades will only require you to stop the service,
replace the binary and restart the service. This operation can be executed within a session and if
performed correctly will not produce a slashable event.

Validators may also need to perform long-lead maintenance tasks that will span more than one
session. Under these circumstances, an active validator may chill their stash and be removed from
the active validator set. Alternatively, the validator may substitute the active validator server
with another allowing the former to undergo maintenance activities.

This guide will provide an option for validators to seamlessly substitute an active validator server
to allow for maintenance operations.

The process can take several hours, so make sure you understand the instructions first and plan
accordingly.

:::tip Keep an eye out on new releases from the community

Upgrade or downgrade accordingly.

:::

## Key Components

### Session Keys

Session keys are stored in the client and used to sign validator operations. They are what link your
validator node to your staking proxy. If you change them within a session you will have to wait for
the current session to finish and a further two sessions to elapse before they are applied.

[More info about keys in Polkadot.](../learn/learn-cryptography.md)

### Keystore

Each validator server contains essential private keys in a folder called the _keystore_. These keys
are used by a validator to sign transactions at the network level. If two or more validators sign
certain transactions using the same keys, it can lead to an
[equivocation slash](../learn/learn-staking.md/#slashing).

For this reason, it is advised that validators DO NOT CLONE or COPY the _keystore_ folder and
instead generate session keys for each new validator instance.

Default keystore path - `/home/polkadot/.local/share/polkadot/chains/<chain>/keystore`

## Steps

The following steps require a second validator which will be referred to as `Validator B`; the
original server that is in the active set will be referred to as `Validator A`.

### Session `N`

1. Start a second node. Once it is synced, use the `--validator` flag. This is now "Validator B."
2. Generate Session keys for **Validator B**.
3. Submit a `set_key` extrinsic from your staking proxy with the session key generated from
   **Validator B**.
4. Take note of the Session that this extrinsic was executed in.
5. Allow the current session to elapse and then wait for two full sessions.

**It is imperative that you keep Validator A running during this time.** `set_key` does not have an
immediate effect and requires two full sessions to elapse before it does. If you do switch off
Validator A too early you may risk being chilled and face a fault within the Thousand Validator
Programme.

### Session `N+3`

**Validator B** is now acting as your validator - you can safely perform operations on **Validator
A**.

When you are ready to restore **Validator A**:

1. Start **Validator A**, sync the database and ensure that it is operating with the `--validator`
   flag.
2. Generate new Session keys for **Validator A**.
3. Submit a `set_key` extrinsic from your staking proxy with the session key generated from
   **Validator A**.
4. Take note of the Session that this extrinsic was executed in.

**Again, it is imperative that Validator B is kept running until the current session finishes and
two further full sessions have elapsed.**

Once this time has elapsed, **Validator A** will take over. You can safely stop Validator B.

**NOTE:** To verify that the Session has changed, make sure that a block in the new Session is
finalized. You should see log messages like the ones below to confirm the change:

```
2019-10-28 21:44:13 Applying authority set change scheduled at block #450092
2019-10-28 21:44:13 Applying GRANDPA set change to new set with 20 authorities
```



---
id: maintain-guides-how-to-validate-polkadot
title: Run a Validator (Polkadot)
sidebar_label: How to run a Validator on Polkadot
description: The fundamentals for running a Polkadot validator.
keywords: [validator setup, validator, validate, binary, runtime]
slug: ../maintain-guides-how-to-validate-polkadot
---

import RPC from "./../../components/RPC-Connection";

import MinimumStake from "./../../components/Minimum-Stake";

:::tip

If you are a beginner, it is recommended that you start your validator journey on Kusama network.
Check the [Kusama guide](kusama/maintain-guides-how-to-validate-kusama.md) for details on how to get
started.

:::

## Preliminaries

Running a validator on a live network is a lot of responsibility! You will be accountable for not
only your own stake, but also the stake of your current nominators. If you make a mistake and get
slashed, your tokens and your reputation will be at risk. However, running a validator can also be
very rewarding, knowing that you contribute to the security of a decentralized network while growing
your stash.

:::warning

It is highly recommended that you have significant system administration experience before
attempting to run your own validator.

You must be able to handle technical issues and anomalies with your node which you must be able to
tackle yourself. Being a validator involves more than just executing the Polkadot binary.

:::

Since security is so important to running a successful validator, you should take a look at the
[secure validator](maintain-guides-secure-validator.md) information to make sure you understand the
factors to consider when constructing your infrastructure. As you progress in your journey as a
validator, you will likely want to use this repository as a _starting point_ for your own
modifications and customizations.

If you need help, please reach out on the
[Polkadot Validator Lounge](https://matrix.to/#/#polkadotvalidatorlounge:web3.foundation) on
Element. The team and other validators are there to help answer questions and provide tips from
experience.

### How many DOT do I need to become an active Validator?

You can have a rough estimate on that by using the methods listed
[here](../general/faq.md/#what-is-the-minimum-stake-necessary-to-be-elected-as-an-active-validator).
To be elected into the set, you need a minimum stake behind your validator. This stake can come from
yourself or from [nominators](../learn/learn-nominator.md). This means that as a minimum, you will
need enough DOT to set up stash and staking proxy [accounts](../learn/learn-cryptography.md) with
the existential deposit, plus a little extra for transaction fees. The rest can come from
nominators. To understand how validators are elected, check the
[NPoS Election algorithms](../learn/learn-phragmen.md) page.

:::info On-Chain Data for Reference

On Polkadot, the minimum stake backing a validator in the active set is
{{ polkadot: <MinimumStake network="polkadot" defaultValue={17314855524834056}/> :polkadot }}
{{ kusama: <MinimumStake network="polkadot" defaultValue={17314855524834056}/> :kusama }} in the era
{{ polkadot: <RPC network="polkadot" path="query.staking.currentEra" defaultValue="998"/>. :polkadot }}
{{ kusama: <RPC network="polkadot" path="query.staking.currentEra" defaultValue="998"/>. :kusama }}

On Kusama, the minimum stake backing a validator in the active set is
{{ kusama: <MinimumStake network="kusama" defaultValue={5288388652143741} /> :kusama }}
{{ polkadot: <MinimumStake network="kusama" defaultValue={5288388652143741} /> :polkadot }} in the
era
{{ kusama: <RPC network="kusama" path="query.staking.currentEra" defaultValue="4838"/>. :kusama }}
{{ polkadot: <RPC network="kusama" path="query.staking.currentEra" defaultValue="4838"/>. :polkadot }}
:::

**Warning:** Any DOT that you stake for your validator is liable to be slashed, meaning that an
insecure or improper setup may result in loss of DOT tokens! If you are not confident in your
ability to run a validator node, it is recommended to nominate your DOT to a trusted validator node
instead.

## Initial Set-up

### Requirements

The most common way for a beginner to run a validator is on a cloud server running Linux. You may
choose whatever [VPS](#note-about-vps) provider that you prefer. As OS it is best to use a recent
Debian Linux. For this guide we will be using **Ubuntu 22.04**, but the instructions should be
similar for other platforms.

#### Reference Hardware {#standard-hardware}

The transaction weights in Polkadot are benchmarked on reference hardware. We ran the benchmark on
VM instances of two major cloud providers: Google Cloud Platform (GCP) and Amazon Web Services
(AWS). To be specific, we used `n2-standard-8` VM instance on GCP and `c6i.4xlarge` on AWS. It is
recommended that the hardware used to run the validators at least matches the specs of the reference
hardware in order to ensure they are able to process all blocks in time. If you use subpar hardware
you will possibly run into performance issues, get less era points, and potentially even get
slashed.

- **CPU**
  - x86-64 compatible;
  - Intel Ice Lake, or newer (Xeon or Core series); AMD Zen3, or newer (EPYC or Ryzen);
  - 4 physical cores @ 3.4GHz;
  - Simultaneous multithreading disabled (Hyper-Threading on Intel, SMT on AMD);
  - Prefer single-threaded performance over higher cores count. A comparison of single-threaded
    performance can be found [here](https://www.cpubenchmark.net/singleThread.html).
- **Storage**
  - An NVMe SSD of 1 TB (As it should be reasonably sized to deal with blockchain growth). An
    estimation of current chain snapshot sizes can be found
    [here](https://stakeworld.io/docs/dbsize). In general, the latency is more important than the
    throughput.
- **Memory**
  - 32 GB DDR4 ECC.
- **System**
  - Linux Kernel 5.16 or newer.
- **Network**
  - The minimum symmetric networking speed is set to 500 Mbit/s (= 62.5 MB/s). This is required to
    support a large number of parachains and allow for proper congestion control in busy network
    situations.

The specs posted above are not a _hard_ requirement to run a validator, but are considered best
practice. Running a validator is a responsible task; using professional hardware is a must in any
way.

### Install & Configure Network Time Protocol (NTP) Client

[NTP](https://en.wikipedia.org/wiki/Network_Time_Protocol) is a networking protocol designed to
synchronize the clocks of computers over a network. NTP allows you to synchronize the clocks of all
the systems within the network. Currently it is required that validators' local clocks stay
reasonably in sync, so you should be running NTP or a similar service. You can check whether you
have the NTP client by running:

_If you are using Ubuntu 18.04 or a newer version, NTP Client should be installed by default._

```sh
timedatectl
```

If NTP is installed and running, you should see `System clock synchronized: yes` (or a similar
message). If you do not see it, you can install it by executing:

```sh
sudo apt-get install ntp
```

ntpd will be started automatically after install. You can query ntpd for status information to
verify that everything is working:

```sh
sudo ntpq -p
```

:::warning

Skipping this can result in the validator node missing block authorship opportunities. If the clock
is out of sync (even by a small amount), the blocks the validator produces may not get accepted by
the network. This will result in `ImOnline` heartbeats making it on chain, but zero allocated blocks
making it on chain.

:::

### Make Sure Landlock is Enabled

[Landlock](https://docs.kernel.org/userspace-api/landlock.html) is a Linux security feature used in
Polkadot:

> Landlock empowers any process, including unprivileged ones, to securely restrict themselves.

To make use of landlock, make sure you are on the reference kernel version or newer. Most Linux
distributions should already have landlock enabled, but you can check by running the following as
root:

```sh
dmesg | grep landlock || journalctl -kg landlock
```

If it is not enabled, please see the
[official docs ("Kernel support")](https://docs.kernel.org/userspace-api/landlock.html#kernel-support)
if you would like to build Linux with landlock enabled.

### Installing the Polkadot binaries

:::info Multiple Validator Binaries

In addition to the `polkadot` binary, recent changes have separated out functionality into two
additional needed binaries, `polkadot-prepare-worker`, and `polkadot-execute-worker`. All three
binaries are needed to properly run a validator node. More context on these changes can be found
[here](https://github.com/paritytech/polkadot/pull/7337)

:::

#### Installation from official releases

The official binaries can be downloaded from the
[Github Releases](https://github.com/paritytech/polkadot-sdk/releases). You should download the
latest available version. You can also download the binaries by using the following direct links
(replace X.Y.Z by the appropriate version):

```sh
https://github.com/paritytech/polkadot-sdk/releases/download/polkadot-vX.Y.Z/polkadot
https://github.com/paritytech/polkadot-sdk/releases/download/polkadot-vX.Y.Z/polkadot-execute-worker
https://github.com/paritytech/polkadot-sdk/releases/download/polkadot-vX.Y.Z/polkadot-prepare-worker
```

#### Optional: Installation with Package Managers

The Polkadot Binary in included in `Debian` derivatives (i.e. **Debian**, **Ubuntu**) and
`RPM-based` distros (i.e. **Fedora**, **CentOS**).

#### Debian-based (Debian, Ubuntu)

Run the following commands as the root user:

```ssh
# Import the security@parity.io GPG key
gpg --recv-keys --keyserver hkps://keys.mailvelope.com 9D4B2B6EB8F97156D19669A9FF0812D491B96798
gpg --export 9D4B2B6EB8F97156D19669A9FF0812D491B96798 > /usr/share/keyrings/parity.gpg
# Add the Parity repository and update the package index
echo 'deb [signed-by=/usr/share/keyrings/parity.gpg] https://releases.parity.io/deb release main' > /etc/apt/sources.list.d/parity.list
apt update
# Install the `parity-keyring` package - This will ensure the GPG key
# used by APT remains up-to-date
apt install parity-keyring
# Install polkadot
apt install polkadot
```

#### RPM-based (Fedora, CentOS)

Run the following commands as the root user:

```bash
# Install dnf-plugins-core (This might already be installed)
dnf install dnf-plugins-core
# Add the repository and enable it
dnf config-manager --add-repo https://releases.parity.io/rpm/polkadot.repo
dnf config-manager --set-enabled polkadot
# Install polkadot (You may have to confirm the import of the GPG key, which
# should have the following fingerprint: 9D4B2B6EB8F97156D19669A9FF0812D491B96798)
dnf install polkadot
```

Make sure you verify the installation (see the "Verify the installation" section).

:::note By default, the Polkadot systemd service is disabled

To start the service, run:

```bash
sudo systemctl start polkadot.service
```

:::

#### Optional: Installation with Ansible

To manage Polkadot installation with Ansible, you can use the **Substrate node role** distributed on
the [Parity chain operations Ansible collection](https://github.com/paritytech/ansible-galaxy/)

#### Optional: Installation with Docker

To run Polkadot on a Docker or an OCI compatible container runtime, you can use the official
[parity/polkadot docker image](https://hub.docker.com/r/parity/polkadot/tags), available on Docker
Hub (replace X.Y.Z by the appropriate version):

```sh
docker.io/parity/polkadot:vX.Y.Z
```

### Optional: Building the Polkadot binaries from sources

#### Prerequisites: Install Rust and Dependencies

If you have never installed Rust, you should do this first.

If you have already installed Rust, run the following command to make sure you are using the latest
version.

```sh
rustup update
```

If not, this command will fetch the latest version of Rust and install it.

```sh
curl https://sh.rustup.rs -sSf | sh -s -- -y
```

:::note

If you do not have "curl" installed, run:

```bash
sudo apt install curl
```

It will also be valuable to have "websocat" (Netcat, curl and socat for WebSockets) installed for
RPC interactions. Installation instructions for various operating systems can be found
[here](https://github.com/vi/websocat#installation).

:::

To configure your shell, run the following command.

```sh
source $HOME/.cargo/env
```

Verify your installation.

```sh
rustc --version
```

Finally, run this command to install the necessary dependencies for compiling and running the
Polkadot node software.

```sh
sudo apt install make clang pkg-config libssl-dev build-essential
```

:::note

If you are using OSX and you have [Homebrew](https://brew.sh) installed, you can issue the following
equivalent command INSTEAD of the previous one:

```sh
brew install cmake pkg-config openssl git llvm
```

:::

#### Building the binaries

You can build the Polkadot binaries from the
[paritytech/polkadot-sdk](https://github.com/paritytech/polkadot-sdk) repository on GitHub.

You should generally use the latest **X.Y.Z** tag. You should either review the output from the "git
tag" command or view the [Polkadot SDK Github tags](https://github.com/paritytech/polkadot-sdk/tags)
to see a list of all the available release versions. You should replace `VERSION` below with the
latest build (i.e., the highest number).

:::note

If you prefer to use SSH rather than HTTPS, you can replace the first line of the below with

```sh
git clone git@github.com:paritytech/polkadot-sdk.git
```

:::

```sh
git clone https://github.com/paritytech/polkadot-sdk.git
cd polkadot-sdk/polkadot
```

Run the following command to find the latest version.

```sh
git tag -l | sort -V | grep -v -- '-rc'
```

Find the latest version; replace "VERSION" in the commmand below and run to change your branch.

```sh
git checkout VERSION
./scripts/init.sh
```

Build native code with the production profile. The following will make sure that the binaries are
all in your `$PATH`.

```sh
cargo install --force --path . --profile production
```

**_This step will take a while (generally 10 - 40 minutes, depending on your hardware)._**

:::note Compilation Errors

If you run into compile errors, you may have to pin the version of Rust compiler to the one that was
used to build the release. Check out `Rust compiler versions` section in the release notes. This can
be done by running:

```sh
rustup install nightly-2022-05-18
rustup target add wasm32-unknown-unknown --toolchain nightly-2022-05-18
cargo +nightly-2022-05-18 build --release
```

You may also need to run the build more than once.

If you would like to execute the tests, run the following command:

```sh
cargo test --all
```

:::

If you are interested in generating keys locally, you can also install `subkey` from the same
directory. You may then take the generated `subkey` executable and transfer it to an air-gapped
machine for extra security.

```sh
cargo install --force --git https://github.com/paritytech/polkadot-sdk subkey
```

### Verify the installation

After installing Polkadot, you can verify the installation by running

```bash
polkadot --version
polkadot-execute-worker --version
polkadot-prepare-worker --version
```

It should return something like this (the exact versions don't matter, but they must all be the
same):

```bash
0.9.43-36264cb36db
0.9.43-36264cb36db
0.9.43-36264cb36db
```

If not, make sure that you installed all the binaries, all the binaries are somewhere in your
`$PATH` and they are all in the same folder.

### Synchronize Chain Data

You can begin syncing your node by running the following command if you do not want to start in
validator mode right away:

```sh
polkadot
```

:::info

If you want to run a validator on Kusama, you have an option to specify the chain. With no
specification, this would default to Polkadot.

```sh
polkadot --chain=kusama
```

:::

```
2021-06-17 03:07:07 Parity Polkadot
2021-06-17 03:07:07 ✌️  version 0.9.5-95f6aa201-x86_64-linux-gnu
2021-06-17 03:07:07 ❤️  by Parity Technologies <admin@parity.io>, 2017-2021
2021-06-17 03:07:07 📋 Chain specification: Polkadot
2021-06-17 03:07:07 🏷 Node name: boiling-pet-7554
2021-06-17 03:07:07 👤 Role: FULL
2021-06-17 03:07:07 💾 Database: RocksDb at /root/.local/share/polkadot/chains/polkadot/db
2021-06-17 03:07:07 ⛓  Native runtime: polkadot-9050 (parity-polkadot-0.tx7.au0)
2021-06-17 03:07:10 🏷 Local node identity is: 12D3KooWLtXFWf1oGrnxMGmPKPW54xWCHAXHbFh4Eap6KXmxoi9u
2021-06-17 03:07:10 📦 Highest known block at #17914
2021-06-17 03:07:10 〽️ Prometheus server started at 127.0.0.1:9615
2021-06-17 03:07:10 Listening for new connections on 127.0.0.1:9944.
```

:::info Example of node sync

```
2021-06-17 03:07:39 🔍 Discovered new external address for our node: /ip4/10.26.16.1/tcp/30333/ws/p2p/12D3KooWLtXFWf1oGrnxMGmPKPW54xWCHAXHbFh4Eap6KXmxoi9u
2021-06-17 03:07:40 ⚙️  Syncing 218.8 bps, target=#5553764 (17 peers), best: #24034 (0x08af…dcf5), finalized #23552 (0xd4f0…2642), ⬇ 173.5kiB/s ⬆ 12.7kiB/s
2021-06-17 03:07:45 ⚙️  Syncing 214.8 bps, target=#5553765 (20 peers), best: #25108 (0xb272…e800), finalized #25088 (0x94e6…8a9f), ⬇ 134.3kiB/s ⬆ 7.4kiB/s
2021-06-17 03:07:50 ⚙️  Syncing 214.8 bps, target=#5553766 (21 peers), best: #26182 (0xe7a5…01a2), finalized #26112 (0xcc29…b1a9), ⬇ 5.0kiB/s ⬆ 1.1kiB/s
2021-06-17 03:07:55 ⚙️  Syncing 138.4 bps, target=#5553767 (21 peers), best: #26874 (0xcf4b…6553), finalized #26624 (0x9dd9…27f8), ⬇ 18.9kiB/s ⬆ 2.0kiB/s
2021-06-17 03:08:00 ⚙️  Syncing 37.0 bps, target=#5553768 (22 peers), best: #27059 (0x5b73…6fc9), finalized #26624 (0x9dd9…27f8), ⬇ 14.3kiB/s ⬆ 4.4kiB/s
```

:::

:::tip Use Warp sync for faster syncing

By default, the node performs `full` sync, which downloads and validates the full blockchain
history. Full sync works by listening to announced blocks and requesting the blocks from the
announcing peers, or just the block headers in case of light clients.

`Fast` sync is another option that works by downloading the block header history and validating the
authority set changes in order to arrive at a specific (usually the most recent) header. After the
desired header has been reached and verified, the state can be downloaded and imported. Once this
process has been completed, the node can proceed with a full sync.

```sh
polkadot --sync warp
```

`Warp sync` initially downloads and validates the finality proofs from
[GRANDPA](../learn/learn-consensus.md#finality-gadget-grandpa) and then downloads the state of the
latest finalized block. After the warp sync, the node is ready to import the latest blocks from the
network and can be used as a Validator. The blocks from genesis will be downloaded in the
background. Check
[this discussion](https://substrate.stackexchange.com/questions/334/what-kinds-of-sync-mechanisms-does-substrate-implement/)
for more information about the different sync options available.

:::

:::note Validators should sync using the RocksDb backend

This is implicit by default, but can be explicit by passing the `--database RocksDb` flag.

In the future, it is recommended to switch to the faster and more efficient ParityDB option. Note
that **ParityDB is still experimental and should not be used in production.** If you want to test
out ParityDB, you can add the flag `--database paritydb`. Switching between database backends will
require a resync.

:::

Depending on the size of the chain when you do this, this step may take anywhere from a few minutes
to a few hours.

If you are interested in determining how much longer you have to go, your server logs (printed to
STDOUT from the `polkadot` process) will tell you the latest block your node has processed and
verified. You can then compare that to the current highest block via
[Telemetry](https://telemetry.polkadot.io/#list/Polkadot%20CC1) or the
[PolkadotJS Block Explorer](https://polkadot.js.org/apps/#/explorer).

#### Database Snapshot Services

If you start a node for the first time, it will start building from the genesis block. This process
can take a while depending on the database size. To make this process faster, snapshots can be used.
Snapshots are compressed backups of the database directory of Polkadot/Kusama nodes, containing the
whole chain (or a pruned version of it, with states only from the latest 1000 or 256 blocks). Listed
below are a few public snapshot providers for Polkadot and Kusama.

- [Stakeworld](https://stakeworld.io/snapshot)
- [Polkachu](https://polkachu.com/snapshots)
- [Polkashots](https://polkashots.io/)

:::caution

For the security of the network, it is recommended that you sync from scratch, even if you are
running your node in pruning mode for validation. The reason is that if these snapshots get
corrupted and a majority of nodes run based on these snapshots, the network could end up running on
a non-canonical chain.

:::

## Bond DOT

To start a validator instance on Polkadot, the minimum bond required is
{{ polkadot: <RPC network="polkadot" path="query.staking.minValidatorBond" defaultValue="0" filter= "humanReadable"/>. :polkadot }}
{{ kusama: <RPC network="polkadot" path="query.staking.minValidatorBond" defaultValue="0" filter= "humanReadable"/>. :kusama }}
But to enter the active validator set and be eligible to earn rewards, your validator node should be
nominated by a minimum number of DOT tokens. On Polkadot, the minimum stake backing a validator in
the active set is
{{ polkadot: <MinimumStake network="polkadot" defaultValue={17314855524834056}/> :polkadot }}
{{ kusama: <MinimumStake network="polkadot" defaultValue={17314855524834056}/> :kusama }} in the era
{{ polkadot: <RPC network="polkadot" path="query.staking.currentEra" defaultValue="998"/>. :polkadot }}
{{ kusama: <RPC network="polkadot" path="query.staking.currentEra" defaultValue="998"/>. :kusama }}
On Kusama, the minimum stake backing a validator in the active set is
{{ kusama: <MinimumStake network="kusama" defaultValue={5288388652143741} /> :kusama }}
{{ polkadot: <MinimumStake network="kusama" defaultValue={5288388652143741} /> :polkadot }} in the
era
{{ kusama: <RPC network="kusama" path="query.staking.currentEra" defaultValue="4838"/>. :kusama }}
{{ polkadot: <RPC network="kusama" path="query.staking.currentEra" defaultValue="4838"/>. :polkadot }}

If you are validator who intends to get DOT/KSM nominations from the community, you will need to
show some skin in the game. For that, you need to bond some DOT/KSM as own stake. Make sure not to
bond all your DOT balance since you will be unable to pay transaction fees from your bonded balance.

:::info Controller accounts are deprecated. Use Staking Proxy.

Controller accounts are deprecated. For more information, see
[this discussion](https://forum.polkadot.network/t/staking-controller-deprecation-plan-staking-ui-leads-comms/2748).
It is highly recommended that you setup an account with a staking proxy, which can be used for
issuing start and stop validating calls. Read more about [proxy accounts](../learn/learn-proxies)
here.

:::

First, go to the [Staking](https://polkadot.js.org/apps/#/staking/actions) section. Click on
"Account Actions", and then the "+ Stash" button.

![bonding-JS-UI](../assets/JS-UI-bond.png)

- **Stash account** - Select your Stash account (which is the acocunt with the DOT/KSM balance)
- **Value bonded** - How much DOT from the Stash account you want to bond/stake. Note that you do
  not need to bond all of the DOT in that account. Also note that you can always bond _more_ DOT
  later. However, _withdrawing_ any bonded amount requires the duration of the unbonding period. On
  Kusama, the unbonding period is 7 days. On Polkadot, the planned unbonding period is 28 days.
- **Payment destination** - The account where the rewards from validating are sent. More info
  [here](../learn/learn-staking.md/#reward-distribution). Starting with runtime version v23 natively
  included in client version [0.9.3](https://github.com/paritytech/polkadot/releases/tag/v0.9.3),
  payouts can go to any custom address. If you'd like to redirect payments to an account that is not
  the stash account, you can do it by entering the address here. Note that it is extremely unsafe to
  set an exchange address as the recipient of the staking rewards.

Once everything is filled in properly, click `Bond` and sign the transaction with your Stash
account.

![sign transaction](../assets/JS-UI-sign-transaction.png)

After a few seconds, you should see an `ExtrinsicSuccess` message.

Your bonded account will available under `Stashes`. You should now see a new card with all your
accounts (note: you may need to refresh the screen). The bonded amount on the right corresponds to
the funds bonded by the Stash account.

## Set Session Keys

:::caution Session keys are consensus critical

If you are not sure if your node has the current session keys that you made the `setKeys`
transaction then you can use one of the two available RPC methods to query your node:
[hasKey](https://polkadot.js.org/docs/substrate/rpc/#haskeypublickey-bytes-keytype-text-bool) to
check for a specific key or
[hasSessionKeys](https://polkadot.js.org/docs/substrate/rpc/#hassessionkeyssessionkeys-bytes-bool)
to check the full session key public key string.

:::

Once your node is fully synced, stop the process by pressing Ctrl-C. At your terminal prompt, you
will now start running the node.

```sh
polkadot --validator --name "name on telemetry"
```

Similarly:

```
2021-06-17 03:12:08 Parity Polkadot
2021-06-17 03:12:08 ✌️  version 0.9.5-95f6aa201-x86_64-linux-gnu
2021-06-17 03:12:08 ❤️  by Parity Technologies <admin@parity.io>, 2017-2021
2021-06-17 03:12:08 📋 Chain specification: Polkadot
2021-06-17 03:12:08 🏷 Node name: nateched-test
2021-06-17 03:12:08 👤 Role: AUTHORITY
2021-06-17 03:12:08 💾 Database: RocksDb at /root/.local/share/polkadot/chains/polkadot/db
2021-06-17 03:12:08 ⛓  Native runtime: polkadot-9050 (parity-polkadot-0.tx7.au0)
2021-06-17 03:12:12 🏷 Local node identity is: 12D3KooWLtXFWf1oGrnxMGmPKPW54xWCHAXHbFh4Eap6KXmxoi9u
2021-06-17 03:12:12 📦 Highest known block at #64673
2021-06-17 03:12:12 〽️ Prometheus server started at 127.0.0.1:9615
2021-06-17 03:12:12 Listening for new connections on 127.0.0.1:9944.
2021-06-17 03:12:12 👶 Starting BABE Authorship worker
```

```
2021-06-17 03:12:16 🔍 Discovered new external address for our node: /ip4/10.26.11.1/tcp/30333/p2p/12D3KooWLtXFWf1oGrnxMGmPKPW54xWCHAXHbFh4Eap6KXmxoi9u
2021-06-17 03:12:17 ⚙️  Syncing, target=#5553810 (14 peers), best: #65068 (0x6da5…0662), finalized #65024 (0x4e84…d170), ⬇ 352.2kiB/s ⬆ 75.6kiB/s
```

You can give your validator any name that you like, but note that others will be able to see it, and
it will be included in the list of all servers using the same telemetry server. Since numerous
people are using telemetry, it is recommended that you choose something likely to be unique.

### Generating the Session Keys

You need to tell the chain your Session keys by signing and submitting an extrinsic. This is what
associates your validator node with your stash account on Polkadot.

#### Option 1: PolkadotJS-APPS

You can generate your [Session keys](../learn/learn-cryptography.md) in the client via the apps RPC.
If you are doing this, make sure that you have the PolkadotJS-Apps explorer attached to your
validator node. You can configure the apps dashboard to connect to the endpoint of your validator in
the Settings tab. If you are connected to a default endpoint hosted by Parity of Web3 Foundation,
you will not be able to use this method since making RPC requests to this node would effect the
local keystore hosted on a _public node_ and you want to make sure you are interacting with the
keystore for _your node_.

Once ensuring that you have connected to your node, the easiest way to set session keys for your
node is by calling the `author_rotateKeys` RPC request to create new keys in your validator's
keystore. Navigate to Toolbox tab and select RPC Calls then select the author > rotateKeys() option
and remember to save the output that you get back for a later step.

![Explorer RPC call](../assets/guides/how-to-validate/polkadot-explorer-rotatekeys-rpc.jpg)

#### Option 2: CLI

If you are on a remote server, it is easier to run this command on the same machine (while the node
is running with the default WS RPC port configured):

```sh
echo '{"id":1,"jsonrpc":"2.0","method":"author_rotateKeys","params":[]}' | websocat -n1 -B 99999999 ws://127.0.0.1:9944
```

The output will have a hex-encoded "result" field. The result is the concatenation of the four
public keys. Save this result for a later step.

You can restart your node at this point.

### Submitting the `setKeys` Transaction

You need to tell the chain your Session keys by signing and submitting an extrinsic. This is what
associates your validator with your staking proxy.

Go to [Staking > Account Actions](https://polkadot.js.org/apps/#/staking/actions), and click "Set
Session Key" on the bonding account you generated earlier. Enter the output from `author_rotateKeys`
in the field and click "Set Session Key".

![staking-change-session](../assets/guides/how-to-validate/set-session-key-1.png)
![staking-session-result](../assets/guides/how-to-validate/set-session-key-2.png)

Submit this extrinsic and you are now ready to start validating.

## Validate

To verify that your node is live and synchronized, head to
[Telemetry](https://telemetry.polkadot.io/#list/Polkadot%20CC1) and find your node. Note that this
will show all nodes on the Polkadot network, which is why it is important to select a unique name!

In this example, we used the name `techedtest` and have successfully located it upon searching:

![polkadot-dashboard-telemetry](../assets/guides/how-to-validate/polkadot-dashboard-telemetry.png)

### Setup via Validator Tab

![polkadot-dashboard-validate-1](../assets/guides/how-to-validate/polkadot-dashboard-validate-1.png)

Here you will need to input the Keys from `rotateKeys`, which is the Hex output from
`author_rotateKeys`. The keys will show as pending until applied at the start of a new session.

The "reward commission percentage" is the commission percentage that you can declare against your
validator's rewards. This is the rate that your validator will be commissioned with.

- **Payment preferences** - You can specify the percentage of the rewards that will get paid to you.
  The remaining will be split among your nominators.

:::caution Setting a commission rate of 100% suggests that you do not want your validator to receive
nominations

:::

You can also determine if you would like to receive nominations with the "allows new nominations"
option.

![dashboard validate](../assets/guides/how-to-validate/polkadot-dashboard-validate-2.png)

Click "Bond & Validate".

If you go to the "Staking" tab, you will see a list of active validators currently running on the
network. At the top of the page, it shows the number of validator slots that are available as well
as the number of nodes that have signaled their intention to be a validator. You can go to the
"Waiting" tab to double check to see whether your node is listed there.

![staking queue](../assets/guides/how-to-validate/polkadot-dashboard-staking.png)

The validator set is refreshed every era. In the next era, if there is a slot available and your
node is selected to join the validator set, your node will become an active validator. Until then,
it will remain in the _waiting_ queue. If your validator is not selected to become part of the
validator set, it will remain in the _waiting_ queue until it is. There is no need to re-start if
you are not selected for the validator set in a particular era. However, it may be necessary to
increase the number of DOT staked or seek out nominators for your validator in order to join the
validator set.

**Congratulations!** If you have followed all of these steps, and been selected to be a part of the
validator set, you are now running a Polkadot validator! If you need help, reach out on the
[Polkadot Validator chat](https://matrix.to/#/!NZrbtteFeqYKCUGQtr:matrix.parity.io?via=matrix.parity.io&via=matrix.org&via=web3.foundation).

## Thousand Validators Programme

The Thousand Validators Programme is a joint initiative by Web3 Foundation and Parity Technologies
to provide support for community validators. If you are interested in applying for the programme,
you can find more information [on the wiki page](../general/thousand-validators.md).

## Running a validator on a testnet

To verify your validator setup, it is possible to run it against a PoS test network such as Westend.
However, validator slots are intentionally limited on Westend to ensure stability and availability
of the testnet for the Polkadot release process.

Here is a small comparison of each network characteristics as relevant to validators:

| Network           | Polkadot | Westend    |
| ----------------- | -------- | ---------- |
| epoch             | 4h       | 1h         |
| era               | 1d       | 6h         |
| token             | DOT      | WND (test) |
| active validators | ~300     | ~20        |

## FAQ

### Why am I unable to synchronize the chain with 0 peers?

![zero-peer](../assets/guides/how-to-validate/polkadot-zero-peer.jpg)

Make sure to enable `30333` libp2p port. Eventually, it will take a little bit of time to discover
other peers over the network.

### How do I clear all my chain data?

```sh
polkadot purge-chain
```

:::info

Check out the [Substrate StackExchange](https://substrate.stackexchange.com/) to quickly get the
answers you need.

:::

## Note about VPS

VPS providers are very popular for running servers of any kind. Extensive benchmarking was conducted
to ensure that VPS servers are able to keep up with the work load in general.

:::note

Before you run a live Validator, please verify if the advertised performance is actually delivered
consistently by the VPS provider.

::: The following server types showed acceptable performance during the benchmark tests. Please note
that this is not an endorsement in any way:

- GCP's _c2_ and _c2d_ machine families
- AWS's _c6id_ machine family

The following additional configurations were applied to the instances to tune their performance:

### Disable [SMT](https://en.wikipedia.org/wiki/Simultaneous_multithreading)

As critical path of Substrate is single-threaded we need to optimize for single-core CPU
performance. The node still profits from multiple cores when doing networking and other non-runtime
operations. It is therefore still necessary to run it on at least the minimum required number of
cores. Disabling SMT improves the performance as each vCPU becomes mapped to a physical CPU core
rather than being presented to the OS as two logical cores. SMT implementation is called
_Hyper-Threading_ on Intel and _2-way SMT_ on AMD Zen. To disable SMT in runtime:

```bash
for cpunum in $(cat /sys/devices/system/cpu/cpu*/topology/thread_siblings_list | cut -s -d, -f2- | tr ',' '\n' | sort -un)
do
  echo 0 > /sys/devices/system/cpu/cpu$cpunum/online
done
```

It will disable every other (vCPU) core.

To save changes permanently add `nosmt=force` as kernel parameter. Edit `/etc/default/grub` and add
`nosmt=force` to `GRUB_CMDLINE_LINUX_DEFAULT` variable and run `sudo update-grub`. After the reboot
you should see half of the cores are offline. Run `lscpu --extended` to confirm.

### Disable automatic NUMA balancing

If you have multiple physical CPUs (CPU0 and CPU1) in the system each with its own memory bank (MB0
and MB1), then it is usually slower for a CPU0 to access MB1 due to the slower interconnection. To
prevent the OS from automatically moving the running Substrate process from one CPU to another and
thus causing an increased latency, it is recommended to disable automatic NUMA balancing.

With automatic NUMA balancing disabled, an OS will always run a process on the same NUMA node where
it was initially scheduled.

To disable NUMA balancing in runtime:

```bash
sysctl kernel.numa_balancing=0
```

To save changes permanently, update startup options and reconfigure GRUB. Edit `/etc/default/grub`
and add `numa_balancing=disable` to `GRUB_CMDLINE_LINUX_DEFAULT` variable and run
`sudo update-grub`. After reboot you can confirm the change by running
`sysctl -a | grep 'kernel.numa_balancing'` and checking if the parameter is set to 0

### Configure Spectre/Meltdown Mitigations

Spectre and Meltdown are vulnerabilities discovered in modern CPUs a few years ago. Mitigations were
made to the Linux kernel to cope with the multiple variations of these attacks. Check out
https://meltdownattack.com/ for more info.

Initially those mitigations added ~20% penalty to the performance of the workloads. As CPU
manufacturers started to roll-out mitigations implemented in hardware, the performance gap
[narrowed down](https://www.phoronix.com/scan.php?page=article&item=3-years-specmelt&num=1). As the
benchmark demonstrates, the performance penalty got reduced to ~7% on Intel 10th Gen CPUs. This is
true for the workloads running on both bare-metal and VMs. But the penalty remains high for the
containerized workloads in some cases.

As demonstrated in
[Yusuke Endoh's article](http://mamememo.blogspot.com/2020/05/cpu-intensive-rubypython-code-runs.html),
a performance penalty for containerized workloads can be as high as 100%. This is due to SECCOMP
profile being overprotective about applying Spectre/Meltdown mitigations without providing real
security. A longer explanation is a available in the
[kernel patch discussion](https://lkml.org/lkml/2020/11/4/1135).

Linux 5.16
[loosened the protections](https://www.phoronix.com/scan.php?page=news_item&px=Linux-Spectre-SECCOMP-Default)
applied to SECCOMP threads by default. Containers running on kernel 5.16 and later now don't suffer
from the performance penalty implied by using a SECCOMP profile in container runtimes.

#### For Linux >= 5.16

You are all set. The performance of containerized workloads is on par with non-containerized ones.
You don't have to do anything.

#### For Linux < 5.16

You'll need to disable mitigations for Spectre V2 for user-space tasks as well as Speculative Store
Bypass Disable (SSBD) for Spectre V4.
[This patch message](https://git.kernel.org/pub/scm/linux/kernel/git/kees/linux.git/commit/?h=for-next/seccomp&id=2f46993d83ff4abb310ef7b4beced56ba96f0d9d)
describes the reasoning for this default change in more detail:

> Ultimately setting SSBD and STIBP by default for all seccomp jails is a bad sweet spot and bad
> default with more cons than pros that end up reducing security in the public cloud (by giving an
> huge incentive to not expose SPEC_CTRL which would be needed to get full security with IBPB after
> setting nosmt in the guest) and by excessively hurting performance to more secure apps using
> seccomp that end up having to opt out with SECCOMP_FILTER_FLAG_SPEC_ALLOW.

To disable the mitigations edit `/etc/default/grub` and add
`spec_store_bypass_disable=prctl spectre_v2_user=prctl` to `GRUB_CMDLINE_LINUX_DEFAULT` variable,
run `sudo update-grub`, then reboot.

Note that mitigations are not disabled completely. You can fully disable all the available kernel
mitigations by setting `mitigations=off`. But we don't recommend doing this unless you run a fully
trusted code on the host.

### VPS List

- [Google Cloud](https://cloud.google.com/)
- [Amazon AWS](https://aws.amazon.com/)
- [OVH](https://www.ovh.com.au/)
- [Digital Ocean](https://www.digitalocean.com/)
- [Vultr](https://www.vultr.com/)
- [Linode](https://www.linode.com/)
- [Scaleway](https://www.scaleway.com/)
- [OnFinality](https://onfinality.io/)

:::caution Beware of the **Terms and Conditions** and **Acceptable Use Policies** for each VPS
provider

You may be locked out of your account and your server shut down if you come in violation. For
instance, Digital Ocean lists "Mining of Cryptocurrencies" under the Network Abuse section of their
[Acceptable Use Policy](https://www.digitalocean.com/legal/acceptable-use-policy/) and requires
explicit permission to do so. This may extend to other cryptocurrency activity.

:::



---
id: maintain-guides-how-to-vote-councillor
title: Voting for Councillors
sidebar_label: Voting for Councillors
description: Steps on how to vote for councillors.
keywords: [council, vote, councillors]
slug: ../maintain-guides-how-to-vote-councillor
---

import RPC from "./../../components/RPC-Connection";

The council is an elected body of on-chain accounts that are intended to represent the passive
stakeholders of Polkadot and/or Kusama. The council has two major tasks in governance: proposing
referenda and vetoing dangerous or malicious referenda. For more information on the council, see the
[governance page](../learn/learn-governance.md#council). This guide will walk you through voting for
councillors in the elections.

## Voting for Councillors

Voting for councillors requires you to reserve
{{ polkadot: <RPC network="polkadot" path="consts.phragmenElection.votingBondBase" defaultValue={200640000000} filter = "humanReadable"/> :polkadot }}{{ kusama: <RPC network="kusama" path="consts.phragmenElection.votingBondBase" defaultValue={66879997200} filter = "humanReadable"/> :kusama }}
as a base amount and an amount of
{{ polkadot: <RPC network="polkadot" path="consts.phragmenElection.votingBondFactor" defaultValue={320000000} filter = "humanReadable"/> :polkadot }}{{ kusama: <RPC network="kusama" path="consts.phragmenElection.votingBondFactor" defaultValue={106665600} filter = "humanReadable"/> :kusama }}
per vote. You can then bond whatever amount you wish to put behind your vote. See the
[democracy guide](maintain-guides-democracy.md) for more information.

:::info Voting and staking locks can overlap

- A user can use staked funds to vote for Councillors (and/or use those funds in referenda).
- A user is only prohibited from transferring these funds to another account.

:::

:::warning

If your balance is vesting, you cannot use unvested tokens for this lock. You will have to wait
until you have at least that many **free** tokens to vote.

:::

Like the validator elections, you can approve up to 16 different councillors and your vote will be
equalized among the chosen group. Unlike validator elections, there is no unbonding period for your
reserved tokens. Once you remove your vote, your tokens will be liquid again.

:::warning

It is your responsibility not to put your entire balance into the reserved value when you make a
vote for councillors. It's best to keep _at least_ enough DOT/KSM to pay for transaction fees.

:::

Go to the [Polkadot-JS Apps Dashboard](https://polkadot.js.org/apps) and click on the "Council" tab.
On the right side of the window there are two blue buttons, click on the one that says "Vote."

Since the council uses approval voting, when you vote you signal which of the candidates you approve
of and your voted tokens will be equalized among the selected candidates. Select up to 16 council
candidates by moving the slider to "Aye" for each one that you want to be elected. When you've made
the proper configuration submit your transaction.

You should see your vote appear in the interface immediately after your transaction is included.

## Removing your Vote

In order to get your reserved tokens back, you will need to remove your vote. Only remove your vote
when you're done participating in elections and you no longer want your reserved tokens to count for
the councillors that you approve.

Go to the "Governance" > "Council" tab on the
[Polkadot-JS Apps Dashboard](https://polkadot.js.org/apps).

Under the "Council overview" tab, click on "Vote".

![polkadotjs_removeVoter](../assets/council/polkadotjs_removeVoter.png)

Issue the "Unvote all" option.

When the transaction is included in a block you should have your reserved tokens made liquid again
and your vote will no longer be counting for any councillors in the elections starting in the next
term.


---
id: maintain-guides-secure-validator
title: Secure Validator
sidebar_label: Secure Validator
description: Tips for running a secure validator.
keywords: [secure validator, validator, configuration]
slug: ../maintain-guides-secure-validator
---

Validators in a Proof of Stake network are responsible for keeping the network in consensus and
verifying state transitions. As the number of validators is limited, validators in the set have the
responsibility to be online and faithfully execute their tasks.

This primarily means that validators:

- Must be high availability.
- Must have infrastructure that protects the validator's signing keys so that an attacker cannot
  take control and commit slashable behavior.

## High Availability

High availability set-ups that involve redundant validator nodes may seem attractive at first.
However, they can be **very dangerous** if they are not set up perfectly. The reason for this is
that the session keys used by a validator should always be isolated to just a single node.
Replicating session keys across multiple nodes could lead to equivocation slashes or parachain
validity slashes which can make you lose **100% of your staked funds**.

The good news is that 100% uptime of your validator is not really needed, as it has some buffer
within eras in order to go offline for a little while and upgrade. For this reason, we advise that
you only attempt a high availability set-up if **you're confident you know exactly what you're
doing.**

Many expert validators have made mistakes in the past due to the handling of session keys.

Remember, even if your validator goes offline for some time, the offline slash is much more
forgiving than the equivocation or parachain validity slashing.

## Key Management

See the [Polkadot Keys guide](../learn/learn-cryptography.md) for more information on keys. The keys
that are of primary concern for validator infrastructure are the Session keys. These keys sign
messages related to consensus and parachains. Although Session keys are _not_ account keys and
therefore cannot transfer funds, an attacker could use them to commit slashable behavior.

Session keys are generated inside the node via RPC call. See the
[How to Validate guide](maintain-guides-how-to-validate-polkadot.md#set-session-keys) for
instructions on setting Session keys. These should be generated and kept within your client. When
you generate new Session keys, you must submit an extrinsic (a Session certificate) from your
staking proxy key telling the chain your new Session keys.

:::info Generating session keys

Session keys can also be generated outside the client and inserted into the client's keystore via
RPC. For most users, we recommend using the key generation functionality within the client.

:::

### Signing Outside the Client

In the future, Polkadot will support signing payloads outside the client so that keys can be stored
on another device, e.g. a hardware security module (HSM) or secure enclave. For the time being,
however, Session key signatures are performed within the client.

:::info HSMs are not a panacea

They do not incorporate any logic and will just sign and return whatever payload they receive.
Therefore, an attacker who gains access to your validator node could still commit slashable
behavior.

:::

### Secure-Validator Mode

Parity Polkadot has a Secure-Validator Mode, enabling several protections for keeping keys secure.
The protections include highly strict filesystem, networking, and process sandboxing on top of the
existing wasmtime sandbox.

This mode is **activated by default** if the machine meets the following requirements. If not, there
is an error message with instructions on disabling Secure-Validator Mode, though this is not
recommended due to the security risks involved.

#### Requirements

1. **Linux on x86-64 family** (usually Intel or AMD).
2. **seccomp enabled**. You can check that this is the case by running the following command:

```
cat /boot/config-`uname -r` | grep CONFIG_SECCOMP=
```

The expected output, if enabled, is:

```
CONFIG_SECCOMP=y
```

3. OPTIONAL: **Linux 5.13**. Provides access to even more strict filesystem protections.

## Monitoring Tools

- [Telemetry](https://github.com/paritytech/substrate-telemetry) This tracks your node details
  including the version you are running, block height, CPU & memory usage, block propagation time,
  etc.

- [Prometheus](https://prometheus.io/)-based monitoring stack, including
  [Grafana](https://grafana.com) for dashboards and log aggregation. It includes alerting, querying,
  visualization, and monitoring features and works for both cloud and on-premise systems. The data
  from `substrate-telemetry` can be made available to Prometheus through exporters like
  [this](https://github.com/w3f/substrate-telemetry-exporter).

## Linux Best Practices

- Never use the root user.
- Always update the security patches for your OS.
- Enable and set up a firewall.
- Never allow password-based SSH, only use key-based access.
- Disable non-essential SSH subsystems (banner, motd, scp, X11 forwarding) and harden your SSH
  configuration
  ([reasonable guide to begin with](https://stribika.github.io/2015/01/04/secure-secure-shell.html)).
- Back up your storage regularly.

## Conclusions

- At the moment, Polkadot/Substrate can't interact with HSM/SGX, so we need to provide the signing
  key seeds to the validator machine. This key is kept in memory for signing operations and
  persisted to disk (encrypted with a password).

- Given that HA setups would always be at risk of double-signing and there's currently no built-in
  mechanism to prevent it, we propose having a single instance of the validator to avoid slashing.
  Slashing penalties for being offline are much less than those for equivocation.

### Validators

- Validators should only run the Polkadot binary, and they should not listen on any port other than
  the configured p2p port.

- Validators should run on bare-metal machines, as opposed to VMs. This will prevent some of the
  availability issues with cloud providers, along with potential attacks from other VMs on the same
  hardware. The provisioning of the validator machine should be automated and defined in code. This
  code should be kept in private version control, reviewed, audited, and tested.

- Session keys should be generated and provided in a secure way.

- Polkadot should be started at boot and restarted if stopped for any reason (supervisor process).

- Polkadot should run as a non-root user.

### Monitoring

- There should be an on-call rotation for managing the alerts.

- There should be a clear protocol with actions to perform for each level of each alert and an
  escalation policy.

## Resources

- [Figment Network's Full Disclosure of Cosmos Validator Infrastructure](https://medium.com/figment-networks/full-disclosure-figments-cosmos-validator-infrastructure-3bc707283967)
- [Certus One's Knowledge Base](https://kb.certus.one/)
- [EOS Block Producer Security List](https://github.com/slowmist/eos-bp-nodes-security-checklist)
- [HSM Policies and the Important of Validator Security](https://medium.com/loom-network/hsm-policies-and-the-importance-of-validator-security-ec8a4cc1b6f)




---
id: doc-maintain-guides-validator-community
title: Validator Community Overview
sidebar_label: Validator Community Overview
description: An extensive guide to help you start and build a validator community.
keywords: [validator, community, reputation, nominations]
slug: ../maintain-guides-validator-community
---

## Building a Community and Attracting Nominations

After [setting up a validator](maintain-guides-how-to-validate-Polkadot), nominations will only come
in with extra work. The community of nominators will need to know about the validator to trust
staking with them, and thus the validator must distinguish themselves to attract nominations. The
following gives some general guidance on different approaches to building a community and attracting
nominations.

Being a high-quality validator entails effectively running nodes and building a brand, reputation,
and community around validation services. The responsibilities of a quality validator additionally
include marketing oneself and participating in the greater community. Becoming a known participant
throughout the ecosystem is a great way to attract nominations and solidify longevity and
sustainability as a validator.

One thing to remember is that there is a risk involved in staking for both validators and
nominators, as both can lose up to 100% of their funds if a validator gets slashed. This means it is
paramount for nominators only to nominate validators that they trust, as well as for validators to
do their best to instill confidence in their ability to provide validation services. Validators
should do their best to build a reputation through many different means, as this is one of the most
important factors in how nominators should pick whom they stake with.

## Gaining Visibility

Nominators should be able to know whom they are staking with. If nominators stake with a bunch of
pseudo-anonymous addresses because it seems profitable, they expose themselves to more risks than
nominating validators that follow best practices to whom they _know_ the addresses belong.
Establishing a clear identity in multiple places can help gain visibility across the ecosystem. This
includes setting an on-chain identity and making a known presence throughout various community
channels.

### Setting Identity

All validators should set an on-chain [identity](../learn/learn-identity.md#setting-an-identity) and
get a judgement on the identity so that nominators can find nodes when browsing through various
dashboards and UIs. When someone interacts with the chain, it ensures that an address they may come
across belongs to the validator, and actions of that identity throughout various parts of the
ecosystem (staking, governance, block explorers, etc.) form a cohesive representation of their
participation.

:::note When running multiple validator nodes, the best way to scale an identity is to use multiple
sub-identities from a single verified identity

:::

It's recommended to fill out as many fields in the identity as possible so Nominators have ample
means of reaching out. Nominators may wish to know more about the Validator, the particular setup,
future staking plans, tooling used, or several additional topics. Having a dedicated website
additionally to provide this sort of information is ideal.

:::note Ledger app on **Nano S** doesn't support the extrinsic for setting identity yet

### Website

One strategy for helping gain additional visibility is to set up a dedicated site for your
validator, which includes the networks that one is a validator for and validator details such as
addresses, commission, and so forth. Including all suggestions from this page is potential content
to include on the site. After setting up a website, a validator should add this website to the
corresponding field in their identity so nominators can find it easily.

## Transparency & Establishing Trust

Considering the risks involved for both Validators and Nominators, establishing trust is one of the
most essential factors in running quality validator services.

### Self Stake

Validators should have skin in the game in their operations in the form of a stake that is
self-bonded to their validator stash. Slashing applies to the total stake of a Validator, therefore
having a high self-stake shows confidence in the operations. This helps show commitment from the
Validator as they have skin in the game and can be penalized for negative actions or poor
maintenance. mess up. Having very little self-stake can signal to nominators that they have nothing
to lose in the case of failures.

Additionally, it can help nominators to get a sense of how validators manage their stakes. Defining
a self-allocation strategy is also helpful in seeing how efficiently a validator's stake can be
utilized.

### Commission & Rewards

#### Commission

What does your validator charge as commission, and how did you reach this number? It can be helpful
to be transparent about the long-term plans around the business models of running a validator,
including the costs for infrastructure and person-hours involved in maintaining operations. As many
validators will charge low commissions that often do not cover costs, outlining what commission is
charged and why can help justify higher commission rates.

Besides the current commission, it would be helpful to describe the _range_ of commission charged,
as nominators can know what to expect if the rate goes up or down. Nominators may want to nominate a
validator with a very narrow commission percent range, as this signals stability in a validator's
operations and business plans.

Many validators will charge 0% or near 0% commission to bootstrap themselves at first, with plans to
raise that over time. It can be helpful to elaborate on these plans in the future. For example
"_after x amount of months in the active set with 0% commission, we plan to increase it to 1%_."

#### Rewards

Another factor to consider is that claiming rewards for both the validator and the nominator is not
automatic. Rewards must be claimed manually or set up in an automated way. Validators are suggested
to claim rewards on behalf of their nominators and be transparent about how often claiming will
happen. A nominator may be more likely to stake with a validator that claims rewards daily instead
of one that doesn't claim rewards at all.

The following are some tools for automating reward claiming:

- [staking-payouts](https://github.com/canontech/staking-payouts)
- [substrate-payctl](https://github.com/stakelink/substrate-payctl)

### Validator Experience

### Architecture

One aspect of building trust is being transparent about your validator infrastructure. If nominators
know that you are running a tight ship that is focused on security, they are more likely to trust
you compared to those that do not disclose their infrastructure.

Some factors of architecture to highlight might include:

#### Servers

Outlining how a validator runs its servers helps nominators understand how diversified a validator
is. Does the Validator run in the cloud, on dedicated machines, in a co-located datacenter, or in a
home residential setup? Do they run multiple nodes on the same machine? If every validator is hosted
in AWS, there is a risk of potential outages that cause large amounts of nodes to go offline,
causing slashing for unresponsiveness. Nominators may want to choose validators that have thoroughly
diversified the providers they use or the facilities they operate in.

Additionally, how does a Validator contribute to decentralization? It can be helpful to outline
these efforts so that the values of a Nominator and Validator are aligned.

It's also helpful to outline what kind of OS is used on these servers and what is the updating
policy for the software on that OS. For example, are LTS versions used? Do they use NiXOS,
distro-packaged libraries? Any server hardening practices, etc.

#### Specs

Are you running the recommended Standard Hardware for
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}? Can you ensure that machines have
enough processing power, memory, file storage, and network connectivity? It's helpful for nominators
to know the specs of the machines a validator uses to assess how they may perform in the network. If
a validator is running underpowered machines, they may not want to nominate them, as these can
result in fewer blocks produced and fewer overall rewards. In certain circumstances, more powerful
machines can result in higher rewards for both the Validator and their Nominators.

#### Automation and orchestration approaches (Terraform, Ansible, Chef, Puppet, Kubernetes, etc.)

What kind of approach is taken for spinning up and provisioning nodes? How might you automate
spinning up large clusters of nodes and upgrading them? Elaborating on what type of automation (or
lack thereof) can help get a sense of how robust a validator setup is. Many everyday actions or
routine maintenance needs to be done, and automating this type of thing often helps mitigate human
errors.

#### Network Topology

Does the Validator node have protection against Denial of Service attacks, and if so, how is that
done? Outlining a desired network topology for a Validators infrastructure design will help
Nominators understand how resilient their operations are to attacks. Some things to highlight are
the usage of firewalls, VPNs, network segmentation, proxies, or other layers separation.

#### Upgrading

Both Polkadot and Kusama releases are published.
[here](https://github.com/paritytech/polkadot/releases). Validators are expected to upgrade their
nodes as soon as a new release comes. Although not every release is mandatory to upgrade, each new
release usually has bug fixes, optimizations, new features, or other beneficial changes. It's in the
best interest of the entire network that validators update their nodes in a timely fashion. This
signals to nominators that a validator is timely care about their operations and is quick to adapt
to necessary circumstances.

It can also be helpful for Nominators to know how the Validator runs software and where they get new
binaries. How do they get alerted for new releases? Do they receive updates from the matrix
chatrooms? Do they have alerts for particular GitHub activities? Do they use the Debian/RPM
packages? Do they use the Parity-provided GitHub binaries? Do they use Parity Docker images? Do they
make their own Docker images? Do they build the binaries themselves? Validators often have their own
build server for making binaries. If they take the extra steps to make these and do not rely on
external parties, this can be seen as a plus from nominators, as it helps contribute to
decentralization.

#### Logging, metrics, monitoring, and observability

Good node operators keep tabs on how their systems are running. Observability is one of the most
critical aspects of understanding the performance and behavior of a node. One should be able to
outline the efforts taken in building out monitoring and observability practices. Are Prometheus and
Grafana set up? What types of metrics are collected and looked at? How is this done across multiple
nodes? A quality validator may make these metrics and graphs public so that Nominators can see how
these nodes are running.

##### Health checks and alerting conditions

Similar to the last point, it can be helpful for nominators to know what kind of health checks and
alerting conditions are in place for validator nodes. What conditions are not typical and may need
to be looked at? If conditions are not specific, how is the node operator alerted to this? Are there
any public Telegram, SMS, or email alerts? Nominators will want to know that a Validator can respond
to abnormal conditions promptly, as their tokens are on the line of potentially being lost.

##### Scenario runbooks

Many scenarios happen routinely, such as upgrading nodes, restoring backups, or moving servers.
Creating runbooks and sharing the procedures and precautions taken around these can instill
confidence in nominators that various scenarios are thought out and planned for.

##### Which regions nodes are in

A diverse network of nodes in varying different regions helps strengthen decentralized networks.
Outlining what regions nodes are in gives clarity to this facet of networks. Nominators may want to
promote validators that actively try to decentralize networks operating in regions in which others
do not run nodes.

##### Security / Key handling policies

It is paramount that session keys and stash/staking proxy keys are stored and handled with the
utmost care. If compromised, both the validator and nominator can be slashed. Outlining how keys are
handled, how they are stored, who has access to them, and the overall policies and procedures around
them is a great point of reference for nominators to gauge how comfortable they are with the
security a validator takes.

### Robust Communication

The relationship between Validators and Nominators is one built on trust, and as such, having direct
lines of communication with Nominators is a great way to build and reinforce that trust. This could
mean setting up dedicated Telegram / Matrix / Discord channels or hosting a reoccurring call where
anyone can join. Creating inclusive environments with direct connections between parties is going
the extra mile to ensure that nominators know they're in good hands. Many updates can be given, such
as nodes being updated to a new version, rewards being paid out, servers being migrated, new
features or tools being built, or just checking in to say hello. These kinds of gestures can be much
appreciated in putting words and a person behind the name of someone running a server.

### Actively Participating in the Community

Participating in the community goes hand in hand with building a reputation. This is not only for
Nominators, but for other Validators, builders, developers, governance participants, and general
enthusiasts. Being helpful or contributing to discussions can go a long way in building a trusted
brand and reputation.

There are many communities to participate in, from validator, developer, and governance communities,
to local communities dedicated to specific regions. For example, one can be pretty active in the
South American communities and building camaraderie among those who speak the same language or can
attend the same meetups in an area. One absolute best way to build trust is meeting people in
person.

#### Participating in Governance

Another way to show that one cares about the network is by actively participating in governance.
Whether by voting on-chain, or by discussing off-chain, or proposing new things, active
participation in the direction of the chain is an excellent signal that a validator is there for the
network’s good. There are many ways to participate in different governance aspects, such as voting
for council members, weighing in on treasury proposals, voting on public referenda, proposing tips,
and more. See the section on [governance](maintain-guides-democracy) for additional details.

#### Producing Educational Content

With a fast-moving ecosystem, there often are gaps in educational content where there are new
features, changes, deprecations, or just a slow-moving process for putting out information about
very complex concepts. Putting out educational content in the form of blog posts, videos, tutorials,
development guides, and more (especially if it's geared toward nominators) provides tangible value
to the ecosystem. It shows that one has a good grasp of how things work, and disseminating this
knowledge to others can give some credence to one's brand and reputation as a competent entity in
the space. Furthermore, one might get tips from the treasury if the community finds something
beneficial.

#### Building Tooling

Building public tooling is a great way to support the ecosystem. This provides tangible value to
those that use this tooling and gives visibility to the validator for their contributions. A
nominator might be more likely to nominate a validator for the utilities they provide the ecosystem
since the validator then can build a reputation around the quality of their work outside their
validation services. Some potential building categories are block explorers, deployment scripts,
monitoring, observability services, staking dashboards, wallets, command-line utilities, or porting
implementations to other languages. Additionally, this may also be eligible to be funded via a
[Web3 Foundation Grant](https://github.com/w3f/Grants-Program).



---
id: maintain-guides-validator-payout
title: Validator Payout Overview
sidebar_label: Validator Payout Overview
description: How validator payout works on the network and what you should expect.
keywords: [validator payout, payments, rewards, era points]
slug: ../maintain-guides-validator-payout
---

import RPC from "./../../components/RPC-Connection";

## Era Points

For every era (a period of time approximately 6 hours in length in Kusama, and 24 hours in
Polkadot), validators are paid proportionally to the amount of _era points_ they have collected. Era
points are reward points earned for payable actions like:

- issuing validity statements for [parachain](../learn/learn-parachains.md) blocks.
- producing a non-uncle block in the Relay Chain.
- producing a reference to a previously unreferenced uncle block.
- producing a referenced uncle block.

:::note

An uncle block is a Relay Chain block that is valid in every regard, but which failed to become
canonical. This can happen when two or more validators are block producers in a single slot, and the
block produced by one validator reaches the next block producer before the others. We call the
lagging blocks uncle blocks.

:::

Payments occur at the end of every era.

Era points create a probabilistic component for staking rewards.

If the _mean_ of staking rewards is the average rewards per era, then the _variance_ is the
variability from the average staking rewards. The exact DOT value of each era point is not known in
advance since it depends on the total number of points earned by all validators in a given era. This
is designed this way so that the total payout per era depends on Polkadot's
[inflation model](../learn/learn-staking-advanced.md#inflation), and not on the number of payable
actions (f.e., authoring a new block) executed. For more information, check
[this stackexchange post](https://substrate.stackexchange.com/questions/5353/how-are-rewards-in-dot-calculated-from-the-era-points-earned-by-validators-in-po).

With parachains now on Polkadot, a large percentage of era points will come from parachain
validation, as a subset of validators are selected to para-validate for all parachains each epoch,
and those para-validators can generate more era points as a result. Para-validators are rewarded 20
era points each for each parachain block that they validate.

In this case, analyzing the _expected value_ of staking rewards will paint a better picture as the
weight of era points of validators and para-validators in the reward average are taken into
consideration.

:::note High-level breakdown of reward variance

This should only serve as a high-level overview of the probabilistic nature for staking rewards.

Let:

- `pe` = para-validator era points,
- `ne` = non-para-validator era points,
- `EV` = expected value of staking rewards,

Then, `EV(pe)` has more influence on the `EV` than `EV(ne)`.

Since `EV(pe)` has a more weighted probability on the `EV`, the increase in variance against the
`EV` becomes apparent between the different validator pools (aka. validators in the active set and
the ones chosen to para-validate).

Also, let:

- `v` = the variance of staking rewards,
- `p` = number of para-validators,
- `w` = number validators in the active set,
- `e` = era,

Then, `v` &#8593; if `w` &#8593;, as this reduces `p` : `w`, with respect to `e`.

Increased `v` is expected, and initially keeping `p` &#8595; using the same para-validator set for
all parachains ensures
[availability](../learn/learn-parachains-protocol.md#availability-and-unavailability-phase) and
[approval voting](../learn/learn-governance.md). In addition, despite `v` &#8593; on an `e` to `e`
basis, over time, the amount of rewards each validator receives will equal out based on the
continuous selection of para-validators.

There are plans to scale the active para-validation set in the future

:::

## Payout Scheme

No matter how much total stake is behind a validator, all validators split the block authoring
payout essentially equally. The payout of a specific validator, however, may differ based on
[era points](#era-points), as described above. Although there is a probabilistic component to
receiving era points, and they may be impacted slightly depending on factors such as network
connectivity, well-behaving validators should generally average out to having similar era point
totals over a large number of eras.

Validators may also receive "tips" from senders as an incentive to include transactions in their
produced blocks. Validators will receive 100% of these tips directly.

Validators will receive staking rewards in the form of the native token of that chain (KSM for
Kusama and DOT for Polkadot).

For simplicity, the examples below will assume all validators have the same amount of era points,
and received no tips.

```
Validator Set Size (v): 4
Validator 1 Stake (v1): 18 tokens
Validator 2 Stake (v2):  9 tokens
Validator 3 Stake (v3):  8 tokens
Validator 4 Stake (v4):  7 tokens
Payout (p): 8 DOT

Payout for each validator (v1 - v4):
p / v = 8 / 4 = 2 tokens
```

Note that this is different than most other Proof-of-Stake systems such as Cosmos. As long as a
validator is in the validator set, it will receive the same block reward as every other validator.
Validator `v1`, who had 18 tokens staked, received the same reward (2 tokens) in this era as `v4`
who had only 7 tokens staked.

## Running Multiple Validators

It is possible for a single entity to run multiple validators. Running multiple validators may
provide a better risk/reward ratio. Assuming you have enough DOT, or enough stake nominates your
validator, to ensure that your validators remain in the validator set, running multiple validators
will result in a higher return than running a single validator.

For the following example, assume you have 18 DOT to stake. For simplicity's sake, we will ignore
nominators. Running a single validator, as in the example above, would net you 2 DOT in this era.

Note that while DOT is used as an example, this same formula would apply to KSM when running a
validator on Kusama.

```
Validator Set Size (v): 4
Validator 1 Stake (v1): 18 DOT <- Your validator
Validator 2 Stake (v2):  9 DOT
Validator 3 Stake (v3):  8 DOT
Validator 4 Stake (v4):  7 DOT
Payout (p): 8 DOT

Your payout = (p / v) * 1 = (8 / 4) * 1 = 2
```

Running two validators, and splitting the stake equally, would result in the original validator `v4`
to be kicked out of the validator set, as only the top `v` validators (as measured by stake) are
selected to be in the validator set. More important, it would also double the reward that you get
from each era.

```
Validator Set Size (v): 4
Validator 1 Stake (v1): 9 DOT <- Your first validator
Validator 2 Stake (v2): 9 DOT <- Your second validator
Validator 3 Stake (v3): 9 DOT
Validator 4 Stake (v4): 8 DOT
Payout (p): 8 DOT

Your payout = (p / v) * 2 = (8 / 4) * 2 = 4
```

With enough stake, you could run more than two validators. However, each validator must have enough
stake behind it to be in the validator set.

The incentives of the system favor equally-staked validators. This works out to be a dynamic, rather
than static, equilibrium. Potential validators will run different numbers of validators and apply
different amounts of stake to them as time goes on, and in response to the actions of other
validators on the network.

## Slashing

Although rewards are paid equally, slashes are relative to a validator's stake. Therefore, if you do
have enough DOT to run multiple validators, it is in your best interest to do so. A slash of 30%
will, of course, be more DOT for a validator with 18 DOT staked than one with 9 DOT staked.

Running multiple validators does not absolve you of the consequences of misbehavior. Polkadot
punishes attacks that appear coordinated more severely than individual attacks. You should not, for
example, run multiple validators hosted on the same infrastructure. A proper multi-validator
configuration would ensure that they do not fail simultaneously.

Nominators have the incentive to nominate the lowest-staked validator, as this will result in the
lowest risk and highest reward. This is due to the fact that while their vulnerability to slashing
remains the same (since it is percentage-based), their rewards are higher since they will be a
higher proportion of the total stake allocated to that validator.

To clarify this, let us imagine two validators, `v1` and `v2`. Assume both are in the active set,
have commission set to 0%, and are well-behaved. The only difference is that `v1` has 90 DOT
nominating it and `v2` only has 10. If you nominate `v1`, it now has `90 + 10 = 100` DOT, and you
will get 10% of the staking rewards for the next era. If you nominate `v2`, it now has
`10 + 10 = 20` DOT nominating it, and you will get 50% of the staking rewards for the next era. In
actuality, it would be quite rare to see such a large difference between the stake of validators,
but the same principle holds even for smaller differences. If there is a 10% slash of either
validator, then you will lose 1 DOT in each case.

:::caution

If a validator is oversubscribed in an era, staking rewards are distributed only to the the top
{{ polkadot: <RPC network="polkadot" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/> :kusama }}
nominators and the rest of the nominators do not receive any rewards. This is not the case for
slashing! Every active nominator of the validator committing slashable offence will be slashed.

:::

## Nominators and Validator Payments

Nominated stake allows you to "vote" for validators and share in the rewards (and slashing) without
running a validator node yourself. Validators can choose to keep a percentage of the rewards due to
their validator to "reimburse" themselves for the cost of running a validator node. Other than that,
all rewards are shared based on the stake behind each validator. This includes the stake of the
validator itself, plus any stake bonded by nominators.

:::info

Validators set their preference as a percentage of the block reward, _not_ an absolute number of
DOT. Polkadot's block reward is based on the _total_ amount at stake, with the reward peaking when
the amount staked is at 50% of the total supply. The commission is set as the amount taken by the
validator; that is, 0% commission means that the validator does not receive any proportion of the
rewards besides that owed to it from self-stake, and 100% commission means that the validator
operator gets all rewards and gives none to its nominators.

:::

In the following examples, we can see the results of several different validator payment schemes and
split between nominator and validator stake. We will assume a single nominator for each validator.
However, there can be numerous nominators for each validator. Rewards are still distributed
proportionally - for example, if the total rewards to be given to nominators is 2 DOT, and there are
four nominators with equal stake bonded, each will receive 0.5 DOT. Note also that a single
nominator may stake different validators.

Each validator in the example has selected a different validator payment (that is, a percentage of
the reward set aside directly for the validator before sharing with all bonded stake). The
validator's payment percentage (in DOT, although the same calculations work for KSM) is listed in
brackets (`[]`) next to each validator. Note that since the validator payment is public knowledge,
having a low or non-existent validator payment may attract more stake from nominators, since they
know they will receive a larger reward.

```
Validator Set Size (v): 4
Validator 1 Stake (v1) [20% commission]: 18 DOT (9 validator, 9 nominator)
Validator 2 Stake (v2) [40% commission]:  9 DOT (3 validator, 6 nominator)
Validator 3 Stake (v3) [10% commission]:  8 DOT (4 validator, 4 nominator)
Validator 4 Stake (v4) [ 0% commission]:  6 DOT (1 validator, 5 nominator)
Payout (p): 8 DOT

Payout for each validator (v1 - v4):
p / v = 8 / 4 = 2 DOT

v1:
(0.2 * 2) = 0.4 DOT -> validator payment
(2 - 0.4) = 1.6 -> shared between all stake
(9 / 18) * 1.6 = 0.8 -> validator stake share
(9 / 18) * 1.6 = 0.8 -> nominator stake share
v1 validator total reward: 0.4 + 0.8 = 1.2 DOT
v1 nominator reward: 0.8 DOT

v2:
(0.4 * 2) = 0.8 DOT -> validator payment
(2 - 0.8) = 1.2 -> shared between all stake
(3 / 9) * 1.2 = 0.4 -> validator stake share
(6 / 9) * 1.2 = 0.8 -> nominator stake share
v2 validator total reward: 0.8 + 0.4 = 1.2 DOT
v2 nominator reward: 0.8 DOT

v3:
(0.1 * 2) = 0.2 DOT -> validator payment
(2 - 0.2) = 1.8 -> shared between all stake
(4 / 8) * 1.8 = 0.9 -> validator stake share
(4 / 8) * 1.8 = 0.9 -> nominator stake share
v3 validator total reward: 0.2 + 0.9 DOT = 1.1 DOT
v3 nominator reward: 0.9 DOT

v4:
(0 * 2) = 0 DOT -> validator payment
(2 - 0) = 2.0 -> shared between all stake
(1 / 6) * 2 = 0.33 -> validator stake share
(5 / 6) * 2 = 1.67 -> nominator stake share
v4 validator total reward: 0 + 0.33 DOT = 0.33 DOT
v4 nominator reward: 1.67 DOT
```



---
id: maintain-index
title: Network Maintainers
sidebar_label: Network Maintainers
description: Reference point for network maintenance guides.
keywords: [index, reference, maintain]
slug: ../maintain-index
---

Welcome to the network maintainers section of the Polkadot wiki. Here you will find information and
guides to set up a node and run the network.

## Node

- [Networks Guide](maintain-networks.md) - A list of the available Polkadot networks that you can
  connect to with a node.
- [Set up a Full Node](maintain-sync.md) - Get up and started by syncing a full node for the Kusama
  network. The steps in the guide will broadly apply also to any Substrate-based network (like
  Polkadot).
- [Set up Secure WebSocket](maintain-wss.md) - Set up a Secure WebSockets proxy server to safely
  access your node's RPC server

## Collator

- [Learn about Collators](../learn/learn-collator.md) - High level overview of collators and related
  links.

## Nominator

- [Learn about Nominators](../learn/learn-nominator.md) - High level overview of nominators and
  related links.
- [Nomination Guide (Polkadot)](maintain-guides-how-to-nominate-polkadot.md) - Walkthrough on how to
  nominate on the Polkadot network.
- [Nomination Guide (Kusama)](kusama/maintain-guides-how-to-nominate-kusama.md) - Walkthrough on how
  to nominate on the Kusama canary network.
- [How to stop being a Nominator](maintain-guides-how-to-nominate-polkadot.md) - Guide on how to
  stop nominating.

## Validator

- [Learn about Validators](../learn/learn-validator.md) - High level overview of validator and
  related links.
- [Validator Payouts](maintain-guides-validator-payout.md) - Overview on how validator rewards are
  calculated and paid.
- [Validation Guide (Polkadot)](maintain-guides-how-to-validate-polkadot.md) - Walkthrough on how to
  validate on the Polkadot network.
- [Validation Guide (Kusama)](kusama/maintain-guides-how-to-validate-kusama.md) - Walkthrough on how
  to validate on the Kusama canary network.
- [Using systemd for the Validator Node](maintain-guides-how-to-systemd.md) - Configuring systemd
  with the Validator node.
- [Secure Validator](maintain-guides-secure-validator.md) - Best tips and practices for validating.
- [How to upgrade a Validator Node](maintain-guides-how-to-upgrade.md) - Guide on upgrading your
  validator node.
- [How to Chill](maintain-guides-how-to-chill.md) - Walkthrough on how to chill as a validator.
- [How to Stop Validating](maintain-guides-how-to-stop-validating.md) - Proper way to stop
  validating.

## Governance

- [How to participate in Governance](maintain-guides-democracy.md) - Walkthrough on how to
  participate in governance.
- [How to join the Council](maintain-guides-how-to-join-council.md) - Step by step guide for running
  for the Council.
- [How to vote for a Councillor](maintain-guides-how-to-vote-councillor.md) - Step by step guide for
  voting for your favorite councillors.



---
id: maintain-networks
title: Networks
sidebar_label: Networks
description: Information about the different networks of the Polkadot ecosystem.
keywords: [networks, mainnet, testnet, canary, substrate]
slug: ../maintain-networks
---

Polkadot is built on top of Substrate, a modular framework for blockchains. One feature of Substrate
is to allow for connection to different networks using a single executable and configuring it with a
start-up flag. Here are some of the networks associated with Polkadot or Substrate that you may want
to connect to and join.

## Main networks

To connect to a Polkadot network please follow the [instructions](maintain-sync.md) for installing
the Polkadot executable.

### Polkadot Mainnet

Connecting to the Polkadot network is the default option when starting a node.

To start a Polkadot node, run the Polkadot binary:

```bash
polkadot
```

and you will connect and start syncing to Polkadot.

Check your node is connected by viewing it on
[Telemetry](https://telemetry.polkadot.io/#list/0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3)
(you can set a custom node name by specifying `--name "my-custom-node-name"`)

### Kusama Canary Network

Kusama is a canary network and holds real economic value.

Run the Polkadot binary and specify `kusama` as the chain:

```bash
polkadot --chain=kusama
```

and you will connect and start syncing to Kusama.

Check your node is connected by viewing it on
[Kusama Telemetry](https://telemetry.polkadot.io/#list/0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe)
(you can set a custom node name by specifying `--name "my-custom-node-name"`)

## Test Networks

### Westend Test Network

Westend is the primary test network of Polkadot. The tokens on this network are called _Westies_
(WND) and they purposefully hold no economic value.

Run the Polkadot binary and specify `westend` as the chain:

```bash
polkadot --chain=westend
```

and you will connect and start syncing to Westend.

Check that your node is connected by viewing it on
[Westend Telemetry](https://telemetry.polkadot.io/#list/0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e)
(you can set a custom node name by specifying `--name "my-custom-node-name"`).

#### Westend Faucet

Follow the instruction [here](../learn/learn-DOT.md#getting-tokens-on-the-westend-testnet) to get
Westies (WND) tokens.

### Rococo Test Network

[Rococo](https://substrate.io/developers/rococo-network/) is a test network built for parachains.
The native token of this network (ROC) holds no economic value.

Run the Polkadot binary and specify `rococo` as the chain:

```bash
polkadot --chain=rococo
```

and you will connect and start syncing to Rococo.

Check that your node is connected by viewing it on
[Rococo Telemetry](https://telemetry.polkadot.io/#list/0x6408de7737c59c238890533af25896a2c20608d8b380bb01029acb392781063e)
(you can set a custom node name by specifying `--name "my-custom-node-name"`).

#### Rococo Faucet

Follow the instruction [here](../learn/learn-DOT.md#getting-tokens-on-the-rococo-testnet) to get
ROCs tokens.

### Wococo Test Network (inactive)

Wococo used to be a Polkadot test network for testing bridges. The network was shut down following
the bridge between Westend and Rococo deployment.

## Differences

Runtime differences (e.g. existential and multisignature deposit sizes) between the different
networks can be found by doing a `diff` between the `src/lib.rs` of the repositories. For example,
to compare the Polkadot and Westend runtimes:

- `git clone https://github.com/paritytech/polkadot && cd polkadot/runtime`
- `ls` - show the available runtimes
- `diff polkadot/src/lib.rs westend/src/lib.rs`

You can also paste the runtimes
([Polkadot](https://github.com/paritytech/polkadot/blob/master/runtime/polkadot/src/lib.rs),
[Westend](https://github.com/paritytech/polkadot/blob/master/runtime/westend/src/lib.rs)) into a
web-based diff tool like [Diffchecker](https://www.diffchecker.com/) if you're not comfortable with
the CLI.

## Telemetry Dashboard

If you connect to the public networks, the default configuration for your node will connect it to
the public [Telemetry](https://telemetry.polkadot.io/) service.

You can verify that your node is connected by navigating to the correct network on the dashboard and
finding the name of your node.

There is a built-in search function on the nodes page. Simply start typing keystrokes in the main
window to make it available.



---
id: maintain-polkadot-parameters
title: Polkadot Parameters
sidebar_label: Parameters
description: A description about fundamental Polkadot parameters.
keywords: [parameters, actions, attributes, behaviors]
slug: ../maintain-polkadot-parameters
---

import RPC from "./../../components/RPC-Connection";

Many of these parameter values can be updated via on-chain governance. If you require absolute
certainty of these parameter values, it is recommended you directly check the constants by looking
at the [chain state](https://polkadot.js.org/apps/#/chainstate/constants) and/or
[storage](https://polkadot.js.org/apps/#/chainstate).

### Periods of common actions and attributes

_NOTE: Polkadot generally runs at &frac14;th the speed of Kusama, except in the time slot duration
itself. See [Kusama Parameters](https://guide.kusama.network/docs/kusama-parameters/) for more
details on how Polkadot's parameters differ from Kusama's._

- Slot: 6 seconds \*(generally one block per slot, although see note below)
- Epoch: 4 hours (2_400 slots x 6 seconds)
- Session: 4 hours (Session and Epoch lengths are the same)
- Era: 24 hours (6 sessions per Era, 2_400 slots x 6 epochs x 6 seconds)

| Polkadot | Time      | Slots\* |
| -------- | --------- | ------- |
| Slot     | 6 seconds | 1       |
| Epoch    | 4 hours   | 2_400   |
| Session  | 4 hours   | 2_400   |
| Era      | 24 hours  | 14_400  |

\*_A maximum of one block per slot can be in a canonical chain. Occasionally, a slot will be without
a block in the chain. Thus, the times given are *estimates*. See
[Consensus](../learn/learn-consensus.md) for more details._

### Accounts, Identity and Crowdloans

- The [Existential Deposit](../learn/learn-accounts.md#existential-deposit-and-reaping) is
  {{ polkadot: <RPC network="polkadot" path="consts.balances.existentialDeposit" defaultValue={10000000000} filter="humanReadable"/> :polkadot }}
  {{ kusama: <RPC network="polkadot" path="consts.balances.existentialDeposit" defaultValue={10000000000} filter="humanReadable"/> :kusama }}
- The deposit required to set an Identity is
  {{ polkadot: <RPC network="polkadot" path="consts.identity.basicDeposit" defaultValue={202580000000} filter="humanReadable"/> :polkadot }}
  {{ kusama: <RPC network="polkadot" path="consts.identity.basicDeposit" defaultValue={202580000000} filter="humanReadable"/> :kusama }}
- The minimum contribution required to participate in a crowdloan is
  {{ polkadot: <RPC network="polkadot" path="consts.crowdloan.minContribution" defaultValue={50000000000} filter="humanReadable"/> :polkadot }}
  {{ kusama: <RPC network="polkadot" path="consts.crowdloan.minContribution" defaultValue={50000000000} filter="humanReadable"/> :kusama }}

### Governance

| Democracy        | Time    | Slots   | Description                                                                                                                                                   |
| ---------------- | ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Voting period    | 28 days | 403_200 | How long the public can vote on a referendum.                                                                                                                 |
| Launch period    | 28 days | 403_200 | How long the public can select which proposal to hold a referendum on, i.e., every week, the highest-weighted proposal will be selected to have a referendum. |
| Enactment period | 28 days | 403_200 | Time it takes for a successful referendum to be implemented on the network.                                                                                   |

| Council       | Time   | Slots   | Description                                                          |
| ------------- | ------ | ------- | -------------------------------------------------------------------- |
| Term duration | 7 days | 100_800 | The length of a council member's term until the next election round. |
| Voting period | 7 days | 100_800 | The council's voting period for motions.                             |

The Polkadot Council consists of up to 13 members and up to 20 runners up.

| Technical committee     | Time    | Slots   | Description                                                                                    |
| ----------------------- | ------- | ------- | ---------------------------------------------------------------------------------------------- |
| Cool-off period         | 7 days  | 100_800 | The time a veto from the technical committee lasts before the proposal can be submitted again. |
| Emergency voting period | 3 hours | 1_800   | The voting period after the technical committee expedites voting.                              |

### Staking, Validating, and Nominating

The maximum number of validators that can be nominated by a nominator is
{{ polkadot: <RPC network="polkadot" path="consts.staking.maxNominations" defaultValue={16}/>. :polkadot }}
{{ kusama: <RPC network="polkadot" path="consts.staking.maxNominations" defaultValue={16}/>. :kusama }}

| Polkadot             | Time    | Slots   | Description                                                                                                                                                                                         |
| -------------------- | ------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Term duration        | 1 Day   | 14_400  | The time for which a validator is in the set after being elected. Note, this duration can be shortened in the case that a validator misbehaves.                                                     |
| Nomination period    | 1 Day   | 14_400  | How often a new validator set is elected according to Phragmén's method.                                                                                                                            |
| Bonding duration     | 28 days | 403_200 | How long until your funds will be transferrable after unbonding. Note that the bonding duration is defined in eras, not directly by slots.                                                          |
| Slash defer duration | 28 days | 403_200 | Prevents overslashing and validators "escaping" and getting their nominators slashed with no repercussions to themselves. Note that the bonding duration is defined in eras, not directly by slots. |

### Parachains

| Crowdloans and Auctions | Time   | Slots   | Description                                                                      |
| ----------------------- | ------ | ------- | -------------------------------------------------------------------------------- |
| Auction duration        | 7 days | 100_800 | The total duration of the slot auction, subject to the candle auction mechanism. |
| Opening period          | 2 days | 28_800  | The opening period of the slot auction.                                          |
| Ending period           | 5 days | 72_000  | The ending period of the slot auction.                                           |

| Parachain Slot      | Time     | Slots      | Description                                                                             |
| ------------------- | -------- | ---------- | --------------------------------------------------------------------------------------- |
| Lease period        | 12 weeks | 1_209_600  | The length of one lease period in a parachain slot.                                     |
| Total slot duration | 2 years  | 10_512_000 | The maximum duration a parachain can lease by winning a slot auction (8 lease periods). |

### Treasury

| Treasury               | Time    | Slots   | Description                                                  |
| ---------------------- | ------- | ------- | ------------------------------------------------------------ |
| Periods between spends | 24 days | 345_600 | When the treasury can spend again after spending previously. |

Burn percentage is currently `1.00%`.

### Precision

DOT have 10 decimals of precision. In other words, 10 \*\* 10 (10_000_000_000 or ten billion)
Plancks make up a DOT.

The denomination of DOT was changed from 12 decimals of precision at block #1,248,328 in an event
known as _Denomination Day_. See [Redenomination](../learn/learn-redenomination.md) for details.



---
id: maintain-rpc
title: Set up a RPC node
sidebar_label: Set up a RPC node
description: Steps on setting up a RPC node.
keywords: [rpc, rpc node, web socket, remote, connection, secure websocket]
slug: ../maintain-rpc
---

The substrate node RPC server can be accessed over the WebSocket protocol, which can be used to
access the underlying network and/or validator node. By default, you can access your node's RPC
server from localhost (for example, to rotate keys or do other maintenance). To access it from
another server or an applications UI (such as [Polkadot-JS UI](https://polkadot.js.org/apps)) it is
recommended to enable access to the RPC node over an SSL connection and encrypt the connection
between the end user and the RPC server. This can be achieved by setting up a secure proxy. Many
browsers, such as Google Chrome, will block non-secure ws endpoints if they come from a different
origin.

:::note

Enabling remote access to your validator node should not be necessary and is not suggested, as it
can often lead to security problems

:::

## Set up a Node

Setting up any Substrate-based node relies on a similar process. For example, by default, they will
all share the same WebSocket connection at port 9944 on localhost. In this example, we'll set up a
Polkadot sync node on a Debian-flavoured server (such as Ubuntu 22.04). Create a new server on your
provider of choice or locally at home. See [Set up a Full Node](./maintain-sync) for additional
instructions. You can install from the default apt repository or build from scratch. The startup
options in the setup process provide various settings that can be modified.

A typical setting for an externally accessible polkadot archive RPC node would be:

```config
polkadot --chain polkadot --name myrpc --state-pruning archive --blocks-pruning archive --rpc-max-connections 100 --rpc-cors all --rpc-methods Safe --rpc-port 9944
```

Or for a Polkadot pruned RPC node:

```config
polkadot --chain polkadot --name myrpc --state-pruning 1000 --blocks-pruning archive --rpc-max-connections 100 --rpc-cors all --rpc-methods Safe --rpc-port 9944
```

The specified flag options are outlined in greater detail below.

### Archive Node vs. Pruned Node

A pruned node only keeps a limited number of finalized blocks of the network, not its full history.
Most frequently required actions can be completed with a pruned node, such as displaying account
balances, making transfers, setting up session keys, staking, etc. An archive node has the full
history (database) of the network. It can be queried in various ways, such as providing historical
information regarding transfers, balance histories, and more advanced queries involving past events.

An archive node requires a lot more disk space. At the start of April 2023, Polkadot disk usage was
160 GB for a pruned node and 1 TB for an archive node. This value will increase with time. For an
archive node, you need the options `--state-pruning archive --blocks-pruning archive` in your
startup settings.

:::tip

Inclusion in the Polkadot.js UI requires an archive node.

:::

### Secure the RPC server

The node startup settings allow you to choose **what** to expose, **how many** connections to expose
and **from where** access should be granted through the RPC server.

_How many_: You can set your maximum connections through `--rpc-max-connections`, for example
`--rpc-max-connections 100`

_From where_: by default localhost and the polkadot.js are allowed to access the RPC server; you can
change this by setting `--rpc-cors`, to allow access from everywhere you need `--rpc-cors all`

_What_: you can limit the methods to use with `--rpc-methods`, an easy way to set this to a safe
mode is `--rpc-methods Safe`

### Secure the ws port

To safely access your ws connection over an SSL-enabled connection (needed for polkadot.js), you
have to convert the ws connection to a secure (wss) connection by using a proxy and an SSL
certificate, you can find instructions on securing the ws port [here](/docs/maintain-wss).

## Connecting to the Node

Open [Polkadot-JS UI](https://polkadot.js.org/apps) and click the logo in the top left to switch the
node. Activate the "Development" toggle and input your node's address - either the domain or the IP
address. Remember to prefix with `wss://`, and if you're using the 443 port, append `:443` like so:
`wss://example.com:443`.

![A sync-in-progress chain connected to Polkadot-JS UI](../assets/maintain-wss-image.png)

Now you have a secure remote connect setup for your Substrate node.



---
id: maintain-sync
title: Set up a Full Node
sidebar_label: Set up a Full Node
description: Steps on how to set up a full node.
keywords: [node, full node, sync, setup node]
slug: ../maintain-sync
---

import Tabs from "@theme/Tabs";

import TabItem from "@theme/TabItem";

If you're building dApps or products on a Substrate-based chain like Polkadot, Kusama, or a custom
Substrate implementation, you want the ability to run a node-as-a-back-end. After all, relying on
your infrastructure is always better than a third-party-hosted one in this brave new decentralized
world.

This guide will show you how to connect to [Polkadot network](https://polkadot.network/), but the
same process applies to any other [Substrate](https://substrate.io)-based chain. First, let's
clarify the term _full node_.

### Types of Nodes

A blockchain's growth comes from a _genesis block_, _extrinsics_, and _events_.

When a validator seals block 1, it takes the blockchain's state at block 0. It then applies all
pending changes on top of it and emits the events resulting from these changes. Later, the chain’s
state at block one is used the same way to build the chain’s state at block 2, and so on. Once
two-thirds of the validators agree on a specific block being valid, it is finalized.

An **archive node** keeps all the past blocks and their states. An archive node makes it convenient
to query the past state of the chain at any point in time. Finding out what an account's balance at
a particular block was or which extrinsics resulted in a specific state change are fast operations
when using an archive node. However, an archive node takes up a lot of disk space - around Kusama's
12 millionth block, this was around 660 GB.

:::tip

On the [Paranodes](https://paranodes.io/DBSize) or [Stakeworld](https://stakeworld.io/docs/dbsize)
websites, you can find lists of the database sizes of Polkadot and Kusama nodes.

:::

Archive nodes are used by utilities that need past information - like block explorers, council
scanners, discussion platforms like [Polkassembly](https://polkassembly.io), and others. They need
to be able to look at past on-chain data.

A **full node** prunes historical states: all finalized blocks' states older than a configurable
number except the genesis block's state. This is 256 blocks from the last finalized one by default.
A pruned node this way requires much less space than an archive node.

A full node could eventually rebuild every block's state without additional information and become
an archive node. This still needs to be implemented at the time of writing. If you need to query
historical blocks' states past what you pruned, you must purge your database and resync your node,
starting in archive mode. Alternatively, you can use a backup or snapshot of a trusted source to
avoid needing to sync from genesis with the network and only need the states of blocks past that
snapshot.

Full nodes allow you to read the current state of the chain and to submit and validate extrinsics
directly on the network without relying on a centralized infrastructure provider.

Another type of node is a **light node**. A light node has only the runtime and the current state
but does not store past blocks and so cannot read historical data without requesting it from a node
that has it. Light nodes are useful for resource-restricted devices. An interesting use-case of
light nodes is a browser extension, which is a node in its own right, running the runtime in WASM
format, as well as a full or light node that is completely encapsulated in WASM and can be
integrated into web apps: https://github.com/paritytech/smoldot#wasm-light-node.

:::note Substrate Connect

[Substrate Connect](https://github.com/paritytech/substrate-connect) provides a way to interact with
substrate-based blockchains in the browser without using an RPC server. It is a light node that runs
entirely in Javascript. Substrate Connect uses a
[smoldot WASM light client](https://github.com/paritytech/smoldot) to securely connect to the
blockchain network without relying on specific 3rd parties. Substrate Connect is available on Chrome
and Firefox as a [browser extension](https://substrate.io/developers/substrate-connect/).

:::

<!--separates content from instructions-->

---

<!--setup instructions differ per os, presented in tabs-->

## Setup Instructions

This is not recommended if you're a validator. Please see the
[secure validator setup](maintain-guides-secure-validator.md) if you are running validator.

:::note The bash commands that are provided to run against **your node** use `Polkadot` as the
default chain

Use the `--chain` flag if you follow the setup instructions to setup a `Kusama` node. For example:

```bash
./target/release/polkadot --name "Your Node's Name" --chain kusama
```

:::

<Tabs groupId="operating-systems" values={[ {label: 'macOS', value: 'mac'}, {label: 'Windows',
value: 'win'}, {label: 'Linux (standalone)', value: 'linux-standalone'}, {label: 'Linux (package)',
value: 'linux-package'} ]}>

<TabItem value="mac">

- Install Homebrew within the terminal by running:
  ```bash
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
  ```
- Then, run:

  ```bash
  brew install openssl cmake llvm protobuf
  ```

- Install Rust by running:
  ```bash
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  ```
- After Rust is installed, update and add the nightly version:

  ```bash
  # Ensure the current shell has cargo
  source ~/.cargo/env

  # Update the Rust toolchain
  rustup default stable
  rustup update

  # Add the nightly and WebAssembly targets:
  rustup update nightly
  rustup target add wasm32-unknown-unknown --toolchain nightly
  ```

- Verify your installation by running the following:

  ```bash
  rustup show

  # You should see output similar to:

  active toolchain
  ----------------

  stable-aarch64-apple-darwin (default)
  rustc 1.68.1 (8460ca823 2023-03-20)
  ```

  ```bash
  rustup +nightly show

  # You should see output similar to:

  installed targets for active toolchain
  --------------------------------------

  aarch64-apple-darwin
  wasm32-unknown-unknown

  active toolchain
  ----------------

  nightly-aarch64-apple-darwin (overridden by +toolchain on the command line)
  rustc 1.71.0-nightly (9ecda8de8 2023-04-30)
  ```

- Once Rust is configured, run the following command to clone and build the Polkadot code:
  ```bash
  git clone https://github.com/paritytech/polkadot polkadot
  cd polkadot
  ./scripts/init.sh
  cargo build --release
  ```
- Start your node:

  ```bash
  ./target/release/polkadot --name "Your Node's Name"
  ```

- Find your node on [Telemetry](https://telemetry.polkadot.io/#list/Polkadot)

</TabItem>
<TabItem value="win">

- Install [WSL](https://docs.microsoft.com/en-us/windows/wsl/install-win10).
- Install [Ubuntu](https://docs.microsoft.com/en-us/windows/wsl/install-win10) (same webpage).

- Determine the latest version of the
  [Polkadot binary](https://github.com/paritytech/polkadot/releases).
- Download the correct Polkadot binary within Ubuntu by running the following command. Replace
  `*VERSION*` with the tag of the latest version from the last step (e.g. `v0.8.22`):

  ```bash
  curl -sL https://github.com/paritytech/polkadot/releases/download/*VERSION*/polkadot -o polkadot
  ```

- Then, run the following:
  ```bash
  sudo chmod +x polkadot
  ```
- Start your node:

  ```bash
  ./polkadot --name "Your Node's Name"
  ```

- Find your node on [Telemetry](https://telemetry.polkadot.io/#list/Polkadot)

</TabItem>
<TabItem value="linux-standalone">

- Determine the latest version of the
  [Polkadot binary](https://github.com/paritytech/polkadot/releases).

  :::info

  The nature of pre-built binaries means that they may not work on your particular architecture or
  Linux distribution. If you see an error like `cannot execute binary file: Exec format error` it
  likely means the binary is not compatible with your system. You will either need to compile the
  [**source code**](#clone-and-build) or use [**Docker**](#using-docker).

  :::

- Download the correct Polkadot binary within Ubuntu by running the following command. Replace
  `*VERSION*` with the tag of the latest version from the last step (e.g. `v0.8.22`):

  ```bash
  curl -sL https://github.com/paritytech/polkadot/releases/download/*VERSION*/polkadot -o polkadot
  ```

- Run the following: `sudo chmod +x polkadot`
- Run the following:

  ```bash
  ./target/release/polkadot --name "Your Node's Name"
  ```

- Find your node on [Telemetry](https://telemetry.polkadot.io/#list/Polkadot)

</TabItem>
<TabItem value="linux-package">

You can also install Polkadot from one of our package repositories.

Installation from the Debian or rpm repositories will create a `systemd` service that can be used to
run a Polkadot node. The service is disabled by default, and can be started by running
`systemctl start polkadot` on demand (use `systemctl enable polkadot` to make it auto-start after
reboot). By default, it will run as the `polkadot` user. Command-line flags passed to the binary can
be customized by editing `/etc/default/polkadot`. This file will not be overwritten on updating
polkadot.

### Debian-based (Debian, Ubuntu)

Currently supports Debian 10 (Buster) and Ubuntu 20.04 (Focal), and derivatives. Run the following
commands as the `root` user.

```bash
# Import the security@parity.io GPG key
gpg --recv-keys --keyserver hkps://keys.mailvelope.com 9D4B2B6EB8F97156D19669A9FF0812D491B96798
gpg --export 9D4B2B6EB8F97156D19669A9FF0812D491B96798 > /usr/share/keyrings/parity.gpg
# Add the Parity repository and update the package index
echo 'deb [signed-by=/usr/share/keyrings/parity.gpg] https://releases.parity.io/deb release main' > /etc/apt/sources.list.d/parity.list
apt update
# Install the `parity-keyring` package - This will ensure the GPG key
# used by APT remains up-to-date
apt install parity-keyring
# Install polkadot
apt install polkadot

```

If you don't want polkadot package to be automatically updated when you update packages on your
server, you can issue the following command:

```bash
sudo apt-mark hold polkadot
```

### RPM-based (Fedora, CentOS)

Currently supports Fedora 32 and CentOS 8, and derivatives.

```bash
# Install dnf-plugins-core (This might already be installed)
dnf install dnf-plugins-core
# Add the repository and enable it
dnf config-manager --add-repo https://releases.parity.io/rpm/polkadot.repo
dnf config-manager --set-enabled polkadot
# Install polkadot (You may have to confirm the import of the GPG key, which
# should have the following fingerprint: 9D4B2B6EB8F97156D19669A9FF0812D491B96798)
dnf install polkadot
```

:::info

If you choose to use a custom folder for the polkadot home by passing `--base-path '/custom-path'`,
you will need to issue following command:

```bash
sudo mkdir /etc/systemd/system/polkadot.service.d
```

And create a new file inside this folder:

```bash
sudo -e /etc/systemd/system/polkadot.service.d/custom.conf
```

With the following content:

```
[Service]
ReadWritePaths=/custom-path
```

And finally issue a reload to have your modifications applied by systemd:

```bash
systemctl daemon-reload
```

:::

</TabItem>
</Tabs>

## Get Substrate

Follow instructions as outlined [here](https://docs.substrate.io/quick-start/) - note that Windows
users will have their work cut out for them. It's better to use a virtual machine instead.

Test if the installation was successful by running `cargo --version`.

```bash
λ cargo --version
cargo 1.41.0 (626f0f40e 2019-12-03)
```

## Clone and Build

The [paritytech/polkadot](https://github.com/paritytech/polkadot) repo's master branch contains the
latest Polkadot code.

```bash
git clone https://github.com/paritytech/polkadot polkadot
cd polkadot
./scripts/init.sh
cargo build --release
```

Alternatively, if you wish to use a specific release, you can check out a specific tag (`v0.8.3` in
the example below):

```bash
git clone https://github.com/paritytech/polkadot polkadot
cd polkadot
git checkout tags/v0.8.3
./scripts/init.sh
cargo build --release
```

## Run

The built binary will be in the `target/release` folder, called `polkadot`.

**Polkadot**:

```bash
./target/release/polkadot --name "Your Node's Name"
```

Use the `--help` flag to determine which flags you can use when running the node. For example, if
[connecting to your node remotely](maintain-wss.md), you'll probably want to use `--rpc-external`
and `--rpc-cors all`.

The syncing process will take a while, depending on your capacity, processing power, disk speed and
RAM. On a \$10 DigitalOcean droplet, the process can complete in some 36 hours.

Congratulations, you're now syncing with Polkadot. Keep in mind that the process is identical when
using any other Substrate chain.

## Running an Archive Node

When running as a simple sync node (above), only the state of the past 256 blocks will be kept. It
defaults to [archive mode](#types-of-nodes) when validating. To support the full state, use the
`--pruning` flag:

**Polkadot**:

```bash
./target/release/polkadot --name "My node's name" --pruning archive
```

It is possible to almost quadruple synchronization speed by using an additional flag:
`--wasm-execution Compiled`. Note that this uses much more CPU and RAM, so it should be turned off
after the node syncs.

## Using Docker

Finally, you can use Docker to run your node in a container. Doing this is more advanced, so it's
best left up to those already familiar with docker or who have completed the other set-up
instructions in this guide. Be aware that when you run polkadot in docker, the process only listens
on localhost by default. If you would like to connect to your node's services (rpc, and prometheus)
you need to ensure that you run you node with the `--rpc-external`, and `--prometheus-external`
commands.

```zsh
docker run -p 9944:9944 -p 9615:9615 parity/polkadot:v0.9.13 --name "calling_home_from_a_docker_container" --rpc-external --prometheus-external
```



---
id: maintain-wss
title: Secure the WebSocket
sidebar_label: Secure the WebSocket
description: Steps on setting up a secure socket for remote connections.
keywords: [web socket, remote, connection, secure websocket]
slug: ../maintain-wss
---

## Secure a WS Port

A non-secure ws port can be converted to a secure wss port by placing it behind an SSL-enabled
proxy. This can be used to secure a [bootnode](/docs/maintain-bootnode) or secure a
[RPC server](/docs/maintain-rpc). The SSL-enabled apache2/nginx/other proxy server redirects
requests to the internal ws and converts it to a secure (wss) connection. For this, you will need an
SSL certificate for which you can use a service like letsencrypt or self-signing.

### Obtaining an SSL Certificate

One easy way to get a free SSL certificate can be achieved by following the LetsEncrypt instructions
([nginx](https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal)/[apache](https://certbot.eff.org/instructions?ws=apache&os=ubuntufocal)).
This will auto-generate an SSL certificate and include it in your configuration.

Alternatively, you can generate a self-signed certificate and rely on the raw IP address of your
node when connecting to it. This is not preferable since you will have to whitelist the certificate
to access it from a browser.

```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/selfsigned.key -out /etc/ssl/certs/selfsigned.crt
sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
```

## Installing a Proxy Server

There are a lot of different implementations of a WebSocket proxy, some of the more widely used are
[nginx](https://www.nginx.com/) and [apache2](https://httpd.apache.org/), for which configuration
examples provided below.

### Nginx

```bash
apt install nginx
```

In an SSL-enabled virtual host add:

```conf
server {
  (...)
  location / {
    proxy_buffers 16 4k;
    proxy_buffer_size 2k;
    proxy_pass http://localhost:9944;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_set_header Host $host;
   }
}
```

Optionally some form of rate limiting can be introduced:

```conf
http {
  limit_req_zone  "$http_x_forwarded_for" zone=zone:10m rate=2r/s;
  (...)
}

location / {
  limit_req zone=zone burst=5;
  (...)
}
```

### Apache2

You can run it in different modes such as prefork, worker, or event. In this example, we use
[event](https://httpd.apache.org/docs/2.4/mod/event.html) which works well on higher load
environments but other modes are also useful given the requirements.

```bash
apt install apache2
a2dismod mpm_prefork
a2enmod mpm_event proxy proxy_html proxy_http proxy_wstunnel rewrite ssl
```

The [mod_proxy_wstunnel](https://httpd.apache.org/docs/2.4/mod/mod_proxy_wstunnel.html) provides
_support for the tunneling of web socket connections to a backend websockets server. The connection
is automatically upgraded to a WebSocket connection_. In an SSL-enabled virtualhost add:

```apacheconf
(...)
SSLProxyEngine on
ProxyRequests off

ProxyPass / ws://localhost:9944
ProxyPassReverse / ws://localhost:9944
```

Older versions of mod_proxy_wstunnel do not upgrade the connection automatically and will need the
following config added:

```apacheconf
RewriteEngine on
RewriteCond %{HTTP:Upgrade} websocket [NC]
RewriteRule /(.*) ws://localhost:9944/$1 [P,L]
RewriteRule /(.*) http://localhost:9944/$1 [P,L]
```

Optionally some form of rate limiting can be introduced:

```bash
apt install libapache2-mod-qos
a2enmod qos
```

And edit `/etc/apache2/mods-available/qos.conf`

```conf
# allows max 50 connections from a single ip address:
QS_SrvMaxConnPerIP                                 50
```

## Connecting to the Node

Open [Polkadot-JS UI](https://polkadot.js.org/apps) and click the logo in the top left to switch the
node. Activate the "Development" toggle and input your node's address - either the domain or the IP
address. Remember to prefix with `wss://` and if you're using the 443 port, append `:443`, like so:
`wss://example.com:443`.

![A sync-in-progress chain connected to Polkadot-JS UI](../assets/maintain-wss-image.png)

Now you have a secure remote connect setup for your Substrate node.
