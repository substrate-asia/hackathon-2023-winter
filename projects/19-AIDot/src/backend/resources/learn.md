---
id: learn-account-abstraction
title: Polkadot's Account Abstraction
sidebar_label: Account Abstraction
description: Polkadot's Native Account Abstraction.
keywords: [account, polkadot account, account abstraction, proxy, multisig, batch]
slug: ../learn-account-abstraction
---

## Your Keys, Your Responsibility

Account abstraction addresses the challenges of managing cryptographic keys representing accounts on
blockchains. Accounts on blockchains represent entities, from an individual's identity to an
institution. In [Web3](../general/web3-and-polkadot.md), you digitally sign any transaction or, more
generally, any message using your private key. Data is recorded on a public ledger (usually
blockchain-based) whose multiple copies of it are stored in computers participating in a P2P
network.

While the account’s private keys grant users control and ownership, losing them results in losing
access to digital assets and fragmentation of your digital identity since you will need to create a
new account with a new set of keys. This poses a hurdle for both users and developers regarding
security and adoption.

## Definition of Account Abstraction

The concept of account _abstraction_ was first mentioned via Ethereum's
[EIP-4337](https://eips.ethereum.org/EIPS/eip-4337) focused on allowing users to flexibly program
more security and better user experiences into their accounts. The idea also aims to separate the
user experience from the private key, enabling a piece of code to dictate account behavior. This
allows for increased flexibility of accounts that originally were not engineered to be flexible and
decreased chances of key mismanagement.

Users are still responsible for their keys, but through account abstraction, they can take
precautions to ensure they do not end up losing their accounts.

Account abstraction introduces a layer of on-chain logic that controls an account, typically in the
form of a smart contract, that completely avoids the need for consensus-layer protocol changes.
Without a smart contract, abstracting accounts would require changes in the core architecture of the
protocol.

Polkadot's generic codebase makes the concept of an account natively flexible and abstract without
the direct need for smart contracts.

## Origin Abstraction in Polkadot

Adopting a generic design is crucial in scaling [Web3](../general/web3-and-polkadot.md)
technologies. Abstraction and generalization of protocols are essential to improving user experience
and security in blockchain adoption.

When users interact with a blockchain they call _dispatchable_ functions to do something. Because
those functions are called from the outside of the blockchain interface, in Polkadot's terms any
action that involves a dispatchable function is an [extrinsic](./learn-extrinsics.md). Extrinsics
are calls coming from the _outside_ of the blockchain interface that (if successfully executed)
invoke some changes in the _inside_ of the blockchain's state. An extrinsic is always directed to a
specific function within a particular [pallet](../general/glossary.md#pallet).

For example, the `balances.transferKeepAlive` extrinsic is directed to the `transferKeepAlive`
function within the `balances` pallet. If successful, the execution of that function will transfer
funds between two accounts, changing the balances of those accounts and thus the chain state (as
accounts hold some state within the blockchain).

In [Substrate](../general/glossary.md#substrate)'s FRAME, functions are not necessarily called by
accounts. Functions can be called by any origin, where origins are caller-personas associated with
privilege levels. For example, the Polkadot [OpenGov](./learn-polkadot-opengov.md) has different
origins with different privileges, such as allocating treasury funds, cancelling a referendum, etc.
Neither of those origins is subservient to the concept of an account or assume anything about state
or associated data. Custom origins can be created while designing your chain using the Substrate
(which is part of the [Polkadot SDK](https://github.com/paritytech/polkadot-sdk)).

The figure below shows the {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}'s origin
abstraction. Accounts happen to be just one variant (or corner case) of Substrate's FRAME possible
origins, the `frame_system::RawOrigin::Signed`. OpenGov origins function in a way that, if
conditions (approval and support) are met and a proposal passes, the appropriate
[origin is then associated with the scheduled call](https://github.com/paritytech/polkadot-sdk/blob/1835c091c42456e8df3ecbf0a94b7b88c395f623/substrate/frame/referenda/src/lib.rs#L884).
Those origins are caller-personas that do not have any entity behind them, and do not hold any state
on chain.

![origin-abstraction](../assets/origin-abstraction.png)

In Substrate, the concept of account is completely deprioritized. Substrate itself remains
indifferent to an account's balance and nonce. While FRAME can support their presence, it
fundamentally does not need to rely on them.

The [Cross-Consensus Messaging (XCM)](./learn-xcm-index) format can take advantage of origin
abstraction for cross-consensus communications by specifying the context for a particular message.
Origins in this case imply the authority under which a message is being sent (and thereby,
executed).

On a lower level, the XCM format also provides a much powerful origin abstraction that allows
calling personas that are so abstract to not necessarily have direct representation on the local
chain within its FRAME system origin.

### Protocol-level Account Abstraction

While the [Substrate FRAME system](https://docs.substrate.io/reference/frame-pallets/) does not have
a single pallet (module) for complete account abstraction, it incorporates various pallets that
collectively achieve similar functionalities. Polkadot's native account abstraction functionalities
include:

- [Multi-signature accounts](./learn-account-multisig.md) to control an account using different ones
- [Proxy accounts](./learn-proxies.md) for role-based representation, and ownership representation
  through [pure proxies](./learn-proxies.md#anonymous-proxy-pure-proxy)
- [Derivative accounts](./learn-account-advanced.md#derivation-paths) for using the same _parent_
  private key on multiple _children_ accounts
- Account recovery mechanisms such as social recovery to help regain access to your key using
  trusted third-party accounts
- [Batching functionality](./learn-balance-transfers.md#batch-transfers) to submit multiple calls in
  one single transaction
- Payments with non-native tokens

All the above can be used together, meaning that, for example, you can create a multi-signature
account of pure proxies to keep the same multi-signature account when signatories change. A more
complex combination to build a hot wallet can be found in this
[blog post](https://www.parity.io/blog/building-a-hot-wallet-with-substrate-primitives/).

Additionally, developers have the flexibility to design their own rules for abstraction.

In the Substrate FRAME system, accounts are represented by Accounts IDs. Such unique identifiers can
be any 32-byte number and are not limited to just a public key (with a corresponding private key).
For example, multi-signature accounts do not have a private key, and their Account ID is built with
hashed information from signatories’ public keys and the multisig threshold.

### Smart-contract Level Account Abstraction

Account abstraction can be implemented in parachains also with traditional smart-contracts for
example using the [ink!](../build/build-smart-contracts.md#ink) smart contract language.

## Further Readings

- [Hackernoon Article](https://hackernoon.com/abstracting-away-account-abstraction-on-polkadot) by
  [Bader Youssef](../general/contributors.md#bader-youssef) - "Abstracting Away Account Abstraction
  on Polkadot"
- [Parity Blog Post](https://www.parity.io/blog/building-a-hot-wallet-with-substrate-primitives/) by
  Joe Petrowski - "Building a Hot Wallet with Substrate Primitives"


---
id: learn-account-advanced
title: Polkadot Accounts In-Depth
sidebar_label: Accounts
description: Advanced Concepts about Polkadot's Accounts.
keywords: [account, polkadot account, polkadotjs, indices, identity, reaping, ENS, domain, ETH]
slug: ../learn-account-advanced
---

import RPC from "./../../components/RPC-Connection";

## Address Format

The address format used in Substrate-based chains is SS58. SS58 is a modification of Base-58-check
from Bitcoin with some minor changes. Notably, the format contains an _address type_ prefix that
identifies an address belonging to a specific network.

For example:

- Polkadot addresses **always start with** the number **1**.
- Kusama addresses always start with a capital letter, such as **C, D, F, G, H, J**.
- Generic Substrate addresses **always start with** the number **5**.

These prefixes, including how to validate addresses, are embedded in the Substrate SS58 format.
Never use regular expressions for address validation.

It's important to understand that different network formats are **merely other representations of
the same public key in a private-public keypair** generated by an address generation tool. As a
result, the addresses across Substrate-based chains are compatible if the format is converted
correctly.

As of Runtime 28, the default [address format](learn-accounts.md##address-format) is the
[`MultiAddress`](https://github.com/paritytech/substrate/blob/master/primitives/runtime/src/multiaddress.rs)
type.

This `enum` is a multi-format address wrapper for on-chain accounts and allows us to describe
Polkadot's default address format to represent many different address types. This includes **20
byte**, **32 byte**, and **arbitrary raw byte** variants. It also enhances the original
[`indices`](learn-accounts.md#indices) lookup.

:::info

Many wallets allow you to convert between formats. Stand-alone tools exist as well; you can find
them in the [address conversion tools](#address-conversion-tools) section.

:::

### For the Curious: How Prefixes Work

The [SS58 registry](https://github.com/paritytech/ss58-registry/blob/main/ss58-registry.json) states
that:

- Polkadot has an address type of `00000000b` (`0` in decimal).
- Kusama (Polkadot Canary) has an address type of `00000010b` (`2` in decimal).
- Generic Substrate has `00101010b` as the address type (`42` in decimal).

Because the `Base58-check` alphabet has no number 0, the lowest value is indeed 1. So `00000000b` is
1 in Base58-check. If we try to
[decode](https://www.better-converter.com/Encoders-Decoders/Base58Check-to-Hexadecimal-Decoder) a
Polkadot address like `1FRMM8PEiWXYax7rpS6X4XZX1aAAxSWx1CrKTyrVYhV24fg`, the result is
`000aff6865635ae11013a83835c019d44ec3f865145943f487ae82a8e7bed3a66b29d7`. The first byte is `00`,
which is indeed `00000000` in binary and `0` in decimal and thus matches the address type of
Polkadot.

Let's take a look at Substrate addresses. If we decode
`5CK8D1sKNwF473wbuBP6NuhQfPaWUetNsWUNAAzVwTfxqjfr`, we get
`2a0aff6865635ae11013a83835c019d44ec3f865145943f487ae82a8e7bed3a66b77e5`. The first byte is `2a`
which when
[converted from hex to decimal](https://www.rapidtables.com/convert/number/hex-to-decimal.html)
is 42. 42 is `00101010` in binary, just as the SS58 document states.

Finally, let's look at Kusama addresses. Decoding `CpjsLDC1JFyrhm3ftC9Gs4QoyrkHKhZKtK7YqGTRFtTafgp`
gives us `020aff6865635ae11013a83835c019d44ec3f865145943f487ae82a8e7bed3a66b0985` with the first
byte being `02`, just as specified. If we try a Kusama address that starts with a completely
different letter, like `J4iggBtsWsb61RemU2TDWDXTNHqHNfBSAkGvVZBtn1AJV1a`, we still get `02` as the
first byte: `02f2d606a67f58fa0b3ad2b556195a0ef905676efd4e3ec62f8fa1b8461355f1142509`. It seems
counterintuitive that some addresses always have the same prefix and others like Kusama can vary
wildly, but it's just a quirk of Base58-check encoding.

## Address Conversion Tools

You can use the tools below to convert any SS58 address for any network for use on different
networks

- [handy subscan tool](https://polkadot.subscan.io/tools/ss58_transform)
- [simple address converter](https://polkadot-address-convertor.netlify.app/)

### How to Verify a Public Key's Associated Address

You can verify your public key's associated address through a series of inspection steps, where the
key is a base-16 (hexadecimal) address.

#### Using Subkey to Retrieve Public Key from SS58 Address

This is to showcase that the **SS58 address is based on the public key (aka "Account ID")**

The Subkey Tool's The
[Inspecting Keys](https://docs.substrate.io/reference/command-line-tools/subkey/#inspecting-keys)
section explains how to use the `inspect` command to recalculate your key pair's public key and
address.

Start by inspecting your account's Polkadot address by running the inspect command against your
account's address:

```bash
$ subkey inspect 1a1LcBX6hGPKg5aQ6DXZpAHCCzWjckhea4sz3P1PvL3oc4F

Public Key URI `1a1LcBX6hGPKg5aQ6DXZpAHCCzWjckhea4sz3P1PvL3oc4F` is account:
  Network ID/version: polkadot
  Public key (hex):   0x192c3c7e5789b461fbf1c7f614ba5eed0b22efc507cda60a5e7fda8e046bcdce
  Account ID:         0x192c3c7e5789b461fbf1c7f614ba5eed0b22efc507cda60a5e7fda8e046bcdce
  SS58 Address:       1a1LcBX6hGPKg5aQ6DXZpAHCCzWjckhea4sz3P1PvL3oc4F
```

Take note of the hexadecimal string for "Public key (hex)". This is your account's public key.

Running the `inspect` command on your public key along with the `--public` parameter the SS58
address for the default network (substrate) is returned.

```bash
$ subkey inspect --public 0x192c3c7e5789b461fbf1c7f614ba5eed0b22efc507cda60a5e7fda8e046bcdce

Network ID/version: substrate
  Public key (hex):   0x192c3c7e5789b461fbf1c7f614ba5eed0b22efc507cda60a5e7fda8e046bcdce
  Account ID:         0x192c3c7e5789b461fbf1c7f614ba5eed0b22efc507cda60a5e7fda8e046bcdce
  Public key (SS58):  5CdiCGvTEuzut954STAXRfL8Lazs3KCZa5LPpkPeqqJXdTHp
  SS58 Address:       5CdiCGvTEuzut954STAXRfL8Lazs3KCZa5LPpkPeqqJXdTHp
```

Using the `--network` flag, you can define the network that you would like to inspect, where the
SS58 address will be based on that network. Now, running the `inspect` command with
`--network polkadot` return your original Polkadot address, thus verifying the public key.

```bash
$ subkey inspect --network polkadot 5CdiCGvTEuzut954STAXRfL8Lazs3KCZa5LPpkPeqqJXdTHp

Public Key URI `5CdiCGvTEuzut954STAXRfL8Lazs3KCZa5LPpkPeqqJXdTHp` is account:
  Network ID/version: polkadot
  Public key (hex):   0x192c3c7e5789b461fbf1c7f614ba5eed0b22efc507cda60a5e7fda8e046bcdce
  Account ID:         0x192c3c7e5789b461fbf1c7f614ba5eed0b22efc507cda60a5e7fda8e046bcdce
  Public key (SS58):  1a1LcBX6hGPKg5aQ6DXZpAHCCzWjckhea4sz3P1PvL3oc4F
  SS58 Address:       1a1LcBX6hGPKg5aQ6DXZpAHCCzWjckhea4sz3P1PvL3oc4F
```

You will notice that the Subkey Tool recognizes the correct address network and returns the
associated public key. The public key is returned as a hexadecimal string (i.e. prefixed with
**"0x"**). **For both SS58 addresses, the same public key is returned.**

#### Address Verification

##### Consider the following example:

![19](../assets/accounts/pubkey-1.png)

If you are comfortable enough to distinguish between each account parameter, you can prefix the
public-key string with **"0x"** on your own:

From:
`Pay DOTs to the Polkadot account:192c3c7e5789b461fbf1c7f614ba5eed0b22efc507cda60a5e7fda8e046bcdce`,
we prefix the address by "0x" ->
`0x192c3c7e5789b461fbf1c7f614ba5eed0b22efc507cda60a5e7fda8e046bcdce`.

Using the [handy subscan tool](https://polkadot.subscan.io/tools/ss58_transform), you can verify
both address associations to your public key. Copy your public key into the "Input Account or Public
Key" textbox and click "Transform" at the bottom. On the right-hand side, the addresses for Polkadot
and Substrate that are returned based on your public key should match the ones you inspected.

![20](../assets/accounts/pubkey-2.png)

:::note

You may have to scroll down to the bottom of the menu to find the Substrate address based on the
menu listings. You will notice that many networks that also use the same Substrate address.

:::

You can verify your public key verification by recalling that Polkadot addresses start with a '1',
whereas Substrate addresses generally start with a '5' (Kusama addresses start with a capital
letter). See [Addresses](learn-accounts.md#address-format) for more details.

Furthermore, the [Utility Scripts](https://github.com/w3f/utility-scripts) can be referenced for how
the verification is performed:
[pubkeyToAddress.js](https://github.com/w3f/utility-scripts/blob/master/src/misc/pubkeyToAddress.js)
demonstrates how a single public key interprets a Polkadot, Substrate, or Kusama address.

## Portability

Portability is the ability to use a mnemonic phrase or seed across multiple wallets.

Most wallets generate a mnemonic phrase for users to back up their wallets and generate a private
key from the mnemonic. Not all wallets use the same algorithm to convert from mnemonic phrase to
private key, which affects the ability to use the same mnemonic phrase in multiple wallets. Wallets
that use different measures will arrive at a different set of addresses from the exact mnemonic
phrase.

:::danger Not all wallets use the same algorithm to convert from mnemonic phrase to private key

[Subkey](https://docs.substrate.io/reference/command-line-tools/subkey/) and Polkadot-JS based
wallets use the BIP39 dictionary for mnemonic generation, but use the entropy byte array to generate
the private key, while full BIP39 wallets (like Ledger) use 2048 rounds of PBKDF2 on the mnemonic.
The same mnemonic may generate different private keys on other wallets due to the various
cryptographic algorithms used. See
[Substrate BIP39 Repo](https://github.com/paritytech/substrate-bip39) for more information.

:::

Portability depends on several factors:

- Derivation path
- Mnemonic format
- Seed derivation
- Signature scheme

To use the exact mnemonic across multiple wallets, ensure they follow compatible methods for
generating keys and signing messages. If you are still looking for understandable documentation,
contact the project maintainers.

|                         | Mnemonic Format | Derivation Path | Seed Derivation |      Signature Support      |
| :---------------------- | :-------------: | :-------------: | :-------------: | :-------------------------: |
| Polkadot{.js} Extension |    Standard     |  User-Defined   |      BIP32      |           sr25519           |
| Polkadot-JS Apps        |   Standard\*    |  User-Defined   |      BIP32      | sr25519, ed25519, secp256k  |
| Ledger                  |      BIP39      |  BIP44&dagger;  |  BIP32&Dagger;  |        ed25519&sect;        |
| Subkey                  |   Standard\*    |  User-Defined   |      BIP32      | sr25519, ed25519, secp256k1 |

\* Ed25519 keys have [limited compatibility](https://github.com/paritytech/substrate-bip39) with
BIP39.

&dagger; [BIP44 Registry](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)

&Dagger; Ed25519 and BIP32 based on
[Khovratovich](https://github.com/LedgerHQ/orakolo/blob/master/papers/Ed25519_BIP%20Final.pdf)

&sect; Sr25519 planned

## Derivation Paths

If you want to create and manage several accounts on the network using the same seed, you can use
derivation paths. We can think of the derived accounts as child accounts of the root account created
using the original mnemonic seed phrase.

### Soft and Hard Derivation

A soft derivation allows someone to potentially "go backward” to figure out the initial account's
private key if they know the derived account's private key. It is also possible to determine that
different accounts generated from the same seed are linked to that seed. A hard derivation path does
not allow either of these - even if you know a derived private key, it's not feasible to figure out
the private key of the root address, and it's impossible to prove that the first account is linked
with the second. These derivation methods have their use cases, given that the private keys for all
the derived accounts are fully secure. Unless you have a specific need for a soft derivation, it is
recommended to generate the account using a hard derivation path.

Many {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} key generation tools support
hard and soft derivation. For instance, if you intend to create an account to be used on the
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} chain, you can derive a **hard key**
child account using **//** after the mnemonic phrase.

```
'caution juice atom organ advance problem want pledge someone senior holiday very//0'
```

and a **soft key** child account using **/** after the mnemonic phrase

```
'caution juice atom organ advance problem want pledge someone senior holiday very/0'
```

If you want to create another account using the Polkadot chain using the same seed, you can change
the number at the end of the string above. For example, `/1`, `/2`, and `/3` will create different
derived accounts.

You can use any letters or numbers in the derivation path as long as they make sense to you; they do
not have to follow any specific pattern. You may combine multiple derivations in your path, as well.
For instance, `//bill//account//1` and `//john/polkadot/initial` are both valid. To recreate a
derived account, you must know both the seed and the derivation path, so you should either use a
well-defined sequence (e.g. //0, //1, //2...) or be sure to write down any derivation paths you use.

See the [Subkey documentation](https://docs.substrate.io/reference/command-line-tools/subkey/) for
details and examples of derivation path formats. The Polkadot-JS Apps and Extension and Parity
Signer support custom derivation paths using the same syntax as Subkey.

Some wallets will automatically add derivation paths to the end of the generated mnemonic phrase.
This will generate separate seeds for different paths, allowing separate signing keys with the same
mnemonic, e.g. `<mnemonic phrase>//polkadot` and `<mnemonic phrase>//kusama`. Although you may
correctly save the mnemonic phrase, using it in another wallet will generate the same addresses only
if both wallets use the same derivation paths.

Polkadot and Kusama both have paths registered in the
[BIP44 registry](https://github.com/satoshilabs/slips/blob/master/slip-0044.md).

:::warning

You must have the _parent_ private key and the derivation path to arrive at the key for an address.
Only use custom derivation paths if you are comfortable with your knowledge of this topic.

:::

### Password Derivation

There is an additional type of derivation called password derivation. On Polkadot you can derive a
**password key** account using **///** after the mnemonic phrase

```
'caution juice atom organ advance problem want pledge someone senior holiday very///0'
```

In this type of derivation, if the mnemonic phrase leaks, accounts cannot be derived without the
initial password. In fact, for soft- and hard-derived accounts, if someone knows the mnemonic phrase
and the derivation path, they will have access to your account. For password-derived accounts, the
password is applied on the derivation path. You can know the mnemonic phrase and the derivation
path, but without the password, it is impossible to access the account. In mathematical terms, if we
have a `written derivation path` and a `password`, we can calculate the `real derivation path` as
`f(written derivation path, password)`, where `f` is a function. We can then calculate the
`account key pair` using `f(seed, real derivation path)`. Unlike hard and soft derivations that can
be mixed, only a single password should be specified per derivation.

:::info

Password-derived account are as secure as the chosen password.

:::

### Account Derivation on [Ledger](../general/ledger.md) Live

Ledger Live will only show the main account with BIP44 path 44'/354'/0'/0'/0'. This means that if
you created a derived account with a derivation path 44'/354'/0'/0'/1' on a wallet or extension, it
will not be displayed on the Ledger Live App. Consequently, it is not possible to transact with
derived accounts using the Ledger Live App, but it is possible to do so using Polkadot-JS. Check
[the accounts page](../learn/learn-accounts.md) for more information about derived accounts and
derivation paths.

{{ kusama: Note that you cannot import Kusama Ledger accounts in Ledger Live. To see Kusama account balances, you must import your ledger account into a [**wallet**](./wallets). :kusama }}

### Account Derivation on [Subkey](#creating-accounts-with-subkey) and [Polkadot Vault](../general/polkadot-vault.md)

The Subkey tool and Polkadot Vault App use the following Polkadot Standard Hard Derivation scheme:

- `//network` as the primary account for `network`, named according to `network`'s named chain
  specification
  - `//network//0`, `//network//1`, ... as the secondary high-security accounts for `network`

For example, the Vault app will generate a new account from a `SEED PHRASE`, and for each network
will create a derived child account from that seed. For the default networks Polkadot, Kusama and
Westend the derivation path will be:

- `SEED PHRASE//polkadot` for Polkadot, with `SEED PHRASE//polkadot//0` as the first secondary
  high-security account
- `SEED PHRASE//kusama` for Kusama, with `SEED PHRASE//kusama//0` as the first secondary
  high-security account
- `SEED PHRASE//westend` for Westend, with `SEED PHRASE//westend//0` as the first secondary
  high-security account

Additionally, although it is not strictly necessary, users can adopt the following good practice
scheme:

- `//network//pub` as the primary high-security public account for `network` (the one the user is
  happy to be associated with their "real" ID)
  - `//network//pub//0`, `//network//pub//0`, ... as the secondary high-security public accounts for
    `network`
- `//network//hot` as the primary low-security account for `network` (the one whose secret key the
  user exports from the Vault app to carry on an internet-connected device)
  - `//network//hot//0`, `//network//hot//1`, ... as the secondary low-security accounts for
    `network`

:::info

For more information about account derivation best practices, see
[this post](https://forum.polkadot.network/t/polkadot-standards-proposal-psp-to-define-hierarchical-deterministic-hd-key-derivation-paths/2941/2)
on the Polkadot Forum.

:::

## System Accounts

As the word suggests, system accounts are used by the system. They are used, for example, for the
treasury, crowdloans, and nomination pools. From the point of view of the runtime, these accounts
are like any other account on-chain. These special system accounts are just public keys, with the
private key being unknown (and unattainable). So, that means that only the pallet itself can
interact with this account. These accounts can never issue a signed
[extrinsic](./learn-extrinsics.md) since they do not have a private key.

:::info Explore System Accounts

Treasury account address -
{{ polkadot: `13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB` :polkadot }}{{ kusama: `F3opxRbN5ZbjJNU511Kj2TLuzFcDq9BGduA9TgiECafpg29` :kusama }}

You can view the existing system accounts on
[Subscan](https://polkadot.subscan.io/account_list?role=module).

:::

Let us take a look at how system accounts are generated under the hood. For instance, to generate
the treasury account, the raw bytes of the strings "modl" and "py/trsry" are combined to create the
`AccountID`. For more information, check the post on Substrate StackExchange on
[Treasury accounts](https://substrate.stackexchange.com/questions/536/how-do-treasury-accounts-compare-to-end-user-accounts-in-frame).
Similarly, to generate the crowdloan account, the raw bytes of the strings "modl" and "py/cfund"
along with the fund index are combined to create the `AccountID`. Similar logic applies to
nomination pool and parachain accounts as well.

## Indices

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} addresses can have indices. An index
is like a short and easy-to-remember version of an address. Claiming an index requires a deposit of
{{ polkadot: <RPC network="polkadot" path="consts.indices.deposit" defaultValue={100000000000} filter="humanReadable"/> :polkadot }}{{ kusama: <RPC network="kusama" path="consts.indices.deposit" defaultValue={33333333300} filter="humanReadable"/> :kusama }}
that is released when the index is cleared. Any index can be claimed if it is not taken by someone
else.

But what if an account gets reaped, as explained above? In that case, the index is emptied. In other
words, the slot frees up again, making it available for anyone to claim. It is possible to _freeze_
an index and permanently assign it to an address. **This action consumes a deposit, and the index
will be permanently bound to the address with no option to release it.**

:::note Lookup Account Index on-chain

When someone shares their account index, their actual account address on-chain can be looked up
through Polkadot-JS Apps UI > Developer > Chain state > Storage and selecting state query on indices
pallet for the account corresponding to the index.

:::

Here is an example snapshot that shows how to lookup the corresponding account address of the
account index 1988 on
[Westend network (Polkadot Test Network)](../maintain/maintain-networks.md#westend-test-network),
using Polkadot-JS Apps UI. The output shows the account address, deposit amount, and a boolean flag
indicating whether this is claimed permanently.

![query account index](../assets/accounts/query-index.png)

Submit a `claim` extrinsic to the `indices` pallet to register an index. The easiest way to do this
is via Polkadot-JS UI through the _Developer -> Extrinsics_ menu:

![Indices extrinsics](../assets/accounts/index.png)

To find available indices to claim on Polkadot or Kusama,
[this helper tool may come in handy](https://www.shawntabrizi.com/substrate-js-utilities/indices/).

For keeping the index permanently, you can follow up with a `freeze` extrinsic as mentioned above.

## Creating Accounts with Subkey

[Subkey](https://github.com/paritytech/substrate/tree/master/bin/utils/subkey) is recommended for
technically advanced users comfortable with the command line and compiling Rust code. Subkey lets
you generate keys on any device that can compile the code. Subkey may also be useful for automated
account generation using an air-gapped device. It is not recommended for general users. Follow the
instructions in the
[Subkey documentation](https://docs.substrate.io/reference/command-line-tools/subkey/).

:::info

For guidelines about how to create an account using Subkey, see
[**this video tutorial**](https://youtu.be/SWfE_EwxgIU) and visit
[**this support article**](https://support.polkadot.network/support/solutions/articles/65000180519-how-to-create-an-account-in-subkey).

:::

## Using ENS with DOT/KSM accounts

ENS (Ethereum Name Service) is a distributed and open system of smart contracts on the Ethereum
blockchain which allows users to claim domain names like `bruno.eth`.

The ENS is equivalent to a DNS (Domain Name System) domain. Instead, it offers a decentralized and
secure way to translate text via smart contracts. Supporting wallets can then allow senders to input
ENS domains instead of long and unwieldy addresses. This prevents phishing, fraud, and typos and
adds a layer of usability to the regular wallet user experience.

:::note

You will need an ENS name and an Ethereum account with some ether to follow along with this guide.
To register an ENS name, visit the [ENS App](https://app.ens.domains) or any number of subdomain
registrars like [Nameth](https://nameth.io). Note that if you're using an older ENS name, you should
make sure you're using the
[new resolver](https://medium.com/the-ethereum-name-service/ens-registry-migration-is-over-now-what-a-few-things-to-know-fb05f921872a).
Visiting the ENS App will warn you about this. You will also need some way to use your Ethereum
address - following this guide on a personal computer is recommended. Wallets like
[Frame](https://frame.sh/) and [Metamask](https://metamask.io) are safe and will make interacting
with the Ethereum blockchain through your browser very easy.

:::

Despite living on the Ethereum blockchain, the ENS system has multi-chain support. In this guide,
you'll go through the process of adding a KSM and DOT address to ENS. We cover both KSM and DOT to
show two different approaches.

:::note

DOT can currently only be added using the Resolver method. KSM can be added through both methods are
described below.

:::

This guide is also available in video format [on YouTube](https://youtu.be/XKjZk-5_mQc).

### Adding via the UI

The [ENS App](https://app.ens.domains) allows an ENS domain owner to inspect all records bound to
the domain, and to add new ones.

![bruno.eth domain name in the ENS application](../assets/ens/01-min.png)

In the example above, the domain `bruno.eth` has an Ethereum and a Bitcoin address attached. Let's
attach a KSM account. First, click the `[+]` icon in the Records tab.

![The plus icon in the records tab](../assets/ens/02-min.png)

Then, pick "Other Addresses", "KSM", and input the Kusama address:

![Inputs needed to register a KSM address](../assets/ens/03-min.png)

After clicking Save, your Ethereum wallet will ask you to confirm a transaction. Once processed, the
record will show up on the domain's page:

![KSM address now visible in bruno.eth records](../assets/ens/04-min.png)

The exact process applies to adding your DOT address.

Once the transaction is confirmed, your address will be bound to your ENS domain.

### Wallet Support

There is no wallet support for ENS names for either KSM or DOT at this time, but the crypto
accounting and portfolio application [Rotki](https://rotki.com/) does support KSM ENS resolution.

### Relevant links

- [ENS docs](https://docs.ens.domains/)
- [ENS Multi-chain announcement](https://medium.com/the-ethereum-name-service/ens-launches-multi-coin-support-15-wallets-to-integrate-92518ab20599)
- [Address encoder](https://github.com/ensdomains/address-encoder)
- [Namehash calculator](https://swolfeyes.github.io/ethereum-namehash-calculator/)
- [Address to pubkey converter](https://www.shawntabrizi.com/substrate-js-utilities/)

## Transferring Polkadot-JS Apps Accounts/Addresses From One Computer to Another

:::caution

This will overwrite existing accounts with the same pubkey on your new computer. This generally
should not make a difference (since it can still access the same account), but it might if you have
e.g. an account that was stored externally in the extension on the old computer but was created
directly in the browser on the new one.

:::

This has been tested on Brave and Chrome, but not other browsers.

1. Go to Polkadot-JS Apps
2. Go to JavaScript console on the browser (Available in Developer Tools)
3. Type in the command:

```
JSON.stringify(localStorage)
```

4. Copy and paste the returned string to a text editor and save the file.
5. Check that the string you pasted begins and ends with a tick mark ('). If not, add one to the
   beginning and end.
6. Save and send that file with the copied string to the new computer.
7. On the new computer, go to Polkadot-JS Apps
8. Open the Javascript console on the browser (Available in Developer Tools)
9. Set a variable raw equal to the string from the text file

```
raw = ... copy-pasted json from original computer ...
```

10. Run the following code on the console:

```
accounts = JSON.parse(raw);
for (var key in accounts) {
    if (accounts.hasOwnProperty(key)) {
        val = JSON.stringify(accounts[key]).replace(/\\/g,'').slice(1,-1);
        console.log(key + " -> " + val);
        localStorage.setItem(key, val);
    }
}
```

11. Refresh Polkadot-JS App browser and check the Accounts and Addresses pages. All of your accounts
    and addresses should now be available.



---
id: learn-account-multisig
title: Multi-Signature Accounts
sidebar_label: Multi-Signature Accounts
description: Multi-signature Accounts on Polkadot.
keywords: [account, multisig, polkadot account, polkadotjs, multix]
slug: ../learn-account-multisig
---

:::info Mulisig Apps

See the [multisig apps](../general/multisig-apps.md) page for more information about user-friendly
tools about multi-signature accounts.

:::

It is possible to create multi-signature accounts (multisig) in Substrate-based chains. A multisig
is composed of one or more addresses and a threshold. The threshold defines how many signatories
(participating addresses) need to agree on submitting an extrinsic for the call to be successful.

For example, Alice, Bob, and Charlie set up a multisig with a threshold of 2. This means Alice and
Bob can execute any call even if Charlie disagrees with it. Likewise, Charlie and Bob can execute
any call without Alice. A threshold is typically a number smaller than the total number of members
but can also be equal to it, which means they all have to agree.

Multi-signature accounts have several uses:

- securing your stash: use additional signatories as a 2FA mechanism to secure your funds. One
  signer can be on one computer, and another can be on another or in cold storage. This slows down
  your interactions with the chain but is orders of magnitude more secure.
- board decisions: legal entities such as businesses and foundations use multisigs to govern over
  the entity's treasury collectively.
- group participation in governance: a multisig account can do everything a regular account can. A
  multisig account could be a council member in
  {{ polkadot: Polkadot's :polkadot }}{{ kusama: Kusama's :kusama }} governance, where a set of
  community members could vote as one entity.

Multi-signature accounts **cannot be modified after being created**. Changing the set of members or
altering the threshold is not possible and instead requires the dissolution of the current multisig
and creation of a new one. As such, multisig account addresses are **deterministic**, i.e. you can
always calculate the address of a multisig by knowing the members and the threshold, without the
account existing yet. This means one can send tokens to an address that does not exist yet, and if
the entities designated as the recipients come together in a new multisig under a matching
threshold, they will immediately have access to these tokens.

---

:::info Polkadot-JS Guides

If you are an advanced user, see the
[Polkadot-JS guides about multi-signature accounts](./learn-guides-accounts-multisig.md).

:::



---
id: learn-accounts
title: Polkadot Accounts
sidebar_label: Polkadot Accounts
description: Polkadot Accounts, Account Identity, and Account Reaping.
keywords: [account, polkadot account, polkadotjs, indices, identity, reaping]
slug: ../learn-accounts
---

import RPC from "./../../components/RPC-Connection"; import Tabs from "@theme/Tabs"; import TabItem
from "@theme/TabItem"; import DocCardList from '@theme/DocCardList';

:::info User friendly wallets

Create your Polkadot accounts with any of the secure and user-friendly wallet listed on the
[Polkadot website](https://www.polkadot.network/ecosystem/wallets/).

See the [Wallets](./wallets-index) section for more information about different wallet options
available, and specifically the [wallets and extensions](../general/wallets-and-extensions.md) page,
which lists the user friendly wallet projects funded by the Polkadot/Kusama Treasuries or by the
[Web3 Foundation Grants Program](../general/grants.md).

:::

This document covers the basics of {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}
accounts. See the [Advanced Account](./learn-account-advanced.md) page for more information about
accounts such as [account derivation](./learn-account-advanced.md#derivation-paths) and
[indices](./learn-account-advanced.md#indices). For a more in-depth explanation of the cryptography
behind {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} accounts, please see the
[cryptography page](learn-cryptography.md).

<DocCardList />

## Account Address

An address is the public part of a {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}
account. The private part is the key used to access this address. The public and private parts
together make up a {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} account. You can
think of the public address of your account, like your mailbox and the private key like the key to
open that mailbox. Anybody can send mail to your mailbox, but only you can access it as only you
have access to its key. In the context of
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} accounts, anybody can send tokens to
your public address, but only you can transact with them using your private key. That is why you
should keep your private key secret.

### Mnemonic Seed Phrase

A user's account requires a private key that can sign on to one of the
[supported curves and signature schemes](../build/build-protocol-info.md#cryptography). Without a
private key, an account cannot sign anything. In
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} there are some exceptions of accounts
that do not have known private keys (i.e. keyless accounts). Such accounts are
[multi-signature accounts](./learn-account-multisig.md),
[pure proxies](./learn-proxies-pure.md#anonymous-proxy-pure-proxy), and
[system accounts](./learn-account-advanced.md#system-accounts) that are not discussed here and are
meant for an advanced audience.

A typical 12-word mnemonic seed phrase is shown below.

```
'caution juice atom organ advance problem want pledge someone senior holiday very'
```

Its corresponding _private/public keypair_ is also shown.

```
Secret seed (Private key): 0x056a6a4e203766ffbea3146967ef25e9daf677b14dc6f6ed8919b1983c9bebbc
Public key (SS58): 5F3sa2TJAWMqDhXG6jhV4N8ko9SxwGy8TpaNS1repo5EYjQX
```

Polkadot default address format is the `MultiAddress` type. This means the same mnemonic phrase will
generate public keys for different parachains. For more information, see the
[Address Format](./learn-account-advanced.md#address-format) section on the
[Advanced Account](./learn-account-advanced.md) page.

### Account Generation

Usually, there are two ways of generating a mnemonic seed:

- On a "hot" device, i.e. a device that is connected to the internet
- On a "cold" device, i.e. a device that is not (and ideally will never be) connected to the
  internet

Hot wallets are susceptible to a wide range of attacks, so it is recommended to use cold wallets
when dealing with non-trivial amounts of funds.

Generating a mnemonic seed on a browser extension or a mobile application will create a hot key or
hot wallet. Create your Polkadot accounts with a secure and user-friendly wallet listed on the
[Polkadot website](https://www.polkadot.network/ecosystem/wallets/). See also the
[Wallets](./wallets-index) section for more information about wallets and the
[wallets and extensions](../general/wallets-and-extensions.md) page for wallets and browser
extensions funded by the Polkadot/Kusama Treasuries or by the
[Web3 Foundation Grants Program](../general/grants.md).

Cold keys are generated on special devices such as those provided by [Ledger](../general/ledger.md).
Additionally, you can generate your account using the [Polkadot Vault](../general/polkadot-vault.md)
mobile app (you need a dedicated air-gapped Android or iOS-compatible smartphone that you are
comfortable using only for Polkadot Vault), or a dedicated hardware implementation of Polkadot Vault
such as [the Kampela Signer](https://www.kampe.la/).

Usually, browser extensions and mobile devices have options to securely import accounts from cold
wallets. Note that the private keys of those accounts will remain on the cold wallet, meaning that
you will always need the device to sign any transaction. Exceptions exist where you can generate hot
wallet based [proxy accounts](./learn-proxies.md) and sign on behalf of a cold wallet account
without connecting the cold device. This is practical, especially for transactions made frequently.

### Backing Up Accounts

Depending on what software you use to access your account, there are various ways to back up and
restore your account. It is a good idea to back your information up and keep it secure. In general,
as long as you know how you created your account and have the mnemonic seed phrase or the JSON
backup file (and password) stored securely, you can restore your account.

## Existential Deposit and Reaping

:::info

Visit
[**this support page**](https://support.polkadot.network/support/solutions/articles/65000168651-what-is-the-existential-deposit-)
for more information about existential deposit.

:::

When you generate an account (address), you only generate a _key_ that lets you access it. The
account does not exist yet on-chain. For that, it needs the existential deposit of
{{ polkadot: <RPC network="polkadot" path="consts.balances.existentialDeposit" defaultValue={10000000000} filter="humanReadable"/>. :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.balances.existentialDeposit" defaultValue={333333333} filter="humanReadable"/>. :kusama }}

Having an account go below the existential deposit causes that account to be _reaped_. The account
will be wiped from the blockchain's state to conserve space, along with any funds in that address.
You do not lose access to the reaped address - as long as you have your private key or recovery
phrase, you can still use the address - but it needs a top-up of another existential deposit to be
able to interact with the chain.

Transaction fees cannot cause an account to be reaped. Since fees are deducted from the account
before any other transaction logic, accounts with balances _equal to_ the existential deposit cannot
construct a valid transaction. Additional funds will need to be added to cover the transaction fees.

Here's another way to think about existential deposits. Ever notice those `Thumbs.db` files on
Windows or `.DS_Store` files on Mac? Those are junk; they serve no specific purpose other than
making previews a bit faster. If a folder is empty saved for such a file, you can remove the folder
to clear the junk off your hard drive. That does not mean you will lose access to this folder
forever - you can always recreate it. You have the _key_, after all - you're the computer's owner.
It just means you want to keep your computer clean until you maybe need this folder again and
recreate it. Your address is like this folder - it gets removed from the chain when nothing is in it
but gets put back when it has the existential deposit.

## Account Balance Types

In {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} there are different types of
balance depending on the account activity. Different balance types indicate whether your balance can
be used for transfers, to pay fees, or must remain frozen and unused due to an on-chain requirement.
Below is an example that displays different balance types on the
[Polkadot-JS UI (wallet)](../general/polkadotjs-ui.md) of a Kusama account (note that the balance
types are the same for a Polkadot account).

![account_balance_types](../assets/account-balance-types.png)

- The **total** balance indicates the total number of tokens in the account. Note that this number
  does not necessarily correspond to the tokens you can transfer. In the example, the total number
  of tokens is 0.6274 KSM. The **transferrable** balance indicates the number of free tokens to be
  transferred. This is calculated by subtracting the number of _locked_ and _reserved_ tokens from
  the total number of tokens. Locked funds correspond to tokens used in staking, governance, and
  vested transfers (see below). In the example, the transferrable balance is 0.0106 KSM.
- The **vested** balance indicates tokens sent to the account and released with a specific time
  schedule. The account owns the tokens, but they are _locked_ and become available for transfer
  after a specific number of blocks. In the example, the vested balance is 0.25 KSM.
- The **bonded** balance indicates the number of tokens that are _locked_ for on-chain participation
  to staking. In the example, the bonded balance is 0.4 KSM.
- The **democracy** balance indicates the number of tokens that are _locked_ for on-chain
  participation in democracy (i.e. voting for referenda and council). In the example, the democracy
  balance is 0.4 KSM.
- The **redeemable** balance indicates the number of tokens ready to be unlocked to become
  transferrable again. Those tokens already went through the unbonding period. In this case, the
  redeemable balance is 0.1 KSM.
- The **locked** balance indicates the number of frozen tokens for on-chain participation to staking
  and democracy or for vested transfers. **Locks do not stack**, which means that if you have
  different locks the total locked balance is not the addition of all single locks. Instead, **the
  biggest lock decides the total locked balance**. In the example, the locked balance is 0.55 KSM
  because the biggest lock is on democracy (0.55 KSM).
- The **reserved** balance indicates the number of tokens that are frozen for on-chain activity
  other than staking, governance, and vested transfers. Such activity can be setting an identity or
  a proxy. Reserved funds are held due to on-chain requirements and can usually be freed by taking
  some on-chain action. For example, the "Identity" pallet reserves funds while an on-chain identity
  is registered, but by clearing the identity, you can unreserve the funds and make them free again.
  The same applies to proxies. The idea is that those actions require some network memory usage that
  is not given for free. In the example, we created a governance proxy, and the reserved funds for
  this are 0.0668 KSM.

---

:::info Polkadot-JS Guides

If you are an advanced user, see the
[Polkadot-JS guides about accounts](./learn-guides-accounts-index).

:::


---
id: learn-architecture
title: Architecture
sidebar_label: Architecture
description: Key Components to Polkadot's Architecture.
keywords: [polkadot, components, architecture]
slug: ../learn-architecture
---

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} is a heterogeneous multichain with
shared security and interoperability.

## Relay Chain

The Relay Chain is the central chain of
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}. All validators of
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} are staked on the Relay Chain in DOT
and validate for the Relay Chain. The Relay Chain is composed of a relatively small number of
transaction types that include ways to interact with the governance mechanism, parachain auctions,
and participating in NPoS. The Relay Chain has deliberately minimal functionality - for instance,
smart contracts are not supported. The main responsibility is to coordinate the system as a whole,
including parachains. Other specific work is delegated to the parachains, which have different
implementations and features.

## [Parachain](learn-parachains.md) and [Parathread](learn-parathreads.md) Slots

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} can support a number of execution
slots. These slots are like cores on a computer's processor (a modern laptop's processor may have
eight cores, for example). Each one of these cores can run one process at a time.
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} allows these slots using two
subscription models: parachains and parathreads. Parachains have a dedicated slot (core) for their
chain and are like a process that runs constantly. Parathreads share slots amongst a group, and are
thus more like processes that need to be woken up and run less frequently.

Most of the computation that happens across the
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} network as a whole will be delegated
to specific parachain or parathread implementations that handle various use cases.
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} places no constraints over what
parachains can do besides that they must be able to generate a proof that can be validated by the
validators assigned to the parachain. This proof verifies the state transition of the parachain.
Some parachains may be specific to a particular application, others may focus on specific features
like smart contracts, privacy, or scalability &mdash; still, others might be experimental
architectures that are not necessarily blockchain in nature.

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} provides many ways to secure a slot
for a parachain for a particular length of time. Parathreads are part of a pool that shares slots
and must-win auctions for individual blocks. Parathreads and parachains have the same API; their
difference is economic. Parachains will have to reserve
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} for the duration of their slot lease;
parathreads will pay on a per-block basis. Parathreads can become parachains, and vice-versa.

### [Shared Security](learn-parachains.md)

Parachains connected to the {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} Relay
Chain all share in the security of the Relay Chain.
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} has a shared state between the Relay
Chain and all of the connected parachains. If the Relay Chain must revert for any reason, then all
of the parachains would also revert. This is to ensure that the validity of the entire system can
persist and no individual part is corruptible.

The shared state ensures that the trust assumptions when using
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} parachains are only those of the
Relay Chain validator set and no other. Since the validator set on the Relay Chain is expected to be
secure with a large amount of stake put up to back it, parachains should benefit from this security.

## Interoperability

### [XCM](learn-xcm)

XCM, short for cross-consensus message, is a format and not a protocol. The format does not assume
anything about the receiver or senders consensus mechanism, it only cares about the format in which
the messages must be structured in. The XCM format is how parachains will be able to communicate
with one another. Different from XCMP, which is short for cross-chain messaging protocol, XCM is
what gets delivered, and XCMP is the delivery mechanism. The best way to learn more about XCM is by
reading the [specification](https://github.com/paritytech/xcm-format).

### [Bridges](learn-bridges.md)

A blockchain [bridge](../general/glossary.md#bridge) is a connection that allows for arbitrary data
to transfer from one network to another. These chains are interoperable through the bridge but can
exist as standalone chains with different protocols, rules, and governance models. In
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}, bridges connect to the Relay Chain
and are secured through the {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} consensus
mechanism, maintained by [collators](#collators).

Polkadot uses bridges to bridge the future of Web 3.0, as bridges are fundamental to
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}'s interoperable architecture by
acting as a [secure and robust] communication channel for chains in isolation.

# Main Actors

## Validators

[Validators](../general/glossary.md#validator), if elected to the validator set, produce blocks on
the Relay Chain. They also accept proofs of valid state transition from collators and receive
staking rewards in return.

Validators are required to keep enough parachain blocks available for later use in their local
storage. Those blocks are retrievable by peers who lack that information, so that they can reliably
confirm the issued validity statements about parachain blocks. The
[Availability & Validity](https://spec.polkadot.network/#chapter-anv) (AnV) protocol consists of
multiple steps for successfully upholding those responsibilities.

## Nominators

[Nominators](../general/glossary.md#nominator) bond their stake to particular validators in order to
help them get into the active validator set and thus produce blocks for the chain. In return,
nominators are generally rewarded with a portion of the staking rewards from that validator.

## Collators

[Collators](../general/glossary.md#collator) are full nodes on both a parachain and the Relay Chain.
They collect parachain transactions and produce state transition proofs for the validators on the
Relay Chain. They can also send and receive messages from other parachains using XCMP.

Parachain blocks themselves are produced by collators, whereas the relay chain validators only
verify their validity (and later, their availability).

---

## Whiteboard Series

For a video overview of the architecture of
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} watch the video below for the
whiteboard interview with W3F researcher Alistair Stewart:

[![Architecture Overview](https://img.youtube.com/vi/xBfC6uTjvbM/0.jpg)](https://www.youtube.com/watch?v=xBfC6uTjvbM)


---
id: learn-assets
title: Asset Hub
sidebar_label: Asset Hub
description: Fungible Tokens and NFTs on Polkadot.
keywords: [assets, fungible, non-fungible, asset hub, statemine, statemint]
slug: ../learn-assets
---

import RPC from "./../../components/RPC-Connection";

Assets in the {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} network can be
represented on several chains. They can take many forms, from a parachain's native token to on-chain
representations of off-chain reserves. This page focuses on the latter, namely assets issued by a
creator (e.g. rights to audited, off-chain reserves held by the creator, or art issued as an NFT).

The
[Asset Hub system parachain](https://www.parity.io/blog/statemint-generic-assets-chain-proposing-a-common-good-parachain-to-polkadot-governance/)
hosts data structures and logic that specialize in the creation, management, and use of assets in
the {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} network. Although other
parachains can host applications dealing with assets on the Asset Hub, the hub can be thought of as
the "home base" of assets in the network.

The Asset Hub uses {{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} as its native token. The
chain yields its governance to its parent Relay Chain and has no inflation or era-based rewards for
collators (although collators receive a portion of transaction fees). As a
[system parachain](https://polkadot.network/blog/common-good-parachains-an-introduction-to-governance-allocated-parachain-slots/),
the Asset Hub has a trusted relationship with the Relay Chain, and as such, can teleport
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} between itself and the Relay Chain. That is,
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} on the Asset Hub is just as good as
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} on the Relay Chain.

The Asset Hub does not support smart contracts. See the [Advanced](#advanced-techniques) section at
the bottom for a discussion on using proxy and multisig accounts to replicate oft-used contract
logic.

## Creation and Management

:::info Walk-through video tutorial about creating assets

See
[this technical explainer video](https://youtu.be/knNLZEyposM?list=PLOyWqupZ-WGuAuS00rK-pebTMAOxW41W8&t=63)
to learn how to create fungible assets on the Asset Hub.

:::

Anyone on the network can create assets on the Asset Hub as long as they can reserve the required
deposit of
{{ polkadot: <RPC network="statemint" path="consts.assets.assetDeposit" defaultValue={100000000000} filter="humanReadable"/> :polkadot }}
{{ kusama: <RPC network="statemine" path="consts.assets.assetDeposit" defaultValue={100000000000} filter="humanReadable"/> :kusama }}
and around
{{ polkadot: <RPC network="statemint" path="consts.assets.metadataDepositBase" defaultValue={668933304} filter="humanReadable"/> :polkadot }}
{{ kusama: <RPC network="statemine" path="consts.assets.metadataDepositBase" defaultValue={668933304} filter="humanReadable"/> :kusama }}
for the metadata. The network reserves the deposit on creation. The creator also must specify a
unique `AssetId`, an integer of type `u32`, to identify the asset. The `AssetId` should be the
canonical identifier for an asset, as the chain does not enforce the uniqueness of metadata like
"name" and "symbol". The creator must also specify a minimum balance, preventing accounts from
having dust balances.

:::info Advanced How-to Guides

See [this page](./learn-guides-assets-create.md) to learn more about creating assets using the Asset
Hub.

:::

Asset classes and instances can have associated metadata. The metadata is an array of data that the
class owner can add on-chain, for example, a link to an IPFS hash or other off-chain hosting
service. The [Uniques pallet](./learn-nft-pallets.md#uniques-pallet) also supports setting key/value
pairs as attributes to a class or instance.

An asset class has several privileged roles. The asset creator automatically takes on all privileged
roles but can reassign them after creation. These roles are:

- The **owner** can set the accounts responsible for the other three roles and set asset metadata
  (e.g. name, symbol, decimals).
- The **issuer** can mint and burn tokens to/from their chosen addresses.
- The **admin** can make force transfers as well as unfreeze accounts of the asset class.
- The **freezer** can freeze assets on target addresses or the entire asset class.

Always refer to the [**reference documentation**](https://crates.parity.io/pallet_assets/index.html)
for certainty on privileged roles.

An asset's details contain one field not accessible to its owner or admin team, **asset
sufficiency**. Only the network's governance mechanism can deem an asset as _sufficient_. A balance
of a non-sufficient asset can only exist on accounts that are on-chain (i.e. accounts having the
existential deposit of a sufficient asset). That is, a user could not keep an account on-chain by
transferring an insufficient asset to it; the account must already be on-chain by having more than
the existential deposit in {{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} (or a sufficient
asset). However, assets deemed _sufficient_ can instantiate accounts and pay for transaction fees,
such that users can transact on the Asset Hub without the need for
{{ polkadot: DOT. :polkadot }}{{ kusama: KSM. :kusama }}

:::info Transaction Fees on Polkadot-JS UI

Polkadot-JS UI
[doesn't support the functionality to pay with a sufficient asset yet](https://github.com/polkadot-js/apps/issues/7812).
When using Polkadot-JS UI, transaction fee needs to be paid in
{{ polkadot:  DOT :polkadot }}{{ kusama: KSM :kusama }}.

:::

## Fungible Assets

Fungible assets are interchangeable, i.e. one unit is equivalent to any other unit to claim the
underlying item. The Asset Hub represents fungible assets in the Assets pallet. This pallet presents
a similar interface for those familiar with the ERC20 standard. However, the logic is encoded
directly in the chain's runtime. As such, operations are not gas-metered but benchmarked upon every
release, leading to efficient execution and stable transaction fees.

### Transferring Asset Balances

:::info Walk-through video tutorial about transferring assets

See
[this technical explainer video](https://youtu.be/knNLZEyposM?list=PLOyWqupZ-WGuAuS00rK-pebTMAOxW41W8&t=326)
to learn how to transfer assets on the Asset Hub.

For Ledger users see [this video tutorial](https://youtu.be/j0O-KziV9iw) to learn how to use the
Statemine Ledger app and what its current limitations are.

:::

Users have a simple interface, namely the ability to transfer asset balances to other accounts
on-chain. As mentioned before, if the asset is not _sufficient_, then the destination account must
already exist for the transfer to succeed.

The chain also contains a `transfer_keep_alive` function, similar to that of the Balances pallet,
that will fail if execution kills the sending account.

The Asset Hub also sweeps dust balances into transfers. For example, if an asset has a minimum
balance of 10 and an account has a balance of 25, then an attempt to transfer 20 units would
transfer all 25.

:::warning Non-sufficient assets

Before transferring a non-sufficient asset, ensure the receiver account has enough funds to cover
the existential deposit and transaction fees for future transfers. Failing to do so will cause the
asset transfer to fail. The transfer will be successful for sufficient assets, but without
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} tokens, you will not be able to transfer
those assets from the receiver account through Polkadot-JS UI. The feature request to
[enable sufficient assets for transaction fee payment on Polkadot-JS UI](https://github.com/polkadot-js/apps/issues/7812)
is yet to be implemented.

:::

:::info

See
[this support article](https://support.polkadot.network/support/solutions/articles/65000181118-how-to-transfer-tether-usdt-on-statemine)
to learn more about transferring assets using the Asset Hub.

:::

### Destroying an Asset

:::info Walk-through video tutorial about destroying assets

See
[this technical explainer video](https://youtu.be/knNLZEyposM?list=PLOyWqupZ-WGuAuS00rK-pebTMAOxW41W8&t=422)
to learn how to destroy assets on the Asset Hub.

:::

To destroy an asset, go to the Polkadot-JS UI on the Asset Hub > Developer > Extrinsics. If you
created an asset without minting any unit, you could call `assets.startDestroy` and then the
`assets.finishDestroy` extrinsics specifying the asset id you want to destroy. If you created an
asset and minted some units, follow the steps below:

- `assets.freezeAsset` will freeze all assets on all accounts holding that asset id. Those accounts
  will no longer be able to transfer that asset.
- `assets.startDestroy` will start the destroying process.
- `assets.destroyApprovals` will destroy all approvals related to that asset id (if there are any
  approvals).
- `assets.destroyAccounts` will destroy all accounts related to that asset id. All asset units will
  be removed from those accounts.
- `assets.finishDestroy` will finish the destroying process. The asset id will be removed and
  available for another fungible token.

### Application Development

The Asset Hub provides an `approve_transfer`, `transfer_approved`, and `cancel_approval` interface.
Application developers can use this interface so that users can authorize the application to
effectuate transfers up to a given amount on behalf of an account.

### Cross-Chain Accounting

The Asset Hub uses a reserve-backed system to manage asset transfers to other parachains. It tracks
how much of each asset has gone to each parachain and will not accept more from a particular
parachain.

As a result of this, asset owners can use the Asset Hub to track information like the total issuance
of their asset in the entire network, as parachain balances would be included in the reserve-backed
table. Likewise, for the minting and burning of tokens, an asset's team can perform all operations
on the Asset Hub and propagate any minted tokens to other parachains in the network.

Parachains that want to send assets to other parachains should do so via instructions to the Asset
Hub so that the reserve-backed table stays up to date. For more info, see the "Moving Assets between
Chains in XCM" section of the
[article on the XCM format](https://polkadot.network/blog/xcm-the-cross-consensus-message-format/).

## Non-Fungible Assets

Unlike fungible assets, the particular instance of a [non-fungible asset (NFT)](./learn-nft.md) has
a separate meaning from another instance of the same class. The Asset Hub represents NFTs in the
[Uniques and NFTs pallets](./learn-nft-pallets.md).

Similar to the Assets pallet, this functionality is encoded into the chain. Operations are
benchmarked before each release instead of any runtime metering, ensuring efficient execution and
stable transaction fees.

### Transferring NFTs

Users can transfer their NFTs to other accounts. The chain also provides an `approve_transfer`,
`transfer_approved` and `cancel_approval` interfaces that application developers can use to allow
users to authorize an application to transfer an instance on their behalf.

## Advanced Techniques

Many asset creators on other networks use smart contracts to control privileged functions like
minting and burning. Although the Asset Hub does not have a smart contract interface, it contains
the [Multisig](https://crates.parity.io/pallet_multisig/index.html),
[Proxy](https://crates.parity.io/pallet_proxy/index.html), and
[Utility](https://crates.parity.io/pallet_utility/index.html) pallets, which will meet most account
management needs.

For example, if a team wants sign-off from two groups to perform a privileged operation, it could
create a 2-of-2 [**multisig**](./learn-account-multisig.md) from two
[**pure proxies**](./learn-proxies-pure.md#anonymous-proxy-pure-proxy), and then set members from
each group as proxies to those two accounts.


---
id: learn-async-backing
title: Asynchronous Backing
sidebar_label: Asynchronous Backing
description: A brief overview of asynchronous backing, and how it affects Polkadot's scalability.
keywords: [parachains, backing, parablock, perspective parachains, unincluded segments]
slug: ../learn-async-backing
---

import RPC from "./../../components/RPC-Connection";

:::info Learn about Parachain Consensus

To fully follow the material on this page, it is recommended to be familiar with the primary stages
of the [Parachain Protocol](./learn-parachains-protocol.md).

:::

In Polkadot, parablocks are generated by [collators](./learn-collator.md) on the parachain side and
sent to [validators](./learn-validator.md) on the relay chain side for backing.

:::info What is backing?

**Backing** refers to the process in which parablocks are verified by a subset of validators or
backing groups. It is an important step in the validation process for parablocks, as it is the first
line of defense in ensuring censorship resistance. Parablocks only need to be backed by one
validator, and as a consequence, backing does not ensure parablock validity.

:::

Backed parablocks are sent to other validators for inclusion into the relay chain. Parablocks are
included when validators have attested to having received
[erasure coded chunks](./learn-parachains-protocol.md#erasure-codes) of the parablock data. Note
[candidate receipts](#candidate-receipt) and not the parablocks themselves are included in relay
blocks (but for simplicity, we refer to parablocks as being included). When generated, parablocks
must be anchored to a relay chain block called **relay parent**. The relay parent is an input to
parablock candidate generation. It provides the necessary context to build the next parablock. Note
that the relay parent of a parablock and the relay block including that parablock are always
different.

## Synchronous Backing

Before diving into asynchronous backing, it is important to understand what synchronous backing is
and its main limitations. In synchronous backing, parablock generation is tightly coupled to the
relay chain's progression:

1. A new parablock can be produced after including the previous one (i.e., every 12 seconds).
2. Context to build the next parablock is drawn from the latest included parablock ancestor
3. The relay parent must be the latest relay chain block.

Because of (1) parablocks can be generated every other relay chain block (i.e., every 12 seconds).
Because of (2) generation of parablock `P` can only start when `P - 1` is included (there is no
[pipelining](#pipelining)). Because of (3) execution time can take maximum 0.5 seconds as parablock
`P` is rushing to be backed in the next 5.5 seconds (2 seconds needed for backing and the rest for
gossiping). Every parablock is backed in 6 seconds (one relay chain block) and included in the next
6 seconds (next relay chain block). The time from generation to inclusion is 12 seconds. This limits
the amount of data a collator can add to each parablock.

Parablock generation will choose the most recently received relay block as a relay parent, although
with an imperfect network that may differ from the true most recent relay block. So, in general, if
relay block `R` is the relay parent of parablock `P`, then `P` could be backed in `R + 1` and
included in `R + 2`.

![sync-backing](../assets/sync-backing.png)

From left to right, parablock P1 is anchored to the relay parent R0 (showed with an `x`), backed
into the relay chain block R1, and included in R2. After including P1, collators can start
generating P2 that must be anchored to the relay parent R2. Note that R2 will be the relay parent of
P2 if R2 is included on the relay chain and gossiped to the collator producing P2.

:::info Every collator also runs an attached relay chain full node

The attached relay node receives relay blocks via gossip. Then, the relay node talks to the
parachain node through the `CollationGeneration` subsystem. R2 is gossiped to the relay full node
attached to the collator producing P2. Then, `CollationGeneration` passes information about R2 to
the collator node. Finally, relay parent information from R2 informs the generation of candidate P2.

:::

Because P2 is rushing to be backed in 6 seconds into R3, collators have only 0.5 seconds to generate
it and present it to backing groups on the relay chain that will take approximately 2 seconds to
back it and some extra time for gossiping it (the whole process from collation to backing lasts 6
seconds). P2 is included in R4, which could be used as a relay parent for P3 (not shown). After 24
seconds P1 and P2 are included in the relay chain. Note how collators can start new parablocks every
12 seconds but only have 0.5 seconds to generate them.

## Asynchronous Backing

:::warning Disclaimer: Performance Measurements

Due to asynchronous backing not being fully implemented in a running production network, each
performance metric is not thoroughly tested nor guaranteed until proper benchmarking has occurred.

:::

![sync-vs-async-backing](../assets/sync-vs-async-backing.png)

In asynchronous backing, parablocks (P) are included every 6 seconds, and backing (B) and inclusion
(I) can happen within the same relay chain block (R).

### Synchronous vs. Asynchronous Backing

Below is a table showing the main differences between synchronous and asynchronous backing.

|                                            |                           Sync Backing                            |                                                                                  Async Backing                                                                                  |                   Async Backing Advantage                    |
| :----------------------------------------- | :---------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------: |
| **Parablocks included every**              |                            12 seconds                             |                                                                                    6 seconds                                                                                    |            2x more throughput or 2x less latency             |
| **Parablock's maximum generation time**    |                            0.5 seconds                            |                                                                                    2 seconds                                                                                    |                 4x more data in a parablock                  |
| **Relay parent**                           |                  Is the latest relay chain block                  |                                                                 Is not necessarily the latest relay chain block                                                                 | Collators can submit parablocks to backing groups in advance |
| **Collators can build on**                 | The most recent ancestor included in the latest relay chain block | An ancestor included in a relay chain block (not necessarily the latest), with augmented information from the latest ancestor in the [unincluded segment](#unincluded-segments) |      Collators can start building parablocks in advance      |
| **Number of unincluded parablocks**        |                             Only one                              |                                                           One, or more than one (depends on configuration parameters)                                                           |               More efficiency and scalability                |
| **Unincluded parablocks**                  |                       Cannot be re-proposed                       |                                                      Can be re-proposed if not successfully included in the first attempt                                                       |            Decrease wastage of unused blockspace             |
| **Parablock's Backing-to-inclusion time**  |                            12 seconds                             |                                                                                   12 seconds                                                                                    |                          No change                           |
| **Parablock's Inclusion-to-finality time** |                            30 seconds                             |                                                                                   30 seconds                                                                                    |                          No change                           |

In synchronous backing, collators generate parablocks using context entirely pulled from the relay
chain. While in asynchronous backing, collators use additional context from the
[unincluded segment](#unincluded-segments). Parablocks are included every 6 seconds because backing
of parablock `N + 1` and inclusion of parablock `N` can happen on the same relay chain bock
([pipelining](#pipelining)). However, as for synchronous backing, a parablock takes 12 seconds to
get backed and included, and from inclusion to finality there is an additional 30-second time
window.

Because the throughput is increased by 2x and parachains have 4x more time to generate blocks,
asynchronous backing is expected to deliver 8x more blockspace to parachains.

### Sync Backing as a special case of Async Backing

Two parameters of asynchronous backing can be controlled by
[Governance](./learn-polkadot-opengov.md):

- [`max_candidate_depth`](https://github.com/paritytech/polkadot-sdk/blob/f204e3264f945c33b4cea18a49f7232c180b07c5/polkadot/primitives/src/vstaging/mod.rs#L49):
  the number of parachain blocks a collator can produce that are not yet included in the relay
  chain.

- [`allowed_ancestry_len`](https://github.com/paritytech/polkadot-sdk/blob/f204e3264f945c33b4cea18a49f7232c180b07c5/polkadot/primitives/src/vstaging/mod.rs#L54):
  the oldest relay chain parent a parachain block can be built on top of.

Values of zero for both correspond to synchronous backing: `max_candidate_depth = 0` means there can
be only one unincluded parablock at all times, and `allowed_ancestry_len = 0` means a parablock can
be built only on the latest relay parent for that parachain. Initial values will be set to 3 (4
unincluded parablocks at all times) and 2 (relay parent can be the third last).

### Async Backing Diagram

![async-backing](../assets/async-backing.png)

The diagram assumes:

- `max_candidate_depth = 2`, meaning that there can be a maximum of three unincluded parablocks at
  all times
- `allowed_ancestry_len = 1`, meaning parablocks can be anchored to the last or second-last relay
  parent (i.e., collators can start preparing parablocks 6 seconds in advance)

From left to right, parablock P1 is backed into the relay chain block R1 and included in R2. While
P1 undergoes backing, collators can already generate P2, which will have R0 as a relay parent
(showed with an `x`). Note how R0 can also be relay parent for P1 as long as in the unincluded
segment there is a maximum of three unincluded parablocks. Parablock P2 can be backed in R2 (the
same relay block where P1 is included) and included in R3. Collators can now use up to two seconds
to generate parablocks. And so on, P3 can be generated while backing groups check P2, and P4 can be
built while P3 undergoing backing. In 24 seconds, P1 to P3 are included in the relay chain.

Note how there are always three unincluded parablocks at all times, i.e. compared to synchronous
backing there can be multiple unincluded parablocks (i.e. [pipelining](#pipelining)). For example,
when P1 is undergoing inclusion, P2 and P3 are undergoing backing. Collators were able to generate
multiple unincluded parablocks because on their end they have the
[unincluded segment](#unincluded-segments), a local storage of not-included parablock ancestors that
they can use to fetch information to build new parablocks. On the relay chain side,
[perspective parachains](#prospective-parachains) repeats the work each unincluded segment does in
tracking candidates (as validators cannot trust the record kept on parachains).

The 6-second relay chain block delay includes a backing execution timeout (2 seconds) and some time
for network latency (the time it takes to gossip messages across the entire network). The limit
collators have to generate parablocks is how long it takes to back it (i.e., 2 seconds). Collation
generation conservatively always gives itself the same time limits. If there is extra time for
collation generation and backing (i.e., more than 2s + 6s), then all that extra time is allocated to
backing (see figure). This could result in backable blocks waiting their turn at the end of the
backing step for a few extra seconds until a core frees up to back that block as of the next relay
block or some later relay block. Note a core is occupied after backing and before inclusion.

The 2-second block generation time is thus a limiter, not a system limitation. If block generation
takes >2 seconds, the unincluded segment will shrink (less unincluded parablocks), while if it takes
<2 seconds, the segment will grow (more unincluded parablocks that will need to be backed and
included). Such flexibility from the parachain side will be possible when, on the relay chain side,
there will be elastic scaling (i.e.,
[agile core usage](../general/polkadot-direction.md#agile-core-usage) and
[coretime allocation](../general/polkadot-direction.md#agile-coretime-allocation)).

## Terminology

### Candidate Receipt

Saying that a parablock has been included in a relay chain parent does not mean the entire parablock
is in the relay chain block. Instead, **candidate receipt** consisting of the hash of the parablock,
state roots, and ID info is placed on the parent block on the relay chain. The relay chain does not
access the entire state of a parachain but only the values that changed during that block and the
merkelized hashes of the unchanged values.

### Pipelining

Asynchronous backing is a feature that introduces
[pipelining](https://www.techtarget.com/whatis/definition/pipelining) to the parachain block
[generation, backing and inclusion](./learn-parachains-protocol.md). It is analogous to the logical
pipelining of processor instruction in "traditional" architectures, where some instructions may be
executed before others are complete. Instructions may also be executed in parallel, enabling
multiple processor parts to work on potentially different instructions simultaneously.

Bundles of state transitions represented as blocks may be processed similarly. In the context of
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}, pipelining aims to increase the
throughput of the entire network by completing the backing and inclusion steps for different blocks
at the same time. Asynchronous backing does not just allow for pipelining within a single pipe (or
core). It lays the foundation for a large number of pipes (or cores) to run for the same parachain
at the same time. In that way, we have two distinct new forms of parallel computation.

### Unincluded Segments

Unincluded segments are chains of candidate parablocks that have yet to be included in the relay
chain, i.e. they can contain parablocks at any stage pre-inclusion. An unincluded segment may thus
include candidates that are seconded, backable, or backed. Every parablock candidate recorded in the
unincluded segment is immediately advertised to validators to begin the backing process.

The backing process occurs on the relay chain, whereas unincluded segments live in the runtimes of
parachain collators. The core functionality that asynchronous backing brings is the ability to build
on these unincluded segments of block ancestors rather than building only on ancestors included in
the relay chain state.

The purpose of each unincluded segment is twofold:

- Make each parachain aware of when and at what depth it can build blocks that won't be rejected by
  the relay chain
- Provide critical context necessary to build parablocks with parent blocks that have yet to be
  included. The unincluded segment is all about building parablocks.

### Prospective Parachains

The purpose of
[prospective parachains](https://paritytech.github.io/polkadot/book/node/backing/prospective-parachains.html)
is twofold:

- Keep track of parablocks that have been submitted to backers but have yet to be included. This
  includes tracking the full unincluded ancestry of each parablock, without which it wouldn't be
  possible to verify their legitimacy.

- Look up and provide candidates which are children of the most recently included parablock for each
  parachain. These are taken as inputs to the availability process. Prospective parachains is all
  about tracking, storing, and providing candidates to the availability/inclusion step.

Prospective parachains essentially repeats the work each [unincluded segment](#unincluded-segments)
does in tracking candidates. Validators cannot simply trust the availability or validity of records
kept on parachains. Prospective parachains is the relay chain's record of all parablock candidates
undergoing the backing and inclusion process. It is the authoritative gatekeeper for parablock
validity. Whereas the unincluded segment is a local record that allows parachains to produce blocks
that comply with the rules prospective parachains later enforces.

The unincluded segment lives in the parachain runtime, so it doesn't know or care about forks/other
parachains. Prospective parachains lives in the relay chain client. So it has to simultaneously keep
track of candidates from all forks of all parachains. It is as if you folded the unincluded segments
from every fork of every parachain into one giant data structure. When you fold unincluded segments
representing different chain forks together, they create a tree structure. Hence the term
[**fragment tree**](https://paritytech.github.io/polkadot/book/node/backing/prospective-parachains.html#fragment-trees).

A single unincluded segment tells a collator whether it can build on top of one fork of one
parachain. Prospective parachains tells a validator whether it should accept blocks built on top of
any fork from any parachain.

A parablock stops being a prospective parablock when it is included on chain. At that point
prospective parachains does not have to care about it anymore. Alternatively, a parablock's relay
parent can get too old before that parablock is included, in which case prospective parachains can
throw away the candidate.

## Learn More

The information provided here is subject to change; keep up to date using the following resources:

- [Polkadot Roadmap Roundup](https://polkadot.network/blog/polkadot-roadmap-roundup) - Article by
  Rob Habermeier, Polkadot founder, details the plans for Polkadot for 2023.
- [Asynchronous Backing Spec & Tracking Issue](https://github.com/paritytech/polkadot/issues/3779) -
  The implementation tracking issue for asynchronous backing
- [Prospective Parachains Subsystem - The Polkadot Parachain Host Implementers' Guide](https://paritytech.github.io/polkadot/book/node/backing/prospective-parachains.html)
- Chapter 6.11. from Polkadot Blockchain Academy (PBA) lecture material:
  [Asynchronous Backing (Shallow)](https://polkadot-blockchain-academy.github.io/pba-book/polkadot/async-backing-shallow/page.html)
- Chapter 6.15. from PBA lecture material:
  [Asynchronous Backing (Deep)](https://polkadot-blockchain-academy.github.io/pba-book/polkadot/async-backing-deep/page.html)
- Polkadot Blog Post -
  [Asynchronous Backing: Elevating Polkadot's Performance and Scale](https://www.polkadot.network/blog/elevating-polkadots-performance-and-scale-with-asynchronous-backing)



---
id: learn-auction
title: Parachain Slot Auctions
sidebar_label: Parachain Slot Auctions
description: Polkadot's Parachain Slot Auction Mechanism.
keywords: [auction, slot auctions, parachain, bidding]
slug: ../learn-auction
---

import RPC from "./../../components/RPC-Connection";

import AuctionSchedule from "./../../components/Auction-Schedule";

For a [parachain](learn-parachains.md) to be added to
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} it must inhabit one of the available
parachain slots. The number of parachain slots is not unbounded on
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}, as only a limited number are
available. A limited number of slots are unlocked every few months through on-chain governance. If a
parachain wants to have guaranteed block inclusion at every Relay Chain block, it must acquire a
parachain slot. The development of
[on-demand parachains](https://forum.polkadot.network/t/on-demand-parachains/2208) (previously
referred to as parathreads) is in progress.

The parachain slots will be leased according to an unpermissioned
[candle auction](https://en.wikipedia.org/wiki/Candle_auction), with several alterations related to
improving security while operating on a blockchain. See [Rationale](#rationale) for additional
details.

[![A Beginner's guide to Parachain Slot Auctions](https://img.youtube.com/vi/i5-Rw2Sf7-w/0.jpg)](https://youtu.be/i5-Rw2Sf7-w)

## Auction Schedule

{{ polkadot: <AuctionSchedule network="polkadot" /> :polkadot }}
{{ kusama: <AuctionSchedule network="kusama" /> :kusama }}

## Mechanics of a Candle Auction

Candle auctions are a variant of open auctions where bidders submit bids that are increasingly
higher. The highest bidder at the conclusion of the auction is considered the winner.

Candle auctions were originally employed in the 16th century for the sale of ships. The name is
derived from the system by which the auction length was determined. The phrase "inch of a candle"
refers to the length of time required for a candle to burn down 1 inch. When the flame extinguishes
and the candle goes out, the auction terminates and the standing bid at that point in time prevails
the winner.

When candle auctions are used online, they require a random number to decide the moment of
termination. Parachain slot auctions differ slightly from a normal candle auction in that they do
not randomly terminate the auction. Instead, they run for an entire fixed duration and the winner is
randomly chosen retroactively.

The candle auction on {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} is split into
two parts:

1. The _opening period_ which is in effect immediately after the auction starts. This period lasts
   for one day and eighteen hours and serves as a buffer time for parachain candidates to setup
   their initial bids, and likely start executing their strategy on how to win the slot auction.
   During the opening phase, bids will continue to be accepted, but they do not have any effect on
   the outcome of the auction.

2. The _ending period_ follows the opening period for five additional days, where the auction is
   subject to end based on the candle auction mechanism.

The auction’s ending time can occur any time within the ending period. This time is automatically
and randomly chosen by the [Verifiable Random Function (VRF)](./learn-cryptography.md#vrf). The
probability of winning the auction is equal to the number of blocks that contain a winning bid,
divided by the total number of blocks in the ending period. The random ending is managed by
propagating through the entire ending period, where a snapshot is taken at each block within the
ending period to capture the winners for that given block. At the end of the period, one of the
snapshots is randomly selected to determine the winner of the auction.

:::info The parachain candidate with the highest bid at the ending time chosen by the Verifiable
Random Function wins the slot auction.

:::

A parachain auction on {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} lasts exactly
one week from the start: 1 day and 18 hours for the starting period,
{{ polkadot: <RPC network="polkadot" path="consts.auctions.endingPeriod" defaultValue={72000} filter="blocksToDays"/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.auctions.endingPeriod" defaultValue={72000} filter="blocksToDays"/> :kusama }}
days for the ending period (candle auction phase) and 6 hours for determining the auction winner.

:::info

[Crowdloan contributions](learn-crowdloans.md##supporting-a-crowdloan-campaign) cannot be made
during these six hours when the winning block for the auction is being determined on-chain.

:::

More details on this are available in the [Network Implementation](#network-implementation) section.

### [Randomness](./learn-cryptography.md#randomness) in action

The following example will showcase the randomness mechanics of the candle auction for the ninth
auction on Kusama. Keep in mind that the candle phase has a uniform termination profile and has an
equal probability of ending at any given block, and the termination block cannot be predicted before
or during the auction.

- The ending period of auction 9 starts at [`block 9362014`](https://kusama.subscan.io/auction/9).

  :::note The auction has a full duration equal to `block 9362014` + `72000`

  Here, `block 72000` is the "ending period", which is divided into **3600 samples of 20 blocks**.
  Figuratively, the candle is lit, and the candle phase lasts for 72,000 blocks.

  :::

- The winning sample during the ending period had the `index 1078`.

  :::note Sample 1078 is the winner

  Sample 1078 refers to the winner as of `block 9362014 + 21560`, which equals
  [`block 9383574`](https://kusama.subscan.io/block/9383574).

  :::

- The parent block was a new BABE session in the `Logs`, which updated the randomness that was used
  to select that [sample index](https://kusama.subscan.io/block/9434277).

  :::note Inspecting the block state

  You can inspect the state at the end of `block 9434277` to see the sample indices with an
  [archive node](../maintain/maintain-sync.md####types-of-nodes). The digest in the `Logs` of
  `9434277` is decodable and contains the random value as well as the BABE authorities.

  :::

- As a result, the winner of this auction was not the highest bid during the full duration.

## Rationale

The open and transparent nature of blockchain systems opens attack vectors that are non-existent in
traditional auction formats. Normal open auctions in particular can be vulnerable to _auction
sniping_ when implemented over the internet or on a blockchain.

Auction sniping takes place when the end of an auction is known and bidders are hesitant to bid
their true price early, in hopes of paying less than they actually value the item.

For example, Alice may value an item at auction for 30 USD. She submits an initial bid of 10 USD in
hopes of acquiring the items at a lower price. Alice's strategy is to place incrementally higher
bids until her true value of 30 USD is exceeded. Another bidder Eve values the same item at 11 USD.
Eve's strategy is to watch the auction and submit a bid of 11 USD at the last second. Alice will
have no time to respond to this bid before the close of the auction and will lose the item. The
auction mechanism is sub-optimal because it has not discovered the true price of the item and the
item has not gone to the actor who valued it the most.

On blockchains this problem may be even worse, since it potentially gives the producer of the block
an opportunity to snipe any auction at the last concluding block by adding it themselves while
ignoring other bids. There is also the possibility of a malicious bidder or a block producer trying
to _grief_ honest bidders by sniping auctions.

For this reason, [Vickrey auctions](https://en.wikipedia.org/wiki/Vickrey_auction), a type of
sealed-bid auction where bids are hidden and only revealed at a later phase, have emerged as a
well-regarded mechanic. For example, this mechanism is leveraged to auction human readable names on
the [ENS](./learn-account-advanced.md). The Candle auction is another solution that does not require
a two-step commit and reveal schemes (a main component of Vickrey auctions), which allows smart
contracts to participate.

Candle auctions allow everyone to always know the states of the bid, but they do not reveal when the
auction has officially ended. This helps to ensure that bidders are willing to make their true bids
early. Otherwise, they may find themselves in a situation where the auction was determined to have
ended before having an opportunity to bid.

## Network Implementation

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} will use a _random beacon_ based on
the [Verifiable Random Function (VRF)](./learn-cryptography.md#vrf). The VRF will provide the base
of the randomness, which will retroactively determine the end-time of the auction.

The slot durations are capped to {{ polkadot: 2 years and divided into 3-month periods. :polkadot }}
{{ kusama: 1 year and divided into 6-week periods. :kusama }} Parachains may lease a slot for any
combination of periods of the slot duration. Parachains may lease more than one slot over time,
meaning that they could extend their lease to the network past the maximum duration by leasing a
contiguous slot.

:::note Individual parachain slots are fungible

This means that parachains do not need to always inhabit the same slot, however they always must
maintain a slot to remain a parachain.

:::

## Bidding

Parachains or parachain teams, bid in the auction by specifying the slot range that they want to
lease and the number of tokens they are willing to reserve. Bidders can be either ordinary accounts,
or use the [crowdloan functionality](learn-crowdloans.md) to source tokens from the community. For a
more in-depth comparison between both of these options for gaining a parachain slot, check out this
section on
[Crowdloan Campaigns vs Parachain Auctions](./learn-crowdloans.md#crowdloan-campaigns-vs-parachain-auctions).

```
Parachain slots at genesis

       --3 months--
       v          v
Slot A |     1    |     2     |     3     |     4     |     5     |     6    |     7     |     8     |     9     |...
Slot B |     1    |     2     |     3     |     4     |     5     |     6    |     7     |     8     |     9     |...
Slot C |__________|     1     |     2     |     3     |     4     |     5    |     6     |     7     |     8     |     9     |...
Slot D |__________|     1     |     2     |     3     |     4     |     5    |     6     |     7     |     8     |     9     |...
Slot E |__________|___________|     1     |     2     |     3     |     4    |     5     |     6     |     7     |     8     |     9     |...
       ^                                                                                             ^
       ---------------------------------------------max lease-----------------------------------------

```

_Each period of the range 1 - 4 represents a
{{ polkadot: 3-month duration for a total of 2 years :polkadot }}
{{ kusama: 6-week duration for a total of 1 year :kusama }} _

Bidders will submit a configuration of bids specifying the token amount they are willing to bond and
for which periods. The slot ranges may be any of the periods 1 - `n`, where `n` is the number of
periods available for a slot. (`n`=
{{ polkadot: <RPC network="polkadot" path="consts.auctions.leasePeriodsPerSlot" defaultValue={8}/> for Polkadot) :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.auctions.leasePeriodsPerSlot" defaultValue={8}/> for Kusama) :kusama }}

:::note If you bond tokens with a parachain slot, you cannot stake with those tokens. In this way,
you pay for the parachain slot by forfeiting the opportunity to earn staking rewards.

:::

A bidder configuration for a single bidder may look like the following pseudocode example:

```js
const bids = [
  {
    range: [1, 2, 3, 4, 5, 6, 7, 8],
    bond_amount: 300,
  },
  {
    range: [1, 2, 3, 4],
    bond_amount: 777,
  },
  {
    range: [2, 3, 4, 5, 6, 7],
    bond_amount: 450,
  },
];
```

The important concept to understand from this example is that bidders may submit different
configurations at different prices (`bond_amount`). However, only one of these bids would be
eligible to win exclusive of the others.

The winner selection algorithm will pick bids that may be non-overlapping in order to maximize the
amount of tokens held over the entire lease duration of the parachain slot. This means that the
highest bidder for any given slot lease period might not always win (see the
[example below](#examples)).

A random number, which is based on the [VRF](./learn-cryptography.md#vrf) used by
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}, is determined at each block.
Additionally, each auction will have a threshold that starts at 0 and increases to 1. The random
number produced by the VRF is examined next to the threshold to determine if that block is the end
of the auction within the so-called _ending period_. Additionally, the VRF will pick a block from
the last epoch to access the state of bids which can help aid in mitigating some types of attacks
from malicious validators.

### Examples

There is one parachain slot available.

Charlie bids `75` for the range 1 - 8.

Dave bids `100` for the range 5 - 8.

Emily bids `40` for the range 1 - 4.

Let's calculate each bidder's valuation according to the algorithm. We do this by multiplying the
bond amount by the number of periods in the specified range of the bid.

Charlie - 75 \* 8 = 600 for range 1 - 8

Dave - 100 \* 4 = 400 for range 5 - 8

Emily - 40 \* 4 = 160 for range 1 - 4

Although Dave had the highest bid in accordance to token amount per period, when we do the
calculations we see that since he only bid for a range of 4, he would need to share the slot with
Emily who bid much less. Together Dave and Emily's bids only equals a valuation of `560`. Charlie's
valuation for the entire range is `600`. Therefore Charlie is awarded the complete range of the
parachain slot.

## Parachain Lease Extension

Before the slot lease expires, parachains have to bid and win another auction for continuity of the
lease. To avoid any downtime in connectivity and minimize the risk of losing a subsequent auction,
parachain teams need to plan ahead to bid for the lease extension before their current lease period
ends. Explained in the section above, each auction lets you bid for 8 LPs (Lease Periods) which
enables two scenarios for the parachain's lease extension.

### Lease Extension with Overlapping Slots

Acquire a slot where the first lease period is before the last lease period of the current slot.

- Register a new `paraId`
- Win a slot auction with the new `paraId`

The parachain team has access to two slots:

- one that will end soon
- one that just started

Both slots have at least one LP in common. When the old slot transitions to their last LP, the
parachain can [swap](https://github.com/paritytech/polkadot/pull/4772) the slots. This can be done
via [on-chain governance](https://kusama.polkassembly.io/post/1491). The `swap` call is available in
the `registrar` pallet.

![Parachain Slot Swap](../assets/para-swap.png)

:::note Any two parachains can swap their slots via XCM

The [slot swap via XCM](https://github.com/paritytech/polkadot/pull/4772) requires two live
parachains to send an XCM message to the relay chain to approve the swap. A parachain team with
access to two overlapping slots can start a shell parachain on the new slot and swap it with their
actual parachain on the old slot, thus ensuring continuity of the lease.

:::

### Lease Extension with Non-Overlapping Slots

Acquire a slot where the first LP starts right after the end of the last LP of the current slot. In
this case, the parachain can bid directly with their current `paraId`, and it will be automatically
extended without the need of swapping. This method has the advantage of not having superfluous LP's
on different slots owned by the same team, however it has the disadvantage of losing flexibility on
when to win a new slot: if the team does not win the exact slot, then it will suffer some downtime
until it wins a new slot.

## Resources

- [How do Parachain Slot Auctions Work](https://support.polkadot.network/support/solutions/articles/65000182287-how-does-a-parachain-slots-auction-work-)
- [Parachain Allocation](https://research.web3.foundation/Polkadot/overview/parachain-allocation) -
  W3F research page on parachain allocation that goes more in depth to the mechanism
- [Research Update: The Case for Candle Auctions](https://polkadot.network/blog/research-update-the-case-for-candle-auctions/) -
  W3F breakdown and research update about candle auctions
- [Front-Running, Smart Contracts, and Candle Auctions](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3846363)
  W3F Research team discusses how to remedy current blockchain auction setbacks with candle auctions



---
id: learn-balance-transfers
title: Balance Transfers
sidebar_label: Balances Transfers
keywords: [balance, transfers, transaction, signing]
description: Perform Balance Transfers between Accounts.
slug: ../learn-balance-transfers
---

import RPC from "./../../components/RPC-Connection";

Balance transfers are used to send a balance from one account to another account. To start
transferring a balance, we will begin by using
[Polkadot-JS UI](https://polkadot.js.org/apps/#/explorer). This guide assumes that you've already
[created an account](./learn-accounts.md#account-generation) and have some funds that are ready to
be transferred.

:::info

We support only the use of the [**Polkadot-JS UI**](https://polkadot.js.org/apps/#/explorer)
together with the [**browser extension**](https://polkadot.js.org/extension/),
[**Ledger**](https://www.ledger.com/ledger-live) and
[**Parity Signer**](https://www.parity.io/technologies/signer/) for signing transactions. We do not
provide support for third party applications.

:::

## Sending Funds using UI, Extension, Parity Signer & Ledger

See the video tutorial below to learn how to send funds using the supported tools. See the Polkadot
Support pages for detailed information about transferring funds using the
[Polkadot-JS UI](https://support.polkadot.network/support/solutions/articles/65000170304-how-to-send-transfer-funds-out-of-your-dot-account-on-the-polkadot-js-ui).

[![Balance Transfer Tutorial](https://img.youtube.com/vi/gbvrHzr4EDY/0.jpg)](https://www.youtube.com/watch?v=gbvrHzr4EDY)

:::info Signing Transactions

See the Polkadot Support pages for detailed information about signing transactions using:

- [The Polkadot-JS UI](https://support.polkadot.network/support/solutions/articles/65000181993-how-to-sign-a-transaction-directly-on-polkadot-js-ui)
- [The Polkadot-JS browser extension](https://support.polkadot.network/support/solutions/articles/65000181989)
- [Ledger devices](https://support.polkadot.network/support/solutions/articles/65000181994-how-to-sign-a-transaction-on-ledger)
- [The Parity Signer app](https://support.polkadot.network/support/solutions/articles/65000182000-how-to-sign-a-transaction-in-parity-signer).

:::

## Keep-Alive Checks

:::info

See [**this video tutorial**](https://youtu.be/Wg0pH05CC9Y) and
[**this support page**](https://support.polkadot.network/support/solutions/articles/65000168651-what-is-the-existential-deposit-)
to learn about keep-alive checks and existential deposit.

:::

In {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} there are two main ways to
transfer funds from one account to another:

- `transfer keep-alive` (default option) will not allow you to send an amount that would allow the
  sending account to be removed due to it going below the
  [existential deposit](https://support.polkadot.network/support/solutions/articles/65000168651-what-is-the-existential-deposit-)
  of
  {{ polkadot: <RPC network="polkadot" path="consts.balances.existentialDeposit" defaultValue={10000000000} filter="humanReadable"/>. :polkadot }}
  {{ kusama: <RPC network="kusama" path="consts.balances.existentialDeposit" defaultValue={33333333} filter="humanReadable"/>. :kusama }}
- `transfer` will allow you to send {{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }}
  regardless of the consequence. If the balance drops below the existential deposit your account
  will be reaped. It may be that you do not want to keep the account alive (for example, because you
  are moving all of your funds to a different address). To switch the keep-alive check off visit
  [this support article](https://support.polkadot.network/support/solutions/articles/65000169248).

:::info

Attempting to send less than the existential deposit to an account with
{{ polkadot: 0 DOT :polkadot }}{{ kusama: 0 KSM :kusama }} will always fail, no matter if the
keep-alive check is on or not.

:::

For instance, attempting to transfer
{{ polkadot: 0.1 DOT :polkadot }}{{ kusama: 0.0001 KSM :kusama }} to an account you just generated
(and thus has no balance) will fail, since
{{ polkadot: 0.1 DOT :polkadot }}{{ kusama: 0.0001 KSM :kusama }} is less than the existential
deposit of
{{ polkadot: <RPC network="polkadot" path="consts.balances.existentialDeposit" defaultValue={10000000000} filter="humanReadable"/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.balances.existentialDeposit" defaultValue={333333333} filter="humanReadable"/> :kusama }}
and the account cannot be initialized with such a low balance.

:::note

Even if the transfer fails due to a keep-alive check, the transaction fee will be deducted from the
sending account if you attempt to transfer.

:::

## Vested Transfers

{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} may have a lock placed on them to account for
vesting funds. Like other types of locks, these funds cannot be transferred but can be used in other
parts of the protocol such as voting in governance or being staked as a validator or nominator.

Vesting funds are on a release schedule and unlock a constant number of tokens at each block
(**linear vesting**) or can unlock the full amount after a specific block number (**cliff
vesting**). Although the tokens are released in this manner, it does not get reflected on-chain
automatically since locks are [lazy](#lazy-vesting) and require an extrinsic to update.

There are two ways that vesting schedules can be created.

- One way is through an extrinsic type available in the Vesting pallet, `vested_transfer`. The
  vested transfer function allows anyone to create a vesting schedule with a transfer of funds, as
  long as the account for which the vesting schedule will be created does not already have one and
  the transfer moves at least `MinVestedTransfer` funds, which is specified as a chain constant.
- A second way is as part of the genesis configuration of the chain. In the case of
  {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}, the chain specification genesis
  script reads the state of the Claims contract that exists on the Ethereum blockchain and creates
  vesting schedules in genesis for all the allocations registered as being vested.

Vesting schedules have three parameters:

- **locked**, the amount of tokens to be transferred in
  [Planck units](../learn/learn-DOT#the-planck-unit))
- **per block**, the number of tokens that are released per block
- **starting block**, the block number after which the vesting schedule starts

The configuration of these three fields dictates the amount of funds that are originally locked, the
slope of the unlock line and the block number for when the unlocking begins.

:::info

You can watch [**this video tutorial**](https://youtu.be/JVlwTQBwNGc) to understand how to do vested
transfers, including linear and cliff vesting. Note the tutorial uses the Westend Testnet, but the
same applies to both Polkadot and Kusama.

:::

### Lazy Vesting

Like [simple payouts](learn-staking-advanced.md), vesting is _lazy_, which means that someone must
explicitly call an extrinsic to update the lock that is placed on an account.

- The `vest` extrinsic will update the lock that is placed on the caller.
- The `vest_other` will update the lock that is placed on another "target" account's funds.

These extrinsics are exposed from the Vesting pallet.

If you are using the Polkadot-JS UI, when there are
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} available to vest for an account, then you
will have the ability to unlock {{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} which has
already vested from the [Accounts](https://polkadot.js.org/apps/#/accounts) page.

![unbond](../assets/unlock-vesting.png)

## Batch Transfers

Batch transfers are balances transfers to multiple accounts executed by one account. In order to
construct a batch transfer you need to:

- Create a `utility.batch(calls)` extrinsic using the
  [utility pallet](https://paritytech.github.io/substrate/master/pallet_utility/index.html), and
- Within the batch call you can create multiple `balances.transferKeepAlive` extrinsics using the
  [balances pallet](https://paritytech.github.io/substrate/master/pallet_balances/index.html). You
  can specify as many receivers as you desire.

:::info

You can watch [**this video tutorial**](https://youtu.be/uoUC2K8muvw) to learn how to do batch
transfers. Note the tutorial uses the Westend Testnet, but the same applies to both Polkadot and
Kusama.

:::

## Existing Reference Error

If you are trying to reap an account and you receive an error similar to
`"There is an existing reference count on the sender account. As such the account cannot be reaped from the state"`,
then you have existing references to this account that must be first removed before it can be
reaped. References may still exist from:

- Bonded tokens (most likely)
- Unpurged session keys (if you were previously a validator)
- Token locks
- Existing recovery info
- Existing assets

### Bonded Tokens

If you have tokens that are bonded, you will need to unbond them before you can reap your account.
Follow the instructions at
[Unbonding and Rebonding](../maintain/maintain-guides-how-to-nominate-polkadot.md) to check if you
have bonded tokens, stop nominating (if necessary) and unbond your tokens.

### Checking for Locks

:::info

See [this video tutorial](https://youtu.be/LHgY7ds_bZ0) and
[this support page](https://support.polkadot.network/support/solutions/articles/65000169437-why-can-t-i-transfer-tokens-)
to learn how to check for locks and remove them.

:::

You can also check for locks by querying `system.account(AccountId)` in
[`Chain state` tab under the `Developer` drop-down menu in the Polkadot-JS UI](https://polkadot.js.org/apps/#/chainstate).
Select your account, then click the "+" button next to the dropdowns, and check the relative `data`
JSON object. If you see a non-zero value for anything other than `free`, you have locks on your
account that need to get resolved.

### Purging Session Keys

If you used this account to set up a validator and you did not purge your keys before unbonding your
tokens, you need to purge your keys. You can do this by seeing the
[How to Stop Validating](../maintain/maintain-guides-how-to-stop-validating.md) page. This can also
be checked by checking `session.nextKeys` in the chain state for an existing key.

### Existing Recovery Info

{{ polkadot: Currently, Polkadot does not use the
[Recovery Pallet](https://github.com/paritytech/substrate/blob/master/frame/recovery/), so this is
probably not the reason for your tokens having existing references. :polkadot }}

{{ kusama: On Kusama, you can check if recovery has been set up by checking the `recovery.recoverable(AccountId)`
chain state. This can be found under `Developer > Chain state` in [PolkadotJS Apps](https://polkadot.js.org/apps/). :kusama }}

### Existing Non-Native Assets

Currently, {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} does not use the
[Assets Pallet](https://github.com/paritytech/substrate/tree/master/frame/assets), so this is
probably not the reason for your tokens having existing references.



---
id: learn-bridges
title: Bridges
sidebar_label: Bridges
description: Bridges and Examples of Common Bridges.
keywords: [bridges, cross-chain, bridge methods]
slug: ../learn-bridges
---

A cornerstone technology of blockchain interoperability is the blockchain bridge. Blockchain bridges
are ways for two economically sovereign and technologically diverse chains to communicate with each
other. Bridge designs come in a variety of flavors ranging from centralised and trusted to more
decentralised and trustless. Polkadot favors the latter bridge designs for its ecosystem. However,
there is nothing that blocks a development team from building and deploying the former.

While bridge designs are now getting to a place where they are sufficiently planned out, there have
not been too many used heavily in production. For this reason, you can consider this page a work in
progress. It will be updated as more information is determined and available.

:::info Purpose of bridging

Bridges are specifically for making the
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} ecosystem compatible with external
blockchains such as Bitcoin, Ethereum, or Tezos (among others). For information on XCM, the native
interoperability technology that allows parachains to communicate trustlessly, please see the
dedicated [cross consensus](learn-xcm.md) page on the Wiki.

:::

## Bridging Methods

Building a bridge that is as decentralised and trustless as possible can be done through any of the
following methods (ordered by suggested methodology):

- _Bridge pallets_ - For Substrate-native chains, use a bridge pallet (e.g. Kusama `<->` Polkadot
  bridge, since both networks' parachains use Substrate).
- _Smart contracts_ - If the chain is not on Substrate, you should have smart contracts on the
  non-Substrate chain to bridge (e.g. Ethereum mainnet will have a bridge smart contract that
  initiates Eth transactions based on incoming XCMP messages).
- _Higher-order protocols_ - If your chain does not support smart contracts (e.g. Bitcoin), you
  should use [XClaim](https://eprint.iacr.org/2018/643.pdf) or similar protocols to bridge.

### via Bridge Pallets

Receiving messages on {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} from an
external, non-parachain blockchain can be possible through a Substrate pallet. The Substrate
instance can then be deployed to {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}
either as a system-level parachain (native extension to the core
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} software) or as a community-operated
parachain.

An example of a bridge that would strictly use bridge pallets would be a Kusama `<->` Polkadot
bridge, since both use parachains based on Substrate.

For the standalone chains that will not have a parachain bridging module on
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} (non-Substrate), it will be necessary
to deploy bridge contracts (see below).

### via Smart Contracts

Given the generality of blockchain platforms with Turing-complete smart contract languages, it is
possible to bridge {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} and any other
smart contract capable blockchain.

Those who are already familiar with Ethereum may know of the now archived
[Parity Bridge](https://github.com/paritytech/parity-bridge) and the efforts being made to connect
PoA sidechains to the Ethereum mainnet. The Parity bridge is a combination of two smart contracts,
one deployed on each chain, that allow for cross-chain transfers of value. As an example of usage,
the initial Parity Bridge proof of concept connects two Ethereum chains, `main` and `side`. Ether
deposited into the contract on `main` generates a balance denominated in ERC-20 tokens on `side`.
Conversely, ERC-20 tokens deposited back into the contract on `side` can free up Ether on `main`.

:::note

To learn more on how Bitcoin and Ethereum can cooperate and collaborate Through
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}, check out this explainer video
[here](https://www.youtube.com/watch?v=rvoFUiOR3cM)

:::

### via Higher-Order Protocols

Higher-order protocols (like [XCLAIM](https://eprint.iacr.org/2018/643.pdf)) can be used to bridge
but should only be used when other options are not available. XCLAIM, in particular, requires any
swappable asset to be backed by a collateral of higher value than the swappable assets, which adds
additional overhead.

An example of a network that would be well-suited for higher-order protocols would be Bitcoin, since
it does not support smart-contracts and it's not based on Substrate.

## Examples

### Ethereum Bridge (Smart Contracts <-> Polkadot)

As explained by Dr. Gavin Wood in a
[blog post](https://medium.com/polkadot-network/polkadot-substrate-and-ethereum-f0bf1ccbfd13) from
late 2019, there are three ways that the
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} and Substrate ecosystem can be
bridged to the Ethereum ecosystem.

1. {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} <-> Ethereum Public Bridge.
1. Substrate <-> Parity Ethereum (Openethereum) Bridge.
1. The Substrate EVM module.

Please read the blog article for fuller descriptions of each one of these options.

### Bitcoin Bridge (XCLAIM <-> Substrate <-> Polkadot)

The Interlay team has written a [specification](https://spec.interlay.io/) on a Bitcoin bridge that
is based on the [XCLAIM](https://eprint.iacr.org/2018/643.pdf) design paper. The protocol enables a
two-way bridge between Polkadot and Bitcoin. It allows holders of BTC to "teleport" their assets to
Polkadot as iBTC, and holders of iBTC to burn their assets for BTC on the Bitcoin chain.

The Bitcoin bridge, as documented in the specification, is composed of two logically different
components:

- The XCLAIM component maintains all accounts that own iBTC.
- The BTC-Relay is responsible for verifying the Bitcoin state when a new transaction is submitted.

For full details on how it works, please refer to the specification.

There is now a
[working implementation and mainnet bridge available](https://app.interlay.io/btc?tab=issue).

## Additional Resources and Examples

- [Parity Bridges Common Resources](https://github.com/paritytech/parity-bridges-common)
- [Substrate/Ethereum Bridge](https://github.com/ChainSafe/ChainBridge) - ChainSafe and Centrifuge
  were awarded a grant in W3F Grants
  [Wave 5](https://medium.com/web3foundation/web3-foundation-grants-wave-5-recipients-2205f4fde096)
  to build a Substrate to Ethereum two-way bridge.
- [iBTC (Bitcoin <-> Polkadot Bridge)](https://docs.interlay.io/#//)
- [EOS Bridge](https://github.com/bifrost-codes/bifrost) - The Bifrost team was awarded a grant in
  W3F Grants
  [Wave 5](https://medium.com/web3foundation/web3-foundation-grants-wave-5-recipients-2205f4fde096)
  to build a bridge to EOS.
- [Tendermint Bridge](https://github.com/ChorusOne/tendermint-light-client) - ChorusOne was awarded
  a grant in
  [Wave 5](https://medium.com/web3foundation/web3-foundation-grants-wave-5-recipients-2205f4fde096)
  to build a GRANDPA light client in Tendermint.
- [Interlay BTC Bridge](https://app.interlay.io/btc?tab=issue) - The Interlay team was awarded a
  grant in W3F grants
  [Wave 5](https://medium.com/web3foundation/web3-foundation-grants-wave-5-recipients-2205f4fde096)
  to build a trust-minimized BTC bridge.
- [ChainX BTC Bridge](https://github.com/chainx-org/ChainX/tree/master/xpallets/gateway/bitcoin) -
  ChainX have implemented a BTC to Substrate bridge for their parachain.
- [POA Network](https://poa.network/)
- [Case study](https://medium.com/giveth/ethereum-dapp-scaling-poa-network-acee8a51e772) of POA
  Network's implementation of Parity's bridge chain solution.
- [Edgeth Bridge](https://github.com/hicommonwealth/edgeth_bridge/) - a bridge from Ethereum to
  Edgeware chain (a Substrate-based chain) - now defunct and not maintained, but a good example.
- [XCLAIM](https://eprint.iacr.org/2018/643.pdf) - XCLAIM is a framework for achieving trustless and
  efficient cross-chain exchanges using cryptocurrency-backed assets.
- [Celer cBridge](https://github.com/celer-network/cBridge-contracts) - a bridge to transfer assets
  from Ethereum & Binance Smart Chain to the Astar Polkadot EVM.


---
id: learn-collator
title: Collator
sidebar_label: Collator
description: Role of Collators within the Polkadot Ecosystem.
keywords: [collator, maintain, full node, block candidate]
slug: ../learn-collator
---

## Collators' Role

Collators maintain parachains by collecting parachain transactions from users and producing state
transition proofs for Relay Chain validators. In other words, collators maintain parachains by
aggregating parachain transactions into parachain block candidates and producing state transition
proofs (Proof-of-Validity, PoV) for validators.

Collators maintain a full node for the Relay Chain and a full node for their particular parachain;
meaning they retain all necessary information to be able to author new blocks and execute
transactions in much the same way as miners do on PoW blockchains. Under normal circumstances, they
will collate and execute transactions to create an unsealed block and provide it, together with a
PoV, to one or more validators responsible for proposing a parachain block.

Collators are similar to validators on any other blockchain but they do not need to provide security
guarantees because {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} provides those. If
a parachain block is invalid, it will get rejected by validators. The validators are required to
check the validity of submitted candidates, followed by issuing and collecting statements about the
validity of candidates to other validators. This process is known as **candidate backing**.
Validators receive an arbitrary number of parachain candidates with associated PoV from untrusted
collators. A candidate is considered _backable_ when at least 2/3 of all assigned validators have
issued a valid statement about that candidate.

The validator must successfully verify the following conditions in the following order:

1. The candidate does not exceed any parameters in the persisted validation data.

2. The signature of the collator is valid.

3. Validate the candidate by executing the parachain Runtime.

Once a candidate meets a specified criteria for inclusion, the selected relay chain block author
then chooses any of the backable candidates for each parachain and includes those into the relay
chain block. We say the candidate blocks are _backed_.

The assumption that having more collators is better or more secure is not correct. On the contrary,
too many collators may slow down the network. The only nefarious power collators have is transaction
censorship. To prevent censorship, a parachain only needs to ensure that there are some neutral
collators - but not necessarily a majority. Theoretically, the censorship problem is solved by
having just one honest collator.

## XCM

Collators are a key element of the [XCM (Cross-Consensus Message Passing Format)](learn-xcm.md). By
being full nodes of the Relay Chain, they are all aware of each other as peers. This makes it
possible for them to send messages from parachain A to parachain B.

## Taking the Case for One Parachain

A start of a new block candidate is initiated with a block creation time. The collator aggregates
all new transactions at the end of the process. When doing so, the collator signs the _parachain
block candidate_ and produces state transition proofs (Proof-of-Validity, PoV), which are a summary
of the final account balances caused by the transactions in the candidate block. The collator sends
the candidate block and PoV to the parachain validators, so-called para-validators. The
para-validators verify the transactions within the parachain block candidate. Upon verification, and
if all is well, the candidate becomes _backable_ and a para-validator shares the candidate block
with the relay chain.

![parachain candidate block diagram](../assets/polkadot-consensus-example-1.png)

The validators on the relay chain will try to reach a consensus on the block candidate. Upon
reaching consensus, the now validated block candidate is shared with the validators and collators,
and the process repeats for new transactions. A collator cannot continue building blocks on a
parachain until the block candidate they proposed to the Relay Chain validators have been validated.
A block is produced every 6 seconds.

## Collators in the Wild

Blockchains that are built using Substrate are unable to hook onto the Relay Chain on their own. The
Parity team built the [Cumulus library](https://github.com/paritytech/cumulus/) to address this.
Collators are being used on the
[Rococo](../build/build-parachains.md##testing-a-parachains:-rococo-testnet) testnet, and you can
learn more about how they are used with Cumulus via the
[Cumulus](https://github.com/paritytech/cumulus/) repository. More information can be found under
the [Cumulus section](../build/build-parachains.md###cumulus) on the build parachain page.

## Guides and Tools

- [Tutorial covering Cumulus and Collators](https://docs.substrate.io/reference/how-to-guides/parachains/connect-to-a-relay-chain/)
- [Rococo testnet guide](../build/build-parachains.md##testing-a-parachains:-rococo-testnet)
- [polkadot-launch](https://github.com/shawntabrizi/polkadot-launch) - a tool to quickly spin up a
  local Polkadot testnet based on some parameters like number of parachains, collator setup, etc.


---
id: learn-comparisons-ethereum-2
title: Polkadot vs. Ethereum
sidebar_label: Ethereum
description: Comparison between Polkadot and Ethereum.
keywords: [ethereum, Ethereum, proof of stake, sharding]
slug: ../learn-comparisons-ethereum-2
---

Polkadot is the first fully sharded production-grade blockchain protocol. The current protocol of
Ethereum does not implement sharding and it is the main focus of
[the next major upgrade](https://notes.ethereum.org/@vbuterin/proto_danksharding_faq#What-is-Danksharding).
Similar to Polkadot and its parachains, Ethereum has goals of being a multi-sharded network. When a
network is **sharded**, this implies that it is capable of executing multiple (and often many) state
transitions in parallel in a scalable manner. One key difference is that Polkadot parachains are
heterogeneous shards while Ethereum will have homogeneous shards. In other words, each parachain can
have its own state transition logic whereas on Ethereum, all the shards use the same state
transition logic.

Both protocols are blockchains but serve fundamentally different roles in how they are utilized:

- Ethereum is a general-purpose blockchain that hosts the Ethereum Virtual Machine, an environment
  for executing smart contracts.
- Polkadot is a heterogeneous sharded, multi-chain protocol that hosts multiple chains and provides
  a way for them to partake in a shared security model. Polkadot acts as a **meta-protocol** that
  allows for multiple protocols to coexist and work together.

:::info

It's important to note that the "Ethereum" here refers to what was previously known as "Eth2" or
"Ethereum 2.0". For more concrete details regarding the subsequent iterations of Ethereum, please
refer to the [Ethereum Roadmap](https://ethereum.org/en/roadmap/).

It's relevant to mention that some upgrades may not be active for Ethereum but are described as a
part of this comparison to Polkadot. Some of these goals/upgrades may change to reflect the general
direction of Ethereum.

:::

## High-Level Comparison

At a high level, both protocols have fundamentally different goals, which are reflected by their
architecture:

- Ethereum is a general-purpose blockchain for **global coordination**. Ethereum is not specialized
  nor optimized for any particular application, rather its primary focus is the Ethereum Virtual
  Machine for executing smart contracts.
- Polkadot is a sharded blockchain that introduces shared security for each one of its shards, or
  **parachains**. Each shard is usually specialized towards a specific focus and optimized towards
  that goal. Polkadot provides shared security and consensus to these shards through the Polkadot
  relay chain.

Polkadot can't and does not directly run something like a virtual machine for smart contracts.
However, several of its parachains can (and do). Parachains on Polkadot can even run an EVM for
executing smart contracts written in Solidity, Ethereum's native smart contract language.

In the context of blockchain, "sharding" refers to the parallelization of state transition
(transaction) execution. The way Ethereum and Polkadot deal with scalability and sharding is quite
different.

## Scalability: Sharding vs. Danksharding

As part of Ethereum's roadmap, the previously dubbed "shard chains" have been forgone in favor of
rollup-based approach for scaling transaction throughput.
[**Danksharding**](https://ethereum.org/en/roadmap/danksharding/) is how Ethereum plans to create a
scalable environment for an acclaimed >100,000 transactions per second. Danksharding was the chosen
alternative over "shard chains" and works by storing blobs.

Danksharding will allow for much more space to be utilized per block on Ethereum, where blobs of
data will be verifiable for an amount of time before being pruned from the network. These blobs will
have to be held for an amount of time, implying a level of data availability that validators must
have. This approach will enable data availability at layer one and further enable layer two
protocols on Ethereum to flourish.

In contrast, {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} is a purely sharded
network. It prioritizes data availability as an integral part of the block validation process.
Parallelized interactions between parachains, the **shards** of the Polkadot network, also take
advantage of this factor. Whereas Ethereum primarily focuses on making large amounts of data
available for validation for a portion of time, Polkadot's parallelization factor allows
verification to happen on the protocol level without needing a layer two solution.

:::note

The term "shards" is used here, but know that shards and parachains mean the same thing! Each
parachain represents a shard in the Polkadot network.

:::

On {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}, each shard hosts core logic. As
mentioned earlier, each shard (i.e., [parachain](learn-parachains.md)) has a unique state transition
function (sometimes called a **runtime**). Applications can exist either within a single shard or
across shards by composing logic to create [cross-consensus (XCM)](learn-xcm.md) interactions.

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} uses WebAssembly
([Wasm](./learn-wasm.md)) as a "meta-protocol". A shard's state transition function can be abstract
as long as the validators on {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} can
execute it within a Wasm environment.

## Architectural Differences: Polkadot and Ethereum

As previously mentioned, Ethereum is a **general-purpose** virtual machine that can run sandboxed
programs written in Solidity, whereas Polkadot is a meta-protocol for other parachains to connect
and interact with each other.

Ethereum operates as a single, homogeneous chain. Each Ethereum node is divided into two layers: the
**consensus** and **execution** layers. Each layer handles the block validation information, peer
discovery, and Proof-of-Stake of the Ethereum client.

Polkadot's primary component is the **relay chain**, which hosts heterogeneous **shards** called
parachains. The relay chain aggregates information from its shards, the parachains, where Polkadot
validators agree upon consensus and finality. In essence, one can look at Polkadot as a series of
**runtimes**, which are state transition functions used to describe parachains (shards), as well as
Polkadot itself. Like Ethereum, Polkadot clients abstract away many of their responsibilities into
various components built using Substrate.

### Forks, Upgrades, and Governance

Ethereum governance is done off-chain, where various stakeholders come to a consensus through some
medium other than the protocol itself. Upgrades on Ethereum will follow the standard hard-fork
procedure, requiring validators to upgrade their nodes to implement protocol changes.

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} uses on-chain
[governance](./learn-polkadot-opengov.md) with a multicameral system. There are several avenues to
issue proposals, and all proposals ultimately pass through a public referendum, where the majority
of tokens can always control the outcome.
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} uses
[adaptive quorum biasing](./learn-governance.md#adaptive-quorum-biasing) to set the passing
threshold for low-turnout referenda. Referenda can cover various topics, including fund allocation
from an on-chain [Treasury](./learn-treasury.md) or modifying the underlying runtime code of the
chain. Decisions get enacted on-chain and are binding and autonomous.

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} can enact chain upgrades and
successful proposals using the Wasm meta-protocol without a hard fork. Anything within the state
transition function, the transaction queue, or off-chain workers can be upgraded without forking the
chain.

### Consensus and Finalization

Ethereum and {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} use hybrid consensus
models where block production and finality have their protocols. The finality protocols - Casper FFG
for Ethereum and [GRANDPA](./learn-consensus.md#finality-gadget-grandpa) for
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} - are both GHOST-based and can both
finalize batches of blocks in one round. For block production, both protocols use slot-based
protocols that randomly assign validators to a slot and provide a fork choice rule for unfinalized
blocks - RandDAO/LMD for Ethereum and [BABE](./learn-consensus.md#badass-babe-sassafras) for
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}.

There are two main differences between Ethereum and
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} consensus:

1.  Ethereum finalizes batches of blocks according to periods called "epochs". The current plan is
    to have 32 blocks per epoch and finalize them all in one round. With a predicted block time of
    12 seconds, the expected time to finality is 6 minutes (12 minutes maximum). See
    [Ethereum 2 Block Time](https://github.com/ethereum/eth2.0-specs/blob/676e216/specs/phase0/beacon-chain.md#time-parameters)
    for more information.

{{ polkadot: Polkadot's :polkadot }}{{ kusama: Kusama's :kusama }} finality protocol, GRANDPA,
finalizes batches of blocks based on
[availability and validity checks](./learn-parachains-protocol.md#availability-and-unavailability-phase)
that happen as the proposed chain grows. The time to finality varies with the number of checks that
need to be performed (and invalidity reports cause the protocol to require extra checks). The
expected time to finality is 12-60 seconds.

2.  Ethereum requires many validators per shard to provide strong validity guarantees while
    {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} can provide stronger guarantees
    with fewer validators per shard. {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}
    achieves this by making validators distribute an
    [erasure coding](./learn-parachains-protocol.md#erasure-codes) to all validators in the system,
    such that anyone - not only the shard's validators - can reconstruct a parachain's block and
    test its validity. The random parachain-validator assignments and secondary checks are

    performed by randomly selected validators making it less likely for the small set of validators
    on each parachain to collude.

### Staking Mechanics

Ethereum is a proof-of-stake network that requires 32 ETH to stake for each validator instance.
Validators run a primary Beacon Chain node and multiple validator clients - one for each 32 ETH.
These validators get assigned to "committees," randomly selected groups to validate shards in the
network. Ethereum relies on having a large validator set to provide availability and validity
guarantees: They need at least 111 validators per shard to run the network and 256 validators per
shard to finalize all shards within one epoch. With 64 shards, that's 16_384 validators (given 256
validators per shard). See
[Ethereum Economics](https://docs.ethhub.io/ethereum-roadmap/ethereum-2.0/eth-2.0-economics/) and
[Eth2 shard chain simplification proposal](https://notes.ethereum.org/@vbuterin/HkiULaluS) for more
information.

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} can provide strong finality and
availability guarantees with much fewer validators. It uses
[Nominated Proof of Stake (NPoS)](learn-staking.md) to select validators from a smaller set, letting
smaller holders nominate validators to run infrastructure while still claiming the rewards of the
system without running a node of their own.
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} needs about ten validators for each
parachain in the network.

### Interoperability and Message Passing

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} uses
[Cross-Consensus Message Passing Format (XCM)](./learn-xcm.md) for parachains to send arbitrary
messages to each other. Parachains open connections with each other and can send messages via their
established channels. Given that [collators](./learn-collator.md) will need to be full nodes of the
relay chain as well, they will be connected and can relay messages from parachain A to parachain B.

Messages do not pass through the relay chain. Only validity proofs and channel operations do (open,
close, etc.). This enhances scalability by keeping data on the edges of the system.

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} will add a protocol called
[SPREE](learn-spree.md) that provides shared logic for cross-chain messages. Messages sent with
SPREE carries additional guarantees about provenance and interpretation by the receiving chain.

## DApp Support and Development

Ethereum mainly supports a form of smart contract development using Solidity. These contracts are
immutable, and cannot be changed once published on-chain.

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} supports smart contracts through
parachains, usually using the [ink! smart contract language](https://use.ink/). On Ethereum, smart
contracts can call each other; however, they are fixed on-chain to the domain of Ethereum. On
Polkadot, smart contracts can call each other in the same parachain and across parachains.

On Polkadot, developers have the option of either using smart contracts, calling extrinsics from
pallets that modify the chain's state in some particular way or merely use Polkadot's RPC to
directly retrieve and act on-chain information. DApps on Polkadot are often composed of these
multiple components working together to modify, retrieve, and watch state changes live as they
happen.

## Conclusion

Ethereum and {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} both use a sharded
model. Danksharding plans to utilize a rollup-centric approach by focusing on data availability. The
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} ecosystem is secured by a main chain,
called the "relay chain," which in turn manages and connects its shards ("parachains/parathreads")
into a single, homogenous solution.

The primary differences between the two protocols are:

- All shards in Ethereum represent the same state transitions, while
  {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} lets shards have an abstract state
  transition function implementation.
- Governance processes in Ethereum are planned to be off-chain and thus require coordination for a
  hard fork to enact governance decisions. In contrast, in
  {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} the decisions are on-chain and
  enacted autonomously via forkless upgrades.
- Validator selection mechanisms differ as
  {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} can provide strong availability and
  validity guarantees with fewer validators per shard.



---
id: learn-comparisons-rollups
title: Layer Two and Rollups
sidebar_label: Layer Two and Rollups
description: Comparison between various Rollup and L2 Protocols.
keywords: [rollups, polkadot, scalability, shared, security, parachain, ethereum]
slug: ../learn-comparisons-rollups
---

:::note

This comparison covers general information regarding two widely used rollup mechanisms that are used
to scale (usually EVM-based) blockchains and compares and contrasts how Polkadot achieves
scalability.

:::

Layer two (L2) networks are popular as being the way forward for blockchain scalability by
off-loading the majority of computation from layer one (L1) networks. L2 solutions utilize the L1
network's security and functionality to build an additional layer that is often faster, reduces
fees, and solves other platform-specific issues. In many cases, L2 solutions focus on utilizing
block space on a particular blockchain efficiently and cost-effectively.

**Rollups** are an L2 scaling solution. At the most basic level, a rollup L2 solution is responsible
for "rolling up" transactions by batching them before publishing them to the L1 chain, usually
through a network of **sequencers**. This mechanism could include thousands of transactions in a
single rollup.

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} implements this functionality at the
native level (i.e. without using L2 scaling solutions), allowing for shared security and scalability
of the relay chain and respective parachains. Shared security is a concept that has similar goals to
EVM-based optimistic and zero-knowledge rollups. Still, instead of being implemented as a secondary
layer, {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} guarantees native security and
scalability for each of its parachains through the
[Parachains Protocol](./learn-parachains-protocol.md).
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} handles the coordination of data from
parachains into an aggregated, representative state, somewhat similar to L2 rollups.

## Optimistic Rollups

Optimistic rollups are an interactive scaling method for L1 blockchains. They assume
_optimistically_ that every proposed transaction is valid by default.

In the case of mitigating potentially invalid transactions, optimistic rollups introduce a
_challenge period_ during which participants may challenge a suspect rollup. A fraud-proving scheme
is in place to allow for several _fraud proofs_ to be submitted. Those proofs could make the rollup
valid or invalid. During the challenge period, state changes may be disputed, resolved, or included
if no challenge is presented (and the required proofs are in place).

While optimistic rollups provide scalability, they have both benefits and drawbacks to their
approach:

**Benefits:**

- They are not limited by the type of state change - any state change can be included, meaning
  existing apps do not have to account for it.
- They can be parallelized for scalability.
- A substantial amount of data can fit within a single rollup
  ([in the case of Ethereum, for example](https://ethereum.org/en/developers/docs/scaling/optimistic-rollups/#scaling-ethereum-with-optimistic-rollups),
  tens of thousands of transactions in a single state transition).

**Drawbacks:**

- Transaction censorship and centralization are of concern, where sequencers/L2 nodes can be
  compromised.
- Challenge periods could take a substantial amount of time to pass, increasing time for the rollup
  to finalize onto the L1 network.
- Due to their generalist nature of including any state change for their parent network, optimistic
  rollups can run into gas limitations or cause network congestion in the case of Ethereum.

Optimistic rollups are often used in the Ethereum ecosystem. Examples of optimistic EVM-based rollup
solutions include:

- [Optimism](https://www.optimism.io/)
- [Arbitrum](https://bridge.arbitrum.io/)
- [Unipig](https://unipig.exchange/welcome)

## Zero-knowledge Rollups

Zero-knowledge rollups (often called ZK rollups) are a non-interactive method that utilizes
zero-knowledge proofs to compute the validity of a particular set of state changes. Whereas
optimistic rollups relied on fraud proofs, ZK rollups rely on cryptographic validation in the form
of ZK proofs.

Zero-knowledge rollups are significantly faster in finalization, as the cryptographic validity proof
handles the nuance of ensuring a rollup is valid. However, the ZK rollups often suffer from
performance due to their complexity and difficult implementation into resource-constrained
environments. Because Turing completeness is also challenging to achieve due to this computational
overhead, their ability to be generalized (in terms of blockspace) is reduced. However, they have a
promising future in solving some of the problems of optimistic rollups and addressing secure
scalability.

**Benefits:**

- They only require a small amount of data availability. Often, the proof is enough to ensure
  validity.
- They can be proven trustlessly.
- Because the proof is immediately available, finality is also instantaneous.
- They have a promising future overall, as they have not reached maturity yet.

**Drawbacks:**

- They suffer from the same problems that other L2 solutions have regarding the centralization of L2
  operators.
- They are computationally expensive, and ZK circuits are difficult to implement.
- The potential for congestion is still a factor, as the amount of data could still be problematic.

## Polkadot - Native Shared Security

Whereas rollups are considered solutions for L2 protocols,
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} include this functionality natively
through its [Parachains Protocol](./learn-parachains-protocol.md). The Parachains Protocol, which is
how {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} handles network's **sharding** is
meant to accomplish the combined goals of providing security, scalability, and availability.

It enables parachains to verify their collective state and communicate with one another. Parachains
have similarities to aspects of optimistic and ZK rollups, which are reflected in how
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} handles the validity and availability
of the parachain state. [Collators](./learn-collator.md), a key part of
{{ polkadot: Polkadot's :polkadot }}{{ kusama: Kusama's :kusama }} architecture, are in principle
similar to sequencers, as collators pass data with a proof-of-validity (PoV) function for liveness
and communication with the relay chain.

Each shard, or parachain, is equipped with a unique state transition function (STF). This function
ensures that communication to the relay chain remains valid. Each STF, called runtime, is written in
[Wasm](https://wiki.polkadot.network/docs/learn-wasm). Any state transition function is valid if it
compiles to Wasm and abides by the Parachains Protocol.

Each STF runs a validity proof. The proof ([the Approval Protocol](./learn-parachains-protocol.md))
is interactive, unlike ZK rollups, which are non-interactive. Additionally, unlike ZK rollups, there
are no difficulties in creating parachains with Turing-complete logic. Each parachain is also a
full-fledged state machine (usually in the form of a blockchain). Similarly to optimistic rollups,
the Parachain Protocol also has cases where disputes and resolutions of potentially harmful para
blocks (blocks representing the parachain) can take place, in which case validators are slashed if a
bad parablock is found.

**Benefits:**

- Protocol level sharding, shared security, and interoperability.
- Each shard has a low barrier of entry in terms of development, as anything that compiles to Wasm
  is a valid target.
- Fast Finality (usually under a minute on Polkadot).
- Data availability is built-in through validators and mechanisms like
  [erasure coding](./learn-parachains-protocol.md#erasure-codes).
- No L2 implies less of a risk of incurring centralization issues for sequencers or other L2
  operators.

**Drawbacks:**

- Execution of code in Wasm could be a performance bottleneck, as it is slower than making native
  calls.
- The relay chain sets a
  [hard limit](https://paritytech.github.io/polkadot/book/protocol-overview.html?highlight=10#protocol-overview)
  on the size and weights of the PoV (Proof of Validity) blocks which contain the parachain state
  transition data.

Despite these drawbacks, {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} remains
upgradable through forkless upgrades, which allows the protocol to be easily upgradable to stay in
line with future technological advances.



---
id: learn-comparisons-avalanche
title: Polkadot vs. Avalanche
sidebar_label: Avalanche
description: Comparison between Polkadot and Avalanche.
keywords: [avalance, proof of stake, comparison]
slug: ../learn-comparisons-avalanche
---

<!-- Add more infographics to this page -->

:::info

To keep the content on this page factually correct and up-to-date,
[contributions](https://github.com/w3f/polkadot-wiki#contributing-to-documentation) are welcome.

:::

Polkadot and Avalanche both have an architecture that allows for application-specific blockchains to
be designed and connected to a primary network. In Polkadot, the primary network is the Relay-chain
and Avalanche does this with 3 main chains - the P-chain, X-chain, and C-chain. Similar to how
Polkadot has its Parachains that connect to the Relay-chain, Avalanche has what’s called
[subnets](https://docs.avax.network/subnets). Similar to Polkadot, Avalanche also uses a PoS
mechanism for achieving consensus. The validators stake their AVAX tokens in order to participate in
the PoS system and secure the network.

## Architecture

Avalanche's architecture separates the responsibility of a layer-1 smart contract platform into
three chains. This allows for a separation of concern over validators and consensus, transactions,
and smart contract execution. Avalanche uses a DAG (Directed Acyclic Graph) structure for one of its
chains which is non-linear. Polkadot uses the linear chain structure similar to Bitcoin and
Ethereum. Smart contracts in Polkadot are implemented on
[parachains](build-smart-contracts#parachains). Polkadot being a layer-0 blockchain, is not a smart
contract platform and does not have plans to support them natively.

![avalanche-network](../assets/comparisons/avalanche/avalanche-network.png)

Image source: [Avalanche docs](https://docs.avax.network/).

#### P-chain (Platform)

The P-chain is responsible for maintaining the validator set and securing the network. AVAX token
holders can spin up their own nodes and become validators by staking their tokens. Similar to the
NPoS system that Polkadot uses, Avalanche uses a Delegated PoS which allows token holders to also
delegate their token stake to existing validators instead of running their own nodes.

#### X-chain (Exchange)

The X-chain is responsible for the transaction layer of the Avalanche blockchain. It uses a UTXO
model like Bitcoin whereas Polkadot uses an account model like Ethereum. This is the only chain that
implements the DAG (Directed Acyclic Graph) model for its blockchain, making this the fastest chain
on the Avalanche network. This chain does not support smart contract execution.

#### C-chain (Contracts)

The C-chain is where the most activity will happen on the Avalanche network. It allows for different
virtual machines to execute smart contract code. Out of the box, it has support for EVM and AVM
(Avalanche VM). C-Chain runs a fork of go-ethereum called coreth that has the networking and
consensus portions replaced with Avalanche equivalents.

As Polkadot does not have a smart contract layer out of the box, the EVM and WASM smart contract
abilities lie in the Parachain layers. This is a major difference between Polkadot and Avalanche.
The smart-contract abilities of Avalanche are baked into its three-chain model.

#### Subnets or sub-networks

Avalanche defines a subnet as a dynamic set of validators that achieve consensus on a set of
blockchains. In Polkadot's terminology, Subnets can be viewed as public or private blockchain
runtimes that can be built on top of the primary network and allow a subset of the validators to
validate these runtimes. Similar to the Parachains on Polkadot, Subnets provide the freedom to
choose the transaction fee model, tokenomics, and custom compile rules. One or many validators can
start validating a subnet runtime, effectively becoming a subset of the overall validator set of the
Primary Network.

## Consensus

![avalanche-consensus-protocols](../assets/comparisons/avalanche/avalanche-consensus-protocols.png)

Image source:
[gyuho.dev](https://gyuho.dev/nakamoto-bitcoin-vs-snow-avalanche-consensus.html#snow-family-protocols).

Avalanche consensus uses a family of protocols to achieve security, liveness, and finality. These
are known as the Snow\* protocols. This group of protocols composed together uses both classical and
Nakamoto consensus as well as a Delegated Proof-of-Stake system for its block creators.

The [Snow family](https://docs.avax.network/overview/getting-started/avalanche-consensus) is a
hierarchical collection of systems used to reach finality on Avalanche:

- Slush
- Snowflake
- Snowball
- Avalanche
- Snowman
- Slushie

Compared to Polkadot, Avalanche uses an asynchronous hybrid system that is based on a classical and
Nakomoto approach. Polkadot uses a synchronous hybrid model that combines
[BABE](learn-consensus#block-production-babe) and
[GRANDPA](learn-consensus#finality-gadget-grandpa), where BABE is the algorithm used to build blocks
in a probabilistic way, and GRANDPA is a finality mechanism that uses a deterministic approach to
adding blocks to the longest chain. In the end, validators agree to whole chains, rather than single
new blocks.

### Snowball

The snowball protocol is an algorithm that nodes use to come to a consensus. Each node continuously
queries x number of validators and takes the majority consensus and adopts it as its own. This
method, in normal circumstances, will lead to the network reaching a consensus. The scalability of
Snowball is promising, as the number of participants in the network grows, the number of consensus
messages being passed around remains the same. Nodes will query no more than 20 nodes at a given
time.

### DAG(Directed Acyclic Graph)

[DAGs](https://en.wikipedia.org/wiki/Directed_acyclic_graph) are graphs consisting of vertices and
edges. In Avalanche they are used for **partial ordering** of decisions, such as transactions.
Vertices point to each other using edges, and when ordered topologically vertices and edges create a
sequence. Edges in the case of Avalanche can be conflicting, and nodes will use the snowball
algorithm to make decisions about which edges to keep and which to not.

## Staking Mechanics

Avalanche uses a Delegated Proof-of-Stake mechanism without any slashing. The barrier to entry for
staking as a full node validator is 2500 AVAX, and 25 AVAX to become a delegator. With a minimum
stake period being two weeks and a maximum period being a year, for both validators and delegators.
It is not clear from the Avalanche documentation what happens after a year, it is likely that
validators will have to re-stake and start a new period. Validators acquire points for uptime and
correctness of their work, and the remuneration of rewards depends on that.

In Polkadot the minimum stake needed to be a validator is variable, same for being a nominator. The
true minimum need to be competitive enough to be included in the active set for validators, or
successfully being chosen as a nominator depends on the minimum staked amounts on the network at a
given time. Read more about this in the [staking page](learn-staking).

<!-- Staking points and how they are occurred is not clear in the documentation -->

## Message Passing

Avalanche does not have a native trustless message-passing mechanism. Instead, it relies on bridges.
Though, because it is an EVM-compatible protocol, it's able to interoperate at a token level.
However, subnets do not have a messaging layer out of the box. Polkadot, with its [XCM](learn-xcm)
and [XCMP](learn-xcm#xcmp-cross-chain-message-passing) messaging protocols, allows for a native and
trustless messaging scheme, thus supporting the composability of chains and enabling the development
of powerful cross-chain applications.

## Governance

According to its whitepaper, Avalanche plans to have an on-chain governance mechanism. It currently
does not have an on-chain or off-chain system in production. Its governance system will limited to
updating only a few key protocol parameters which include:

- **Staking amount:** This value defines the minimal stake required to be placed as bond before
  participating in the system.
- **Minimum staking time for a node:** The minimal amount of time required for a node to stake into
  the system.
- **Maximum staking time for a node:** The maximal amount of time a node can stake.
- **Minting rate:** Reward rate function, also referred to as minting rate, determines the reward a
  participant can claim as a function of their staking amount given some number of x publicly
  disclosed nodes under its ownership, over a period of t consecutive _minimal staking time_
  timeframes, such that t*minimal staking time* ≤ _maximum staking time_.
- **Transaction fee amount:** The fee structure, which is a set of governable fees parameters that
  specify costs to various transactions.

Limiting the governance functionality is a design choice to increase predictability and safety.

Polkadot's governance mechanism has been in production from the very beginning and was used to
slowly release functionality and decentralize the initial network. It is also not limited to a few
parameters and in fact, the whole runtime is subject to change via protocol making Polkadot a
meta-protocol.

## Upgrades

The upgrades to Avalanche are administered by the protocol developers at
[Ava Labs](https://www.avalabs.org/). On Polkadot, the forkless upgrades are administered and
deployed through the on-chain governance. When performing upgrades, every single validator on the
Subnet will need to perform the identical upgrade. This requires a co-ordination effort among the
Validators of the Subnet. On Polkadot, upgrades to Parachains can be deployed automatically without
any coordination with the Validators on the relaychain.

## Conclusion

Avalanche has made some design decisions that allow for an improved smart-contract development
environment in which protocol engineers can have the freedom to create their own blockchains and
include them in the Avalanche ecosystem via subnets. The trade-offs are that the autonomy of design
is limited and blockchains have to buy into the design decisions of Avalanche's main chains. Unlike
parachains on Polkadot, Subnets are not able to share the security of the main chains. In addition
to utilizing block finality and security of the Relay-chain, parachains on Polkadot use
[XCM](learn-xcm) to pass native trustless messages, instead of having to rely on multiple bridging
solutions. However, Subnets are easy to launch when compared to parachains, given that they only
need a recommended minimum of 5 validators, which make the costs of launch predictable. Avalanche
has plans to implement shared security, interoperability, composability and on-chain governance
features which are already offered by Polkadot.

## References

1. [The Avalanche Platform Whitepaper](https://assets.website-files.com/5d80307810123f5ffbb34d6e/6008d7bbf8b10d1eb01e7e16_Avalanche%20Platform%20Whitepaper.pdf)
2. [The Avalanche Consensus Whitepaper](https://assets.website-files.com/5d80307810123f5ffbb34d6e/6009805681b416f34dcae012_Avalanche%20Consensus%20Whitepaper.pdf)
3. [The AVAX Token Dynamics Paper](https://assets.website-files.com/5d80307810123f5ffbb34d6e/6008d7bc56430d6b8792b8d1_Avalanche%20Native%20Token%20Dynamics.pdf)
4. [Nakomoto vs Snow consensus](https://gyuho.dev/nakamoto-bitcoin-vs-snow-avalanche-consensus.html#what-is-snow-consensus)



---
id: learn-comparisons-cosmos
title: Polkadot vs. Cosmos
sidebar_label: Cosmos
description: Comparison between Polkadot and Cosmos.
keywords: [cosmos, polkadot, interoperability, interoperability hub]
slug: ../learn-comparisons-cosmos
---

Polkadot and Cosmos are both protocols that provide an interface for different state machines to
communicate with each other. Both protocols are predicated on the thesis that the future will have
multiple blockchains that need to interoperate with each other rather than individual blockchains
existing in isolation.

## Model

Polkadot uses a sharded model where each shard in the protocol has an abstract state transition
function (STF). Polkadot uses WebAssembly (Wasm) as a "meta-protocol". A shard's STF can be abstract
as long as the validators on Polkadot can execute it within a Wasm environment.

The shards of Polkadot are called "[parachains](learn-parachains.md)". Every time a parachain wants
to make a state transition, it submits a block (batch of state transitions) along with a state proof
that Polkadot validators can independently verify. These blocks are finalized for the parachains
when they are finalized by Polkadot's Relay Chain, the main chain of the system. As such, all
parachains share state with the entire system, meaning that a chain re-organization of a single
parachain would require a re-organization of all parachains and the Relay Chain.

Cosmos uses a bridge-hub model that connects Tendermint chains. The system can have multiple hubs
(the primary being the "Cosmos Hub"), but each hub connects a group of exterior chains, called
"zones". Each zone is responsible for securing the chain with a sufficiently staked and
decentralized validator set. Zones send messages and tokens to each other via the hub using a
protocol called Inter-Blockchain Communication (IBC). As zones do not share state, a re-organization
of one zone would not re-organize other zones, meaning each message is trust-bound by the
recipient's trust in the security of the sender.

## Architecture

### Polkadot

Polkadot has a Relay Chain acting as the main chain of the system. All validators in Polkadot are on
the Relay Chain. Parachains have collators, who construct and propose parachain blocks to
validators. Collators don't have any security responsibilities, and thus do not require a robust
incentive system. Collators can submit a single parachain block for every Relay Chain block every 6
seconds. Once a parachain submits a block, validators perform a series of availability and validity
checks before committing it to the final chain.

Parachain slots are limited, and thus parachain candidates participate in an auction to reserve a
slot for up to two years. For chains that do not have the funding for a parachain slot or the
necessity to execute with a six-second block time, Polkadot also has
[parathreads](learn-parathreads.md). Parathreads execute on a pay-as-you-go basis, only paying to
execute a block when they need to.

In order to interact with chains that want to use their own finalization process (e.g. Bitcoin),
Polkadot has [bridge parachains](learn-bridges.md) that offer two-way compatibility.

### Cosmos

Cosmos has a main chain called a "Hub" that connects other blockchains called "zones". Cosmos can
have multiple hubs, but this overview will consider a single hub. Each zone must maintain its own
state and therefore have its own validator community. When a zone wants to communicate with another
zone, it sends packets over IBC. The Hub maintains a multi-token ledger of token balances
(non-transfer messages are relayed but their state not stored in the Hub).

Zones monitor the state of the Hub with a light client, but the Hub does not track zone states.
Zones must use a deterministic finality algorithm (currently, all use Tendermint) and implement the
IBC interface to be able to send messages to other chains through the Hub.

Cosmos can also interact with external chains by using "peg zones", which are similar to bridged
parachains.

## Consensus

Polkadot uses a hybrid [consensus](learn-consensus.md) protocol with two sub-protocols: BABE and
GRANDPA, together called "Fast Forward". BABE (Blind Assignment for Blockchain Extension) uses a
verifiable random function (VRF) to assign slots to validators and a fallback round-robin pattern to
guarantee that each slot has an author. GRANDPA (GHOST-based Recursive Ancestor Deriving Prefix
Agreement) votes on chains, rather than individual blocks. Together, BABE can author candidate
blocks to extend the finalized chain and GRANDPA can finalize them in batches (up to millions of
blocks at a time).

This isolation of tasks provides several benefits. First, it represents a reduction in transport
complexity for both block production and finalization. BABE has linear complexity, making it easy to
scale to thousands of block producers with low networking overhead. GRANDPA has quadratic
complexity, but is reduced by a factor of the latency, or how many blocks it finalizes in one batch.

Second, having the capacity to extend the chain with unfinalized blocks allows other validators to
perform extensive availability and validity checks to ensure that no invalid state transitions make
their way into the final chain.

Cosmos (both the Hub and the zones) uses Tendermint consensus, a round-robin protocol that provides
instant finality. Block production and finalization are on the same path of the algorithm, meaning
it produces and finalizes one block at a time. Because it is a PBFT-based algorithm (like GRANDPA),
it has quadratic transport complexity, but can only finalize one block at a time.

## Staking Mechanics

Polkadot uses [Nominated Proof of Stake (NPoS)](learn-staking.md) to select validators using the
[sequential Phragmén algorithm](learn-phragmen.md). The validator set size is set by governance
(1_000 validators planned) and stakers who do not want to run validator infrastructure can nominate
up to 16 validators. Phragmén's algorithm selects the optimal allocation of stake, where optimal is
based on having the most evenly staked set.

All validators in Polkadot have the same weight in the consensus protocols. That is, to reach
greater than 2/3 of support for a chain, more than 2/3 of the _validators_ must commit to it, rather
than 2/3 of the _stake._ Likewise, validator rewards are tied to their activity, primarily block
production and finality justifications, not their amount of stake. This creates an incentive to
nominate validators with lower stakes, as they will earn higher returns on their staked tokens.

The Cosmos Hub uses Bonded Proof of Stake (a variant of Delegated PoS) to elect validators. Stakers
must bond funds and submit a delegate transaction for each validator they would like to delegate to
with the number of tokens to delegate. The Cosmos Hub plans to support up to 300 validators.

Consensus voting and rewards are both stake-based in Cosmos. In the case of consensus voting, more
than 2/3 of the _stake_ must commit, rather than 2/3 of the _validators._ Likewise, a validator with
10% of the total stake will earn 10% of the rewards.

Finally, in Cosmos, if a staker does not vote in a governance referendum, the validators assume
their voting power. Because of this, many validators in Cosmos have zero commission in order to
acquire more control over the protocol. In Polkadot, governance and staking are completely disjoint;
nominating a validator does not assign any governance voting rights to the validator.

## Message Passing

Polkadot uses [Cross-Consensus Message Passing Format (XCM)](learn-xcm.md) for parachains to send
arbitrary messages to each other. Parachains open connections with each other and can send messages
via their established channels. [Collators](learn-collator.md) are full nodes of parachains and full
nodes of the Relay Chain, so collator nodes are a key component of message passing. Messages do not
pass through the Relay Chain, only proofs of post and channel operations (open, close, etc.) go into
the Relay Chain. This enhances scalability by keeping data on the edges of the system.

In the case of a chain re-organization, messages can be rolled back to the point of the
re-organization based on the proofs of post in the Relay Chain. The shared state amongst parachains
means that messages are free from trust bounds; they all operate in the same context.

Polkadot has an additional protocol called [SPREE](learn-spree.md) that provides shared logic for
cross-chain messages. Messages sent with SPREE carry additional guarantees about provenance and
interpretation by the receiving chain.

Cosmos uses a cross-chain protocol called Inter-Blockchain Communication (IBC). The current
implementation of Cosmos uses the Hub to pass tokens between zones. However, Cosmos does have a new
specification for passing arbitrary data. Nonetheless, as chains do not share state, receiving
chains must trust the security of a message's origin.

## Governance

Polkadot has a multicameral [governance](learn-governance.md) system with several avenues to pass
proposals. All proposals ultimately pass through a public referendum, where the majority of tokens
can always control the outcome. For low-turnout referenda, Polkadot uses adaptive quorum biasing to
set the passing threshold. Referenda can contain a variety of proposals, including fund allocation
from an on-chain [Treasury](learn-treasury.md). Decisions get enacted on-chain and are binding and
autonomous.

Polkadot has several on-chain, permissionless bodies. The primary one is the Council, which
comprises a set of accounts that are elected in Phragmén fashion. The Council represents minority
interests and as such, proposals that are unanimously approved of by the Council have a lower
passing threshold in the public referendum. There is also a Technical Committee for making technical
recommendations (e.g. emergency runtime upgrade to fix a bug).

Cosmos uses coin-vote signaling to pass referenda. The actual enactment of governance decisions is
carried out via a protocol fork, much like other blockchains. All token holders can vote, however,
if a delegator abstains from a vote then the validator they delegate to assume their voting power.
Validators in Polkadot do not receive any voting power based on their nominators.

## Upgrades

Using the Wasm meta-protocol, Polkadot can enact chain upgrades and successful proposals without a
hard fork. Anything that is within the STF, the transaction queue, or off-chain workers can be
upgraded without forking the chain.

As Cosmos is not based on a meta-protocol, it must enact upgrades and proposals via a normal forking
mechanism.

## Development Framework

Both Cosmos and Polkadot are designed such that each chain has its STF and both provide support for
smart contracts in both Wasm and the Ethereum Virtual Machine (EVM). Polkadot provides an
ahead-of-time Wasm compiler as well as an interpreter (Wasmi) for execution, while Cosmos only
executes smart contracts in an interpreter.

Cosmos chains can be developed using the Cosmos SDK, written in Go. The Cosmos SDK contains about 10
modules (e.g. staking, governance, etc.) that can be included in a chain's STF. The SDK builds on
top of Tendermint.

The primary development framework for parachains is [Substrate](https://substrate.io), written in
Rust. Substrate comes with FRAME, a set of about 40 modules (called "pallets") to use in a chain's
STF. Beyond simply using the pallets, Substrate adds a further layer of abstraction that allows
developers to compose FRAME's pallets by adding custom modules and configuring the parameters and
initial storage values for the chain.

:::note Polkadot can support an STF written in any language

So long as it compiles to its meta-protocol Wasm. Likewise, it could still use the Substrate client
(database, RPC, networking, etc.); it only needs to implement the primitives at the interface.

:::

## Conclusion

Polkadot was designed on the principle that scalability and interoperability require shared
validation logic to create a trust-free environment. As more blockchains are developed, their
security must be cooperative, not competitive. Therefore, Polkadot provides the shared validation
logic and security processes across chains so that they can interact knowing that their
interlocutors execute within the same security context.

The Cosmos network uses a bridge-hub model to connect chains with independent security guarantees,
meaning that when data is sent from one chain to another (inter-chain communication), the receiving
chain must trust the sending chain. Thus, each blockchain in the Cosmos network has its independent
security mechanisms. They're independently secured and do not rely on the security of other
blockchains or the hub.


---
id: learn-comparisons-kusama
title: Polkadot vs. Kusama
sidebar_label: Kusama
description: Comparing the cousins.
keywords: [polkadot, kusama, polkadot vs kusama, canary]
slug: ../learn-comparisons-kusama
---

import RPC from "./../../components/RPC-Connection";

Although they are like cousins and share many parts of their code, Polkadot and Kusama are
independent, standalone networks with different priorities. Kusama is wild and fast, and great for
bold experimentation and early-stage deployment. Polkadot is more conservative, prioritizing
stability and dependability. Cousins have their differences after all.

:::info

To get a better understanding of the key similarities and difference between Polkadot and Kusama,
checkout
[this support article](https://support.polkadot.network/support/solutions/articles/65000182146-kusama-and-polkadot-what-s-the-difference-).

:::

## Cost and Speed

Teams wishing to run a parachain are required to bond tokens as security. The bonding requirement on
Kusama is lower than on Polkadot, making it the more affordable development environment.

Another key technical difference between Polkadot and Kusama is that Kusama has modified governance
parameters that allow for faster upgrades. Kusama is up to four times faster than Polkadot. On
Polkadot, the voting period on referendums lasts
{{ polkadot: <RPC network="polkadot" path="consts.democracy.votingPeriod" defaultValue={403200} filter="blocksToDays"/> :polkadot }}
{{ kusama:  <RPC network="polkadot" path="consts.democracy.votingPeriod" defaultValue={403200} filter="blocksToDays"/> :kusama }}
days, followed by an enactment period of
{{ polkadot: <RPC network="polkadot" path="consts.democracy.enactmentPeriod" defaultValue={403200} filter="blocksToDays"/> :polkadot }}
{{ kusama: <RPC network="polkadot" path="consts.democracy.enactmentPeriod" defaultValue={403200} filter="blocksToDays"/> :kusama }}
days before the changes are enacted on-chain. On Kusama, voting lasts
{{ polkadot: <RPC network="kusama" path="consts.democracy.votingPeriod" defaultValue={100800} filter="blocksToDays"/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.democracy.votingPeriod" defaultValue={100800} filter="blocksToDays"/> :kusama }}
days, followed by an
{{ polkadot: <RPC network="kusama" path="consts.democracy.enactmentPeriod" defaultValue={115200} filter="blocksToDays"/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.democracy.enactmentPeriod" defaultValue={115200} filter="blocksToDays"/> :kusama }}
day enactment period. This means stakeholders need to stay active and vigilant if they want to keep
up with all the proposals, referenda, and upgrades, and validators on Kusama often need to update on
short notice.

This does not mean that the Kusama blockchain itself is faster, in the sense of faster block times
or transaction throughput (these are the same on both networks), but that there's a shorter amount
of time between governance events such as proposing new referenda, voting, and enacting approved
upgrades. This allows Kusama to adapt and evolve faster than Polkadot.

## Canary network

The initial use case for Kusama was as a pre-production environment, a “canary network”.

Canary is a type of bird: back in the day, coal miners would put canaries into coal mines as a way
to measure the amount of toxic gases in the tunnels. Similarly, canary testing is a way to validate
software by releasing software to a limited number of users, or perhaps, an isolated environment -
without hurting a wide range of users.

Releases made onto Kusama can be thought of as
[Canary Releases](https://martinfowler.com/bliki/CanaryRelease.html). These releases are usually
staged. In Kusama's early days, the network won't just be used for parachain candidates to innovate
and test changes, but a proof of concept for Polkadot's sharded model.

Kusama is not simply a testnet, the blockchain is fully functional with attached economic value, and
own governance. The future of Kusama is in the hands of its participants. In a typical blockchain
development pipeline, Kusama would sit in between a "testnet" and a "mainnet":

:::info Testnet --> Kusama --> Polkadot

:::

As you can imagine, building on Kusama first allows teams to test things out in a live, fully
decentralized, and community-controlled network with real-world conditions and lower stakes in the
event of problems or bugs than on Polkadot.

Many projects will maintain parachains on both networks, experimenting and testing new technologies
and features on Kusama before deploying them to Polkadot. Some teams will decide just to stay on
Kusama, which is likely to be a place where we see some exciting experimentation with new
technologies going forward. Projects that require high-throughput but don’t necessarily require
bank-like security, such as some gaming, social networking, and content distribution applications,
are particularly good candidates for this use case.

Kusama may also prove to be the perfect environment for ambitious experiments with new ideas and
innovations in areas like governance, incentives, monetary policy, and DAOs (decentralized
autonomous organizations). Future upgrades to the Polkadot runtime will also likely be deployed to
Kusama before Polkadot mainnet. This way, not only will we be able to see how these new technologies
and features will perform under real-world conditions before bringing them to Polkadot, but teams
who have deployed to both networks will also get an advanced look at how their own technology will
perform under those upgrades.

## Going forward

Ultimately, Kusama and Polkadot will live on as independent, standalone networks with their own
communities, their own governance, and their own complementary use cases, though they will continue
to maintain a close relationship, with many teams likely deploying applications to both networks. In
the future, we’re also likely to see Kusama bridged to Polkadot for cross-network interoperability.
Web3 Foundation remains committed to both networks going forward, providing crucial support and
guidance to teams building for the ecosystem.

## Explore more

- [About Kusama](https://kusama.network)
- [The Kusama Wiki](https://guide.kusama.network)
- [Kusama on Polkadot-JS Apps](https://kusama.dotapps.io)
- [Polkadot and Kusama: What's the difference?](https://support.polkadot.network/support/solutions/articles/65000182146-kusama-and-polkadot-what-s-the-difference-)



---
id: learn-comparisons
title: Polkadot Comparisons
sidebar_label: Other Comparisons
description: Comparison between Polkadot and ETH 1.0 and BSC.
keywords: [comparisons, polkadot, blockchain]
slug: ../learn-comparisons
---

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} is a blockchain technology but makes
some innovations that sets it apart from other popular chains.

:::info In-depth Comparisons for multi-chain ecosystems

See the in-depth comparisons for [Ethereum 2.0](./learn-comparison-ethereum-2.md),
[Cosmos](./learn-comparisons-cosmos.md) and [Avalanche](./learn-comparisons-avalanche.md).

:::

## Ethereum 1.x

[Ethereum](https://ethereum.org) is a smart contract blockchain that allows for general computation
to be deployed on-chain and operated across the p2p network. Ethereum 1.x refers to the current
Ethereum release and the immediately planned future upgrades.

The difference between Ethereum 1.x and
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} is quite large. Ethereum is a single
chain that allows developers to extend its functionality through the deployment of blobs of code
onto the chain (called smart contracts).
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}, as described in the whitepaper, is a
fully extensible and scalable blockchain network that provides security and interoperability through
shared state.

In practical terms, this means that the layer of abstraction between these two projects is
remarkably different for developers. In Ethereum, developers write smart contracts that all execute
on a single virtual machine, called the Ethereum Virtual Machine (EVM). In
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}, however, developers write their
logic into individual blockchains, where the interface is part of the state transition function of
the blockchain itself. {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} will also
support smart contract blockchains for Wasm and EVM to provide compatibility with existing
contracts, but will not have smart contract functionality on its core chain, the Relay Chain.

As such, {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} is a possible augmentation
and scaling method for Ethereum 1.x, rather than competition.

## Binance Smart Chain

[Binance Chain](https://www.binance.com) is a Proof of Stake Authority (PoSA) blockchain used to
exchange digital assets on Binance DEX. Binance Smart Chain is an EVM-compatible smart contract
chain bridged to Binance Chain. Together, they form the Binance Dual Chain System. Binance Smart
Chain is also a Proof of Stake Authority chain and allows users to create smart contracts and dapps.

Both chains are built with Cosmos SDK and therefore are a part of the
[Cosmos](learn-comparisons-cosmos.md) ecosystem. Due to specifics of the Cosmos architecture,
interoperability of Binance Smart Chain is based on bridges. This means all validators of both
chains are also bridge operators, therefore the security of the system relies on trusting
validators. At the moment, there are 21 Binance Smart Chain validator nodes.

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} has an entirely different purpose, as
it was built to connect and secure unique blockchains. It is a protocol on which single blockchains
(such as Binance Smart Chain) could be built and benefit from shared security, interoperability and
scalability. Interoperability within {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}
is based on pooled security on {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}, and
the security of the entire {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} network,
and has much stronger economic security.

Scalability based on bridges relies on each bridged chain finding its own set of validators,
therefore duplicate resources are required. Scalability on
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} is based on the security of the Relay
Chain, and as the number of validators in the active set on
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} are increased, more parachains can be
supported.



---
id: learn-consensus
title: Polkadot Consensus
sidebar_label: Consensus
description: The Consensus Mechanism of Polkadot.
keywords: [consensus, proof of stake, nominated proof of stake, hybrid consensus, finality]
slug: ../learn-consensus
---

## Why do we need Consensus?

Consensus is a method for coming to agreement over a shared state. In order for the state of the
blockchain to continue to build and move forward, all nodes in the network must agree and come to
consensus. It is the way that the nodes in a decentralized network are able to stay synced with each
other. Without consensus for the decentralized network of nodes in a blockchain, there is no way to
ensure that the state one node believes is true will be shared by the other nodes. Consensus aims to
provide the _objective_ view of the state amid participants who each have their own _subjective_
views of the network. It is the process by which these nodes communicate and come to agreement, and
are able to build new blocks.

## What are PoW and PoS?

Proof of Work (PoW) and Proof of Stake (PoS) have been inaccurately used as short hand to refer to
consensus mechanisms of blockchains, but that does not capture the full picture. PoW is the method
for agreeing on a block author and part of the fuller [Nakamoto consensus](#nakamoto-consensus) that
also encompasses a chain selection algorithm (longest chain rule in Bitcoin). Similarly, PoS is a
set of rules for selecting the validator set and does not specify a chain selection rule or how a
chain might reach finality. PoS algorithms have traditionally been paired with an algorithm for
coming to Byzantine agreement between nodes. For example, [Tendermint](learn-comparisons-cosmos.md)
is a practical Byzantine fault tolerant algorithm that uses PoS as its validator set selection
method.

## Why not Proof of Work?

Although simple and effective in coming to a decentralized consensus on the next block producer,
proof of work with Nakamoto consensus consumes an incredible amount of energy, has no economic or
provable finality, and has no effective strategy in resisting cartels.

## Nominated Proof of Stake

In traditional PoS systems, block production participation is dependent on token holdings as opposed
to computational power. While PoS developers usually have a proponent for equitable participation in
a decentralized manner, most projects end up proposing some level of centralized operation, where
the number of validators with full participation rights is limited. These validators are often seen
to be the most wealthy, and, as a result, influence the PoS network as they are the most staked.
Usually, the number of candidates to maintain the network with the necessary knowledge (and
equipment) is limited; this can directly increase operational costs as well. Systems with a large
number of validators tend to form pools to decrease the variance of their revenue and profit from
economies of scale. These pools are often off-chain.

A way to alleviate this is to implement pool formation on-chain and allow token holders to vote with
their stake for validators to represent them.

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} uses NPoS (Nominated Proof-of-Stake)
as its mechanism for selecting the validator set. It is designed with the roles of **validators**
and **nominators**, to maximize chain security. Actors who are interested in maintaining the network
can run a validator node.

Validators assume the role of producing new blocks in [BABE](#block-production-babe), validating
parachain blocks, and guaranteeing finality. Nominators can choose to back select validators with
their stake. Nominators can approve candidates that they trust and back them with their tokens.

## Probabilistic vs. Provable Finality

A pure Nakamoto consensus blockchain that runs PoW is only able to achieve the notion of
_probabilistic finality_ and reach _eventual consensus_. Probabilistic finality means that under
some assumptions about the network and participants, if we see a few blocks building on a given
block, we can estimate the probability that it is final. Eventual consensus means that at some point
in the future, all nodes will agree on the truthfulness of one set of data. This eventual consensus
may take a long time and will not be able to be determined how long it will take ahead of time.
However, finality gadgets such as GRANDPA (GHOST-based Recursive ANcestor Deriving Prefix Agreement)
or Ethereum's Casper FFG (the Friendly Finality Gadget) are designed to give stronger and quicker
guarantees on the finality of blocks - specifically, that they can never be reverted after some
process of Byzantine agreements has taken place. The notion of irreversible consensus is known as
_provable finality._

In the [GRANDPA paper](https://github.com/w3f/consensus/blob/master/pdf/grandpa.pdf), it is phrased
in this way:

:::note

We say an oracle A in a protocol is _eventually consistent_ if it returns the same value to all
participants after some unspecified time.

:::

## Hybrid Consensus

There are two protocols we use when we talk about the consensus protocol of
{{ polkadot: Polkadot, :polkadot }}{{ kusama: Kusama, :kusama }} GRANDPA and BABE (Blind Assignment
for Blockchain Extension). We talk about both of these because
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} uses what is known as _hybrid
consensus_. Hybrid consensus splits up the finality gadget from the block production mechanism.

This is a way of getting the benefits of probabilistic finality (the ability to always produce new
blocks) and provable finality (having a universal agreement on the canonical chain with no chance
for reversion) in {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}. It also avoids the
corresponding drawbacks of each mechanism (the chance of unknowingly following the wrong fork in
probabilistic finality, and a chance for "stalling" - not being able to produce new blocks - in
provable finality). By combining these two mechanisms,
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} allows for blocks to be rapidly
produced, and the slower finality mechanism to run in a separate process to finalize blocks without
risking slower transaction processing or stalling.

Hybrid consensus has been proposed in the past. Notably, it was proposed (now defunct) as a step in
Ethereum's transition to proof of stake in [EIP 1011](http://eips.ethereum.org/EIPS/eip-1011), which
specified [Casper FFG](#casper-ffg).

## Block Production: BABE

BABE (Blind Assignment for Blockchain Extension) is the block production mechanism that runs between
the validator nodes and determines the authors of new blocks. BABE is comparable as an algorithm to
[Ouroboros Praos](https://eprint.iacr.org/2017/573.pdf), with some key differences in chain
selection rule and slot time adjustments. BABE assigns block production slots to validators
according to stake and using the {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}
[randomness cycle](./learn-cryptography.md#randomness). The chains runtime is required to provide
the BABE authority list and randomness to the host via a consensus message in the header of the
first block of each epoch.

BABE execution happens in sequential non-overlapping phases known as epochs. Each epoch is divided
into a predefined number of slots. All slots in each epoch are sequentially indexed starting from 0
(slot number). At the beginning of each epoch, the BABE node needs to run the
[Block-Production-Lottery algorithm](https://spec.polkadot.network/#algo-block-production-lottery)
to find out in which slots it should produce a block and gossip to the other block producers.

Validators participate in a lottery for every slot, which will inform whether or not they are the
block producer candidate for that slot. Slots are discrete units of time of approximately 6 seconds
in length. Because the mechanism of allocating slots to validators is based on a randomized design,
multiple validators could be candidates for the same slot. Other times, a slot could be empty,
resulting in inconsistent block time.

### Multiple Validators per Slot

When multiple validators are block producer candidates in a given slot, all will produce a block and
broadcast it to the network. At that point, it's a race. The validator whose block reaches most of
the network first wins. Depending on network topology and latency, both chains will continue to
build in some capacity, until finalization kicks in and amputates a fork. See Fork Choice below for
how that works.

### No Validators in Slot

When no validators have rolled low enough in the randomness lottery to qualify for block production,
a slot can remain seemingly blockless. We avoid this by running a secondary, round-robin style
validator selection algorithm in the background. The validators selected to produce blocks through
this algorithm always produce blocks, but these _secondary_ blocks are ignored if the same slot also
produces a primary block from a [VRF-selected](./learn-cryptography.md#randomness) validator. Thus,
a slot can have either a _primary_ or a _secondary_ block, and no slots are ever skipped.

For more details on BABE, please see the
[BABE paper](https://research.web3.foundation/Polkadot/protocols/block-production/Babe).

## Finality Gadget: GRANDPA

GRANDPA (GHOST-based Recursive ANcestor Deriving Prefix Agreement) is the finality gadget that is
implemented for the {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} Relay Chain.

The {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} Host uses the GRANDPA Finality
protocol to finalize blocks. Finality is obtained by consecutive rounds of voting by the validator
nodes. Validators execute GRANDPA finality process in parallel to Block Production as an independent
service.

It works in a partially synchronous network model as long as 2/3 of nodes are honest and can cope
with 1/5 Byzantine nodes in an asynchronous setting.

A notable distinction is that GRANDPA reaches agreements on chains rather than blocks, greatly
speeding up the finalization process, even after long-term network partitioning or other networking
failures.

In other words, as soon as more than 2/3 of validators attest to a chain containing a certain block,
all blocks leading up to that one are finalized at once.

### Protocol

Please refer to [the GRANDPA paper](https://github.com/w3f/consensus/blob/master/pdf/grandpa.pdf)
for a full description of the protocol.

### Implementation

The
[Substrate implementation of GRANDPA](https://github.com/paritytech/substrate/blob/master/frame/grandpa/src/lib.rs)
is part of Substrate Frame.

## Bridging: BEEFY

The BEEFY (Bridge Efficiency Enabling Finality Yielder) is a secondary protocol to GRANDPA to
support efficient bridging between the
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} network (relay chain) and remote,
segregated blockchains, such as Ethereum, which were not built with the
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} interchain operability in mind. The
protocol allows participants of the remote network to verify finality proofs created by the
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} relay chain validators. In other
words: clients in the Ethereum network should able to verify that the
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} network is at a specific state.

Storing all the information necessary to verify the state of the remote chain, such as the block
headers, is too expensive. BEEFY stores the information in a space-efficient way and clients can
request additional information over the protocol.

For additional implementation details, check out
[this](https://spec.polkadot.network/#sect-grandpa-beefy) section of the Polkadot Spec.

## Fork Choice

Bringing BABE and GRANDPA together, the fork choice of
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} becomes clear. BABE must always build
on the chain that has been finalized by GRANDPA. When there are forks after the finalized head, BABE
provides probabilistic finality by building on the chain with the most primary blocks.

![Best chain choice](../assets/best_chain.png)

In the above image, the black blocks are finalized, and the yellow blocks are not. Blocks marked
with a "1" are primary blocks; those marked with a "2" are secondary blocks. Even though the topmost
chain is the longest chain on the latest finalized block, it does not qualify because it has fewer
primaries at the time of evaluation than the one below it.

# Comparisons

## Nakamoto consensus

Nakamoto consensus consists of the longest chain rule using proof of work as its Sybil resistance
mechanism and leader election.

Nakamoto consensus only gives us probabilistic finality. Probabilistic finality states that a block
in the past is only as safe as the number of confirmations it has, or the number of blocks that have
been built on top of it. As more blocks are built on top of a specific block in a Proof of Work
chain, more computational work has been expended behind this particular chain. However, it does not
guarantee that the chain containing the block will always remain the agreed-upon chain, since an
actor with unlimited resources could potentially build a competing chain and expend enough
computational resources to create a chain that did not contain a specific block. In such a
situation, the longest chain rule employed in Bitcoin and other proof of work chains would move to
this new chain as the canonical one.

## PBFT / Tendermint

Please see the [relevant section](learn-comparisons-cosmos.md#consensus) in the Cosmos comparison
article.

## Casper FFG

The two main differences between GRANDPA and Casper FFG are:

- in GRANDPA, different voters can cast votes simultaneously for blocks at different heights
- GRANDPA only depends on finalized blocks to affect the fork-choice rule of the underlying block
  production mechanism

# Resources

- [BABE paper](https://research.web3.foundation/Polkadot/protocols/block-production/Babe) - The
  academic description of the BABE protocol.
- [GRANDPA paper](https://github.com/w3f/consensus/blob/master/pdf/grandpa.pdf) - The academic
  description of the GRANDPA finality gadget. Contains formal proofs of the algorithm.
- [Rust implementation](https://github.com/paritytech/finality-grandpa) - The reference
  implementation and the accompanying
  [Substrate pallet](https://github.com/paritytech/substrate/blob/master/frame/grandpa/src/lib.rs).
- [Block Production and Finalization in Polkadot](https://www.crowdcast.io/e/polkadot-block-production) -
  An explanation of how BABE and GRANDPA work together to produce and finalize blocks on Kusama,
  with Bill Laboon.
- [Block Production and Finalization in Polkadot: Understanding the BABE and GRANDPA Protocols](https://www.youtube.com/watch?v=1CuTSluL7v4&t=4s) -
  An academic talk by Bill Laboon, given at MIT Cryptoeconomic Systems 2020, describing Polkadot's
  hybrid consensus model in-depth.




---
id: learn-controller
title: Controller Accounts
sidebar_label: Controller Accounts
description: Controller Accounts used in Staking.
keywords: [nominated proof of stake, staking, controller]
slug: ../learn-controller
---

:::info Controller accounts are deprecated

Controller accounts are deprecated. For more information, see
[this discussion](https://forum.polkadot.network/t/staking-controller-deprecation-plan-staking-ui-leads-comms/2748).

:::

Controller accounts were used for staking and were a "less-powerful" version of staking proxies.
Controllers could only sign for unbonding and rebonding funds, nominating and changing the reward
destination. The stash account was still used to bond more funds and change the controller.
Controller accounts became redundant and added unnecessary complexity to the staking mechanics.

![controller-accounts](../assets/stash-controller.png)

With the setup shown above, the stash account was not entirely isolated. More complicated designs to
fully isolate the stash account included having both controller and staking proxies (see below).

## Stash as Controller

It was unnecessary to have a controller if you had a staking proxy. In this case the stash was also
set to be the controller, and the account security would not have been compromised. The staking
proxy was used to sign all staking-relate transactions. Note that you needed to sign with the stash
to change the staking proxy.

![stash-as-controller](../assets/stash-as-controller.png)

This past situation was similar to the present setup, except that now there is no option to set the
stash as controller and that the action of "changing the controller" is missing. From a practical
perspective, we need to use only one account and remember one password to sign for all
staking-related transactions. From a security perspective, who controls the staking proxy controls
our staking actions.

## Stash not as Controller

If the stash and controller were different accounts, the staking proxy was used to bond more funds
and change the controller. Thus the staking proxy was used to sign for those transactions that were
used less often and usually signed by the stash.

![stash-not-as-controller](../assets/stash-not-as-controller.png)

From a practical perspective, there were two accounts, and we needed to remember two passwords. From
a security perspective, the party who wanted to control our staking actions was required to control
two accounts.



---
id: learn-crowdloans
title: Parachain Crowdloans
sidebar_label: Parachain Crowdloans
description: Polkadot's Crowdloans and How to Participate.
keywords: [crowdloans, parachains, lending, auction]
slug: ../learn-crowdloans
---

import RPC from "./../../components/RPC-Connection";

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} allows parachains to source tokens
for their parachain bids in a decentralized crowdloan.

:::note Contributing to a crowdloan

If you are here for guidance on how to contribute to a crowdloan, watch the video below or read this
[support article on crowdloans](https://support.polkadot.network/support/solutions/articles/65000177341-how-to-participate-in-crowdloans-on-polkadot-or-kusama).

:::

[![Crowdloans on Polkadot JS](https://img.youtube.com/vi/AA9mPANmzmU/0.jpg)](https://youtu.be/AA9mPANmzmU)

:::note Testing on Rococo

For information on how to participate in the crowdloan and parachain auction testing on Rococo,
please see the [Rococo content](../build/build-parachains.md##testing-a-parachains:-rococo-testnet)

:::

## Crowdloan Campaigns vs Parachain Auctions

It is important to recognize that starting a crowdloan campaign is **optional** for participating in
a parachain slot auction. The parachain slot auction can also be won directly through self-funding
without community involvement. To reiterate, crowdloan campaigns are just one of the means to win
auctions, which allow the community to participate in a trustless and permissionless way.

Let's look at a scenario where Project A is hoping to gain a parachain slot on
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}, but they don't have enough tokens to
bid directly to win the parachain auction. Project A could benefit from starting a new crowdloan
campaign to help secure a parachain slot. Crowdloans are trustless and are supported natively on
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}, allowing the community to bond their
tokens on Project A's behalf for the entire parachain lease duration. This will allow Project A to
compete with projects that may have access to greater capital, given the project has sufficient
community support. In return, the community contributors are rewarded by the projects that win the
parachain slot, which would compensate for the opportunity cost of bonding their tokens for the
lease duration.

On the other hand, let's say Project B, which is more established and has access to capital, is
hoping to secure a parachain slot through self-funding. Project B is not relying on community
funding (at least via the crowdloan mechanism), so they must determine how much funding they can
allocate towards winning a slot.

Project B fully controls how much they are willing to contribute to gaining a parachain slot.
Project B need not work on creating a reward model for community contributors like Project A. In
contrast, crowdloan campaigns benefit projects with access to limited capital but have strong
community support. They are also beneficial for projects that can successfully bid to win the
auction with self-funding but are looking for a mechanism to bootstrap their community and get
noticed by the key actors in the ecosystem.

It is publicly visible on-chain whether or not a project is bidding directly or through a crowdloan
campaign. More details regarding creating and executing a crowdloan campaign are provided below.

## Starting a Crowdloan Campaign

Anyone who has registered a parachain can create a new crowdloan campaign for a slot by depositing a
specified number of tokens. A campaign is configured as a range of slots (i.e. the duration of the
[parachain](learn-parachains.md) will bid for), a cap, and a duration. The duration can last over
several auctions as long as the range of slots matches those of the auction (i.e. the first lease
period of the crowdloan is the same or bigger than that of the auction). This means a team will not
need to restart the campaign just because they do not secure a slot on their first attempt.

:::info Crowdloan Submission Deposit Required

To create a new crowdloan campaign, your account must have
{{ polkadot: 500 DOT :polkadot }}{{ kusama: 100 KSM :kusama }} transferrable which will be reserved
for the duration of the crowdloan.

:::

When setting the parameters of a crowdloan campaign, consider the following:

- A crowdloan campaign can start well before the auction slot is opened.
- The campaign creation form requires setting a crowdloan cap &mdash; the maximum amount a campaign
  can collect. A team can still win an [auction](learn-auction.md) if the cap is not reached.
- Set the desired end of the crowdloan in the "Ending block" field. This helps ensure that the
  crowdloan is live during the entire auction. For example, if an auction starts in three days and
  lasts five days, you should set your crowdloan to end in 10 days or a similar timescale.
- One way of calculating the ending block number is adding: `(10 * 60 * 24 * 7) * (x * 6) + y`

  - `x` is the number of auction periods you want the crowdloan to continue for
  - `y` is the current block number

  - `(Blocks/Min * Min/Hour * Hour/Day * Day/Week) * (x[Period] * Week/Period) + y[BlockNumber]`

  - "First period" field refers to the first period you want to bid for. If the current auction
    encompasses periods `(3, 4, 5, 6)`, your first period can be at least `3`. The last slot must
    also be within that range.
  - You can only cancel an ongoing crowdloan if no contributions have been made. Your deposit will
    be returned to you.

Before the start of the crowdloan campaign, the owner will upload the parachain data. Once the
crowdloan is live, **the parachain configuration will be locked** and will be deployed as the
parachain's runtime. Of course, once the parachain is running, it can always change via runtime
upgrades (as determined through its local governance).

## Supporting a Crowdloan Campaign

### Contributing to Crowdloans

:::info Minimum Crowdloan Contribution

The minimum balance for contributions for a crowdloan campaign is currently set to
{{ polkadot: <RPC network="polkadot" path="consts.crowdloan.minContribution" defaultValue={50000000000} filter="humanReadable"/>. :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.crowdloan.minContribution" defaultValue={100000000000} filter="humanReadable"/>. :kusama }}
This is to make crowdloans as accessible as possible while maintaining a balance to justify using
the network's resources.

:::

Each created campaign will have an index. Once a crowdloan campaign is open, anyone can participate
by sending a transaction referencing the campaign's index. Tokens used to participate must be
transferable &mdash; that is, not locked for any reason, including staking, vesting, and governance
&mdash; because they will be moved into a module-controlled account that was generated uniquely for
this campaign. See [system accounts](./learn-account-advanced.md#system-accounts) for more
information.

:::caution Do not send Crowdloan contributions directly to the Parachain address

All crowdloan contributions are handled by the Crowdloan module’s logic, where a campaign is
identified by an index, not by address. **Never transfer tokens to an address in support of a
campaign**.

:::

It is up to individual parachain teams to decide if and how they want to reward participants who
forgo staking and choose to lock their tokens in support of the parachain’s campaign. As one can
imagine, rewards will take many forms and may vary widely among projects.

If a crowdloan campaign is successful, that parachain will be on-boarded to the Relay Chain. The
collective tokens will be locked in that parachain's account for the entire duration that it is
active.

### Withdraw Crowdloaned Tokens

Participants will be able to reclaim their tokens in one of two ways:

- If the campaign succeeds, the parachain will enter a retirement phase at the end of its lease.
  During this phase, participants can withdraw the tokens with which they participated.
- If the campaign is unsuccessful, this retirement phase will begin at its configured end, and
  participants can likewise withdraw their tokens.

:::tip `crowdloan.contribute` extrinsic is trustless

Contributing to a crowdloan through Polkadot JS Apps (which uses `crowdloan.contribute` extrinsic)
guarantees that you receive your tokens after the campaign ends. If you intend to contribute through
other websites and custodial service providers like central exchanges, review their terms and
conditions thoroughly and assess the associated risks.

:::

Note: When the lease periods won by the crowdloan have finished, or the crowdloan has ended without
winning a slot, anyone can trigger the refund of crowdloan contributions back to their original
owners. This can be done through the permissionless `crowdloan.refund` extrinsic available on
Polkadot JS Apps > Developer > Extrinsics page, by specifying the parachain ID. This extrinsic may
need to be issued multiple times if the list of contributors is too long. All contributions must be
returned before the crowdloan is entirely deleted.

![Crowdloan refund](../assets/crowdloan-refund.png)

Many projects will have dashboards that allow users to participate in their crowdloans. PolkadotJS
apps also offer a breakdown of ongoing crowdloans on the
[Apps page](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkusama-rpc.polkadot.io#/parachains/crowdloan).

Here is an example of the crowdloans in play during the very first Kusama auction.

![crowdloan dashboard](../assets/kusama-crowdloans.png)

Furthermore, check out this video on
[How to Participate in Crowdloans](https://www.youtube.com/watch?v=YrTxDufrcQM) for steps on how to
access available crowdloans on PolkadotJS apps.



---
id: learn-cryptography
title: Cryptography on Polkadot
sidebar_label: Cryptography
description: Cryptographic Functions used in Polkadot.
keywords:
  [cryptography, hashing, keypair, signing, keys, randomness, verifiable random function, VDF]
slug: ../learn-cryptography
---

This is a high-level overview of the cryptography used in Polkadot. It assumes that you have some
knowledge about cryptographic primitives that are generally used in blockchains such as hashes,
elliptic curve cryptography (ECC), and public-private keypairs.

For detailed descriptions on the cryptography used in Polkadot please see the more advanced
[research wiki](https://research.web3.foundation).

## Hashing Algorithm

The hashing algorithm used in Polkadot is
[Blake2b](<https://en.wikipedia.org/wiki/BLAKE_(hash_function)#BLAKE2>). Blake2 is considered to be
a very fast cryptographic hash function that is also used in the cryptocurrency
[Zcash](https://z.cash).

## Keypairs and Signing

Polkadot uses Schnorrkel/Ristretto x25519 ("sr25519") as its key derivation and signing algorithm.

Sr25519 is based on the same underlying [Curve25519](https://en.wikipedia.org/wiki/Curve25519) as
its EdDSA counterpart, [Ed25519](https://en.wikipedia.org/wiki/EdDSA#Ed25519). However, it uses
Schnorr signatures instead of the EdDSA scheme. Schnorr signatures bring some noticeable benefits
over the ECDSA/EdDSA schemes. For one, it is more efficient and still retains the same feature set
and security assumptions. Additionally, it allows for native multisignature through
[signature aggregation](https://bitcoincore.org/en/2017/03/23/schnorr-signature-aggregation/).

The names Schnorrkel and Ristretto come from the two Rust libraries that implement this scheme, the
[Schnorrkel](https://github.com/w3f/schnorrkel) library for Schnorr signatures and the
[Ristretto](https://ristretto.group/ristretto.html) library that makes it possible to use cofactor-8
curves like Curve25519.

## Keys

Public and private keys are an important aspect of most crypto-systems and an essential component
that enables blockchains like {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} to
exist.

### Account Keys

Account keys are keys that are meant to control funds. They can be either:

- The vanilla `ed25519` implementation using Schnorr signatures.
- The Schnorrkel/Ristretto `sr25519` variant using Schnorr signatures.
- ECDSA signatures on secp256k1

There are no differences in security between `ed25519` and `sr25519` for simple signatures. We
expect `ed25519` to be much better supported by commercial HSMs for the foreseeable future. At the
same time, `sr25519` makes implementing more complex protocols safer. In particular, `sr25519` comes
with safer version of many protocols like HDKD common in the Bitcoin and Ethereum ecosystem.

### Stash and Staking Proxy Keys

When we talk about stash and staking proxy keys, we usually talk about them in the context of
running a validator or nominating, but they are useful concepts for all users to know. Both keys are
types of account keys. They are distinguished by their intended use, not by an underlying
cryptographic difference. All the info mentioned in the parent section applies to these keys. When
creating new staking proxy or stash keys, all cryptography supported by account keys are an
available option.

The staking proxy key is a semi-online key that will be in the direct control of a user, and used to
submit manual extrinsics. For validators or nominators, this means that the proxy key will be used
to start or stop validating or nominating. Proxy keys should hold some
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} to pay for fees, but they should not be used
to hold huge amounts or life savings. Since they will be exposed to the internet with relative
frequency, they should be treated carefully and occasionally replaced with new ones.

The stash key is a key that will, in most cases, be a cold wallet, existing on a piece of paper in a
safe or protected by layers of hardware security. It should rarely, if ever, be exposed to the
internet or used to submit extrinsics. The stash key is intended to hold a large amount of funds. It
should be thought of as a saving's account at a bank, which ideally is only ever touched in urgent
conditions. Or, perhaps a more apt metaphor is to think of it as buried treasure, hidden on some
random island and only known by the pirate who originally hid it.

Since the stash key is kept offline, it must be set to have its funds bonded to a particular staking
proxy. For non-spending actions, the staking proxy has the funds of the stash behind it. For
example, in nominating, staking, or voting, the proxy can indicate its preference with the weight of
the stash. It will never be able to actually move or claim the funds in the stash key. However, if
someone does obtain your proxy key, they could use it for slashable behavior, so you should still
protect it and change it regularly.

### Session Keys

Session keys are hot keys that must be kept online by a validator to perform network operations.
Session keys are typically generated in the client, although they don't have to be. They are _not_
meant to control funds and should only be used for their intended purpose. They can be changed
regularly; your staking proxy only need create a certificate by signing a session public key and
broadcast this certificate via an extrinsic.

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} uses six session keys:

- Authority Discovery: sr25519
- GRANDPA: ed25519
- BABE: sr25519
- I'm Online: sr25519
- Parachain Assignment: sr25519
- Parachain Validator: ed25519

BABE requires keys suitable for use in a [Verifiable Random Function](#vrf) as well as for digital
signatures. Sr25519 keys have both capabilities and so are used for BABE.

In the future, we plan to use a BLS key for GRANDPA because it allows for more efficient signature
aggregation.

### FAQ about Keys

#### Why was `ed25519` selected over `secp256k1`?

The original key derivation cryptography that was implemented for
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} and Substrate chains was `ed25519`,
which is a Schnorr signature algorithm implemented over the Edward's Curve 25519 (so named due to
the parameters of the curve equation).

Most cryptocurrencies, including Bitcoin and Ethereum, currently use ECDSA signatures on the
secp256k1 curve. This curve is considered much more secure than NIST curves, which
[have possible backdoors from the NSA](#appendix-a-on-the-security-of-curves). The Curve25519 is
considered possibly _even more_ secure than this one and allows for easier implementation of Schnorr
signatures. A recent patent expiration on it has made it the preferred choice for use in
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}.

The choice of using Schnorr signatures over using ECDSA is not so cut and dried. Jeff Burdges (a
Web3 researcher) provides additional details on the decision in this
[research post](https://research.web3.foundation/Polkadot/security/keys) on the topic:

:::info Choosing Schnorr signatures over ECDSA signatures

There is one sacrifice we make by choosing Schnorr signatures over ECDSA signatures for account
keys: Both require 64 bytes, but only ECDSA signatures communicate their public key. There are
obsolete Schnorr variants that support recovering the public key from a signature, but they break
important functionality like hierarchical deterministic key derivation. In consequence, Schnorr
signatures often take an extra 32 bytes for the public key.

:::

But ultimately the benefits of using Schnorr signatures outweigh the tradeoffs, and future
optimizations may resolve the inefficiencies pointed out in the quote above.

#### What is `sr25519` and where did it come from?

Some context: The Schnorr signatures over the Twisted Edward's Curve25519 are considered secure,
however Ed25519 has not been completely devoid of its bugs. Most notably,
[Monero and all other CryptoNote currencies](https://www.getmonero.org/2017/05/17/disclosure-of-a-major-bug-in-cryptonote-based-currencies.html)
were vulnerable to a double spend exploit that could have potentially led to undetected, infinite
inflation.

These exploits were due to one peculiarity in Ed25519, which is known as its cofactor of 8. The
cofactor of a curve is an esoteric detail that could have dire consequences for the security of
implementation of more complex protocols.

Conveniently, [Mike Hamburg's Decaf paper](https://www.shiftleft.org/papers/decaf/index.xhtml)
provides a possible path forward to solving this potential bug. Decaf is basically a way to take
Twisted Edward's Curves cofactor and mathematically change it with little cost to performance and
gains to security.

The Decaf paper approach by the [Ristretto Group](https://ristretto.group/) was extended and
implemented in Rust to include cofactor-8 curves like the Curve25519 and makes Schnorr signatures
over the Edward's curve more secure.

Web3 Foundation has implemented a Schnorr signature library using the more secure Ristretto
compression over the Curve25519 in the [Schnorrkel](https://github.com/w3f/schnorrkel) repository.
Schnorrkel implements related protocols on top of this curve compression such as HDKD, MuSig, and a
verifiable random function (VRF). It also includes various minor improvements such as the hashing
scheme STROBE that can theoretically process huge amounts of data with only one call across the Wasm
boundary.

The implementation of Schnorr signatures that is used in Polkadot and implements the Schnorrkel
protocols over the Ristretto compression of the Curve25519 is known as **sr25519**.

#### Are BLS signatures used in Polkadot?

Not yet, but they will be. BLS signatures allow more efficient signature aggregation. Because
GRANDPA validators are usually signing the same thing (e.g. a block), it makes sense to aggregate
them, which can allow for other protocol optimizations.

:::info From the BLS library's README

Boneh-Lynn-Shacham (BLS) signatures have slow signing, very slow verification, require slow and much
less secure pairing friendly curves, and tend towards dangerous malleability. Yet, BLS permits a
diverse array of signature aggregation options far beyond any other known signature scheme, which
makes BLS a preferred scheme for voting in consensus algorithms and for threshold signatures.

:::

Even though Schnorr signatures allow for signature aggregation, BLS signatures are much more
efficient in some fashions. For this reason it will be one of the session keys that will be used by
validators on the Polkadot network and critical to the GRANDPA finality gadget.

## Randomness

Randomness in Proof of Stake blockchains is important for a fair and unpredictable distribution of
validator responsibilities. Computers are bad at random numbers because they are deterministic
devices (the same input always produces the same output). What people usually call random numbers on
a computer (such as in a gaming application), are _pseudo-random_ - that is, they depend on a
sufficiently random _seed_ provided by the user or another type of _oracle_, like a
[weather station for atmospheric noise](https://www.random.org/randomness/), your
[heart rate](https://mdpi.altmetric.com/details/47574324), or even
[lava lamps](https://en.wikipedia.org/wiki/Lavarand), from which it can generate a series of
seemingly-random numbers. But given the same seed, the same sequence will always be generated.

Though, these inputs will vary based on time and space, and it would be impossible to get the same
result into all the nodes of a particular blockchain around the world. If nodes get different inputs
on which to build blocks, forks happen. Real-world entropy is not suitable for use as a seed for
blockchain randomness.

There are two main approaches to blockchain randomness in production today: `RANDAO` and `VRF`.
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} uses VRF.

### VRF

A verifiable random function (VRF) is a mathematical operation that takes some input and produces a
random number along with a proof of authenticity that this random number was generated by the
submitter. The proof can be verified by any challenger to ensure the random number generation is
valid.

The VRF used in {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} is roughly the same
as the one used in Ouroboros Praos. Ouroboros randomness is secure for block production and works
well for [BABE](learn-consensus.md#BABE). Where they differ is that Polkadot's VRF does not depend
on a central clock (the problem becomes - whose central clock?), rather, it depends on its own past
results to determine present and future results, and it uses slot numbers as a clock emulator,
estimating time.

#### Here's how it works in detail:

Slots are discrete units of time six seconds in length. Each slot can contain a block, but may not.
Slots make up [epochs](../general/glossary.md##epoch) - on
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}, 2400 slots make one epoch, which
makes epochs four hours long.

In every slot, each validator "rolls a die". They execute a function (the VRF) that takes as input
the following:

- **The "secret key",** a key specifically made for these die rolls.
- **An epoch randomness value,** which is the hash of VRF values from the blocks in the epoch before
  last (N-2), so past randomness affects the current pending randomness (N).
- **The slot number.**

![VRF_babe](../assets/VRF_babe.png)

The output is two values: a `RESULT` (the random value) and a `PROOF` (a proof that the random value
was generated correctly).

The `RESULT` is then compared to a _threshold_ defined in the implementation of the protocol
(specifically, in the {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} Host). If the
value is less than the threshold, then the validator who rolled this number is a viable block
production candidate for that slot. The validator then attempts to create a block and submits this
block into the network along with the previously obtained `PROOF` and `RESULT`. Under VRF, every
validator rolls a number for themselves, checks it against a threshold, and produces a block if the
random roll is under that threshold.

The astute reader will notice that due to the way this works, some slots may have no validators as
block producer candidates because all validator candidates rolled too high and missed the threshold.
We clarify how we resolve this issue and make sure that
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} block times remain near constant-time
in the wiki page on [consensus](learn-consensus.md).

### RANDAO

An alternative method for getting randomness on-chain is the
[RANDAO](https://github.com/randao/randao) method from Ethereum. RANDAO requires each validator to
prepare by performing many thousands of hashes on some seed. Validators then publish the final hash
during a round and the random number is derived from every participant's entry into the game. As
long as one honest validator participates, the randomness is considered secure (non-economically
viable to attack). RANDAO is optionally augmented with VDF.

### VDFs

[Verifiable Delay Functions](https://vdfresearch.org/) are computations that take a prescribed
duration of time to complete, even on parallel computers. They produce unique output that can be
independently and efficiently verified in a public setting. By feeding the result of RANDAO into a
VDF, a delay is introduced that renders any attacker's attempt at influencing the current randomness
obsolete.

VDFs will likely be implemented through ASIC devices that need to be run separately from the other
types of nodes. Although only one is enough to keep the system secure, and they will be open source
and distributed at nearly no charge, running them is neither cheap nor incentivized, producing
unnecessary friction for users of the blockchains opting for this method.

## Resources

- [Key discovery attack on BIP32-Ed25519](https://web.archive.org/web/20210513183118/https://forum.w3f.community/t/key-recovery-attack-on-bip32-ed25519/44) -
  Archive of forum post detailing a potential attack on BIP32-Ed25519. A motivation for transition
  to the sr25519 variant.
- [Account signatures and keys in Polkadot](https://research.web3.foundation/Polkadot/security/keys) -
  Research post by Web3 researcher Jeff Burdges.
- [Are Schnorr signatures quantum computer resistant?](https://bitcoin.stackexchange.com/questions/57965/are-schnorr-signatures-quantum-computer-resistant/57977#57977)
- [Polkadot's research on blockchain randomness and sortition](https://research.web3.foundation/Polkadot/protocols/block-production) -
  contains reasoning for choices made along with proofs
- [Discussion on Randomness used in Polkadot](https://github.com/paritytech/ink/issues/57) - W3F
  researchers discuss the randomness in Polkadot and when it is usable and under which assumptions.

## Appendix A: On the security of curves

:::note From the
[Introduction of Curve25519](https://git.libssh.org/projects/libssh.git/tree/doc/curve25519-sha256@libssh.org.txt#n10)
into `libssl`

The reason is the following: During summer of 2013, revelations from ex- consultant at [the] NSA
Edward Snowden gave proof that [the] NSA willingly inserts backdoors into software, hardware
components and published standards. While it is still believed that the mathematics behind ECC
(Elliptic-curve cryptography) are still sound and solid, some people (including Bruce Schneier
[SCHNEIER]), showed their lack of confidence in NIST-published curves such as nistp256, nistp384,
nistp521, for which constant parameters (including the generator point) are defined without
explanation. It is also believed that [the] NSA had a word to say in their definition. These curves
are not the most secure or fastest possible for their key sizes [DJB], and researchers think it is
possible that NSA have ways of cracking NIST curves. It is also interesting to note that SSH belongs
to the list of protocols the NSA claims to be able to eavesdrop. Having a secure replacement would
make passive attacks much harder if such a backdoor exists.

However an alternative exists in the form of Curve25519. This algorithm has been proposed in 2006 by
DJB [Curve25519]. Its main strengths are its speed, its constant-time run time (and resistance
against side-channel attacks), and its lack of nebulous hard-coded constants.

:::



---
id: learn-DOT
title: DOT
sidebar_label: DOT
description: Tokenomics of Polkadot's Native Token DOT.
keywords: [token, DOT, what are the uses of DOT, KSM, faucet]
slug: ../learn-DOT
---

import RPC from "./../../components/RPC-Connection";

## What is DOT?

DOT is the native token of the Polkadot network in a similar way that BTC is the native token of
Bitcoin or Ether is the native token of the Ethereum blockchain.

### The Planck Unit

The smallest unit for the account balance on Substrate based blockchains (Polkadot, Kusama, etc.) is
Planck (a reference to [Planck Length](https://en.wikipedia.org/wiki/Planck_length), the smallest
possible distance in the physical Universe). You can compare DOT's Planck to BTC's Satoshi or ETH's
Wei. Polkadot's native token DOT equals to 10<sup>10</sup> Planck and Kusama's native token KSM
equals to 10<sup>12</sup> Planck.

### Polkadot

| Unit            | Decimal Places | Conversion to Planck   | Conversion to DOT |
| --------------- | -------------- | ---------------------- | ----------------- |
| Planck          | 0              | 1 Planck               | 0.0000000001 DOT  |
| Microdot (uDOT) | 4              | 10<sup>4</sup> Planck  | 0.0000010000 DOT  |
| Millidot (mDOT) | 7              | 10<sup>7</sup> Planck  | 0.0010000000 DOT  |
| Dot (DOT)       | 10             | 10<sup>10</sup> Planck | 1.0000000000 DOT  |
| Million (MDOT)  | 16             | 10<sup>16</sup> Planck | 1,000,000.00 DOT  |

:::note DOT was redenominated at block #1_248_328

DOT was originally equal to 10<sup>12</sup> Planck just like Kusama (which is referred to as "DOT
(old)"), but went through a process of [redenomination](./learn-redenomination.md) which increased
DOT's supply by 100x. As a consequence, 1 DOT now equals to 10<sup>10</sup> Planck.

:::

### Kusama

| Unit            | Decimal Places | Conversion to Planck   | Conversion to KSM  |
| --------------- | -------------- | ---------------------- | ------------------ |
| Planck          | 0              | 1 Planck               | 0.000000000001 KSM |
| Point           | 3              | 10<sup>3</sup> Planck  | 0.000000001000 KSM |
| MicroKSM (uKSM) | 6              | 10<sup>6</sup> Planck  | 0.000001000000 KSM |
| MilliKSM (mKSM) | 9              | 10<sup>9</sup> Planck  | 0.001000000000 KSM |
| KSM             | 12             | 10<sup>12</sup> Planck | 1.000000000000 KSM |

## What are the uses of DOT?

DOT serves three key functions in Polkadot:

- to be used for governance of the network,
- to be staked for the operation of the network,
- to be bonded to connect a chain to Polkadot as a parachain.

DOT can also serve ancillary functions by being a transferrable token. For example, DOT stored in
the Treasury can be sent to teams working on relevant projects for the Polkadot network.

:::note Explainer video on token utility

These concepts have been further explained in the video
[Usage of DOT and KSM on Polkadot and Kusama](https://www.youtube.com/watch?v=POfFgrMfkTo&list=PLOyWqupZ-WGuAuS00rK-pebTMAOxW41W8&index=7).

:::

### DOT for Governance

The first function of DOT is to entitle holders to control the governance of the platform. Some
functions that are included under the governance mechanism include determining the fees of the
network, the addition or removal of parachains, and exceptional events such as upgrades and fixes to
the Polkadot platform.

Polkadot will enable any holder of DOT to participate in governance. For details on how holders can
participate in governance, as well as their rights and responsibilities, see the
[governance page](./learn-polkadot-opengov.md).

### DOT for Consensus

DOT will be used to facilitate the consensus mechanism that underpins Polkadot. For the platform to
function and allow for valid transactions to be carried out across parachains, Polkadot will rely on
holders of DOT to play active roles. Participants will put their DOT at risk (via staking) to
perform these functions. The staking of DOT acts as a disincentive for malicious participants who
will be punished by the network by getting their DOT slashed. The DOT required to participate in the
network will vary depending on the activity that is being performed, the duration the DOT will be
staked for, and the total number of DOT staked. For more information about staking on Polkadot visit
[the dedicated staking page](./learn-staking.md).

### DOT for Parachain Slot Acquisition

DOT will have the ability to be locked for a duration in order to secure a parachain slot in the
network. The DOT will be reserved during the slot lease and will be released back to the account
that reserved them after the duration of the lease has elapsed and the parachain is removed. You can
learn more about this aspect by reading about the [auctions](learn-auction.md) that govern parachain
slots.

#### Calculating When Vesting DOT Will Be Available

Generally, you should be able to see from the [Accounts](https://polkadot.js.org/apps/#/accounts) by
looking at your accounts and seeing when the vesting will finish. However, some DOT vest with
"cliffs" - a single block where all the DOT are released, instead of vesting over time. In this
case, you will have to query the chain state directly to see when they will be available (since
technically, the vesting has not yet started - all of the vesting will occur in a single block in
the future).

1. Navigate to the
   [Chain State](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.polkadot.io#/chainstate) page on
   Polkadot-JS.
2. Query chain state for `vesting.vesting(ACCOUNT_ID)`
3. Note the `startingBlock` where the unlock starts, and how much DOT is unlocked per block
   (`perBlock`).
4. You will have to calculate the result into “human time". To do this, remember that there are
   approximately 14’400 blocks per day, and you can see what the latest block is shown on the
   [Explorer](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.polkadot.io#/explorer) page.

### Token Issuance

#### Total Issuance

It is the total number of token units in existence on the network.

:::info On-chain data for reference

The total issuance is
{{ polkadot: <RPC network="polkadot" path="query.balances.totalIssuance" defaultValue="13557639805348170350" filter= "humanReadable"/>. :polkadot }}
{{ kusama: <RPC network="kusama" path="query.balances.totalIssuance" defaultValue="14017001595616667835" filter= "humanReadable"/>. :kusama }}
in the era
{{ polkadot: <RPC network="polkadot" path="query.staking.currentEra" defaultValue="1200"/>. :polkadot }}
{{ kusama: <RPC network="polkadot" path="query.staking.currentEra" defaultValue="5649"/>. :kusama }}

:::

#### Inactive Issuance

It is the total units of outstanding deactivated balance on the network that cannot be used for
participation in governance. This comprises tokens locked away in crowdloans and nomination pools.

:::info On-chain data for reference

The inactive issuance is
{{ polkadot: <RPC network="polkadot" path="query.balances.inactiveIssuance" defaultValue="1784854324418488473" filter= "humanReadable"/>. :polkadot }}
{{ kusama: <RPC network="kusama" path="query.balances.inactiveIssuance" defaultValue="320302796457002024" filter= "humanReadable"/>. :kusama }}
in the era
{{ polkadot: <RPC network="polkadot" path="query.staking.currentEra" defaultValue="1200"/>. :polkadot }}
{{ kusama: <RPC network="polkadot" path="query.staking.currentEra" defaultValue="5649"/>. :kusama }}

:::

#### Active Issuance

Active issuance = Total issuance - Inactive issuance

All the tokens under active issuance are can be used to participate in the governance on-chain.

## Obtaining Testnet Tokens

DOT are required to make transactions on the Polkadot network. Tokens on Polkadot's Testnets like
Westend and Rococo do not have any value besides allowing you to experiment with the features on the
network.

### Getting Tokens on the Westend Testnet

Polkadot's testnet is called [Westend](../maintain/maintain-networks.md#westend-test-network) and
you can obtain its native tokens (called Westies!) by posting `!drip <WESTEND_ADDRESS>` in the
Matrix chatroom [#westend_faucet:matrix.org](https://matrix.to/#/#westend_faucet:matrix.org). Your
account will be credited with 1 WND by default. You can also specify to get more tokens by
`!drip <WESTEND_ADDRESS> X`, where X is the number of tokens.

Another way is to use our web-based
[Westend faucet](https://paritytech.github.io/polkadot-testnet-faucet/westend).

You can also earn WNDs as rewards by [becoming a validator](learn-validator.md) on Westend network.
Watch the video below on how to get started on Westend.

[![Testing Polkadot features on Westend](https://img.youtube.com/vi/0ji0ccZyb3k/0.jpg)](https://www.youtube.com/watch?v=0ji0ccZyb3k)

| Unit            | Decimal Places | Conversion to Planck   | Conversion to WND  |
| --------------- | -------------- | ---------------------- | ------------------ |
| Planck          | 0              | 1 Planck               | 0.000000000001 WND |
| Point           | 3              | 10<sup>3</sup> Planck  | 0.000000001000 WND |
| MicroWND (uWND) | 6              | 10<sup>6</sup> Planck  | 0.000001000000 WND |
| MilliWND (mWND) | 9              | 10<sup>9</sup> Planck  | 0.001000000000 WND |
| WND             | 12             | 10<sup>12</sup> Planck | 1.000000000000 WND |

### Getting Tokens on the Rococo Testnet

Rococo is a parachain testnet. Tokens are given directly to teams working on parachains or exploring
the [cross consensus](learn-xcm.md) message-passing aspects of this testnet. General users can
obtain ROC by posting `!drip <ROCOCO_ADDRESS>` in the Matrix chatroom
[#rococo-faucet:matrix.org](https://matrix.to/#/#rococo-faucet:matrix.org) or through the web-based
[Rococo faucet](https://paritytech.github.io/polkadot-testnet-faucet/). Learn more about Rococo on
its [dedicated wiki section](../build/build-parachains.md##testing-a-parachains:-rococo-testnet).

### Faucets support

If you require help with using faucets, or wish to report an issue, there is a support chat
[#faucets-support:matrix.org](https://matrix.to/#/#faucets-support:matrix.org), or you can
[create an issue](https://github.com/paritytech/polkadot-testnet-faucet/issues/new/choose) directly
in the faucets repo

## Kusama Tokens

Unlike testnet DOT, Kusama tokens are not freely given away. Kusama tokens are available via the
[claims process](https://claim.kusama.network/) (if you had DOT at the time of Kusama genesis) or
through the [Treasury](learn-treasury.md). Alternatively, they can be obtained on the open market.

## Polkadot Mainnet DOT

Polkadot Mainnet DOT are not freely given away. If you purchased DOT in the original 2017 offering,
you may claim them via the [Polkadot claims process](https://claims.polkadot.network/).
Alternatively, they are available on the open market.



---
id: learn-extrinsics
title: Extrinsics (a.k.a. Types of Transactions)
sidebar_label: Extrinsics
description: Types of Transactions on Polkadot.
keywords: [transaction, DOT, extrinsics, KSM]
slug: ../learn-extrinsics
---

## Pallets and Extrinsics

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} is built using
[Substrate](https://substrate.io/), a modular framework to efficiently build blockchains.
Substrate's FRAME development environment provides modules called pallets and support libraries that
you can use, modify, and extend to build the runtime logic to suit the needs of your blockchain. You
can explore Substrate's FRAME pallets on
[this dedicated page](https://docs.substrate.io/reference/frame-pallets/).

Within each functional **pallet** on the blockchain, one can **call** its functions and execute them
successfully, provided they have the permission to do so. Because these calls originate outside of
the blockchain runtime, such transactions are referred to as **extrinsics**. Extrinsics normally
contain a signature, some data to describe if the extrinsic has passed some validity checks and a
reference to the pallet and call that it is intended for. For example, the Staking pallet contains
all functions related to staking. A nominator can bond funds and nominate validators by issuing the
respective extrinsics. Some extrinsics might also trigger an event on the chain such as a reward
payout to the nominators.

## Types of Extrinsics

Now that we introduced the term _extrinsic_, let us dive deeper and understand what extrinsics
really are. Extrinsics can be one of 3 distinct types:

- **Signed transactions:** these must contain the signature of the account sending the inbound
  request to the runtime. With signed transactions, the account used to submit the request typically
  pays the transaction fee and must sign it using the account's private key.
- **Unsigned transactions:** these don't carry any information about who submitted the transaction,
  since the format of this type of transaction doesn't require a signature. You can define what
  conditions must be met for such a transaction to be valid.
- **Inherents:** are a special type of unsigned transaction made by block authors which carry
  information required to build a block such as timestamps, storage proofs and uncle blocks.

Here are some key differences between the different types of extrinsics:

- Contrary to signed transactions, unsigned transaction types require implementing custom validation
  logic which can consume more resources for checking validity compared to signed transactions.
- Unsigned transactions have no economic deterrent to prevent spam or replay attacks, so custom
  logic must account for protecting the network from these types of transactions being misused.
- Inherents exist to address the need of adding some data to a block, whereas signed or unsigned
  transactions exist to potentially change the state of the blockchain.

### Mortal and Immortal Extrinsics

Extrinsics can be mortal (i.e. valid within a defined block interval) or immortal (i.e. always
valid). By default and for security reasons, all extrinsics will be mortal, but always checking
before signing is a good practice. This will avoid the chance of being a victim of a replay attack
after [reaping an account](./learn-accounts.md#existential-deposit-and-reaping).

A replay attack is where past transactions can be replayed (same balance, receiver account, etc.)
without knowing private keys. This could happen in the context of reaping accounts because the
reaping process resets the nonce value. If all signed transactions until the nonce before the
reaping event were immortal, all past transactions can be replayed once the account is refunded.
There is no need for the attacker to know your private key, valid signatures for those past
transactions and nonces already exist and are stored on-chain (meaning the private key was already
used to generate those signatures).

Making a transaction mortal will almost certainly ensure that replay attacks are not possible, with
the only exception being if the account is reaped and then re-funded shortly after submitting a
mortal transaction, and then an attacker replays that transaction within the mortality window (i.e.,
the specified block interval).

## Metadata Updates

:::warning Always check for Metadata Updates

Before signing extrinsics with the Polkadot-JS Browser Extension and Parity Signer, always check for
metadata updates. [**This video tutorial**](https://youtu.be/gbvrHzr4EDY?t=84) will explain how to
do it.

:::

### Parity Signer vs Browser Extension

Parity Signer updates the full metadata through the QR fountain while the extension updates the
metadata index (the metadata is not loaded into it). As a consequence the process of updating
metadata is different in this two cases (you will notice that on the Signer app the update takes
longer for example). Having outdated metadata on the Signer app will prevent you from signing, while
on the extension you will be able to click the sign button but the extrinsic will likely fail
(similarly of having an outdated Ledger app). In general, failing to update metadata will most
likely result in you not being able to sign extrinsics.

## Verifying Extrinsics

:::info Walk-through Video Tutorial

Visit the
[**dedicated support page**](https://support.polkadot.network/support/solutions/articles/65000179161-how-can-i-verify-what-extrinsic-i-m-signing-)
and see [**this video tutorial**](https://youtu.be/bxMs-9fBtFk) tutorial to learn about how to
verify extrinsics before signing them. The video will also mention potential attacks that can happen
to you while signing for transactions.

:::

:::danger

Do not sign a transaction if you can't verify what you are signing or you suspect you might be
signing a different extrinsic than the one intended.

:::

Verifying the extrinsic you are signing can take some more time before signing for a transaction but
it allows you to add an extra security step. There are a multitude of possible attacks that will
prevent you to send funds to the desired destination account (see below).

## How do Attacks look like

In general, an attacker would make you think you are signing an extrinsic A when in reality you are
signing an extrinsic B. An Attack might come from:

### Clipboard Memory

:::info

For a more detailed read about clipboard memory attacks see
[this article](https://www.kaspersky.com/blog/cryptoshuffler-bitcoin-stealer/19976/).

:::

This is a common attack. The clipboard memory is that memory on you computer dedicated to copy-paste
operations. There is malicious software that can be remotely installed on your computer and that can
detect when a cryptocurrency address is copied. For example, you want to send funds to Address A
(belonging to you) but after copying address A a malicious software swaps that address with Address
B (belonging to an attacker). This attack can be prevented by checking the receiver address before
signing. Failing to do so could result in loss of the funds.

### Malicious Website/dApp

This is a common attack that can happen if you are interacting with a malicious site (dApp). In this
scenario you want to perform Extrinsic A on the website, but the dApp will send Extrinsic B to the
extension for signing. In this case the extension will show Extrinsic B. If you are using a Ledger
device you have a second layer of verification, as it will also display Extrinsic B.

### Malicious Browser Extension

This scenario can happen if you have downloaded a malicious extension or a trusted extension, like
the [Polkadot-JS Browser Extension](https://polkadot.js.org/extension/), from a non-trusted source.
In this scenario the extension will display that you will sign for an Extrinsic A but in the
background will execute Extrinsic B. If you are using a [Ledger](https://www.ledger.com/) device
this attack can be detected because you will be able to see Extrinsic B on the screen of your Ledger
device.

### Corrupted metadata

This attack is least common and might result in signing a non-intended extrinsic without the
possibility of verifying it. Before authorizing the metadata update check who is requesting it.
Metadata updates for the Polkadot-JS Browser Extension (or other extensions) might be requested by
the Polkadot-JS UI and dApps (for example DeFi apps of parachains). For the extensions, you should
trust the app that requests the update. When updating the metadata for Parity Signer you should
trust the issuer of the metadata (or generate the QR fountain yourself).

### Corrupted QR-code (Parity Signer)

This is a sub-case of the malicious dApp scenario. If your account is on
[Parity Signer](https://www.parity.io/technologies/signer/) the extrinsic will be displayed as a QR
code, instead of the extension showing its details and you need to verify it on the device. The
corrupted QR code will make you sign for an Extrinsic B when you want to sign for Extrinsic A. This
will be showed in the Signer app and a careful user will notice it. If the metadata in the Signer is
already incorrect (or the Signer is corrupted) there is the risk of signing a non-intended extrinsic
without the possibility of verifying it.

## Defense against Attacks

:::warning

If you can't verify the extrinsic or you suspect you are signing something different than what you
intended, don't sign it!

:::

To avoid being victim of an attack:

- Use only trusted extensions, sites and software in general.
- Use cold storage options (Ledger, Signer) and verify on them. Trust what these devices tell you
  over what is shown in the app or the browser extension.
- Update Signer metadata only from trusted sources (or do it yourself).
- Accept metadata updates for the extension only from trusted apps.


---
id: learn-governance
title: Governance V1
sidebar_label: Governance V1
description: Polkadot's First Governance Model.
keywords: [governance, referenda, proposal, voting, endorse]
slug: ../learn-governance
---

import RPC from "./../../components/RPC-Connection";

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} uses a sophisticated governance
mechanism that allows it to evolve gracefully overtime at the ultimate behest of its assembled
stakeholders. The stated goal is to ensure that the majority of the stake can always command the
network.

:::info Polkadot OpenGov is live on Kusama Network

Learn about the upcoming changes to the governance on
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} in this
[Wiki doc on Polkadot OpenGov](./learn-polkadot-opengov.md).

:::

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} brings together various novel
mechanisms, including an amorphous (abstract) form of state-transition function stored on-chain
defined in a platform-agnostic language (i.e. [WebAssembly](learn-wasm.md)). It also allows for
several on-chain voting mechanisms, such as referenda with the novel concept of
[Adaptive Quorum Biasing](#adaptive-quorum-biasing) and batch approval voting. All changes to the
protocol must be agreed upon by stake-weighted referenda.

To make any changes to the network, the idea is to compose active token holders and the council
together to administrate a network upgrade decision. No matter whether the proposal is proposed by
the public (token holders) or the [Council](#council), it finally will have to go through a vote on
a referendum to let all holders, weighted by stake, make the decision.

## Governance Summary

The figure below shows an overview of Governance V1 with the key actors and different paths for
submitting a proposal that can potentially be voted on as a referendum.

![gov1-overview](../assets/gov1-overview.png)

The public (i.e. token holders) can submit a proposal that gets added to the proposal queue. Here,
proposals are [endorsed](#endorsing-proposals), and the one that gets the most support will climb to
the top of the queue. When it is time, the proposal at the top of the queue will become a
[Public Referendum](#public-referenda). For instance, the proposal with 11 endorsements is shown at
the top of the queue in the figure, which is ready to become a referendum.

The public can also submit a [treasury proposal](./learn-treasury.md#creating-a-treasury-proposal),
which must be evaluated by the [Council](#council) through a motion. If the Council motion passes,
the treasury proposal can be directly executed or go to the external queue, which will be voted on
through a [Council Referendum](#council-referenda). See the figure's green horizontal path from the
Public (green) to the Council (yellow). Treasury proposals and Council proposals can be directly
executed (horizontal yellow arrows) or go to the external queue, where they will become a referendum

Note that the external queue always consists of
[a single proposal](https://github.com/paritytech/substrate/blob/f4a2e84ee5974b219f2a03cd195105060c41e3cd/frame/democracy/src/lib.rs#LL29C8-L31C4).
A proposal in the external queue can be fast-tracked by the
[Technical Committee](#technical-committee) (light blue). The fast track can contain as many
proposals as possible (also called emergency proposals) that can be voted on simultaneously with
with the referenda introduced either by the Council or the Public. See in the figure the yellow
circle (i.e. Council Proposal) exiting the external queue, and the yellow circle with a light-blue
border also leaving the queue and being fast-tracked by the Technical Committee (TC). Once empty,
the external queue can be filled with another Council proposal.

The Council can also submit proposals that will end up in the external queue. Voting on Council and
Public proposals subject to an [alternating timetable](#alternating-voting-timetable), shown in the
figure as the "on" and "off" toggles on the external and proposal queues. In this example, the
Public proposal will be voted on together with the fast-tracked Council Proposal. Voting on
non-fast-tracked Council Proposals will be blocked until the alternating timetable switches the
toggles, which stops Public proposals from becoming a referenda.

Referenda will follow an [adaptive quorum biasing](#adaptive-quorum-biasing) mechanism for deciding
whether they get enacted, and if they do, they will be executed after an
[enactment period](#enactment).

Token holders can delegate their votes (with a conviction multiplier) to another account belonging
to a trusted entity voting on their behalf.

## Proposals

Referenda can be started in different ways:

- Publicly submitted proposals
- Proposals submitted by the council, either through a majority or unanimously
- Proposals submitted as part of the [enactment](#enactment) of a prior referendum (i.e. making a
  referendum to start a new referendum)
- Emergency proposals submitted by the [Technical Committee](#technical-committee) and approved by
  the [Council](#council)

:::info Starting a proposal in Governance V1

For more information about how to start a proposal, see the
[dedicated page](../maintain/maintain-guides-democracy.md#proposing-an-action).

:::

### Endorsing Proposals

Anyone can submit a proposal by depositing the minimum amount of tokens for a certain period (number
of blocks). If someone agrees with the proposal, they may deposit the same amount of tokens to
support it - this action is called
[_endorsing_](../maintain/maintain-guides-democracy.md#endorsing-a-proposal). The proposal with the
highest amount of bonded support will be selected to be a referendum in the next voting cycle based
on an [alternating voting timetable](#alternating-voting-timetable).

### Cancelling Proposals

A proposal can be canceled if the [Technical Committee](#technical-committee) unanimously agrees to
do so or if Root Origin (e.g. sudo) triggers this functionality. A canceled proposal's deposit is
burned.

Additionally, a two-thirds majority of the council can cancel a referendum. This may function as a
last-resort if there is an issue found late in a referendum's proposal, such as a bug in the code of
the runtime that the proposal would institute.

If the cancellation is controversial enough that the council cannot get a two-thirds majority, then
it will be left to the stakeholders _en masse_ to determine the proposal’s fate.

### Blacklisting Proposals

A proposal can be blacklisted by Root Origin (e.g. sudo). A blacklisted proposal and its related
referendum (if any) are immediately [canceled](#canceling). Additionally, a blacklisted proposal's
hash cannot re-appear in the proposal queue. Blacklisting is useful when removing erroneous
proposals that could be submitted with the same hash.

Upon seeing their proposal removed, a submitter who is not properly introduced to the democracy
system of {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} might be tempted to
re-submit the same proposal. That said, this is far from a fool-proof method of preventing invalid
proposals from being submitted - a single changed character in a proposal's text will also change
the hash of the proposal, rendering the per-hash blacklist invalid.

## Referenda

Referenda are simple, inclusive, stake-based voting schemes. Each referendum has a specific proposal
that takes the form of a **privileged function** call in the runtime. That function includes the
most powerful **call**: `set_code`, which can switch out the entire runtime code, achieving what
would otherwise require a "hard fork".

Referenda are discrete events, have a fixed period where voting happens, and then are tallied, and
the function call is executed if the vote is approved. Referenda are always binary: your only
options in voting are "aye", "nay", or abstaining entirely.

### Referenda Timeline

The structure of the timeline for all referenda is the same regardless of who initiates the
proposal, although the timeline length can vary (see below).

![gov1-timeline](../assets/gov1-timeline.png)

The figure above provides a summary view of the referenda timeline for Governance V1.

In (1), the proposal is submitted, and the Launch Period starts. During this period of indefinite
length the voters can [endorse](#endorsing-proposals) proposals by bonding the same amount of tokens
used by the depositor. Deposited tokens for endorsement will be returned once the proposal becomes a
referendum. During the launch period, the proposal will compete with other proposals, and the one
that gets to the top will be selected for a referendum when the next voting period starts.

The figure shows that the launch period is shown with a fixed length. Still, it varies depending on
who initiated the proposal and how many proposals there are in the pipeline. Council motions will
likely have a short launch period when compared to the public referenda which might take longer
unless they are the only ones in the pipeline.

In (2), the proposal is selected for a referendum. Proposals initiated by the public will become a
[public referendum](#public-referenda), while those initiated by the council will become
[council referenda](#council-referenda). The voting period lasts
{{ polkadot: 28 days :polkadot }}{{ kusama: 7 days :kusama }}, after which, if the proposal is
approved, it will go through an enactment period. Rejected proposals will need to start from (1).
Note that Governance V1 uses an [alternating voting timeline](#alternating-voting-timetable) where
voters can vote either for a public proposal or a council motion every
{{ polkadot: 28 days :polkadot }}{{ kusama: 7 days :kusama }}.

In (3), the proposal is approved and moves through the [enactment period](#enactment) that can be of
different lengths depending on who initiated the proposal in the first place, with emergency
proposals being the fastest ones and the only ones that can be voted simultaneously with other
referenda.

### Public Referenda

Public referenda will have a [**positive turnout bias**](#adaptive-quorum-biasing), meaning that
they will require a heavy supermajority of _aye_ votes to pass at low turnouts but as turnout
increases towards 100%, it will require a simple majority of _aye_ votes to pass (i.e. 51% wins).

Note that the bonded tokens will be released once the proposal is tabled (that is, brought to a
vote), and a maximum of
{{ polkadot: <RPC network="polkadot" path="consts.democracy.maxProposals" defaultValue={100} /> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.democracy.maxProposals" defaultValue={100} /> :kusama }}
public proposals can be in the proposal queue.

:::info turnout

The total number of voting tokens excluding conviction or [voluntary locking](#voluntary-locking).

:::

### Council Referenda

Unanimous Council - When all council members agree on a proposal, it can be moved to a referendum
with a [**negative turnout bias**](#adaptive-quorum-biasing). Briefly, it will require a heavy
supermajority of _nay_ votes to reject at low turnouts, but as turnout increases towards 100%, it
will require a simple majority of _nay_ votes to fail (i.e. 51% wins).

Majority Council - When agreement from only a simple majority of council members occurs, the
referendum will need [**simple majority**](#adaptive-quorum-biasing) to pass.

:::info Public- vs. Council-initiated Referenda

Public referenda must be agreed upon using a positive bias to mitigate attacks by malicious or
ill-conceived proposals. Conversely, when a proposal is unanimously voted in favor by the council,
it benefits from using the negative bias. We assume low turnout is less problematic if the council
proposes a referendum. Also, the council members are elected by the community and have strong
technical as well as functional knowledge about the system, and we assume solid justifications back
changes proposed by the council.

:::

### Alternating Voting Timetable

All referenda are executed by Root Origin. It follows that multiple referenda cannot be voted upon
in the same period, excluding emergency referenda. An emergency referendum occurring at the same
time as a regular referendum (either public- or council-proposed) is the only time multiple
referenda can be voted on.

Every
{{ polkadot: <RPC network="polkadot" path="consts.democracy.votingPeriod" defaultValue={403200} filter="blocksToDays" /> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.democracy.votingPeriod" defaultValue={100800} filter="blocksToDays" /> :kusama }}
days, a new referendum will come up for a vote, assuming there is at least one proposal in one of
the queues. There is a queue for Council-approved proposals and a queue for publicly-submitted
proposals. The referendum to be voted upon alternates between the top proposal in the two queues,
where the proposals' rank is based on [endorsement](#endorsing-proposals) (i.e. bonded tokens).

### Adaptive Quorum Biasing

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} introduces the concept of **Adaptive
Quorum Biasing**, which is used to alter the effective super-majority required to make it easier or
more difficult for a proposal to pass depending on voting power (turnout) and origin (Council or
public).

Adaptive Quorum Biasing creates three tallying mechanisms: majority carry, super-majority approve,
and super-majority against. They all equate to a simple majority-carry system at 100% turnout. Their
selection depends on which entity proposed the proposal and whether all Council members voted yes
(in the case of Council Referenda).

|          **Entity**          |                   **Metric**                   |
| :--------------------------: | :--------------------------------------------: |
|            Public            | Positive Turnout Bias (Super-Majority Approve) |
| Council (Complete agreement) | Negative Turnout Bias (Super-Majority Against) |
| Council (Majority agreement) |                Simple Majority                 |

Let's use the image below as an example.

![adaptive-quorum-biasing](../assets/governance/adaptive-quorum-biasing.png)

If a publicly submitted referendum only has a 25% turnout, the tally of _aye_ votes has to reach 66%
for it to pass since we applied **Positive Turnout Bias**. In contrast, when it has a 75% turnout,
the tally of _aye_ votes has to reach 54%, which means that the super-majority required decreases as
the turnout increases. A positive turnout bias, whereby a heavy super-majority of aye votes is
required to carry at low turnouts. However, as turnout increases towards 100%, it becomes a simple
majority carry as below.

![](https://latex.codecogs.com/svg.latex?\large&space;{against&space;\over&space;\sqrt{turnout}}&space;<&space;{approve&space;\over&space;\sqrt{electorate}})

Where `approve` is the number of _aye_ votes, `against` is the number of _nay_ votes, `turnout` is
the total number of voting tokens excluding [voluntary locking](#voluntary-locking), and
`electorate` is the total number of tokens issued in the network.

When the council proposes a new proposal through unanimous consent, the referendum would be put to
the vote using **Negative Turnout Bias**. Referring to the above image, when a Council referendum
only has a 25% turnout, the tally of _aye_ votes has to reach 34% for it to pass, while if the
turnout increases to 75%, the tally of _aye_ votes has to reach 46%. A negative turnout bias
requires a heavy super-majority of _nay_ votes to reject at low turnouts. However, as turnout
increases towards 100%, it becomes a simple majority carry as below.

![](https://latex.codecogs.com/svg.latex?\large&space;{against&space;\over&space;\sqrt{electorate}}&space;<&space;{approve&space;\over&space;\sqrt{turnout}})

In short, when the turnout rate is low, a super-majority is required to reject the proposal, which
means a lower threshold of _aye_ votes must be reached. As turnout increases toward 100%, it becomes
a simple majority, a simple comparison of votes. If there are more _aye_ votes than _nay_, then the
proposal is carried, no matter how much stake votes on the proposal.

![](https://latex.codecogs.com/svg.latex?\large&space;{approve}&space;>&space;{against})

To know more about where these above formulas come from, please read the
[democracy pallet](https://github.com/paritytech/substrate/blob/master/frame/democracy/src/vote_threshold.rs).

#### Example of Adaptive Quorum Biasing

Let's assume we only have {{ polkadot: 1,500 DOT :polkadot }}{{ kusama: 1_50 :kusama }} tokens in
total and that this is a public proposal.

- John: {{ polkadot: 500 DOT :polkadot }}{{ kusama: 50 KSM :kusama }}
- Peter: {{ polkadot: 100 DOT :polkadot }}{{ kusama: 10 KSM :kusama }}
- Lilly: {{ polkadot: 150 DOT :polkadot }}{{ kusama: 15 KSM :kusama }}
- JJ: {{ polkadot: 150 DOT :polkadot }}{{ kusama: 15 KSM :kusama }}
- Ken: {{ polkadot: 600 DOT :polkadot }}{{ kusama: 60 KSM :kusama }}

John: Votes `Yes` for a 4 week lock period =>
{{ polkadot: 500 x 1 = 500 Votes :polkadot }}{{ kusama: 50 x 1 = 50 Votes :kusama }}

Peter: Votes `Yes` for a 4 week lock period =>
{{ polkadot: 100 x 1 = 100 Votes :polkadot }}{{ kusama: 10 x 1 = 10 Votes :kusama }}

JJ: Votes `No` for a 16 week lock period =>
{{ polkadot: 150 x 3 = 450 Votes :polkadot }}{{ kusama: 150 x 3 = 450 Votes :kusama }}

- approve = {{ polkadot: 600 :polkadot }}{{ kusama: 60 :kusama }}
- against = {{ polkadot: 450 :polkadot }}{{ kusama: 45 :kusama }}
- turnout = {{ polkadot: 750 :polkadot }}{{ kusama: 75 :kusama }}
- electorate = {{ polkadot: 1500 :polkadot }}{{ kusama: 150 :kusama }}

![\Large \frac{450}{\sqrt{750}}&space;<&space;\frac{600}{\sqrt{1500}}](https://latex.codecogs.com/svg.latex?\large&space;\frac{450}{\sqrt{750}}&space;<&space;\frac{600}{\sqrt{1500}})

![\Large {16.432}&space;<&space;{15.492}](https://latex.codecogs.com/svg.latex?\large&space;{16.432}&space;<&space;{15.492})

Since the above example is a public referendum, **Super-Majority Approve** would be used to
calculate the result. Super-Majority Approve requires more _aye_ votes to pass the referendum when
turnout is low; therefore, based on the above result, the referendum will be rejected.

:::info only the winning voter's tokens are locked.

If the voters on the losing side of the referendum believe that the outcome will have adverse
effects, their tokens are transferrable, so they will not be locked into the decision. Winning
proposals are autonomously enacted after the [enactment period](#enactment).

:::

### Enactment

Referenda are considered _baked_ if they are closed and tallied. Assuming a referendum is approved,
it will be scheduled for **enactment**. Referenda are considered _unbaked_ if they are pending an
outcome, i.e. being voted on.

All referenda are associated with an enactment delay or **enactment period**. This is the period
between a referendum ending and (assuming it was approved) the changes being enacted.

For public and Council referenda, the enactment period is a fixed time of
{{ polkadot: <RPC network="polkadot" path="consts.democracy.enactmentPeriod" defaultValue={403200} filter="blocksToDays" /> :polkadot }}{{ kusama: <RPC network="kusama" path="consts.democracy.enactmentPeriod" defaultValue={115200} filter="blocksToDays" /> :kusama }}.
For proposals submitted as part of the enactment of a prior referendum, it can be set as desired.
Emergency proposals deal with major problems with the network and need to be "fast-tracked". These
will have a shorter enactment period.

## Voting on a Referendum

To vote, a voter generally must lock their tokens up for at least the enactment period beyond the
end of the referendum. This is to ensure that some minimal economic buy-in to the result is needed
and to dissuade vote selling.

:::note Referenda explainer video

To learn more about voting on referenda, please check out our
[technical explainer video](https://www.youtube.com/watch?v=BkbhhlsezGA&list=PLOyWqupZ-WGuAuS00rK-pebTMAOxW41W8&index=31&ab_channel=Polkadot).

:::

It is possible to vote without locking, but your vote is worth a small fraction of a normal vote,
given your stake. At the same time, holding only a small amount of tokens does not mean that the
holder cannot influence the referendum result, thanks to time-locking or **voluntary locking** (see
below).

### Voluntary Locking

:::info Voluntary Locking

For more information about voluntary locking or conviction voting see
[Polkadot OpenGov](./learn-polkadot-opengov.md#voluntary-locking).

:::

### Delegations

In {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} you can
[delegate your voting power](../maintain/maintain-guides-democracy.md#delegate-a-vote) to another
account you trust if you are not willing to stay up-to-date with all referenda.

You can also use a [governance proxy](./learn-proxies.md#governance-proxy) to vote on behalf of your
stash account. The proxy can be yours, or you can authorize a third-party governance proxy to vote
with your stash. Learn more from the [dedicated page on Proxy Accounts](./learn-proxies.md).

## Council

To represent passive stakeholders, {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}
introduces the idea of a "council". The council is an on-chain entity comprising several actors,
each represented as an on-chain account. On
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}, the council currently consists of
{{ polkadot: <RPC network="polkadot" path="query.council.members" defaultValue={Array(13)} filter="arrayLength" /> :polkadot }}
{{ kusama: <RPC network="kusama" path="query.council.members" defaultValue={Array(19)} filter="arrayLength" /> :kusama }}
members.

Along with [controlling the treasury](learn-treasury.md), the council is called upon primarily for
three tasks of governance:

- Proposing sensible referenda
- Cancelling uncontroversially dangerous or malicious referenda
- Electing the [Technical Committee](#technical-committee).

For a referendum to be proposed by the council, a strict majority of members must be in favor, with
no member exercising a veto. Vetoes may be exercised only once by a member for any single proposal.
If the proposal is resubmitted after a cool-down period, they may not veto it a second time.

Council motion that pass with a 3/5 (60%) super-majority - but without reaching unanimous support -
will move to a public referendum under a neutral, majority-carries voting scheme. In the case that
all members of the council that voted are in favor of a motion, the vote is considered unanimous and
becomes a referendum with [negative turnout bias](#adaptive-quorum-biasing).

:::note Explainer video on the Council

For more information, check out our
[video explainer on Council](https://www.youtube.com/watch?v=837Vv3gdRzI)

:::

### Prime Members

The council, being an instantiation of
[Substrate's Collective pallet](https://github.com/paritytech/substrate/tree/master/frame/collective),
implements what's called a _prime member_ whose vote acts as the default for other members that fail
to vote before the timeout.

The prime member is chosen based on a [Borda count](https://en.wikipedia.org/wiki/Borda_count).

The purpose of having a prime council member is to ensure a quorum, even when several members
abstain from a vote. Council members might be tempted to vote a "soft rejection" or a "soft
approval" by not voting and letting the others vote. The existence of a prime member forces
councilors to be explicit in their votes or have their vote counted for whatever is voted on by the
prime.

## Technical Committee

The Technical Committee(TC) was introduced in the
[Kusama rollout and governance post](https://polkadot.network/kusama-rollout-and-governance/) as one
of the three chambers of Kusama governance (along with the Council and the Referendum chamber). The
TC is composed of the teams that have successfully implemented or specified either a
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} runtime or Polkadot Host. Teams are
added or removed from the TC via a simple majority vote of the [Council](#council).

The TC aims to safeguard against malicious referenda, implement bug fixes, reverse faulty runtime
updates, or add new but battle-tested features. The TC can fast-track proposals using the Democracy
pallet and is the only origin that can trigger the fast-tracking functionality. We can think of the
TC as a "unique origin" that cannot generate proposals but fast-track existing ones.

Fast-tracked referenda are the only referenda that can be active alongside another active
referendum. Thus, with fast-tracked referenda, it is possible to have two active referendums
simultaneously. Voting on one does not prevent a user from voting on the other.

## Frequently Asked Questions

### How to be a council member?

![approval-vote](../assets/governance/approval-vote.png)

All stakeholders can signal their approval of any of the registered candidates.

Council elections are handled by the same [Phragmén election](../docs/learn-phragmen) process that
selects validators from the available pool based on nominations. However, token holders' votes for
councilors are isolated from any nominations they may have on validators. Council terms last for one
{{ kusama: day :kusama }}{{ polkadot: week :polkadot }}.

At the end of each term, [Phragmén election algorithm](../docs/learn-phragmen#algorithm) runs and
the result will choose the new councilors based on the vote configurations of all voters. The
election also chooses a set number of runners-up, which is currently
{{ kusama: 12 :kusama }}{{ polkadot: 20 :polkadot }} that will remain in the queue with their votes
intact.

As opposed to a "first-past-the-post" electoral system, where voters can only vote for a single
candidate from a list, a Phragmén election is a more expressive way to include each voter’s views.
Token holders can treat it as a way to support as many candidates as they want. The election
algorithm will find a fair subset of the candidates that most closely matches the expressed
indications of the electorate as a whole.

Let's take a look at the example below.

|      Round 1      |     |                |     |     |     |
| :---------------: | :-: | :------------: | :-: | :-: | :-: |
| **Token Holders** |     | **Candidates** |     |     |     |
|                   |  A  |       B        |  C  |  D  |  E  |
|       Peter       |  X  |                |  X  |  X  |  X  |
|       Alice       |     |       X        |     |     |     |
|        Bob        |     |                |  X  |  X  |  X  |
|      Kelvin       |  X  |                |  X  |     |     |
|     **Total**     |  2  |       1        |  3  |  2  |  2  |

The above example shows that candidate C wins the election in round 1, while candidates A, B, D & E
keep remaining on the candidates' list for the next round.

|      Round 2      |     |                |     |     |
| :---------------: | :-: | :------------: | :-: | :-: |
| **Token Holders** |     | **Candidates** |     |     |
|                   |  A  |       B        |  D  |  E  |
|       Peter       |  X  |       X        |     |     |
|       Alice       |  X  |       X        |     |     |
|        Bob        |  X  |       X        |  X  |  X  |
|      Kelvin       |  X  |       X        |     |     |
|     **Total**     |  4  |       4        |  1  |  1  |

The top-N (say 4 in this example) runners-up can remain, and their votes persist until the next
election. After round 2, even though candidates A & B get the same number of votes in this round,
candidate A gets elected because after adding the older unused approvals, it is higher than B.

### How can I appeal to the council to enact a change on my behalf?

In some circumstances, you may want to appeal to the on-chain council to enact a change on your
behalf. One example of this circumstance is the case of lost or locked funds when the funds were
lost due to a human interface error (such as inputting an address for another network). Another
example is if you participated in the 2017 Polkadot ICO with a multi-sig address which now does not
let you sign a message easily. When these circumstances can be proven beyond a reasonable doubt to
be an error, the council _may_ consider a governance motion to correct it.

The first step to appeal to the council is to contact the councilors. There is no singular place
where you are guaranteed to grab every councilor’s ear with your message. However, there are a
handful of good places to start where you can get the attention of some of them. The
{{ polkadot: [Polkadot Direction](https://matrix.to/#/#Polkadot-Direction:parity.io) :polkadot }}
{{ kusama: [Kusama Direction](https://matrix.to/#/#Kusama-Direction:parity.io) :kusama }} matrix
room is one such place. After creating an account and joining this room, you can post a
well-thought-through message here that lays down your case and justifies why you think the council
should consider enacting a change to the protocol on your behalf.

At some point, you will likely need a place for a longer-form discussion. For this, making a post on
[Polkassembly](https://polkadot.polkassembly.io/) is the recommended place to do so. When you write
a post on Polkassembly, present all the evidence for your circumstances and state clearly what kind
of change you would suggest to the councilors to enact.

:::info

Remember, the councilors do not need to make the change, it is your responsibility to make a strong
case for why the change should be made.

:::

## Resources

- [Initial Governance Description](https://github.com/paritytech/polkadot/wiki/Governance)
- [Democracy Pallet](https://github.com/paritytech/substrate/tree/master/frame/democracy/src)
- [Governance Demo](https://www.youtube.com/watch?v=VsZuDJMmVPY&feature=youtu.be&t=24734) - Dr.
  Gavin Wood presents the initial governance structure for Polkadot. (Video)
- [Governance on Polkadot](https://www.crowdcast.io/e/governance-on-polkadot--) - A webinar
  explaining how governance works in Polkadot and Kusama.


---
id: learn-guides-accounts-multisig
title: Polkadot-JS Guides about Multi-signature Accounts
sidebar_label: Multisig
description: Polkadot-JS Guides about Multi-signature Accounts
keyword: [guides, polkadot-js, accounts, multisig, multi-signature]
slug: ../learn-guides-accounts-multisig
---

import RPC from "./../../components/RPC-Connection";

## Creating a Multisig Account

Check the "How to create a multisig account" section on
[this support page](https://support.polkadot.network/support/solutions/articles/65000181826-how-to-create-and-use-a-multisig-account).
We recommend trying out the tutorial on
[Westend network](../maintain/maintain-networks.md#westend-test-network) - Polkadot's testnet.

## Multisig Transactions with Accounts Tab

:::info Walkthrough Video Tutorial

See [this video tutorial](https://www.youtube.com/watch?v=-cPiKMslZqI) to learn how to transact with
a multisig account using the Accounts Tab in the
[Polkadot-JS UI](https://polkadot.js.org/apps/#/accounts).

:::

You can create a multisig account directly on the Accounts Tab of the
[Polkadot-JS UI](https://polkadot.js.org/apps/#/accounts), and use this account to send funds. See
[this support article](https://support.polkadot.network/support/solutions/articles/65000181826-how-to-create-and-use-a-multisig-account)
for more information.

## Multisig Transactions with Extrinsic Tab

There are three types of actions you can take with a multisig account:

- Executing a call `asMulti`. This is used to begin or end a multisig transaction.
- Approving a call `approveAsMulti`. This is used to approve an extrinsic and pass-on to the next
  signatory (see [example below](#example-using-multi-signature-accounts) for more information).
- Cancelling a call `cancelAsMulti`.

:::info

Check out [this page](https://polkadot.js.org/docs/substrate/extrinsics#multisig) for more
information about the actions you can take with a multi-signature account.

:::

In scenarios where only a single approval is needed, a convenience method `as_multi_threshold_1`
should be used. This function takes only the other signatories and the raw call as arguments. Note
that the Polkadot-JS UI does not have integration for this call because it is not possible to create
multisig accounts with `threshold=1`. If you want to create a multisig with threshold 1, you can use
[txwrapper-core](https://github.com/paritytech/txwrapper-core), which is developed and supported by
Parity Technologies. There is a detailed
[multisig example](https://github.com/paritytech/txwrapper-core/tree/main/packages/txwrapper-examples/multisig)
that you can try out and change to see how it works.

However, in anything but the simple one approval case, you will likely need more than one of the
signatories to approve the call before finally executing it. When you create a new call or approve a
call as a multisig, you will need to place a small deposit. The deposit stays locked in the pallet
until the call is executed. The deposit is to establish an economic cost on the storage space that
the multisig call takes up on the chain and discourage users from creating dangling multisig
operations that never get executed. The deposit will be reserved in the caller's accounts, so
participants in multisig wallets should have spare funds available.

The deposit is dependent on the `threshold` parameter and is calculated as follows:

```
Deposit = depositBase + threshold * depositFactor
```

Where `depositBase` and `depositFactor` are chain constants (in
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} units) set in the runtime code. Currently,
the deposit base equals
{{ polkadot: <RPC network="polkadot" path="consts.multisig.depositBase" defaultValue={200880000000} filter="humanReadable"/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.multisig.depositBase" defaultValue={669599996400} filter="humanReadable"/> :kusama }}
and the deposit factor equals
{{ polkadot: <RPC network="polkadot" path="consts.multisig.depositFactor" defaultValue={320000000} filter="humanReadable"/>. :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.multisig.depositFactor" defaultValue={1066665600} filter="humanReadable"/>. :kusama }}

### Example using Multisig Accounts

:::info Walk-through video tutorial

See [this video tutorial](https://www.youtube.com/watch?v=T0vIuJcTJeQ) to learn how to transact with
a multisig account using the Extrinsic Tab in the
[Polkadot-JS UI](https://polkadot.js.org/apps/#/explorer).

:::

![multisig diagram](../assets/multisig-diagram.png)

Let's consider an example of a multisig on Polkadot with a threshold of 2 and 3 signers: Charlie,
Dan, and Eleanor. First, Charlie will create the call on-chain by calling the `multisig.asMulti`
extrinsic with the raw call, in this case, a balance transfer (`balances.transferKeepAlive`
extrinsic) from multisig CDE to Frank's account. When doing this, Charlie will have to deposit
`DepositBase + (2 * DepositFactor) = 20.152 DOT` while he waits for either Dan or Eleanor also to
approve the balance transfer call using the `multisig.approveAsMulti` or the `multisig.asMulti`
extrinsics.

If Dan submits the `multisig.approveAsMulti` extrinsic, he approves Charlie's call but he passes on
the final approval to Eleanor. So, although the multisig has threshold 2, in this case all 3/3
signatories need to participate in the transaction approval. Eleanor will need to submit a
`multisig.asMulti` or `multisig.approveAsMulti` extrinsic to transfer funds from CDE to Frank.

Alternatively, Dan or Eleanor can just submit a `multisig.asMulti` extrinsic after Charlie to
transfer the funds. In this case, 2/3 signatories will participate in the transaction approval. The
accounts approving Charlie's call will not need to place the deposit, and Charlie will receive his
deposit back once the transfer is successful or canceled. To cancel the transaction, Dan or Eleanor
can use the `multisig.cancelAsMulti` extrinsic.

Note that multisigs are **deterministic**, which means that multisig addresses are generated from
the addresses of signers and the threshold of the multisig wallet. No matter the order of the
signatories' accounts, the multisig will always have the same address because accounts' addresses
are sorted in ascending order.

:::note Addresses that are provided to the multisig wallet are sorted

Public keys of signers' wallets are compared byte-for-byte and sorted ascending before being used to
generate the multisig address. For example, consider the scenario with three addresses, A, B, and C,
starting with `5FUGT`, `5HMfS`, and `5GhKJ`. If we build the ABC multisig with the accounts in that
specific order (i.e. first A, then B, and C), the real order of the accounts in the multisig will be
ACB. If, in the Extrinsic tab, we initiate a multisig call with C, the order of the other
signatories will be first A, then B. If we put first B, then A, the transaction will fail.

:::

This has some implications when using the Extrinsics tab on the
[Polkadot-JS UI](https://polkadot.js.org/apps/#/accounts) to perform multisig transactions. If the
order of the _other signatories_ is wrong, the transaction will fail. This does not happen if the
multisig is executed directly from the Accounts tab (recommended). The Polkadot-JS UI supports
multisig accounts, as documented on the [Account Generation page](./learn-account-multisig.md). You
can see our video tutorials for more information about creating multisig accounts and transacting
with them using both the [Accounts Tab](https://www.youtube.com/watch?v=-cPiKMslZqI) and the
[Extrinsic Tab](https://www.youtube.com/watch?v=T0vIuJcTJeQ) in the Polkadot-JS UI.

## Decoding Multisig Call Data

:::info

Before signing a transaction, it is important to know the exact specifics of what is being signed.
Check the
["How to use a multisig account"](https://support.polkadot.network/support/solutions/articles/65000181826-how-to-create-and-use-a-multisig-account)
in the support docs on how to decode the multisig call data.

:::

---
id: learn-guides-accounts-proxy-pure
title: Polkadot-JS Guides about Pure Proxy Accounts
sidebar_label: Pure Proxy
description: Polkadot-JS Guides about Pure Proxy Accounts
keyword: [guides, polkadot-js, accounts, proxy, pure proxy, anonymous proxy]
slug: ../learn-guides-accounts-proxy-pure
---

import RPC from "./../../components/RPC-Connection";

:::caution The Account Tab in the Polkadot-JS UI cannot handle complex proxy setups

The Accounts Tab in the Polkadot-JS UI cannot handle complex proxy setups (e.g. a proxy -> multisig
-> a pure proxy which is part of another multisig). These complex setups must be done using the
[Extrinsics Tab](https://polkadot.js.org/apps/#/extrinsics) directly.

**We recommend to use the [Westend Testnet](learn-DOT.md#getting-tokens-on-the-westend-testnet) if
you are testing features for the first time.** By performing the complex proxy setups on the
testnet, you can comfortably replicate the procedure on the main networks.

:::

:::danger Risk of loss of funds

Read carefully the text below and before performing any action using anonymous proxies on
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}, experiment on the Westend testnet.

:::

## Create and Remove Pure Proxies with Polkadot-JS

To create a **pure proxy** see
[this support article](https://support.polkadot.network/support/solutions/articles/65000182196), or
watch [this technical explainer video](https://www.youtube.com/watch?v=T443RcCYP24).

:::caution Removing Pure Proxies

The procedure for removing a _pure_ proxy is different from the one used to remove other proxies.
Visit the section "Removing an Anonymous Proxy" on
[this support article](https://support.polkadot.network/support/solutions/articles/65000182196), or
watch [this technical explainer video](https://www.youtube.com/watch?v=T443RcCYP24).

:::

Learn more about pure proxies from our
[technical explainer video](https://www.youtube.com/watch?v=YkYApbhU3i0).

## Advanced Account Management with Pure Proxies

:::info Walk-through tutorial video of Account Management

You can see [this video tutorial](https://www.youtube.com/watch?v=YkYApbhU3i0) that goes through the
example below. The tutorial requires some familiarity with the Extrinsic Tab of the Polkadot-JS UI.

:::

Let's take for example 3 accounts belonging to Charlie, Dan and Eleanor working for Company X.
Charlie holds funds belonging to Company X, but he wants to leave the company and transfer the
economic responsibility to Eleanor. Dan is a staking proxy of Charlie.

**Without _Pure_ Proxy**, Charlie must (see _left_ side of the Figure below):

- Remove Dan as a staking proxy, this step requires 1 signature
- Stop nominating and unbound all funds , this step requires 2 signatures
- Transfer the funds to Eleanor, this step requires 1 signature

Then Eleanor adds Dan as a staking proxy (1 signature). The whole process requires 5 signatures.
Here we are presenting a simple example, in fact, with multi-signature accounts and multiple proxies
the procedure would be more time-consuming and labor-intensive.

![why anonymous proxies](../assets/why-anon-proxy.png)

**With _Pure_ Proxy** (see _right_ side of the Figure above), Charlie must add Eleanor as _any_
proxy of the _pure_ proxy, and remove himself (or Eleanor can remove him). The process requires just
2 signatures (1 signature to add the new _any_ proxy and 1 signature the remove the old one). The
funds remain in the _pure_ proxy, and it is not necessary to stop nominating or unbond funds. Also,
any proxy relationships with the _pure_ proxy stay in place. Thus, if we use the _pure_ proxy, with
an increasing number of proxies we will always have to sign twice (not necessarily true in
multi-signature accounts). While if we are not using the _pure_ proxy, the more the proxies the more
signatures we need to detach them from the old stash and attach them to the new stash (see Figure
below).

![anon vs stash plot](../assets/anon-vs-stash-plot.png)

## Pure Proxies and Multisigs

### Scenario One: One Pure Proxy within a Multisig

:::info Walk-through tutorial video

You can see [this video tutorial](https://www.youtube.com/watch?v=iGRoGstB_pQ) that goes through
this scenario. The tutorial requires some familiarity with the Extrinsic Tab of the Polkadot-JS UI.

:::

It is possible to put a _pure_ proxy within a multisig, and then transactions will be signed by the
_any_ proxy on behalf of the _pure_ proxy (proxied account). Let's take for example the diagram
below. Alice, Bob and Anon are part of the multisig ABC, a multisig account with threshold 2. P-C is
a _pure_ proxy spawned by Charlie, who now acts as _any_ proxy and thus signs anything on behalf of
P-C. The _pure_ proxy cannot sign directly because it does not have a private key. So, for example,
to send funds from the multisig to Dan, Charly needs to submit a `proxy.proxy` extrinsic to P-C,
which in turn will submit a `multisig.asMulti` extrinsic to ABC containing the call data for the
`balances.transferKeepAlive` extrinsic about the transfer of some funds from ABC to Dan. Alice can
then approve the transfer by submitting a `multisig.asMulti` extrinsic also containing the call data
for the `balances.transferKeepAlive` extrinsic about the transfer of some funds from ABC to Dan.

![multisig with one anon](../assets/multisig-with-one-anon.png)

If Charly wants to leave the multisig, a new _any_ proxy can be added to P-C and Charly can be
removed (by himself or by the new _any_ proxy). Note that the multisig also contains Bob that in
this specific example does not do anything.

:::note Proxy calls

To use a _pure_ proxy within a multisig you need to use the Extrinsic Tab and generate a
`proxy.proxy` extrinsic. If you try to sign a multisig transaction using the _pure_ proxy you will
be prompted with a warning. Remember, you cannot sign something directly if you do not have a
private key.

:::

### Scenario Two: Multisig made of Pure Proxies

:::info Walk-through Tutorial Video

You can see [this video tutorial](https://www.youtube.com/watch?v=F82C3zDNJyk) that goes through
this scenario. The tutorial requires some familiarity with the Extrinsic Tab of the Polkadot-JS UI.

:::

The diagram below shows a multisig that is made only with _pure_ proxies (P-A, P-B and P-C). In this
situation Alice, Bob or Charly can leave the multisig at any time without the requirement of
creating a new multisig. If for example, Bob leaves the multisig the procedure will require somebody
else to be added as _any_ proxy to P-B, and then Bob can remove himself (or the new _any_ proxy can
remove Bob).

![multisig with anons](../assets/multisig-with-anons.png)

In the diagram above, Alice submits the `proxy.proxy` extrinsic to P-A, which in turn submits the
`multisig.asMulti` extrinsic containing the `balances.transferKeepAlive` extrinsic about the
transfer of some tokens from ABC to Dan. Then, Charly does the same to confirm the transaction. Note
that Charly will need to pay for some weight, for the computation that is necessary to execute the
transaction.

### Scenario Three: Multisig controlling a Pure Proxy

This setup is used by the [MultiX](../general/multisig-apps.md#multix) tool.

After its creation, a multi-signature account creates a pure proxy that becomes the proxied account.
The multi-signature account behaves as _any_ proxy of the pure. If signatories of the
multi-signature account change, a new multisig can be created, assigned as _any_ proxy of the pure,
and then the old multisig can be removed as a proxy.

![multisig with pure](../assets/multisig-with-pure.png)

Compared to [Scenario Two](#scenario-two-multisig-made-of-pure-proxies), signatories do not need to
create pure proxies here. Multisig controlling a Pure Proxy is a more practical solution, where the
signatories, number of signatories and/or the threshold can be changed, which changes the multisig
address but does not impact the pure proxy address. In Scenario Two, if signatories behind the pure
proxies change, the address of the multisig stays the same. However, changing the number of
signatories and threshold would not be possible.


---
id: learn-guides-accounts-proxy
title: Polkadot-JS Guides about Proxy Accounts
sidebar_label: Proxy
description: Polkadot-JS Guides about Proxy Accounts
keyword: [guides, polkadot-js, accounts, proxy]
slug: ../learn-guides-accounts-proxy
---

import RPC from "./../../components/RPC-Connection";

Proxies allow users to use an account (it can be in cold storage or a hot wallet) less frequently
but actively participate in the network with the weight of the tokens in that account. Proxies are
allowed to perform a limited amount of actions related to specific
[substrate pallets](https://docs.substrate.io/reference/frame-pallets/) on behalf of another
account. The video below contains more information about using proxies.

[![Proxy Accounts](https://img.youtube.com/vi/1tcygkq52tU/0.jpg)](https://www.youtube.com/watch?v=1tcygkq52tU)

:::tip Know how to check the calls and pallets accessible by proxies

For the latest information on the calls and pallets that can be fully accessed by proxies, check the
[source code in the runtime folder](https://github.com/paritytech/polkadot-sdk/blob/153543b0c8c582e73f520e5c08cbe33bddfb5f69/runtime/polkadot/src/lib.rs#L1158)
on the [Polkadot repository](https://github.com/paritytech/polkadot-sdk)

:::

## Creating Proxy with Polkadot-JS

To create a proxy account with Polkadot-JS read
[this support article](https://support.polkadot.network/support/solutions/articles/65000182179-how-to-create-a-proxy-account).

## Removing Proxy with Polkadot-JS

Read the section "Removing Proxies" on
[this support page](https://support.polkadot.network/support/solutions/articles/65000182179-how-to-create-a-proxy-account)
to learn how to remove proxies.

## View your Proxy on Polkadot-JS

To view your proxy, just go on the _Accounts_ menu in the Polkadot-JS UI, next to the proxied
account you will notice a blue icon. Hover on it, and you will see _Proxy overview_. Click on it and
you will be presented with a list of all proxies for that account.

![polkadot_view_proxies](../assets/polkadot_view_proxies.png)

Additionally, you can head over to the _Chain State_ tab (underneath the _Developer_ menu) on
[Polkadot-JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.polkadot.io#/chainstate). If
you've created your proxy on a {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}
account, it is required to change your network accordingly using the top left navigation button. On
this page, the proxy pallet should be selected, returning the announcements and proxies functions.
The proxies function will allow you to see your created proxies for either one account or for all
accounts (using the toggle will enable this). Proxy announcements are what time lock proxies do to
announce they are going to conduct an action.

![polkadot_view_proxies_dev](../assets/polkadot_view_proxies_dev.png)

## Set-up and Use of Time-delayed Proxies with Polkadot-JS

:::info

See [this video tutorial](https://youtu.be/3L7Vu2SX0PE) to learn how you can setup and use
time-delayed proxies. The video goes through the example below.

:::

Initially the time time-delayed proxy announces its intended action using the `proxy.announce`
extrinsic and will wait for the number of blocks defined in the delay time before executing it. The
proxy will include the hash of the intended function call in the announcement. Within this time
window, the intended action may be canceled by accounts that control the proxy. This can be done by
the proxy itself using the `proxy.removeAnnouncement` extrinsic or by the proxied account using the
the `proxy.rejectAnnouncement` extrinsic. Now we can use proxies knowing that any malicious actions
can be noticed and reverted within a delay period. After the time-delay, the proxy can use the
`proxy.proxyAnnounced` extrinsic to execute the announced call.

Let's take for example the stash account Eleanor setting Bob as a time-delayed staking proxy. In
this way, if Bob submits an extrinsic to change the reward destination, such extrinsic can be
rejected by Eleanor. This implies that Eleanor monitors Bob, and that within the time-delay she can
spot the announced extrinsic. Eleanor can check all the proxy call announcements made by her
account's proxies on-chain. On Polkadot-JS UI, go to Developer > Storage > Proxy > Announcements to
check the hashes for the calls made by the proxy accounts and the block height at which they are
enabled for execution.

![time-delayed proxies](../assets/time-delayed-proxies.png)

:::info

If you try to use `proxy.proxyAnnounced` to execute the call within the time-delay window you will
get an error "Proxy unannounced" since the announcement will be done after the time delay. Also note
that regular `proxy.proxy` calls do not work with time-delayed proxies, you need to announce the
call first and then execute the announced call on a separate transaction.

:::

## Proxy calls

Proxy calls are used by proxies to call proxied accounts. These calls are important for example in
the case of _pure_ proxies, as any attempt to sign transactions with a _pure_ proxy will fail. For
more details see the [dedicated section about pure proxies](./learn-proxies-pure.md).

### Nested Proxy Calls

As the term suggests, nested proxy calls are proxy calls within proxy calls. Such calls are needed
if there are proxied accounts that are proxies themselves. In the example diagram below, Alice has a
stash account that has a _staking_ proxy account, P-C. P-C is a _pure_ proxy, a proxied account
originally spawned by Charly that is now an _any_ proxy of P-C and signs everything on its behalf.

![nested proxy calls](../assets/nested-proxy-calls.png)

For example, to bond more funds, Charly needs to submit a `prox.proxy` extrinsic to P-C, which in
turn submits a `proxy.proxy` extrinsic to Alice including for example a `staking.bondExtra`
extrinsic, specifying the number of extra tokens that need to be bounded. If Charly wants to leave,
a new account can take his place as any proxy (before Charly leaves!). There is no need to change
the staking proxy account. Also, Alice is the only one who can remove P-C as a staking proxy, and
P-C can only perform staking-related tasks. For example, P-C cannot send funds out from Alice's
account.

Proxy calls can be done using the Extrinsic Tab in the Polkadot-JS UI. Nested proxy calls can be
done by calling each `proxy.proxy` extrinsic separately, or in some cases by just calling the last
`proxy.proxy` extrinsic. In the diagram above, submitting the proxy call from P-C to Alice will
automatically ask for Charly's signature. Thus one proxy call will trigger the second one because
Charly's is the only _any_ proxy of P-C, and P-C cannot sign anything. While if we want to use Bob's
account we will need to submit all three proxy calls.



---
id: learn-guides-accounts
title: Polkadot-JS Guides about Accounts
sidebar_label: Accounts
description: Polkadot-JS Guides about Accounts
keyword: [guides, polkadot-js, accounts]
slug: ../learn-guides-accounts
---

import RPC from "./../../components/RPC-Connection";

## Account Address Format

An account created for {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} can also be
used on multiple chains in the {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}
ecosystem. More specifically, the account of a chain that uses the `*25519` account address format
(the latest list can be accessed on the
[ss58 registry repository](https://github.com/paritytech/ss58-registry/blob/main/ss58-registry.json)
is cross-compatible with all the chains that use the similar format. To switch between the accounts
on different chains, you can follow the guidelines in
[this support article](https://support.polkadot.network/support/solutions/articles/65000103707-can-i-use-the-same-account-on-polkadot-kusama-and-parachains-).
[Subscan has a tool](https://polkadot.subscan.io/tools/format_transform) you can use to convert your
address between the different chain formats.

:::info Using the same account on multiple chains - Pros and Cons

The address format differs from chain to chain, but that difference is only visual. The same private
key can be used to sign transactions on behalf of the respective accounts on multiple chains. Using
a single account on multiple chains is convenient, as you do not have to deal with multiple mnemonic
phrases or private keys. But, if your account gets compromised on one chain, the attacker can gain
full access to the accounts on all other chains. This also has implications for the account holder's
privacy, as knowing the identity of an account on one chain can expose the account holder's identity
on all the chains. In the Accounts tab, the Polkadot-JS UI displays a warning message next to each
Account you are using on multiple chains and recommends using different Accounts on different chains
(see below).

![warning multiple chains](../assets/warning-multichain-account.png)

:::

On Polkadot-JS Extension, you can copy your address by clicking the account's icon while the desired
chain format is active. E.g. selecting "Substrate" as the format will change your address, and
clicking the colorful icon of your account will copy it in that format. While in
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} mode, that address format will be
copied, and so on.

## Polkadot-JS Browser Extension

[![Polkadot-JS Browser Extension Tutorial](https://img.youtube.com/vi/DNU0p5G0Gqc/0.jpg)](https://www.youtube.com/watch?v=DNU0p5G0Gqc)

:::info

For guidelines about how to create an account using the Polkadot Extension, see
[**this video tutorial**](https://youtu.be/DNU0p5G0Gqc) and visit
[**this support article**](https://support.polkadot.network/support/solutions/articles/65000098878-how-to-create-a-dot-account).

:::

The Polkadot-JS Browser Extension (the Polkadot Extension) provides a reasonable balance of security
and usability. It provides a separate local mechanism to generate your address and interact with
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}.

This method involves installing the Polkadot Extension and using it as a “virtual vault," separate
from your browser, to store your private keys. It also allows the signing of transactions and
similar functionality.

It is still running on the same computer you use to connect to the internet and thus is less secure
than using Parity Signer or other air-gapped approaches.

### Account Backup using the Polkadot-JS Browser Extension

:::info

See [**this video tutorial**](https://youtu.be/DNU0p5G0Gqc) and visit
[**this support page**](https://support.polkadot.network/support/solutions/articles/65000177677-how-to-export-your-json-backup-file)
to know how to back up your account.

:::

### Reset Password using the Polkadot-JS Browser Extension

:::info

See [**this video tutorial**](https://www.youtube.com/watch?v=DNU0p5G0Gqc&t=280s) to learn how to
change the password for an account that has been created on the Polkadot-JS browser extension (i.e.
an injected account).

:::

:::warning

Before following the instructions below, make sure you have your mnemonic phrase stored in a safe
place accessible to you.

:::

Let's say you created `ACCOUNT 1` protected by password `PSW 1`. To reset the password of your
`ACCOUNT 1` using the browser extension, you must follow the following steps:

- Go to `ACCOUNT 1` on the browser extension and click "Forget account". This action will delete the
  access to your account. Note that your tokens are still in your account on the
  {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} blockchain network.
- On the browser extension click the "+" button in the top right corner and select the option
  "Import account from pre-existing seed". After entering the mnemonic phrase, you can choose a new
  password, `PSW 2`.

:::info JSON files do not allow changing account passwords

If you add the account to the extension using the option "Restore account from backup JSON file",
this will allow you to restore access to your account using a JSON file protected by the password
`PSW 1`, but does not let you set a new password. Thus, `PSW 1` will become the account password by
default.

:::

:::info Accounts on Cold wallets do not need passwords

For hardware wallets such as [Ledger](https://www.ledger.com/), you may have to set a PIN for
accessing the accounts on the device, but you do not need to set a password for every individual
account. When you need to make transactions with your account, you are required to sign using your
Ledger device. Also, Ledger wallets let you generate multiple accounts for multiple blockchain
networks without setting different passwords to access such accounts.

:::

### Restore Account on the Polkadot-JS Browser Extension

:::info

See [**this video tutorial**](https://youtu.be/9ohp8k4Hz8c) and
[**this support page**](https://support.polkadot.network/support/solutions/articles/65000169952-how-to-restore-your-account-in-the-polkadot-extension)
to learn how to restore your account on the Polkadot-JS UI.

:::

## Polkadot-JS UI

:::info

For guidelines about how to create an account using Polkadot-JS UI, see
[**this video tutorial**](https://youtu.be/DNU0p5G0Gqc) and visit
[**this support article**](https://support.polkadot.network/support/solutions/articles/65000180529).

:::

:::caution

If you use this method to create your account and clear your cookies in your browser, your account
will be lost forever if you do not [back it up](#restore-account-on-the-polkadot-js-ui). Make sure
you store your seed phrase in a safe place or download the account's JSON file if using the
Polkadot{.js} browser extension. Learn more about account backup and restoration
[here](#restore-account-on-the-polkadot-js-ui).

:::

Local in-browser account storage is disabled by default on the Polkadot-JS UI. To create an account
using the Polkadot-JS UI, navigate to settings > account options and click on allow local in-browser
account storage in the drop-down menu. Using the Polkadot-JS user interface without a browser
extension is **not recommended**. It is the least secure way of generating an account. It should
only be used if all other methods are not feasible.

### Account Backup using the Polkadot-JS UI

:::info

See [**this video tutorial**](https://youtu.be/DNU0p5G0Gqc) and visit
[**this support page**](https://support.polkadot.network/support/solutions/articles/65000177677-how-to-export-your-json-backup-file)
to know how to back up your account.

:::

### Reset password using the Polkadot-JS UI

To reset the password of an account created with Polkadot-JS Apps UI, you need to go to the
"Accounts" tab, click the icon with three vertical dots on your account and select "Change this
account's password".

See [**this video tutorial**](https://youtu.be/DNU0p5G0Gqc?t=261) to learn how to change the
password for an account created on the Polkadot-JS UI (i.e. a non-injected account).

:::note

If you create an account first using Polkadot-JS Apps UI and then add it to the browser extension,
you need to follow the
[guidelines for the browser extension](#reset-password-using-the-browser-extension) to change the
password of such an account.

:::

### Restore Account on the Polkadot-JS UI

See [**this video tutorial**](https://youtu.be/cBsZqFpBANY) and
[**this support page**](https://support.polkadot.network/support/solutions/articles/65000180110-how-to-restore-your-account-in-polkadot-js-ui)
to learn how to restore your account on the Polkadot-JS UI.

### Unlocking Locks

:::info Locks do not stack!

The biggest lock decides the total amount of locked funds. See
[**this walk-through video tutorial**](https://youtu.be/LHgY7ds_bZ0) that will guide you in the
process of unlocking funds in the example above.

:::

In the example, the locked balance is 0.55 KSM because the biggest lock is on democracy and is 0.55
KSM. As soon as the democracy lock is removed the next biggest lock is on staking 0.5 KSM (bonded
0.4 KSM + redeemable 0.1 KSM). This means that the locked balance will be 0.5 KSM, and 0.05 KSM will
be added to the transferrable balance. After redeeming the unbonded 0.1 KSM, the locked balance will
be 0.4 KSM, and an additional 0.1 KSM will be added to the transferrable balance. Now the biggest
lock is still the bonded one. This means that even if we remove the vested lock, the locked balance
will still be 0.4 KSM and no tokens will be added to the transferrable balance. To free those bonded
tokens we will need to unbond them and wait for the unbonding period to make them redeemable. If we
remove the proxy the reserved funds will be automatically added to the transferrable balance.

## Query Account Data in Polkadot-JS

In the Polkadot-JS UI, you can also query account data under
[Developer > Chain state](https://polkadot.js.org/apps/#/chainstate). Under `selected state query`
choose the system pallet followed by `account(AccountId32): FrameSystemAccountInfo`, under `Option`
choose an account, and then click on the "+" button on the right.

![account_balance_types](../assets/AccountData-struct.png)

Account information include:

- `nonce`, the number of transactions the account sent.
- `consumers`, the number of other modules that currently depend on this account's existence. The
  account cannot be reaped until this is zero.
- `providers`, the number of other modules that allow this account to exist. The account may not be
  reaped until this and `sufficients` are both zero.
- `sufficients`, the number of modules that allow this account to exist for their own purposes. The
  account may not be reaped until this and `providers` are both zero.
- `data`, the additional data that belongs to this account. Used to store the balance(s) in a lot of
  chains.

More in-depth information about the above data can be found in the
[substrate code base](https://github.com/paritytech/substrate/blob/2e7fde832b77b242269b136f1c3b6fffef86f9b6/frame/system/src/lib.rs#LL767C1-L781C24).

The `AccountData` structure defines the balance types in Substrate. The three types of balances
include `free`, `reserved`, and `frozen`. The **usable** balance of the account is the amount that
is `free` minus any funds considered `frozen`, while the **total** balance of the account is the sum
of `free` and `reserved` funds. The `flags` describe extra information about the account.

More in-depth information about the above data can be found in the
[balances pallet in the Substrate code base](https://github.com/paritytech/substrate/blob/2e7fde832b77b242269b136f1c3b6fffef86f9b6/frame/balances/src/types.rs#LL95-L114).

## Vanity Generator

The vanity generator is a tool on [Polkadot-JS UI](https://polkadot.js.org/apps/#/accounts/vanity)
that lets you generate addresses that contain a specific substring. For the tutorial on how to
create an account using Vanity Generator, visit
[this support article](https://support.polkadot.network/support/solutions/articles/65000171416).

## Encryption Enhancement

Some newly generated `JSON` account files cannot be imported (restored) into older wallet software.
This is due to an enhanced encryption method, noticeable in a slight delay when
encrypting/decrypting your wallet. If you cannot load a `JSON` file, please use the latest version
of the wallet software. If you cannot load it, ensure that the wallet software uses the newest
version of the [Polkadot API](https://polkadot.js.org/api/).



---
id: learn-guides-assets-create
title: Polkadot-JS Guides about Creating Assets
sidebar_label: Creating Assets
description: Polkadot-JS Guides about Creating Assets.
keywords: [asset hub, assets, statemine, statemint, polkadot-js]
slug: ../learn-guides-assets-create
---

import RPC from "./../../components/RPC-Connection";

The Asset Hub is a generic assets system parachain which provides functionality for deploying and
transferring assets — both Fungible and Non-Fungible Tokens (NFTs). The native token of the Asset
hub is {{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }}. The Existential Deposit (ED),
transaction fees, and the deposits for proxy/multisig operations are about 1/10th of the values on
the Relay chains. For example, the Existential Deposit of an Asset Hub account is
{{ polkadot: <RPC network="statemint" path="consts.balances.existentialDeposit" defaultValue={1000000000} filter="humanReadable"/>, :polkadot }}
{{ kusama: <RPC network="statemint" path="consts.balances.existentialDeposit" defaultValue={1000000000} filter="humanReadable"/>, :kusama }}
when compared to
{{ polkadot: <RPC network="polkadot" path="consts.balances.existentialDeposit" defaultValue={10000000000} filter="humanReadable"/> on Polkadot :polkadot }}
{{ kusama:  <RPC network="polkadot" path="consts.balances.existentialDeposit" defaultValue={10000000000} filter="humanReadable"/> on Kusama :kusama }}.
Apart from the core protocol token {{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }}, the
assets held on the Asset Hub can be broadly categorized as

- Assets backed by an on-chain protocol’s utility
- Assets with off-chain backing
- Assets without any backing

For additional background on the Asset Hub check out
[this support article](https://support.polkadot.network/support/solutions/articles/65000181800-what-is-statemint-and-statemine-and-how-do-i-use-them-).

## Creating Assets on the Asset Hub with Polkadot-JS

:::info

Before minting assets on the Asset Hub, we recommend that you try out this tutorial on Westmint,
which is a parachain on Westend. The WND tokens (Westies) are free and are available through a
[faucet](https://wiki.polkadot.network/docs/learn-DOT#getting-westies).

**The images in the guides below are for Polkadot, but they also apply to Kusama.**

:::

To create an asset on the Asset Hub, you would need a deposit of
{{ polkadot: <RPC network="statemint" path="consts.assets.assetDeposit" defaultValue={100000000000} filter="humanReadable"/> :polkadot }}
{{ kusama: <RPC network="statemine" path="consts.assets.assetDeposit" defaultValue={100000000000} filter="humanReadable"/> :kusama }}
and around
{{ polkadot: <RPC network="statemint" path="consts.assets.metadataDepositBase" defaultValue={2006800000} filter="humanReadable"/> :polkadot }}
{{ kusama: <RPC network="statemine" path="consts.assets.metadataDepositBase" defaultValue={2006800000} filter="humanReadable"/> :kusama }}
for the metadata. Before you create an asset on the Asset Hub, ensure that your Asset Hub account
balance is a bit more than the sum of those two deposits, which should seamlessly account for the
required deposits and transaction fees. You can send
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} from a
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} account to a the Asset Hub account
using the teleport functionality. For instructions on teleporting
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }}, check this
[tutorial on Teleports](../learn/learn-teleport.md).

Assuming you have the required {{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} balance on
your Asset Hub account, the following instructions should let you successfully create an asset on
the Asset Hub

- Access the Asset Hub through [Polkadot-JS UI](https://polkadot.js.org/apps/#/explorer).
- Navigate to Network > Assets.

![Navigate to Assets page](../assets/asset-hub/hub-asset-0.png)

- Click on the create button and you will be presented with a pop-up window. Choose the creator
  account, name of the asset to be displayed on the Asset Hub, the asset's symbol, number of
  decimals for the asset, the minimum balance required to hold this asset on an Asset Hub account
  and the most important field of your asset - the unique asset ID. The UI would not let you enter
  an ID that has already been taken. After all the details are entered, click on the next button.

![Add Asset Metadata](../assets/asset-hub/hub-asset-1.png)

- Choose the admin, issuer and the freezer accounts for your asset and click on the create button.

![Asset managing accounts](../assets/asset-hub/hub-asset-2.png)

- Sign and submit the transaction (If you like to verify the transaction details before signing, you
  can click on the dropdown button pointed by the arrow in the snapshot below).

![Sign asset creating transaction](../assets/asset-hub/hub-asset-3.png)

If the transaction is successful, you should see the asset and its details displayed in the
Network > Assets page on the Asset Hub.


---
id: learn-guides-assets-ledger
title: Polkadot-JS Guides about Asset Hub Ledger App
sidebar_label: Asset Hub Ledger App
description: Polkadot-JS Guides about Ledger and the Asset Hub.
keywords: [asset hub, ledger, assets, statemine, statemint, polkadot-js]
slug: ../learn-guides-assets-ledger
---

:::info

Because of required WebUSB support, Ledger wallets currently only work on Chromium-based browsers
like Brave, Chrome or Edge.

:::

The Asset Hub has a [Ledger](https://www.ledger.com/) application that is compatible with the Ledger
Nano S and Ledger Nano X devices. The Ledger devices are hardware wallets that keep your private key
secured on a physical device that does not get directly exposed to your computer or the internet.

The Statemine application allows you to manage your KSM and other tokens on the Asset Hub parachain.
It supports most of the available transaction types of the network in the XL version of the app
(details [below](#installing-the-ledger-application)).

If you have trouble using Ledger or following the directions below, you can try searching for your
issue on the [Polkadot Support page](https://support.polkadot.network/).

:::note Intro to Ledger Explainer

Please check out our
[intro to Ledger video on YouTube for more information](https://youtu.be/7VlTncHCGPc).

:::

## Requirements

Here is a list of what you will need before starting:

- A Ledger Nano S or a Ledger Nano X.
- The latest firmware installed.
- Ledger Live is installed and at version 2.29 or newer (see settings -> about to find out if you're
  up to date).
- A web browser is installed that you can use to access
  [Polkadot-JS Apps UI](https://polkadot.js.org/apps/#/explorer).

## Installing the Ledger Application

### Using Ledger Live

:::note Ledger Nano S

There are two versions of the Statemine app: the normal (light) version and the XL version. The
light version has smaller size but it supports only basic functionality. If you want access to all
the supported extrinsics, you need to install the XL version of the app. You can see
[here](https://github.com/Zondax/ledger-statemine) a full list of the extrinsics supported by both
versions.

:::

- Open the "Manager" tab in Ledger Live.
- Connect and unlock your Ledger device.
- If asked, allow the manager on your device by pressing both buttons on the YES screen.
- Search for Statemine in the app catalog.
- If you are using a Ledger Nano S, install either the normal (light) version or the XL version. For
  Ledger Nano X, there will only be one app available.

Please proceed to the [usage instructions](#using-on-polkadot-js-apps) below.

## Using on Polkadot-JS Apps UI

:::info

The Polkadot extension doesn't support Statemine Ledger accounts at this point, so you need to add
your account on Polkadot-JS UI as described below.

:::

### Adding Your Account

:::note

These instructions will guide you on how to add a Ledger account that's **only** available on the
Asset Hub. If you want to use the same Ledger account on both
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} **and** the Asset Hub check the
instructions [below](#working-on-relay-chains-and-asset-hubs).

:::

[Polkadot-JS Apps UI](https://polkadot.js.org/apps/#/explorer) already has an integration with the
Ledger application so that your device will work with the browser interface after installation. The
functionality is currently gated behind a feature setting that you will need to turn on.

In order to turn on the interoperability with the Statemine Ledger application, go to the "Settings"
tab in [Polkadot-JS Apps UI](https://polkadot.js.org/apps/#/explorer). Find the option for attaching
Ledger devices and switch the option from the default "Do not attach Ledger devices" to "Attach
Ledger via WebUSB" (**but see note above**).

![Dropdown selector for allowing Ledger connections in Polkadot-JS Apps UI Settings](../assets/ledger.png)

Click "Save" to keep your settings.

Now when you go to the "Accounts" tab you will see a new button that says "Add via Ledger". Ensure
that your Ledger device is unlocked, Ledger Live is **closed** and you have
[switched over](https://support.polkadot.network/support/solutions/articles/65000169778-how-to-switch-network-nodes)
to the Statemine application, then click this button.

![Add Ledger button in Polkadot-JS Apps UI](../assets/ledger/query-ledger.png)

A popup will appear asking you to select an account and derivation path.

![Picking an account and derivation path](../assets/ledger/add-account.png)

The first option lets you select an account. You can have multiple accounts on a single Ledger
device. The second dropdown lets you pick a derivation path - think of it like a formula from which
child accounts are generated. If in doubt, pick the default option for both.

Once you confirm your selection, depending on your browser and its security settings, you might need
to confirm the USB connection through a popup like the one below when adding the Ledger device for
the first time:

![Display the device connection popup](../assets/ledger/query-device.png)

You should now be able to scroll down and find a new account on the page with the type "ledger".

![Displaying the Ledger account in the list](../assets/ledger/ledger-balance.png)

You can now use this account to interact with the Asset Hub on
[Polkadot-JS Apps UI](https://polkadot.js.org/apps/#/explorer) and it will prompt your ledger for
confirmation when you initiate a transaction.

### Working on Relay Chains and Asset Hubs

Polkadot and Kusama accounts from the [extension](../general/polkadotjs.md#polkadot-js-extension)
will show up in the Asset Hub, even if they're not set to be used on all chains. The Asset Hub is a
system parachains on {{ polkadot: Polkadot :polkadot}}{{ kusama: Kusama :kusama}} and uses
{{ polkadot: DOT :polkadot}}{{ kusama: KSM :kusama}} as native token. Hence, accounts on a Relay
Chain are also available on each Relay's system chains. What this means is that if you already have
a {{ polkadot: Polkadot :polkadot}}{{ kusama: Kusama :kusama}} Ledger account configured on the
extension, that account will also be available on the Asset Hub. But the opposite is not the case:
an account created specifically on the Asset Hub won't show up on
{{ polkadot: Polkadot :polkadot}}{{ kusama: Kusama :kusama}}.

**However**, as mentioned above, the
[Polkadot extension](../general/polkadotjs.md#polkadot-js-extension) does not support Statemine
Ledger accounts at the moment, but the Polkadot-JS UI does. So, if your Kusama account is in the
Polkadot extension, you'll need to remove it from there and re-add it on Polkadot-JS UI directly
**as a Kusama account**, as described
[here](https://guide.kusama.network/docs/kusama-ledger#using-on-polkadot-js-apps-ui). After that,
you will be able to make transactions with that account.

To remove an account from the Polkadot extension:

1. Open the extension
2. Click on the three dots next to the account
3. Select "Forget account".

:::info

As mentioned above, a {{ polkadot: Polkadot :polkadot}}{{ kusama: Kusama :kusama}} Ledger account
will also be available on the Asset Hub.

:::

### Confirming the Address on your Device

On the "Accounts" tab, find your Ledger-connected account. Click on the three vertical dots at the
end of the row. This will open a new menu, here you can click the "Show address on hardware device"
option to display the address on your device.

![Options menu of an account in the Accounts screen of Polkadot-JS Apps UI](../assets/ledger-4.png)

Here you can scroll through and make sure the address matches to what is displayed on
[Polkadot-JS Apps UI](https://polkadot.js.org/apps/#/explorer).

#### Using Polkadot-JS Apps

Once you have your account loaded on the "Accounts" tab it should show a row with your Ledger
account. At the far right of the row is located your account's DOT balance. If you expand the
balance arrow, it will show details of your balance such as locks or reserved amounts.

![Account row showing empty balance](../assets/ledger/ledger-balance.png)

### Sending a Transfer

If you would like to send a transfer from your account housed on the Ledger device, the easiest
method is to use [Polkadot-JS Apps UI](https://polkadot.js.org/apps/#/explorer).

:::info Transfers

Transferring in this way sends tokens to another account on the Asset Hub parachain. If you need to
transfer KSM between the Asset Hub and
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}, see the [Teleporting](#teleporting)
section below.

:::

- Click on the "Send" button next to your account.
- In the second input, select one of the accounts from the drop-down menu or paste the address that
  you want to transfer funds to.
- In the third input, enter the amount of KSM you want to transfer.
- Click the "Make Transfer" button.
- Confirm the transaction on your device.
- A green success notification will be displayed when the transaction is included in a block.

:::note The "Transfer with Keep-Alive Checks" toggle

Note the "Transfer with Keep-Alive Checks" toggle. While this toggle is in the _On_ state, your
account will be unable to make transactions which would get its balance below the existential
deposit. This prevents reaping of accounts with low balances. If you toggle this to _Off_, you will
be able to go below existential deposit balance, causing your account to be deleted and any dust
amount of KSM to be burned. If you encounter KeepAlive errors when making transactions, this might
be the reason.

A detailed guide on doing transfers is available [here](../learn/learn-balance-transfers.md).

:::

### Receiving a Transfer

In order to receive a transfer on the accounts stored on your Ledger device, you will need to
provide the sender (i.e. the payer) with your address.

The easiest way to get your address is to click on the account name which will open a sidebar. Your
address will be shown in this sidebar, along with some other information. Another method is just
clicking on your account's avatar icon - this immediately copies your address to the clipboard.

:::note Your Asset Hub address is the same as your Relay Chain address

Make sure that you clarify to the sender that you wish to receive your tokens on the Asset Hub
parachain, otherwise (if you're receiving {{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }}
tokens) they could be sent on the {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}
chain.

:::

:::caution Before giving anyone your address

Make sure it matches what's really on the Ledger by
[confirming the address on your device](#confirming-the-address-on-your-device). Some malware will
intercept clicks and clipboard requests and can change your copied value in-flight, so being extra
vigilant around copy-paste operations makes sense.

:::

### Teleporting

Teleporting allows you to send tokens between the Relay Chain and a parachain, or between different
parachains.

The Statemine Ledger app doesn't support the `teleport` extrinsic at this point, so an intermediary
account needs to be created first.

To teleport KSM to the Relay Chain follow these steps:

- Create an account outside your Ledger. Instructions can be found
  [here](./learn-accounts.md#account-generation).
- Transfer the desired amount as described [above](#sending-a-transfer). If you want to send exactly
  the amount you want to teleport, don't forget take into account the fees for teleporting that will
  be deducted in the next step.
- Teleport your tokens following the instructions you will find [here](../learn/learn-teleport.md).

Teleporting **to** a Ledger account from a non-Ledger account doesn't require these extra steps.

## Support

If you need support, please visit the [Polkadot Support page](https://support.polkadot.network).


---
id: learn-guides-bounties
title: Polkadot-JS Guides about Bounties
sidebar_label: Bounties
description: Polkadot-JS Guides for Bounties
keyword: [treasury, bounties, guides, child bounty, polkadot-js]
slug: ../learn-guides-bounties
---

import RPC from "./../../components/RPC-Connection";

See [this page](./learn-polkadot-opengov-treasury.md#bounties) to learn about Bounties.

:::info Notify the Polkadot Direction Channel

Remember always to notify the
[Polkadot Direction Element Channel](https://matrix.to/#/#Polkadot-Direction:parity.io) about
[OpenGov referenda](./learn-polkadot-opengov.md#referenda) so that the community can start reviewing
them and voting on them.

:::

## Submit a Bounty Proposal

See the video tutorial below to learn how you can create a bounty and submit it for approval through
an OpenGov referendum.

[![Submit a Bounty](https://img.youtube.com/vi/8Cft1-8RWmk/0.jpg)](https://www.youtube.com/watch?v=8Cft1-8RWmk)

When you add a bounty, this will show as "proposed" in the main
[Bounties page](https://polkadot.js.org/apps/#/bounties). Once the community approves your bounty
proposal as an OpenGov referendum, the bounty will show as "funded" at the end of the
[spending period](../general/glossary.md#spend-period) on the main
[Bounties page](https://polkadot.js.org/apps/#/bounties). You can then proceed with assigning
curators to the bounty.

To minimize storage on chain in the same way as any proposal, bounties don't contain contextual
information. When a user submits a bounty spending proposal, they will need to find an off-chain
medium to explain the proposal, for example a bounty proposal document on
[Polkassembly](https://polkadot.polkassembly.io/opengov) or
[Subsquare](https://polkadot.subsquare.io/).
[This template](https://docs.google.com/document/d/1-IBz_owspV5OcvezWXpksWDQReWowschD0TFuaVKKcU/edit?usp=sharing)
can be used to submit all the information needed by OpenGov voters to make an informed decision.

Submitting a bounty proposal will reserve
{{ polkadot: <RPC network="polkadot" path="consts.bounties.bountyDepositBase" defaultValue={10000000000} filter="humanReadable"/> :polkadot }}{{ kusama: <RPC network="kusama" path="consts.bounties.bountyDepositBase" defaultValue={33333333300} filter="humanReadable"/> :kusama }}.

## Assign a Curator to a Bounty

Once your bounty is shown as "funded" on the main
[Bounties page](https://polkadot.js.org/apps/#/bounties), you can propose a bounty curator. See the
video tutorial below to learn how you can add a curator to a bounty and submit it for approval
through an OpenGov referendum.

[![Assign Curator to a Bounty](https://img.youtube.com/vi/TM7vk3oP9IA/0.jpg)](https://www.youtube.com/watch?v=TM7vk3oP9IA)

Once your OpenGov referendum has been approved by the community and served the required
[spending period](../general/glossary.md#spend-period), the bounty will still show as "funded" on
the main [Bounties page](https://polkadot.js.org/apps/#/bounties) and await the curator's
acceptance. The curator must formally accept the curator role by signing a `bounties.acceptCurator`
extrinsic. More information about when to do this can be found on the main
[Bounties page](https://polkadot.js.org/apps/#/bounties). Only after the curators claim their
candidacy the bounty will show as "active" on the main Bounty page.

## Create and Award Child Bounties

:::info Remember to add contextual information about child bounties

When you add child bounties, please add contextual information on the governance forums
[Polkassembly](https://polkassembly.io/) or [Subsquare](https://polkadot.subsquare.io/).

:::

See the video tutorial below to learn how to create a child bounty, assign a curator, and award a
child bounty.

The video will show how to create and award a child bounty using a batch call. We will also include
proposing and approving curator candidacy for the child bounty. The calls can be executed
separately, depending on the process curators consider appropriate for their bounty.

[![Create and Award Child Bounties](https://img.youtube.com/vi/mLpvx0OQoyM/0.jpg)](https://www.youtube.com/watch?v=mLpvx0OQoyM)

Note that once a child bounty is awarded, awardees need to wait for the
{{ polkadot: 8 :polkadot }}{{ kusama: 4 :kusama }}-day delay to be complete before claiming the
child bounty.

## Claim a Child Bounty Reward

The status of child bounties can be viewed on the
[Polkassembly Bounty page](https://polkadot.polkassembly.io/bounties) under the specific parent
bounty. A child bounty status can be "Added", "Awarded", or "Claimed". For example, the parent
bounty 17 refers to the Community Events Bounty, which has 183 child bounties.

![polkassembly-child-bounties](../assets/polkassembly-child-bounties.png)

After a child bounty has been awarded and the
{{ polkadot: <RPC network="polkadot" path="consts.bounties.bountyDepositPayoutDelay" defaultValue={115200} filter="blocksToDays"/> :polkadot }}{{ kusama: <RPC network="kusama" path="consts.bounties.bountyDepositPayoutDelay" defaultValue={57600} filter="blocksToDays"/> :kusama }}-day
delay elapsed, follow the guidelines in the video tutorial below to learn how to claim a child
bounty reward. Note that the extrinsic to claim the child bounty reward is permissionless, and
anyone can initiate the claim on behalf of the beneficiary.

[![Claim Child Bounty Reward](https://img.youtube.com/vi/db82aHgy23c/0.jpg)](https://www.youtube.com/watch?v=db82aHgy23c)



---
id: learn-guides-identity
title: Polkadot-JS Guides about Identity
sidebar_label: Identity
description: Polkadot-JS Guides about Identity.
keywords: [registrar, identity, sub-identity, polkadot-js]
slug: ../learn-guides-identity
---

import RPC from "./../../components/RPC-Connection";

This is an advanced guide that is relevant for entities that would like to become registrars or
would like to set sub-identities to an existing account with an identity. See
[this page](./learn-identity.md) to learn about how to set an identity and have it verified.

## Setting an Identity

Users can set an identity by registering through default fields such as legal name, display name,
website, Twitter handle, Riot handle, etc. along with some extra, custom fields for which they would
like attestations (see [Judgements](#judgements)).

:::info Instructions for setting and clearing Identities

The procedure to set and clear identities is explained in detail in this support article -
[How to set and clear an Identity](https://support.polkadot.network/support/solutions/articles/65000181981-how-to-set-and-clear-an-identity)

:::

:::note

The Ledger app on **Nano S** doesn't support the extrinsic for setting identity. As a workaround,
create a primary identity with an on-chain account and then using that primary identity, assign a
[sub-identity](#sub-accounts) to the Ledger stash.

:::

### Format Caveat

Please note the following caveat: because the fields support different formats, from raw bytes to
various hashes, a UI has no way of telling how to encode a given field it encounters. The
Polkadot-JS UI currently encodes the raw bytes it encounters as UTF8 strings, which makes these
values readable on-screen. However, given that there are no restrictions on the values that can be
placed into these fields, a different UI may interpret them as, for example, IPFS hashes or encoded
bitmaps. This means any field stored as raw bytes will become unreadable by that specific UI. As
field standards crystallize, things will become easier to use but for now, every custom
implementation of displaying user information will likely have to make a conscious decision on the
approach to take, or support multiple formats and then attempt multiple encodings until the output
makes sense.

## Request Judgement

:::info Instructions for requesting and cancelling Identity judgments

The procedure to request and cancel identity judgments is explained in detail in this
[support article](https://support.polkadot.network/support/solutions/articles/65000181990-how-to-request-and-cancel-identity-judgement)

:::

To be judged after submitting your identity information, go to the
[Extrinsics tab in the Polkadot-JS UI](https://polkadot.js.org/apps/#/extrinsics) and select the
`identity` pallet, then `requestJudgement`. For the `reg_index` put the index of the registrar you
want to be judged by, and for the `max_fee` put the maximum you're willing to pay for these
confirmations.

If you don't know which registrar to pick, first check the available registrars by going to
[Chain State tab in the Polkadot-JS UI](https://polkadot.js.org/apps/#/chainstate) and selecting
`identity.registrars()` to get the full list.

To find out how to contact the registrar after the application for judgement or to learn who they
are, you can check their identity by adding them to your Address Book. Their identity will be
automatically loaded.

![Chevdor is registrar #1](../assets/identity/16.jpg)

:::info Requesting judgement through Web3 Foundation Registrar

If you requested judgement for your on-chain identity through the Web3 Foundation Registrar (i.e.
Registrar #0) you will need to complete a few additional tasks. For more information visit
[this support article](https://support.polkadot.network/support/solutions/articles/65000179747-how-to-use-the-w3f-registrar-page).

:::

:::caution

The set identity calls go on-chain. Hence, the contact information is available publicly, for both
legitimate entities, like registrars or validators, but also scammers who might impersonate them.
The strings in the identity fields are good candidates for homograph attacks, as someone could list
a fraudulent website (web3.f0undation instead of web3.foundation for example) and still get verified
by the registrar (if the checks are automated)!

In a decentralized network, one should be cautious making transactions with accounts solely based on
their identity. If an account on-chain claims to be of Web3 Foundation, it is wise to verify its
authenticity by checking directly with Web3 Foundation or examining the established history of that
account on-chain.

:::

## Clearing and Killing an Identity

:::info

Visit the section "Clear an Identity" on
[this support article](https://support.polkadot.network/support/solutions/articles/65000181981) for
guidelines about clearing identities.

:::

**Clearing:** Users can clear their identity information and have their deposit returned. Clearing
an identity also clears all sub accounts and returns their deposits.

**Killing:** The Council can kill an identity that it deems erroneous. This results in a slash of
the deposit.

## Setting Sub-Identities

To set up sub-identities with Polkadot-JS see the
[how to set sub-identities](https://support.polkadot.network/support/solutions/articles/65000181991-how-to-set-identities-for-sub-accounts)
support article and this [video tutorial](https://www.youtube.com/watch?v=0Yh1JYg3ZKU).

### Setting Sub-Identity (Sub-ID) for your Ledger Account

Setting an Identity is not possible on Ledger app yet, but as a workaround, you can
[set the identity for an on-chain account ](../learn/learn-identity.md#setting-an-identity) and then
use it to set a sub-identity to your Ledger account.

- Go to https://polkadot.js.org/apps/#/accounts. Click on the three vertical dots correponding to
  the account to which you already set identity. You should see an option to set onchain
  sub-identities. Click on it.

  ![Add sub-identity in PolkadotJS](../assets/identity/sub-id-1.png)

- In the pop-up window, select your Ledger account from the dropdown and enter text in sub name
  field. Then, click on set subs button.
  ![Set sub-identity in PolkadotJS](../assets/identity/sub-id-2.png)
- Sign and submit the transaction from the parent account with the identity

You should now see the sub-identity displayed on-chain. You need to be aware that
{{ polkadot: <RPC network="kusama" path="consts.identity.basicDeposit" defaultValue={33333000000} filter="humanReadable"/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.identity.basicDeposit" defaultValue={33333000000} filter="humanReadable"/> :kusama }}
is reserved for setting identity and
{{ polkadot: <RPC network="kusama" path="consts.identity.subAccountDeposit" defaultValue={6666000000} filter="humanReadable"/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.identity.subAccountDeposit" defaultValue={6666000000} filter="humanReadable"/> :kusama }}
for each sub-identity. This reserved account balance is freed once you
[clear the identities](../learn/learn-identity.md#clearing-and-killing-an-identity) on the account.

![Sub-identity example](../assets/identity/sub-id-3.png)

## Registrars

### Becoming a Registrar

To become a registrar, submit a pre-image and proposal into
[Democracy](../maintain/maintain-guides-democracy.md), then wait for people to vote on it. For best
results, write a post about your identity and intentions beforehand, and once the proposal is in the
queue ask people to endorse it so that it gets ahead in the referendum queue.

Here's how to submit a proposal to become a registrar:

Go to the Democracy tab, select "Submit preimage", and input the information for this motion -
notably which account you're nominating to be a registrar in the `identity.setRegistrar` function.

![Setting a registrar](../assets/identity/12.jpg)

Copy the preimage hash. In the above image, that's
`0x90a1b2f648fc4eaff4f236b9af9ead77c89ecac953225c5fafb069d27b7131b7`. Submit the preimage by signing
a transaction.

Next, select "Submit Proposal" and enter the previously copied preimage hash. The `locked balance`
field needs to be at least
{{ polkadot: <RPC network="polkadot" path="consts.identity.basicDeposit" defaultValue={202580000000} filter="humanReadable"/>. :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.identity.basicDeposit" defaultValue={33333000000} filter="humanReadable"/>. :kusama }}
You can find out the minimum by querying the chain state under
[Chain State](https://polkadot.js.org/apps/#/chainstate) -> Constants -> democracy ->
minimumDeposit.

![Submitting a proposal](../assets/identity/13.jpg)

At this point, DOT holders can endorse the motion. With enough endorsements, the motion will become
a referendum, which is then voted on. If it passes, users will be able to request judgement from
this registrar.



---
id: learn-guides-ledger
title: Polkadot-JS Guides for Ledger Devices
sidebar_label: Ledger
description: Polkadot-JS Guides for Ledger Devices.
keywords: [ledger, polkadot-js]
slug: ../learn-guides-ledger
---

## Loading Your Account

:::info

Ledger Live should be off while using Ledger with Polkadot-JS UI as it can interfere with normal
operation.

:::

You can import your Ledger account to [Polkadot Extension](https://polkadot.js.org/extension/) or to
the [Polkadot-JS UI](https://polkadot.js.org/apps/#/explorer). For instructions on how to import
Ledger accounts to the Polkadot Extension read through
[this support article](https://support.polkadot.network/support/solutions/articles/65000175387-how-to-add-your-ledger-through-the-polkadot-extension),
while if you want to import Ledger accounts to the Polkadot-JS UI you can consult
[this other article](https://support.polkadot.network/support/solutions/articles/65000170812-how-to-add-ledger-account-through-the-polkadot-js-ui).

### Derivation paths

When adding a Ledger account using the extension or the UI, you will be asked to select an
`account type` and an `account index`. The first lets you select an account, while the second lets
you pick a derivation path from that account - think of it like a formula from which child accounts
are generated. When you are creating a
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} ledger account for the first time on
Ledger Live with name {{ polkadot: `Polkadot 1` :polkadot }}{{ kusama: `Kusama 1` :kusama }}, this
can be added to Polkadot-JS using the 0/0 derivation path (i.e. account type = 0 and account index =
0). If you add a second account called
{{ polkadot: `Polkadot 2` :polkadot }}{{ kusama: `Kusama 2` :kusama }}, this will correspond to the
1/0 derivation path, and so on. We thus have multiple parent accounts that can be viewed and used in
both Ledger Live and Polkadot-JS. Additionally, we can use Polkadot-JS UI to create multiple
children accounts from each parent account. For example,
{{ polkadot: `Polkadot 1` :polkadot }}{{ kusama: `Kusama 1` :kusama }} with 0/0 derivation path can
have child 0/1, 0/2, etc. that can be used within the UI. However, such children accounts cannot be
used in Ledger Live, as it only scans through the parent accounts. So, remember that the balances on
the children accounts cannot be viewed, and you will not be able to transact with those accounts on
Ledger Live.

### Connecting your ledger device

While using a ledger device to sign transactions, depending on your browser and its security
settings, you might need to confirm the USB connection through a popup like the one below:

![Display the device connection popup](../assets/ledger/query-device.png)

If you are adding your Ledger Nano for the first time, click on the "Unknown device" line and the
"Connect" button will become available.

:::info Signature error message

If you have already connected your device, but an error message appears before signing a
transaction, make sure you have opened the
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} application on your Ledger Nano
device. Visit
[this support page](https://support.polkadot.network/support/solutions/articles/65000181994) for
more information about signing transactions using your ledger.

:::

## Confirming the Address on your Device

To display your {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} ledger account
address on your Ledger Nano, you can follow the guidelines on
[this support article](https://support.polkadot.network/support/solutions/articles/65000181854-how-to-confirm-your-account-address-on-your-ledger-device).
Here you can scroll through and make sure the address matches what is displayed on
[Polkadot-JS UI](https://polkadot.js.org/apps/#/explorer).

## Checking the Balance of Your Account

There are a few methods to check the balance of your account. Check out
[this support article](https://support.polkadot.network/support/solutions/articles/65000169332-where-can-i-see-the-balance-of-my-account-)
for information.

## Sending a Transfer

General instructions to send a transfer can be found on
[this support page](https://support.polkadot.network/support/solutions/articles/65000170304-how-to-send-transfer-funds-out-of-your-dot-account-on-the-polkadot-js-ui).
To sign transactions with your Ledger nano check
[this support article](https://support.polkadot.network/support/solutions/articles/65000181994).

## Receiving a Transfer

To receive a transfer on the accounts stored on your Ledger device, you must provide the sender
(i.e. the payer) with your address. To do so, follow the instructions on
[this support page](https://support.polkadot.network/support/solutions/articles/65000181866-how-to-receive-dot-to-my-account-on-polkadot-js-ui).

:::warning

Before giving anyone your address, ensure it matches what's on the Ledger by
[confirming the address on your device](#confirming-the-address-on-your-device). Some malware will
intercept clicks and clipboard requests and can change your copied value in-flight, so being extra
vigilant around copy-paste operations makes sense.

:::

## Staking

For staking using Ledger devices, check the section "How to stake using your Ledger" on
[this support article](https://support.polkadot.network/support/solutions/articles/65000168057-how-do-i-stake-nominate-on-polkadot-).

## Removing Expired Democracy Locks

Check out
[this support page](https://support.polkadot.network/support/solutions/articles/65000181870-how-to-remove-expired-democracy-locks)
the learn how to remove democracy locks after the end of a Governance referendum.

**Please be advised**: Despite the Polkadot ledger application being compatible with both the Ledger
Nano S and the Ledger Nano X, none of the [Democracy](../maintain/maintain-guides-democracy.md)
extrinsics are available in the light version. The following
[repository by Zondax](https://github.com/Zondax/ledger-polkadot) lists the currently supported
Democracy extrinsics on the full ledger.


---
id: learn-guides-polkadot-opengov
title: Polkadot-JS Guides about OpenGov
sidebar_label: OpenGov
description: Polkadot-JS Guides about Polkadot OpenGov.
keywords: [opengov, polkadot opengov, referenda, cancel, polkadot-js]
slug: ../learn-guides-polkadot-opengov
---

import RPC from "./../../components/RPC-Connection";

See [this page](./learn-polkadot-opengov.md) to learn about Polkadot OpenGov.

This guide will instruct token holders how to propose and vote on public referenda using the
Referenda module (OpenGov). Below are a few links to stay informed and directly engage with the
community.

- [Polkadot Direction](https://matrix.to/#/#Polkadot-Direction:parity.io) - a place to discuss
  governance and the future of Polkadot.
- [Kusama Direction](https://matrix.to/#/#Kusama-Direction:parity.io) - a place to discuss
  governance and the future of Kusama.
- [Polkadot](https://polkadot.polkassembly.io) and [Kusama](https://kusama.polkassembly.io)
  Polkassembly - for current referenda, latest proposals, motions, treasury proposals, tips,
  bounties, and more.
- [Polkadot Daily Digest](https://matrix.to/#/#dailydigest:web3.foundation) - News about what is
  happening in the Polkadot ecosystem, published every weekday except holidays.

## Create a Referenda Proposal

### Submitting a Preimage

The act of creating a proposal is split from submitting the preimage for the proposal since the
storage cost of submitting a large preimage could be expensive. Allowing the preimage submission to
come as a separate transaction means that another account could submit the preimage for you and pay
the fee. The example below demonstrates the creation of a preimage to propose and approve a spend of
treasury funds.

![submit preimage](../assets/governance/opengov-submit-preimage.png)

Follow the steps below to submit a preimage as shown in the screenshot above.

1. Navigate to Governance -> Referenda.
2. Click on the "Add preimage" button.
3. From the _propose_ drop-down field, select `treasury`.
4. From the unlabeled drop-down field to the right of the _propose_ drop-down field, select
   `spend(amount, beneficiary)`.
5. In the `amount: Compact<u128> (BalanceOf)` text field, enter the spend amount.
6. The `beneficiary: MultiAddress (AccountIdLookupOf)` drop-down field will have `Id` selected by
   default. Select the beneficiary from the `Id: AccountId` drop-down field.

:::info

Copy the `preimage hash` value before clicking the "Submit preimage" button.

:::

7. Click the "Submit preimage" button.

After the preimage is submitted successfully on-chain, Polkadot-JS UI lists it under the tab of
Governance -> Preimages.

### Submitting a Proposal

Submitting a proposal requires you to bond some tokens. On Polkadot-JS UI, you can navigate to the
Governance -> Referenda to make a new proposal. In order to submit a proposal, you will need to
submit what's called the preimage hash. The preimage hash is simply the hash of the proposal to be
enacted. The easiest way to get the preimage hash is by clicking on the "Submit preimage" button as
shown in the previous section.

![submit proposal](../assets/governance/opengov-submit-proposal.png)

The proposal will be registered from the account selected and the balance lock will be applied to
it. An appropriate origin must be chosen, as each origin has different privileges, and acceptance
criteria. After entering the hash of the preimage for the proposal, the preimage length field is
automatically populated. The enactment delay can be specified either as a block number, or as a
specific number of blocks after the referendum is approved. The deposit for this proposal will be
locked for the referendum duration.

### Submitting a Referendum on the Whitelisted Caller Track

Let's consider increasing the number of validators participating in parachain consensus. You could
[submit a preimage](#submitting-a-preimage) with the call that sets the number of validators to
1,000 and submit a referendum to the Root track directly. However, this requires a large decision
deposit and has very conservative passing parameters such that it will probably need the entire
28-day voting period to pass.

Operations that are deemed safe or time critical by the Polkadot Technical Fellowship can use the
Whitelisted Caller track. This track requires less turnout in the first half of the decision period
so that it can pass more quickly. This track is typically used for more neutral, technical proposals
like runtime upgrades or changing the system's parachain validation configuration.

Using the Whitelisted Caller track requires some special calls. Submitting a referendum in the same
form as other tracks will not work. Namely, rather than voting on a particular `proposal`, the
Whitelisted Caller track requires a vote to `dispatch` the `proposal` via the Whitelist pallet.
Before opening a referendum on this track, you should also attempt to get a positive signal from the
Fellowship that they will whitelist the proposal. If they do not, then even if the public referendum
passes, it will not execute.

Below are the steps to follow when submitting a proposal to the Whitelist track.

- [Submit a preimage](#submitting-a-preimage) with the call to _dispatch_ the proposal (`call`) you
  want to submit -- `whitelist.dispatchWhitelistedCallWithPreimage(call)` -- and obtain the preimage
  hash. This is the preimage for the _public referendum_ on the Whitelisted Caller track.

![preimage-whitelist](../assets/governance/opengov-submit-preimage-whitelist.png)

- Obtain the hash of `call`. The Polkadot Fellowship needs to start a Fellowship referendum to
  whitelist the call with `whitelist.whitelistCall(callHash)`. The Fellowship referendum gets voted
  on by the Polkadot Fellowship members only.

  ![call-hash](../assets/governance/encoded-call-hash.png)

- The public now votes on the referendum. Someone must place a decision deposit to go into the
  deciding phase.
- Once passed, it gets enacted successfully as long as the call has been whitelisted by the
  Fellowship.

Note that the public referendum and Fellowship referendum can happen simultaneously. However, if the
Fellowship does not whitelist the call, you must submit it directly to the Root origin.

## Voting on Referenda

As Polkadot OpenGov takes both the approval and support into account, there are four options to
choose from when voting on a referendum:

- Aye
- Nay
- Split
- Abstain

Also, you have to specify the conviction multiplier for this vote. The longer you are willing to
lock your tokens, the stronger your vote will be weighted. Unwillingness to lock your tokens means
that your vote only counts for 10% of the tokens that you hold.

For detailed instructions on how to vote on Polkadot OpenGov referenda, check
[this support guide.](https://support.polkadot.network/support/solutions/articles/65000184120-polkadot-opengov-how-to-vote)

:::caution Polkadot OpenGov uses Conviction Voting Pallet (Not Democracy Pallet)

Use `convictionVoting.vote` for voting on Referenda in Polkadot OpenGov instead of `democracy.vote`
(which only works for the old version of governance).

:::

### Removing expired voting locks

To remove the lock from votes, you first need to call `removeVote` and then `unlock` through the
`convictionVoting` pallet. For detailed instructions, check
[this support guide.](https://support.polkadot.network/support/solutions/articles/65000184129-polkadot-js-ui-how-to-remove-expired-referenda-locks)

## Delegations

:::info Video Tutorial about Delegations using the Polkadot-JS UI

See [this video tutorial](https://youtu.be/PNGs11EvCB0) to learn about how to delegate, modify
delegations and remove delegations using the Polkadot-JS UI.

:::

For an overview of how delegation works in Polkadot OpenGov, check out the
[Multirole Delegation](../learn/learn-polkadot-opengov.md#multirole-delegation) section on the
[Learn Polkadot OpenGov](../learn/learn-polkadot-opengov.md) page.

Instructions to do delegations with Polkadot-JS are also available on the
[Support Pages](https://support.polkadot.network/support/solutions/articles/65000184776-polkadot-js-ui-how-to-delegate-your-voting-power-on-polkadot-opengov).

### Delegate Votes

You can start delegating your votes by clicking the "Delegate" button on
[Governance > Referenda](https://polkadot.js.org/apps/#/referenda).

![js-delegation-start](../assets/js-delegation-start.png)

If it is the first time you delegate or vote, there will be a banner message. You can delegate on a
single track or all the tracks. You have an option to specify the number of votes (i.e., the number
of tokens) and the [conviction multiplier](./learn-polkadot-opengov.md#voluntary-locking). After
clicking "Next", you will need to specify the account to delegate your votes to, and after clicking
"Delegate" and "Sign and Submit" your delegations will appear for each track (see below).

![js-delegation-allTracks](../assets/js-delegation-allTracks.png)

Note that if you want to delegate just a few tracks, you have two options:

- Repeat the process using the "Delegate" button multiple times
- Issue a batch call with multiple `convictionVoting.delegate` extrinsics under
  [Developer > Extrinsics](https://polkadot.js.org/apps/#/extrinsics)

![js-delegation-delegate](../assets/js-delegation-delegate.png)

By clicking on "Add item" you can add new extrinsics for multiple tracks.

### Undelegate Votes

The "Delegate" button on [Governance > Referenda](https://polkadot.js.org/apps/#/referenda) is only
for delegating votes. You cannot undelegate or modify your delegations. If you wish to undelegate,
you will need to go to [Developer > Extrinsics](https://polkadot.js.org/apps/#/extrinsics) and
submit a `convictionVoting.undelegate` extrinsic, specifying the track you wish to undelegate.

![js-delegation-undelegate](../assets/js-delegation-undelegate.png)

Undelegated tracks will show up as "0 votes" on the Delegate tab.

![js-delegation-undelegate](../assets/js-delegation-undelegated.png)

After you undelegated, the conviction lock will start the countdown, and your funds will be
available for unlocking after the countdown ends.

### Unlock Expired ConvictionVoting Locks

After the conviction lock expires, you can go to
[Developer > Extrinsics](https://polkadot.js.org/apps/#/extrinsics) and submit a
`convictionVoting.unlock` extrinsic to unlock funds for a specific track. Note that if you delegated
multiple tracks, the funds will be unlocked after undelegating all the tracks.

![js-delegation-unlock](../assets/js-delegation-unlock.png)

### Modify your Delegations

The "Delegate" button on [Governance > Referenda](https://polkadot.js.org/apps/#/referenda) is only
for delegating votes. You cannot undelegate or modify your delegations. If you wish to update the
delegated account, the conviction, and the number of votes you will need to go to
[Developer > Extrinsics](https://polkadot.js.org/apps/#/extrinsics), [undelegate](#undelegate-votes)
the track and [delegate](#delegate-votes) again with updated information.

## Claiming OpenGov Deposits

:::info Video Tutorial about OpenGov deposits using the Polkadot-JS UI

See [this video tutorial](https://youtu.be/kkEq5cqW2Pk) to learn about how to claim OpenGov deposits
using the Polkadot-JS UI.

:::

### Claiming the Preimage and Decision Deposits

After a referendum finishes its life cycle (and gets approved or rejected or timed out), the
preimage and decision deposits can be claimed. For claiming the preimage deposit, navigate to
[Polkadot-JS UI > Governance > Preimages](https://polkadot.js.org/apps/#/preimages) and click on
unnote button shown on the preimage you submitted.

![Claim Preimage Deposit](../assets/claim-preimage-deposit.png)

Similarly, to claim the decision deposit, navigate to
[Polkadot-JS UI > Governance > Referenda](https://polkadot.js.org/apps/#/referenda) and scroll down
to the end of the page to click on the referenda with the decision deposit and claim it.

![Claim Referendum Deposits](../assets/claim-referendum-decision-deposit.png)

### Claiming the Referendum Submission Deposit

The submission deposit for a referendum can be claimed
[only if the referendum was `Approved` or `Canceled`](https://github.com/paritytech/polkadot-sdk/blob/cfb29254f74412cea35e8048d8aea94bc789fcb1/substrate/frame/referenda/src/types.rs#L261).
The submission deposit can be claimed by issuing the `refundSubmissionDeposit` extrinsic.

Users can not refund their submission deposit while the referendum is `Ongoing` or `Rejected`.
Similarly, users cannot refund their submission deposit if the proposal has `TimedOut` (failing to
submit the decision deposit within a
{{ polkadot: <RPC network="polkadot" path="const.referenda.undecidingTimeout" defaultValue={201600} filter="blocksToDays"/> :polkadot }}{{ kusama: <RPC network="kusama" path="const.referenda.undecidingTimeout" defaultValue={201600} filter="blocksToDays"/> :kusama }}-day
period will lead to a referendum timeout). This behavior exists so that users can refrain from
spamming the chain with proposals that have no interest from the community. If a proposal is in the
`TimedOut` state, any user can call `slash_proposal_deposit`, which will move the funds from the
user to a runtime-configured account, like the treasury.

To refund your slashed deposit, you can start a new referendum and specifically request a refund
from the treasury. You need to make sure you have enough balance for a new submission and decision
deposit, and you will need to select the right track to ask for a refund. For example, the
[Small Tipper Track](./learn-polkadot-opengov-origins.md#small-tipper) would be fine for any kind of
deposit refund up to {{ polkadot: 250 DOT :polkadot }}{{ kusama: 8.25 KSM KSM :kusama }}.

## Cancel or Kill a Referendum

:::info

Anybody can cancel an ongoing referendum (i.e., a referendum within the Lead-in or
voting/confirmation period). For more information about the referenda timeline in Polkadot OpenGov,
see the [dedicated page](../learn/learn-polkadot-opengov.md#referenda-timeline).

To successfully cancel a referendum through the track `20 / Referendum Canceller`, you will need to
attain
[specific approval and support levels](./learn-polkadot-opengov-origins.md#referendum-canceller).

:::

To cancel a referendum, you need first to submit a preimage with the `referenda.cancel` extrinsic.
Go to the [Polkadot-JS UI > Governance > Referenda](https://polkadot.js.org/apps/#/referenda) and
click on the "Add Preimage" button. You must specify the `referenda.cancel` extrinsic with the index
equal to the ongoing Referendum you wish to cancel. In the screenshot below, the Referendum to be
cancelled is 249.

![cancel-referenda-preimage-creation](../assets/cancel-referenda-preimage-creation.png)

This call will cancel the referendum and return the deposit. You can also kill a referendum using
the `referenda.kill` extrinsic. This will cancel the referendum and slash the deposit.

:::info Preimage Submission Deposit

A deposit is required for the preimage to be stored on chain. The preimage deposit is proportional
to the amount of information stored within the preimage. The deposit amount required for a preimage
with a treasury spend transaction is around
{{ polkadot: 41 DOT :polkadot }}{{ kusama:  1.4 KSM  :kusama }}. Ensure you have enough account
balance to pay for this submission deposit as well as the transaction fees.

:::

Once a preimage is submitted, it can be checked under
[Governance > Preimages](https://polkadot.js.org/apps/#/preimages).

![cancel-referenda-preimage-check](../assets/cancel-referenda-preimage-check.png)

You must copy the preimage to use it when you submit your proposal. To submit the proposal to cancel
referendum 249, for example, you need to go under
[Governance > Referenda](https://polkadot.js.org/apps/#/referenda) and click the "Submit Proposal"
button.

![cancel-referenda-proposal](../assets/cancel-referenda-proposal.png)

You must specify the account to submit the proposal (this can differ from the account used to create
the preimage). Then you will need to specify the track `20 / Referendum Canceller` and add the
preimage hash containing the specific action that will be enacted if the referendum passes. Note
that a submission deposit of
{{ polkadot: <RPC network="polkadot" path="consts.referenda.submissionDeposit" defaultValue={10000000000} filter="humanReadable"/> :polkadot }}{{ kusama: <RPC network="kusama" path="consts.referenda.submissionDeposit" defaultValue={33333333333} filter="humanReadable"/> :kusama }}
will be reserved for submitting the proposal.

Once the proposal has been submitted, it will stay in the Lead-in period until there is enough space
within the track, and a
[track-dependent preparation period and decision deposit](./learn-polkadot-opengov-origins.md#polkadot-opengov-terminology-and-parameters)
have been met. Failing to submit the decision deposit within a
{{ polkadot: <RPC network="polkadot" path="consts.referenda.undecidingTimeout" defaultValue={201600} filter="blocksToDays"/> :polkadot }}{{ kusama: <RPC network="kusama" path="consts.referenda.undecidingTimeout" defaultValue={201600} filter="blocksToDays"/> :kusama }}-day
period will lead to a referendum timeout.



---
id: learn-guides-staking-pools
title: Polkadot-JS Guides for Pool Creators
sidebar_label: Nomination Pools
description: Polkadot-JS Guides about Nomination Pools.
keyword: [stake, staking, pools, create, destroy, claim, rewards, polkadot-js]
slug: ../learn-guides-staking-pools
---

import RPC from "./../../components/RPC-Connection";

See [this page](./learn-nomination-pools.md) to learn about nomination pools.

## Pool Creation with Polkadot-JS

:::info

You easily create a pool using the
[Polkadot Staking Dashboard](../general/staking-dashboard.md#pools). See
[this support article](https://support.polkadot.network/support/solutions/articles/65000182388-staking-dashboard-how-to-create-a-nomination-pool#How-to-create-a-pool)
for more information.

:::

The depositor calls the `create` extrinsic, setting the administrative roles and transferring some
funds to the pool to add themselves as the first member. As stated above, the depositor must always
be a member as long as the pool exists; they will be the last member to leave, ensuring they always
have some skin in the game. A significant stake from the depositor is always a good indicator of the
pool's credibility.

**The current minimum bond to create a pool on**
{{ polkadot: **Polkadot** :polkadot }}{{ kusama: **Kusama** :kusama }}
{{ polkadot: **is <RPC network="polkadot" path="query.nominationPools.minCreateBond" defaultValue={5000000000000} filter="humanReadable" />.** :polkadot }}
{{ kusama: **is <RPC network="kusama" path="query.nominationPools.minCreateBond" defaultValue={1000000000000} filter="humanReadable" />.** :kusama }}

The pool’s ‘nominator role’ selects validators with the nominate extrinsic. On Polkadot JS Apps UI,
navigate to Network > Staking > Pools and click on Add Pool button.

![Create Nomination Pools](../assets/staking/Nomination-Pools-1.png)

The UI automatically assigns an ID to the pool and allows for entering the name of the pools and the
deposit to be bonded.

![Create Nomination Pools - deposit](../assets/staking/Nomination-Pools-2.png)

When creating a pool using Polkadot JS Apps UI, all the roles are mapped to the Depositor account by
default. If any of these roles need to be assigned to a different account, create the pool using
`create` extrinsic available in
[Developer > Extrinsics > nominationPools](https://polkadot.js.org/apps/#/extrinsics) on Polkadot JS
Apps UI.

![Nomination Pool Roles](../assets/staking/Nomination-Pools-7.png)

## Pool Upkeep with Polkadot-JS

The nominator can update the pool’s validator selection. On Polkadot JS Apps UI, navigate to
[Network > Staking > Accounts page](https://polkadot.js.org/apps/#/staking/actions) and click on
Pooled button. If you have any pooled accounts with the role of nominator, you will notice the
option to set nominees. Select the validators to nominate like you would normally using a nominator
account.

![Nominate validators](../assets/staking/Nomination-Pools-5.png)

The root and bouncer can update the pool’s state to blocked through `setState` extrinsic and kick
members by calling `unbond` and `withdrawUnbonded`. (The state can also be toggled back to open).

## Pool Destruction with Polkadot-JS

:::info

As a pool admin, you can easily destroy a pool and permissionlessly remove all members using the
[Polkadot Staking Dashboard](../general/staking-dashboard.md#pools). See
[this support article](https://support.polkadot.network/support/solutions/articles/65000182388-staking-dashboard-how-to-create-a-nomination-pool#How-to-destroy-a-pool)
for more information.

:::

A pool can be pushed into the “destroying” state via one of:

- The root and bouncer set the pool to “destroying”. This can be done by submitting the
  `nominationPools.setState(poolId, state)` extrinsic using the
  [Polkadot-JS UI extrinsic tab](https://polkadot.js.org/apps/#/extrinsics). Where `poolId` is the
  specific ID of the pool and `state` is the pool's state that must be set to "destroying". Other
  possible states are "open" and "blocked".
- Any account can set the pool to destroying if over 90% of the pool's active bonded balance has
  been slashed.

When a pool is in ‘destroying’ state, `unbond` and `withdrawUnbonded` become permissionless, so
anyone can help all the members exit.

The pool is destroyed once the depositor withdraws, no members belong to the pool, and all the
pool’s resources are wiped from the state.

## Claim Rewards for Other Pool Members with Polkadot-JS

As a pool member you can claim rewards for any other members who set their
[claim permissions](./learn-nomination-pools.md#claim-permissions) to one of the _permissionless_
options.

Let's take the example of ALICE setting the claim permissions to `PermissionlessAll`. Another
account STASH can now claim ALICE's rewards (as a free balance or compound them to the existing
bonded balance). To do so, STASH can go to the
[Polkadot-JS UI Extrinsic Tab](https://polkadot.js.org/apps/#/extrinsics) and issue the following
extrisics:

- `nominationPools.claimPayoutOthers` extrinsic specifying ALICE's account. This will claim the
  rewards as a free balance on ALICE's account.

![pools-payoutOthers](../assets/nomination-pools-payoutOthers.png)

- `nominationPools.bondExtraOthers` extrinsic specifying ALICE's account and the option to bond:
  - the free balance currently available in ALICE's account (`FreeBalance`) or
  - the pool rewards (`Rewards`) unclaimed by ALICE.

![pools-bondExtraOthers](../assets/nomination-pools-bondExtraOthers.png)


---
id: learn-guides-staking
title: Polkadot-JS Guides For Nominators
sidebar_label: Staking
description: Polkadot-JS Guides for Nominators.
keyword: [nominate, stake, staking, claim, rewards, polkadot-js]
slug: ../learn-guides-staking
---

import RPC from "./../../components/RPC-Connection";

See [this page](./learn-staking.md) to learn about staking.

## Claiming Rewards with Polkadot-JS

Anyone can trigger a payout for any validator, as long as they are willing to pay the transaction
fee. Someone must submit a transaction with a validator ID and an era index.
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} will automatically calculate that
validator's reward, find the top
{{ polkadot: <RPC network="polkadot" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/> :kusama }}
nominators for that era, and distribute the rewards pro rata.

:::note

The Staking system only applies the highest
{{ polkadot: <RPC network="polkadot" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/> :kusama }}
nominations to each validator to reduce the complexity of the staking set.

:::

These details are handled for you automatically if you use the
[Polkadot-JS UI](https://polkadot.js.org/apps/#/staking/payout), which also allows you to submit
batches of eras at once.

To claim rewards on Polkadot-JS UI, you will need to be in the "Payouts" tab underneath "Staking",
which will list all the pending payouts for your stashes.

![pending-payouts](../assets/polkadotjs_payout_page.png)

To then claim your reward, select the "Payout all" button. This will prompt you to select your stash
accounts for payout.

![select-payouts](../assets/polkadotjs_payout_popup.png)

Once you are done with payout, another screen will appear asking for you to sign and submit the
transaction.

![transaction-payouts](../assets/polkadotjs_payout_complete.png)


---
id: learn-guides-treasury
title: Polkadot-JS Guides about the Treasury
sidebar_label: Treasury
description: Polkadot-JS Guides about the Polkadot Treasury.
keywords: [opengov, polkadot opengov, referenda, treasury, tipps, polkadot-js]
slug: ../learn-guides-treasury
---

import RPC from "./../../components/RPC-Connection";

See [this page](./learn-polkadot-opengov-treasury.md) to learn about the Polkadot Treasury.

## Creating a Treasury Proposal

Your proposal should address a problem, outline a goal, give a detailed account of how you will
reach that goal, and include any ongoing maintenance needs. As much as possible, you should itemize
the tasks to be completed so fees can be evaluated and milestones can be followed. You can check the
{{ polkadot: [guidelines for a successful proposal](https://docs.google.com/document/d/1IZykdp2cyQavcRyZd_dgNj5DcgxgZR6kAqGdcNARu1w) :polkadot }}{{ kusama:  [guidelines for a successful proposal](https://docs.google.com/document/d/1CzEnurqwqLBOGrJI9CQORiGW9m6QyPOSshhzJdR57Pk)  :kusama }}
and fill out the
{{ polkadot: [Treasury proposal template](https://docs.google.com/document/d/1O_84mXYFERCavmnJyxbIPKFkG0bVBySRjCVy-d-VKcc) :polkadot }}{{ kusama:  Treasury proposal template :kusama }}
provided.

### Announcing the Proposal

To minimize storage on-chain, proposals don't contain contextual information. When a user submits a
proposal, they will need to find an off-chain way to explain the proposal:

- Many community members participate in discussion in the
  {{ polkadot: [Polkadot Watercooler](https://matrix.to/#/#polkadot-watercooler:web3.foundation) and :polkadot }}
  {{ kusama: [Kusama Direction room](https://matrix.to/#/#Kusama-Direction:parity.io) and the :kusama }}
  {{ polkadot: [Polkadot Direction room](https://matrix.to/#/#Polkadot-Direction:parity.io). :polkadot }}
  {{ kusama: [Kusama Watercooler](https://matrix.to/#/#kusamawatercooler:polkadot.builders). :kusama }}
- Use platforms like [Polkassembly](https://polkassembly.io) and
  [SubSquare](https://www.subsquare.io/) to initiate discussion with the community. They also offer
  a gauge poll to capture the community sentiment before submitting an on-chain referendum.

Spreading the word about the proposal's explanation to the community is ultimately up to the
proposer.

:::tip Use Accounts with Verified On-Chain Identity for Treasury Proposals

To ensure legitimacy, it is required that the account linked to the Treasury proposal has an
[identity set](https://support.polkadot.network/support/solutions/articles/65000181981-how-to-set-and-clear-an-identity)
and is
[verified by an on-chain registrar](https://support.polkadot.network/support/solutions/articles/65000181990-how-to-request-and-cancel-identity-judgement).

:::

### Submit Treasury Proposal Preimage

The example below shows how to create a [preimage](../general/glossary#preimage) for a transaction
that requests 100 DOT from Treasury.

- Navigate to [Polkadot-JS UI > Governance > Preimages](https://polkadot.js.org/apps/#/preimages)
  and then click on Add Preimage.
- Select the account which will be used to submit the preimage.
- Choose `treasury` pallet in the "propose" dropdown and the `spend(amount, beneficiary)`call
- Enter the DOT amount.
- Enter the AccountID of the beneficiary (which has a verified on-chain identity).
- Submit preimage
- Sign and submit the transaction by paying the specified transaction fees.

:::info Preimage Submission Deposit

A deposit is required for the preimage to be stored on chain. The preimage deposit is proportional
to the amount of information stored within the preimage. The deposit amount required for a preimage
with a treasury spend transaction is around
{{ polkadot: 41 DOT :polkadot }}{{ kusama:  1.4 KSM  :kusama }}. Ensure you have enough account
balance to pay for the submission deposit and the transaction fees.

:::

![Treasury Preimage](../assets/treasury/treasury-preimage.png)

After successful submission of the preimage, it is displayed on Polkadot-JS UI > Governance >
Preimages page. Every preimage is associated with a unique preimage hash (highlighted in a box in
the image below). Take a note of this preimage hash, which is required to submit a referendum.

![Treasury Preimage Hash](../assets/treasury/treasury-preimage-hash.png)

### Submit a Treasury Track Referendum

The example below shows how to submit a Treasury track referendum.

- Navigate to [Polkadot-JS UI > Governance > Referenda](https://polkadot.js.org/apps/#/referenda)
  and then click on Submit proposal.
- Select the account which will be used to submit the proposal.
- Choose the appropriate submission track (The example below selected Small Spender track).
- Enter the preimage hash of the treasury spend transaction.(If the preimage exists on-chain, the
  preimage length box is automatically populated)
- Click on Submit proposal.
- Sign and submit the transaction.

![Submit Treasury Proposal](../assets/treasury/submit-proposal-treasury.png)

Once your submission is executed, your referendum will appear under your chosen track on the
Polkadot-JS UI [referenda page](https://polkadot.js.org/apps/#/referenda).

### Place a Decision Deposit for the Treasury Track Referendum

For the referendum to move from preparing phase to the deciding phase, a decision deposit needs to
be placed. The decision deposit values for each individual
[Treasury Tracks](./learn-polkadot-opengov-treasury#treasury-tracks) are listed in a section above
in this document.

![Submit Treasury Proposal Decision Deposit](../assets/treasury/treasury-proposal-decision-deposit.png)

The preimage and decision deposits
[can be claimed once the referendum ends](./learn-guides-polkadot-opengov.md#claiming-the-preimage-and-decision-deposits).

## Submit Treasury Proposal via Polkassembly

To submit a treasury track referendum via [Polkassembly](https://polkadot.polkassembly.io/opengov)
click on the FAB button in the bottom right corner. Then,

- Click on "Create Treasury Proposal" and choose an address for the proposer
- After choosing an address, you will enter a three-stage guideline:

  - Write a proposal: you can add a detailed description for the proposal, which will be stored on
    Polkassembly. Alternatively, you can link an existing discussion post.

  ![polkassembly-write-proposal](../assets/polkassembly-write-proposal.png)

  - Create a preimage: an existing preimage can be linked, or a new one can be created. To create a
    preimage, add the beneficiary address and the
    {{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} amount. The track will be auto-selected
    and the user can proceed with the creation of a preimage.

  ![polkassembly-create-preimage](../assets/polkassembly-create-preimage.png)

  - Create a proposal: final confirmation about the proposal creation. The description of the
    proposal and the preimage are automatically linked to the proposal.

## Requesting Tips from the Treasury

To request a tip funded by the treasury, you can follow the above steps for
[creating a treasury proposal](#creating-a-treasury-proposal) but instead of submitting the proposal
to the `32 / Small Spender` track, you will need to submit it to the `30 / Small Tipper` or
`31 / Big Tipper` tracks depending on the number of tokens to be requested.

Briefly, you will need to:

- Create a preimage using the `treasury.Spend` extrinsic and specifying the number of tokens and the
  beneficiary of the tip
- Submit a proposal to the right track (i.e. `30` or `31`) using the preimage hash
- Once you started the referendum go to [Polkassembly](https://polkassembly.io/), log in with the
  proposer account and edit the referendum details
- Notify the
  {{ polkadot: [Polkadot Direction Element Channel](https://matrix.to/#/#Polkadot-Direction:parity.io) :polkadot }}{{ kusama: [Kusama Direction Element Channel](https://matrix.to/#/#Polkadot-Direction:parity.io) :kusama }}
  about your referendum
- Place the decision deposit before the
  {{ polkadot: <RPC network="polkadot" path="consts.referenda.undecidingTimeout" defaultValue={201600} filter="blocksToDays"/> :polkadot }}{{ kusama: <RPC network="kusama" path="consts.referenda.undecidingTimeout" defaultValue={201600} filter="blocksToDays"/> :kusama }}-day
  timeout
- Once the referendum ends you can
  [claim the preimage and decision deposits back](./learn-guides-polkadot-opengov.md#claiming-the-preimage-and-decision-deposits)



---
id: learn-guides-vault
title: Polkadot-JS Guides about the Vault App
sidebar_label: Polkadot Vault
description: Polkadot-JS Guides about Polkadot Vault.
keywords: [parity signer, signer, polkadot vault, polkadot-js]
slug: ../learn-guides-vault
---

:::info

These guides apply to both Parity Signer and Polkadot Vault apps.

:::

## Import Vault Accounts into Polkadot-JS

See
[this support article](https://support.polkadot.network/support/solutions/articles/65000184118-polkadot-vault-how-to-add-your-account-on-polkadot-js-ui)
to import a Polkadot Vault account into the
[Polkadot-JS Browser Extension](../general/polkadotjs.md#polkadot-js-extension) or
[Parity Signer Companion](https://chrome.google.com/webstore/detail/parity-signer-companion/damllfnhhcbmclmjilomenbhkappdjgb).
Accounts added to those extensions will be injected into the Polkadot-JS UI.

## Do Your Own Chain Spec and Metadata Update

:::danger This section is for developers and power users only

By requesting the chain specification and metadata you trust the specific endpoint you are using
(unless you are using you own node).

:::

The following guide bases on the [Parity Signer](https://github.com/paritytech/parity-signer) Github
page (to create the Chain Spec QR code and the metadata QR code fountain) and
[Metadata Portal](https://github.com/paritytech/metadata-portal) Github page (to embed the Chain
Spec and Metadata into a portal).

### Chain Specification

#### Chain Spec QR

To add more chains on the Vault app you can follow the instructions
[here](https://paritytech.github.io/parity-signer/tutorials/Add-New-Network.html#add-network-specs).
In this example we will add the [Asset Hub](../learn/learn-assets.md) system parachain. Briefly,
fork the [Parity Signer GitHub repository](https://github.com/paritytech/parity-signer), start the
terminal within the `/generate_message` folder and type the following:

`cargo run add-specs -d -u wss://kusama-asset-hub-rpc.polkadot.io --encryption sr25519`

where `wss://kusama-asset.hub-rpc.polkadot.io` is the Parity RPC endpoint for the Asset Hub on
Kusama. This will create the file `sign_me_add_specs_statemine_sr25510` under the
`files/in_progress` folder. See
{{ polkadot: [this GitHub page](https://github.com/polkadot-js/apps/blob/089fd77b14169749e35e073a93f7e7276963009c/packages/apps-config/src/endpoints/productionRelayPolkadot.ts) for a list of all endpoints listed in the Polkadot-JS UI. :polkadot }}{{ kusama: [this GitHub page](https://github.com/polkadot-js/apps/blob/089fd77b14169749e35e073a93f7e7276963009c/packages/apps-config/src/endpoints/productionRelayKusama.ts) for a list of all endpoints listed in the Polkadot-JS UI. :kusama}}

#### Generating Signature

:::danger Use a hot account

Make sure that the account used to sign the chain specification is a hot account. Never use a cold
account from the Vault app or Ledger, as after typing the seed phrase into the terminal that account
will be considered hot.

:::

Start the terminal within the `files/in_progress` folder and type the following:

`cat sign_me_add_specs_statemine_sr25519 | subkey sign --suri "YOUR SEED PHRASE"`

where `"YOUR SEED PHRASE"` is the seed phrase of the account that will be used to sign and
authenticate both the chain spec and later on the metadata. Running the code above will return a
signature similar to that below:

`0xc4ce72db959000b6166af96d3bda55a927fd837747bf1bf1ae8a69e57c9ef37c25a88707c47b105a9eb1fbcf9345680eff57eb978cf73919506f6c738834e78a`

#### Signing Chain Spec

Now, go back to the `/generate_message` folder and type the following:

`cargo run --release make --goal qr --crypto sr25519 --msg add-specs --payload sign_me_add_specs_statemine_sr25519 --verifier-hex PUBLIC KEY --signature-hex SIGNATURE`

where `PUBLIC KEY` is the public key of the account with seed `"YOUR SEED PHRASE"`, and `SIGNATURE`
is the signature generated in the previous step. Running the code above will create the file
`add_specs_statemine-sr25519` under the `files/completed` folder.

### Metadata Updates

Similarly to what we did for the chain specification, we now generate and sign the Asset Hub
metadata.

#### Metadata QR Fountain

To update the chain metadata for the Asset Hub specs on the Vault app you can follow the
instructions
[here](https://paritytech.github.io/parity-signer/tutorials/Add-New-Network.html#add-network-metadata).
Briefly, in the Parity Signer repository, start the terminal within the `/generate_message` folder
and type the following:

`cargo run load-metadata -d -u wss://kusama-asset-hub-rpc.polkadot.io`

where `wss://kusama-asset-hub-rpc.polkadot.io` is the Parity RPC endpoint for the Asset Hub on
Kusama. This will create the file `sign_me_load_metadata_statemineV9370` under the
`files/in_progress` folder. Note that for future metadata updates the file name will change as the
version at the time of writing was `V9370`.

:::info

Note that the name of the file changes according to the network version. That is, `????` in
`sign_me_load_metadata_statemineV????` will be the latest version at fetch time.

:::

#### Generating Signature

:::danger Use a hot account

Make sure that the account used to sign the metadata is a hot account. Never use a cold account from
the Vault app or Ledger, as after typing the seed phrase into the terminal that account will be
considered hot.

:::

Start the terminal within the `files/in_progress` folder and type the following:

`cat sign_me_load_metadata_statemineV9370 | subkey sign --suri "YOUR SEED PHRASE"`

where `"YOUR SEED PHRASE"` is the seed phrase of the account you used to sign the chain
specification. Running the code above will return a signature similar to that below:

`0xde1ad7aeb252acb3cf42a522dcc8dc3f317a49be2ed636836dd6df8f7e47135f2c712480055822eba87e9ea5ac7d3bba96045992ae795856fdf4eea09a411f85`

:::info Do not copy the code lines above

Note that the name of the file changes according to the network version. That is, `????` in
`sign_me_load_metadata_statemineV????` will be the latest version at fetch time. So, do not copy the
code line above, but change the version with the appropriate one saved under the `files/in_progress`
folder. The signature changes as well.

:::

#### Signing Metadata

Now, go back to the `/generate_message` folder and type the following:

`cargo run --release make --goal qr --crypto sr25519 --msg load-metadata --payload sign_me_load_metadata_statemineV9370 --verifier-hex PUBLIC KEY --signature-hex SIGNATURE`

where `PUBLIC KEY` is the public key of the account with seed `"YOUR SEED PHRASE"`, and `SIGNATURE`
is the signature generated in the previous step. Running the code above will create the file
`load_metadata_statemineV9370` under the `files/completed` folder.

### Add Chain & Update Metadata

You can open `add_specs_statemine-sr25519` on your browser (just drag the file on an open tab). This
is a .png file containing the QR code to add the Asset Hub chain specification into the Vault App.
You can do the same with the `load_metadata_statemineV9370`. This is a .apng file containing the QR
code fountain to do the metadata update for the Asset Hub on Kusama.

### Metadata Portal

#### Modify `config` File

Alternatively, you can add the chain specification QR code and the metadata QR code fountain in a
metadata portal. Briefly, fork the
[Parity's Metadata Portal GitHub repository](https://github.com/paritytech/metadata-portal). You can
modify the following fields of the `config.toml` file:

- `name`: your name / institution
- `public_key`: the public key of the account you use to sign the chain spec and the metadata.
- At the bottom of the file add the following information:

```
[[chains]]
name = "Statemine"
title = "Kusama Asset Hub"
rpc_endpoint = "wss://kusama-asset-hub-rpc.polkadot.io"
color = "#f27230"

[chains.github_release]
owner = "paritytech"
repo = "statemint"
genesis_hash = "0x48239ef607d7928874027a43a67689209727dfb3d3dc5e5b03a39bdc2eda771a"
```

For each additional chain, you need to add the respective information. Information about the genesis
hash can be found on the Polkadot-JS UI > connect to the relevant chain > Developer > Chain State.

#### Rename Chain's Files

Rename the signed chain specification and metadata files as follow:

- Chain specification: `add_specs_statemine-sr25519` --> `statemine_specs.png`

- Metadata updates: `load_metadata_statemineV9370`--> `statemine_metadata_9370.apng`

Thus, for chain specification the file must be renamed to `chainName_specs.png` while for metadata
the file must be renamed to `chainName_metadata_version.apng` where `chainName` is the name of the
chain and `version` is the version of the metadata.

Add the renamed files to the `/public/qr folder` within the Metadata Portal repository.

#### Run Portal

Open the terminal within the Metadata Portal repository and run `make updater`. Then run
`make collector`; this will create the `_latest.apng` files for each of the chains (removed by the
command `make cleaner`). Finally, run `yarn start` to load the metadata portal on your localhost.


---
id: learn-identity
title: Account Identity
sidebar_label: Account Identity
description: On-chain Identity, Judgements and Registrars.
keywords: [identity, registrars, judgements]
slug: ../learn-identity
---

import RPC from "./../../components/RPC-Connection";

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} provides a naming system that allows
participants to add personal information to their on-chain account and subsequently ask for
verification of this information by [registrars](#registrars).

Users must reserve funds in a bond to store their information on chain:
{{ polkadot: <RPC network="polkadot" path="consts.identity.basicDeposit" defaultValue={202580000000} filter="humanReadable"/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.identity.basicDeposit" defaultValue={33333000000} filter="humanReadable"/> :kusama }}
and
{{ polkadot: <RPC network="polkadot" path="consts.identity.fieldDeposit" defaultValue={660000000} filter="humanReadable"/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.identity.fieldDeposit" defaultValue={8333000000} filter="humanReadable"/> :kusama }}
per each field beyond the legal name. These funds are _locked_, not spent - they are returned when
the identity is cleared.

## Judgements

After a user injects their information on chain, they can request judgement from a registrar. Users
declare a maximum fee that they are willing to pay for judgement, and registrars whose fee is below
that amount can provide a judgement.

When a registrar provides judgement, they can select up to six levels of confidence in their
attestation:

- Unknown: The default value, no judgement made yet.
- Reasonable: The data appears reasonable, but no in-depth checks (e.g. formal KYC process) were
  performed (all the currently verified identities on-chain).
- Known Good: The registrar has certified that the information is correct (this step involves
  verification of state issued identity documents, and at the moment no account has known good
  identity, with the exception of registrars).
- Out of Date: The information used to be good, but is now out of date.
- Low Quality: The information is low quality or imprecise, but can be fixed with an update.
- Erroneous: The information is erroneous and may indicate malicious intent.

A seventh state, "fee paid", is for when a user has requested judgement and it is in progress.
Information that is in this state or "erroneous" is "sticky" and cannot be modified; it can only be
removed by the complete removal of the identity.

Registrars gain trust by performing proper due diligence and would presumably be replaced for
issuing faulty judgments.

## Registrars

Registrars can set a fee for their services and limit their attestation to certain fields. For
example, a registrar could charge {{ polkadot: 1 DOT :polkadot }}{{ kusama: 0.1 KSM :kusama }} to
verify one's legal name, email, and GPG key. When a user requests judgement, they will pay this fee
to the registrar who provides the judgement on those claims. Users set a maximum fee they are
willing to pay and only registrars below this amount would provide judgement.

There are multiple registrars on {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}.
Unless no additional information is available here, you must reach out to specific registrars
individually if you want to be judged by those.

Registrar 0: <br /> **URL**: https://registrar.web3.foundation/ <br /> **Account**:
{{ polkadot: 12j3Cz8qskCGJxmSJpVL2z2t3Fpmw3KoBaBaRGPnuibFc7o8 :polkadot }}
{{ kusama: H4XieK3r3dq3VEvRtqZR7wN7a1UEkXxf14orRsEfdFjmgkF :kusama }} <br /> **Fee**:
{{ polkadot: 0 DOT :polkadot }}{{ kusama:  0.04 KSM :kusama }} <br />

Registrar 1: <br /> **URL**: https://registrar.d11d.net/ <br /> **Account**:
{{ polkadot: 1Reg2TYv9rGfrQKpPREmrHRxrNsUDBQKzkYwP1UstD97wpJ :polkadot }}
{{ kusama: Fom9M5W6Kck1hNAiE2mDcZ67auUCiNTzLBUdQy4QnxHSxdn :kusama }} <br /> **Fee**:
{{ polkadot: 20 DOT :polkadot }}{{ kusama: 4.5 KSM :kusama }} <br />

Registrar 2: <br /> **Account**:
{{ polkadot: 1EpXirnoTimS1SWq52BeYx7sitsusXNGzMyGx8WPujPd1HB :polkadot }}
{{ kusama: EK8veMNH6sVtvhSRo4q1ZRh6huCDm69gxK4eN5MFoZzo3G7 :kusama }} <br /> **Fee**:
{{ polkadot: 0 DOT :polkadot }}{{ kusama: 1 KSM :kusama }} <br />

Registrar 3: <br /> **Account**:
{{ polkadot: 13SceNt2ELz3ti4rnQbY1snpYH4XE4fLFsW8ph9rpwJd6HFC :polkadot }}
{{ kusama: GLiebiQp5f6G5vNcc7BgRE9T3hrZSYDwP6evERn3hEczdaM :kusama }} <br /> **Fee**:
{{ polkadot: 0.5 DOT :polkadot }}{{ kusama: 1 KSM :kusama }} <br />

{{ kusama: Registrar 4: <br /> **Account**: GhmpzxUyTVsFJhV7s2wNvD8v3Bgikb6WvYjj4QSuSScAUw6 <br /> **Fee**: 0.04 KSM <br /> :kusama }}

{{ polkadot: Polkassembly (Registrar 3) provides setting on-chain ID as a service on their [website](https://polkadot.polkassembly.io/). :polkadot }}

See [this page](./learn-guides-identity.md#registrars) to learn how to become a Registrar.

## Sub-Identities

Users can also link accounts by setting "sub accounts", each with its own identity, under a primary
account. The system reserves a bond for each sub account. An example of how you might use this would
be a validation company running multiple validators. A single entity, "My Staking Company", could
register multiple sub accounts that represent the [Stash accounts](learn-cryptography.md) of each of
their validators.

An account can have a maximum of 100 sub-accounts. Note that a deposit of
{{ polkadot: <RPC network="polkadot" path="consts.identity.subAccountDeposit" defaultValue={200530000000} filter="humanReadable"/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.identity.subAccountDeposit" defaultValue={6666000000} filter="humanReadable"/> :kusama }}
is required for every sub-account.

---

:::info Polkadot-JS Guides

If you are an advanced user, see the
[Polkadot-JS guides about account identity](./learn-guides-identity.md).

:::



---
id: learn-implementations
title: Polkadot Implementations
sidebar_label: Polkadot Implementations
description: Learn about the different Polkadot implementations.
keywords: [implementations, wasm, meta protocol]
slug: ../learn-implementations
---

Polkadot is the flagship protocol of the [Web3 Foundation](https://web3.foundation/), and while
Polkadot can be defined as a protocol, a network, or, a type of infrastructure, it best serves to be
an ecosystem. For true decentralization, there should be multiple implementations of Polkadot. Even
being a _layer 0_ protocol that attempts to build an interconnected, interoperable and secure Web3
ecosystem, Polkadot is a complex piece of software, and its formal implementation depends on being
built on top of a tech stack.

> This page will focus on implementations of **Polkadot's underlying infrastructure** (i.e. runtime,
> host).

## A Wasm-based Meta Protocol

Polkadot uses WebAssembly ([Wasm](learn-wasm.md)) as a "meta-protocol". This allows for the use of
any programming language that can be interpreted or compiled into Wasm - being the driver for
Polkadot's multiple implementations.

### Parity Technologies: A [Rustic Vision for Polkadot](https://github.com/paritytech/polkadot)

[Parity Technologies](https://www.parity.io/) is often in the spotlight for its core development of
Polkadot, and while this is true, Parity Polkadot also serves to be the
[Rust](https://www.rust-lang.org/) client. Parity Tech has a rustic vision for Polkadot through the
use of their main product, [Substrate](https://www.substrate.io/). Substrate can also be used for
different chains and different networks, but in the case of Polkadot, Substrate acts as the tech
stack that is used to implement Polkadot's sharded heterogeneous multi-chain model.

> Parity Tech focuses on blockchain infrastructure for the decentralised web, where they initially
> offered an Ethereum client (Parity Ethereum). Parity Tech was hired by the Web3 Foundation to
> foster the development of the first implementation of Polkadot.

Polkadot can support parachains that are not built on Substrate, In particular, as long as the state
transition function (STF) of a shard is abstratced into Wasm, the validators on the network can
execute the STF within a Wasm environment.

> Note: chains can also be built on Substrate and are not required to be deployed onto Polkadot.
> More on Polkadot's architecture is available on the [Architecture](learn-architecture.md) page.

With this in mind, we can point to some other implementations of Polkadot. Having different
implementations inherently promotes the decentralization of the technology and progresses it in a
meaningful way. Other implementations of Polkadot that exist, many of whom have received a
[grant](../general/grants.md) from the Web3 Foundation, are in programming languages like Go, C++,
and JavaScript, which are all languages that can be compiled in Wasm.

As stated in the Soramitsu grant announcement:

    It is critically important to have multiple implementations of the Polkadot protocol for a number
    of reasons, including decentralization, knowledge dispersion, and better definitions of the
    protocol... Multiple implementations of Polkadot improves network resilience and adds to the
    decentralization of the network. The governance of the network is more democratized when multiple
    teams build clients that run the nodes in the network.

## Alternative Implementations

### ChainSafe Systems: [Gossamer](https://github.com/ChainSafe/gossamer#a-go-implementation-of-the-polkadot-host)

**Gossamer** is a Go implementation being built by
[ChainSafe Systems](https://github.com/ChainSafeSystems), a blockchain R&D firm based in Toronto,
Canada that is also building an Eth2.0 Serenity client. They were awarded a grant from the Web3
Foundation.

### SORAMITSU: [Kagome](https://github.com/soramitsu/kagome#intro)

**Kagome** is a C++ implementation of the Polkadot Host being built by
[Soramitsu](https://soramitsu.co.jp/), a Japanese digital identity company that previously developed
[Hyperledger Iroha](https://iroha.tech). They were awarded a grant from the Web3 Foundation and
released the first version of Kagome in April 2020. As part of the process, they also released a
[libp2p](https://github.com/soramitsu/libp2p-grpc) networking layer in C++.

### Polkadot-JS Project: [Polkadot-JS](https://github.com/polkadot-js)

**Polkadot-JS** is a [JavaScript client](https://github.com/polkadot-js/client) and offers a
collection of tools, interfaces, and libraries for Polkadot and Substrate.

### Other implementations that have received grants

- [Golkadot](https://github.com/opennetsys/golkadot)
- [Polkadot in Java](https://github.com/polkadot-java)

While the ecosystem continues to grow rapidly, the continued development of alternative
implementations will only make Polkadot stronger. Consider becoming a contributor to the ecosystem,
and learn about the how you can receieve a [grant](../general/grants.md) for your development.


---
id: learn-inflation
title: Token Inflation
sidebar_label: Token Inflation
description: Explanation of Token's Inflation in the Polkadot Ecosystem.
keywords: [token, DOT, KSM, inflation]
slug: ../learn-inflation
---

import RPC from "./../../components/RPC-Connection";

{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} is an inflationary token. On the
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} network, inflation is
{{ polkadot: [set to be 10% annually](https://github.com/paritytech/polkadot-sdk/blob/756ccc35e93d1a78e3c71a0e67ae4da5f1d09f69/runtime/polkadot/src/lib.rs#L576), :polkadot }}
{{ kusama: [set to be 10% annually](https://github.com/paritytech/polkadot-sdk/blob/756ccc35e93d1a78e3c71a0e67ae4da5f1d09f69/runtime/kusama/src/lib.rs#L535), :kusama }}
which is distributed as staking rewards based on the amount staked vs. ideal staking rate, and the
remainder goes to the treasury.

:::info

DOT went through [redenomination](./learn-redenomination.md) in 2020 that saw the DOT token supply
increase by 100 times.

The current token supply on {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} is
{{ polkadot: <RPC network="polkadot" path="query.balances.totalIssuance" defaultValue={12230666300429914781} filter="humanReadable"/> (Over 1.2 Billion DOT). :polkadot }}
{{ kusama: <RPC network="kusama" path="query.balances.totalIssuance" defaultValue={12619256191792480093} filter="humanReadable"/> (Over 12 Million KSM). :kusama }}

:::

It is essential to understand that the primary objective of
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} inflation is to incentivize network
participants through
[Nominated Proof of Stake (NPoS)](./learn-consensus.md#nominated-proof-of-stake) and to grow the
network through funding the on-chain treasury. There is an opportunity cost of keeping the
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} tokens idle with the current inflation model
as the tokens get diluted over time. Economics and game theory suggest that setting an ideal
inflation rate is essential for incentivizing the network participants as well as the growth of the
network, and any deviation from it can have negative effects. Reducing the inflation rate could
limit growth while increasing the inflation rate could break the incentive model of the token.
Hence, **token inflation rate is not a forever fixed value, and inflation can be updated in the
future through [on-chain governance](./learn-polkadot-opengov.md)** based on thorough tokenomics
research.

## Inflation Model

The chart below shows the inflation model of the network. Depending on the number of staked tokens,
the distribution of the inflation to validators and nominators versus the treasury will change
dynamically to provide incentives to participate (or not participate) in staking.

There is a [dynamic _ideal staking rate_](#ideal-staking-rate) (in the figure set to 0.5 or 50%)
that the network tries to maintain. The goal is to have the _system staking rate_ meet the _ideal
staking rate_. The system staking rate would be the total amount staked over the total token supply,
where the total amount staked is the stake of all validators and nominators on the network. The
ideal staking rate accounts for having sufficient backing of {{ polkadot: DOT :polkadot }}
{{ kusama: KSM :kusama }} to prevent the possible compromise of security while keeping the native
token liquid.

![staking](../assets/NPoS/staking-rate-with-parachains.png)

<p style={{textAlign:"center"}}>Source: <a href="https://research.web3.foundation/Polkadot/overview/token-economics">Research - Web3 Foundation</a></p>

- **x-axis**: Proportion of {{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} staked
- **y-axis**: Inflation, annualized percentage
- **Blue line**: Annual inflation rate of NPoS, i.e. total amount of tokens minted to pay validators
  and nominators.
- **Green line**: Annual rewards rate for stakers. For instance, 0.2 corresponds to 20% of annual
  returns on the staked tokens. You can determine the current annual staking rewards rate by looking
  at the top bar of the staking overview on
  [Polkadot-JS UI](https://polkadot.js.org/apps/#/staking).

Assuming that the ideal staking rate is 50%, all of the inflation would go to the validators and
nominators if 50% of all {{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} are staked. Any
deviation from the 50% - positive or negative - sends the proportional remainder to the treasury.
Deviation from the ideal staking rate are referred to as _staking inefficiencies_. Thus, the
treasury does not currently receive a substantial inflow of funds at the ideal staking rate. See
[this page](./learn-polkadot-opengov-treasury.md) for more information about treasury inflow
sources.

For those who are interested in knowing more about the design of the inflation model for the
network, please see [here](https://research.web3.foundation/Polkadot/overview/token-economics).

## Ideal Staking Rate

The ideal staking rate can vary between 45% to 75% based on the number of parachains that acquired a
lease through an auction (this excludes the System parachains), based on the implementation
[here](https://github.com/paritytech/polkadot-sdk/blob/cd901764a52edc04a6d22bea3a526def593ab2a7/polkadot/runtime/common/src/impls.rs#L80).

Briefly, the ideal staking rate can be calculated as follows:

`0.75 - auction_proportion`

where `auction_proportion` is obtained by computing `min(auctioned_slots, 60) / 200`. The
`auctioned_slots` are all the auctioned slots without the slots for system parachains.

Assuming there are 48 filled slots, of which three are dedicated to system parachains (Asset Hub,
Bridge Hub and Collectives), there are 45 auctioned slots. The `auction_proportion` is thus
`45 / 200 = 0.225`. The ideal staking rate is `0.75 - 0.225 = 0.525`.

If the amount of tokens staked goes below 52.5%, then staking rewards for nominators increase,
incentivizing them to stake more tokens on the network. On the contrary, staking rewards drop if
staked tokens exceed the ideal staking rate. This results from the change in the percentage of
staking rewards that go to the Treasury.



---
id: learn-launch
title: Polkadot Launch Phases
sidebar_label: Polkadot Launch Phases
description: Polkadot's Launch Process and its Individual Phases.
keyword: [launch, phases, polkadot, DOT, claim, token sale, redenomination]
slug: ../learn-launch
---

The Polkadot network has a phased roll-out plan, with important milestones toward decentralization
marking each phase. Keep up-to-date with the Polkadot's phased roll-out plan at by viewing the
[roadmap](https://polkadot.network/launch-roadmap/)

**Current Phase: Post-launch Upgrades**

:::info Claims

For the most update-to-date information on DOT claims (if you bought your DOTs before Polkadot went
live), check out the following claiming resources and tutorials:

- [Why do I need to claim my DOT tokens, and is there a deadline?](https://support.polkadot.network/support/solutions/articles/65000063553-why-do-i-need-to-claim-my-dot-tokens-and-is-there-a-deadline-)
- [I claimed my DOT before Polkadot went live, but still see zero balance!](https://support.polkadot.network/support/solutions/articles/65000063667-i-claimed-my-dot-before-polkadot-went-live-but-still-see-zero-balance-)
- [How to claim your DOT - Tutorial](https://support.polkadot.network/support/solutions/articles/65000138217-how-to-claim-your-dot-tutorial)
- [How do I know my claim worked?](https://support.polkadot.network/support/solutions/articles/65000103605-how-do-i-know-my-claim-worked-)

:::

## The PoA Launch

The Genesis block of the Polkadot network was launched on May 26, 2020, as a Proof of Authority
(PoA) network. Governance was restricted to the single Sudo (super-user) key, which was held by Web3
Foundation to issue the commands and upgrades necessary to complete the launch process. During this
time, validators started joining the network and signaling their intention to participate in
consensus.

## Nominated Proof of Stake

Once Web3 Foundation was confident in the stability of the network and there was a sufficient number
of validator intentions, Web3 Foundation used [Sudo](https://youtu.be/InekMjJpVdo) &mdash; a
superuser account with access to governance functions &mdash; to initiate the first validator
election. Following this election, the network transitioned from PoA into its second phase,
[Nominated Proof of Stake (NPoS)](learn-staking.md), on June 18, 2020.

## Governance

After the chain had been running well with the validator set, the Sudo key issued a runtime upgrade
that enabled the suite of governance modules in Polkadot; namely, the modules to enable a
[Council](learn-governance.md#council), a
[Technical Committee](learn-governance.md#technical-committee), and
[public referenda](learn-governance.md#public-referenda).

## Removal of Sudo

The Sudo module was removed by a runtime upgrade on July 20, 2020, transitioning the
[governance](learn-governance.md) of the chain into the hands of the token (DOT) holders.

From this point, the network has been entirely in the hands of the token holders and is no longer
under control of any centralized authority.

## Balance Transfers

To enable balance transfers, the community
[made a public proposal](../maintain/maintain-guides-democracy.md) for a runtime upgrade that lifted
the restriction on balance transfers. Transfer functionality was subsequently enabled on Polkadot at
block number 1_205_128 on August 18, 2020, at 16:39 UTC.

## Core Functionality

After five years of research and development and a multi-stage launch that began in May 2020,
Polkadot launch was completed on December 18, 2021, with all auction-winning parachains producing
blocks on the network.

Check out these resources for further information:

- [Polkadot Network blog](https://polkadot.network/blog/parachains-are-live-polkadot-launch-is-now-complete/).
- [Polkadot A to Z: L for Polkadot Launch](https://www.reddit.com/r/Polkadot/comments/s3yb3d/l_for_polkadot_launch_polkadot_a_to_z/).


---
id: learn-nft-pallets
title: NFT Pallets
sidebar_label: NFT Pallets
description: Functionalities of the NFT Pallets in the Polkadot Ecosystem.
keywords: [NFT, non-fungible token, NFT 2.0, nfts, NFT pallets]
slug: ../learn-nft-pallets
---

NFT [pallets](learn-extrinsics.md#pallets-and-extrinsics) allow developers to easily implement
NFT-related actions within their dApp.

## NFTs Pallet

:::info For Developers Only

The information presented here below is for developers. A user-friendly portal for NFTs, DEX and
Assets is under construction.

:::

NFTs is a [FRAME pallet](https://polkadot.js.org/docs/substrate/extrinsics#nfts) currently deployed
on Westmint, which provides a multitude of functions to interact with NFTs.

The pallet comes with a new way to configure NFTs, as well as configure collections and items.
Pallet-level [feature flags](https://github.com/paritytech/substrate/pull/12367) allow disabling
functionalities not needed in the runtime.

### Roles

Setting up a collection implies different roles with different permissions:

- Owner:

  - destroy collection (to destroy the collection, there should be 0 items left).
  - redeposit: re-evaluate the deposit on some items.
  - set team: change the collection’s Issuer, Admin, Freezer.
  - set collection max supply: set the maximum number of items for a collection.
  - lock collection: this can include making a collection’s items non-transferable, fixing its max
    supply, and locking collection metadata and attributes.

- Admin:

  - set attributes and metadata of a collection.
  - set attributes pre-signed: set attributes for an item by providing the Admin pre-signed
    approval.
  - lock item properties: lock item metadata and [attributes](#attributes).

- Freezer:

  - lock item transfer: disallow further item transfers.
  - unlock item transfer: lift a previous lock to transfer an item.

- Issuer
  - mint
  - force mint (with custom item configuration).
  - mint pre-signed: mint an item by providing the Issuer pre-signed approval.
  - update mint settings.

Those roles can also be set to `none` without the ability to change them back. This is useful when a
collection is created and all the items are minted. Now, by setting roles to `none` we remove the
possibility of minting any more items, changing the metadata, or disallowing some item's transfer.

### Attributes

An item can hold the following types of attributes:

- **System attributes.** These attributes can only be set or unset by the pallet. Examples include
  locking an item for runtimes that use the fractionalization pallet. This is also how users can
  mint from a collection if they hold a valid item from another collection (the system attribute
  `UsedToClaim` is set).
- **Collection owner’s attributes.** These are attributes that can only be set or unset by the
  collection's admin.
- **User attributes.** These are attributes used to store various user-defined settings/values that
  can only be changed by the NFT's owner. No other account can restrict modifying those attributes.
- **External attributes.** These are attributes that an NFT owner can use to allow external services
  (e.g. oracles, smart contracts on another chain, etc..) to set or modify.

### Creating a Collection

You can use the NFTs pallet to create NFT collections. In the Polkadot-JS UI, go to Developer >
Extrinsic and select the `nfts.create` extrinsic. When you create a collection, you must specify who
the admin is. Then, under `config: PalletNftsCollectionConfig`, you can configure your collection by
specifying different settings:

- `settings` you can specify (in a bitflag-format) settings for your collection:

  - `Transferrable items`: When disabled, the items will be non-transferrable (good for soul-bound
    NFTs),
  - `Unlocked metadata`: When disabled, the metadata will be locked,
  - `Unlocked attributes`: When disabled, the attributes in the `CollectionOwner` namespace will be
    locked,
  - `Unlocked max supply`: allows to change the max supply until it gets locked (i.e. the
    possibility to change the supply for a limited amount of time),
  - `Deposit required`: when disabled, no mint deposit will be taken for items. This option can be
    set by a super-user only.

:::info

Note that currently, Polkadot-JS UI does not support bitflags. Leave the settings field as it is.
Everything is unlocked by default (bitflag value `0`).

:::

- `maxSupply` (toggle option) allows you to specify the maximum number of items that can be minted.
- `mintSettings: PalletNftsMintSettings` allows you to specify different settings for your
  collection.
  - `mintType` gives you the possibility to specify who can mint in your collection:
    - `Ìssuer`: only you can mint in your collection.
    - `Public`: everyone can mint in your collection.
    - `HoderOf`: only holders of items in another collection can mint in your collection. This
      requires knowledge about the ID of the other collection. This avoids looping through all
      existing collections and spamming RPC nodes with requests to find available IDs.
  - `price` (toggle option) allows you to specify the price of the items.
  - `startBlock`and `endBlock` give you the possibility to specify a time frame during which the
    collection's configuration is valid (i.e. all options within
    `config: PalletNftsCollectionConfig`).
  - [other mint settings](https://github.com/paritytech/substrate/pull/12483) include:
    - wave minting, for example mint X number of items that go to collection owners and Y number of
      items for the public
    - force mint: minting bypassing mint settings

:::info

The user can decide to lock an item or collection’s metadata, attributes, and settings. Also, a
locking mechanism can prevent unauthorized and unprivileged transfers (unprivileged actions can be
re-allowed anytime).

:::

With all these options, one can decide to modify the price of the collection's items and who can
mint, receive or buy items in that collection. Time constraints are available with `startBlock` and
`endBlock` parameters. It is thus possible, for example, to create a schedule in which holders of
items in collection A (`HolderOf` parameter) will be able to claim a limited number of NFTs from
Collection X (`maxSupply` parameter) only within a specific time frame.

In Collection X, people can mint the number of NFTs they have in Collection A. It's a one-to-one
ratio. So if they have 3 nfts in collection A, they can mint 3 nfts in collection X. Each time they
use one nft in Collection A, the said NFT will have an attribute that will block its further use to
mint in Collection X. But it will be possible to mint in another collection Y if it also uses
collection A as a `HolderOf`.

You can modify the parameters, so anyone can buy more NFTs from Collection X. To buy an NFT you must
pay the item price + transaction fee. Even if the item is free, the transaction fee always apply.

This can be useful for events such as Hackathons where participants who bought a ticket receive the
NFT ticket from Collection A. Then, all holders of at least one item in Collection A (i.e. all
ticket holders) will be given free avatar NFT from Collection X within the event schedule. After the
event, any additional remaining items in Collection X can be made available to the public through a
marketplace.

The requirement to get the free avatar is to hold at least one NFT in Collection A. One can only
claim the avatar specifying which NFT (i.e. the ID) they own in Collection A. The same NFT cannot be
used twice. Holders of multiple NFTs in Collection A (for example, participants in multiple
Hackathons) can claim multiple avatars specific to each event.

:::warning Time frame must be updated

Someone trying to mint an NFT outside the specified time frame will trigger a `NoConfig` error, as
the collection’s admin has specified no configuration after the time frame ends. The collection's
admin must call the `updateMintSettings` extrinsic and add a new schedule or disable the block
number option.

:::

After you minted an NFT, check which NFT IDs you own under which collection. In the Polkadot-JS UI
go to Developer > Chain State > Storage, select the `nfts.account` extrinsic, and specify the
account owning the NFT and the collection ID. You can also see all your collections by selecting the
`collectionAccount` extrinsic.

When a new collection is created, a new ID will be generated and assigned to it. When a collection
is destroyed, no one can pick up the collection ID again (including the owner).

### Minting an NFT

You can mint an NFT using the `nfts.mint` extrinsic. You must then specify the following:

- `collection`, the collection ID where you want to mint
- `item`, the item ID
- `mintTo`, the account
- `witnessData` (toggle option), you can specify if you own an NFT in another collection

Creating an item usually involves setting some attributes specific to that item.

### Uploading Files and Metadata

When you have a collection ID and an item ID you need to:

- Open an account on [Pinata](https://www.pinata.cloud/).
- Follow
  [these steps](https://docs.pinata.cloud/what-can-i-learn-here/pinning-your-first-file-with-pinata)
  to upload the file you want to mint.
- After uploading your file, get the
  [Content Identifier (CID)](https://docs.ipfs.tech/concepts/content-addressing/#what-is-a-cid).
  This unique string of letters and numbers will act as a marker to link the data uploaded onto
  [IPFS](https://ipfs.tech/#how) to the collection or item ID you own.
- Prepare the metadata file and add your CID (see below):

```
{
    "name":"Your Collection Name",
    "description":"Collection's Description",
    "image":"Your Collection CID"
}
```

- Upload the metadata file to Pinata and get the updated CID.
- After minting your NFT on the Polkadot-JS UI, you can add the CID. Go to Developer > Extrinsics
  and select the `nfts.setCollectionMetadata` (for collections) or `nfts.setMetadata` (for single
  NFTs) extrinsic. Under the `data: Bytes` field you can enter the CID or upload the metadata file.

The collection can be created and its item minted before uploading the NFT file and related
metadata. The minting process on-chain will assign a collection and item ID to your account. Those
IDs will later be populated with NFT files, metadata, and attributes. Once you upload the NFT files
and related data, the above-mentioned extrinsics can be used to update a collection or item.

:::info NFT/DEX/Asset Portal

With the new NFT/DEX/Asset portal, all the above steps will be executed "under the hood" and the
user will not have to worry about all technicalities.

:::

### Other Actions

- Buying an item up for sale.
- Burning (i.e., destroy) items or a single item (burning must be signed either by the admin of the
  collection or the owner).
- [Smart attributes](https://github.com/paritytech/substrate/pull/12702) allow an NFT owner to grant
  permission to other entities (another account, an application, an oracle, etc.) to update
  attributes of an NFT. An example could be that all Polkadot fellowship members have an NFT badge
  that gets updated over time (sort of a rank) with a consequent upgrade in membership permissions.
- A collection is managed by the
  [Issuer, the Admin, and the Freezer](./learn-assets.md#creation-and-management). Those roles can
  be changed anytime.
- Setting metadata for an item or collection (metadata includes all essential information about the
  item or the collection). Metadata could consist of any arbitrary data like the IPFS hash.
- Setting or re-setting the price of an item.
- Clearing attributes and metadata of a collection or an item.
- Changing the owner of an item or a collection.
- Transferring an item, as well as creating and canceling transfer approvals of a specific item, or
  an [atomic swap](https://github.com/paritytech/substrate/pull/12285).
- Transferring ownership of an item.
- Delegating accounts: Delegated accounts can approve changes to an item's attributes and transfer
  an item. The item owner always has control and can decide to cancel approvals from a delegated
  account.
- One can also execute pending atomic swaps created by a counterpart.

### Work in Progress

[NFTs fractionalization](https://github.com/paritytech/substrate/pull/12565) will allow the user to:

- Take ownership of an NFT from the [pallet-nfts](#nfts-pallet)
- Create a new asset in [pallet-assets](https://polkadot.js.org/docs/substrate/extrinsics#assets)
- Mint the input amount to the previous owner of the NFT as the beneficiary
- Mass minting: Minting multiple items in one single transaction. This will require the user to
  provide a .csv file with two columns: NFT ID and CID of metadata.

## Uniques Pallet

:::info

The Uniques Pallet is deprecated. Everything related to NFTs will be covered by the the
[NFTs Pallet](#nfts-pallet).

:::

Uniques is a [FRAME pallet](https://github.com/paritytech/substrate/tree/master/frame/uniques)
deployed on the Asset Hub system parachain. It implements the most basic kind of NFT -- a data
record referencing some metadata. This metadata reference is mutable until frozen, so NFTs and their
classes (entities derived from) are mutable unless specifically made immutable by the issuer.

Uniques takes a very bare-bones approach on purpose to keep the Asset Hub chain a simple
balance-keeping chain for both fungible and non-fungibles.

These NFTs can be viewed and interacted with on [RMRK's Singular platform](https://singular.app), by
switching the top right menu from Kusama to the Asset Hub.

![nft-hub](../assets/asset-hub/hub-nft.png)

They can also be interacted with directly through the
[extrinsics tab of the Asset Hub](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkusama-asset-hub-rpc.polkadot.io#/extrinsics):

![uniques.png](../assets/nft/uniques.png)



---
id: learn-nft-projects
title: NFT projects on Polkadot and Kusama
sidebar_label: NFT Projects
description: NFT Projects in the Polkadot Ecosystem.
keywords: [NFT, non-fungible token, NFT 2.0]
slug: ../learn-nft-projects
---

:::info Community Page

This page is open to contributions from the community. Please follow the
[Wiki contribution guidelines](https://github.com/w3f/polkadot-wiki#contributing-to-documentation)
and add your NFT app to this page.

:::

## List of NFT Projects

- [Astar](#Astar)
- [Basilisk](#basilisk)
- [Efinity](#efinity)
- [Kodadot](#kodadot)
- [Moonbeam](#moonbeam)
- [RMRK](#rmrk)
- [Asset Hub](#asset-hub)
- [Unique](#unique-network)

## Astar

[Astar Network](https://astar.network) and its sister network
[Shiden Network](https://shiden.astar.network) are the smart contract infrastructure in the Polkadot
Ecosystem. Astar Ecosystem ("Astar") supports NFTs developed with EVM smart contracts and WASM smart
contracts.

Astar has all toolings available that every EVM NFT developer knows. The availability of those
toolings makes the onboarding to Astar networks very attractive to any developer looking to explore
the Polkadot Ecosystem. Astar has an active community of artists and NFT enthusiasts. Besides
supporting all EVM toolings, Astar also bootstrapped the WASM smart contract environment for NFT
developers writing smart contracts with [ink!](https://use.ink) based on
[PSP34](https://github.com/w3f/PSPs/blob/master/PSPs/psp-34.md) (Polkadot Standards Proposals).

The main advantage of having a multi-virtual machine environment for NFT developers is that it will
give more possibilities to the builders for the use case they are developing. With the support of
WASM smart contracts, developers can develop solutions like [RMRK](./learn-nft#rmrk) with smart
contracts.

## Basilisk

[Basilisk](https://bsx.fi/) is a Kusama parachain that provides liquidity for the ecosystem. It also
has a full-featured NFT platform based on the
[Uniques pallet](https://github.com/paritytech/substrate/tree/master/frame/uniques). One of the key
features of Basilisk is that it allows minting NFTs with a royalty fee. This royalty fee is
distributed to the original creator of the NFT via the runtime pallet. Additionally
[Basilisk offers a feature](https://github.com/galacticcouncil/Basilisk-node/tree/master/pallets/marketplace)
that allows creating a buy order for a specific NFT.

These NFTs can be viewed and interacted instantly on [KodaDot](https://kodadot.xyz).

![nft-basilisk](../assets/nft/nft-basilisk.png)

## Efinity

Spearheaded by [Enjin](https://enjin.io), the authors of Ethereum's ERC1155 standard and makers of
the Enjin wallet and Unity plugin, which allows easy implementation of NFTs into 3D games, Efinity
is an NFT bridging chain coming to Kusama and Polkadot in 2022.

They plan to build a _paratoken_ which would be a standard for token migration across different
parachains in the Polkadot ecosystem, but also into and out of Ethereum and other EVM systems.

## [KodaDot](https://kodadot.xyz)

[KodaDot](https://kodadot.xyz) is an open-source NFT marketplace that operates on the Dotsama
(Kusama/Polkadot) network, striving to aggregate various NFT standards (Kusama, RMRK, Asset Hub,
Basilisk, etc.) in the Dotsama ecosystem, enhancing user experience by abstracting these standards.

KodaDot's strength lies in its commitment to open-source collaboration. It has transformed into a
collaborative hub where creators, developers, and community members work collectively for decision
making, amassing an extensive network of over
[90 open-source contributors](https://hello.kodadot.xyz/about-us/who-are-we/achievements). This
robust collaboration has earned KodaDot the
[number one rank as a dapp in the Polkadot ecosystem on Github](https://github.com/topics/polkadot).

See below a video tutorial about how to mint your NFT on [the Polkadot Asset Hub](#asset-hub) using
KodaDot.

[![KodaDot Tutorial on Minting NFTs](https://img.youtube.com/vi/SKdx4pTgL04/0.jpg)](https://www.youtube.com/watch?v=SKdx4pTgL04)

For more information about minting using KodaDot see
[this step-by-step tutorial](https://hello.kodadot.xyz/tutorial/minting/how-to-mint-nfts-on-polkadot-asset-hub-using-kodadot).

### The Team Behind KodaDot

KodaDot began as the first
[unofficial explorer for RMRKv0.0.1](https://kusama.polkassembly.io/motion/256)
[contributing to RMRK protocol](https://github.com/rmrk-team/rmrk-spec/issues/10). It later
[received Kusama Treasury funding](https://kusama.polkassembly.io/motion/349), which propelled the
team to create the
[best end-user experience on the Asset hub](https://kusama.polkassembly.io/motion/349).

In the summer of 2022, KodaDot won the first prize at the
[Polkadot North American event](https://devpost.com/software/kodadot-moonsama) for implementing
MoonBeam and MoonRiver NFT EVM smart contracts and enabling read-only access to existing components
for seamless end-user interaction.

The team successfully
[launched with Basilisk NFT Marketplace pallet in Fall 2022](https://github.com/kodadot/nft-gallery/issues/660),
where an increasing number of artist collections are emerging, providing artists the opportunity to
receive offers on unlisted NFTs and earn on-chain royalties.

KodaDot's upcoming integrations are based on
[PSP-34](https://github.com/w3f/PSPs/blob/master/PSPs/psp-34.md), leveraging
[smart contracts written with ink!](https://use.ink/).

### Ecosystem Tools by KodaDot

KodaDot has enriched the Polkadot ecosystem by
[offering a comprehensive API interface for builders](https://github.com/kodadot/uniquery), based on
the SubSquid indexer. This platform also presents searchable items and collections, translating
on-chain transactions into deep insights about collection ownership dynamics for end-users. For more
info about KodaDot check out [link](https://hello.kodadot.xyz/).

## Moonbeam

[Moonbeam](https://moonbeam.network) and its Kusama counterpart Moonriver are full EVM deployments
with Ethereum RPC endpoints.

This means that the entire toolkit offered to other EVM chains (stacks like Hardhat, Remix, Truffle,
Metamask, etc.) are available to Moonriver / Moonbeam users and developers, giving it a noticeable
head start in attracting existing userbases.

Several dozen high profile teams are launching their products (or re-launching) on Moonriver /
Moonbeam, however, it is essential to note that Moonbeam is an EVM chain and will therefore suffer
from the same limitations as any other EVM chain in regards to customization and feature-richness of
NFTs.

A notable advantage, however, is that Moonriver / Moonbeam is still a Substrate chain, meaning
integration of custom pallets into the runtime is still possible, making NFT specific optimizations
at the chain runtime level a reliable way to keep EVM compatibility of tools while at the same time
optimizing storage and interactions for rich NFTs.

## RMRK

[RMRK](https://rmrk.app) is a set of NFT 2.0 standards developed in three distinct code flavors:

1. ["Colored coins"](https://en.bitcoin.it/wiki/Colored_Coins) approach, as on Bitcoin, originally
   developed as a "hack" on the Kusama chain. This is now deprecated, and it is recommended
   implementers use any of the other options.
2. Solidity contracts, compatible with any EVM blockchain in and outside the Polkadot ecosystem.
   Documented [here](https://evm.rmrk.app)
3. Rust code (Substrate pallets), compatible with any Substrate chain. Code is available
   [here](https://github.com/rmrk-team/rmrk-substrate).

Additionally, two more flavors are in development:

1. [Astar](https://astar.network/) are developing the ink! version of RMRK:
   [code here](https://github.com/rmrk-team/rmrk-ink).
2. [Gear Technologies](https://www.gear-tech.io/) are developing the Gear implementation:
   [code and docs here](https://wiki.gear-tech.io/docs/examples/rmrk/).

The RMRK NFT 2.0 standards are a set of "NFT legos", primitives that, when put together, allow a
builder to compose an NFT system of arbitrary complexity without smart contracts.

### NFT Legos

1. NFTs can own other NFTs, NFTs can equip other NFTs for visual change
2. NFTs can have multiple resources (different outputs based on context and resource priority)
3. NFTs can have on-chain emotes (reactions) for price discovery and social mechanics
4. NFTs have conditional rendering (e.g. show Mona Lisa as blushing if she got 50 kissy 😘 emoji)
5. NFTs can be governed by the community via fungible shareholder-tokens (fractionalization of NFTs)

### NFT from [Kanaria](https://kanaria.rmrk.app)

![kanaria.png](../assets/nft/kanaria.png)

:::note Multi-resource NFTs

A multi-resource NFT (gif of statue, and SVG-composable dynamic NFT in one) that can also equip
other NFTs from within its "inventory".

:::

Two marketplaces for RMRK-based NFTs exist with hundreds of projects already launched:

- [Singular](https://singular.rmrk.app), the official marketplace

For a complete introduction into RMRK, see [this presentation](https://url.rmrk.app/wasmconf) or
read [the non-technical docs](https://docs.rmrk.app).

## Asset Hub

The Asset Hub is a generic assets parachain which provides functionality for deploying and
transferring assets — both Fungible and Non-Fungible Tokens (NFTs). The Asset Hub currently hosts
[Uniques pallet](./learn-nft-pallets.md/#uniques-pallet) and the
[NFTs pallet](./learn-nft-pallets.md#nfts-pallet) with NFT 2.0 functionalities.

## Unique Network

[Unique network](https://unique.network/), an NFT-specific blockchain offering innovations such as
sponsored transactions, bundling fungible tokens with non-fungibles, and splitting NFTs into
fungible tokens for partial ownership.

Unique Network have launched two NFT projects to date: Substrapunks as part of
[Hackusama](https://hackusama.devpost.com/), and Chelobricks as a promotion during
[Polkadot Decoded](https://decoded.polkadot.network/).

Unique Network focuses on B2B use cases, aiming to be an infrastructure provider for others to build
on, rather than entering the NFT space themselves as an end-product.

Unique Network aims to make their marketplace technology open-source and whitelabel-friendly. In
theory, it should be trivial to set up a new marketplace for your project using Unique's technology.
Unique network aims to be a parachain on Polkadot, and Quartz is their Kusama counterpart.



---
id: learn-nft
title: NFTs
sidebar_label: Introduction to NFTs
description: The NFT Landscape of the Polkadot Ecosystem.
keywords: [NFT, non-fungible token, NFT 2.0]
slug: ../learn-nft
---

This page is a high-level overview of NFTs in the blockchain space and the various approaches to
NFTs within the {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} network.

## Fungibility

NFT stands for _non-fungible token_. Fungibility means interchangeability inside of a group. In
theory, a $20 bill is always worth $20 in a store and identical in value to any other $20 bill. It
is not, however, fungible with a $1 or $100 dollar bill (outside its group).

A Pokemon™ trading card of a Charizard is non-fungible with a card of Squirtle, whereas editions of
Charizard are fungible with each other.

Fungibility is a spectrum - what is fungible to some might not be fungible to others. In reality,
Pokemon™ cards, the canonical example of non-fungible assets are more fungible than US dollar
bills, each of which has a unique serial number that may be important to a government agency. The
cards have no serial numbers [1].

![one dollar](<https://www.investopedia.com/thmb/Nr-RLORu5CX_lIWZfLmV5X0eIrc=/613x345/smart/filters:no_upscale()/Clipboard01-d20f6eb9351e4f36a46e11fd87b53b2d.jpg>)

Additionally, a digital item like a "purple magic sword" in a game may be fungible with another
visually identical sword if all the player cares about is the looks of their character. But if the
other sword has a different function, and that function influences the outcome of an adventure the
player is about to embark on, then visually identical swords are absolutely non-fungible.

Bearing that in mind, the simplest explanation of NFTs is that **NFTs are rows of arbitrary,
project-specific, and non-interchangeable data that can be cryptographically proven to "belong" to
someone**. This data can be anything - concert tickets, attendance badges, simple words, avatars,
plots of land in a metaverse, audio clips, house deeds, mortgages, and more.

## NFT Standards

A general-purpose blockchain is not built to natively understand the concept of NFTs. It is only
natively aware and optimized for its own native tokens, but implementations built on such a chain
are essentially "hacks".

For example, Ethereum is a general-purpose blockchain that does not have the concept of "tokens"
(fungible or not) built-in. Tokens in Ethereum are essentially spreadsheets of information to be
interpreted and read in a certain way by various user interfaces. This _way_ in which they should
read them is called a _standard_.

The most widespread fungible token standard you may have heard of is ERC20, while the most
widespread NFT standard is ERC721, followed closely by ERC1155. The downside of having to define
these standards is that they are always instructions for how to read a spreadsheet pretending to
serve information in a certain way, which by definition cannot be optimized. For this reason, even
on a good day of extremely low network congestion, interactions with NFTs on any EVM chain will cost
a few dollars but were on average around $100 per interaction (transfer, mint, sale) in 2021 on
Ethereum.

This prevents use cases that go beyond the current craze of _digital dust gathering NFTs_ on
Ethereum - profile pictures, generative "look once and then put away" art, [ENS](ens) addresses, and
[proof of attendance badges](https://poap.xyz/) (which have since moved to the xDAI chain to save on
gas fees).

### A typical [NFT on Ethereum](https://opensea.io/assets/ethereum/0x2127fe7ffce4380459cced92f2d4793f3af094a4/12598)

![samurai nft](../assets/nft/samurai.png)

For the sake of comparison, we can refer to these as NFTs 1.0: static NFTs that are almost
exclusively image-based collectibles of varying rarity.

## NFTs in Polkadot & Kusama

This is where {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}'s technology shines and
where NFTs 2.0 come into play. By allowing
[heterogeneous application-specific shards](learn-parachains.md) to exist, builders can natively
optimize for complex NFT use cases without tradeoffs that would make interacting with the system
prohibitively inefficient and expensive in other environments.

:::info

See [this page](./learn-nft-projects.md) for more information about specific NFT project on Polkadot
and Kusama.

:::

## Bridging

Bridging to and from Substrate chains and EVM chains takes much effort but is a highly desired
feature in the NFT industry. Merging the collector and customer base has significant implications,
so multiple projects focus on making this possible.

Apart from RMRK (Substrate-to-Substrate seamless teleportation natively with [XCMP](learn-xcm.md))
and Efinity (Paratoken), the following efforts are underway:

- [**MyNFT**](https://mynft.com/): an EVM to EVM bridging effort.
- **RMRK <-> EVM** Simplification bridge: a bridge developed during the
  [RMRK hackathon](https://rmrk.devpost.com) for porting RMRK NFTs into simplified IOUs on EVM
  chains

## References

- [1]: [Investopedia](https://www.investopedia.com/terms/l/liars-poker.asp)
- [2]:
  [Unique Network's Chelobrick](https://unique.network/blog/chelobricks-making-waves-with-10-000-substrate-based-nfts/)



---
id: learn-nomination-pools
title: Nomination Pools
sidebar_label: Nomination Pools
description: Staking through Polkadot's Nomination Pools.
keyword: [nominate, nominator, stake, staking, pools]
slug: ../learn-nomination-pools
---

import RPC from "./../../components/RPC-Connection";

:::info Nomination Pools are live on Polkadot!

Nomination pools are a new feature for Polkadot’s staking system that allows users to pool their
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} tokens together on-chain to nominate
validators and receive rewards, significantly improving the system’s scalability. Now, anyone with
as little as
[1 DOT can receive rewards for staking natively on Polkadot](https://polkadot.network/blog/nomination-pools-are-live-stake-natively-with-just-1-dot/).
Note that rewards are not guaranteed for those pools that do not have enough bonded funds to be
included within the [bags list](./learn-staking-advanced.md#bags-list). **Only members of active
pools will receive rewards.**

- There are currently
  {{ polkadot: <RPC network="polkadot" path="query.nominationPools.counterForPoolMembers" defaultValue={4376} /> :polkadot }}
  {{ kusama: <RPC network="kusama" path="query.nominationPools.counterForPoolMembers" defaultValue={389} /> :kusama }}
  members. (There can be a maximum of
  {{ polkadot: <RPC network="polkadot" path="query.nominationPools.maxPoolMembers" defaultValue={16384} /> :polkadot }}
  {{ kusama: <RPC network="kusama" path="query.nominationPools.maxPoolMembers" defaultValue={65536} /> :kusama }}
  members.)
- There are currently
  {{ polkadot: <RPC network="polkadot" path="query.nominationPools.lastPoolId" defaultValue={80} /> :polkadot }}
  {{ kusama: <RPC network="kusama" path="query.nominationPools.lastPoolId" defaultValue={115} /> :kusama }}
  pools. (There can be a maximum of
  {{ polkadot: <RPC network="polkadot" path="query.nominationPools.maxPools" defaultValue={64} /> :polkadot }}
  {{ kusama: <RPC network="kusama" path="query.nominationPools.maxPools" defaultValue={256} /> :kusama }}
  pools)
- {{ polkadot: No limit on :polkadot }}
  {{ kusama: There can be a maximum of <RPC network="kusama" path="query.nominationPools.maxPoolMembersPerPool" defaultValue={1024} /> :kusama }}
  members per pool.

:::

:::note

Learn the key differences between
[**Staking directly vs Joining a Nomination Pool**](#nominating-vs-joining-a-pool).

**For Ledger users:** Joining a nomination pool is possible only with the XL version of the Polkadot
Ledger App. This should be installed by default on Ledger Nano X and S Plus, but not on the Nano S.

**If you become a nomination pool member or a pool admin, you cannot participate in Governance with
the bonded tokens in the pool, as they are held in a
[system account](./learn-account-advanced.md#system-accounts).**

:::

:::tip Have questions on Nomination Pools?

Please join the [Polkadot Discord](https://dot.li/discord) for asking general questions about
Nomination Pools. If you are a developer, please join our
[nomination pools support channel](https://matrix.to/#/#nompools-support:matrix.parity.io).

:::

![Nomination Pools](../assets/staking/NPoS-Pools.png)

Nomination pools are one of the key features from the roadmap of staking improvements on
{{ kusama: Kusama :kusama }}{{ polkadot: Polkadot :polkadot }}. They are designed to
permissionlessly allow members to pool their funds together and act as a single nominator account.

Due to the current runtime constraints,
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} can only handle
{{ polkadot: <RPC network="polkadot" path="consts.electionProviderMultiPhase.maxElectingVoters" defaultValue={22500}/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.electionProviderMultiPhase.maxElectingVoters" defaultValue={12500}/> :kusama }}
nominators comfortably in the [electing set](learn-nominator.md#staking-election-stages). As one of
the objectives of the [NPoS algorithm](learn-phragmen.md) is to maximize the overall stake on the
network, it can be inferred that the staking system on
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} favors nominators with a larger
stake. Only the nominator accounts which back the validators in the active set are eligible for
receiving staking rewards. This leaves out nomination intents from the accounts with lower token
balance than the min-active nomination and places them in a waiting queue to enter electing set.
Nomination pools will be handy for members who want to participate in the staking system with a
stake much lower than the dynamic min-active nomination threshold on the network. All operations are
constant space and time complexity relative to the number of members, eliminating any theoretical
upper bound on the number of members the system can handle and thus scaling the number of accounts
that can participate and earn rewards in the staking system on
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}. In summary, each nomination pool is
viewed as a single nominator from the NPoS system point of view.

:::info Why aren't the members in the nomination pools called delegators?

The term `delegator` is associated too much with Delegated Proof of Staking (DPoS), and since
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} implements Nominated Proof of Staking
(NPoS), naming them delegators would be misleading. The term `member` is our generic replacement for
`delegator`. In action, members are quite similar to delegators and delegate their nomination power
to the pool.

:::

The pool’s earnings are split pro rata to a member's stake in the bonded pool (and thus, the staking
rewards for members will be the same as if they were a nominator). Importantly, slashes are also
applied proportionally to members who may have been actively bonded.

## Key Components

- Bonded Pool: Tracks the distribution of actively staked funds.
- Reward Pool: Tracks rewards earned by actively staked funds.
- Unbonding Sub Pools: Collection of pools at different phases (i.e. eras) of the unbonding
  lifecycle.
- Members: Accounts that nominate to the pools.
- Point: Unit of measure for a member’s portion of a pool's funds. All pools start with a point to
  Planck ratio of 1. Over time, if the pool receives rewards, they increase in value, and if the
  pool is slashed, it decreases in value.

## Pool Member Lifecycle

### Join a pool

A member delegates funds to a pool by transferring some amount to the pool’s bonded account with the
`join` extrinsic. The pool then increases its bond with the new funds. A member is afforded the
ability to bond additional funds or re-stake rewards as long as they are already actively bonded.
Note that a member may only belong to one pool at a time.

**The current minimum bond to join a pool on**
{{ polkadot: **Polkadot** :polkadot }}{{ kusama: **Kusama** :kusama }}
{{ polkadot: **is <RPC network="polkadot" path="query.nominationPools.minJoinBond" defaultValue={10000000000} filter="humanReadable" />.** :polkadot }}
{{ kusama: **is <RPC network="kusama" path="query.nominationPools.minJoinBond" defaultValue={1666666650} filter="humanReadable" />.** :kusama }}

:::info

The funds nominated to a pool will not be visible in the member's account balance on Polkadot JS
Apps UI. This is because the member funds are transferred from their account to the pool's
[system account](./learn-account-advanced.md#system-accounts). This pool account is not accessible
by anyone (including the pool root or depositor) and only the pool's internal logic can access the
account.

:::

:::tip Use Non-Transfer or Nomination Pools Proxy Accounts to join Nomination Pools

Only [non-transfer proxies](learn-proxies.md#non-transfer-proxy) and
[nomination pools proxy](./learn-proxies.md#nomination-pools-proxy) can be used to participate in
nomination pools. [Staking proxies](learn-proxies.md#staking-proxy) cannot be used as they cannot
make calls to the nomination pools pallet. (The nomination pools will be supported through a staking
proxy when the changes made in [this PR](https://github.com/paritytech/polkadot/pull/7448) are
released on the network.

Thus, depending on how much control you want to give your proxy, you might choose between
non-transfer > staking > nomination pool proxy, with the latter being only able to sign transactions
related to the `NominationPool` pallet.

:::

Check the "How to join a pool" section in
[this support article](https://support.polkadot.network/support/solutions/articles/65000181401-how-to-join-nomination-pools)
for guidelines.

### Claim rewards

The member can claim their portion of any rewards that have accumulated since the previous time they
claimed (or in the case that they have never claimed, any rewards that have accumulated since the
era after they joined). Rewards are split pro rata among the actively bonded members. Check the "How
to claim rewards" section in
[this support article](https://support.polkadot.network/support/solutions/articles/65000181401-how-to-join-nomination-pools)
for guidelines.

### Claim Permissions

As a pool member, you can grant permission to any other account to claim and compound rewards on
your behalf. There are four permission options:

- `Permissioned` (default): you need to claim and compound your rewards.
- `PermissionlessCompound`: you grant permission to any other account to compound (claim and bond)
  your rewards on your behalf.
- `PermissionlessWithdraw`: you grant permission to any other account to withdraw (claim and keep as
  a free balance) your rewards on your behalf.
- `PermissionlessAll`: you grant permission to any other account to compound or withdraw your
  rewards on your behalf.

See the [Staking Dashboard page](../general/staking-dashboard.md#pools) for more information about
how to set your claim permissions.

See the [advanced guides](./learn-guides-staking-pools.md#claim-rewards-for-other-pool-members) to
learn how to claim rewards for another pool member.

### Unbond and withdraw funds

At any point in time after joining the pool, a member can start the process of exiting by unbonding.
`unbond` will unbond part or all of the member's funds. After unbond has been called and the
unbonding duration has passed
{{ polkadot: (<RPC network="polkadot" path="consts.staking.bondingDuration" defaultValue={28} filter="erasToDays"/> :polkadot }}
{{ kusama: (<RPC network="kusama" path="consts.staking.bondingDuration" defaultValue={28} filter="erasToDays"/> :kusama }}
eras which correspond to
{{ polkadot: <RPC network="polkadot" path="consts.staking.bondingDuration" defaultValue={28} filter="erasToDays"/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.staking.bondingDuration" defaultValue={28} filter="erasToDays"/> :kusama }}
days on {{ polkadot: Polkadot), :polkadot }} {{ kusama: Kusama), :kusama }} a member may withdraw
their funds with `withdrawUnbonded`. Withdrawing effectively ends a member's relationship with their
pool, allowing them to join a different pool if desired. Check the "Withdraw unbonded funds" section
in
[this support article](https://support.polkadot.network/support/solutions/articles/65000181401-how-to-join-nomination-pools)
for guidelines.

:::info Unbonding transaction automatically triggers withdrawal of rewards

When there is a change in the bonded balance, the accumulated rewards in the pool thus far are
automatically withdrawn to the account. The rewards are then accrued based on the updated bonded
balance.

:::

### Limitations of Nomination Pools

- A member cannot vote (e.g. in Referenda or for Council members) with their nominated funds. This
  may be changed in the future once accounts are afforded the ability to split votes.
- For a member to switch pools, all funds from the account must be unbonded. This process takes 28
  eras.
- A member can partially unbond the staked funds in the pool (at most 16 partial unbonds).

## Pool Administration

### States

- Open: The pool is open to be joined by anyone.
- Blocked: The pool is blocked; no joiners are permitted.
- Destroying: The pool is in the process of being destroyed. Once in this state, the pool may never
  revert to any other state; it can only proceed to be destroyed. All members can be
  permissionlessly unbonded; this allows the pool to be dismantled regardless of any member’s
  proactivity.

### Roles

- Depositor: Creates the pool and is the initial member. The depositor can only leave the pool once
  all other members have left. Once they leave by withdrawing, the pool is fully removed from the
  system.
- Nominator: Can select the validators the pool nominates.
- Bouncer: Can change the pool’s state and kick (permissionlessly unbond/withdraw) members if the
  pool is blocked.
- Root: Can change the nominator, bouncer, or itself. Further, it can perform any of the actions the
  nominator or bouncer can.

### Pool Commissions

As the pool root role, you can set pool commissions that will be applied to the staking rewards paid
out to the pool's system account before rewards are allocated for the pool members. You can set pool
commissions through the [Polkadot Staking Dashboard](../general/staking-dashboard.md#pools).

Three methods can be used when setting the pool commission:

- **Commission Rate** (`nominationPools.setCommission` extrinsic): the start or new commission rate
  (`newCommission` parameter) that can be set between 0% and
  {{ polkadot: <RPC network="polkadot" path="query.nominationPools.globalMaxCommission" defaultValue={100000000} filter="percentage"/> :polkadot }}%
  (decided through [governance referendum](./learn-polkadot-opengov.md)) via the
  [`globalMaxCommission`](https://paritytech.github.io/substrate/master/pallet_nomination_pools/pallet/type.GlobalMaxCommission.html)
  parameter. You will need to specify an Input Payee Account, i.e. the account that will receive the
  commission.
- **Max Commission** (`nominationPools.setCommissionMax` extrinsic): the maximum commission
  (`maxCommission` parameter) the pool will apply to its members (between 0% and Max Commission).
  Note that once set, **the pool admin can only lower it**.
- **Change Rate** (`nominationPools.setCommissionChangeRate` extrinsic): the maximum rate increase
  (`maxIncrease` parameter) allowed for a single commission update. Note that once set, **the pool
  admin can only lower it**. When setting the Change Rate, it will also be possible to set a
  `minDelay` quantified as the number of blocks (since last commission update) after which it is
  possible to change the commission (i.e. the minimum delay between commission updates). Note that
  once set, **the pool admin can only increase it**.

Max Commission and Change Rate must not be necessarily set. It is the choice of the pool admin to
set those parameters and provide transparency to the pool members about the pool's commission
policy.

:::warning Max Commission and Change Rate are currently permanent

Once the Max Commission and the Change Rate are set, the pool admin currently can only decrease
those values. The minimum delay between commission updates can only be increased. The situation can
change in the future and a `forceSetCommissionMax` method can be proposed through governance
referendum.

:::

Let's take, for example, Pool A, which sets the Commission Rate to 10%, the Max Commission to 100%,
and the Change Rate to 1% every 300 blocks (which equates to approximately 30 minutes). The
following statements are true:

- The pool commission can be increased by 1% every 30 minutes. Bigger increases are not allowed.
  Increases of less than or equal to 1% are not allowed sooner than 30 minutes since the last
  commission update.
- The Max Commission can only be decreased from 100%. Once decreased, it can be decreased again but
  it cannot be increased.
- The Change Rate's maximum increase can only be decreased from 1%. Once decreased, it can be
  decreased again but it cannot be increased.
- The Change Rate's minimum delay between updates of 30 min can only be increased. Once increased,
  it can be increased again but it cannot be decreased.

## Pool Lifecycle

:::info Advanced How-to Guides

See [this page](./learn-guides-staking-pools#pool-creation) for more information about the lifecycle
of nomination pools. The cycle includes creation, upkeep and destruction.

:::

## Nomination Pools - Slashing

Suppose the staking system slashes a pool’s underlying nomination account. In that case, the slash
is distributed evenly across the bonded pool, and the unbonding pools from slash era+1 through the
slash apply era. Thus, any member who either a) was unbonding or b) was actively bonded in the
aforementioned range of eras will be affected by the slash. In other words, a member who may have
been actively bonded during the offence is slashed pro rata based on its stake relative to the total
slash amount.

Unbonding pools need to be slashed to ensure all nominators who were in the bonded pool while it was
backing a validator that committed an offense are punished. Without these measures a nominator could
unbond right after a validator equivocated with no consequences.

This strategy is unfair to members who joined after the slash because they get slashed as well, but
it spares members who unbond. The latter is much more important for security: if a pool's validators
attack the network, their members need to unbond fast! Avoiding additional slashes gives them an
incentive to do that if validators get repeatedly slashed.

## Nominating vs Joining a Pool

Nominating is the action of choosing validators. It does not simply involve bonding tokens.
Nominating is an active task, which implies that you regularly monitor that your stake is backing an
active validator in all the eras and check if you are receiving your staking rewards. More
importantly, ensure that the validators you chose always act in the best interests of the network
protocol and have less chance of getting slashed. To nominate, you need a minimum of
{{ polkadot: <RPC network="polkadot" path="query.staking.minNominatorBond" defaultValue={100000000000} filter="humanReadable"/> :polkadot }}{{ kusama: <RPC network="kusama" path="query.staking.minNominatorBond" defaultValue={100000000000} filter="humanReadable"/> :kusama }},
and to receive rewards, you need at least a balance greater than the minimum active bond. Depending
on your validators, if your active validator is oversubscribed, you will earn rewards only if your
stake is within that of the top
{{ polkadot: <RPC network="polkadot" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/> :polkadot }}{{ kusama: <RPC network="kusama" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/> :kusama }}
nominators. If the validator misbehaves, It is worth noting that your stake is subject to slashing,
irrespective of whether you are at the top
{{ polkadot: <RPC network="polkadot" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/> :polkadot }}{{ kusama: <RPC network="kusama" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/> :kusama }}
nominators or not.

As the minimum active bond is a dynamic value, it can make your nomination inactive when the
threshold goes above your bonded balance. Hence, to be eligible to earn rewards while nominating,
you would need to stake a much higher balance than the minimum active bond.

Nomination pools are a way to participate in staking with as little as 1 DOT and earn staking
rewards. Nomination pools differ from custodial solutions (like staking through central exchanges)
because they are non-custodial, native to Polkadot's protocol, permissionless, transparent, and run
in a decentralized way by the community. Before joining a nomination pool, you must ensure that the
pool is earning rewards and nominating the validators that match your preferences. Participating in
pools is more of a set-and-forget action than nominating by yourself. The pool operator maintains
the list of validators nominated by the pool, and so, in a way, you are trusting the pool operator
to act in your best interests. However, it is advised to check the validators nominated by the pool
from time to time and change the pool if necessary.

:::info Minimum Active Nomination Value is Dynamic

The minimum amount required to become an active nominator and earn rewards is
{{ polkadot: __<RPC network="polkadot" path="query.staking.minimumActiveStake" defaultValue={2937000000000} filter="humanReadable"/>__. :polkadot }}
{{ kusama: __<RPC network="kusama" path="query.staking.minimumActiveStake" defaultValue={2937000000000} filter="humanReadable"/>__. :kusama }}
If you have less {{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} than the minimum active
nomination and still want to participate in staking, you can join the nomination pools. You can now
stake on {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} natively with just
{{ polkadot: __<RPC network="polkadot" path="query.nominationPools.minJoinBond" filter="humanReadable" defaultValue={10000000000}/>__ :polkadot }}
{{ kusama: __<RPC network="kusama" path="query.nominationPools.minJoinBond" filter="humanReadable" defaultValue={1666666650}/>__ :kusama }}
in the nomination pools and earn staking rewards. For additional information, see
[this blog post](https://polkadot.network/blog/nomination-pools-are-live-stake-natively-with-just-1-dot/).
Check the wiki doc on [nomination pools](learn-nomination-pools.md) for more information.

:::

|                                                                                                                                 Nominating                                                                                                                                  |                                                                                                       Joining a Pool                                                                                                        |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                                                                        Minimum 250 DOT to nominate.                                                                                                                         |                                                                                                Minimum 1 DOT to be a member.                                                                                                |
|                                                                                                       Rewards can be compounded automatically or sent to any account.                                                                                                       |                                                       Rewards can be manually claimed to the pool member's account and be bonded in the pool again to compound them.                                                        |
|                                                      If the active validator gets slashed, all active nominators are subjected to slashing, also those that do not receive rewards due to the oversubscription issue.                                                       |                                                                      If the active validator gets slashed, all pool members are subjected to slashing.                                                                      |
|                                                                                                                    Can bond and stake DOT indefinitely.                                                                                                                     |                                                                                        Can bond and stake DOT until the pool exists.                                                                                        |
|                                                                                                    Unbonding period of 28 days. Can switch validators without unbonding.                                                                                                    |                                                                      Unbonding period of 28 days. Need to unbond before switching to a different pool.                                                                      |
|                                                                                                                              Maximum uncapped.                                                                                                                              |                                                                                                      Maximum uncapped.                                                                                                      |
| Should bond more than the [minimum active nomination](../learn/learn-nominator.md#minimum-active-nomination-to-receive-staking-rewards) in an era to be eligible to earn staking rewards, although it can depend on multiple other factors outlined in the linked document. |    A nomination pool earns rewards in an era if it satisfies all the conditions mentioned for the nominator (as the nomination pool is just a nominator from [the NPoS system](../learn/learn-phragmen.md) perspective).    |
|                                                                                                         Staked tokens can be used for participation in Governance.                                                                                                          |                                                                                Staked tokens cannot be used for participation in Governance.                                                                                |
|                                                            [Rewards payout](../learn/learn-staking-advanced.md#claiming-rewards) can be triggered permissionlessly by anyone (typically done by the validator).                                                             |                                                                                           The pool member must claim the rewards.                                                                                           |
|                                                                                                                    Bonded funds remain in your account.                                                                                                                     | Bonded funds are transferred to a pool account which is administered by the network protocol and is not accessible to anyone else. See [System Accounts](./learn-account-advanced.md#system-accounts) for more information. |
|                                                                                                         Nominator manages the list of staked validators (up to 16).                                                                                                         |                                                                                          Nominations managed by the pool operator.                                                                                          |



---
id: learn-nominator
title: Nominator
sidebar_label: Nominator
description: Role of Nominators in the Polkadot Ecosystem.
keyword: [nominate, nominator, stake, staking]
slug: ../learn-nominator
---

import RPC from "./../../components/RPC-Connection";

:::tip New to Staking?

Start your staking journey or explore more information about staking on
[Polkadot's Home Page](https://polkadot.network/staking/). Discover the new
[Staking Dashboard](https://staking.polkadot.network/#/overview) that makes staking much easier and
check this
[extensive article list](https://support.polkadot.network/support/solutions/articles/65000182104) to
help you get started.
{{ polkadot: You can now [stake natively with just 1 DOT and earn staking rewards](https://polkadot.network/blog/nomination-pools-are-live-stake-natively-with-just-1-dot/). :polkadot }}
{{ kusama: All the examples presented on Polkadot also apply to Kusama. :kusama }}

:::

:::info Stake through Nomination Pools

The minimum amount required to become an active nominator and earn rewards may change from era to
era.
{{ polkadot: It is currently __<RPC network="polkadot" path="query.staking.minimumActiveStake" defaultValue={2937000000000} filter="humanReadable"/>__. :polkadot }}
{{ kusama: It is currently __<RPC network="kusama" path="query.staking.minNominatorBond" defaultValue={100000000000} filter="humanReadable"/>__. :kusama }}
If you have less {{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} than the minimum active
nomination and still want to participate in staking, you can join the nomination pools. You can now
stake on {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} natively with just
{{ polkadot: __<RPC network="polkadot" path="query.nominationPools.minJoinBond" filter="humanReadable" defaultValue={10000000000}/>__ :polkadot }}
{{ kusama: __<RPC network="kusama" path="query.nominationPools.minJoinBond" filter="humanReadable" defaultValue={1666666650}/>__ :kusama }}
in the nomination pools and earn staking rewards. For additional information, see
[this blog post](https://polkadot.network/blog/nomination-pools-are-live-stake-natively-with-just-1-dot/).
Check the wiki doc on [nomination pools](learn-nomination-pools.md) for more information.

:::

If you landed on this page, you decided to understand how you can be a good nominator. Note, this
page is not for [nomination pool](./learn-nomination-pools.md) members, although pool members might
gain essential knowledge about how to choose nomination pools.

The information provided on this page is complementary to that on the
[**Staking Page**](./learn-staking.md) and [**Advanced Staking Page**](./learn-staking-advanced.md).
Make sure you read those pages as well before nominating.

## Why Nominate?

- You become part of the {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} movement, a
  group of diverse professionals and enthusiasts around the world aspiring to build and foster the
  next-gen Internet, Web3: a decentralized, privacy-focused, and trustless internet.
- You are an essential piece of the puzzle, keeping
  {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} secure. The bonded balance can be
  used to vote in [Polkadot OpenGov](./learn-polkadot-opengov.md) and shape the future direction of
  {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}.
- You will start to understand how {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}
  works at a technical-level. When you feel comfortable with your nomination skills and knowledge,
  you can open your [nomination pool](./learn-nomination-pools.md), help others secure the network
  and earn rewards, and build your reputation as a trusted nomination pool operator. If you like to
  be more involved, the next step is to become a [validator](./learn-validator.md).
- By getting [staking](./learn-staking.md) rewards you keep up with or (likely) stay ahead of
  {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} inflation.

Nominators secure the Relay Chain by staking {{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }}
and nominating validators. You may have an account with
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} and want to earn fresh
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }}. You could do so as a validator, which
requires experience setting up a node and running and maintaining it 24/7.

On {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} you can also earn
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} by nominating one or more validators. Doing
so makes you a nominator for the validator(s) you chose. Pick your validators carefully - if they do
not behave properly, they will get slashed, and you will lose
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }}. However, if they follow the network rules,
you can share the staking rewards they generate.

While your {{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} are staked for nominations, they
are 'locked' (bonded). You can
[stop nominating at any time](../maintain/maintain-guides-how-to-nominate-polkadot.md), but remember
that the action is effective in the next era and does not automatically unbond your funds. Unbonding
is a separate action, and it takes effect after the unbonding period, which is
{{ polkadot: 28-day long on Polkadot :polkadot }}{{ kusama: 7-day long on Kusama :kusama }}. This is
calculated by taking the **bonding duration** (in eras), multiplying it by the **length of a single
era** (in hours), and dividing by the **hours in a day** (24). Example:
({{ polkadot: 28 × 24 ÷ 24 = 28 days :polkadot }}{{ kusama: 28 × 6 ÷ 24 = 7 days :kusama }}). A
staking lock will be visible on the Polkadot-JS UI during the unbonding period, and after it, the
staking lock can be unlocked, and the bonded funds become free balance you can transfer.

:::info Fast Unstaking feature is live!

If you accidentally bonded your {{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} or your
bonded {{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} never backed any active validator, you
can now unbond them immediately.

:::

If your bonded balance did not back any validators in the last
{{ polkadot: 28 days on Polkadot (when the feature goes live) :polkadot }}{{ kusama: 7 days on Kusama :kusama }},
you are eligible to perform fast unstaking. The
[staking dashboard](https://staking.polkadot.network/#/overview) will automatically check if you
qualify. For more information, visit the
["Fast Unstake" section in this support article](https://support.polkadot.network/support/solutions/articles/65000169433-can-i-transfer-dot-without-unbonding-and-waiting-28-days-).

## Setting-up Accounts

### Stash & Staking Proxy

The first thing you need to do before becoming a nominator is to make sure you have a
[**stash account**](./learn-staking.md/#stash-account-and-staking-proxy) where you can transfer
funds you want to use for staking. For these accounts, it is recommended to use a "cold wallet"
solution such as [Ledger](../general/ledger.md) or [Polkadot Vault](../general/polkadot-vault.md).

After setting up the stash account, it is recommended to have a
[**staking proxy**](./learn-staking-advanced.md/#staking-proxies). Although you can be a nominator
with just a stash account, having a staking proxy is good practice for security reasons.

A staking proxy of the stash will be able to sign for all staking-related transactions as well. The
stash will be fully isolated (except if the user decides to change the staking proxy of the stash or
to attach different proxies to the stash).

### Rewards Payout Account

As a nominator, you will be asked to choose an account where rewards will be paid. You can select
one of the following options:

- back to staking: rewards are compounded to the bonded amount.
- to stash: rewards are sent to the stash account as a free balance.
- to another account: rewards are sent to a user-defined account (not stash).

:::info

Being a nominator is made simpler by using the
[**Staking Dashboard**](https://staking.polkadot.network/#/overview) that will guide you step by
step through specifying rewards destination and bonded amount, and nominating validators (more on
this below). Note that staking proxies are not currently supported on the dashboard.

:::

## Nominating with the Polkadot-JS UI

### Targets Page

There are many factors to consider when deciding which of your nominations. One helpful tool to
choose validators is the Staking [Targets](https://polkadot.js.org/apps/#/staking/targets) table in
the Polkadot-JS UI. This allows sorting validators using various metrics. Below are the relevant
metrics shown as an example, followed by a brief description of each.

| validator | payout   | nominators             | comm. | total stake | own stake | return |
| --------- | -------- | ---------------------- | ----- | ----------- | --------- | ------ |
| A         | recently | 1 (`active`) 4 (`all`) | 3%    | 1.6 MDOT    | 8500 DOT  | 17.8%  |

- **payout**: How recently the validator made its last reward payout to nominators.
- **nominators**: This column consists of two number values. The **active** count (left number) is
  the number of nominators whose stake is baking the validator in the current era. In this case
  Validator A has one active nominator. The total or **all** count (right number) is the number of
  all nominators who nominated Validator A. This includes the active count and all the other
  nominators whose stake in the current era is baking other validators.

  Be cautious of validators with a high number of subscribers. A validator is considered
  oversubscribed when more than
  {{ polkadot: <RPC network="polkadot" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/> :polkadot }}
  {{ kusama: <RPC network="kusama" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/> :kusama }}
  active nominators are assigned to the validator. In this scenario, only the top
  {{ polkadot: <RPC network="polkadot" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/> :polkadot }}
  {{ kusama: <RPC network="kusama" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/> :kusama }}
  nominators (sorted by stake) will receive rewards. The remaining nominators will not be rewarded.
  However, they can be slashed if the validator commits a slashable offense.

  Every nominator can select up to a maximum of
  {{ polkadot: <RPC network="polkadot" path="consts.staking.maxNominations" defaultValue={16}/> :polkadot }}
  {{ kusama: <RPC network="kusama" path="consts.staking.maxNominations" defaultValue={24}/> :kusama }}
  validators, which contributes towards maximizing the probability of having the nominator’s stake
  applied to the validators active set. Nominating too few validators could result in the nominators
  not receiving their rewards when none of them make it to the active set or when those validators
  stop validating. The election algorithm attempts to maximize the overall network stake while
  minimizing the variance of the active stake across the validators. For additional information on
  the election process, check out the research behind
  [nominated proof-of-stake](https://research.web3.foundation/Polkadot/protocols/NPoS).

- **comm.**: Total commission kept by the validator (100% means the validator will keep all rewards
  , and thus nominators will not receive them). A validator's commission is the percentage of the
  validator reward taken by the validator before the rewards are split among the nominators. As a
  nominator, you may think that choosing validators with the lowest commission is best. However,
  validators must be able to run at break-even to continue operations sustainably. Independent
  validators that rely on the commission to cover their server costs help to keep the network
  decentralized. Some validators, operated by central exchanges, etc., keep 100% of the commission
  to payout their staking service clients and therefore do not provide any rewards to external
  nominators. The commission is just one piece of the puzzle you should consider when picking
  nominating validators.
- **total stake**: The total amount of {{ polkadot: DOT :polkadot }}{{ kusama: KSM :Kusama }} tokens
  staked by nominators and the validator (i.e. own stake, see below).
- **own stake**: The amount of {{ polkadot: DOT :polkadot }}{{ kusama: KSM :Kusama }} tokens the
  validator has put up as a stake. A higher own stake can be considered as having more "skin in the
  game". This can imply increased trustworthiness. However, a validator not having a large amount of
  "own stake" is not automatically untrustworthy, as the validator could nominate from a different
  address.
- **return**: Average annual yield paid out to nominators (i.e. number of rewards divided by the
  number of bonded tokens). Note that nominating those with a higher yield may not guarantee similar
  future performance.

![Staking Returns](../assets/nominators_target.png)

On the Targets page, you can use different filters to select validators with specific traits (where
a trait is a combination of the metrics above). Available filters are:

- **one validator per operator**: Do not show groups of validators run by a single operator. It
  shows small operators only who will likely have a higher commission and higher self-stake.
  Nominating only small operators might not always guarantee staking rewards, but it helps to keep
  the network more resilient to attacks.

:::info Validator vs Operator

A validator is the node, the physical equipment with installed software that allows to produce new
blocks and earn rewards. An operator is the entity responsible for setting up, running an
maintaining the node. An operator can have multiple validators under different sub-identities. For
example, `ZUG CAPITAL/07` is one of the numerous validators belonging to the operator Zug Capital.

:::

- **comm. < 20%**: Do not show any validators with a commission of 20% or higher.
- **with capacity**: Do not show any validators who are currently operating
  [at capacity](../general/glossary.md#capacity) (i.e., could potentially be oversubscribed).
- **recent payouts**: Only show validators that have recently caused a
  [payout to be issued](learn-staking-advanced.md). Note that anyone can cause a payout to occur; it
  does not have to be the operator of a validator.
- **currently elected**: Only show validators in the active set (i.e., they have been elected to
  produce blocks in the current era).
- **with an identity**: Only show validators that have set an [identity](learn-identity.md). Note
  that this identity does not have to be verified by a registrar for the validator to appear in the
  list.

:::warning Single Operators with Multiple Validators

Recall that slashing is an additive function; the more validators offline or equivocating in a given
session, the harsher the penalties. Since validators that are controlled by a single operator are
more at risk of a "synchronized" failure, nominating them implies a greater risk of having a large
slash of your nominated funds. Generally, it is safer to nominate validators whose behavior is
independent of others in many ways (different hardware, geographic location, owner, etc.).

:::

### Bags-list

:::info

On Polkadot and Kusama, the instance of the pallet
[Bags-List](https://paritytech.github.io/substrate/master/pallet_bags_list/) is named as
`voterList`.

:::

Nominating accounts are placed in a semi-sorted list called bags-list. This sorting functionality is
extremely important for the long-term improvements of the staking/election system. Bags-list allows
up to
{{ polkadot: <RPC network="polkadot" path="query.staking.maxNominatorsCount" defaultValue={50000}/> :polkadot }}
{{ kusama: <RPC network="kusama" path="query.staking.maxNominatorsCount" defaultValue={20000}/> :kusama }}
nominators to set their intention to nominate, of which the stake of the top
{{ polkadot: <RPC network="polkadot" path="consts.electionProviderMultiPhase.maxElectingVoters" defaultValue={22500}/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.electionProviderMultiPhase.maxElectingVoters" defaultValue={12500}/> :kusama }}
nominators is considered for [electing set](#staking-election-stages) that eventually determines the
active validators.

The nominator accounts in a bag are sorted based on their insertion order, not by their nomination
stake. The `voterList.putInFrontOf` extrinsic can be issued to move up in the bag, which might be
very useful for the accounts in the last bag eligible for receiving staking rewards. Balance changes
due to staking rewards or slashing do not automatically rebag the account. Whenever applicable,
Polkadot JS Apps UI prompts the nominator account to rebag or move up by calling the
`voterList.rebag` extrinsic.

For guidelines about how to rebag or move your account within a bag, see the followings:

- The "Bags List" Section on
  [this Support Page](https://support.polkadot.network/support/solutions/articles/65000181018-i-have-more-than-the-minimum-bonded-but-i-m-not-getting-rewards).
- The [Bags List Section](./learn-staking-advanced.md#bags-list) in Advanced Staking Concepts.
- The [dedicated technical explainer video](https://youtu.be/hIIZRJLrBZA).

### Validator Stats

Nominators can query [validator histories](https://polkadot.js.org/apps/#/staking/query/) to see
statistics such as era points, elected stake, rewards and slashes, and commission. It is good
practice to do comprehensive research on validator candidates. This could include (but should not be
limited to) checking the validators' [identity](learn-identity.md) (if they have set one) and going
over the validators' websites to see who they are, what kind of infrastructure setup they are using,
reputation, the vision behind the validator, and more.

Any problematic behavior must be taken seriously. An example of problematic behavior will be if a
validator is regularly offline. In this case, nominators most likely would get fewer rewards. If
many validators are [unreachable](learn-staking.md#unresponsiveness), such validators and
corresponding nominators will be slashed.

![Validator Stats](../assets/validator_stats.png)

## Nominating with the Staking Dashboard

The Staking Dashboard allows to choose pre-selected lists of validators based on user preference, or
to manually select validators similarly as in the Polkadot-JS UI.

Pre-selected choices are:

- Optimal Selection: Selects a mix of majority active and inactive validators.
- Active Low Commission: Gets a set of active validators with low commission.
- From Favorites: Gets a set of your favorite validators.

## Staking Election Stages

The staking election system has three stages for both validators and nominators, namely "intention",
"electable/electing", and "active".

- **intention to nominate:** an account that has stated the intention to nominate; also called
  simply a "nominator".
- **electing nominator:** a nominator who is selected to be a part of the input to the
  [NPoS election algorithm](learn-phragmen.md). This selection is based on stake and is made using
  the [bags-list](./learn-staking-advanced.md#bags-list).
- **active nominator:** a nominator who came out of the NPoS election algorithm backing an active
  validator. Staking rewards are received by the top
  {{ polkadot: <RPC network="polkadot" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/> :polkadot }}
  {{ kusama: <RPC network="kusama" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/> :kusama }}
  nominators ranked by stake. When slashing occurs, all the active nominators backing the validator
  get slashed (also those who do not receive rewards due to oversubscription issues).

![Nominator Election](../assets/staking/nominator-election.png)

### The Election Solution Set

Determining which validators are in the active set and which nominators are nominating them creates
a very large graph mapping nominators to their respective validators. This "solution set" is
computed off-chain and submitted to the chain, which means it must fit in a single block. If there
are a large number of nominators, this means that some nominators must be eliminated. Currently,
nominators are sorted by the amount of DOT staked, and those with more DOT are prioritized. This
means that you may not receive rewards if you are staking with a small amount of DOT. This minimal
amount is dynamic based on the number of validators, nominators, amount nominated, and other
factors.

## Receiving Rewards

As long as you have nominated more than one validator candidate, at least one of them got elected,
and you are nominating with enough stake to get into the solution set, your bonded stake will be
fully distributed to one or more validators. That being said, you may not receive rewards if you
nominated very few validator candidates and no one got elected, or your stake is small, and you only
selected oversubscribed validators, or the validator you are nominating has 100% commission. It is
generally wise to choose as many trustworthy validators as you can (up to
{{ polkadot: <RPC network="polkadot" path="consts.staking.maxNominations" defaultValue={16}/>) :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.staking.maxNominations" defaultValue={24}/>) :kusama }}
to reduce the risk of none of your nominated validators being elected.

:::info Not receiving Staking Rewards?

To explore the possible reasons for not receiving staking rewards, check out the followings:

- The
  [Staking FAQ](https://support.polkadot.network/support/solutions/articles/65000181959-staking-faq-s)
  on the Support Pages.
- The
  ["Why am I not receiving staking rewards?"](https://www.reddit.com/r/Polkadot/comments/10kurje/why_am_i_not_receiving_staking_rewards/)
  Reddit article.
- The ["Why am I not receiving staking rewards?"](./learn-staking.md#why-am-i-not-receiving-rewards)
  section on the Staking Page.

:::

Rewards are _lazy_ - somebody must trigger a payout for a validator for rewards to go to all of the
validator's nominators. Any account can do this, although validator operators often do this as a
service to their nominators. See the page on [Simple Payouts](learn-staking-advanced.md) for more
information and instructions for claiming rewards.

:::note Explainer videos on Nominating

These concepts have been further explained in the following videos:

- [Why Nominate on Polkadot & Kusama](https://www.youtube.com/watch?v=weG_uzdSs1E&list=PLOyWqupZ-WGuAuS00rK-pebTMAOxW41W8&index=4)
- [What to Consider when Nominating Validators on Polkadot and Kusama](https://www.youtube.com/watch?v=K-a4CgVchvU&list=PLOyWqupZ-WGuAuS00rK-pebTMAOxW41W8&index=9)
- [Nominating/Staking on Polkadot and Kusama](https://youtu.be/FCXC0CDhyS4)

:::

## Good Nominator Practices

### Required Minimum Stake

Due to the way the [Phragmen algorithm](learn-phragmen.md) generates the solution set and due to the
fact that the solution set must fit in a single block, a minimum number of DOT will be required to
nominate with to receive staking rewards can change between the eras.

- **min-intention-threshold:** minimum stake to declare the intention to nominate. This parameter
  can be updated via on-chain governance, and the most recent and up-to-date version can be found on
  [chain state](https://polkadot.js.org/apps/#/chainstate) (select **state query > staking >
  minimumNominatorBond**)

- **min-electing:** minimum stake among the electing nominators. Since this is almost always the
  same as “min-active”, it might not be reported.

- **min-active:** minimum stake among the active nominators. If your stake falls below this dynamic
  threshold in a given era, you will not receive staking rewards for that era.

Thus, for **nominator counters**, we have:

- count of nominator intentions and max possible nominator intentions
  {{ polkadot: (unlimited) :polkadot }}
  {{ kusama: (<RPC network="kusama" path="query.staking.maxNominatorsCount" defaultValue={20000}/>) :kusama }}
- count of electing nominators, and maximum possible electing nominators
  {{ polkadot: (<RPC network="polkadot" path="consts.electionProviderMultiPhase.maxElectingVoters" defaultValue={22500}/>) :polkadot }}
  {{ kusama: (<RPC network="kusama" path="consts.electionProviderMultiPhase.maxElectingVoters" defaultValue={12500}/>) :kusama }}
- count of active nominators and maximum possible active nominators
  {{ polkadot: (<RPC network="polkadot" path="consts.electionProviderMultiPhase.maxElectingVoters" defaultValue={22500}/>) :polkadot }}
  {{ kusama: (<RPC network="kusama" path="consts.electionProviderMultiPhase.maxElectingVoters" defaultValue={12500}/>) :kusama }}

### Avoiding Oversubscribed Validators

Validators can only pay out to a certain number of nominators per era. This is currently set to
{{ polkadot: <RPC network="polkadot" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/> :kusama }}
but can be modified via governance. If more than
{{ polkadot: <RPC network="polkadot" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/> :kusama }}
nominators nominate the same validator, it is "oversubscribed", and only the top
{{ polkadot: <RPC network="polkadot" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/> :kusama }}
staked nominators (ranked by the amount of stake) are paid rewards. Other nominators will receive no
rewards for that era, although their stake will still be used to calculate entry into the active
validator set.

Although it is difficult to determine how many nominators will nominate a given validator in the
next era, one can estimate based on the current number of nominators. A validator with only 5
nominators in this era, for instance, is unlikely to have more than
{{ polkadot: <RPC network="polkadot" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/> :kusama }}
in the next era. However, an already-oversubscribed validator with 1000 nominators this era is very
likely to be oversubscribed in the next era as well.

If you are not nominating with a large number of DOTs, you should try to avoid
[oversubscribed](../general/glossary.md#oversubscribed) validators. It is not always easy to
calculate if the validator selected will be oversubscribed in the next session; one way to avoid
choosing potentially oversubscribed validators is to filter out any that are
[at capacity](../general/glossary.md#capacity) on the Targets page.

Finally, if you have a minimal amount of DOTs close to the value of `minActiveNomination`, you may
need to stake more DOT to get into the election set. The nominator-to-validator mapping solution
needs to be evaluated within a single block duration, and if there are too many nominators, the
lowest-staked nominations will be dropped from even being considered to be part of the electing set.
This `minActiveNomination` value is dynamic and will vary over time. You can read the blog post
["Polkadot Staking: An Update"](https://polkadot.network/polkadot-staking-an-update/) for more
details.

### Active vs. Inactive Nomination

When you go to the [Account actions](https://polkadot.js.org/apps/#/staking/actions) under staking
page, you should see your bonded accounts and nomination status. If not, you can follow
[this](../maintain/maintain-guides-how-to-nominate-polkadot.md) guide to configure it first. Your
nominations will be effective in the next era; eras are roughly
{{ polkadot: 24 hours on Polkadot. :polkadot }}{{ kusama: 6 hours on Kusama. :kusama }}

![Nominations](../assets/staking/polkadotjs_nominator_account.png)

Suppose you have nominated five validator candidates, and three out of five were elected to the
active validator set; then you should see two of your nominations as "waiting", and most likely one
as "active" and the rest as "inactive". Active or inactive nomination means your nominated
validators have been elected to be in the validator set, whereas waiting means they did not get
elected. Generally, you will only have a single validator have an active nomination, which means
that you are directly supporting it with your stake this era and thus potentially receiving staking
rewards. Inactive nominators were validators elected for this era but which you are not actively
supporting. Every era, a new election will take place, and you may be assigned a different active
nomination from the validators you selected.

If you are committing a very large stake, you may have more than one active nomination. However, the
election algorithm attempts to minimize this situation, and it should not occur often, so you should
almost always see only a single active nomination per era. See the
[section on Phragmén optimization](learn-phragmen.md#optimizations) for more details.

### Minimum Active Nomination to Receive Staking Rewards

:::info Minimum DOT required to earn staking rewards

The minimum DOT required to submit intent to nominate is
{{ polkadot: __<RPC network="polkadot" path="query.staking.minNominatorBond" defaultValue={1000000000000} filter="humanReadable"/>__ :polkadot }}
, but the minimum active nomination required to earn staking rewards is dynamic and may be much
higher, which can be viewed on
[Polkadot JS Apps > Network > Staking > Targets page](https://polkadot.js.org/apps/#/staking/targets).

:::

![Minimum Active Nomination](../assets/staking/min-active-nomination.png)

## Guides

- [Be a Nominator (Polkadot)](../maintain/maintain-guides-how-to-nominate-polkadot.md) - Guide on
  nominating on the Kusama canary network.
- [Stop Being a Nominator (all networks)](../maintain/maintain-guides-how-to-nominate-polkadot.md) -
  Guide on stopping nominations and withdrawing tokens.



---
id: learn-parachains-faq
title: Parachains FAQ
sidebar_label: Parachains FAQ
description: Parachains FAQ.
keywords: [parachains, application-specific, sharding, faq]
slug: ../learn-parachains-faq
---

## General

### What is "parachain consensus"?

"Parachain consensus" is special in that it will follow the {{ polkadot: Polkadot :polkadot }}
{{ kusama: Kusama :kusama }} Relay Chain. Parachains cannot use other consensus algorithms that
provide their own finality. Only sovereign chains (that must bridge to the Relay Chain via a
parachain) can control their own consensus. Parachains have control over how blocks are authored and
by whom. {{ polkadot: Polkadot :polkadot }} {{ kusama: Kusama :kusama }} guarantees valid state
transitions. Executing a block finality outside the context of the relay chain is outside the scope
of trust that {{ polkadot: Polkadot :polkadot }} {{ kusama: Kusama :kusama }} provides.

### How about parachains that are not Substrate-based?

Substrate provides [FRAME Pallets](https://docs.substrate.io/main-docs/fundamentals/runtime-intro/)
as part of its framework to seamlessly build a rustic-based blockchain. Part of FRAME are pallets
that can be used for consensus. {{ polkadot: Polkadot :polkadot }} {{ kusama: Kusama :kusama }}
being a Substrate-based chain rely on BABE as the block production scheme and GRANDPA as the
finality gadget as part of its consensus mechanism. Collectively, this is a
[Hybrid Consensus Model](learn-consensus.md#hybrid-consensus), where block production and block
finality are separate. Parachains only need to produce blocks as they can rely on the relay chain to
validate the state transitions. Thus, parachains can have their own block production where the
[collators](learn-collator.md) act as the block producers, even if the parachain is not
Substrate-based.

### Is 100 a hard limit on the number of Parachains that can be supported?

No.{{ polkadot: Polkadot :polkadot }} {{ kusama: Kusama :kusama }} network went through a
significant number of optimizations, and there are
[several updates planned](https://polkadot.network/blog/polkadot-roadmap-roundup/) in the near
future. The exact number of parachains that the Relay Chain can support without any degradation in
performance is yet to be discovered. Also, with the
[blockspace over blockchains](https://www.rob.tech/polkadot-blockspace-over-blockchains/) paradigm
which brings parathreads into the picture, there is no hard limit number on the number of
blockchains that can be supported by {{ polkadot: Polkadot :polkadot }}
{{ kusama: Kusama :kusama }}.

### What happens to parachains when the number of validators drops below a certain threshold?

The minimal safe ratio of validators per parachain is 5:1. With a sufficiently large set of
validators, the randomness of their distribution along with
[availability and validity](./learn-parachains-protocol.md#anv-protocol) will make sure security is
on-par. However, should there be a big outage of a popular cloud provider or another network
connectivity catastrophe, it is reasonable to expect that the number of validators per chain will
drop.

Depending on how many validators went offline, the outcome differs.

If a few validators went offline, the parachains whose validator groups are too small to validate a
block will skip those blocks. Their block production speed will slow down to an increment of six
seconds until the situation is resolved and the optimal number of validators is in that parachain's
validator group again.

If anywhere from 30% to 50% of the validators go offline, availability will suffer because we need
two-thirds of the validator set to back the parachain candidates. In other words, all parachains
will stop until the situation is resolved. Finality will also stop, but low-value transactions on
the Relay Chain should be safe enough to execute, despite common forks. Once the required number of
validators are in the validator set again, parachains will resume block production.

Given that collators are full nodes of the Relay Chain and the parachain they are running, they will
be able to recognize a disruption as soon as it occurs and should stop producing block candidates.
Likewise, it should be easy for them to recognize when it's safe to restart block production -
perhaps based on finality delay, validator set size or some other factor that is yet to be decided
within [Cumulus](https://github.com/paritytech/cumulus).

### Parachain Development Kits (PDKs)

Parachain Development Kits are a set of tools that enable developers to create their own
applications as parachains. For more information, see the PDK
content](../build/build-parachains.md#parachain-development-kit-pdk) and
[Parachain Development page](../build/build-parachains.md).

## Security

### Is security correlated to the number of validators? What about the number of parachains?

Security is independent of the number of parachains that are connected to the Polkadot Relay Chain.
The correlation of security and the number of validators exists as the higher number of validators
will give the network stronger decentralization properties and make it harder to try to take down.
However, the biggest indicator of the security of the network is the economic signal of the number
of DOT that are bonded and staked. The greater the number of DOT staked by honest validators and
nominators, the higher the minimum amount of DOT an attacker would need to acquire a validator slot.

### In what scenarios do parachains need their own security?

Most parachains will not need to worry about their own security, since all state transitions will be
secured by the Polkadot Relay Chain validator set. However, in some cases (which are considered more
experimental), parachains may require their own security. In general, these cases will revolve
around lack of data available to Relay Chain validators.

One example is if the state transition function is some succinct or zero-knowledge proof, the
parachain would be responsible for keeping its data available as the Relay Chain won't have it.
Additionally, for chains with their own consensus, like the one that enables fast payments on
[Blink Network](https://www.youtube.com/watch?v=sf5GMDlG7Uk), there would probably need to be a
Byzantine agreement between stakers before a parachain block is valid. The agreement would be
necessary because the data associated with the fast consensus would be unknown to Relay Chain
validators.

## Slot Auctions

### How will parachain slots be distributed?

Parachain slots are acquirable through auction. For more information on the auction process, please
see the [parachain slot auctions](learn-auction.md) article. Additionally, some parachain slots will
be set aside to run [parathreads](learn-parathreads.md) &mdash; chains that bid on a per-block basis
to be included in the Relay Chain. (Parathreads are not implemented yet.)

### Why doesn't everyone bid for the max length?

For the duration of the slot, the tokens used for bidding in the auction are locked up. This
suggests there is an opportunity cost associated with bidding, as the tokens could have been
leveraged for something else.

### How does this mechanism help ensure parachain diversity?

The method for dividing the parachain slots into intervals was partly inspired by the desire to
allow for a greater amount of parachain diversity, while preventing particularly large and
well-funded parachains from hoarding slots. By making each period a
{{ polkadot: three-month duration but the
overall slot a 2-year duration :polkadot }}{{ kusama: 6-week duration but the overall slot a 1-year
duration :kusama }}, the mechanism can cope with well-funded parachains, ensuring they secure a slot
at the end of their lease, while gradually allowing other parachains to enter the ecosystem to
occupy the durations that are not filled. For example, if a large, well-funded parachain has already
acquired a slot for range 1 - 8, they would be very interested in getting the next slot that would
open for 2 - 9. Under this mechanism, that parachain could acquire just period 9 (since that is the
only one required) and allow the 2 - 8 range of the second parachain slot to be occupied by another
party.

### Why is randomness difficult on blockchains?

Generating a random number trustlessly on a transparent and open network opens up the possibility
for bad actors to attempt to alter or manipulate the randomness. There have been a few solutions
that have been proposed, including hash-onions like [RANDAO](https://github.com/randao/randao) and
[verifiable random functions](https://en.wikipedia.org/wiki/Verifiable_random_function) (VRFs). The
latter is what {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} uses as a base for its
randomness.

### Are there other ways of acquiring a slot besides the candle auction?

Aa parachain slot can also be acquired through a secondary market where a 3rd party has already won
a parachain slot and has the ability to resell the slot along with the associated deposit of tokens
that are locked up to another buyer. This would allow the seller to get liquid tokens in exchange
for the parachain slot and the buyer to acquire the slot as well as the deposited tokens.

A number of system or common-good parachains may be granted slots by the
[governing bodies](learn-governance.md) of the Relay Chain. System parachains can be recognized by a
parachain ID lower than 1_000, and common-good parachains by a parachain ID between 1_000 and 1_999.
Other parachains will have IDs 2_000 or higher. Such parachains would not have to bid for or renew
their slots as they would be considered essential to the ecosystem's future.

### How are auctions scheduled?

The parachain slot auctions are scheduled through the governance. At least 2/3 of the Council can
initiate an auction, however, Root origin (via referendum) is needed to cancel an auction. Here is a
proposal that gives a glimpse of what goes into planning auctions schedule -
[Proposed Polkadot Auction Schedule 2022](https://polkadot.polkassembly.io/post/863).



---
id: learn-parachains-protocol
title: Parachains' Protocol Overview
sidebar_label: Protocol Overview
description: Actors and Protocols involved in Polkadot and its Parachains' Block Finality.
keywords:
  [
    parachains,
    application-specific,
    sharding,
    protocol,
    validator,
    collator,
    nominator,
    AnV,
    availability,
    validity,
  ]
slug: ../learn-parachains-protocol
---

:::info

This page is a summary of the
[Protocol Overview chapter in **The Polkadot Parachain Host Implementer's Guide**](https://paritytech.github.io/polkadot/book/protocol-overview.html)
and the
[Availability and Validity (AnV) chapter in **The Polkadot Protocol Specification**](https://spec.polkadot.network/chapter-anv).

:::

The Parachains' Protocol aims to carry a parachain's block from authoring to inclusion through a
process that can be carried out repeatedly and in parallel for each parachain connected to the Relay
Chain. The protocol allows the network to be efficiently sharded among parachains while maintaining
strong security guarantees. The Availability and Validity (AnV) Protocol describes the Parachain
Protocol from the perspective of availability and validity. on).

## Main Actors

### [Validators](../learn/learn-validator.md)

They are responsible for validating the proposed parachain's blocks by checking the
**Proof-of-Validity** (PoV) of the blocks and ensuring the PoV remains available for a designated
period. They have "skin in the game", meaning they have funds bonded on-chain that can be partially
or fully confiscated by the network in case of misbehavior.

### [Collators](../learn/learn-collator.md)

They create the PoV that validators know how to check. Creating PoV requires familiarity with
transaction format and block authoring rules of a specific parachain, as well as having access to
its full state.

### Fishermen: Deprecated

Fishermen are not available on {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} and
are not planned for formal implementation, despite previous proposals in the
[AnV protocol](./learn-parachains-protocol.md#availability-and-validity-anv-protocol).

The idea behind Fishermen is that they are full nodes of parachains, like collators, but perform a
different role in relation to the {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}
network. Instead of packaging the state transitions and producing the next parachain blocks as
collators do, fishermen will watch this process and ensure no invalid state transitions are
included.

To address the motivation behind the Fishermen design consideration, the current
[secondary backing checkers](#assignments--secondary-checks) perform a similar role in relation to
the {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} network. From a security
standpoint, security is based on having at least one honest validator either among parachain
validators or secondary checker (more about this later on).

## Protocols' Summary

### Parachain Protocol

The parachain protocol is divided into two main phases:

- [**Inclusion Pipeline**](#inclusion-pipeline): Collators send parachain blocks (parablocks) with
  PoV to Validators. Validators verify if the parablocks follow the state transition rules of the
  parachain and sign statements that can have a positive or negative outcome. With enough positive
  statements, the block is **backed** and **included** in the Relay Chain, but is still pending
  approval.
- [**Approval Process**](#approval-process): Validators perform additional checks that, if positive,
  allow the parablock to be **approved**.

The figure below shows a representation of a parachain with collators and validators. The figure
also shows the journey of a parachain block (white square) through the Inclusion Pipeline and the
Approval Process.

![parachain-protocol-summary](../assets/parachain-protocol-summary.png)

### Availability and Validity (AnV) Protocol

The Availability and Validity (AnV) Protocol is a way of looking at the Parachain Protocol from
another perspective, emphasizing the importance of a parablock being available and valid before
being included in the finalized Relay Chain. It is divided into five different phases, three within
the [Inclusion Pipeline](#inclusion-pipeline) and two within the
[Approval Process](#approval-process):

- **Inclusion Pipeline**
  1.  [Parachain phase](#parachain-phase)
  2.  [Relay Chain submission phase](#relay-chain-submission-phase)
  3.  [Availability and unavailability phase](#availability-and-unavailability-phase)
- **Approval Process**
  1.  [Assignments and secondary (validity) checks](#assignments--secondary-checks)
  2.  [Chain Selection](#chain-selection)

In the Inclusion Pipeline, a parablock is made available (or unavailable), while in the Approval
Process a parablock is checked if it is valid or not.

## Inclusion Pipeline

### Overview

The inclusion pipeline is the path of a parachain block (or parablock) from its creation to its
inclusion into the non-finalized Relay Chain (i.e. in a fork of the Relay Chain).

![parachain-inclusion-pipeline](../assets/parachain-inclusion-pipeline.png)

The figure above shows the path of a candidate block through the Inclusion pipeline. The block
changes its status through this path as follows:

- Candidate: A block with its PoV is put forward by a collator to a para-validator (in this case
  V1). The candidate block is shown as a white square with one white tick mark at the side (PoV from
  the collator). Note the candidate is not valid yet and can still fail to be included in the Relay
  Chain.
- Seconded: The block is put forward by the para-validator V1 to other para-validators (in this case
  V2 and V3). The seconded block is shown as a white square with a white tick mark and a yellow tick
  mark on top of it. The yellow mark show the PoV from para-validator V1.
- Backable: The block validity is attested by a majority of the para-validators. The backable block
  is shown as white square with a white tick mark and three yellow tick marks on top of it. The
  yellow marks show the PoV from the para-validators, while the white mark the PoV from the
  collator.
- Backed: The block is backed and noted in a fork on the Relay Chain by a relay chain block author
  (in this case V4). The backed block is shown as a square with white background and yellow border
  enclosing a "B". The backed block can still fail to be included in the Relay Chain. Note that for
  simplicity here the backed parachain block is represented within the Relay Chain block, but in
  reality a relay chain block does not contain the parablocks themselves (more about this later).
- Pending availability: The block is backed but not considered available yet.
- Included: The block is backed and considered available (we have a parablock). Included parablocks
  are shown as square with white background and yellow border enclosing an "I".

:::info Asynchronous Backing

Parablocks' backing and inclusion take 12 seconds to be recorded on the relay chain, i.e. backing
happens in one relay chain block (6 seconds) and inclusion in another relay chain block (additional
6 seconds, see Figure above). With [**asynchronous backing**](./learn-async-backing.md), backing and
inclusion can be recorded in just one relay chain block.

:::

### Parachain Phase

In the parachain phase, some validators are assigned to parachains by the **Validator Assignment
Routine** (these validators are called para-validators). Para-validators establish a connection with
collators, which propose candidate blocks together with Proof-of-Validity (PoV) to para-validators
via the **Collator Distribution Subsystem**.

Para-validators participate in the **Candidate Backing Subsystem**. A para-validator needs to check
if the candidate block follows the
[state transition](../learn/learn-parachains.md#state-transitions) rules of the parachain. Because
states are stored within Merke trees, a para-validator can verify state transitions without having
access to the entire state, but it needs:

- The block candidate (list of state transitions)
- The values in the parachain's database that the block modifies
- The hashes of the unaffected points in the Merke tree

This set of information is the proof-of-validity (PoV).

Once a para-validator has the PoV, it gossips this information to the other para-validators, who
check the candidate block against the PoV. Candidates that gather more than half of signed validity
statements are considered **backable** (i.e. they _seem_ to represent a valid state transition), and
their backing is the set of signed statements. The para-validators can then start to construct the
[**candidate receipt**](#candidate-receipts) (this is what goes into the Relay Chain block) and an
[**erasure coding**](#erasure-codes) (this is what will make the parablock available, more on this
later on) that will be sent to all validators in the network.

:::info Polkadot guarantees valid state transitions, not valid states

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} validators do not inspect every value
in a parachain's state, only those that are modified. This insures that the modification is valid.

:::

Previously, we said that backable blocks _seem_ to represent valid state transitions because
para-validators are a small subset of all validators. Thus, it is possible to have the majority of
them dishonest. Later on, we will see that more validators with come in to help to make sure the
parablock is fully valid.

### Relay Chain Submission Phase

The [receipt](#candidate-receipts) of the backable parablock is added to the Relay Chain transaction
queue together with other receipts from other parachains. Receipts are gossiped around, and when a
relay chain block author wins [BABE](./learn-consensus.md#block-production-babe) slot leadership, it
will select a candidate receipt to include in a block on a fork of the Relay Chain.

A block author can note up to 1 backable candidate for each parachain to be included in the Relay
Chain block alongside its backing. Once included in a fork of the Relay Chain the candidate is
considered **backed** in that fork. The candidate is considered to be in **"pending availability"**
status, and it can only be considered a part of the parachain once proven available. Remember, at
this stage validators of the Relay Chain already received the
[erasure coding information](#erasure-codes) of that specific parablock.

### Availability and Unavailability Phase

During the availability and unavailability phases, the validators will participate to **Availability
Distribution Subsystem** to ensure availability of the candidate. They gossip the
[erasure coded](#erasure-codes) pieces among the network. At least 1/3 + 1 validators must report
that they possess their piece of the code word. Once this threshold of validators has been reached,
the network can consider the candidate block available. The block is graduated to being a full
parachain block, and its header will be included in that fork of the Relay Chain. The information
about the candidate availability is noted in the subsequent relay chain blocks of that fork.

The availability check by the block author ensures that
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} will only include blocks for which
the validators distributed their erasure-coded chunks, but it does not guarantee their validity.
Because the number of para-validators on each parachain is so low, collusion is a reasonable
concern. By separating block production ([BABE](./learn-consensus.md#block-production-babe)) from
finality ([GRANDPA](./learn-consensus.md/#finality-gadget-grandpa)),
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} can perform extra validity checks
after a block is produced but before it is finalized.

Thus, once the parablock is considered available and part of the parachain, it is still "pending
approval". The Inclusion Pipeline must conclude for a specific parachain before a new block can be
accepted on that parachain. After inclusion, the [Approval Process](#approval-process) starts and it
makes sure the block is valid, and it can run for many parachain blocks at once.

### Failure to Inclusion

The candidate can fail to be included in the parachain in any of the following ways:

- The collator cannot propagate the block to any of the assigned validators.
- The candidate is not backed by validators participating in the Candidate Backing subsystem.
- A relay chain block author does not select the candidate.
- The candidate's PoV is not considered available within a timeout, and the block is discarded from
  the Relay Chain.

Signed negative statements will lead to a [dispute](#disputes), and if there are false negatives,
whoever will be on the wrong side (once the dispute is resolved) will be slashed. False positives
can also happen; those actors responsible for it will also be slashed. To detect false positives,
PoV information must be available after the block has been added to the Relay Chain so that
validators can check the work. However, as a part of the data
[availability scheme](#availability-and-unavailability-phase), they are made available on the
network for a certain period so that the validators can perform the required checks.

## Approval Process

### Overview

Once the parablock is considered available and part of the parachain, it is still "pending
approval". At this stage, the parablock is tentatively included in the parachain, although more
confirmation is necessary. The validators assigned to the parachain (i.e. the parachain validators)
are sampled from a validator set assumed to be 1/3 dishonest in the worst-case scenario. In this
case, it is likely that the majority of the random para-validators sampled for a specific parachain
are dishonest and can back a candidate wrongly. To address this, the **Approval Process** allows
detecting misbehavior after the fact without allocating more para-validators, which would ultimately
reduce the system's throughput. As a parablock can accept children blocks after being considered
available, failure to pass the approval process will invalidate the parablock and its descendants
(children blocks). Only the validators who backed the block in question will be slashed, not those
who backed the descendants.

The approval pipeline can be divided into the following steps:

1. Parablocks included by the Inclusion Pipeline are pending approval for a time window known as the
   **secondary checking window**.
2. During the secondary checking window, validators (secondary checkers) randomly self-select based
   on a [VRF](./learn-cryptography#vrf) lottery to perform secondary checks on each of the
   parablock.
3. Secondary checkers acquire the parablock with PoV (erasure codings are necessary to reconstruct
   PoV) and re-run the validation function.
4. Secondary checkers gossip about the results of their checks. Contradictory results lead to an
   escalation in which all validators must check the block. The validators on the losing side will
   be slashed.
5. At the end of the process the parablock is either approved or rejected.

The figure below shows the path of a parachain block when it exits the Inclusion Pipeline, and
enters the Approval Process. The parablock becomes accepted when it is backed, available and
**undisputed**. The parablock is checked a second time by a subset of validators (V5, V6 and V7),
and if there are no contradictory results the block is approved and gossiped to other relay chain
validators. Note the parablock after secondary checks is shown as a square with a white background a
yellow border enclosing an "I" (stands for _included_), and three white ticks (one for each
secondary check). Approved para-blocks are shown as yellow squares.

![parachain-approval-process](../assets/parachain-approval-process.png)

### Assignments & Secondary Checks

Having a bad parablock on a fork of the relay chain is not catastrophic as long as the block is not
approved and finalized by the finality gadget
[GRANDPA](./learn-consensus.md/#finality-gadget-grandpa). If the block is not finalized, the fork on
the chain containing that block can be ignored in favor of another fork containing good blocks.
Dealing with a bad parablock includes the following stages:

- Detection: the bad block must be detected by honest validators.
- Escalation: the honest validators must start a [dispute](#disputes).
- Consequences: all involved malicious validators are slashed.

The result of the dispute must be transplantable to all other forks so that malicious validators are
slashed in all possible histories and so that honest validators will ignore any forks containing
that parablock.

:::info Parablocks vs. Relay Chain Blocks

It is important to understand that a relay chain block does not contain parablocks, but
para-headers. Parachain blocks are within the parachain. Thus, it makes more sense to think of
relay-chain blocks as having been approved instead of parablocks that have been approved. A
relay-chain block containing information about approved parablocks can be considered approved as
long as its parent relay-chain block is also approved. Thus, the validity of a relay-chain block
depends on the validity of its ancestry.

:::

Validators perform two main actions in the Approval Process:

- **[Assignments](https://paritytech.github.io/polkadot/book/protocol-approval.html#assignments)**
  determine which validators perform approval checks on which candidates, ensuring each candidate
  receives enough random checkers. This stage tracks approval votes to identify when
  [no-show](https://paritytech.github.io/polkadot/book/protocol-approval.html#no-shows) approval
  checks take suspiciously long. It also tracks relay chain
  [equivocations](../maintain/maintain-guides-best-practices-to-avoid-slashes.md/#equivocation) to
  determine when adversaries possibly gained foreknowledge about assignments and add more checks in
  those cases. Assignees determine their own assignments to check specific candidates using two or
  three
  [assignment criteria](https://paritytech.github.io/polkadot/book/protocol-approval.html#assignment-criteria),
  which are based on two possible
  [stories](https://paritytech.github.io/polkadot/book/protocol-approval.html#stories) about the
  relay chain block that included the candidate (i.e. declared the candidate available).
  [Assignment notices](https://paritytech.github.io/polkadot/book/protocol-approval.html#announcements--notices)
  are gossiped among nodes so that all validators know which validators should check which
  candidates, and if any candidate requires more checkers.
- **Approval checks** perform the checks by obtaining the candidate, verifying its validity, sending
  out the approval vote, or initiating a dispute. Approval checks have a no-show timeout window
  (i.e. longer than one relay chain slot) to succeed in reconstructing the candidate block, redo its
  erasure coding to check the candidate receipt, and recheck the candidate block itself. A validator
  becomes tagged as a no-show if it does not approve or dispute within the no-show timeout window.
  Because validators can be overloaded with assignments, they can intentionally delay sending their
  assignment notice to avoid creating no-shows (see more in
  [Assignment postponement](https://paritytech.github.io/polkadot/book/protocol-approval.html#assignment-postponement)).

These two steps first run as off-chain consensus protocols using messages gossiped among all
validators, and then as on-chain record of those protocols' progress. The on-chain protocol is
needed to provide rewards for the off-chain protocol. The
[on-chain verification](https://paritytech.github.io/polkadot/book/protocol-approval.html#on-chain-verification)
has two phases: a) assignments notices and approval votes are recorded in a relay chain block, and
b) in another relay chain block notes are fed into the approval code.

The gossiped messages are of two types, assignment notices, and approval votes, and are singed with
[approval keys](https://paritytech.github.io/polkadot/book/protocol-approval.html#approval-keys).
Such keys are part of the [session keys](./learn-cryptography.md/#session-keys) used by validators.
Briefly, approval keys are:

- **Approval assignment keys** that are sr25519 keys used only for assignment criteria
  [VRF](./learn-cryptography.md#vrf).
- **Approval vote keys** that are ed25519 and would only sign off on a candidate parablock validity.

:::info

For detailed information about the approval process, see dedicated section in
[The Polkadot Parachain Host Implementers' Guide](https://paritytech.github.io/polkadot/book/protocol-approval.html).

:::

Accepting a parablock is the result of having passed through the detection stage without dispute, or
having passed through and escalation/dispute stage with a positive outcome.

### Chain Selection

After enough secondary checks have been performed on all candidate receipts within a block,
validators can vote for that block (and all previous blocks) in GRANDPA. Once the block has more
than 2/3 of positive votes, the block is finalized on chain.

Chain selection is used to select blocks to build on and finalize. These processes need to
consistent among nodes and resilient to a maximum proportion of malicious nodes. The parachain host
uses a block authoring system and a finality gadget. The chain selection strategy involves a
_[leaf-selection rule](https://paritytech.github.io/polkadot/book/protocol-chain-selection.html)_
and a set of
_[finality constraints](https://paritytech.github.io/polkadot/book/protocol-chain-selection.html#the-best-chain-containing-rule)_.

:::info

For detailed information about chain selection, see dedicated section in
[The Polkadot Parachain Host Implementers' Guide](https://paritytech.github.io/polkadot/book/protocol-chain-selection.html).

:::

## Candidate Receipts

PoV are typically between 1 MB and 10 MB in size and are not included in the Relay Chain blocks. For
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} to scale to hundreds of parachains,
PoV need to be represented by something smaller on the Relay Chain: candidate receipts. A
para-validator constructs a candidate receipt for a parachain block by signing:

- The parachain ID.
- The collator's ID and signature.
- A hash of the parent block's candidate receipt.
- A Merkle root of the block's erasure-coded pieces.
- A Merkle root of any outgoing messages.
- A hash of the block.
- The state root of the parachain before block execution.
- The state root of the parachain after block execution.

This information is of constant size, while the actual PoV block of the parachain can be variable
length. It is enough information for anyone that obtains the full PoV block to verify the state
transition contained inside of it.

## Erasure Codes

Before sending the candidate receipt to the Relay Chain transaction queue, the para-validator who
constructs the receipt must also construct an erasure coding of the parachain block.

An erasure coding takes a message (in this case, the parachain block and PoV) and creates a set of
smaller messages such that you can reconstruct the original message by obtaining a fraction of the
smaller messages. In the case of {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} the
total number of smaller messages is equal to the total number of validators and the fraction is 1/3.

The para-validator creates the erasure coding chunks, puts them into their Merkle tree, and sends
out each chunk (together with the candidate receipt) to a corresponding validator on the Relay
Chain. Validators who receive the receipts with an erasure coding chunk will include the receipt in
the Relay Chain queue, where an author can include it in a block.

The type of erasure codes used by {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}'s
availability scheme are
[Reed-Solomon](https://en.wikipedia.org/wiki/Reed%E2%80%93Solomon_error_correction) codes, which
already enjoy a battle-tested application in technology outside the blockchain industry. One example
is found in the compact disk industry. CDs use Reed-Solomon codes to correct any missing data due to
inconsistencies on the disk face such as dust particles or scratches.

In {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}, the erasure codes are used to
keep parachain state available to the system without requiring all validators to keep tabs on all
the parachains. Instead, validators share smaller pieces of the data and can later reconstruct the
entire data under the assumption that 1/3+1 of the validators can provide their pieces of the data.

:::note

The 1/3+1 threshold of validators that must be responsive to construct the full parachain state data
corresponds to {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}'s security assumption
about Byzantine nodes.

:::

## Disputes

All parachain blocks that are in the finalized relay chain should be valid. This does not apply to
backed blocks that are not included. To ensure nothing invalid ends up in the finalized relay chain,
there are approval checks (described above) and disputes. The latter ensures that each attempt to
include something invalid is caught and the offending validators are punished.

Disputes are _independent from a particular fork_, while backing and approval operate on particular
forks. The approval voting stops if an alternative fork (which might not contain the
currently-approved candidate) is finalized. The sole purpose of the approval process is to make sure
invalid blocks are not finalized. However, even though the danger is past and the offending
validators did not manage to get the invalid block approved, those validators need to get slashed
for the attempt.

A dispute stems from a disagreement between two or more validators. For this to happen, a bad actor
needs to distribute an invalid block to honest validators. Scenarios leading to a dispute can be one
of the followings (ordered from most to least important):

- A parablock included on a branch of the relay chain is bad
- A parablock backed on a branch of the relay chain is bad
- A parablock seconded, but not backed on any branch of the relay chain, is bad

Checking a parachain block requires three pieces of data: the parachain validator code, the
availability of data, and the candidate receipt. The validator code is available on-chain and
published ahead of time. Thus, a dispute process begins with the availability to ensure the
availability of the data. Such a process will conclude quickly if the data is already available,
otherwise, the initiator of the dispute must make it available.

Disputes have both off- and on-chain components. Slashing is handled on-chain, so votes by
validators on either side of the dispute must be placed on-chain. Moreover, a dispute on one branch
of the chain must be transposed to all active branches so that misbehavior can be punished in all
possible histories. There is, thus, a distinction between _local_ (the one we are looking at) and
_remote_ disputes relative to a particular branch of the relay chain.

Disputes can be divided into three different phases:

- [Dispute initiation](https://paritytech.github.io/polkadot/book/protocol-disputes.html#initiation):
  Disputes are initiated by any validator who finds their opinion on the validity of a parablock in
  opposition to another issued statement. The initiation begins off-chain by only nodes perceiving
  that a parablock is bad. The validator can be one of the para-validators (i.e. one of the backers)
  or one of the approval checkers. Note that if the dispute occurs during the backing phase, the
  initiator must make the data available while if the dispute occurs during the approval process the
  data is already available.
- [Dispute participation](https://paritytech.github.io/polkadot/book/protocol-disputes.html#dispute-participation):
  Once becoming aware of the dispute, all validators must participate.
- [Dispute conclusion](https://paritytech.github.io/polkadot/book/protocol-disputes.html#dispute-conclusion):
  Disputes conclude after a 2/3 supermajority is reached on either side. Disputes may also conclude
  after a timeout. This will only happen if the majority of validators are unable to vote for some
  reason.

The on-chain component of the dispute can be initiated by providing any two conflicting votes and it
also waits for a 2/3 supermajority on either side. The component also tracks which parablocks have
already been disputed so that the same parablock can be disputed only once on any branch of the
relay chain. Inclusion is halted for the parachain until the dispute resolves.

:::info

For detailed information about disputes, see dedicated section in
[The Polkadot Parachain Host Implementers' Guide](https://paritytech.github.io/polkadot/book/protocol-disputes.html).
In the Guide, there are also more details about
[disputes' flows](https://paritytech.github.io/polkadot/book/disputes-flow.html).

:::

## Network Asynchrony

We have mentioned how a relay chain block author must select the candidate and note it on the Relay
Chain (we say the block is backed). The relay chain block author is selected by
[BABE](./learn-consensus.md#block-production-babe), which is a forkful algorithm. This means that
different block authors are chosen at the same time, and they may not work on the same block parent
(i.e. the representations in the previous figures are simplistic). Also, the sets of validators and
parachains are not fixed, and the validators' assignments to parachains is also flexible.

We say that the network is **asynchronous** since there will be validators who have received a block
and other validators who did not. Thus, the network is variable, and it exists in multiple states.
In the figure below (_left_), Group 1 received block C while Group 2 did not due to network
asynchrony. Validators in Group 2 can build another block on top of B, called C'. Assume that
afterward, some validators become aware of both C and C' while others remain aware of one of them
(_right_). Validators in Group 3 must be aware of the network state in each head (C and C’), and
they may contribute to some or full extent on both. It is possible that due to network asynchrony,
two forks may grow in parallel for some time, but eventually, one fork will be chosen by the
finality gadget. In the absence of an adversarial network, it is unlikely that two forks will
coexist for some time as there will be validators aware of both chain heads.

![parachain-forks](../assets/parachain-forks.png)

## Further Resources

- [Path of a Parachain Block](https://polkadot.network/the-path-of-a-parachain-block/) - Article by
  Parity analyst Joe Petrowski expounds on the validity checks that a parachain block must pass in
  order to progress the parachain.
- [Availability and Validity](https://github.com/w3f/research/tree/85cd4adfccb7d435f21cd9fd249cd1b7f5167537/docs/papers/AnV) -
  Paper by the W3F Research Team that specifies the availability and validity protocol in detail.


---
id: learn-parachains
title: Parachains
sidebar_label: Introduction to Parachains
description: An Introduction to Polkadot's Parachains.
keywords: [parachains, application-specific, sharding]
slug: ../learn-parachains
---

:::info Testing on Rococo

For information on how to participate in the crowdloan and parachain auction testing on Rococo,
please see the
{{ polkadot: [Rococo Content](../build/build-parachains.md##testing-a-parachains:-rococo-testnet) :polkadot }}
{{ kusama: [Rococo Content](../build/build-parachains.md##testing-a-parachains:-rococo-testnet) :kusama }}
on the parachain development guide.

:::

## Definition of a Parachain

A parachain is an application-specific data structure that is globally coherent and can be validated
by the validators of the Relay Chain. They take their name from the concept of parallelized chains
that run parallel to the Relay Chain. Most commonly, a parachain will take the form of a blockchain,
but there is no specific need for them to be actual blockchains.

![One parachain](../assets/one-parachain.png)

Due to their parallel nature, they can parallelize transaction processing and achieve scalability of
the {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} protocol. They
[inherit the security](#shared-security) of the entire network and can communicate with other
parachains through the [XCM](learn-xcm.md) format.

Parachains are maintained by a network maintainer known as a [collator](learn-collator.md). The role
of the collator node is to maintain a full node of the parachain, retain all necessary information
about the parachain, and produce new block candidates to pass to the Relay Chain validators for
verification and inclusion in the shared state of
{{ polkadot: Polkadot. :polkadot }}{{ kusama: Kusama. :kusama }} The incentivization of a collator
node is an implementation detail of the parachain. They are not required to be staked on the Relay
Chain or own the native token unless stipulated by the parachain implementation.

### State Transitions

Like other blockchains, parachains are **deterministic state machines**. Each parachain has a
**state**, executes a batch of transactions grouped into a block, and achieves a new state. Joe
Petrowski provided in [this article](https://polkadot.network/blog/the-path-of-a-parachain-block/) a
good analogy of a state with a light switch that can be either on or off, which is one of the
simplest examples of how a state machine functions. Each parachain has its own state, and the Relay
Chain links all those states into one state, i.e. a state of states. A multi-chain network like
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} can be viewed like one computer's
state with many light switches where a **state transition function** is the logic to decide which
switches should be toggled. Parachains have their own transition rule, separate economies,
governance mechanisms, and users.

A parachain's state is stored in a [Merkle tree](https://en.wikipedia.org/wiki/Merkle_tree). Merkle
trees have the convenient property that if some values within the tree change, this will be
reflected in the Merkle root (in this case, the state root). One can verify the change by only
looking at the new values and the paths that are affected within the tree.

The {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} Host requires that the state
transitions performed on parachains be specified as a [Wasm](learn-wasm.md) executable. Proofs of
new state transitions that occur on a parachain must be validated against the registered state
transition function (STF) that is stored on the Relay Chain by the validators before
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} acknowledges a state transition has
occurred on a parachain. The key constraint regarding the logic of a parachain is that it must be
verifiable by the Relay Chain validators. Verification most commonly takes the form of a bundled
proof of a state transition known as a Proof-of-Verification (PoV) block, which is submitted for
checking to the validators from one or more parachain collators.

## Why Parachains?

Parachains are a solution to two fundamental problems in blockchains:

- **Scalability**: Having one blockchain for many purposes makes it difficult to scale as future
  implementations and upgrades will likely advantage some purposes and disadvantage others.
  Conversely, having different blockchains will allow them to implement features without affecting
  other chains.
- **Flexibility**: It is reasonable to state a blockchain will either be really good at solving one
  problem or not so good at trying to solve many problems. A blockchain specializing in solving a
  specific problem has more leverage toward itself and its users. Parachains are purpose-built
  blockchains are highly specialized and can take advantage of each other through cooperation.

### Shared Security

Shared security, sometimes referred as _pooled security_, is one of the unique value propositions
for chains considering becoming a [parachain](learn-parachains.md) and joining the
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} network. On a high level, shared
security means that all parachains that are connected to the
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} Relay Chain by leasing a parachain
slot will benefit from the economic security provided by the Relay Chain
[validators](learn-validator.md).

The notion of shared security is different from inter-chain protocols that build on an architecture
of bridges. For bridge protocols, each chain is considered sovereign and must maintain its own
validator set and economic security. One concern in these protocols is the point of scalability of
security. For example, one suggestion to scale blockchains is that of _scale by altcoins,_ which
suggests that transaction volumes will filter down to lower market cap altcoins as the bigger ones
fill their blocks. A major flaw in this idea is that the lower market cap coins will have less
economic security attached and be easier to attack. A real-life example of a 51% attack occurred
recently (
[Ethereum Classic attack on January 10, 2019](https://cointelegraph.com/news/ethereum-classic-51-attack-the-reality-of-proof-of-work)
), in which an unknown attacker double spent 219_500 ETC (~1.1 million USD). This was followed by
two more 51% attacks on ETC.

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} overcomes security scalability
concerns since it gravitates all the economic incentives to the Relay Chain and allows the
parachains to tap into stronger guarantees at genesis. Sovereign chains must expend much more effort
to grow the value of their coin so that it is sufficiently secure against well-funded attackers.

### PoW vs Parachain Model

Let's compare the standard sovereign security model that exists on current proof-of-work (PoW)
chains to that of the shared security of
{{ polkadot: Polkadot. :polkadot }}{{ kusama: Kusama. :kusama }} Chains secured by their security
models, like Bitcoin, Zcash, and their derivatives, must bootstrap their independent network of
miners and maintain a competitive portion of honest hashing power. Since mining is becoming a larger
industry that increasingly centralizes key players, it is becoming more real that a single actor may
control enough hash power to attack a chain.

This means that smaller chains that cannot maintain a secure amount of hash power on their networks
could potentially be attacked by a large mining cartel at the simple whim of redirecting its hash
power away from Bitcoin and toward a new and less secure chain.
[51% attacks are viable today](https://www.crypto51.app) with attacks having been reported on
Ethereum Classic (see above),
[Verge](https://coincentral.com/verge-suffers-51-attack-hard-forks-in-response/),
[Bitcoin Gold](https://bitcoingold.org/responding-to-attacks/), and other cryptocurrencies.

On {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}, this disparity between chain
security will not be present. When a parachain connects to
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}, the relay chain validators become
the securers of that parachain's state transitions. The parachain will only have the overhead of
running a few collator nodes to keep the validators informed with the latest state transitions and
proofs/witness. Validators will then check these for the parachains to which they are assigned. In
this way, new parachains instantly benefit from the overall security of
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} even if they have just been launched.

## Parachain Economies

Parachains may have their economies with their native tokens. Schemes such as Proof-of-Stake are
usually used to select the validator set to handle validation and finalization; parachains will not
be required to do either of those things. However, since
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} is not overly particular about what
the parachain can implement, it may be the choice of the parachain to implement a staking token, but
it's not generally necessary.

Collators may be incentivized through the inflation of a native parachain token. There may be other
ways to incentivize the collator nodes that do not involve inflating the native parachain token.

Transaction fees in a native parachain token can also be an implementation choice of parachains.
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} makes no hard and fast rules for how
the parachains decide on the original validity of transactions. For example, a parachain may be
implemented so that transactions must pay a minimum fee to collators to be valid. The Relay Chain
will enforce this validity. Similarly, a parachain could not include that in their implementation,
and {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} would still enforce its validity.

Parachains are not required to have their token. If they do, it is up to the parachain to make the
economic case for their token, not {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}.

## Parachain Hubs

While {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} enables crosschain
functionality amongst the parachains, it necessitates that there is some latency between the
dispatch of a message from one parachain until the destination parachain receives the message. In
the optimistic scenario, the latency for this message should be at least two blocks - one block for
the message to be dispatched and one block for the receiving parachain to process and produce a
block that acts upon the message. However, in some cases, we may see that the latency for messages
is higher if many messages are in queue to be processed or if no nodes are running both parachain
networks that can quickly gossip the message across the networks.

Due to the necessary latency in sending crosschain messages, some parachains plan to become _hubs_
for an entire industry. For example, a parachain project [Acala](https://acala.network) is planning
to become a hub for decentralized finance (DeFi) applications. Many DeFi applications take advantage
of a property known as _composability_ which means that functions of one application can be
synergistically composed with others to create new applications. One example of this includes flash
loans, which borrow funds to execute some on-chain logic as long as the loan is repaid at the end of
the transaction.

An issue with crosschain latency means that composability property weakens among parachains compared
to a single blockchain. **This implication is common to all sharded blockchain designs, including
Polkadot, Eth2.0, and others.** The solution to this is the introduction of parachain hubs, which
maintain the stronger property of single block composability.

## Parachain Slot Acquisition

There are several ways to allocate parachain slots on
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}:

- Governance granted parachains, or "system parachains"
- Auction granted parachains
- [Parathreads](./learn-parathreads.md)

[System parachains](#system-parachains) are allocated by
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}'s on-chain
[governance](learn-governance.md) and are part of the network's protocol, such as bridges to other
networks or chains. These typically do not have an economic model and help remove transactions from
the Relay Chain, allowing for more efficient parachain processing.

[Auction granted parachains](learn-auction.md) are granted in a permissionless auction. Parachain
teams can either bid with their own {{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} tokens,
or source them from the community using the [crowdloan functionality](learn-crowdloans.md).

[Parathreads](learn-parathreads.md) have the same API as parachains, but are scheduled for execution
on a pay-as-you-go basis with an auction for each block.

### Parachain Lease Expiration

When a parachain wins an auction, the tokens it bids get reserved until the lease's end. Reserved
balances are non-transferrable and cannot be used for staking. At the end of the lease, the tokens
are unreserved. Parachains that have not secured a new lease to extend their slot will automatically
become [parathreads](./learn-parathreads.md).

## System Parachains

System parachains are parachains that use execution cores allocated by the network's governance.
These chains remove transactions from the Relay Chain, allowing network validators to allocate
resources to validating parachains. System chains are Polkadot using its scaling technology to host
itself.

See the
[Polkadot blog article](https://polkadot.network/common-good-parachains-an-introduction-to-governance-allocated-parachain-slots/),
this
[Polkadot Forum thread](https://forum.polkadot.network/t/polkadot-protocol-and-common-good-parachains/866),
and the [system parachains](learn-system-chains.md) page for more information.

## Parachains' Use Cases

Note that we still have to see the true potential of parachains and what it is listed below are just
a few examples.

- **Encrypted Consortium Chains**: These are possibly private chains that do not leak any
  information to the public but still can be interacted with trustlessly due to the nature of the
  XCMP protocol.
- **High-Frequency Chains**: These chains can compute many transactions in a short amount of time by
  taking certain trade-offs or making optimizations.
- **Privacy Chains**: These chains do not leak any information to the public through novel
  cryptography.
- **Smart Contract Chains**: These chains can have additional logic implemented through the
  deployment of code known as _smart contracts_.

## Parachain Host

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} includes a blockchain called a relay
chain. A blockchain is a
[Directed Acyclic Graph](https://en.wikipedia.org/wiki/Directed_acyclic_graph) (DAG) of state
transitions, where every added block can be viewed as the head of the chain or fork with cumulative
state. All paths through the DAG terminate at the Genesis Block. A blockchain is a tree, as each
block can have only one parent.

A blockchain network is made of nodes that have a view of many forks of the chain and must decide
which fork to follow. To construct the parachain host we need to answer two categories of questions
addressed by two different components:

- What is the state transition function of the blockchain? This is handled by the **Runtime**, which
  defines the state transition logic of the chain. The Runtime logic is divided into:

  - **Modules** encapsulate particular behavior of the protocol and consist of:
    - Storage
    - Routines are invoked by entry points and other modules upon block initialization or closing.
      Routines can alter the storage of a module.
    - The entry point defines how new information is introduced to a module and can limit the origin
      from which they are called (user, root, parachain).
  - **API** provides means for the node-side behavior to extract meaningful information from the
    state of a single fork.

  :::info

  The Polkadot Parachain Host Implementers' Guide provides details about
  [Runtime Architecture](https://paritytech.github.io/polkadot/book/runtime/index.html) and
  [Runtime API](https://paritytech.github.io/polkadot/book/runtime-api/index.html).

  :::

- Knowing various forks of the blockchain, what behaviors should a node take? What information
  should a node extract from the state of which forks, and how should that information be used? This
  is handled by the **Node-side behavior**, which defines all activities a node undertakes given its
  view of the blockchain. The node-side behavior can be divided into two categories:

  - **Networking behaviors**, relate to how information is distributed between nodes but not how the
    information is used afterward.
  - **Core behaviors**, relate to internal work that a specific node does. Such behavior cares about
    that information is _distributed_ and _received_, but not how these two are achieved.

  These two categories often interact, but they can be heavily abstracted from each other. The
  node-side behavior is split into various **subsystems**, which perform a particular category of
  work. Subsystems can communicate with each other through an
  [Overseer](https://paritytech.github.io/polkadot/book/node/overseer.html) that prevents race
  conditions.

  :::info

  The Polkadot Parachain Host Implementers' Guide provides details about
  [node architecture](https://paritytech.github.io/polkadot/book/node/index.html) the main
  subsystems:

  - [Collator subsystem](https://paritytech.github.io/polkadot/book/node/collators/index.html)
  - [Backing subsystem](https://paritytech.github.io/polkadot/book/node/backing/index.html)
  - [Availability subsystem](https://paritytech.github.io/polkadot/book/node/availability/index.html)
  - [Approval subsystem](https://paritytech.github.io/polkadot/book/node/approval/index.html)
  - [Dispute subsystem](https://paritytech.github.io/polkadot/book/node/disputes/index.html)
  - [Utility subsystem](https://paritytech.github.io/polkadot/book/node/utility/index.html)

  :::

The Runtime and Node-side behavior are dependent on each other. The Runtime depends on Node-side
behavior to author blocks, and to include [extrinsics](./learn-extrinsics.md) which trigger the
correct entry points. The Node-side behavior relies on the Runtime APIs to extract information
necessary to determine which action to take.

## Resources

- [Polkadot: The Parachain](https://medium.com/polkadot-network/polkadot-the-parachain-3808040a769a) -
  Blog post by Polkadot co-founder Rob Habermeier who introduced parachains in 2017 as "a simpler
  form of blockchain, which attaches to the security provided by a Relay Chain rather than providing
  its own. The Relay Chain provides security to attached parachains, but also provides a guarantee
  of secure message-passing between them."
- [The Path of a Parachain Block](https://polkadot.network/the-path-of-a-parachain-block/) - A
  technical walk-through of how parachains interact with the Relay Chain.



---
id: learn-parathreads
title: Parathreads
sidebar_label: Parathreads
description: An Introductory Guide to Parathreads.
keywords: [parathreads, slots]
slug: ../learn-parathreads
---

Parathreads are an idea for parachains to temporarily participate (on a block by block basis) in
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} security without needing to lease a
dedicated parachain slot. This is done through economically sharing the scarce resource of a
_parachain slot_ among several competing resources (parathreads). Chains that otherwise would not be
able to acquire a full parachain slot or do not find it economically sensible to do so, are enabled
to participate in {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}'s shared security
&mdash; albeit with an associated fee per executed block. It also offers a graceful off-ramp to
parachains that no longer require a dedicated parachain slot, but would like to continue using the
Relay Chain.

## Origin

According to [this talk](https://v.douyu.com/show/a4Jj7llO5q47Dk01) in Chengdu, the origin of the
idea came from similar notions in the limited resource of memory on early personal computers of the
late '80s and '90s. Since computers have a limited amount of physical memory, when an application
needs more, the computer can create virtual memory by using _swap space_ on a hard disk. Swap space
allows the capacity of a computer's memory to expand and for more processes to run concurrently with
the trade-off that some processes will take longer to progress.

## How do Parathreads Operate?

A portion of the parachain slots on the Relay Chain will be designated as part of the parathread
pool. In other words, some parachain slots will have no parachain attached to them and rather will
be used as a space for which the winner(s) of the block-by-block parathread fee auction can have
their block candidate included.

Collators will offer a bid designated in {{ polkadot: DOT :polkadot }} {{ kusama: KSM :kusama }} for
inclusion of a parathread block candidate. The Relay Chain block author is able to select from these
bids to include a parathread block. The obvious incentive is for them to accept the block candidate
with the highest bid, which would bring them the most profit. The tokens from the parathread bids
will likely be split 80-20, meaning that 80% goes into
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} treasury and 20% goes to the block
author. This is the same split that applies also to transaction fees and, like many other parameters
in {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}, can be changed through a
governance mechanism.

## Parachain vs. Parathread

Parachains and parathreads are very similar from a development perspective. One can imagine that a
chain developed with Substrate can at different points in its lifetime assume one of three states:
an independent chain with secured bridge, a parachain, or a parathread. It can switch between these
last two states with relatively minimal effort since the difference is more of an economic
distinction than a technological one.

Parathreads have the exact same benefits for connecting to {{ polkadot: Polkadot :polkadot }}
{{ kusama: Kusama :kusama }} that a full parachain has. Namely, it is able to send messages to other
para-objects through [XCMP](learn-xcm.md###XCMP) and it is secured under the full economic security
of {{ polkadot: Polkadot :polkadot }} {{ kusama: Kusama :kusama }}'s validator set.

The difference between parachains and parathreads is economic. Parachains must be registered through
a normal means of {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}, i.e. governance
proposal or parachain slot auction. Parathreads have a fixed fee for registration that would
realistically be much lower than the cost of acquiring a parachain slot. Similar to how
{{ polkadot: DOT :polkadot }} {{ kusama: KSM :kusama }} are locked for the duration of parachain
slots and then returned to the winner of the auction, the deposit for a parathread will be returned
to the parathread after the conclusion of its term.

Registration of the parathread does not guarantee anything more than the registration of the
parathread code to the {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} Relay Chain.
When a parathread progresses by producing a new block, there is a fee that must be paid in order to
participate in a per-block auction for inclusion in the verification of the next Relay Chain block.
All parathreads that are registered are competing in this auction for their parathread to be
included for progression.

There are two interesting observations to make about parathreads. Since they compete on a per-block
basis, it is similar to how transactions are included in Bitcoin or Ethereum. A similar fee market
will likely develop, which means that busier times will drive the price of parathread inclusion up,
while times of low activity will require lower fees. Two, this mechanism is markedly different from
the parachain mechanism, which guarantees inclusion as long as a parachain slot is held; parathread
registration grants no such right to the parathread.

## Parathread Economics

There are two sources of compensation for collators:

1. Assuming a parathread has its own local token system, it pays the collators from the transaction
   fees in its local token. If the parathread does not implement a local token, or its local token
   has no value (e.g. it is used only for governance), then it can use {{ polkadot: DOT :polkadot }}
   {{ kusama: KSM :kusama }} to incentivize collators.
2. Parathread protocol subsidy. A parathread can mint new tokens in order to provide additional
   incentives for the collator. Probably, the amount of local tokens to mint for the parathread
   would be a function of time, the more time that passes between parathread blocks that are
   included in the Relay Chain, the more tokens the parathread is willing to subsidize in order to
   be considered for inclusion. The exact implementation of this minting process could be through
   local parathread inflation or via a stockpile of funds like a treasury.

Collators may be paid in local parathread currency. However, the Relay Chain transacts with the
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} native currency only. Collators must
then submit block candidates with an associated bid in {{ polkadot: DOT. :polkadot }}
{{ kusama: KSM. :kusama }}

## Parachain Slot Swaps

It will be possible for a parachain that holds a parachain slot to swap this slot with a parathread
so that the parathread "upgrades" to a full parachain and the parachain becomes a parathread. The
chain can also stop being a chain and continue as a thread without swapping the slot. The slot, if
unoccupied, would be auctioned off in the next [auction period](learn-auction.md).

This provides a graceful off-ramp for parachains that have reached the end of their lease and do not
have sufficient usage to justify renewal; they can remain registered on the Relay Chain but only
produce new blocks when they need to.

Parathreads help ease the sharp stop of the parachain slot term by allowing parachains that are
still doing something useful to produce blocks, even if it is no longer economically viable to rent
a parachain slot.

## Resources

- [Parathreads: Pay-as-you-go Parachains](https://medium.com/polkadot-network/parathreads-pay-as-you-go-parachains-7440d23dde06)


---
id: learn-phragmen
title: NPoS Election Algorithms
sidebar_label: NPoS Election Algorithms
description: The Election Methods used in Polkadot's NPoS Mechanism.
keywords: [phragmen, sequential phragmén method, elections, algorithm, phragmms]
slug: ../learn-phragmen
---

import RPC from "./../../components/RPC-Connection";

## NPoS Election Algorithms

Since validators are paid almost equally in
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} in each era, it is important that the
stake behind each validator is uniformly spread out. An election algorithm for Nominated Proof of
Staking (NPoS) on {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} will try to
optimize three metrics when computing a solution graph of nominators and validators:

1. Maximize the total amount at stake.
1. Maximize the stake behind the minimally staked validator.
1. Minimize the variance of the stake in the set.

:::note

[Sequential Phragmén](#understanding-phragmén), [Phragmms](#phragmms-fka-balphragmms) and
[Star balancing](https://crates.parity.io/sp_npos_elections/balancing/fn.balance.html) are a few
notable algorithms used for computing the NPoS solutions in Polkadot and Kusama.

:::

## What is the sequential Phragmén method?

The sequential Phragmén method is a multi-winner election method introduced by Edvard Phragmén in
the 1890s. The quote below taken from the reference [Phragmén paper](#external-resources) sums up
the purpose of the sequential Phragmén method:

:::note

The problem that Phragmén’s methods try to solve is that of electing a set of a given numbers of
persons from a larger set of candidates. Phragmén discussed this in the context of a parliamentary
election in a multi-member constituency; the same problem can, of course, also occur in local
elections, but also in many other situations such as electing a board or a committee in an
organization.

:::

### Validator Elections

The sequential Phragmén is one of the methods used in the Nominated Proof-of-Stake scheme to elect
validators based on their own self-stake and the stake that is voted to them from nominators. It
also tries to equalize the weights between the validators after each election round.

#### Off-Chain Phragmén

Given the large set of nominators and validators, Phragmén's method is a difficult optimization
problem. {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} uses off-chain workers to
compute the result off-chain and submit a transaction to propose the set of winners. The reason for
performing this computation off-chain is to keep a constant block time of six seconds and prevent
long block times at the end of each era, when the validator election takes place.

:::info Staking Miners

The process of computing the optimal solution for NPoS election can be delegated to
[Staking Miners](learn-staking-miner).

:::

### Council Elections

:::info Deprecated in Polkadot OpenGov

Phragmen was used for Council elections in [Governance v1](./learn-governance.md).

:::

The Phragmén method was also used in the council election mechanism. When you voted for council
members, you could select up to 16 different candidates and then place a reserved bond as the weight
of your vote. Phragmén would run once on every election to determine the top candidates to assume
council positions and then again amongst the top candidates to equalize the weight of the votes
behind them as much as possible.

## What does it mean for node operators?

Phragmén is something that will run in the background and requires no extra effort from you.
However, it is good to understand how it works since it means that not all the stake you've been
nominated will end up on your validator after an election. Nominators are likely to nominate a few
different validators that they trust to do a good job operating their nodes.

You can use
[this offline-phragmén](https://gist.github.com/tugytur/3531cc618bfbb42f1a6cfb44d9906197) tool for
predicting the outcome of a validator election ahead of a new election.

## Understanding Phragmén

This section explains the sequential Phragmén method in-depth and walks through examples.

### Basic Phragmén

### Rationale

In order to understand the Weighted Phragmén method, we must first understand the basic Phragmén
method. There must be some group of candidates, a group of seats they are vying for (which is less
than the size of the group of candidates), and some group of voters. The voters can cast an approval
vote - that is, they can signal approval for any subset of the candidates.

The subset should be a minimum size of one (i.e., one cannot vote for no candidates) and a maximum
size of one less than the number of candidates (i.e., one cannot vote for all candidates). Users are
allowed to vote for all or no candidates, but this will not have an effect on the final result, and
so votes of this nature are meaningless.

Note that in this example, all voters are assumed to have equal say (that is, their vote does not
count more or less than any other votes). The weighted case will be considered later. However,
weighting can be "simulated" by having multiple voters vote for the same slate of candidates. For
instance, five people voting for a particular candidate is mathematically the same as a single
person with weight `5` voting for that candidate.

The particular algorithm we call here the "Basic Phragmén" was first described by Brill _et al._ in
their paper
["Phragmén’s Voting Methods and Justified Representation"](https://ojs.aaai.org/index.php/AAAI/article/view/10598).

### Algorithm

The Phragmén method will iterate, selecting one seat at a time, according to the following rules:

1. Voters submit their ballots, marking which candidates they approve. Ballots will not be modified
   after submission.
2. An initial load of 0 is set for each ballot.
3. The candidate who wins the next available seat is the one where the ballots of their supporters
   would have the _least average (mean) cost_ if that candidate wins.
4. The _n_ ballots that approved that winning candidate get _1/n_ added to their load.
5. The load of all ballots that supported the winner of this round are averaged out so that they are
   equal.
6. If there are any more seats, go back to step 3. Otherwise, the selection ends.

### Example

Let's walk through an example with four candidates vying for three seats, and five voters.

```
Open Seats: 3

Candidates:   A B C D  L0
-------------------------
Voter V1:       X      0
Voter V2:         X X  0
Voter V3:       X   X  0
Voter V4:     X X      0
Voter V5:       X X X  0
```

In this example, we can see that voter `V1` approves only of candidate `B`, voter `V2` approves of
candidates `C` and `D`, etc. Voters can approve any number of candidates between 1 and
`number_of_candidates - 1`. An initial "load" of `0` is set for each ballot (`L0` = load after round
`0`, i.e., the "round" before the first round). We shall see shortly how this load is updated and
used to select candidates.

We will now run through an iterative algorithm, with each iteration corresponding to one "seat".
Since there are three seats, we will walk through three rounds.

For the first round, the winner is simply going to be the candidate with the most votes. Since all
loads are equal, the lowest average load will be the candidate with the highest n, since `1/n` will
get smaller as `n` increases. For this first example round, for instance, candidate `A` had only one
ballot vote for them. Thus, the average load for candidate A is `1/1`, or 1. Candidate C has two
ballots approving of them, so the average load is `1/2`. Candidate B has the lowest average load, at
`1/4` and they get the first seat. Ballots loads are now averaged out, although for the first
iteration, this will not have any effect.

```
Filled seats: 1 (B)
Open Seats: 2

Candidates:   A B C D  L0 L1
-----------------------------
Voter V1:       X      0  1/4
Voter V2:         X X  0  0
Voter V3:       X   X  0  1/4
Voter V4:     X X      0  1/4
Voter V5:       X X X  0  1/4
```

We are now down to candidates `A`, `C`, and `D` for two open seats. There is only one voter (`V4`)
for `A`, with load `1/4`. `C` has two voters, `V2` and `V5`, with loads of `0` and `1/4`. `D` has
three voters approving of them, `V2`, `V3`, and `V5`, with loads of `0`, `1/4`, and `1/4`,
respectively.

If Candidate `A` wins, the average load would be `(1/4 + 1/1) / 1`, or `5/4`. If candidate `C` wins,
the average load would be `((0 + 1/2) + (1/4 + 1/2)) / 2`, or `5/8`. If candidate `D` wins, the
average load would be `((0 + 1/3) + (1/4 + 1/3) + (1/4 + 1/3)) / 3`, or `1/2`. Since `1/2` is the
lowest average load, candidate D wins the second round.

Now everybody who voted for Candidate `D` has their load set to the average, `1/2` of all the loads.

```
Filled seats: 2 (B, D)
Open Seats: 1

Candidates:   A B C D  L0 L1  L2
---------------------------------
Voter V1:       X      0  1/4 1/4
Voter V2:         X X  0  0   1/2
Voter V3:       X   X  0  1/4 1/2
Voter V4:     X X      0  1/4 1/4
Voter V5:       X X X  0  1/4 1/2
```

There is now one seat open and two candidates, `A` and `C`. Voter `V4` is the only one voting for
`A`, so if `A` wins then the average load would be `(1/4 + 1/1) / 1`, or `5/4`. Voters `V2` and `V5`
(both with load `1/2`) support `C`, so if `C` wins the average load would be
`((1/2 + 1/2) + (1/2 + 1/2)) / 2`, or `1`. Since the average load would be lower with `C`, `C` wins
the final seat.

```
Filled seats: 3 (B, D, C)
Open Seats: 0

Candidates:   A B C D  L0 L1  L2  L3
------------------------------------
Voter V1:       X      0  1/4 1/4 1/4
Voter V2:         X X  0  0   1/2 1
Voter V3:       X   X  0  1/4 1/2 1/2
Voter V4:     X X      0  1/4 1/4 1/4
Voter V5:       X X X  0  1/4 1/2 1
```

An interesting characteristic of this calculation is that the total load of all voters will always
equal the number of seats filled in that round. In the zeroth round, load starts at `0` and there
are no seats filled. After the first round, the total of all loads is `1`, after the second round it
is `2`, etc.

### Weighted Phragmén

### Rationale

While this method works well if all voters have equal weight, this is not the case in
{{ polkadot: Polkadot. :polkadot }}{{ kusama: Kusama. :kusama }} Elections for both validators and
candidates for the {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} Council are
weighted by the number of tokens held by the voters. This makes elections more similar to a
corporate shareholder election than a traditional political election, where some members have more
pull than others. Someone with a single token will have much less voting power than someone
with 100. Although this may seem anti-democratic, in a pseudonymous system, it is trivial for
someone with 100 tokens to create 100 different accounts and spread their wealth to all of their
pseudonyms.

Therefore, not only do we want to allow voters to have their preferences expressed in the result,
but do so while keeping as equal a distribution of their stake as possible and express the wishes of
minorities as much as is possible. The Weighted Phragmén method allows us to reach these goals.

### Algorithm

Weighted Phragmén is similar to Basic Phragmén in that it selects candidates sequentially, one per
round, until the maximum number of candidates are elected. However, it has additional features to
also allocate weight (stake) behind the candidates.

_NOTE: in terms of validator selection, for the following algorithm, you can think of "voters" as
"nominators" and "candidates" as "validators"._

1. Candidates are elected, one per round, and added to the set of successful candidates (they have
   won a "seat"). This aspect of the algorithm is very similar to the "basic Phragmén" algorithm
   described above.
2. However, as candidates are elected, a weighted mapping is built, defining the weights of each
   selection of a validator by each nominator.

In more depth, the algorithm operates like so:

1. Create a list of all voters, their total amount of stake, and which validators they support.
2. Generate an initial edge-weighted graph mapping from voters to candidates, where each edge weight
   is the total _potential_ weight (stake) given by that voter. The sum of all potential weight for
   a given candidate is called their _approval stake_.
3. Now we start electing candidates. For the list of all candidates who have not been elected, get
   their score, which is equal to `1 / approval_stake`.
4. For each voter, update the score of each candidate they support by adding their total budget
   (stake) multiplied by the load of the voter and then dividing by that candidate's approval stake
   `(voter_budget * voter_load / candidate_approval_stake)`.
5. Determine the candidate with the lowest score and elect that candidate. Remove the elected
   candidate from the pool of potential candidates.
6. The load for each edge connecting to the winning candidate is updated, with the edge load set to
   the score of the candidate minus the voter's load, and the voter's load then set to the
   candidate's score.
7. If there are more candidates to elect, go to Step 3. Otherwise, continue to step 8.
8. Now the stake is distributed amongst each nominator who backed at least one elected candidate.
   The backing stake for each candidate is calculated by taking the budget of the voter and
   multiplying by the edge load then dividing by the candidate load
   (`voter_budget * edge_load / candidate_load`).

### Example

_Note: All numbers in this example are rounded off to three decimal places._

In the following example, there are five voters and five candidates vying for three potential seats.
Each voter `V1 - V5` has an amount of stake equal to their number (e.g., `V1` has stake of 1, `V2`
has stake of 2, etc.). Every voter is also going to have a _load,_ which initially starts at `0`.

```
Filled seats: 0
Open Seats: 3

Candidates:    A B C D E  L0
----------------------------
Voter V1 (1):  X X        0
Voter V2 (2):  X X        0
Voter V3 (3):  X          0
Voter V4 (4):    X X X    0
Voter V5 (5):  X     X    0
```

Let us now calculate the approval stake of each of the candidates. Recall that this is merely the
amount of all support for that candidate by all voters.

```
Candidate A: 1 + 2 + 3 + 5 = 11
Candidate B: 1 + 2 + 4 = 7
Candidate C: 4 = 4
Candidate D: 4 + 5 = 9
Candidate E: 0
```

The first step is easy - candidate `E` has 0 approval stake and can be ignored from here on out.
They will never be elected.

We can now calculate the initial scores of the candidates, which is `1 / approval_stake`:

```
Candidate A: 1 / 11 = 0.091
Candidate B: 1 / 7 = 0.143
Candidate C: 1 / 4 = 0.25
Candidate D: 1 / 9 = 0.111
Candidate E: N/A
```

For every edge, we are going to calculate the score, which is current score plus the total budget \*
the load of the voter divided by the approval stake of the candidate. However, since the load of
every voter starts at 0, and anything multiplied by 0 is 0, any addition will be `0 / x`, or 0. This
means that this step can be safely ignored for the initial round.

Thus, the best (lowest) score for Round 0 is Candidate A, with a score of `0.091`.

```
Candidates:    A B C D E  L0 L1
----------------------------------
Voter V1 (1):  X X        0  0.091
Voter V2 (2):  X X        0  0.091
Voter V3 (3):  X          0  0.091
Voter V4 (4):    X X X    0  0
Voter V5 (5):  X     X    0  0.091
```

```
Filled seats: 1 (A)
Open Seats: 2

Candidates:    A B C D E  L0
----------------------------
Voter V1 (1):  X X        0
Voter V2 (2):  X X        0
Voter V3 (3):  X          0
Voter V4 (4):    X X X    0
Voter V5 (5):  X     X    0
```

Candidate `A` is now safe; there is no way that they will lose their seat. Before moving on to the
next round, we need to update the scores on the edges of our graph for any candidates who have not
yet been elected.

We elided this detail in the previous round, since it made no difference to the final scores, but we
should go into depth here to see how scores are updated. We first must calculate the new loads of
the voters, and then calculate the new scores of the candidates.

Any voter who had one of their choices for candidate fill the seat in this round (i.e., voters `V1`,
`V2`, `V3`, and `V5`, who all voted for `A`) will have their load increased. This load increase will
blunt the impact of their vote in future rounds, and the edge (which will be used in determining
stake allocation later) is set to the score of the elected candidate minus the _current_ voter load.

```
edge_load = elected_candidate_score - voter_load
voter_load = elected_candidate_score
```

In this instance, the score of the elected candidate is `0.091` and the voter loads are all `0`. So
for each voter who voted for `A`, we will calculate a new edge load `Voter` -> `A` of:

```
Edge load: 0.091 - 0 = 0.091
```

and a new voter load of:

```
Voter load: 0.091
```

As a reminder, here are the current scores. Loads of the voters are all `0`.

```
Candidate B : 0.143
Candidate C : 0.25
Candidate D : 0.111
```

Now, we go through the weighted graph and update the score of the candidate and the load of the
edge, using the algorithm:

```
candidate_score = candidate_score + ((voter_budget * voter_load) / candidate_approval_stake)
```

Without walking through each step, this gives us the following modifications to the scores of the
different candidates.

```
V1 updates B to 0.156
V2 updates B to 0.182
V4 updates B to 0.182
V4 updates C to 0.25
V4 updates D to 0.111
V5 updates D to 0.162
```

After scores are updated, the final scores for the candidates for this round are:

```
Candidate B: 0.182
Candidate C: 0.25
Candidate D: 0.162
```

`D`, with the lowest score, is elected. You will note that even though candidate `B` had more voters
supporting them, candidate `D` won the election due to their lower score. This is directly due to
the fact that they had the lowest score, of course, but the root reason behind them having a lower
score was both the greater amount of stake behind them and that voters who did not get one of their
choices in an earlier round (in this example, voter V4) correspond to a higher likelihood of a
candidate being elected.

We then update the loads for the voters and edges as specified above for any voters who voted for
candidate `D` (viz., `V4` and `V5`) using the same formula as above.

```
Filled seats: 2 (A, D)
Open Seats: 1

Candidates:    A B C D E  L0 L1    L2
-----------------------------------
Voter V1 (1):  X X        0  0.091 0.091
Voter V2 (2):  X X        0  0.091 0.091
Voter V3 (3):  X          0  0.091 0.091
Voter V4 (4):    X X X    0  0     0.162
Voter V5 (5):  X     X    0  0.091 0.162
```

Following a similar process for Round 2, we start with initial candidate scores of:

```
Candidate B : 0.143
Candidate C : 0.25
```

We can then update the scores of the remaining two candidates according to the algorithm described
above.

```
V1 updates B to 0.156
V2 updates B to 0.182
V4 updates B to 0.274
V4 updates C to 0.412
```

With the lowest score of `0.274`, Candidate `B` claims the last open seat. Candidates `A`, `D`, and
`B` have been elected, and candidates `C` and `E` are not.

Before moving on, we must perform a final load adjustment for the voters and the graph.

```
Filled seats: 3 (A, D, B)
Open Seats: 0

Candidates:    A B C D E  L0 L1    L2    L3
------------------------------------------
Voter V1 (1):  X X        0  0.091 0.091 0.274
Voter V2 (2):  X X        0  0.091 0.091 0.274
Voter V3 (3):  X          0  0.091 0.091 0.091
Voter V4 (4):    X X X    0  0     0.162 0.274
Voter V5 (5):  X     X    0  0.091 0.162 0.162
```

Now we have to determine how much stake every voter should allocate to each candidate. This is done
by taking the load of the each edge and dividing it by the voter load, then multiplying by the total
budget of the voter.

In this example, the weighted graph ended up looking like this:

```
Nominator: V1
	Edge to A load= 0.091
	Edge to B load= 0.183
Nominator: V2
	Edge to A load= 0.091
	Edge to B load= 0.183
Nominator: V3
	Edge to A load= 0.091
Nominator: V4
	Edge to B load= 0.113
	Edge to D load= 0.162
Nominator: V5
	Edge to A load= 0.091
	Edge to D load= 0.071
```

For instance, the budget of `V1` is `1`, the edge load to `A` is `0.091`, and the voter load is
`0.274`. Using our equation:

```
backing_stake (A) = voter_budget * edge_load / voter_load
```

We can fill these variables in with:

```
backing_stake (A) = 1 * 0.091 / 0.274 = 0.332
```

For `V1` backing stake of `B`, you can simply replace the edge load value and re-calculate.

```
backing_stake (B) = 1 * 0.183 / 0.274 = 0.668
```

Note that the total amount of all backing stake for a given voter will equal the total budget of the
voter, unless that voter had no candidates elected, in which case it will be 0.

The final results are:

```
A is elected with stake 6.807.
D is elected with stake 4.545.
B is elected with stake 3.647.

V1 supports: A with stake: 0.332 and B with stake: 0.668.
V2 supports: A with stake: 0.663 and B with stake: 1.337.
V3 supports: A with stake: 3.0.
V4 supports: B with stake: 1.642 and D with stake: 2.358.
V5 supports: A with stake: 2.813 and D with stake: 2.187.
```

You will notice that the total amount of stake for candidates `A`, `D`, and `B` equals (aside from
rounding errors) the total amount of stake of all the voters (`1 + 2 + 3 + 4 + 5 = 15`). This is
because each voter had at least one of their candidates fill a seat. Any voter whose had none of
their candidates selected will also not have any stake in any of the elected candidates.

## Optimizations

The results for nominating validators are further optimized for several purposes:

1. To reduce the number of edges, i.e. to minimize the number of validators any nominator selects
2. To ensure, as much as possible, an even distribution of stake among the validators
3. Reduce the amount of block computation time

### High-Level Description

After running the weighted Phragmén algorithm, a process is run that redistributes the vote amongst
the elected set. This process will never add or remove an elected candidate from the set. Instead,
it reduces the variance in the list of backing stake from the voters to the elected candidates.
Perfect equalization is not always possible, but the algorithm attempts to equalize as much as
possible. It then runs an edge-reducing algorithm to minimize the number of validators per
nominator, ideally giving every nominator a single validator to nominate per era.

To minimize block computation time, the staking process is run as an
[off-chain worker](https://docs.substrate.io/reference/how-to-guides/offchain-workers/). In order to
give time for this off-chain worker to run, staking commands (bond, nominate, etc.) are not allowed
in the last quarter of each era.

These optimizations will not be covered in-depth on this page. For more details, you can view the
[Rust implementation of elections in Substrate](https://github.com/paritytech/substrate/blob/master/frame/elections-phragmen/src/lib.rs),
the
[Rust implementation of staking in Substrate](https://github.com/paritytech/substrate/blob/master/frame/staking/src/lib.rs),
or the `seqPhragménwithpostprocessing` method in the
[Python reference implementation](https://github.com/w3f/consensus/tree/master/NPoS). If you would
like to dive even more deeply, you can review the
[W3F Research Page on Sequential Phragmén Method](https://research.web3.foundation/Polkadot/protocols/NPoS/Overview#the-election-process).

### Rationale for Minimizing the Number of Validators Per Nominator

Paying out rewards for staking from every validator to all of their nominators can cost a
non-trivial amount of chain resources (in terms of space on chain and resources to compute). Assume
a system with 200 validators and 1000 nominators, where each of the nominators has nominated 10
different validators. Payout would thus require `1_000 * 10`, or 10_000 transactions. In an ideal
scenario, if every nominator selects a single validator, only 1_000 transactions would need to take
place - an order of magnitude fewer. Empirically, network slowdown at the beginning of an era has
occurred due to the large number of individual payouts by validators to nominators. In extreme
cases, this could be an attack vector on the system, where nominators nominate many different
validators with small amounts of stake in order to slow the system at the next era change.

While this would reduce network and on-chain load, being able to select only a single validator
incurs some diversification costs. If the single validator that a nominator has nominated goes
offline or acts maliciously, then the nominator incurs a risk of a significant amount of slashing.
Nominators are thus allowed to nominate up to 16 different validators. However, after the weighted
edge-reducing algorithm is run, the number of validators per nominator is minimized. Nominators are
likely to see themselves nominating a single active validator for an era.

At each era change, as the algorithm runs again, nominators are likely to have a different validator
than they had before (assuming a significant number of selected validators). Therefore, nominators
can diversify against incompetent or corrupt validators causing slashing on their accounts, even if
they only nominate a single validator per era.

### Rationale for Maintaining an Even Distribution of Stake

Another issue is that we want to ensure that as equal a distribution of votes as possible amongst
the elected validators or council members. This helps us increase the security of the system by
ensuring that the minimum amount of tokens in order to join the active validator set or council is
as high as possible. For example, assume a result of five validators being elected, where validators
have the following stake: `{1_000, 20, 10, 10, 10}`, for a total stake of 1_050. In this case, a
potential attacker could join the active validator set with only 11 tokens, and could obtain a
majority of validators with only 33 tokens (since the attacker only has to have enough stake to
"kick out" the three lowest validators).

In contrast, imagine a different result with the same amount of total stake, but with that stake
perfectly equally distributed: `{210, 210, 210, 210, 210}`. With the same amount of stake, an
attacker would need to stake 633 tokens in order to get a majority of validators, a much more
expensive proposition. Although obtaining an equal distribution is unlikely, the more equal the
distribution, the higher the threshold - and thus the higher the expense - for attackers to gain
entry to the set.

### Rationale for Reducing Block Computing Time

Running the Phragmén algorithm is time-consuming, and often cannot be completed within the time
limits of production of a single block. Waiting for calculation to complete would jeopardize the
constant block production time of the network. Therefore, as much computation as possible is moved
to an off-chain worker, which validators can work on the problem without impacting block production
time.

There are several restrictions put in place to limit the complexity of the election and payout. As
already mentioned, any given nominator can only select up to
{{ polkadot: <RPC network="polkadot" path="consts.staking.maxNominations" defaultValue={16}/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.staking.maxNominations" defaultValue={24}/> :kusama }}
validators to nominate. Conversely, a single validator can have only
{{ polkadot: <RPC network="polkadot" path="query.staking.maxNominatorsCount" defaultValue={50000}/> :polkadot }}
{{ kusama: <RPC network="kusama" path="query.staking.maxNominatorsCount" defaultValue={20000}/> :kusama }}
nominators. A drawback to this is that it is possible, if the number of nominators is very high or
the number of validators is very low, that all available validators may be "oversubscribed" and
unable to accept more nominations. In this case, one may need a larger amount of stake to
participate in staking, since nominations are priority-ranked in terms of amount of stake.

### Phragmms (aka Balphragmms)

`Phragmms`, formerly known as `Balphragmms`, is a new election rule inspired by Phragmén and
developed in-house for {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}. In general,
election rules on blockchains is an active topic of research. This is due to the conflicting
requirements for election rules and blockchains: elections are computationally expensive, but
blockchains are computationally limited. Thus, this work constitutes state of the art in terms of
optimization.

Proportional representation is a very important property for a decentralized network to have in
order to maintain a sufficient level of decentralization. While this is already provided by the
currently implemented `seqPhragmen`, this new election rule provides the advantage of the added
security guarantee described below. As far as we can tell, at the time of writing, Polkadot and
Kusama are the only blockchain networks that implement an election rule that guarantees proportional
representation.

The security of a distributed and decentralized system such as
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} is directly related to the goal of
avoiding _overrepresentation_ of any minority. This is a stark contrast to traditional approaches to
proportional representation axioms, which typically only seek to avoid underrepresentation.

#### Maximin Support Objective and PJR

This new election rule aims to achieve a constant-factor approximation guarantee for the _maximin
support objective_ and the closely related _proportional justified representation_ (PJR) property.

The maximin support objective is based on maximizing the support of the least-supported elected
candidate, or in the case of Polkadot and Kusama, maximizing the least amount of stake backing
amongst elected validators. This security-based objective translates to a security guarantee for
NPoS and makes it difficult for an adversarial whale’s validator nodes to be elected. The `Phragmms`
rule, and the guarantees it provides in terms of security and proportionality, have been formalized
in a [peer-reviewed paper](https://arxiv.org/pdf/2004.12990.pdf)).

The PJR property considers the proportionality of the voter’s decision power. The property states
that a group of voters with cohesive candidate preferences and a large enough aggregate voting
strength deserve to have a number of representatives proportional to the group’s vote strength.

#### Comparing Sequential Phragmén, MMS, and Phragmms

_Sequential Phragmén_ (`seqPhragmen`) and `MMS` are two efficient election rules that both achieve
PJR.

Currently, {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} employs the `seqPhragmen`
method for validator and council elections. Although `seqPhramen` has a very fast runtime, it does
not provide constant-factor approximation for the maximin support problem. This is due to
`seqPhramen` only performing an _approximate_ rebalancing of the distribution of stake.

In contrast, `MMS` is another standard greedy algorithm that simultaneously achieves the PJR
property and provides a constant factor approximation for maximin support, although with a
considerably slower runtime. This is because for a given partial solution, `MMS` computes a balanced
edge weight vector for each possible augmented committee when a new candidate is added, which is
computationally expensive.

We introduce a new heuristic inspired by `seqPhragmen`, `PhragMMS`, which maintains a comparable
runtime to `seqPhragmen`, offers a constant-factor approximation guarantee for the maximin support
objective, and satisfies PJR. This is the fastest known algorithm to achieve a constant-factor
guarantee for maximin support.

#### The New Election Rule: Phragmms

`Phragmms` is an iterative greedy algorithm that starts with an empty committee and alternates
between the `Phragmms` heuristic for inserting a new candidate and _rebalancing_ by replacing the
weight vector with a balanced one. The main differentiator between `Phragmms` and `seqPhragmen` is
that the latter only perform an approximate rebalancing. Details can be found in
[Balanced Stake Distribution](#rationale-for-maintaining-an-even-distribution-of-stake).

The computation is executed by off-chain workers privately and separately from block production, and
the validators only need to submit and verify the solutions on-chain. Relative to a committee _A_,
the score of an unelected candidate _c_ is an easy-to-compute rough estimate of what would be the
size of the least stake backing if we added _c_ to committee _A_. Observing on-chain, only one
solution needs to be tracked at any given time, and a block producer can submit a new solution in
the block only if the block passes the verification test, consisting of checking:

1. Feasibility,
2. Balance and
3. Local Optimality - The least stake backing of _A_ is higher than the highest score among
   unelected candidates

If the tentative solution passes the tests, then it replaces the current solution as the tentative
winner. The official winning solution is declared at the end of the election window.

A powerful feature of this algorithm is the fact that both its approximation guarantee for maximin
support and the above checks passing can be efficiently verified in linear time. This allows for a
more scalable solution for secure and proportional committee elections. While `seqPhragmen` also has
a notion of score for unelected candidates, `Phragmms` can be seen as a natural complication of the
`seqPhragmen` algorithm, where `Phragmms` always grants higher score values to candidates and thus
inserts them with higher support values.

**To summarize, the main differences between the two rules are:**

- In `seqPhragmen`, lower scores are better, whereas in `Phragmms`, higher scores are better.
- Inspired by `seqPhragmen`, the scoring system of `Phragmms` can be considered to be more intuitive
  and does a better job at estimating the value of adding a candidate to the current solution, and
  hence leads to a better candidate-selection heuristic.
- Unlike `seqPhragmen`, in `Phragmms`, the edge weight vector _w_ is completely rebalanced after
  each iteration of the algorithm.

The `Phragmms` election rule is currently being implemented on
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}. Once completed, it will become one
of the most sophisticated election rules implemented on a blockchain. For the first time, this
election rule will provide both fair representation (PJR) and security (constant-factor
approximation for the maximin support objection) to a blockchain network.

#### Algorithm

The `Phragmms` algorithm iterates through the available seats, starting with an empty committee of
size _k_:

1. Initialize an empty committee _A_ and zero edge weight vector _w = 0_.

2. Repeat _k_ times:

   - Find the unelected candidate with highest score and add it to committee _A_.
   - Re-balance the weight vector _w_ for the new committee _A_.

3. Return _A_ and _w_.

## External Resources

- [Phragmms](https://arxiv.org/pdf/2004.12990.pdf) - W3F research paper that expands on the
  sequential Phragmén method.
- [W3F Research Page on NPoS](https://research.web3.foundation/Polkadot/protocols/NPoS/Overview) -
  An overview of Nominated Proof of Stake as its applied to Polkadot.
- [Python Reference Implementations](https://github.com/w3f/consensus/tree/master/NPoS) - Python
  implementations of Simple and Complicated Phragmén methods.
- [Substrate Implementation](https://github.com/paritytech/substrate/blob/master/frame/staking/src/lib.rs) -
  Rust implementation used in Substrate.
- [Phragmén's and Thiele's Election Methods](https://arxiv.org/pdf/1611.08826.pdf) - 95-page paper
  explaining Phragmén's election methods in detail.
- [Phragmén’s Voting Methods and Justified Representation](https://ojs.aaai.org/index.php/AAAI/article/view/10598) -
  This paper by Brill _et al._ is the source for the simple Phragmén method, along with proofs about
  its properties.
- [Offline Phragmén](https://github.com/kianenigma/offline-phragmen) - Script to generate the
  Phragmén validator election outcome before the start of an era.


---
id: learn-polkadot-host
title: Polkadot Host (PH)
sidebar_label: Polkadot Host
description: The Polkadot Host and its Components.
keywords: [polkadot host, runtime]
slug: ../learn-polkadot-host
---

The architecture of Polkadot can be divided into two different parts, the Polkadot _runtime_ and the
Polkadot _host_. The Polkadot runtime is the core state transition logic of the chain and can be
upgraded over the course of time and without the need for a hard fork. In comparison, the Polkadot
host is the environment in which the runtime executes and is expected to remain stable and mostly
static over the lifetime of Polkadot.

The Polkadot host interacts with the Polkadot runtime in limited, and well-specified ways. For this
reason, implementation teams can build an alternative implementation of the Polkadot host while
treating the Polkadot runtime as a black box. For more details of the interactions between the host
and the runtime, please see the [specification](https://spec.polkadot.network/).

## Components of the Polkadot host

- Networking components such as `Libp2p` that facilitates network interactions.
- State storage and the storage trie along with the database layer.
- Consensus engine for GRANDPA and BABE.
- Wasm interpreter and virtual machine.
- Low level primitives for a blockchain, such as cryptographic primitives like hash functions.

A compiled Polkadot runtime, a blob of Wasm code, can be uploaded into the Polkadot host and used as
the logic for the execution of state transitions. Without a runtime, the Polkadot host is unable to
make state transitions or produce any blocks.

A host node...

1. must populate the state storage with the official genesis state.
2. should maintain a set of around 50 active peers at any time. New peers can be found using the
   discovery protocols.
3. should open and maintain the various required streams with each of its active peers.
4. should send block requests to these peers to receive all blocks in the chain and execute each of
   them.
5. should exchange neighbor packets.

Consensus in the Polkadot Host is achieved during the execution of two different procedures,
block-production and finality. The Polkadot Host must run these procedures if (and only if) it is
running on a validator node.

Additional information on each of these requirements can be found
[here](https://spec.polkadot.network/#sect-node-full).

## Polkadot Runtime

Below is a diagram that displays the Polkadot host surrounding the Polkadot runtime. Think of the
runtime (in white) as a component that can be inserted, swapped out, or removed entirely. While the
parts in grey are stable and can not change without an explicit hard fork.

![polkadot host](../assets/updated_pre.png)

## Code Executor

The Polkadot Host executes the calls of Runtime entrypoints inside a Wasm Virtual Machine (VM),
which in turn provides the Runtime with access to the Polkadot Host API. This part of the Polkadot
Host is referred to as the Executor. For additional technical implementation details, check out
[this section](https://spec.polkadot.network/#sect-code-executor) of the Polkadot Spec.

## Resources

- [Polkadot Host Protocol Specification](https://github.com/w3f/polkadot-spec) - Incubator for the
  Polkadot Host spec, including tests.
- [Gossamer: A Go implementation of the Polkadot Host](https://github.com/ChainSafe/gossamer)
- [Kagome - C++ implementation of Polkadot Host](https://github.com/soramitsu/kagome)




---
id: learn-polkadot-opengov-origins
title: Polkadot OpenGov Origins
sidebar_label: OpenGov Origins
description: All Origins for Polkadot's OpenGov.
keywords: [proposal, referenda, OpenGov, origins]
slug: ../learn-polkadot-opengov-origins
---

import Tracks from "./../../components/Referenda-Tracks"; import Chart from
"./../../components/Chart";

:::info Learn more about Polkadot OpenGov

For background information about Polkadot OpenGov, please refer to this
[dedicated Wiki document](../learn/learn-polkadot-opengov.md).

:::

## Polkadot OpenGov Terminology and Parameters

The important parameters to be aware of when voting using the Referenda module are as follows:

**Origin** - Each origin has a fixed set of privileges. When making a proposal, it is important to
choose the origin that has the privilege to execute the referenda.

**Track** - Each track has its own dispatch origin and a preset configuration that governs the
voting process and parameters.

**Submission Deposit** - The minimum amount to be used as a (refundable) deposit to submit a public
referendum proposal.

**Prepare Period** - The minimum time the referendum needs to wait before it can progress to the
next phase after submission. Voting is enabled, but the votes do not count toward the outcome of the
referendum yet.

**Decision Deposit** - This deposit is required for a referendum to progress to the decision phase
after the end of prepare period.

**Decision Period** - Amount of time a decision may take to be approved to move to the confirming
period. If the proposal is not approved by the end of the decision period, it gets rejected.

**Max Deciding** - The maximum number of referenda that can be in the decision period of a track all
at once.

**Conviction**: A multiplier to increase voting power.

**Approval**: the share of the approval vote-weight after adjustments for conviction against the
total number of vote-weight for both approval and rejection

**Support**: The total number of votes in approval (ignoring adjustments for conviction) compared to
the total possible amount of votes that could be made in the system. Support also takes into account
abstained votes.

**Min Approval** - The threshold of approval (along with the min support) needed for a proposal to
meet the requirements of the confirm period.

**Min Support** - The threshold of support (along with the min approval) needed for a proposal to
meet the requirements of the confirm period.

**Confirmation Period** - The total time the referenda must meet both the min approval and support
criteria during the decision period in order to pass and enter the enactment period.

**Min Enactment Period** - Minimum time that an approved proposal must be in the dispatch queue
after approval. The proposer has the option to set the enactment period to be of any value greater
than the min enactment period.

## Origins and Tracks Info

{{ polkadot: <Tracks network="polkadot" defaultValue="Loading Polkadot Tracks..."/> :polkadot }}{{ kusama: <Tracks network="kusama" defaultValue="Loading Kusama Tracks..."/> :kusama }}

:::info

For every referendum in each of these tracks, the Polkadot-JS UI displays interactive graphs of the
support and approval.

![UI Support and Approval](./../assets/governance/support-approval-polkadot-js-ui.png)

:::

### Root

The origin with the highest level of privileges. This track requires extremely high levels of
approval and support for early passing. The prepare and enactment periods are also large. For
instance, a referendum proposed in this track needs to amass
{{ polkadot: 48.2% :polkadot }}{{ kusama:  46.8%  :kusama }} support (total network issuance) by the
end of the first day with over {{ polkadot: 93.5% :polkadot }}{{ kusama:  88%  :kusama }} approval
to be considered to be part of the confirm period. The support curve drops linearly to 25% by the
end of day {{ polkadot: 14 :polkadot }}{{ kusama:  7  :kusama }} and almost to 0% by the end of day
{{ polkadot: 28 :polkadot }}{{ kusama:  14  :kusama }}. This ensures that the token holders receive
ample time to vote on the proposal during the decision period.

{{ polkadot: <Chart title="" type="line" dataId="Root" network="Polkadot" maxX="672" maxY="100" /> :polkadot }}
{{ kusama: <Chart title="" type="line" dataId="Root" network="Kusama" maxX="336" maxY="100" /> :kusama }}

### Whitelisted Caller

Origin commanded by the [Fellowship](../learn/learn-polkadot-opengov.md#the-technical-fellowship)
whitelist some hash of a call and allow the call to be dispatched with the root origin (after the
referendum passes). This track allows for a shorter voting turnaround, safe in the knowledge through
an open and transparent process for time-critical proposals. For instance, a referendum proposed in
this track needs to amass {{ polkadot: 20% :polkadot }}{{ kusama:  14%  :kusama }} support (much
lesser than the root) by the end of the first day with over
{{ polkadot: 93.5% :polkadot }}{{ kusama:  88%  :kusama }} approval to be considered to be part of
the confirm period.

{{ polkadot: <Chart title="" type="line" dataId="Whitelist" network="Polkadot" maxX="672" maxY="100" /> :polkadot }}
{{ kusama: <Chart title="" type="line" dataId="Whitelist" network="Kusama" maxX="336" maxY="100" /> :kusama }}

### Staking Admin

The origin for canceling slashes. This origin has the privilege to execute calls from the staking
pallet and the Election Provider Multiphase Pallet.

{{ polkadot: <Chart title="" type="line" dataId="AdminStaking" network="Polkadot" maxX="672" maxY="100" /> :polkadot }}
{{ kusama: <Chart title="" type="line" dataId="AdminStaking" network="Kusama" maxX="336" maxY="100" /> :kusama }}

### Treasurer

The origin for spending funds from the treasury (up to
{{ polkadot: 10M DOT :polkadot }}{{ kusama:  333333.33 KSM  :kusama }}). This origin has the
privilege to execute calls from the Treasury pallet.

{{ polkadot: <Chart title="" type="line" dataId="Treasurer" network="Polkadot" maxX="672" maxY="100" /> :polkadot }}
{{ kusama: <Chart title="" type="line" dataId="Treasurer" network="Kusama" maxX="336" maxY="100" /> :kusama }}

### Lease Admin

Origin can force slot leases. This origin has the privilege to execute calls from the Slots pallet.

{{ polkadot: <Chart title="" type="line" dataId="AdminLease" network="Polkadot" maxX="672" maxY="100" /> :polkadot }}
{{ kusama: <Chart title="" type="line" dataId="AdminLease" network="Kusama" maxX="336" maxY="100" /> :kusama }}

### Fellowship Admin

The origin for managing the composition of the fellowship.

{{ polkadot: <Chart title="" type="line" dataId="AdminFellowship" network="Polkadot" maxX="672" maxY="100" /> :polkadot }}
{{ kusama: <Chart title="" type="line" dataId="AdminFellowship" network="Kusama" maxX="336" maxY="100" /> :kusama }}

### General Admin

The origin for managing the registrar. This origin has the privilege of executing calls from the
Identity pallet.

{{ polkadot: <Chart title="" type="line" dataId="AdminGeneral" network="Polkadot" maxX="672" maxY="100" /> :polkadot }}
{{ kusama: <Chart title="" type="line" dataId="AdminGeneral" network="Kusama" maxX="336" maxY="100" /> :kusama }}

### Auction Admin

The origin for starting auctions. This origin can execute calls from the Auctions pallet and the
Scheduler Pallet.

{{ polkadot: <Chart title="" type="line" dataId="AdminAuction" network="Polkadot" maxX="672" maxY="100" /> :polkadot }}
{{ kusama: <Chart title="" type="line" dataId="AdminAuction" network="Kusama" maxX="336" maxY="100" /> :kusama }}

### Referendum Canceller

The origin can cancel referenda. This track has a low lead time and approval/support curves with
slightly sharper reductions in their thresholds for passing.

{{ polkadot: <Chart title="" type="line" dataId="RefCanceller" network="Polkadot" maxX="672" maxY="100" /> :polkadot }}
{{ kusama: <Chart title="" type="line" dataId="RefCanceller" network="Kusama" maxX="336" maxY="100" /> :kusama }}

### Referendum Killer

The origin can cancel an ongoing referendum and slash the deposits. This track also has a low
lead-time and approval/support curves with slightly sharper reductions in their thresholds for
passing.

{{ polkadot: <Chart title="" type="line" dataId="RefKiller" network="Polkadot" maxX="672" maxY="100" /> :polkadot }}
{{ kusama: <Chart title="" type="line" dataId="RefKiller" network="Kusama" maxX="336" maxY="100" /> :kusama }}

### Small Tipper

Origin able to spend up to {{ polkadot: 250 DOT :polkadot }}{{ kusama:  8.25 KSM  :kusama }} from
the treasury at once.

{{ polkadot: <Chart title="" type="line" dataId="SmallTipper" network="Polkadot" maxX="672" maxY="100" /> :polkadot }}
{{ kusama: <Chart title="" type="line" dataId="SmallTipper" network="Kusama" maxX="336" maxY="100" /> :kusama }}

### Big Tipper

Origin able to spend up to {{ polkadot: 1000 DOT :polkadot }}{{ kusama:  33.33 KSM  :kusama }} from
the treasury at once.

{{ polkadot: <Chart title="" type="line" dataId="BigTipper" network="Polkadot" maxX="672" maxY="100" /> :polkadot }}
{{ kusama: <Chart title="" type="line" dataId="BigTipper" network="Kusama" maxX="336" maxY="100" /> :kusama }}

### Small Spender

Origin able to spend up to {{ polkadot: 10000 DOT :polkadot }}{{ kusama:  333.33 KSM  :kusama }}
from the treasury at once.

{{ polkadot: <Chart title="" type="line" dataId="SmallSpender" network="Polkadot" maxX="672" maxY="100" /> :polkadot }}
{{ kusama: <Chart title="" type="line" dataId="SmallSpender" network="Kusama" maxX="336" maxY="100" /> :kusama }}

### Medium Spender

Origin able to spend up to {{ polkadot: 100000 DOT :polkadot }}{{ kusama:  3333.33 KSM  :kusama }}
from the treasury at once.

{{ polkadot: <Chart title="" type="line" dataId="MediumSpender" network="Polkadot" maxX="672" maxY="100" /> :polkadot }}
{{ kusama: <Chart title="" type="line" dataId="MediumSpender" network="Kusama" maxX="336" maxY="100" /> :kusama }}

### Big Spender

Origin able to spend up to {{ polkadot: 1000000 DOT :polkadot }}{{ kusama:  33333.33 KSM  :kusama }}
from the treasury at once.

{{ polkadot: <Chart title="" type="line" dataId="BigSpender" network="Polkadot" maxX="672" maxY="100" /> :polkadot }}
{{ kusama: <Chart title="" type="line" dataId="BigSpender" network="Kusama" maxX="336" maxY="100" /> :kusama }}



---
id: learn-polkadot-opengov-treasury
title: Treasury
sidebar_label: Treasury
description: Polkadot's On-chain Treasury.
keywords: [treasury, funds, funding, tips, tipping]
slug: ../learn-polkadot-opengov-treasury
---

import RPC from "./../../components/RPC-Connection";

The Treasury is a pot of funds collected through a portion of block production rewards, transaction
fees, slashing, and [staking inefficiencies](./learn-inflation.md).Treasury funds are held in a
[system account](./learn-account-advanced.md#system-accounts) that cannot be controlled by any
external account; only the system internal logic can access it.

:::tip Creating a Treasury Proposal on Polkadot OpenGov

If you would like to create a treasury proposal on Polkadot OpenGov, follow the instructions
outlined on [this how-to guide](./learn-guides-treasury#creating-a-treasury-proposal).

:::

## Treasury Inflow and Outflow

Tokens that are deposited into the Treasury (i.e. the inflow) is determined by the following
mechanisms:

- **Transaction fees:** 80% of the transaction fees of every submitted extrinsic is diverted to the
  Treasury, while 20% is given to the block producers.
- **Staking inefficiencies:** the network knows an exogenously determined parameter called ideal
  staking rate. The APY for stakers (nominators & validators) decreases whenever the actual staking
  rate is not equal to the ideal staking rate. To keep inflation constant at 10%, the system does
  not creates less tokens, rather some share of the overall reward for stakers is diverted to the
  Treasury (more information
  [here](https://research.web3.foundation/Polkadot/overview/token-economics)).
- **Slashes:** whenever validators and nominators are slashed, a share of the slashed tokens are
  diverted to Treasury. They are typically rare and unpredictable events.
- **Transfers:** everyone can send funds to the Treasury directly. This is a rare event and
  typically due to grantees reimbursing some of the amount they got allocated for various reasons.

The outflow is determined by the following mechanisms:

- **Burned tokens:** at the end of each spend period
  {{ polkadot: <RPC network="polkadot" path="consts.treasury.burn" defaultValue={10000} filter="permillToPercent"/> :polkadot }}{{ kusama: <RPC network="kusama" path="consts.treasury.burn" defaultValue={2000} filter="permillToPercent"/> :kusama }}%
  of the available funds are burned.
- **Treasury proposals & Bounties:** they make up the largest share of outflow tokens to the
  community and need to be approved by governance. Then, payouts occur at the end of a
  [spend period](../general/glossary.md#spend-period).
- **Tips:** smaller payouts directly to grantees that can happen within a
  [spend period](../general/glossary.md#spend-period).

:::info Spend Period Schedule

On Polkadot-JS UI, navigate to Governance > Treasury to view the status of current
[spend period](../general/glossary.md#spend-period).

![preimage-whitelist](../assets/treasury/treasury-spend-period.png)

:::

## Treasury Tracks

OpenGov allows for managing funds through six tracks, each with its own
[origin and track parameters](./learn-polkadot-opengov-origins.md#origins-and-tracks-info).

- [Treasurer](./learn-polkadot-opengov-origins.md#treasurer)
- [Big Spender](./learn-polkadot-opengov-origins.md#big-spender)
- [Medium Spender](./learn-polkadot-opengov-origins.md#medium-spender)
- [Small Spender](./learn-polkadot-opengov-origins.md#small-spender)
- [Big Tipper](./learn-polkadot-opengov-origins.md#big-tipper)
- [Small Tipper](./learn-polkadot-opengov-origins.md#small-tipper)

:::info How to access Treasury funds?

Access to Treasury funds requires successful enactment of referendum in the respective treasury
track on-chain. Learn how to submit a treasury proposal for referendum
[here](./learn-guides-treasury#creating-a-treasury-proposal).

:::

## Bounties

### Parent Bounties

Getting treasury funding through OpenGov, depending on which treasury track you submit your
referendum, can be a long and uncertain process. This is not always a suitable option, for example,
for event organizers who need to pay costs upfront or close to the event's date. Bounties solve this
problem by procuring access to treasury funds in a single shot and using them to fund multiple
events later on through [child bounties](#child-bounties). This is why bounties are also called
_parent_ bounties.

Parent bounty proposals aim to reserve a portion of treasury funds once, which will be used later.
They save proponents the time needed to create and obtain approval for several OpenGov referenda.
Bounties are managed by curators, where the curator is usually a
[multi-signature account](./learn-account-multisig.md). Bounties can access a large amount of funds,
so managing those funds with a multisig is a good practice to enhance security. Essentially,
curators are multisig addresses with agency over a portion of the treasury to promote events, fix a
bug or vulnerability, develop a strategy, or monitor a set of tasks related to a specific topic, all
for the benefit of the {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} ecosystem.

A proposer can [submit a bounty proposal](./learn-guides-bounties.md#submit-a-bounty-proposal) to
OpenGov,
[with a curator to be defined later](./learn-guides-bounties.md#assign-a-curator-to-a-bounty), whose
background and expertise is such that they can determine when the task is complete.

When submitting the value of the bounty, the proposer can specify a fee that will be paid to
curators willing to invest their time and expertise in the task; this amount will be included in the
total value of the bounty. In this sense, the curator's fee can be defined as the difference between
the amounts paid to child bounty awardees and the total value of the bounty.

Curators are selected through OpenGov referendum after the bounty proposal passes; and they need to
pay an upfront deposit to take the position. The deposit is calculated by multiplying the curator
fee by
{{ polkadot: <RPC network="polkadot" path="consts.bounties.curatorDepositMultiplier" defaultValue={500000} filter="permillToPercent"/> :polkadot }}{{ kusama: <RPC network="kusama" path="consts.bounties.curatorDepositMultiplier" defaultValue={500000} filter="permillToPercent"/> :kusama }}%,
and it can range between a minimum of
{{ polkadot: <RPC network="polkadot" path="consts.bounties.curatorDepositMin" defaultValue={100000000000} filter="humanReadable"/> :polkadot }}{{ kusama: <RPC network="kusama" path="consts.bounties.curatorDepositMin" defaultValue={3333333330} filter="humanReadable"/> :kusama }}
and a maximum of
{{ polkadot: <RPC network="polkadot" path="consts.bounties.curatorDepositMax" defaultValue={2000000000000} filter="humanReadable"/> :polkadot }}{{ kusama: <RPC network="kusama" path="consts.bounties.curatorDepositMax" defaultValue={166666666500} filter="humanReadable"/> :kusama }}.
This deposit can be used to punish curators if they act maliciously. However, if they are successful
in managing the bounty to completion, they will receive their deposit back, and part of the bounty
funding as a payment for their efforts.

Curators are expected to have a decent track record in addressing the issues the bounty wants to
solve. They should be very knowledgeable on the topics covered by the bounty and have proven project
management skills or experience. These recommendations help ensure an effective use of the bounty
mechanism. A Bounty is a reward for a specified body of work or set of objectives that needs to be
executed for a predefined treasury amount designated to be paid out. The responsibility of assigning
a payout address once the specified set of objectives is completed is delegated to the curator.

The bounty has a predetermined duration of
{{ polkadot: <RPC network="polkadot" path="consts.bounties.bountyUpdatePeriod" defaultValue={1296000} filter="blocksToDays"/> :polkadot }}{{ kusama: <RPC network="kusama" path="consts.bounties.bountyUpdatePeriod" defaultValue={1296000} filter="blocksToDays"/> :kusama }}
days, with possible extension(s) to be requested by the curator. To maintain flexibility during the
tasks’ curation, the curator will also be able to create child bounties for more granularity in the
allocation of funds and as part of a nested iteration of the bounty mechanism.

### Child Bounties

Child bounties are spawned from [parent bounties](#parent-bounties). Child bounties are used to
access funds directly from the parent bounty without going through an OpenGov referendum.

---

:::info Polkadot-JS Guides

If you are an advanced user, see the [Polkadot-JS guides about bounties](./learn-guides-bounties.md)
and [treasury](./learn-guides-treasury.md).

:::


---
id: learn-polkadot-opengov
title: Introduction to Polkadot OpenGov
sidebar_label: Polkadot OpenGov
description: Polkadot’s Latest Model for Decentralized Governance.
keywords: [governance, referenda, proposal, voting, endorse]
slug: ../learn-polkadot-opengov
---

import RPC from "./../../components/RPC-Connection";

import VLTable from "./../../components/Voluntary-Locking";

import Fellowship from "./../../components/Fellowship";

:::caution The content in this document is subject to change

The governance protocol has already undergone iterations (see
[Governance V1](./learn-governance.md)). Governance is a constantly evolving protocol at this stage
in its lifecycle.

For technical information about Polkadot OpenGov and how to interact with it, please refer to this
[dedicated Wiki page](./learn-guides-polkadot-opengov.md).

For additional support about Polkadot OpenGov see the
[dedicated support pages](https://support.polkadot.network/support/solutions/65000105211).

:::

:::info Polkadot Delegation Dashboard

See the video tutorial below to easily delegate your votes to somebody else using the
[Polkadot Delegation Dashboard](https://delegation.polkadot.network/).

[![Delegation Dashboard Tutorial](https://img.youtube.com/vi/RapBYZc5ZPo/0.jpg)](https://www.youtube.com/watch?v=RapBYZc5ZPo)

**If you become a nomination pool member or a pool admin, you cannot participate in Governance with
the bonded tokens in the pool, as they are held in a
[system account](./learn-account-advanced.md#system-accounts).**

:::

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} uses a sophisticated governance
mechanism that allows it to evolve gracefully overtime at the ultimate behest of its assembled
stakeholders. The stated goal is to ensure that the majority of the stake can always command the
network.

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} brings together various novel
mechanisms, including an amorphous (abstract) form of state-transition function stored on-chain
defined in a platform-agnostic language (i.e. [WebAssembly](learn-wasm.md)), and several on-chain
voting mechanisms such as referenda and batch approval voting. All changes to the protocol must be
agreed upon by stake-weighted referenda.

## Premise

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}'s first governance system
([Governance V1](./learn-governance.md)) included three main components.

- The [Technical Committee](./learn-governance.md#technical-committee): A technocratic committee to
  manage upgrade timelines.
- The [Council](./learn-governance.md#council): An approval-voted, elected executive "government" to
  manage parameters, admin, and spending proposals.
- The Public: All token holders.

Over the first few years of operation, Governance V1 ensured the appropriate usage of treasury funds
and enabled timely upgrades and fixes. Like most early technologies, protocols must evolve as they
mature to improve their shortcomings and keep up with modern advancements. In Governance V1, all
referenda carried the same weight as only one referendum could be voted on at a time (except for
emergency proposals), and the voting period could last multiple weeks. Also, an
[alternating voting timetable](./learn-governance.md#alternating-voting-timetable) allowed to vote
either for a public referendum or a council motion every
{{ polkadot: 28 days :polkadot }}{{ kusama: 7 days :kusama }}. This resulted in the system favoring
careful consideration of very few proposals instead of broad consideration of many.

Polkadot OpenGov changes how the practical means of day-to-day decisions are made, making the
repercussions of referenda better scoped and agile to increase the number of collective decisions
the system can make at any given time.

The following content is focused on what the new Polkadot OpenGov version brings to the governance
on {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}, and on the main differences with
previous governance versions. We recommend learning about [Governance v1](./learn-governance.md) to
better understand the need for and the direction of Polkadot OpenGov.

## Summary

In Governance v1, active token holders (public) and the Council together administrated network's
upgrade decisions. Whether the public or the council initiated the proposal, it would eventually
have to go through a referendum to let all holders (weighted by stake and conviction) make the
decision.

The Council fulfilled its role as the representative of the public, guardian of the treasury and
initiator of legislation, but it was often seen as a centralized entity. To further decentralize
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}, Polkadot OpenGov proposes the
following main changes:

- Migrating all responsibilities of the Council to the public via a direct democracy voting system.
- Dissolving the current [Council](./learn-governance.md#council) collective
- Allowing users to delegate voting power in more ways to community members
- Dissolving the [Technical Committee](./learn-governance.md#technical-committee) and establishing
  the broader [Polkadot Technical Fellowship](#the-technical-fellowship)

The figure below shows an overview of Polkadot OpenGov's structure.

:::info

See [this page](./learn-governance.md#summary) for a comparison with the structure of Governance V1.

:::

![opengov-overview](../assets/opengov-overview.png)

In Polkadot OpenGov, all the proposals are initiated by the public. The proposal will enter a
Lead-in period (for more information, see [Referenda Timeline](#referenda-timeline)), after which it
will follow a specific [Track](#origins-and-tracks) which has a dedicated Origin. There are
[15 Origins](./learn-polkadot-opengov-origins.md#origins-and-tracks-info), each with a different
track. The origins and tracks parameters are preset values that set the duration of a referendum as
well as how many referenda can be voted on simultaneously. For example, a treasury proposal can now
be submitted in different tracks depending on the amount requested. A proposal for a small tip will
need to be submitted in the Small Tipper track, while a proposal requiring substantial funds will
need to be submitted to the Medium or Big Spender track.

The [Polkadot Technical Fellowship](#the-technical-fellowship) can decide to
[whitelist](#whitelisting) a proposal that will be enacted through the Whitelist Caller origin.
Those proposals will have a shorter Lead-in, Confirmation, and Enactment period when compared to the
Root Origin track.

Each track has its own preset [Approval and Support](#approval-and-support) curves which are based
on the origin's privileges. When both the approval and support criteria are satisfied for a specific
period (called the confirmation period), the referenda passes and will be executed after the
enactment period.

All referenda within each track and across tracks can be voted on simultaneously (assuming track
maximum capacity is not reached).

Polkadot OpenGov also comes with multi-role delegations where the token holder can assign voting
power on different tracks to different entities who are experts in judging the referenda submitted
to those tracks. For example, suppose a token holder does not have the technical background to
consider the merits and vote on the referenda submitted to the Root track. In that case, they can
delegate their voting power just for the Root track to a trusted expert who (according to them) acts
in the best interest of the network protocol. In this way, token holders do not need to be
up-to-date with governance matters and can still make their votes count through delegates.

:::info Delegation Dashboard

To easily delegate your votes you can use the
[Polkadot Delegation Dashboard](https://delegation.polkadot.network/). See
[this video tutorial](https://www.youtube.com/watch?v=RapBYZc5ZPo) to know more about the dashboard
and learn how to use it.

:::

## Gov1 vs. Polkadot OpenGov

| Governance V1                                                                                                                                                                                                                                                                                                                                  | Polkadot OpenGov                                                                                                                                                                                                                                       | Polkadot OpenGov Benefit                                                                                                                                                       |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Includes the [Council](./learn-governance.md#council), the [Technical Committee](./learn-governance.md#technical-committee), and the Public (i.e. token holders).                                                                                                                                                                              | Includes the Public and the [Technical Fellowship](#the-technical-fellowship).                                                                                                                                                                         | Simpler and more decentralized structure.                                                                                                                                      |
| Referenda executed only from one origin (Root). Referenda in this origin must be carefully scrutinized. Therefore, there is only one track (i.e. only one referendum at a time can be executed).                                                                                                                                               | Referenda executed from [multiple origins](./learn-polkadot-opengov-origins.md#origins-and-tracks-info), each with a different track that shapes proposals’ timelines. Depending on the origin, multiple referenda within the same track are possible. | Possibility to categorize proposals (based on importance and urgency) and execute them simultaneously within and between origin tracks.                                        |
| Proposals can be submitted by either the Council or the Public.                                                                                                                                                                                                                                                                                | The public submits proposals.                                                                                                                                                                                                                          | More democratic.                                                                                                                                                               |
| Uses [Adaptive Quorum Biasing](./learn-governance.md#adaptive-quorum-biasing) to define the approval threshold based on turnout. Given the same turnout, council-initiated referenda require fewer Aye votes to pass compared to public referenda.                                                                                             | Uses origin-specific approval and support curves defining the amount of approval and support (i.e. turnout) needed as a function of time. The same curves are applied to all referenda within the same origin track.                                   | Referenda timeline depends on the origin and not on who submitted the proposal (i.e. Council or Public). This is a more democratic and equalitarian system.                    |
| Uses [alternating voting timetable](./learn-governance.md#alternating-voting-timetable) allowing voters to cast votes for either council or public referenda every 28 eras.                                                                                                                                                                    | Multiple referenda can be voted at the same time.                                                                                                                                                                                                      | More flexible and agile governance system.                                                                                                                                     |
| Except for emergency proposals, all referenda have fixed voting and enactment periods of 28 eras.                                                                                                                                                                                                                                              | Periods' length is customizable and has pre-defined limits for each origin. The same limits apply to all tracks with the same origin. For example, the track in the origin Root will be longer than the track within the Small Tipper origin.          | Referenda’s timeline is tailored to their importance and urgency. Flexible enactment period based on origin.                                                                   |
| Emergency proposals turned referenda can be simultaneously voted on and executed with other referenda and have shorter enactment periods. They must be proposed by the Technical Committee and approved by the Council.                                                                                                                        | No emergency proposals. The Technical Fellowship can whitelist proposals that will have their origin with shorter lead-in, confirmation, and enactment periods.                                                                                        | The Technical Fellowship is a more decentralized entity when compared to the Technical Committee. Whitelisting a proposal requires a majority of approval from the fellowship. |
| Only the [most-endorsed proposal](./learn-governance.md#endorsing-proposals) is able to transit from Launch to Voting period. The time for the transition is indeterminate, and (with no possibility of canceling endorsements) proposers and endorsers might wait a long time before a referendum is tabled, and getting their deposits back. | All proposals will eventually be voted on (given track capacity and deposit are met and the Lead-in period has ended).                                                                                                                                 | It allows all proposals to get a chance to be voted on in a timely predictive manner.                                                                                          |
| Only _aye_ or _nay_ votes possible.                                                                                                                                                                                                                                                                                                            | Voters can have the additional voting options of abstaining or splitting votes.                                                                                                                                                                        | More ways to engage in voting and increase turnout.                                                                                                                            |
| Voters can decide to delegate votes to another account.                                                                                                                                                                                                                                                                                        | Voters can use [multirole delegations](#multirole-delegation) and delegate votes to different accounts depending on origins.                                                                                                                           | More agile delegations tailored by expertise.                                                                                                                                  |

## Proposals

:::info Starting a proposal in Governance v1

See [this page](./learn-governance.md#proposals) for more information about starting referenda in
Governance v1.

:::

In Polkadot OpenGov, anyone can start a referendum at any time and do so as often as they wish.
Previous features were expanded and improved, most notably
[**Origins and Tracks**](#origins-and-tracks) help aid in the flow and processing of the submitted
referenda.

### Cancelling and Blacklisting

:::info Cancelling Referenda in Governance v1

See [this page](./learn-governance.md#cancelling-proposals) for more information about cancelling
referenda in Governance v1.

:::

In Polkadot OpenGov, there is a special operation called **Cancellation** for intervening with a
proposal already being voted on. The operation will immediately reject an ongoing referendum
regardless of its status. There is also a provision to ensure the deposit of the proposer is slashed
if the proposal is malicious or spam.

Cancellation is a governance operation the network must vote on to be executed. Cancellation comes
with [its own Origin and Track](./learn-polkadot-opengov-origins.md#referendum-canceller) which has
a low lead-time and Approval/Support curves with slightly sharper reductions in their thresholds for
passing, given that it is invoked with a sense of urgency.

For more information about how to cancel a referendum see the
[advanced how-to guides](./learn-guides-polkadot-opengov#cancel-or-kill-a-referendum).

:::info Blacklisting

Blacklisting referenda in Polkadot OpenGov is
[the same as in Governance v1](./learn-governance.md#blacklisting-proposals).

:::

## Referenda

:::info Public and Council Referenda in Governance v1

With the Council's dissolution, [council referenda](./learn-governance.md#council-referenda) are no
longer present in Polkadot OpenGov.

See [this page](./learn-governance.md#public-referenda) for more information about public referenda
in Governance v1.

:::

**In Polkadot OpenGov all referenda are public.** The
[Technical Fellowship](#the-technical-fellowship) has the option to [whitelist](#whitelisting)
referenda that can be then proposed in the track with
[whitelist origin](./learn-polkadot-opengov-origins.md#whitelisted-caller).

### Referenda Timeline

:::info Voting timetable in Governance v1

See [this page](./learn-governance.md#referenda-timeline) for more information about the voting
timetable in Governance v1.

:::

![opengov-timeline](../assets/opengov-timeline.png)

The figure above provides a summary view of the referenda timeline for Polkadot OpenGov.

In (1), when a referendum is initially created, the community can immediately vote on it. However,
it is not immediately in a state where it can end or otherwise have its votes counted, be approved,
and ultimately enacted. Instead, the proposal will stay within a **Lead-in Period** until it
fulfills three criteria:

- Proposals must stay within the lead-in period for a pre-defined minimum amount of time. This helps
  mitigate against the possibility of "decision sniping" where an attacker controlling a substantial
  amount of voting power might seek to have a proposal passed immediately after proposing, not
  allowing the overall voting population adequate time to consider and participate.
- There must be enough room for the decision within the origin. Different origins have their limit
  on the number of proposals that can be decided simultaneously. Tracks that have more potent
  abilities will have lower limits. For example, the Root level Origin has a limit of one, implying
  that only a single proposal may be decided on at once.
- A decision deposit must be submitted. Creating a referendum is cheap as the deposit value consists
  of only the value required for the on-chain storage needed to track it. But, having a referendum
  reviewed and decided upon carries the risk of using up the limited spots available in the
  referenda queue. Having a more significant but refundable deposit requirement makes sense to help
  mitigate spam. Failing to submit the decision deposit will lead to a referendum _timeout_.

Until they are in the lead-in period, proposals remain undecided. Once the criteria above are met,
the referendum moves to the _deciding_ state. The votes of the referendum are now counted towards
the outcome.

In (2), the proposal enters the **Decision Period** where votes can be cast. For a proposal to be
approved, votes must satisfy the approval and support criteria for at least the **Confirmation
Period**; otherwise, the proposal is automatically rejected. A rejected proposal can be resubmitted
anytime and as many times as needed.

In (3), approved proposals will enter the **Enactment Period**, after which proposed changes will be
executed.

Note how the length of the lead-in, decision, confirmation, and enactment periods vary depending on
the origin. Root origin has more extended periods than the other origins. Also, the number of
referenda within each track differs, with the Root origin track only accepting one. proposal at a
time (see below).

![opengov-track-capacity](../assets/opengov-track-capacity.png)

This directly affects the number of proposals that can be voted on and executed simultaneously.
Continuing the comparison between Root and Small Tipper, Small Tipper will allow many proposals on
its track to be executed simultaneously. In contrast, Root will allow only one proposal in its
track. Once the track capacity is filled, additional proposals in the lead-in period will queue
until place is available to enter the decision period.

### Origins and Tracks

An **Origin** is a specific level of privilege that will determine the **Track** of all referenda
executed with that origin. The track is basically a pipeline in which the proposal lives and
proceeds and is independent from other origins' tracks. The proposer of the referenda now selects an
appropriate Origin for their request based on the proposal’s requirements.

Although the track structure is the same for all origins, track parameters are not. Such parameters
include:

- **Maximum Deciding or Capacity**: the limit for the number of referenda that can be decided at
  once (i.e. the number of tracks within each origin).
- **Decision deposit**: the amount of funds that must be placed on deposit to enter the Decision
  Period (note that more requirements must be met to enter the Decision Period).
- **Preparation Period**: the minimum amount of voting time needed before entering the Decision
  Period (given capacity and deposit are met).
- **Decision Period**: the maximum time to approve a proposal. The proposal will be accepted if
  approved by the end of the period.
- **Confirmation Period**: the minimum amount of time (within the Decision Period) the approval and
  support criteria must hold before the proposal is approved and moved to the enactment period.
- **Minimum Enactment Period**: the minimum amount of waiting time before the proposed changes are
  applied
- **Approval Curve**: the curve describing the minimum % of _aye_ votes as a function of time within
  the Decision Period. The approval % is the portion of _aye_ votes (adjusted for conviction) over
  the total votes (_aye_, _nay_, and _abstained_).
- **Support Curve**: the curve describing the minimum % of all votes in support of a proposal as a
  function of time within the Decision Period. The support % is defined as the portion of all votes
  (_aye_ and _abstained_) without conviction over the total possible amount of votes in the system
  (i.e. the total active issuance).

For example, a runtime upgrade (requiring a `set_code` call, if approved) does not have the same
implications for the ecosystem as the approval of a treasury tip (`reportAwesome` call), and
therefore different Origins for these two actions are needed in which different deposits, support,
approval, and a minimum [enactment](#enactment) periods will be predetermined on the pallet.

For detailed information about origin and tracks, and parameter values in Kusama, see
[this page](./learn-polkadot-opengov-origins.md#origins-and-tracks-info).

### Approval and Support

:::info Adaptive Quorum Biasing is deprecated

In Polkadot OpenGov, [Adaptive quorum biasing](./learn-governance.md#adaptive-quorum-biasing) used
in Governance V1 has been replaced with the **Approval and Support system**.

:::

![opengov-curves-pass](../assets/opengov-curves-pass.png)

The figure above provides a summary view of how the approval and support system works during the
Decision Period.

Once the proposal exits the Lead-in Period and enters the Voting Period, to be approved, it must
satisfy the approval and support criteria for the **Confirmation Period**.

- **Approval** is defined as the share of approval (_aye_ votes) vote-weight (after adjustment for
  [conviction](#voluntary-locking)) against the total vote-weight (_aye_, _nay_, and _abstained_).
- **Support** is the total number of _aye_ and _abstain_ votes (ignoring any adjustment for
  conviction) compared to the total possible votes that could be made in the system. In case of
  _split_ votes, only _aye_ and _abstain_ will count.

:::info Nay votes are not counted towards Support

Support is a measure of voters who turned out either in favor of the referenda and who consciously
abstained from it. Support does not include _nay_ votes. This avoids edge situations where _nay_
votes could push a referendum into confirming state. For example, imagine current approval is high
(near 100%, way above the approval curve), and current support is just below the support curve. A
_nay_ could bump support above the support curve but not reduce approval below the approval curve.
Therefore someone voting against a proposal would make it pass. Hence, a decrease in % of current
approval through new votes does not directly translate into increasing support because Support needs
to consider _nay_ votes.

:::

The figure above shows the followings:

- Even if the approval threshold is reached (i.e. % of current approval is greater than the approval
  curve), the proposal only enters the confirmation period once the support threshold is also
  reached (i.e. % current support is greater than the underlying support curve).
- If the referendum meets the criteria for the confirmation period, then the proposal is approved
  and scheduled for enactment. The Enactment Period can be specified when the referendum is proposed
  but is also subject to a minimum value based on the Track. More powerful Tracks enforce a larger
  Enactment Period to ensure the network has ample time to prepare for any changes the proposal may
  bring.
- A referendum may exit the confirmation period when the thresholds are no longer met, due to new
  _Nay_ votes or a change of existing _Aye_ or _Abstain_ votes to _Nay_ . Each time it exits, the
  confirmation period resets. For example, if the confirmation period is 20 minutes and a referendum
  enters it just for 5 min, the next time it enters, it must stay for 20 minutes (not 15 minutes).
- During the decision period, if a referendum fails to meet the approval and support thresholds for
  the duration of the track-specific confirmation period, it fails and does not go to the enactment
  period (it may have to be resubmitted, see below).
- The current approval must be above 50% for a referendum to pass, and the approval curve never goes
  below 50%.

![opengov-curves-pass](../assets/opengov-curves-nopass.png)

Note that support may not increase monotonically as shown in the figure, as people might switch
votes.

Different Origins' tracks have different Confirmation Periods and requirements for approval and
support. For additional details on the various origins and tracks, check out
[this table](./learn-polkadot-opengov-origins.md#origins-and-tracks-info). Configuring the amount of
support and overall approval required for it to pass is now possible. With proposals that use less
privileged origins, it is far more reasonable to drop the required support to a more realistic
amount earlier than those which use highly privileged classes such as `Root`. Classes with more
significance can be made to require higher approval early on, to avoid controversy.

### Enactment

:::info Enactment in Governance v1

See [this page](./learn-governance.md#enactment) for more information about enactment in Governance
v1.

:::

In Polkadot OpenGov, the proposer suggests the enactment period, but there are also minimums set for
each Origin Track. For example, root Origin approvals require a more extended period because of the
importance of the changes they bring to the network.

## Voting on a Referendum

In Governance V1, voters could cast only an _aye_ or _nay_ vote. In Polkadot OpenGov, voters can
additionally cast a _abstain_ and _split_ votes.
[Vote splitting](./learn-guides-polkadot-opengov.md#voting-on-referenda) allows voters to allocate
different votes for _aye_, _nay_, and _abstain_.

:::info Only the last vote counts

Voting a second time replaces your original vote, e.g. voting with 10
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }}, then a second extrinsic to vote with 5
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }}, means that you are voting with 5
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }}, not 10
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }}.

:::

Note that to successfully cast votes you need to have the
[existential deposit](./learn-accounts.md#existential-deposit-and-reaping) and some additional funds
to pay for transaction fees.

### Voluntary Locking

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} utilizes an idea called voluntary
locking that allows token holders to increase their voting power by declaring how long they are
willing to lock up their tokens; hence, the number of votes for each token holder will be calculated
by the following formula:

```
votes = tokens * conviction_multiplier
```

The conviction multiplier increases the vote multiplier by one every time the number of lock periods
double.

<VLTable />

The maximum number of "doublings" of the lock period is set to 6 (and thus 32 lock periods in
total), and one lock period equals
{{ polkadot: <RPC network="kusama" path="consts.convictionVoting.voteLockingPeriod" defaultValue={100800} filter="blocksToDays"/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.convictionVoting.voteLockingPeriod" defaultValue={100800} filter="blocksToDays"/> :kusama }}
days. For additional information regarding the timeline of governance events, check out the
governance section on the
{{ polkadot: [Polkadot Parameters page](maintain-polkadot-parameters/#governance) :polkadot }}{{ kusama: [Kusama Parameters page](kusama-parameters/#governance) :kusama }}.

:::info do votes stack?

You can use the same number of tokens to vote on different referenda. Votes with conviction do not
stack. If you voted with 5 {{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} on Referenda A, B
and C with 2x conviction you would have 10 votes on all those referenda and 5
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} locked up only for the 2x conviction period
(i.e. {{ polkadot: two weeks :polkadot }}{{ kusama: two weeks :kusama }}), with the unlocking
countdown starting when the last referendum you voted on ends (assuming you are on the winning
side). If you voted with conviction on referendum and then a week later voted on another one with
the same conviction, the lock on your {{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} will be
extended by a week (always assuming you are on the winning side).

:::

:::info Staked tokens can be used in governance

While a token is locked, you can still use it for voting and [staking](./learn-staking.md). You are
only prohibited from transferring these tokens to another account.

:::

Votes are always "counted" at the same time (at the end of the voting period), no matter for how
long the tokens are locked.

See below an example that shows how voluntary locking works.

Peter: Votes `No` with
{{ polkadot: 10 DOT for a 32-week :polkadot }}{{ kusama: 1 KSM for a 32-week :kusama }} lock period
=> {{ polkadot: 10 x 6 = 60 Votes :polkadot }}{{ kusama: 1 x 6 = 6 Votes :kusama }}

Logan: Votes `Yes` with
{{ polkadot: 20 DOT for one week :polkadot }}{{ kusama: 2 KSM for one week :kusama }} lock period =>
{{ polkadot: 20 x 1 = 20 Votes :polkadot }}{{ kusama: 2 x 1 = 2 Votes :kusama }}

Kevin: Votes `Yes` with
{{ polkadot: 15 DOT for a 2-week :polkadot }}{{ kusama: 1.5 KSM for a 2-week :kusama }} lock period
=> {{ polkadot: 15 x 2 = 30 Votes :polkadot }}{{ kusama: 1.5 x 2 = 3 Votes :kusama }}

Even though combined both Logan and Kevin vote with more
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} than Peter, the lock period for both of them
is less than Peter, leading to their voting power counting as less.

:::info Conviction Voting Locks created during Gov 1

Conviction voting locks in Governance v1 will not be carried over to OpenGov. Voting with conviction
in OpenGov will create a new lock (as this will use the `convictionVoting` pallet), while any
existing lock under Governance v1 (using the deprecated `democracy` pallet) will be left to expire.
Delegations under Governance v1 will need to be re-issued under OpenGov.

:::

### Multirole Delegation

Polkadot OpenGov builds on the
[vote delegation feature from Governance v1](./learn-governance.md#delegations) where a voter can
delegate their voting power to another voter. It does so by introducing a feature known as
**multirole delegation**, where voters can specify a different delegate for every class of
referendum in the system. Delegation can be done per track, and accounts can choose to select
different delegates (or no delegation) for each track.

For example, a voter could delegate one entity for managing a less potent referenda class, choose a
different delegate for another class with more powerful consequences and still retain full voting
power over any remaining classes.

:::info Delegate your votes

In Polkadot OpenGov you can delegate your votes to different entities, who will vote on your behalf.
You can delegate your votes using the
[**Polkadot Delegation Dashboard**](https://delegation.polkadot.network/). See
[this video tutorial](https://www.youtube.com/watch?v=RapBYZc5ZPo) to learn about the features of
the dashboard.

If you are staking directly and not through a nomination pool, you can use bonded tokens for voting.
Note that if you are voting with conviction, your tokens will have a democracy lock in addition to
the staking lock. For more information about locks, see
[this page](./learn-accounts.md/#unlocking-locks).

Democracy locks created through [conviction voting](#voluntary-locking) start the unlocking period
after a referendum ends, provided you voted with the winning side. In the case of delegations, the
unlocking period countdown begins after the account undelegates. There can be different scenarios:

- if the account delegated votes to one delegate, then after undelegating, there will be one
  unlocking period with length dependent on the conviction multiplier.
- if the account delegated votes to different delegates using different convictions, then after
  undelegating those delegates, there will be different unlocking periods with lengths dependent on
  the conviction multipliers.

:::

It is worth noting that a user delegating their voting power does not imply that the delegate will
have control over the funds of the delegating user's account. That delegate's account can vote with
a user's voting power but won't be able to transfer balances, nominate a different set of
validators, or execute any call other than voting on the tracks defined by the user.

The goal of delegations is to ensure the required support for proposals to be enacted is reached
while keeping the overall design censorship-free. Also, voters might not have the technical
knowledge to judge some referenda or might not have the time to read all referenda. Delegations
allow voters to participate in OpenGov hands-free by delegating their voting power to trusted
entities.

For a step-by-step outline of how to delegate voting power in Polkadot OpenGov, check out the
[Delegating Voting Power](./learn-guides-polkadot-opengov.md#delegations) section on the
[Polkadot OpenGov Guides](./learn-guides-polkadot-opengov.md).

## The Polkadot Technical Fellowship

:::info From Technical Committee to the Technical Fellowship

The Polkadot Technical Fellowship is a collection of Substrate experts. This fellowship was
established in 2022. In Polkadot OpenGov, this fellowship replaces the
[Technical Committee](./learn-governance.md#technical-committee) in Governance v1, and will serve
both the Polkadot and Kusama networks.

For more information about the Fellowship see the
[Fellowship Manifesto](https://github.com/polkadot-fellows/manifesto/blob/0c3df46d76625980b8b48742cb86f4d8fa6dda8d/manifesto.pdf).

:::

The Technical Fellowship is a mostly self-governing expert body with a primary goal of representing
humans who embody and contain the technical knowledge base of the Kusama and/or Polkadot networks
and protocols. This is accomplished by associating a rank with members to categorize the degree to
which the system expects their opinion to be well-informed, of a sound technical basis, and in line
with the interests of Polkadot and/or Kusama.

Unlike the Technical Committee in Governance V1, the Fellowship is designed to be far broader in
membership (i.e. to work well with even tens of thousands of members) and with far lower barriers to
entry (both in terms of administrative process flow and expectations of expertise).

The mechanism by which the Fellowship votes is the same as what is used for Polkadot and Kusama
stakeholder voting for a proposed referendum. Members of the Fellowship can vote on any given
Fellowship proposal and the aggregated opinion of the members (weighted by their rank) constitutes
the Fellowship's considered opinion.

The Polkadot Technical Fellowship resides on the
[Collectives](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fpolkadot-collectives-rpc.polkadot.io#/fellowship/referenda)
parachain and maintains the [Polkadot Fellows](https://github.com/polkadot-fellows) repository. The
fellowship also has its own governance model with multiple tracks with approval and support
parameters, where the votes are weighted by the rank of the member.  
The fellowship governance is primarily used for its membership management,
[approving RFCs](https://github.com/polkadot-fellows/RFCs) and whitelisting Polkadot OpenGov
proposals.

{{ kusama: <Fellowship network="kusama" defaultValue="Loading Kusama Fellows..."/> :kusama }}

### Ranking System

To prevent a small group of participants from gaining effective control over the network, this
system will adhere to three main principles:

- The Fellowship must never have hard power over the network: it cannot change the parameters,
  conduct rescues or move assets. Their only power in governance is reducing the effective timeline
  on which a referendum takes place through [whitelisting](#whitelisting).
- The Fellowship weights those with a higher rank more in the aggregate opinion. However, the weight
  should not be so high as to make a small number of higher members’ opinions be insurmountable
  compared to a coherent opinion from lower-ranked membership.
- The Fellowship should be designed to grow and develop its membership, aggregate levels of
  expertise and ensure that its overall decision-making capacity strengthens over time.

To support these conditions, the Fellowship will have a constitution that outlines the requirements
and expectations for individuals to attain and retain any given rank. Higher ranks can vote and
promote lower ranks based on this constitution.

**Demotion** occurs automatically after a given period has elapsed, and the member is unable to
defend their position to their peers.

**Suspension** can happen only through a referendum, which ensures that the Fellowship's bias alone
does not necessarily result in expulsion.

To prevent the Fellowship from becoming a cabal (popularity with Fellowship peers alone should not
be enough to gain access to a top rank), gaining access to the top tiers of the ranks will require a
referendum.

### Whitelisting

Polkadot OpenGov allows the Fellowship to authorize a new origin (known as "Whitelisted-Caller") to
execute with Root-level privileges for calls that have been approved by the Fellowship (currently
only level-three fellows and above can vote for whitelist calls).

The [Whitelist](https://paritytech.github.io/substrate/master/pallet_whitelist/) pallet allows one
Origin to escalate the privilege level of another Origin for a certain operation. The pallet
verifies two things:

- The origin of the escalation is the Whitelisted-Root (i.e. that the referendum passed on this
  track), and
- The whitelist contains the given proposal (in the configuration of Polkadot OpenGov, it gets there
  via a separate Fellowship referendum).

If both conditions are true, the operation executes with Root-level privileges.

This system enables a new parallel Track (Whitelisted-Caller), whose parameters have less
restrictive passing parameters than Root in the short term. Through an open and transparent process,
a body of global experts on the {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}
protocol have determined that the action is both safe and time-critical.

:::info Submitting Whitelisted Proposals

For more information about how to submit a whitelisted proposal see the
[dedicated advanced how-to guides](./learn-guides-polkadot-opengov.md#submitting-a-referendum-on-the-whitelisted-caller-track).

:::

### Becoming a Polkadot Technical Fellowship Member

Currently, the only way to become a fellowship member is through a referenda. To get added as a
member of "Rank 1", an existing member of the fellowship needs to submit a referendum with the
preimage of a batch call that has `fellowshipCollective.addMember` and
`fellowshipCollective.promoteMember` on "2/Proficients" track. On Polkadot-JS UI for Polkadot
Collectives, navigate to Governance > Fellowship > Referenda and click on "Add Preimage". This
preimage can be submitted by anyone.

![fellowship-add-promote-member-preimage](../assets/fellowship-add-member-preimage.png)

After the preimage is successfully noted, navigate to Governance > Fellowship > Referenda and click
on "Submit Proposal" (This button is active on the UI only if you have an account that belongs to
the Fellowship). Choose the appropriate track and the origin, and enter the preimage hash of the
batch call that adds and promotes the member.

![fellowship-add-promote-member-proposal](../assets/fellowship-add-member-proposal.png)

After the referendum is successfully executed, the member is added to the fellowship with "rank 1".
For example, check the [Referenda 23](https://collectives.subsquare.io/fellowship/referenda/23) on
the Collectives parachain. If a member has to be added and promoted to “rank 5”, the proposal has to
be submitted through track “6/Senior Experts” (Always a track with a rank higher). For example,
check the [Referenda 25](https://collectives.subsquare.io/fellowship/referenda/25) on the
Collectives parachain.

Future plans include that public members can apply to become a Fellowship candidate by placing a
small deposit (which will be returned once they become members). Their candidacy will go through a
referendum to be approved to become a member.

## Resources

- [Democracy Pallet](https://github.com/paritytech/substrate/tree/master/frame/democracy/src)
- [Governance v2](https://medium.com/polkadot-network/gov2-polkadots-next-generation-of-decentralised-governance-4d9ef657d11b)
- [Polkadot Direction](https://matrix.to/#/#Polkadot-Direction:parity.io)
- [Kusama Direction](https://matrix.to/#/#Kusama-Direction:parity.io)
- [PolkAssembly](https://polkadot.polkassembly.io/)

---

:::info Polkadot-JS Guides

If you are an advanced user, see the
[Polkadot-JS guides about OpenGov](./learn-guides-polkadot-opengov.md).

:::


---
id: learn-proxies-pure
title: Pure Proxy Accounts
sidebar_label: Pure Proxy Accounts
description: Pure Proxy Accounts on Polkadot.
keywords: [proxy, proxies, proxy accounts, pure proxy, anonymous proxy]
slug: ../learn-proxies-pure
---

Pure proxies are very different from other proxy types. The proxies we described so far are
_existing accounts_ assigned as proxies by a primary account. These proxies act on behalf of the
primary account, reducing the exposure of the primary account's private key. Remember, the more
often we use an account's private key to sign transactions, the more we expose that key to the
internet, increasing the visibility of that account. The purpose of a proxy is thus to draw the
attention of potential attackers away from the primary account, as proxies' private keys will be
used most of the time to perform actions on behalf of the primary account.

![anonymous proxies](../assets/proxy-vs-anon.png)

Pure proxies are new accounts that are _created_ (not assigned) by a primary account. That primary
account then acts as _any_ proxy on behalf of the pure proxy. Pure proxies are **keyless
non-deterministic accounts** as they do not have a private key but they have an address that is
randomly generated. Also, in some sense, nobody owns a pure proxy as nobody has a private key to
control them.

:::info Pure proxies were called anonymous proxies

Pure proxies are not anonymous because they have an address that is spawned by a primary account
acting as _any_ proxy. Even if the _any_ proxy changes, it is still possible to find who generated
the _anonymous_ proxy by going backward using a block explorer. There was thus the need to change
the name of _anonymous_ proxy. People suggested _keyless accounts_ since they do not have a private
key and are proxied accounts. However, multisig accounts are also keyless (but deterministic).
Moreover, even if _anonymous_ proxies are proxied accounts, they can still act as proxies and
control other accounts via proxy calls (see multisig example below). Thus, the name that has been
chosen is **pure proxy**. If you want to know more about the reasoning behind renaming of pure
proxies, see the discussion in [this PR](https://github.com/paritytech/substrate/pull/12283) or the
discussion on
[Polkadot forum](https://forum.polkadot.network/t/parachain-technical-summit-next-steps/51/14).

:::

## Use of Pure Proxy

The use of the _pure proxy_ is strictly bound to the relationship between the _pure proxy_ and the
_any_ proxy. Note that the _any_ proxy does not necessarily be the one who created the _pure proxy_
in the first place. Hence, _pure proxies_ are not really owned by somebody, but they can be
controlled. Once that relationship between the _pure proxy_ and its _any_ proxy is broken, the _pure
proxy_ will be inaccessible (even if visible on the Polkadot-JS UI). Also, _pure proxies_ are
non-deterministic, meaning that if we lose one _pure proxy_, the next one we create from the same
primary account will have a different address.

_Pure proxies_ cannot sign anything because they do not have private keys. However, although they do
not have private keys and cannot sign any transaction directly, they can act as proxies (or better,
proxy channels) within `proxy.proxy` calls (proxy calls). For example, it is possible to have _pure
proxies_ within a multisig. Using proxy calls, it is possible to use the _any_ proxy to call the
_pure_ proxy, which in turn will do a multisig call. More about this later on.

:::danger

Once you remove the relationship with _any_ proxy, the _pure_ proxy will be inaccessible. Also,
_pure_ proxies cannot sign for anything.

:::

## Why Pure Proxy?

Pure proxies have important benefits that we discuss below:

- **Enhanced Security**: Pure proxies cannot be stolen because they do not have private keys. The
  only accounts that have full access to the _pure_ proxies are _any_ proxies. Security can be
  further increased if the _any_ proxy is a multi-signature account.
- **Simplified and Secure Account Management**: Pure proxies can simplify the management of complex
  account relationships at a corporate level.
- **Multi-signature Account Management**: Pure proxies are useful to efficiently manage
  multi-signature (multisig) accounts. In fact, multi-signature accounts are deterministic, which
  means that once a multisig is created the signatories cannot be changed. If one of the signatories
  wants to leave the multisig, a new multisig must be created. This is inconvenient, especially at
  corporate-level management where the chance of replacing someone within a multisig can be high.
  _Pure_ proxies allow keeping the same multisig when the signatories change.

---

:::info Polkadot-JS Guides

If you are an advanced user, see the
[Polkadot-JS guides about pure proxy accounts](./learn-guides-accounts-proxy-pure.md).

:::
---
id: learn-proxies
title: Proxy Accounts
sidebar_label: Proxy Accounts
description: Proxy Accounts on Polkadot.
keywords: [proxy, proxies, proxy accounts, proxy types, staking proxy]
slug: ../learn-proxies
---

import RPC from "./../../components/RPC-Connection";

Proxies are helpful because they let you delegate efficiently and add a layer of security. Rather
than using funds in a single account, smaller accounts with unique roles can complete tasks on
behalf of the main stash account. Proxies can be _hotter_ than the initial account, which can be
kept cold, but the _weight_ of the tokens in the colder account can be used by the hotter accounts.
This increases the security of your accounts by minimizing the number of transactions the cold
account has to make. This also drives attention away from the stash account, although it is possible
to determine the relationship between the proxy and the proxied account.

From the security perspective, we can imagine proxies as bodyguards of a VIP, loyal and ready to
risk their lives to ensure the VIP's protection. But proxies are also useful in other contexts such
as efficient account management at the corporate level. They also provide an elegant solution to
change signatories within multi-signature accounts, and they can be used within proxy calls and
nested proxy calls. In this page we will explore all these interesting use cases of proxies within
the {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} ecosystem.

Shown below is an example of how you might use these accounts. Imagine you have one stash account as
your primary token-holding account and don't want to access it very often, but you want to
participate in staking to earn staking rewards. You could set one of your existing accounts as a
staking proxy for that stash account, and use your staking proxy to sign all staking-related
transactions.

![proxies](../assets/stash-vs-stash-and-staking-proxy.png)

Having a staking proxy will make the stash account isolated within the staking context. In other
words, the account assigned as a staking proxy can participate in staking on behalf of that stash.
Without the proxy you will need to sign all the staking-related transactions with the stash. If the
proxy is compromised, it doesn't have access to transfer-related transactions, so the stash account
could just set a new proxy to replace it. You can also monitor proxies by
[setting a time-delay](#time-delayed-proxy).

Creating multiple proxy accounts that act for a single account, lets you come up with more granular
security practices around how you protect private keys while still being able to actively
participate in the network.

:::info

The **maximum number of proxies** allowed for a single account is
{{ polkadot: <RPC network="polkadot" path="consts.proxy.maxProxies" defaultValue={32}/>. :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.proxy.maxProxies" defaultValue={32}/>. :kusama }} You
can have the same proxy for multiple accounts.

:::

## Proxy Types

When a proxy account makes a transaction,
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} filters the desired transaction to
ensure that the proxy account has the appropriate permission to make that transaction on behalf of
the proxied account. For example, staking proxies have permission to do only staking-related
transactions.

When you set a proxy, you must choose a type of proxy for the relationship.
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} offers:

- **Any**: allow any transaction, including balance transfers. In most cases, this should be avoided
  as the proxy account is used more frequently than the cold account and is therefore less secure.
- **Non-transfer**: allow any type of transaction except
  [balance transfers](learn-balance-transfers.md) (including [vested](learn-DOT.md/#vesting)
  transfers). Hence, this proxy does not have permission to access calls in the Balances and XCM
  pallet.
- **Governance**: allow to make transactions related to governance.
- **Nomination pool**: allow transactions pertaining to
  [Nomination Pools](./learn-nomination-pools.md).
- **Staking**: allow all staking-related transactions. The stash account is meant to stay in cold
  storage, while the staking proxy account makes day-to-day transactions like setting session keys
  or deciding which validators to nominate. Visit the
  [Advanced Staking Concepts page](./learn-staking-advanced.md/#staking-proxies) for more detailed
  information about staking proxies.
- **Identity Judgement**: allow registrars to make judgments on an account's identity. If you are
  unfamiliar with judgment and identities on chain, please refer to
  [this page](learn-identity.md#judgements). This proxy can only access `provide_judgement` call
  from the Identity pallet along with the calls from the Utility pallet.
- **Cancel**: allow to reject and remove any time-delay proxy announcements. This proxy can only
  access `reject_announcement` call from the Proxy pallet.
- **Auction**: allow transactions pertaining to parachain auctions and crowdloans. The Auction proxy
  account can sign those transactions on behalf of an account in cold storage. If you already set up
  a Non-transfer proxy account, it can do everything an Auction proxy can do. Before participating
  in a crowdloan using an Auction proxy, it is recommended that you check with the respective
  parachain team for any possible issues pertaining to the crowdloan rewards distribution. Auction
  proxy can access Auctions, Crowdloan, Registrar and Slots pallets.

## Proxy Deposits

Proxies require deposits in the native currency to be created. The deposit is required because
adding a proxy requires some storage space on-chain, which must be replicated across every peer in
the network. Due to the costly nature of this, these functions could open up the network to a
Denial-of-Service attack. To defend against this attack, proxies require a deposit to be reserved
while the storage space is consumed over the lifetime of the proxy. When the proxy is removed, so is
the storage space, and therefore the deposit is returned.

The required deposit amount for `n` proxies is equal to:

`ProxyDepositBase` + `ProxyDepositFactor` \* `n`

where the `ProxyDepositBase` is the required amount to be reserved for an account to have a proxy
list (creates one new item in storage). For every proxy the account has, an additional amount
defined by the `ProxyDepositFactor` is reserved as well (appends 33 bytes to storage location). The
`ProxyDepositBase` is
{{ polkadot: <RPC network="polkadot" path="consts.proxy.proxyDepositBase" defaultValue={200080000000} filter="humanReadable"/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.proxy.proxyDepositBase" defaultValue={666933332400} filter="humanReadable"/> :kusama }}
and the `ProxyDepositFactor` is
{{ polkadot: <RPC network="polkadot" path="consts.proxy.proxyDepositFactor" defaultValue={330000000} filter="humanReadable"/>. :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.proxy.proxyDepositFactor" defaultValue={1099998900} filter="humanReadable"/>. :kusama }}

## Time-delayed Proxy

We can add a layer of security to proxies by giving them a delay time. The delay will be quantified
in blocks. {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} has approximately 6
seconds of block time. A delay value of 10 will mean ten blocks, which equals about one minute
delay.

The proxy will announce its intended action and will wait for the number of blocks defined in the
delay time before executing it. Within this time window, the intended action may be canceled by
accounts that control the proxy.

Announcing `n` calls using a time-delayed proxy also requires a deposit of the form:

`announcementDepositBase` + `announcementDepositFactor` \* `n`

where the `announcementDepositBase` is the required amount to be reserved for an account to announce
a proxy call. For every proxy call the account has, an additional amount defined by the
`announcementDepositFactor` is reserved as well. The `announcementDepositBase` is
{{ polkadot: <RPC network="polkadot" path="consts.proxy.announcementDepositBase" defaultValue={200080000000} filter="humanReadable"/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.proxy.announcementDepositBase" defaultValue={666933332400} filter="humanReadable"/> :kusama }}
and the `announcementDepositFactor` is
{{ polkadot: <RPC network="polkadot" path="consts.proxy.announcementDepositFactor" defaultValue={660000000} filter="humanReadable"/>. :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.proxy.announcementDepositFactor" defaultValue={2199997800} filter="humanReadable"/>. :kusama }}

---

:::info Polkadot-JS Guides

If you are an advanced user, see the
[Polkadot-JS guides about proxy accounts](./learn-guides-accounts-proxy.md). You can find
information about creating and removing proxies, and more.

:::


---
id: learn-redenomination
title: Redenomination of DOT
sidebar_label: Redenomination of DOT
description: Everything about the DOT Token Redenomination.
keywords: [DOT, redenomination]
slug: ../learn-redenomination
---

On August 21, 2020, the redenomination of DOT, the native token on Polkadot, occurred. From this
date, one DOT (old) equals 100 new DOT.

:::info Denomination Day

The DOT redenomination took place on 21 August 2020, known as Denomination Day, at block number
1_248_328.

:::

While [DOT](../learn/learn-DOT.md) is the unit of currency on Polkadot that most people use when
interacting with the system, the smallest unit of account is the Planck. A Planck's relation to DOT
is like the relation of a Satoshi to Bitcoin. Before 21 August, the DOT was denominated as 1e12
Plancks, that is, twelve decimal places. After Denomination Day, DOT is denominated as 1e10 Plancks,
as in, ten decimal places. DOT denominated to twelve decimal places is referred to as "DOT (old)"
and DOT denominated to ten decimal places is generally referred to as "DOT". When the difference
must be made explicit, the current ten-decimal-denominated DOT is referred to as "_New DOT_".

:::note Redenomination Explainer

Check out our
[technical explainer video that explains more of Redenomination](https://www.youtube.com/watch?v=xXIcnBV4uUE&list=PLOyWqupZ-WGuAuS00rK-pebTMAOxW41W8&index=22&ab_channel=Polkadot).

:::

The change in denomination, henceforth referred to as the _redenomination_, was voted on by the
community of DOT holders. The community decided between four options, to change the DOT denomination
by a factor of ten, one hundred, one thousand, or not at all. The end result was to change the
denomination by a factor of one hundred.

The overall effect of this change was that the number of Polkadot's smallest unit, the Planck,
remained constant, while the DOT balance for all holders was increased by a factor of one hundred.
As one can see from the example below, the number of Plancks a user has does not change, only the
number of Plancks that constitute a single DOT. A user with 1_000_000_000_000 Plancks still has the
same number of Plancks but will have 100 DOT under the new denomination, as opposed to one DOT under
the old denomination.

```
   Before the change the decimal was here
   v
  1.000000000000 DOT

  100.0000000000 DOT
     ^
     After the change the decimal is here
```

:::note

There are no state changes with redenomination. There are no transfers. The real change regards the
social consensus around where to put the decimal place when we talk about what constitutes a DOT.

:::

## Origins

The initial vote for redenomination occurred as a
[referendum](https://kusama.polkassembly.io/referendum/52) on the Kusama blockchain. The referendum
was summarized as having four effects if approved by KSM holders.

:::info Referendum Summary

- The total allocations of DOT will increase one hundred times from 10 million to 1 billion.
- DOT allocation balances will increase by a factor of one hundred, such that 1 DOT will be 100 DOT.
- The distribution of DOT does not change, and holders of DOT still own an equal share of the
  network as before the change.
- The precision of DOT will change from 12 decimal places to 10 decimal places.
- The main benefit of this change is to avoid using small decimals when dealing with DOT and to
  achieve an easier calculation system.

:::

The initial referendum was proposed before the Polkadot genesis block, assuming that making a
redenomination would be simpler before the Polkadot chain was live. However, many in the community
pointed out the disconnect between the two networks and how it was unfair for holders of DOT to be
impacted by a vote by a different token holder set. For this reason, Web3 Foundation
[decided to make a new vote on Polkadot](https://polkadot.network/results-of-dot-redenomination-referendum/)
when it went live, although the Kusama vote ended with a majority in favor of the redenomination
change.

Web3 Foundation summarized the decision not to change:

:::note

However, given the non-negligible amount of opposition, including from some within the ranks of Web3
Foundation and Parity, **the Foundation decided that we cannot, in good faith, sponsor the
redenomination.**

:::

## The Vote

After the genesis block of Polkadot was created and the network was running with a decentralized
community of validators securing the network, Web3 Foundation decided to put the redenomination
topic up for a vote again. This time, the vote was explicitly binding &mdash; meaning that it would
be executed if voted through. In comparison, the vote on Kusama was non-binding to capture a signal
without a direct way to affect the Polkadot chain.

Based on the feedback received during the Kusama referendum, the
[Polkadot vote](https://polkadot.network/the-first-polkadot-vote/) was held as an approval vote,
with four available options. DOT holders could issue votes for any configuration of the four
options: no change, a change of 10x, a change of 100x, or a change of 1000x. The voting logic was
contained in a specially-built Substrate pallet included in Polkadot's runtime for this poll.

:::info Summary of the Vote

- Any combination of the four options may have been approved by the voter. There was no need to
  select only one option.
- Approving all or none of the options was equivalent and did not affect the outcome.
- All voters could alter their votes any number of times before the close of the poll.
- No discretionary lock-voting was in place; all DOT used to vote counts the same.
- Voting was made on a per-account basis; a single account must have voted the same way and could
  not split its vote.
- This vote did not affect any economics of the Polkadot platform. As in, staking rewards,
  inflation, effective market capitalization, and the underlying balances of every account remained
  completely unchanged. It was “merely” about what units the network uses to denominate the balances
  into “DOT”.

:::

With a voting period of two weeks set, the redenomination was now in the hands of the Polkadot
community for a final, binding decision.

## The Outcome

![redenomination](../assets/redenomination.png)

After two weeks of voting, the [results](https://polkadot.network/the-results-are-in/) of the
redenomination vote were tallied. About one-third of the total DOT in the network participated in
the vote. The redenomination proposal passed with 86% of the voters favoring a 100x factor increase
(or two decimal places of precision loss).

Polkadot's redenomination then took place on 21 August, now known as Denomination Day, at block
#1_248_328.

### What This Means for the Community

If you are a DOT holder or user of the network, then you do not need to take any action. The DOT
redenomination was a purely front-end change. You still hold the same amount of Plancks after the
change, but now it will appear that you hold 100x more DOT. This change applies proportionally to
every account.

### What This Means for Builders of Tools

If you are the builder of a tool that consumes the
[`@polkadot/api`](https://yarnpkg.com/package/@polkadot/api) package &mdash; then there should be no
real changes to be made in your application. The denomination is technically a cosmetic change, and
every value remains a constant amount of Plancks.

However &mdash; if you are a builder of a tool that displays DOT balances to users (e.g. a wallet)
or handles DOT balances in an off-chain or custodial way, then you will need to ensure that you
display the correct denomination of DOT to users.

Please see our
[Ecosystem Redenomination Guide](https://docs.google.com/document/d/1yAzoDh99PgR_7dYAKTWLMVu2Fy5Ga-J6t9lof4f4JUw/edit#)
for recommendations.

Please reach out to [support@polkadot.network](mailto:support@polkadot.network) if you need any
assistance in making sure your software is compatible with the redenomination.



---
id: learn-runtime-upgrades
title: Runtime Upgrades
sidebar_label: Runtime Upgrades
description: Forkless Runtime Upgrades on Polkadot.
keywords: [runtime, upgrades, releases, forkless]
slug: ../learn-runtime-upgrades
---

Runtime upgrades allow {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} to change the
logic of the chain without the need for a hard fork.

## Forkless Upgrades

You may have encountered the term "hard fork" before in the blockchain space. A **hard fork** occurs
when a blockchain's logic changes such that nodes that do not include the new changes cannot remain
in consensus with nodes that do. Such changes are backward incompatible. Hard forks can be political
due to the nature of the upgrades and logistically demanding due to the number (potentially
thousands) of nodes in the network that need to upgrade their software. Thus, hard forking is slow,
inefficient, and error-prone due to the levels of offline coordination required and, therefore, the
propensity to bundle many upgrades into one large-scale event.

By using Wasm in Substrate (the framework powering Polkadot, Kusama, and many connecting chains),
parachains are given the ability to upgrade their runtime (a chain's "business logic") without hard
forking.

Rather than encoding the runtime in the nodes,
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} nodes contain a WebAssembly
[execution host](learn-polkadot-host). They maintain consensus on a very low-level and
well-established instruction set. Upgrades can be small, isolated, and very specific by deploying
Wasm on-chain and having nodes auto-enact the new logic at a particular block height.

The {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} runtime is stored on the
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} blockchain itself.
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} can upgrade its runtime by upgrading
the logic stored on-chain and removes the coordination challenge of requiring thousands of node
operators to upgrade in advance of a given block number. Polkadot stakeholders propose and approve
upgrades through the [on-chain governance](learn-governance.md) system, which also enacts them
autonomously.

As a result of storing the Runtime as part of the state, the Runtime code itself becomes state
sensitive, and calls to Runtime can change the Runtime code itself. Therefore, the Polkadot Host
must always ensure it provides the Runtime corresponding to the state in which the entry point has
been called.

## Client Releases

The existing runtime logic is followed to update the [Wasm](./learn-wasm.md) runtime stored on the
blockchain to a new version. The upgrade is then included in the blockchain itself, meaning that all
the nodes on the network execute it. Generally, there is no need to upgrade your nodes manually
before the runtime upgrade, as they will automatically start to follow the new logic of the chain.
Nodes only need to be updated when the runtime requires new host functions, or there is a change in
networking or consensus.

Transactions constructed for a given runtime version will not work on later versions. Therefore, a
transaction constructed based on a runtime version will not be valid in later runtime versions. If
you can’t submit a transaction before the upgrade, it is better to wait and construct it afterward.

Although upgrading your nodes is generally not necessary to follow an upgrade, we recommend
following the {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} releases and upgrading
promptly, especially for high-priority or critical releases.

:::info New Client Releases

The details about the latest client releases can be found in the
[releases section on the Polkadot repository](https://github.com/paritytech/polkadot-sdk/releases).
A detailed analysis for client releases can be viewed on the
[Polkadot Forum](https://forum.polkadot.network/tag/release-analysis).

:::

### Runtime vs Client versions

The runtime and client versions are distinct from each other. The runtime versioning typically looks
like `network-xxxx`, whereas the client versioning looks like `vx.x.xx`. For instance, the runtime
version shown on the top left section of Polkadot-JS UI below is `kusama-9370`, and the client
(node) version shown on the top right section is `v0.9.36`.

![Runtime vs Client versioning](./../assets/runtime-node-version.png)

:::info Querying runtime and client versions

The runtime version can be queried on-chain through Polkadot-JS UI by navigating to the Developer
tab > Chain State > Storage > system and query `lastRuntimeUpgrade()`.

The node version can be queried by navigating to the Developer tab > RPC calls > system and query
`version()`.

:::

## Runtime Upgrades for Various Users

### For Infrastructure Providers

Infrastructure services include but are not limited to the following:

- [Validators](../maintain/maintain-guides-how-to-upgrade.md)
- API services
- Node-as-a-Service (NaaS)
- General infrastructure management (e.g. block explorers, custodians)
- [Wallets](./wallets)

For validators, keeping in sync with the network is key. At times, upgrades will require validators
to upgrade their clients within a specific time frame, for example, if a release includes breaking
changes to networking. It is essential to check the release notes, starting with the upgrade
priority and acting accordingly.

General infrastructure providers, aside from following the
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} releases and upgrading in a timely
manner, should monitor changes to runtime events and auxiliary tooling, such as the
[Substrate API Sidecar](https://github.com/paritytech/substrate-api-sidecar).

Transactions constructed for runtime `n` will not work for any other runtime `>n`. If a runtime
upgrade occurs before broadcasting a previously constructed transaction, you will need to
reconstruct it with the appropriate runtime version and corresponding metadata.

### For [Nominators](../maintain/maintain-guides-how-to-nominate-polkadot.md)

Runtime upgrades don't require any actions by a nominator, though it is always encouraged to keep
up-to-date and participate with the latest runtime upgrade motions and releases while keeping an eye
on how the nodes on the network are reacting to a new upgrade.

## Monitoring Runtime Changes

You can monitor the chain for upcoming upgrades. The client release notes include the hashes of any
proposals related to any on-chain upgrades for easy matching. Monitor the chain for:

1. `democracy(Started)` events and log `index` and `blockNumber`. This event indicates that a
   referendum has started (although it does not mean it is a runtime upgrade). Get the referendum
   info\*; it should have a status of `Ongoing`. Find the ending block number (`end`) and the
   enactment `delay` (delay). If the referendum passes, it will execute on block number
   `end + delay`.
2. `democracy(Passed)`, `democracy(NotPassed)`, or, `democracy(Cancelled)` events citing the index.
   If `Passed`, you need to look at the `scheduler(Scheduled)` event in the same block for the
   enactment block.
3. `democracy(PreimageNoted)` events with the same hash as the `ReferendumInfoOf(index)` item. This
   may be up to the last block before execution, but it will not work if this is missing.
4. `democracy(Executed)` events for actual execution. In the case of a runtime upgrade, there will
   also be a `system(CodeUpdated)` event.

You can also monitor [Polkassembly](https://polkadot.polkassembly.io/) for discussions on on-chain
proposals and referenda.

\* E.g. via `pallets/democracy/storage/ReferendumInfoOf?key1=index&at=blockNumber` on Sidecar.



---
id: learn-sassafras
title: "Polkadot Block Production: SASSAFRAS"
sidebar_label: SASSAFRAS
description: The Consensus Mechanism of Polkadot.
keywords:
  [
    consensus,
    proof of stake,
    nominated proof of stake,
    hybrid consensus,
    block production,
    sassafras,
    babe,
  ]
slug: ../learn-sassafras
---

SASSAFRAS (Semi Anonymous Sortition of Staked Assignees For Fixed-time Rhythmic Assignment of Slots)
(aka SASSY BABE or BADASS BABE), is an extension of BABE and acts as a constant-time block
production protocol. This approach tries to address the shortcomings of
[BABE](./learn-consensus.md#block-production-babe) by ensuring that exactly one block is produced
with time-constant intervals. The protocol utilizes zk-SNARKs to construct a
ring-[VRF](./learn-cryptography.md#vrf) and is a work in progress.

This page will be updated as progress ensues.

## Resources

- [Web3 Foundation Research page](https://research.web3.foundation/Polkadot/protocols/block-production/SASSAFRAS)
  about SASSAFRAS


---
id: learn-spree
title: SPREE
sidebar_label: SPREE
description: Fundamentals of SPREE.
keywords: [execution, SPREE, wasm, runtime]

slug: ../learn-spree
---

Shared Protected Runtime Execution Enclaves (SPREE) sometimes referred to as "trust wormholes," are
fragments of logic comparable to runtime modules in Substrate, but live on the
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} Relay Chain and maybe opted into by
parachains.

SPREE in brief was described with the following properties and functions:

- Parachains can opt-in to special runtime logic fragments (like smart contracts).
- These fragments have their own storage and own [XCM](learn-xcm.md) endpoint.
- All instances across parachains have identical logic.
- It executes alongside parachain logic.
- Protected: storage can not be altered by parachain logic; messages can not be faked from them by
  parachains.

## Origin

On 28 March, 2019 u/Tawaren, a member of the Polkadot community, made a post on
[r/dot](https://www.reddit.com/r/dot/) called "SmartProtocols Idea" and laid out a proposal for
[Smart Protocols](https://www.reddit.com/r/dot/comments/b6kljn/smartprotocols_idea/). The core
insight of the post was that XCMP had a complication in that it was difficult to verify and prove
code was executed on a parachain without trust. A solution was to install the SmartProtocols in the
Relay Chain that would be isolated blobs of code with their own storage per instance that could only
be changed through an interface with each parachain. SmartProtocols are the precursor to SPREE.

## What is a SPREE module?

SPREE modules are fragments of logic (in concrete terms they are blobs of
[WebAssembly](learn-wasm.md) code) that are uploaded onto
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} through a governance mechanism or by
parachains. Once the blob is uploaded to
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}, all other parachains can decide to
opt-in to the logic. The SPREE module would retain its own storage independent of the parachain, but
would be callable through an interface with the parachain. Parachains will send messages to the
SPREE module synchronously.

SPREE modules are important to the overall XCMP architecture because they give a guarantee to the
code that will be executed on destination parachains. While XCMP guarantees the delivery of a
message, it does not guarantee what code will be executed, i.e. how the receiving parachain will
interpret the message. While XCMP accomplishes trustless message passing, SPREE is the trustless
interpretation of the message and a key part of the usefulness of XCMP.

SPREE modules are like recipes in cookbooks. For example, if we give an order to a cook to make a
soufflé, and we’re decently confident in the ability of the cook, we have a vague idea of what will
be made but no actual surety of how it will be made. However, let’s say that a cook has the “Soufflé
Maker’s Manual” on their bookshelf and has committed themselves to only make souffles from this
book. Now we can also consult the same book that the cook has, and we have a precise understanding
of what will happen when we tell the cook to make a soufflé. In this example, “make a soufflé” was
the message in XCMP and the cookbook was the SPREE module.

In concrete terms, SPREE modules could be useful for various functionality on
{{ polkadot: Polkadot. :polkadot }}{{ kusama: Kusama. :kusama }}. One suggested use case of SPREE
modules is for a trustless decentralized exchange that is offered as functionality to any parachain
without any extra effort from parachain developers. One can imagine this working by having a SPREE
module that exposes the interface for the incrementing and decrementing of balances of various
assets based on a unique identifier.

## Why?

Sending messages across parachains in XCMP only ensures that the message will be delivered but does
not specify the code that will be executed, or how the message will be interpreted by the receiving
parachain. There would be ways around this such as requesting a verifiable receipt of the execution
from the receiving parachain, but in the naked case, the other parachain would have to be trusted.
Having shared code that exists in appendices that the parachain can opt-in to resolves the need for
trust and makes the execution of the appendices completely trustless.

SPREE would be helpful to ensure that the same logic is shared between parachains in the SPREE
modules. An especially relevant use case would revolve around the use of token transfers across
parachains in which it is important that the sending and receiving parachains agree about how to
change the total supply of tokens and a basic interface.

## Example

![spree example](../assets/SPREE/spree_module.png)

The diagram above is a simplification of the
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} system.

In this diagram, we see that the Wasm code for SPREE module "X" has been uploaded to the
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} Relay Chain. The two cylinders "A"
and "B" represent two distinct parachains that have both opted-in to this SPREE module creating two
distinct instances of it with their own XCMP endpoints "A.X" and "B.X".

In the example, we assume that this SPREE module "X" contains the functionality for incrementing or
decrementing the balance of a particular asset that is unique to this module.

By initiating a transaction at A.X to decrease a particular balance by 1, a message over XCMP can be
trustlessly sent to B.X to increase a balance by 1.

Collators, represented as the green triangle are responsible for relaying this message from
parachain A to parachain B, as well as maintaining the storage for each particular instance of A.X
and B.X for their respective parachains. They provide proofs of valid state transitions to the Relay
Chain validators represented as blue diamonds.

Validators can validate the correct state transitions of SPREE modules A.X and B.X by being provided
with the previous state root of the SPREE module instances, the data of the XCMP message between the
instances, and the next state root of the instance. They do this validation by checking it against
the `validate` function as provided by the SPREE module API. Collators are expected to be able to
provide this information to progress their parachains.


---
id: learn-staking-advanced
title: Advanced Staking Concepts
sidebar_label: Advanced Staking Concepts
description: Advanced Concepts about Staking on Polkadot.

keywords:
  [
    staking,
    stake,
    nominate,
    nominating,
    NPoS,
    proxies,
    payouts,
    simple payouts,
    rewards,
    staking miner,
    phragmén,
  ]
slug: ../learn-staking-advanced
---

import RPC from "./../../components/RPC-Connection";

:::tip New to Staking?

Start your staking journey or explore more information about staking on
[Polkadot's Home Page](https://polkadot.network/staking/). Discover the new
[Staking Dashboard](https://staking.polkadot.network/#/overview) that makes staking much easier and
check this
[extensive article list](https://support.polkadot.network/support/solutions/articles/65000182104) to
help you get started. You can now stake on
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} natively with just
{{ polkadot: <RPC network="polkadot" path="query.nominationPools.minJoinBond" filter="humanReadable" defaultValue={10000000000}/> :polkadot }}
{{ kusama: <RPC network="kusama" path="query.nominationPools.minJoinBond" filter="humanReadable" defaultValue={1666666650}/> :kusama }}
and earn staking rewards. For additional information, check out
[this blog post](https://polkadot.network/blog/nomination-pools-are-live-stake-natively-with-just-1-dot/).

:::

This page is meant to be an advanced guide to staking with
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}. For a more general introduction,
checkout the [Introduction to Staking](./learn-staking.md) page.

## Staking Proxies

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} makes it possible to create accounts
having special permissions also called **proxy accounts**. For mode details about proxy accounts
visit the [dedicated page](./learn-proxies.md) on this wiki.

Proxy accounts are special accounts which can sign
[**extrinsic calls**](./learn-extrinsics.md/#pallets-and-extrinsics) made to specific **pallets** on
behalf of the proxied account. There is thus the possibility to create staking proxy accounts that
can be used to sign extrinsic calls specific to the staking, session and utility pallets.

Staking on {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} is not a set-and-forget
action, as a nominator you will need to monitor the performance of your validators and make changes
if needed. There will be this transactions such as nominating that will be needed to regularly
signed. Each time you sign with an account, in the case of hot accounts, you expose the private key
of that account to the internet with consequent risk of attack. A hot stash will be exposed all the
time a transaction is signed. Even in the case of a cold stash created with a Ledger device, signing
with the stash will build a transaction history that might tell something about your habits and
preferences, or even your location.

Ideally, accounts with high economic power like the stash must be and remain as isolated as
possible. With a staking proxy, the stash account is fully isolated when signing for staking-related
transactions. The proxy private key will be used to sign staking-related transactions, the stash
private key will stay isolated and the staking transaction history will be built by the proxy.

![stash-stakingProxy](../assets/stash-vs-stash-and-staking-proxy.png)

For a practical perspective we need to use only one account and remember one password to sign for
all staking-related transactions. From a security perspective who controls the staking proxy
controls our staking actions.

It is important to remember that actions that can be performed by the proxy accounts are limited,
and in the case of staking proxy, extrinsic calls to the balances pallet cannot be signed. This
means it is not possible to do balance transfers on the proxied account through a staking proxy.

Note that to change the staking proxy you will need to sign with the stash or an _any_ proxy.

## Bags List

:::info

On Polkadot and Kusama, the instance of the pallet
[Bags-List](https://paritytech.github.io/substrate/master/pallet_bags_list/) is named as
'voterList'.

For a demo about bags list see [this video tutorial](https://youtu.be/hIIZRJLrBZA).

:::

In {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}'s NPoS nomination intents are
placed in a semi-sorted list called [bags-list](https://github.com/paritytech/substrate/pull/9507).
{{ kusama: The bags list example below uses DOT for explaining the concepts. :kusama }} The
Bags-List substrate pallet is designed to be self-maintaining, with minimal effort from the
blockchain, making it extremely scalable. The bags list has two primary components, bags and nodes
(or nominators' accounts), with bags containing the nodes with bonded balance within a specific
range. In the figure below the 1st empty bag will contain nominators whose bonded balance is in the
range of 21 - 30 DOT, the 2nd bag 11 - 20 DOT, and the 3rd bag 0-10 DOT. The nomination intents are
the nominators' accounts with bonded tokens (in the example shown below, there are eight nomination
intents) that will be put inside each of those three bags depending on their stake.

![bags list example 0](../assets/bags-list-example-0.png)

The bags list is semi-sorted, meaning that sorting is only partially done. When the nomination
intents are submitted to the network, they are automatically put into each bag based on the number
of bonded tokens, but within each bag, those nodes are arranged based on the time they are inserted
and not based on their stake (see figure below). When the nomination intent of 19 DOT is submitted,
it gets placed at the last spot in the 2nd bag (shown in the yellow circle). The same scenario
applies for the node with 8 DOT (green circle) in the 3rd bag. Placing the node above all nodes with
a lesser stake requires an additional step (more on this later).

![bags list example 1](../assets/bags-list-example-1.png)

The mentioned two nodes (19 DOT and 8 DOT) have the option to move up in their respective bags,
which can put them in front of the nodes with less stake than them (see figure below). This action
must be done manually by submitting the `putInFrontOf` extrinsic within the `voterList` pallet
instance. Moreover, if the node with 19 DOT bonds an additional 2 DOT, that node will be put
automatically in the 1st bag (i.e. automatic `rebag`) because the total number of bonded tokens will
now be within the range of the 1st bag. That node with now 21 DOT will be put at the tail end of the
1st bag with the possibility to manually put itself in front of "older" nodes with less than 21 DOT
(if there are any).

![bags list example 2](../assets/bags-list-example-2.png)

If one decides to send staking rewards to the stash account and automatically bond them (i.e.
compounding the staking rewards), the position within a bag does not change automatically. The same
scenario applies to a slashing event, i.e., when a nominator gets slashed, their position within a
bag does not change. This might result in a scenario where the node is in the wrong bag and needs to
be placed in the right bag. To address this issue, any account on-chain can submit the
permissionless extrinsic `rebag` within the `voterList` pallet instance to update the positions of
the nodes that do not belong to their bag and place them in the correct one. To reiterate, actions
like bonding/unbonding tokens automatically rebag the nominator node, but events like staking
rewards/slashing do not. See the [bags-list](learn-nominator.md#bags-list) section for more
information.

The bags-list is capable of including an unlimited number of nodes, subject to the chain's runtime
storage. In the current staking system configuration, the bags list keeps
{{ polkadot: <RPC network="polkadot" path="query.staking.maxNominatorsCount" defaultValue={50000}/> :polkadot }}
{{ kusama: <RPC network="kusama" path="query.staking.maxNominatorsCount" defaultValue={20000}/> :kusama }}
nomination intents, of which, at most
{{ polkadot: <RPC network="polkadot" path="consts.electionProviderMultiPhase.maxElectingVoters" defaultValue={22500}/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.electionProviderMultiPhase.maxElectingVoters" defaultValue={20000}/> :kusama }}
come out as the electing nominators. See
[Staking Election Stages](learn-nominator.md#staking-election-stages) section for more info.

This means that only a portion of the nomination intents is kept. Once the nomination period ends,
the NPoS election system takes all nomination intents and their associated votes as input, and it
outputs a set of validators. The bags are iterated from the most staked to the least staked. If the
accounts are not appropriately sorted, this could leave the last touched bag to only be partially
iterated. Thus, in some edge cases, the order of the members within a bag is important. Continuing
with the example used in the previous figures, there are 8 nomination intents of which only 7 will
be kept. If the bags list stays semi-sorted (i.e. no accounts call the `putInFrontOf` and `rebag`
extrinsics), the nomination of the node with 8 DOT in the 3rd bag will not be considered while that
of the preceding node with 5 DOT will be. Nomination of the node with 8 DOT will be kept only if it
puts itself in front of the one with 5 DOT. Note how the nomination of the node with 19 DOT in the
2nd bag will be considered regardless of changing its position inside the bag. The sorting
functionality of nomination intents using bags is extremely important for the
[long-term improvements](https://gist.github.com/kianenigma/aa835946455b9a3f167821b9d05ba376) of the
staking/election system.

![bags list example 3](../assets/bags-list-example-3.png)

:::caution Minimum active nomination threshold to earn rewards is dynamic

Submitting a nomination intent does not guarantee staking rewards. The stake of the top
{{ polkadot: <RPC network="polkadot" path="consts.electionProviderMultiPhase.maxElectingVoters" defaultValue={22500}/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.electionProviderMultiPhase.maxElectingVoters" defaultValue={20000}/>  :kusama }}
nominators is applied to the validators in the active set. To avail of staking rewards, ensure that
the number of tokens bonded is higher than the minimum active bond. For more information, see the
[nominator guide](learn-nominator.md).

:::

The "election solution" which is a connected graph between nominators and validators with the stake
as edge weights, has to meet certain requirements, such as maximizing the amount of stake to
nominate validators and distributing the stake backing validators as evenly as possible. The
objectives of this election mechanism are to maximize the security of the network, and achieve fair
representation of the nominators. If you want to know more about how NPoS works (e.g. election,
running time complexity, etc.), please read
[here](http://research.web3.foundation/en/latest/polkadot/NPoS.html).

## Rewards Distribution

:::info

The general rule for rewards across validators is that two validators get paid essentially the same
amount of tokens for equal work, i.e. they are not paid proportional to their total stakes. There is
a probabilistic component to staking rewards in the form of
[era points](../maintain/maintain-guides-validator-payout.md##era-points) and
[tips](learn-transaction-fees.md#fee-calculation) but these should average out over time.

:::

Validators are paid the same regardless of stake backing them. Validators with less stake will
generally pay more to nominators per-token than the ones with more stake. This gives nominators an
economic incentive to gradually shift their preferences to lower-staked validators that gain a
sufficient amount of reputation. A consequence of this is that the stake across validators will be
as evenly distributed as possible which avoids concentration of power among a few validators. In the
long term, validators will have similar levels of stake, with the stake being higher for validators
with higher reputation. A nominator who is willing to risk more by backing a validator with a lower
reputation will get paid more, provided there are no slashing events.

Before distributing rewards to nominators, validators can create a cut of the reward (a commission)
that is not shared with the nominators. This cut is a percentage of the block reward, not an
absolute value. After the commission gets deducted, the remaining portion is distributed pro-rata
based on their staked value and split between the validator and all of the nominators whose stake
has backed this validator.

For example, assume the block reward for a validator is 10 DOT. A validator may specify
`validator_commission = 50%`, in which case the validator would receive 5 DOT. The remaining 5 DOT
would then be split between the validator and their nominators based on the proportion of stake each
nominator had. Note that for this calculation, validator's self-stake acts just as if they were
another nominator.

Thus, a percentage of the reward goes thus to pay the validator's commission fees and the remainder
is paid pro-rata (i.e. proportional to stake) to the nominators and validator. If a validator's
commission is set to 100%, no tokens will be paid out to any of the nominators. Notice in particular
that the validator is rewarded twice: once in commission fees for validating (if their commission
rate is above 0%), and once for nominating itself with own stake.

The following example should clarify the above. For simplicity, we have the following assumptions:

- These validators do not have a stake of their own.
- They each receive the same number of era points.
- There are no tips for any transactions processed.
- They do NOT charge any commission fees.
- Total reward amount is 100 DOT tokens.
- The current minimum amount of DOT to be a validator is 350 (note that this is _not_ the actual
  value, which fluctuates, but merely an assumption for purposes of this example; to understand how
  the actual minimal stake is calculated, see
  [here](../general/faq.md#what-is-the-minimum-stake-necessary-to-be-elected-as-an-active-validator)).

|               | **Validator A** |                             |         |
| :-----------: | :-------------: | :-------------------------: | :-----: |
| Nominator (4) |   Stake (600)   | Fraction of the Total Stake | Rewards |
|      Jin      |       100       |            0.167            |  16.7   |
|    **Sam**    |       50        |            0.083            |   8.3   |
|     Anson     |       250       |            0.417            |  41.7   |
|     Bobby     |       200       |            0.333            |  33.3   |

|               | **Validator B** |                             |         |
| :-----------: | :-------------: | :-------------------------: | :-----: |
| Nominator (4) |   Stake (400)   | Fraction of the Total Stake | Rewards |
|     Alice     |       100       |            0.25             |   25    |
|     Peter     |       100       |            0.25             |   25    |
|     John      |       150       |            0.375            |  37.5   |
|   **Kitty**   |       50        |            0.125            |  12.5   |

_Both validators A & B have 4 nominators with a total stake 600 and 400 respectively._

Based on the above rewards distribution, nominators of validator B get more rewards per DOT than
those of validator A because A has more overall stake. Sam has staked 50 DOT with validator A, but
he only gets 8.3 in return, whereas Kitty gets 12.5 with the same amount of stake.

To estimate how many tokens you can get each month as a nominator or validator, you can use this
[tool](https://www.stakingrewards.com/earn/polkadot/calculate) as a reference and play around with
it by changing some parameters (e.g. how many days you would like to stake with your DOT, provider
fees, compound rewards, etc.) to have a better estimate. Even though it may not be entirely accurate
since staking participation is changing dynamically, it works well as an indicator.

#### Oversubscription, Commission Fees & Slashes

There is an additional factor to consider in terms of rewards. While there is no limit to the number
of nominators a validator may have, a validator does have a limit to how many nominators to which it
can pay rewards. In {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} this limit is
currently
{{ polkadot: <RPC network="polkadot" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/>, :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/>, :kusama }}
although this can be modified via runtime upgrade. A validator with more than
{{ polkadot: <RPC network="polkadot" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/> :kusama }}
nominators is _oversubscribed_. When payouts occur, only the top
{{ polkadot: <RPC network="polkadot" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={512}/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.staking.maxNominatorRewardedPerValidator" defaultValue={516}/> :kusama }}
nominators as measured by the amount of stake allocated to that validator will receive rewards. All
other nominators are essentially "wasting" their stake - they used their nomination to elect that
validator to the active stake, but receive no rewards in exchange for doing so.

Note that the network slashes a validator for a misbehavior (e.g. validator offline, equivocation,
etc.) the slashed amount is a fixed percentage (and not a fixed amount), which means that validators
with more stake get slashed more DOT. Again, this is done to provide nominators with an economic
incentive to shift their preferences and back less popular validators whom they consider to be
trustworthy.

Also, note that each validator candidate is free to name their desired commission fee (as a
percentage of rewards) to cover operational costs. Since validators are paid the same, validators
with lower commission fees pay more to nominators than validators with higher fees. Thus, each
validator can choose between increasing their fees to earn more, or decreasing their fees to attract
more nominators and increase their chances of being elected. In the long term, we expect that all
validators will need to be cost-efficient to remain competitive, and that validators with higher
reputation will be able to charge slightly higher commission fees (which is fair).

## Slashing

### Unresponsiveness

For every session, validators will send an "I'm online" heartbeat to indicate they are live. If a
validator produces no blocks during an epoch and fails to send the heartbeat, it will be reported as
unresponsive. Slashing may occur depending on the repeated offenses and how many other validators
were unresponsive or offline during the epoch.

Validators should have a well-architected network infrastructure to ensure the node runs to reduce
the risk of slashing or chilling. A high availability setup is desirable, preferably with backup
nodes that kick in **only once the original node is verifiably offline** (to avoid double-signing
and being slashed for equivocation - see below). A comprehensive guide on validator setup is
available [here](../maintain/maintain-guides-secure-validator.md).

Here is the formula for calculating slashing due to unresponsiveness:

    Let x = offenders, n = total no. validators in the active set

    min((3 * (x - (n / 10 + 1))) / n, 1) * 0.07

The examples demonstrate how to calculate the slashing penalty for unresponsiveness.

:::note

In all of the examples, assume that there are 100 validators in the active set.

:::

No slashing would enact if <= 10% of all validators are unresponsive.

For example, if exactly 10 validators were unresponsive, the expression 3 _ (x - (n / 10 + 1))) / n
would be 3 _ (10 - (100 / 10 + 1)) / 100 = 3 \* (10 - (10 + 1)) / 100 = -0.03 which is rounded to 0.

:::note

The minimum value between 0 and 1 is 0. 0 multiplied by 0.07 is 0.

:::

If 14 validators are unresponsive, then slashing would occur, as > 10% of validators are
unresponsive.

The slashing penalty would be min((3 _ (14 - (100 / 10 + 1))) / 100, 1) _ 0.07 = min((3 _ (14 -
11))/100, 1) _ 0.07 = min(0.09, 1) \* 0.07 = 0.6%

Similarly, if one-third of the validator set (around 33/100) are unresponsive, the slashing penalty
would be about 5%.

The maximum slashing that can occur due to unresponsiveness is 7%. After around 45% of the
validators go offline, the expression 3 _ (x - (n / 10 + 1))) / n will go beyond 1. Hence, min((3 _
(x - (n / 10 + 1))) / n, 1) \* 0.07 will be ceiled to 7%.

### Equivocation

**GRANDPA Equivocation**: A validator signs two or more votes in the same round on different chains.

**BABE Equivocation**: A validator produces two or more blocks on the Relay Chain in the same time
slot.

Both GRANDPA and BABE equivocation use the same formula for calculating the slashing penalty:

    Let x = offenders, n = total no. validators in the active set

    min( (3 * x / n )^2, 1)

As an example, assume that there are 100 validators in the active set, and one of them equivocates
in a slot (for our purposes, it does not matter whether it was a BABE or GRANDPA equivocation). This
is unlikely to be an attack on the network, but much more likely to be a misconfiguration of a
validator. The penalty would be min(3 \* 1 / 100)^2, 1) = 0.0009, or a 0.09% slash for that
validator (i.e., the stake held by the validator and its nominators).

Now assume that there is a group running several validators, and all of them have an issue in the
same slot. The penalty would be min((3 \* 5 / 100)^2, 1) = 0.0225, or a 2.25% slash. If 20
validators equivocate, this is a much more serious offense and possibly indicates a coordinated
attack on the network, and so the slash will be much greater - min((3 \* 20 / 100)^2, 1) = 0.36, or
a 36% slash on all of these validators and their nominators. All slashed validators will also be
chilled.

From the example above, the risk of nominating or running many validators in the active set are
apparent. While rewards grow linearly (two validators will get you approximately twice as many
staking rewards as one), slashing grows exponentially. A single validator equivocating causes a
0.09% slash, two validators equivocating does not cause a 0.09 \* 2 = 0.18% slash, but rather a
0.36% slash - 4x as much as the single validator.

Validators may run their nodes on multiple machines to make sure they can still perform validation
work in case one of their nodes goes down, but validator operators should be extremely careful in
setting these up. If they do not have good coordination to manage signing machines, equivocation is
possible, and equivocation offenses are slashed at much higher rates than equivalent offline
offenses.

If a validator is reported for any one of the offenses they will be removed from the validator set
([chilled](#chilling)) and they will not be paid while they are out. They will be considered
inactive immediately and will lose their nominators. They need to re-issue intent to validate and
again gather support from nominators.

### Slashing Across Eras

There are 3 main difficulties to account for with slashing in NPoS:

- A nominator can nominate multiple validators and be slashed via any of them.
- Until slashed, the stake is reused from era to era. Nominating with N coins for E eras in a row
  does not mean you have N\*E coins to be slashed - you've only ever had N.
- Slashable offenses can be found after the fact and out of order.

To balance this, we only slash for the maximum slash a participant can receive in some time period,
rather than the sum. This ensures protection from overslashing. Likewise, the period over which
maximum slashes are computed is finite and the validator is chilled with nominations withdrawn after
a slashing event, as stated in the previous section. This prevents rage-quit attacks in which, once
caught misbehaving, a participant deliberately misbehaves more because their slashing amount is
already maxed out.

## Simple Payouts

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} makes stakers claim their rewards for
past eras by submitting a transaction. This naturally leads to spreading out reward distribution, as
people make transactions at disparate times, rather than updating the accounts of all stakers in a
single block.

Even if everyone submitted a reward claim at the same time, the fact that they are individual
transactions would allow the block construction algorithm to process only a limited number per block
and ensure that the network maintains a constant block time. If all rewards were sent out in one
block, this could cause serious issues with the stability of the network.

Simple payouts require one transaction per validator, per [era](../general/glossary.md##era), to
claim rewards. The reason {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} requires
this is to avoid an attack where someone has several thousand accounts nominating a single
validator. The major cost in reward distribution is mutating the accounts in storage, and
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} cannot pay out several thousand
accounts in a single transaction.

### Claiming Rewards

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} stores the last 84 eras of reward
information (e.g. maps of era number to validator points, staking rewards, nomination exposure,
etc.). Rewards will not be claimable more than 84 eras after they were earned. This means that all
rewards must be claimed within a maximum of 84 eras, although under certain circumstances (described
below) this may be as low as 28 eras.

If a validator kills their stash, any remaining rewards will no longer be claimable. Before doing
this, however, they would need to first stop validating and then unbond the funds in their stash,
which takes 28 eras. If a validator were to immediately chill and start unbonding after rewards are
calculated, and nobody issued a payout for that era from that validator in the next 28 eras, the
reward would no longer be claimable.

:::info Advanced How-to Guides

In order to be absolutely sure that staking rewards can be claimed, users should trigger a payout
before 28 eras have passed. See
[this page](./learn-guides-staking.md#claiming-rewards-with-the-polkadot-js-ui) for more information
about how to claim rewards using the Polkadot-JS UI.

:::

### FAQ and Cautionary Notes

1. Rewards expire after 84 eras. On Polkadot, that's about 84 days. On Kusama, it is approximately
   21 days. Validators should claim all pending rewards before killing their stash in the event the
   validator decides to `chill` -> `unbonds all` -> `withdraws unbonded`. Nominators will not miss
   out on rewards if they claim the pending rewards for a validator within 28 days. Essentially, the
   deadline to ensure you get staking rewards is 28 eras. If the validator verifies its intent and
   does not unbond and withdraw, the 84 era timeline holds.
2. Claiming rewards (or neglecting to claim rewards) does not affect nominations in any way.
   Nominations will persist after claiming rewards or after the rewards expire.
3. Rewards are not minted until they are claimed. Therefore, if your reward destination is "stash,
   increasing amount at stake", then your staked amount does not reflect your rewards until you
   claim them. If you want to maximize compounding, then you will need to claim often or nominate
   validators which regularly claim for you.
4. Staking operations at the end of an era are closed to allow the off-chain validator election to
   take place. See [Off-chain Phragmén](learn-phragmen.md#off-chain-phragmen) for more information.

## Staking Miner

:::caution

The staking-miner code is experimental and it is still in the development phase. Use is at your own
discretion, as there is a risk of losing some funds.

:::

At the end of each era on Polkadot and Kusama, using [NPoS](learn-phragmen), a new set of validators
must be elected based on the nominator preferences. This is a computationally intensive process,
hence the usage of the term "mining" for computing the solution. The validators use
[off-chain workers](https://docs.substrate.io/reference/how-to-guides/offchain-workers/) to compute
the result and submit a transaction to propose the set of winners. This can also be delegated to
stand-alone programs, whose task is to mine the optimal solution. Staking miners compete with each
other to produce election solutions which consist of a validator set, stake distribution across that
set, and a score indicating how optimal the solution is. Staking miners run any given staking
algorithms (as of now, sequential Phragmén or PhragMMS, subject to change if improved algorithms are
introduced) to produce results, which are then sent as a transaction to the relay chain via a normal
signed extrinsic. The transaction requires a bond and a transaction fee. The best solution is
rewarded, which the least covers the transaction fee, and the bond is returned to the account.
[The bond and the fee](./learn-staking-advanced.md#deposit-and-reward-mechanics) are lost if the
solution is invalid.

Staking miner uses a pallet called `pallet_election_provider_multi_phase` and can only produce
solutions during the
[`SignedPhase`](https://crates.parity.io/pallet_election_provider_multi_phase/index.html#signed-phase)
of the pallet's life cycle. Once the `SignedPhase` is over and the
[`UnsignedPhase`](https://crates.parity.io/pallet_election_provider_multi_phase/index.html#unsigned-phase)
starts, only the off-chain workers can provide election results.

Running the staking miner requires passing the seed of a funded account in order to pay the fees for
the transactions that will be sent. The same account's balance is used to reserve deposits as well.
The best solution in each round is rewarded. All correct solutions will get their deposit back and
the ones that submit invalid solutions will lose their deposit.

### NPoS election optimization

![NPoS election optimization](../assets/staking-miner/NPoS-election-optimization.png)

A basic election solution is a simple distribution of stake across validators, but this can be
optimized for better distribution equaling a higher security score. The staking miner does not act
as a validator and focuses solely on the election result and optimization of the solution. It
connects to a specified chain and keeps listening to new signed phase of the election pallet in
order to submit solutions to the NPoS election. When the correct time comes, it computes its
solution and submits it to the chain. The default miner algorithm is sequential Phragmén with a
configurable number of balancing iterations that improve the score.

### Signed Phase of the election pallet

The election provider pallet `pallet_election_provider_multi_phase` is divided into two phases,
**signed** and **unsigned**. At the end of the pallet's timeline, the function `elect()` is called.

```
                                                                   elect()
                +   <--T::SignedPhase-->  +  <--T::UnsignedPhase-->   +
  +-------------------------------------------------------------------+
   Phase::Off   +       Phase::Signed     +      Phase::Unsigned      +
```

Solutions provided by the staking miner can only be submitted during the signed phase. Solutions are
submitted and queued on the chain as a `RawSolution`. Once submitted, a solution cannot be retracted
by the originating account.

`RawSolution` struct definition:

```
pub struct RawSolution<S> {
    pub solution: S, // The solution itself
    pub score: ElectionScore, // The claimed score of the solution.
    pub round: u32, // The round at which this solution should be submitted.
}
```

A maximum of `pallet::Config::SignedMaxSubmissions` will be stored on-chain and they will be sorted
based on score. Higher the score the more optimal the election solution is. On both Polkadot and
Kusama the
['SignedMaxSubmissions'](https://github.com/paritytech/polkadot-sdk/blob/f610ffc05876d4b98a14cee245b4cc27bd3c0c15/runtime/polkadot/src/lib.rs#L390)
is set to
{{ polkadot: <RPC network="polkadot" path="consts.electionProviderMultiPhase.signedMaxSubmissions" defaultValue={16}/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.electionProviderMultiPhase.signedMaxSubmissions" defaultValue={16}/> :kusama }}
submissions. This variable can be modified if needed through governance.

Upon arrival of a new solution:

1. If the queue is not full, it is stored in the appropriate sorted index.
2. If the queue is full but the submitted solution is better than one of the queued ones, the worse
   solution is discarded, the deposit of the outgoing solution is returned, and the new solution is
   stored in the correct index.
3. If the queue is full and the solution is not an improvement compared to any of the queued ones,
   it is instantly rejected and no deposit is reserved.

Upon the end of the `SignedPhase`, no more solutions can be submitted and the solutions in the queue
will be checked using
[`Pallet::feasibility_check`](https://paritytech.github.io/substrate/master/pallet_election_provider_multi_phase/pallet/struct.Pallet.html#method.feasibility_check)
which ensures the score is indeed correct, and marks them as valid or invalid. By checking each
solution in the queue, the queue will be reorganized by score. The highest valid score will be
rewarded. Invalid solutions with higher score than the winning solution will be slashed. The rest of
the solutions will be discarded and their deposit will be returned. Once the staking miner with a
winning solution is ready to be rewarded the runtime will automatically execute
[`finalize_signed_phase_accept_solution`](https://github.com/paritytech/substrate/blob/f2bc08a3071a91b71fec63cf2b22c707411cec0e/frame/election-provider-multi-phase/src/signed.rs#L453-L474)
which reward account associated with the winning solution.

```
Queue
+-------------------------------+
|Solution(score=20, valid=false)| +-->  Slashed
+-------------------------------+
|Solution(score=15, valid=true )| +-->  Rewarded, Saved
+-------------------------------+
|Solution(score=10, valid=true )| +-->  Discarded
+-------------------------------+
|Solution(score=05, valid=false)| +-->  Discarded
+-------------------------------+
|             None              |
+-------------------------------+
```

### Deposit and reward mechanics

The staking miners are required to pay a deposit to post their solutions. Deposit amount is the sum
of `SignedDepositBase` +`SignedDepositByte` + `SignedDepositWeight`. All good solutions are subject
to receiving a `SignedRewardBase`.

#### Deposit

Current deposit(`SignedDepositBase`) is
{{ polkadot: <RPC network="polkadot" path="consts.electionProviderMultiPhase.signedDepositBase" defaultValue={400000000000} filter="humanReadable"/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.electionProviderMultiPhase.signedDepositBase" defaultValue={133333332000} filter="humanReadable"/> :kusama }}
which is a fixed amount.

Current deposit per byte(`SignedDepositByte`) is
{{ polkadot: <RPC network="polkadot" path="consts.electionProviderMultiPhase.signedDepositByte" defaultValue={97656} filter="precise"/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.electionProviderMultiPhase.signedDepositByte" defaultValue={32551} filter="precise"/> :kusama }}
and the total is variable depending on the size of the solution data. For example, a solution
weighing 200KB would yield {{ polkadot: 200 x 0.0000097656 = **0.00195312 DOT**. :polkadot }}
{{ kusama: 200 x 0.00000032551 = **0.000065102 KSM**. :kusama }}

And the weight deposit(`SignedDepositWeight`) is currently set to `0` and has no effect.

#### Reward

Current reward(`SignedRewardBase`) is
{{ polkadot: <RPC network="polkadot" path="consts.electionProviderMultiPhase.signedRewardBase" defaultValue={10000000000} filter="humanReadable"/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.electionProviderMultiPhase.signedRewardBase" defaultValue={100000000000} filter="humanReadable"/> :kusama }}
which is a fixed amount.

### Further Resources

If you want to run a staking miner on your validator, refer to the repository provided in the
resources section below.

- [Staking Miner repository](https://github.com/paritytech/staking-miner-v2)
- [Election Pallet definition](https://crates.parity.io/pallet_election_provider_multi_phase/index.html)
- [Signed phase parameter configuration on Polkadot](https://github.com/paritytech/polkadot-sdk/blob/f610ffc05876d4b98a14cee245b4cc27bd3c0c15/runtime/polkadot/src/lib.rs#L389:L397)


---
id: learn-staking
title: Introduction to Staking
sidebar_label: Introduction to Staking
description: Overview of Staking and NPoS on Polkadot.
keywords: [staking, stake, nominate, nominating, NPoS, faq]
slug: ../learn-staking
---

import RPC from "./../../components/RPC-Connection";

:::tip New to Staking?

Explore Polkadot with a secure and user-friendly wallets listed on the
[Polkadot website](https://www.polkadot.network/ecosystem/wallets/) and start your staking journey
or explore more information about staking on
[Polkadot's Staking Page](https://polkadot.network/staking/). Discover the new
[Staking Dashboard](https://staking.polkadot.network/#/overview) that makes staking much easier and
check this
[extensive article list](https://support.polkadot.network/support/solutions/articles/65000182104) to
help you get started. The dashboard supports [Ledger](../general/ledger.md) devices natively and
does not require an extension or wallet as an interface.

:::

:::info Stake through Nomination Pools

The minimum amount required to become an active nominator and earn rewards may change from era to
era.
{{ polkadot: It is currently __<RPC network="polkadot" path="query.staking.minimumActiveStake" defaultValue={5020000000000} filter="humanReadable"/>__. :polkadot }}
{{ kusama: It is currently __<RPC network="kusama" path="query.staking.minNominatorBond" defaultValue={100000000000} filter="humanReadable"/>__. :kusama }}
If you have less {{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} than the minimum active
nomination and still want to participate in staking, you can join the nomination pools. You can now
stake on {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} natively with just
{{ polkadot: __<RPC network="polkadot" path="query.nominationPools.minJoinBond" filter="humanReadable" defaultValue={10000000000}/>__ :polkadot }}
{{ kusama: __<RPC network="kusama" path="query.nominationPools.minJoinBond" filter="humanReadable" defaultValue={1666666650}/>__ :kusama }}
in the nomination pools and earn staking rewards. For additional information, check out
[this blog post](https://polkadot.network/blog/nomination-pools-are-live-stake-natively-with-just-1-dot/).
Check the wiki doc on [nomination pools](learn-nomination-pools.md) for more information.

:::

Here you will learn about what staking is, why it is important and how it works on
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}.

## Proof-of-Stake (PoS)

Blockchain networks use [consensus](learn-consensus.md/#why-do-we-need-consensus) mechanisms to
finalize blocks on the chain. Consensus is the process of agreeing on something, in this case, the
progression of the blockchain or how blocks are added to the chain. Consensus consists of two
actions:

- **Block production**, i.e. the way multiple blocks candidates are produced, and
- **Block finality**, i.e. the way only one block out of many candidates is selected and added to
  the canonical chain (see [this](learn-consensus.md/#probabilistic-vs-provable-finality) article
  for more information about finality).

Proof-of-Work (PoW) and Proof-of-Stake (PoS) are well-known mechanisms used to reach consensus in a
secure and trustless way on public blockchains, where there are many participants who do not know
each other (and probably never will). In PoW, network security relies on the fact that the miners
who are responsible for adding blocks to the chain must compete to solve difficult mathematic
puzzles to add blocks - a solution that has been criticized for the wastage of energy. For doing
this work, miners are typically rewarded with tokens.

In PoS networks like {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} the security of
the network depends on the amount of capital locked on the chain: the more the capital locked, the
lower the chance of an attack on the network, as the attacker needs to incur a heavy loss to
orchestrate a successful attack (more on this later on). The process of locking tokens on the chain
is called **staking**.

Similar to the miners in PoW networks, PoS networks have **validators**, but they do not have to
compete with each other to solve mathematical puzzles. They are instead pre-selected to produce the
blocks based on the stake backing them. Token holders can lock funds on the chain and for doing so,
they are getting **staking rewards**. There is thus an economic incentive for token holders to
become active participants who contribute to the economic security and stability of the network. PoS
networks in general are therefore more inclusive than PoW networks, as participants do not need to
have either technical knowledge about blockchain technology or experience in running mining
equipment.

PoS ensures that everybody participating in the staking process has "skin in the game" and thus can
be held accountable. In case of misbehavior, participants in the staking process can be punished or
**slashed**, and depending on the gravity of the situation, their stake can be partly or fully
confiscated by the network. It is not in a staker's economic interest to orchestrate an attack and
risk losing tokens. Any rational actor staking on the network would want to get rewarded, and the
PoS network rewards good behavior and punishes bad behavior.

## Nominated Proof-of-Stake (NPoS)

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} implements
[Nominated Proof-of-Stake (NPoS)](learn-consensus.md/#nominated-proof-of-stake), a relatively novel
and sophisticated mechanism to select the validators who are allowed to participate in its
[consensus](learn-consensus.md) protocol. NPoS encourages
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} holders to participate as **nominators**.

Any potential validators can indicate their intention to be a validator candidate. Their candidacies
are made public to all nominators, and a nominator, in turn, submits a list of up to
{{ polkadot: <RPC network="polkadot" path="consts.staking.maxNominations" defaultValue={16}/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.staking.maxNominations" defaultValue={24}/> :kusama }}
candidates that it supports, and the network will automatically distribute the stake among
validators in an even manner so that the economic security is maximized. In the next era, a certain
number of validators having the most {{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} backing
get elected and become active. For more information about the election algorithm go to
[this](learn-phragmen.md) page on the wiki or
[this](https://research.web3.foundation/Polkadot/protocols/NPoS/Paper) research article. As a
nominator, a minimum of
{{ polkadot: <RPC network="polkadot" path="query.staking.minNominatorBond" defaultValue={2500000000000} filter="humanReadable"/> :polkadot }}
{{ kusama: <RPC network="kusama" path="query.staking.minNominatorBond" defaultValue={100000000000} filter="humanReadable"/> :kusama }}
is required to submit an intention to nominate, which can be thought of as registering to be a
nominator. Note that in NPoS the stake of both nominators and validators can be slashed. For an
in-depth review of NPoS see
[this](https://research.web3.foundation/Polkadot/protocols/NPoS/Overview) research article.

:::caution Minimum Nomination to Receive Staking Rewards

Although the minimum nomination intent is
{{ polkadot: <RPC network="polkadot" path="query.staking.minNominatorBond" defaultValue={2500000000000} filter="humanReadable"/>, :polkadot }}
{{ kusama: <RPC network="kusama" path="query.staking.minNominatorBond" defaultValue={100000000000} filter="humanReadable"/>, :kusama }}
it does not guarantee staking rewards. The nominated amount has to be greater than
[minimum active nomination](learn-nominator.md#minimum-active-nomination-to-receive-staking-rewards),
which is a dynamic value that can be much higher than
{{ polkadot: <RPC network="polkadot" path="query.staking.minNominatorBond" defaultValue={2500000000000} filter="humanReadable"/>. :polkadot }}
{{ kusama: <RPC network="kusama" path="query.staking.minNominatorBond" defaultValue={100000000000} filter="humanReadable"/>. :kusama }}
This dynamic value depends on the amount of {{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }}
being staked, in addition to the selected nominations.

:::

### Nominating Validators

Nominating on {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} requires 2 actions:

- Locking tokens on-chain.
- Selecting a set of validators, to whom these locked tokens will automatically be allocated to.

How many tokens you lock up is completely up to you - as are the validators you wish to select. The
action of locking tokens is also known as **bonding**. You can also refer to your locked tokens as
your bonded tokens, or staked tokens. Likewise, selecting validators is also known as backing or
nominating validators. These terms are used interchangeably by the community. From now on locked
tokens will be referred to as bonded tokens.

Once the previous 2 steps are completed and you are nominating, your bonded tokens could be
allocated to one or more of your selected validators, and this happens every time the active
validator set changes. This validator set is updated every era on
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}.

Unlike other staking systems, {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}
automatically chooses which of your selected validators will be backed by your bonded tokens.
Selecting a group of validators increases your chances of consistently backing at least one who is
active. This results in your bonded tokens being allocated to validators more often, which means
more network security and more rewards. This is in strong contrast to other staking systems that
only allow you to back one validator; if that validator is not active, you as a staker will also not
be. {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}'s nomination model solves this.

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} uses tools ranging from election
theory to game theory to discrete optimization, to develop an efficient validator selection process
that offers fair representation and security, thus avoiding uneven power and influence among
validators. The election algorithms used by
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} are based on the Proportional
Justified Representation (PJR) methods like [Phragmen](learn-phragmen.md). For more information
about PJR methods visit [this](https://research.web3.foundation/Polkadot/protocols/NPoS/Overview)
research article.

### Eras and Sessions

The stake from nominators is used to increase the number of tokens held by such candidates,
increasing their chance of being selected by the election algorithm for block production during a
specific **era**. An era is a period of {{ polkadot: 24 :polkadot }}{{ kusama: 6 :kusama }} hours
during which an **active set** of validators is producing blocks and performing other actions on the
chain. This means that not all validators are in the active set and such set changes between eras.
Each era is divided into 6 epochs or **sessions** during which validators are assigned as block
producers to specific time frames or **slots**. This means that validators know the slots when they
will be required to produce a block within a specific session, but they do not know all the slots
within a specific era. Having sessions adds a layer of security because it decreases the chance of
having multiple validators assigned to a slot colluding to harm the network.

### Staking Rewards

Validators who produce a block are rewarded with tokens, and they can share rewards with their
nominators. Both validators and nominators can stake their tokens on chain and receive staking
rewards at the end of each era. The staking system pays out rewards equally to all validators
regardless of stake. Thus, having more stake in a validator does not influence the amount of block
rewards it receives. This avoids the centralization of power to a few validators. There is a
probabilistic component in the calculation of rewards, so they may not be exactly equal for all
validators. In fact, during each era validators can earn **era points** by doing different tasks on
chain. The more the points, the higher the reward for a specific era. This promotes validators'
activity on chain. To know more about era points, and how and on which basis they are distributed
visit the [dedicated page](../maintain/maintain-guides-validator-payout.md). Distribution of the
rewards is pro-rata to all stakers after the validator's commission is deducted.

### Skin in the game when Staking

The security of PoS networks depends on the amount of staked tokens. To successfully attack the
network, a malicious actor would need to accrue a large number of tokens or would need different
participants to collude and act maliciously. If there is an attack in the case of NPoS, both the
validator(s) and nominators will be slashed resulting in their stake being partially or fully
confiscated by the network and then deposited to the treasury. There is little interest for a
rational network participant to act in a harmful way because NPoS ensures that all participants can
be held accountable for their bad actions. In NPoS, validators are paid equal rewards regardless of
the amount of stake backing them, thus avoiding large payouts to few large validators which might
lead to centralization.

## Being a Nominator

### Tasks and Responsibilities of a Nominator

**Validators.** Since validator slots are limited, most of those who wish to stake their
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} and contribute to the economic security of
the network will be nominators, thus here we focus on the role of nominators. However, it is worth
mentioning that validators do most of the heavy lifting: they run the validator nodes and manage
[session keys](https://research.web3.foundation/Polkadot/security/keys/session), produce new block
candidates in [BABE](learn-consensus.md/#block-production-babe), vote and come to consensus in
[GRANDPA](learn-consensus.md/#finality-gadget-grandpa), validate the state transition function of
parachains, and possibly some other responsibilities regarding data availability and
[XCM](learn-xcm.md). For more information, you can take a look at the
[validator docs](learn-validator.md) to understand what you need to do as a validator. If you want
to become a validator you can consult
[this](../maintain/maintain-guides-how-to-validate-polkadot.md) guide.

**Nominators.** Nominators have far fewer responsibilities than validators. These include selecting
validators and monitoring their performance, keeping an eye on changing commission rates (a
validator can change commission at any time), and general health monitoring of their validators'
accounts. Thus, while not being completely set-it-and-forget-it, a nominator's experience is
relatively hands-off compared to that of a validator, and even more with
[nomination pools](./learn-nomination-pools.md). For more information, you can take a look at the
nominator [guide](learn-nominator.md) to understanding your responsibilities as a nominator.

If you want to become a nominator, see
[this](../maintain/maintain-guides-how-to-nominate-polkadot.md) guide. If you are a beginner and
would like to securely stake your tokens using the Polkadot-JS UI, refer to
[this](https://support.polkadot.network/support/solutions/articles/65000168057-how-do-i-stake-nominate-on-polkadot-)
support article.
{{ kusama: The tutorial presented in the support article is demonstrated on Polkadot, but the procedure is the same for Kusama. :kusama }}

:::info Polkadot Staking Dashboard

The [Staking Dashboard](https://staking.polkadot.network/dashboard/#/overview) provides a more
user-friendly alternative to staking. See the instructions in
[this](https://support.polkadot.network/support/solutions/articles/65000182133-how-to-use-the-staking-dashboard-staking-your-dot)
support article to learn how to stake with the dashboard.

:::

**Pools.** Pools are "built" on top of NPoS to provide a very low barrier to entry to staking,
without sacrificing Polkadot's strict security model.

### Selection of Validators

The task of choosing validators is not simple, as it should take into account nominator reward and
risk preferences. Ideally one aims to maximize the reward-to-risk ratio by maximizing rewards and
minimizing risks, with sometimes having to compromise between the two, as minimizing risks might
decrease rewards as well. Nominators should pay attention, especially to six criteria when
nominating validators (not in order of importance):

- recent history of the era points earned across eras
- validator's self stake (shows skin in the game)
- total stake backing the validator (which is the sum of self stake and the stake coming from
  nominators)
- commission fees (i.e. how much validators charge nominators)
- verified identity
- previous slashes

The diagram below shows how the selection of those criteria affects the reward-to-risk ratio.

![rewards and risks diagram](../assets/reward-risk.png)

#### Validator Selection Criteria

To maximize rewards and minimize risk, one could select those validators that:

- have era points above average (because they will get more rewards for being active),
- have the total stake backing the validator below the average active validator stake (because they
  will pay out more rewards per staked {{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }}),
- have high own stake (because if slashed they have something to lose),
- have low commission fees but not 0% (because it makes sense that for doing the heavy lifting,
  validators ask for a small commission),
- have on-chain registered identity (because it adds a layer of trust and possibly provides access
  to their website and contact details),
- and have not been slashed (meaning that their on-chain behavior is genuine).

#### Network Providers

For successful operation, a Validator node should always be ensured to meet the required
[software, hardware, and network bandwidth specifications](../maintain/maintain-guides-how-to-validate-polkadot#reference-hardware).
Understandably, most of the validator nodes run on cloud service providers that guarantee high
hardware specifications and high levels of availability and connectivity. Keep in mind that a
validator in the active set is supposed to be fully online and available for producing blocks. If
the active validator node goes offline due to network interruptions or a power outage, that
validator might be subject to
[slashing due to unresponsiveness](./learn-staking-advanced#unresponsiveness). As
[Polkadot's block production mechanism](./learn-consensus.md#block-production-babe) is reasonably
resilient to a small proportion of validators going offline, no slashing is imposed until 10% of the
validators in the active set go offline. Hence, if multiple nodes are running on a single cloud
service provider and go offline simultaneously due to an outage or due to a change in their terms
and conditions policy regarding the support of Proof-of-Stake (PoS) operations, the offline
validators and all the nominators backing them can be slashed up 7% of their stake on Polkadot.
Hence, it is recommended that you check if you are nominating the validator nodes that are running
on cloud service providers, and if they do, check if they allow for Proof-of-Stake operations.

:::tip Checking Validators using Network Providers

You can connect your stash account to the [Polkawatch app](https://polkawatch.app/). The app will
show your rewards earned in the past 60 eras divided by network provider and country. You will be
able to see networks used by each validator and verify if your validators are using providers who
support PoS. This is also a great tool to explore how decentralized your nominations are and act
accordingly.

:::

#### Keeping Track of Nominated Validators

:::caution Nominators must periodically check their validators

Nominating is _not_ a "set and forget" operation. The whole NPoS system is dynamic and nominators
should periodically monitor the performance and reputation of their validators. Failing to do so
could result in applied slashes and/or rewards not being paid out, possibly for a prolonged period.

:::

Although the theory can be used as a general guideline, in practice it is more complicated and
following the theory might not necessarily lead to the desired result. Validators might have the
total stake backing them below average, low commission and above average era points in one era and
then have a different profile in the next one. Selection based the criteria like on-chain identity,
slash history and low commission make the staking rewards deterministic. But some criteria vary more
than others, with era points being the most variable and thus one of the key probabilistic
components of staking rewards. Part of this probability is directly related to the fact that a
validator can produce blocks for a parachain (i.e. para-validators) or the relay chain, with
para-validators earning more era points per unit time (see
[this](../maintain/maintain-guides-validator-payout.md#era-points) page for more information). The
role can switch between sessions, and you can look at
[the staking tab on the Polkadot-JS UI](https://polkadot.js.org/apps/#/staking) to know which
validator is producing blocks for the relay chain or parachains.

It is not recommended to change nominations because of the low era points of a validator in a single
era. Variability in rewards due to the era points should level out over time. If a validator
consistently gets era points below average, it makes sense to nominate a better-performing validator
for the health of the network and increased staking rewards. See
[this](https://support.polkadot.network/support/solutions/articles/65000150130-how-do-i-know-which-validators-to-choose-)
support article to understand in detail how to select the set of validators to nominate.

### Stash Account and Staking Proxy

Two different accounts can be used to securely manage your funds while staking.

- **Stash:** This account holds funds bonded for staking, but delegates all staking functions to a
  staking proxy account. You may actively participate in staking with a stash private key kept in a
  cold wallet like Ledger, meaning it stays offline all the time. Having a staking proxy will allow
  you to sign all staking-related transactions with the proxy instead of using your Ledger device.
  This will allow you:

  - to avoid carrying around your Ledger device just to sign staking-related transactions, and
  - to and to keep the transaction history of your stash clean

- **Staking Proxy:** This account acts on behalf of the stash account, signaling decisions about
  nominating and validating. It can set preferences like commission (for validators) and the staking
  rewards payout account. The earned rewards can be bonded (locked) immediately for bonding on your
  stash account, which would effectively compound the rewards you receive over time. You could also
  choose to have them deposited to a different account as a free (transferable) balance. If you are
  a validator, it can also be used to set your [session keys](learn-cryptography.md). Staking
  proxies only need sufficient funds to pay for the transaction fees.

:::warning

Never leave a high balance on a proxy account which are usually "hot" as their private key is stored
on the device (PC, phone) and it is always exposed to the internet for potential hacks and scams. It
is good practice to deposit rewards on the stash account or to send them to another account on a
cold wallet.

:::

![staking](../assets/stash-and-staking-proxy.png)

This hierarchy of separate keys for stash and staking accounts was designed to add a layer of
protection to nominators and validator operators. The more often one exposes and uses a private key,
the higher its vulnerability for hacks or scams. So, if one uses a key for multiple roles on a
blockchain network, it is likely that the account can get compromised. Note that the damage linked
to stolen private keys is different depending on the type of account derivation. In the case of soft
derivation, all derived accounts are compromised. More information about account derivation can be
found [here](../learn/learn-accounts.md/#derivation-paths).

:::info

For Ledger users staking directly on Ledger Live, currently, there is no option to use separate
stash and staking proxy accounts.

Ledger devices are now supported in [SubWallet](https://www.subwallet.app/download.html) and
[Talisman](https://talisman.xyz/) extension. Users can import their Ledger accounts in the extension
and use them as a stash in staking. You can find more information about SubWallet, Talisman and
other wallets that officially secured funding from the treasury
[here](../general/wallets-and-extensions.md).

:::

### Claiming Staking Rewards

{{ kusama: Note that Kusama runs approximately 4x as fast as Polkadot, except for block production times.
Polkadot will also produce blocks at approximately six-second intervals. :kusama }}

Rewards are calculated per era (approximately six hours on Kusama and twenty-four hours on
Polkadot). These rewards are calculated based on era points, which have a probabilistic component.
In other words, there may be slight differences in your rewards from era to era, and even amongst
validators in the active set at the same time. These variations should cancel out over a long enough
timeline. See the page on [Validator Payout Guide](../maintain/maintain-guides-validator-payout.md).

The distribution of staking rewards to the nominators is not automatic and needs to be triggered by
someone. Typically the validators take care of this, but anyone can permissionlessly trigger rewards
payout for all the nominators whose stake has backed a specific validator in the active set of that
era. Staking rewards are kept available for 84 eras. The following calculation can be used to
approximate this length in days on {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}:

{{ polkadot: `84 eras` × `24 hours in a single era` ÷ `24 hours in a day` = `84 days` :polkadot }}
{{ kusama: `84 eras` × `6 hours in a single era` ÷ `24 hours in a day` = `21 days` :kusama }}

For more information on why this is so, see the page on [simple payouts](learn-staking-advanced.md).

:::info Payouts

Payouts are unclaimed rewards waiting to be paid out to both validators and nominators. If you go to
the Staking payouts page on [Polkadot-JS](https://polkadot.js.org/apps/#/staking), you will see a
list of all validators that you have nominated in the past 84 eras and for which you have not yet
received a payout. The payout page is visible only to stakers.

Each validator as well as their nominators have the option to trigger the payout for all unclaimed
eras. Note that this will pay everyone who was nominating that validator during those eras.
Therefore, you may not see anything in this tab, yet still have received a payout if somebody
(generally, but not necessarily, another nominator or the validator operator) has triggered the
payout for that validator for that era.

:::

:::warning Time limit to claim staking rewards

If nobody claims your staking rewards within 84 eras, then you will not be able to claim them and
they will be lost. Additionally, if the validator unbonds all their own stake, any pending payouts
will also be lost. Since unbonding takes
{{ polkadot: <RPC network="polkadot" path="consts.staking.bondingDuration" defaultValue={28} filter="erasToDays"/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.staking.bondingDuration" defaultValue={28} filter="erasToDays"/> :kusama }}
days, nominators should check if they have pending payouts at least this often.

:::

Rewards can be directed to the same account used to sign the payout or to a completely unrelated
account. It is also possible to top-up / withdraw some bonded tokens without having to un-stake all
staked tokens.

If you wish to know if you received a payout, you will have to check via a block explorer. See
[the relevant Support page](https://support.polkadot.network/support/solutions/articles/65000168954-how-can-i-see-my-staking-rewards-)
for details. For specific details about validator payouts, please see
[this guide](../maintain/maintain-guides-validator-payout.md).

### Slashing

Slashing will happen if a validator misbehaves (e.g. goes offline, attacks the network, or runs
modified software) in the network. They and their nominators will get slashed by losing a percentage
of their bonded/staked DOT.

Any slashed DOT will be added to the [Treasury](learn-treasury.md). The rationale for this (rather
than burning or distributing them as rewards) is that slashes may then be reverted by the Council by
simply paying out from the Treasury. This would be useful in situations such as faulty slashes. In
the case of legitimate slashing, it moves tokens away from malicious validators to those building
the ecosystem through the normal Treasury process.

Validators with a larger total stake backing them will get slashed more harshly than less popular
ones, so we encourage nominators to shift their nominations to less popular validators to reduce
their possible losses.

It is important to realize that slashing only occurs for active validations for a given nominator,
and slashes are not mitigated by having other inactive or waiting nominations. They are also not
mitigated by the validator operator running separate validators; each validator is considered its
own entity for purposes of slashing, just as they are for staking rewards.

In rare instances, a nominator may be actively nominating several validators in a single era. In
this case, the slash is proportionate to the amount staked to that specific validator. With very
large bonds, such as parachain liquid staking accounts, a nominator has multiple active nominations
per era (Acala's LDOT nominator typically has 7-12 active nominations per era). Note that you cannot
control the percentage of stake you have allocated to each validator or choose who your active
validator will be (except in the trivial case of nominating a single validator). Staking allocations
are controlled by the [Phragmén algorithm](learn-phragmen.md).

Once a validator gets slashed, it goes into the state as an "unapplied slash". You can check this
via
[Polkadot-JS UI](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.polkadot.io#/staking/slashes).
The UI shows it per validator and then all the affected nominators along with the amounts. While
unapplied, a governance proposal can be made to reverse it during this period
({{ polkadot: <RPC network="polkadot" path="consts.staking.bondingDuration" defaultValue={28} filter="erasToDays"/> :polkadot }}{{ kusama: <RPC network="kusama" path="consts.staking.bondingDuration" defaultValue={28} filter="erasToDays"/> :kusama }}
days). After the grace period, the slashes are applied.

The following levels of offense are
[defined](https://research.web3.foundation/Polkadot/security/slashing/amounts). However, these
particular levels are not implemented or referred to in the code or in the system; they are meant as
guidelines for different levels of severity for offenses. To understand how slash amounts are
calculated, see the equations in the section below.

- Level 1: isolated [unresponsiveness](./learn-staking-advanced.md/#unresponsiveness), i.e. being
  offline for an entire session. Generally no slashing, only [chilling](#chilling).
- Level 2: concurrent unresponsiveness or isolated
  [equivocation](./learn-staking-advanced.md/#equivocation), slashes a very small amount of the
  stake and chills.
- Level 3: misconducts unlikely to be accidental, but which do not harm the network's security to
  any large extent. Examples include concurrent equivocation or isolated cases of unjustified voting
  in [GRANDPA](learn-consensus.md). Slashes a moderately small amount of the stake and chills.
- Level 4: misconduct that poses serious security or monetary risk to the system, or mass collusion.
  Slashes all or most of the stake behind the validator and chills.

If you want to know more details about slashing, please look at our
[research page](https://research.web3.foundation/Polkadot/security/slashing/amounts).

### Chilling

Chilling is the act of stepping back from any nominating or validating. It can be done by a
validator or nominator at any time, taking effect in the next era. It can also specifically mean
removing a validator from the active validator set by another validator, disqualifying them from the
set of electable candidates in the next NPoS cycle.

Chilling may be voluntary and validator-initiated, e.g. if there is a planned outage in the
validator's surroundings or hosting provider, and the validator wants to exit to protect themselves
against slashing. When voluntary, chilling will keep the validator active in the current session,
but will move them to the inactive set in the next. The validator will not lose their nominators.

When used as part of a punishment (initiated externally), being chilled carries an implied penalty
of being un-nominated. It also disables the validator for the remainder of the current era and
removes the offending validator from the next election.

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} allows some validators to be
disabled, but if the number of disabled validators gets too large,
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} will trigger a new validator election
to get a full set. Disabled validators will need to resubmit their intention to validate and
re-garner support from nominators.

For more on chilling, see the "[How to Chill](../maintain/maintain-guides-how-to-chill.md)" page on
this wiki.

### Fast Unstake

:::info Fast Unstaking feature is live!

If you accidentally bonded your {{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} or your
bonded {{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} never backed any active validator, you
can now unbond them immediately.

:::

If your bonded balance did not back any validators in the last
{{ polkadot: <RPC network="polkadot" path="consts.staking.bondingDuration" defaultValue={28} filter="erasToDays"/> :polkadot }}{{ kusama: <RPC network="kusama" path="consts.staking.bondingDuration" defaultValue={28} filter="erasToDays"/> :kusama }}
days, you are eligible to perform fast unstaking. The
[staking dashboard](https://staking.polkadot.network/#/overview) will automatically check if you
qualify. For more information, visit the
["Fast Unstake" section in this support article](https://support.polkadot.network/support/solutions/articles/65000169433-can-i-transfer-dot-without-unbonding-and-waiting-28-days-).

## Why and Why not to Stake?

### Pros of Staking

- Earn rewards for contributing to the network's security through staking.
- Low barrier of entry through [Nomination Pools](learn-nomination-pools.md).
- Can choose up-to
  {{ polkadot: <RPC network="polkadot" path="consts.staking.maxNominations" defaultValue={16}/> :polkadot }}
  {{ kusama: <RPC network="kusama" path="consts.staking.maxNominations" defaultValue={24}/> :kusama }}
  validators which can help to decentralize the network through the sophisticated
  [NPoS system](learn-consensus.md/#nominated-proof-of-stake)
- 10% inflation/year of the tokens is primarily intended for staking rewards.

When the system staking rate matches with the ideal staking rate, the entire inflation of the
network is given away as the staking rewards.
{{ polkadot: Up until now, the network has been following an inflation model that excludes the metric of active parachains. :polkadot }}
The ideal staking rate is a dynamic value - as the number of active parachains influences the
available liquidity that is available to secure the network.

Any divergence from the ideal staking rate will result in the distribution of a proportion of the
newly minted tokens through inflation to go to the treasury. Keep in mind that when the system's
staking rate is lower than the ideal staking rate, the annual nominal return rate will be higher,
encouraging more users to use their tokens for staking. On the contrary, when the system staking
rate is higher than the ideal staking rate, the annual nominal return will be less, encouraging some
users to withdraw. For in-depth understanding, check the
[inflation](learn-staking-advanced.md#inflation) section on the Wiki.

### Cons of Staking

- Tokens will be locked for about
  {{ polkadot: <RPC network="polkadot" path="consts.staking.bondingDuration" defaultValue={28} filter="erasToDays"/> :polkadot }}{{ kusama: <RPC network="kusama" path="consts.staking.bondingDuration" defaultValue={28} filter="erasToDays"/> :kusama }}
  days on {{ polkadot: Polkadot. :polkadot }}{{ kusama: Kusama. :kusama }} No rewards will be earned
  during the unbonding period.
- Possible punishment in case of the active validator found to be misbehaving (see
  [slashing](#slashing)).
- Lack of liquidity i.e. You would not be able to use the tokens for participating in crowdloans or
  transfer them to different account etc.

#### Unbonding Period Length

The unbonding period provides a safety net for slashing offenses identified in
[past eras](https://research.web3.foundation/Polkadot/security/slashing/npos#slashing-in-past-eras),
which can hold the respective validators and their nominators accountable. The
{{ polkadot: <RPC network="polkadot" path="consts.staking.bondingDuration" defaultValue={28} filter="erasToDays"/> :polkadot }}{{ kusama: <RPC network="kusama" path="consts.staking.bondingDuration" defaultValue={28} filter="erasToDays"/> :kusama }}-day
unbonding period is crucial in mitigating ex post facto slashing, particularly in guarding against
long-range attacks. When a client encounters a chain finalized by
[GRANDPA](./learn-consensus.md#finality-gadget-grandpa) that originates more than
{{ polkadot: <RPC network="polkadot" path="consts.staking.bondingDuration" defaultValue={28} filter="erasToDays"/> :polkadot }}{{ kusama: <RPC network="kusama" path="consts.staking.bondingDuration" defaultValue={28} filter="erasToDays"/> :kusama }}
days in the past, it lacks the security of slashing protection.

Essentially, this period establishes a cadence for synchronizing with the chain or acquiring a
checkpoint within a timeframe that engenders trust. It's worth noting that while the choice of a
{{ polkadot: <RPC network="polkadot" path="consts.staking.bondingDuration" defaultValue={28} filter="erasToDays"/> :polkadot }}{{ kusama: <RPC network="kusama" path="consts.staking.bondingDuration" defaultValue={28} filter="erasToDays"/> :kusama }}-day
period is somewhat arbitrary, it unquestionably provides a higher level of security compared to a
shorter period.

## How many Validators?

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} currently has
{{ polkadot: <RPC network="polkadot" path="query.staking.validatorCount" defaultValue={297}/> :polkadot }}
{{ kusama: <RPC network="kusama" path="query.staking.validatorCount" defaultValue={1000}/> :kusama }}
validators. The top bound on the number of validators has not been determined yet, but should only
be limited by the bandwidth strain of the network due to peer-to-peer message passing.

{{ polkadot: The estimate of the number of validators that Polkadot will have at maturity is around 1000. :polkadot }}
{{ polkadot: Kusama is already operating at this threshold. :polkadot }}

## Why am I not receiving rewards?

Nominating on {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} is not a set-and-forget
action. Nominators need to monitor their nominations and ensure they are eligible to receive staking
rewards. Otherwise, they would be risking their funds to secure the chain with no reward. If you are
bonding significantly more than the Minimum Active Bond and yet not receiving rewards, your
nominations are all waiting, or your active validator has 100% commission. However, if you bond
funds close to the Minimum Active Bond, there could be several possibilities for not receiving
staking rewards. The table below can be used to troubleshoot why you might not be receiving staking
rewards using Polkadot-JS UI.

|                   Nomination Status                   |                                                                                                                                               What's happening?                                                                                                                                                |                                                                                                                                                   Causes                                                                                                                                                    |                                                                                                                                                What to do?                                                                                                                                                |
| :---------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|    Nominated validators are all in waiting status.    |                                                                                           Your stake has not been assigned to any of the nominated validators. You cannot earn rewards, nor be slashed in that era.                                                                                            |                                                                  Waiting validators are not in the active set in the current era and the stake backing them is not used to secure the network. In simple words, NPoS "does not see them".                                                                   |                                                                                    Change your nominations. Try to select validators (with reasonable commission) that have high chances to end up in the active set.                                                                                     |
| You have some inactive, and some waiting nominations. | Validators shown as "Inactive" in your staking dashboard are still in the active set and are producing blocks in the current era, but your stake has not been assigned to any of them. You will not earn rewards if your stake is not backing an active validator. In this case, you cannot be slashed either. | **Scenario 1:** You have bonded less than the Minimum Active Bond. **Scenario 2:** You have more than the Minimum Active Bond, but your account is at the tail end of the [bags list](learn-staking-advanced.md#bags-list) and within your bag there are acounts with less stake than you, in front of you. | **Scenario 1:** Try bonding more funds. **Scenario 2:** Try to put your account in front of the accounts with less stake than you. Instructions available [here](https://support.polkadot.network/support/solutions/articles/65000181018-i-have-more-than-the-minimum-bonded-but-i-m-not-getting-rewards) |
|            You have one active validator.             |                                                                         Active validators are producing blocks in the current era, and your stake has been assigned to them. Even if you are not earning rewards, you can be slashed.                                                                          |                                                                           Your validator is oversubscribed, meaning that it has more than 512 nominators (ranked by stake), and your stake is less than that of those nominators.                                                                           |                                You can try to select validators that are not oversubscribed but in the long term you might want to bond more funds (even more than the Minimum Active Bond) to increase the chance of earning rewards also with oversubscribed validators.                                |

:::tip Join a Nomination Pool

By joining a [nomination pool](learn-nomination-pools.md) that is active and earning rewards, you
can start earning staking rewards with as low as 1 DOT. The nomination pools typically have a
dedicated pool operator who ensures that the pool's stake is always backing an active validator and
is receiving rewards.

:::

:::info

You can find information about why you might not receive staking rewards on
[this support page](https://support.polkadot.network/support/solutions/articles/65000170805-why-am-i-not-getting-staking-rewards-).

:::

## Staking FAQ

:::info

See
[this support page](https://support.polkadot.network/support/solutions/articles/65000181959-staking-faq-s)
for the FAQs about staking.

:::

## Resources

- [How Nominated Proof of Stake will work in Polkadot](https://medium.com/web3foundation/how-nominated-proof-of-stake-will-work-in-polkadot-377d70c6bd43) -
  Blog post by Web3 Foundation researcher Alfonso Cevallos covering NPoS in Polkadot.
- [Validator setup](../maintain/maintain-guides-secure-validator.md)

---

:::info Polkadot-JS Guides

If you are an advanced user, see the
[Polkadot-JS guides about staking](./learn-guides-staking-index).

:::



---
id: learn-system-chains
title: System Parachains
sidebar_label: System Parachains
description: System Parachains currently deployed on Polkadot.
keywords: [common good, system, parachains, system level, public utility]
slug: ../learn-system-chains
---

import RPC from "./../../components/RPC-Connection";

## Overview

System parachains are those that contain core Polkadot protocol features, but in parachains rather
than the Relay Chain. Rather than leasing an execution core by economic means (e.g., auction),
execution cores are allocated by network [governance](learn-governance.md).

By hosting core protocol logic in parachains instead of the Relay Chain, Polkadot uses its own
scaling technology -- namely, parallel execution -- to host _itself_. System parachains remove
transactions from the Relay Chain, allowing more Relay Chain
[blockspace](https://www.rob.tech/polkadot-blockspace-over-blockchains/) to be used for Polkadot's
primary purpose: validating parachains.

System parachains always defer to on-chain governance to manage their upgrades and other sensitive
actions. That is, they do not have their own native tokens or governance systems separate from DOT
KSM. In fact, there will likely be a system parachain specifically for network governance.

:::note

In the past, these were often called "Common Good Parachains", so you may come across articles and
discussions using that term. As the network has evolved, that term has been confusing in many cases,
so "System Parachains" is preferred now. A discussion on this evolution can be found in
[this forum thread](https://forum.polkadot.network/t/polkadot-protocol-and-common-good-parachains/866).

:::

## Existing System Chains

### Asset Hub

The [Asset Hub](https://github.com/paritytech/cumulus#asset-hub-) on both Polkadot and Kusama are
the first system parachains.

The Asset Hub is an asset portal for the entire network. It helps asset creators (e.g. reserve
backed stablecoin issuers) to track the total issuance of their asset in the
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} network, including amounts that have
been transferred to other parachains. It is also the point where they can transact, to mint and
burn, to manage the on-chain asset.

The Asset Hub also supports non-fungible assets (NFTs) via the
[Uniques pallet](https://polkadot.js.org/docs/substrate/extrinsics#uniques) and the new
[nfts pallet](https://polkadot.js.org/docs/substrate/extrinsics#nfts). For more information about
NFTs see the [dedicated wiki page](./learn-nft-pallets.md).

This logic for asset management is not encoded in smart contracts, but rather directly in the
runtime of the chain. Because of the efficiency of executing logic in a parachain, fees and deposits
are about 1/10th of their respective value on the Relay Chain.

These low fee levels mean that the Asset Hub is well suited for handling
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} balances and transfers as well as managing
on-chain assets. For example, the existential deposit for
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} is
{{ polkadot: <RPC network="polkadot" path="consts.balances.existentialDeposit" defaultValue={10000000000} filter="humanReadable"/>,  :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.balances.existentialDeposit" defaultValue={333333333} filter="humanReadable"/>,  :kusama }}
while only
{{ polkadot: <RPC network="statemint" path="consts.balances.existentialDeposit" defaultValue={1000000000} filter="humanReadable"/>  :polkadot }}
{{ kusama: <RPC network="statemine" path="consts.balances.existentialDeposit" defaultValue={3333333} filter="humanReadable"/>  :kusama }}
on the Asset Hub.

### Encointer

Encointer is a blockchain platform for self-sovereign ID and a global universal basic income. With
[referendum 158](https://kusama.polkassembly.io/referendum/158) Encointer was registered as the
second system parachain on Kusama's network. The functionality of Encointer adds logic to the Relay
Chain that aims to bring financial inclusivity to Web3 and mitigate Sybil attacks with a novel Proof
of Personhood (PoP) system for unique identity.

Encointer offers a framework that, in principle, allows for any group of real people to create,
distribute, and use their own digital community tokens.
[Referendum 187](https://kusama.polkassembly.io/referendum/187) introduced a runtime upgrade
bringing governance and full functionality for communities to be able to use the protocol.

Encointer aims to invert the
[Cantillon Effect](https://www.newworldencyclopedia.org/entry/Richard_Cantillon), where money is
issued at the bottom, and not as credit to businesses or creditworthy individuals. This way, every
individual gets a [universal basic income (UBI)](https://book.encointer.org/economics-ubi.html).

To resist Sybil attacks, the Encointer protocol uses a PoP mechanism to foster a unique identity
system. The notion is that a person can only be present at one place at a given time. Participants
are requested to attend physical key-signing ceremonies with small groups of random people at
randomized locations, where these local meetings are part of one global ceremony that co-occur.
Participants use the Encointer wallet app to participate in these ceremonies, and the wallet enables
the management of local community currencies. Watch an Encointer ceremony in action in
[this video](https://www.youtube.com/watch?v=tcgpCCYBqko).

The protocol involves [other mechanisms](https://book.encointer.org/ssi.html#privacy-considerations)
to protect the privacy of users in addition to the physical key-signing ceremonies.

Encointer was accepted as a system chain based on its offer of a Sybil defense mechanism as a basis
for digital democracy. This can also be adapted by other chains, which can use the unique identity
system to prevent Sybil attacks and use PoP for token airdrops or faucets.

:::tip

To learn more about Encointer, check out the official
[Encointer book](https://book.encointer.org/introduction.html).

:::

### Collectives

The Polkadot Collectives parachain was added in
[Referendum 81](https://polkadot.polkassembly.io/referendum/81) and exists only on Polkadot (i.e.,
there is no Kusama equivalent). The Collectives chain hosts on-chain collectives that serve the
Polkadot network.

Some of these collectives are the
[Polkadot Alliance](https://polkadot.polkassembly.io/referendum/94) and the Polkadot Technical
[Fellowship](./learn-polkadot-opengov.md#the-technical-fellowship). These on-chain collectives will
play important roles in the future of network stewardship and decentralized governance.

Networks themselves can act as collectives and express their legislative voices as single opinions
within other networks. This is achieved with the assistance from a [bridge hub](#bridge-hubs).

### Bridge Hubs

Before Polkadot and Kusama supported their first parachains, the only way to design a bridge was to
put the logic onto the Relay Chain itself. Since both networks now support parachains, it makes
sense to have a parachain on each network dedicated to bridges. This is because of the execution
isolation provided by parachains.

See the [Bridges page](learn-bridges.md) for information on the latest bridge projects. Currently, a
Bridge Hub parachain is in development that will be a portal for trust-minimized bridges to other
networks.



---
id: learn-teleport
title: Teleporting Assets
sidebar_label: Teleporting Assets
description: Teleport Assets between Parachains and Relay Chain.
keywords: [teleport, assets, transfer]
slug: ../learn-teleport
---

import RPC from "./../../components/RPC-Connection";

One of the main properties that Polkadot and Kusama bring to the ecosystems is decentralized
blockchain interoperability. This interoperability allows for asset teleportation: the process of
moving assets, such as coins, tokens, or NFTs, between chains (parachains) to use them as you would
any other asset native to that chain. Interoperability is possible through [XCM](learn-xcm.md) and
[SPREE modules](learn-spree.md), which together ensure that assets are not lost or duplicated across
multiple chain.

:::info Walk-through video tutorial about teleporting assets

See [this technical explainer video](https://youtu.be/3tE9ouub5Tg) to learn how to teleport assets
from Kusama to the Asset Hub. The same procedure applies to teleporting between Polkadot and the
Polkadot Asset Hub, or between any other parachain.

:::

## How Teleports work

![teleport](../assets/asset-hub/teleport-asset.png)

As you can see from the diagram above, there are only 2 actors within this model: the source and the
destination. The way in which we transfer assets between the source and the destination are briefly
summarized in the numbered labels on the diagram, and are explained in more detail below:

### Initiate Teleport

The source gathers the assets to be teleported from the sending account and **takes them out** from
the circulating supply, taking note of the total amount of assets that was taken out.

### Receive Teleported Assets

The source then creates an [XCM](learn-xcm.md) instruction called `ReceiveTeleportedAssets`
containing as parameters a) the receiving account and b) the amount of assets taken out from
circulation. It then sends this instruction over to the destination, where it gets processed and new
assets are **put back into** the circulating supply.

### Deposit Asset

The destination deposits the assets to the receiving account. The actions of **taking out** from the
circulating supply and **putting back** into the circulating supply show the great flexibility that
an [XCM](learn-xcm.md) executor has in regulating the flow of an asset without changing its
circulating supply. Assets are transferred to an inaccessible account in order to take them out from
circulation. Likewise, for putting assets back into circulation, assets are released from a
pre-filled and inaccessible treasury, or perform a mint of the assets. This process requires mutual
trust between the source and destination. The destination must trust the source of having
appropriately removed the sent assets from the circulating supply, and the source must trust the
destination of having put the received assets back into circulation. The result of an asset
teleportation should result in the same circulating supply of the asset, and failing to uphold this
condition will result in a change in the asset's total issuance (in the case of fungible tokens) or
a complete loss/duplication of an NFT.

## Teleporting Tokens using the Polkadot-JS UI

- [Video tutorial on Teleporting](https://youtu.be/PGyDpH2kad8)
- [Additional support article](https://support.polkadot.network/support/solutions/articles/65000181119-how-to-teleport-dot-or-ksm-between-statemint-or-statemine)

## Troubleshooting

If you do not see "Accounts > Teleport" in [Polkadot-JS UI], the source chain that you have selected
does not support teleportation yet.


---
id: learn-transaction-fees
title: Transaction Fees
sidebar_label: Transaction Fees
description: How Transaction Fees are Calculated and Handled.
keywords: [transaction, fees]
slug: ../learn-transaction-fees
---

Several resources in a blockchain network are limited, for example, storage and computation.
Transaction fees prevent individual users from consuming too many resources.
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} uses a weight-based fee model as
opposed to a gas-metering model. As such, fees are charged prior to transaction execution; once the
fee is paid, nodes will execute the transaction.

[Web3 Foundation Research](https://research.web3.foundation/Polkadot/overview/token-economics#2-slow-adjusting-mechanism)
designed the Polkadot fee system with the following objectives:

- Each Relay Chain block should be processed efficiently to avoid delays in block production.
- The growth rate of the Relay Chain should be bounded.
- Each block should have space for special, high-priority transactions like misconduct reports.
- The system should be able to handle spikes in demand.
- Fees should change slowly so that senders can accurately predict the fee for a given transaction.

## Fee Calculation

Fees on the Polkadot Relay Chain are calculated based on three parameters:

- A Weight fee
  - Base weight
  - Call(s) weight
- A Length fee
- A Tip (optional).

As a permissionless system, the {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}
network needs to implement a mechanism to measure and to limit the usage in order to establish an
economic incentive structure, to prevent the network overload, and to mitigate DoS vulnerabilities.
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} enforces a limited time-window for
block producers to create a block, including limitations on block size, which can make the selection
and execution of certain extrinsics too expensive and decelerate the network. Extrinsics which
require too many resources are discarded by the network.

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} defines a specified
[block ratio](https://spec.polkadot.network/#sect-limitations) ensuring that only a certain portion
of the total block size gets used for regular extrinsics. The remaining space is reserved for
critical, operational extrinsics required for the functionality by network itself.

This is handled by a [weight](../general/glossary.md#weights) system, where the cost of the
transactions (referred to as [extrinsics](../general/glossary.md#extrinsics)) are determined before
execution. Weights are a fixed set of numbers used in Substrate-based chains to manage the time it
takes to validate a block. Each transaction has a base weight that accounts for the overhead of
inclusion (e.g. signature verification) and a dispatch weight that accounts for the time to execute
the transaction. All weights, even the base weight, are a measure of time to execute on some
standard hardware.

The runtime
[converts weight units to balance units](https://docs.substrate.io/reference/how-to-guides/weights/calculate-fees/)
as part of the fee calculation.

The weight fee is the sum of the base weight and the sum of the total weight consumed by call(s).

:::info A transaction can include several calls

For instance, a `batch` can contain `bond` and `nominate`, and the weight would be one base weight
and then the sum of the weights for `bond` and `nominate`.

:::

To learn more about the motivation of a weight fee, check out this
[Substrate doc](https://docs.substrate.io/main-docs/build/tx-weights-fees/) on weights.

The length fee is a per-byte fee multiplier for the size of the transaction in bytes.

There is also a targeted fee adjustment that serves as a multiplier which tunes the final fee based
on network congestion. This can constitute an adjusted weight fee calculated as the targeted fee
adjustment times the weight fee.

Together, these fees constitute the inclusion fee. The inclusion fee is the base fee plus the length
fee plus the adjusted weight fee.

The inclusion fee is deducted from the sender's account before transaction execution. A portion of
the fee will go to the block author, and the remainder will go to the [Treasury](learn-treasury.md).
This is 20% and 80%, respectively.

Tips are an optional transaction fee that users can add. Tips are not part of the inclusion fee and
are an incentive to block authors for prioritizing a transaction, and the entire tip goes directly
to the block author.

Final weights are assigned based on the worst case scenario of each runtime function. The runtime
has the ability to "refund" the amount of weight which was overestimated once the runtime function
is actually executed.

The runtime only returns weights if the difference between the assigned weight and the actual weight
calculated during execution is greater than 20%.

Checkout some examples of how various weights are gauged in the
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} runtime for several different types
of operations:

- [request_judgement](https://spec.polkadot.network/#id-practical-example-1-request_judgement) -
  from the identity pallet, allows users to request judgement from a specific registrar
- [payout_stakers](https://spec.polkadot.network/#sect-practical-example-payout-stakers) - from the
  staking Pallet, is invoked by a single account in order to payout the reward for all nominators
  who back a particular validator
- [transfer](https://spec.polkadot.network/#id-practical-example-3-transfer) - from the balances
  module, is designed to move the specified balance by the sender to the receiver
- [withdraw_unbounded](https://spec.polkadot.network/#id-practical-example-4-withdraw_unbounded) -
  from the staking module, is designed to move any unlocked funds from the staking management system
  to be ready for transfer

## Block Limits and Transaction Priority

Blocks in {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} have both a maximum length
(in bytes) and a maximum weight. Block producers will fill blocks with transactions up to these
limits. A portion of each block - currently 25% - is reserved for critical transactions that are
related to the chain's operation. Block producers will only fill up to 75% of a block with normal
transactions. Some examples of operational transactions:

- Misbehavior reports
- Council operations
- Member operations in an election (e.g. renouncing candidacy)

Block producers prioritize transactions based on each transaction's total fee. Since a portion of
the fee will go to the block producer, producers will include the transactions with the highest fees
to maximize their reward.

## Fees

Block producers charge a fee in order to be economically sustainable. That fee must always be
covered by the sender of the transaction.
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} has a flexible mechanism to determine
the minimum cost to include transactions in a block.

Transaction volume on blockchains is highly irregular, and therefore transaction fees need a
mechanism to adjust. However, users should be able to predict transaction fees.

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} uses a slow-adjusting fee mechanism
with tips to balance these two considerations. In addition to block _limits_,
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} also has a block fullness _target._
Fees increase or decrease for the next block based on the fullness of the current block relative to
the target. The per-weight fee can change up to 30% in a 24 hour period. This rate captures
long-term trends in demand, but not short-term spikes. To consider short-term spikes,
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} uses tips on top of the length and
weight fees. Users can optionally add a tip to the fee to give the transaction a higher priority.

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} fees consists of three parts:

1. `Base fee`: a fixed fee that is applied to every transaction and set by the runtime.
2. `Length fee`: a fee that gets multiplied by the length of the transaction, in bytes.
3. `Weight fee`: a fee for each, varying runtime function. Runtime implementers need to implement a
   conversion mechanism which determines the corresponding currency amount for the calculated
   weight.

The final fee can be summarized as:

```
fee = base_fee + length_of_transaction_in_bytes * length_fee + weight_fee
```

For example, the Polkadot Runtime defines the following values:

Base fee: 100 uDOTs

Length fee: Length fee: 0.1 uDOTs

So, the weight to fee conversion is calculated as follows:

```
weight_fee = weight * (100 uDots / (10 * 10’000))
```

A weight of 10’000 (the smallest non-zero weight) is mapped to 1/10 of 100 uDOT. This fee will never
exceed the max size of an unsigned 128 bit integer.

### Fee Multiplier

{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} can add a additional fee to
transactions if the network becomes too busy and starts to decelerate the system. This fee can
create an incentive to avoid the production of low priority or insignificant transactions. In
contrast, those additional fees will decrease if the network calms down and can execute transactions
without much difficulties.

This additional fee is known as the `Fee Multiplier` and its value is defined by the
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} runtime. The multiplier works by
comparing the saturation of blocks; if the previous block is less saturated than the current block
(implying an uptrend), the fee is slightly increased. Similarly, if the previous block is more
saturated than the current block (implying a downtrend), the fee is slightly decreased.

The final fee is calculated as:

```
final_fee = fee * fee_multiplier
```

The `Update Multiplier` defines how the multiplier can change. Each runtime has the ability to
define this behavior accordingly. For example, the
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} runtime internally updates the
multiplier after each block according to a custom formula defined
[here](https://spec.polkadot.network/#id-update-multiplier).

## Calcuating Fees with Polkadot-JS

One useful utility for estimating transaction fees programmatically is the via the
[@polkadot/api](https://www.npmjs.com/package/@polkadot/api). Check out the following script that
logs some relevant fee information:

```js
// Estimate the fees as RuntimeDispatchInfo using the signer
const info = await api.tx.balances.transfer(recipient, 123).paymentInfo(sender);

// Log relevant info, partialFee is Balance, estimated for current
console.log(`
  class=${info.class.toString()},
  weight=${info.weight.toString()},
  partialFee=${info.partialFee.toHuman()}
`);
```

For additional information on interacting with the API, checkout
[Polkadot-JS](../general/polkadotjs.md).

## Shard Transactions

The transactions that take place within
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}'s shards - parachains and
parathreads - do not incur Relay Chain transaction fees. Users of shard applications do not even
need to hold DOT tokens, as each shard has its own economic model and may or may not have a token.
There are, however, situations where shards themselves make transactions on the Relay Chain.

[Parachains](learn-parachains.md) have a dedicated slot on the Relay Chain for execution, so their
collators do not need to own DOT in order to include blocks. The parachain will make some
transactions itself, for example, opening or closing an [XCM](learn-xcm.md) channel, participating
in an [auction](learn-auction.md) to renew its slot, or upgrading its runtime. Parachains have their
own accounts on the Relay Chain and will need to use those funds to issue transactions on the
parachain's behalf.

[Parathreads](learn-parathreads.md) will also make all the same transactions that a parachain might.
In addition, the collators need to participate in an auction every block to progress their chain.
The collators will need to have DOT to participate in these auctions.

## Other Resource Limitation Strategies

Transaction weight must be computable prior to execution, and therefore can only represent fixed
logic. Some transactions warrant limiting resources with other strategies. For example:

- Bonds: Some transactions, like voting, may require a bond that will be returned or slashed after
  an on-chain event. In the voting example, returned at the end of the election or slashed if the
  voter tried anything malicious.
- Deposits: Some transactions, like setting an [identity](learn-identity.md) or claiming an index,
  use storage space indefinitely. These require a deposit that will be returned if the user decides
  to free storage (e.g. clear their IDE).
- Burns: A transaction may burn funds internally based on its logic. For example, a transaction may
  burn funds from the sender if it creates new storage entries, thus increasing the state size.
- Limits: Some limits are part of the protocol. For example, nominators can only nominate 16
  validators. This limits the complexity of [Phragmén](learn-phragmen.md).

## Advanced

This page only covered transactions that come from normal users. If you look at blocks in a block
explorer, though, you may see some "extrinsics" that look different from these transactions. In
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} (and any chain built on Substrate),
an extrinsic is a piece of information that comes from outside the chain. Extrinsics fall into three
categories:

- Signed transactions
- Unsigned transactions
- Inherents

This page only covered signed transactions, which is the way that most users will interact with
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} . Signed transactions come from an
account that has funds, and therefore {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}
can charge a transaction fee as a way to prevent spam.

Unsigned transactions are for special cases where a user needs to submit an extrinsic from a key
pair that does not control funds. For example, when users
[claim their DOT tokens](https://claims.polkadot.network) after genesis, their DOT address doesn't
have any funds yet, so that uses an unsigned transaction. Validators also submit unsigned
transactions in the form of "heartbeat" messages to indicate that they are online. These heartbeats
must be signed by one of the validator's [session keys](learn-cryptography.md). Session keys never
control funds. Unsigned transactions are only used in special cases because, since Polkadot cannot
charge a fee for them, each one needs its own, custom validation logic.

Finally, inherents are pieces of information that are not signed or included in the transaction
queue. As such, only the block author can add inherents to a block. Inherents are assumed to be
"true" simply because a sufficiently large number of validators have agreed on them being
reasonable. For example, {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} blocks
include a timestamp inherent. There is no way to prove that a timestamp is true the way one proves
the desire to send funds with a signature. Rather, validators accept or reject the block based on
how reasonable they find the timestamp. In
{{ polkadot: Polkadot, :polkadot }}{{ kusama: Kusama, :kusama }} it must be within some acceptable
range of their own system clocks.

## Learn More

- [Web3 Foundation Research](https://research.web3.foundation/Polkadot/overview/token-economics)
- [Substrate Extrinsics, Weights & Fees](https://docs.substrate.io/main-docs/build/tx-weights-fees/)



---
id: learn-treasury
title: Governance v1 Treasury
sidebar_label: Gov1 Treasury
description: The Polkadot's On-chain Treasury during Gov1.
keywords: [treasury, funds, funding, tips, tipping]
slug: ../learn-treasury
---

import RPC from "./../../components/RPC-Connection";

:::info Use OpenGov to access treasury funds

Governance v1 is deprecated. To access
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} treasury funds use
[OpenGov](./learn-polkadot-opengov.md). For more information about OpenGov Treasury see the
[dedicated wiki page](./learn-polkadot-opengov-treasury.md).

:::

The Treasury is a pot of funds collected through a portion of block production rewards, transaction
fees, slashing, [staking inefficiencies](learn-staking.md#inflation), etc.

The Treasury funds are held in a [system account](./learn-account-advanced.md#system-accounts) not
accessible by anyone; only the system internal logic can access it. Funds can be spent by making a
spending proposal that, if approved by the [Council](learn-governance.md#council), will enter a
waiting period before distribution. This waiting period is known as the _spend period_, and its
duration is subject to [governance](learn-governance.md), with the current default set to
{{ polkadot: <RPC network="polkadot" path="consts.treasury.spendPeriod" defaultValue={345600} filter="blocksToDays"/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.treasury.spendPeriod" defaultValue={86400} filter="blocksToDays"/> :kusama }}
days. The Treasury attempts to spend as many proposals in the queue as it can without running out of
funds.

Treasury payout is an automatic process:

- If the Treasury funds run out with approved proposals left to fund, those proposals are kept in
  the approved queue, and will receive funding in the following spend period.
- If the Treasury ends a spend period without spending all of its funds, it suffers a burn of a
  percentage of its funds - thereby causing deflationary pressure. This encourages the spending of
  the funds in the Treasury by Polkadot's governance system.
  {{ polkadot: This percentage is currently at 1% on Polkadot. :polkadot }}
  {{ kusama: This percentage is currently 0.2% on Kusama, with the amount currently
  going to [Society](https://guide.kusama.network/docs/maintain-guides-society-kusama) rather than being
  burned. :kusama }}

When a stakeholder wishes to propose a spend from the Treasury, they must reserve a deposit of at
least 5% of the proposed spend (see below for variations). This deposit will be slashed if the
proposal is rejected, and returned if it is accepted.

Proposals may consist of (but are not limited to):

- Infrastructure deployment and continued operation.
- Network security operations (monitoring services, continuous auditing).
- Ecosystem provisions (collaborations with friendly chains).
- Marketing activities (advertising, paid features, collaborations).
- Community events and outreach (meetups, pizza parties, hackerspaces).
- Software development (wallets and wallet integration, clients and client upgrades).

The [Council](learn-governance#council) governs the Treasury and how the funds are spent is up to
their judgment.

:::caution

The Council does not approve or deny Treasury Proposals based on the available funds. Proposals are
not approved just because there are funds ready to spend but are subject to a burn.

:::

## Funding the Treasury

The Treasury is funded from different sources:

1. Slashing: When a validator is slashed for any reason, the slashed amount is sent to the Treasury
   with a reward going to the entity that reported the validator (another validator). The reward is
   taken from the slash amount and varies per offence and number of reporters.
2. Transaction fees: A portion of each block's transaction fees goes to the Treasury, with the
   remainder going to the block author.
3. Staking inefficiency: [Inflation](learn-staking.md#inflation) is designed to be 10% in the first
   year, and the ideal staking ratio is set at 50%, meaning half of all tokens should be locked in
   staking. Any deviation from this ratio will cause a proportional amount of the inflation to go to
   the Treasury. In other words, if 50% of all tokens are staked, then 100% of the inflation goes to
   the validators as reward. If the staking rate is greater than or less than 50%, then the
   validators will receive less, with the remainder going to the Treasury.
4. Parathreads: [Parathreads](learn-parathreads.md) participate in a per-block auction for block
   inclusion. Part of this bid goes to the validator that accepts the block and the remainder goes
   to the Treasury.

## Tipping

Next to the proposals process, a separate system for making tips exists for the Treasury. Tips can
be suggested by anyone and are supported by members of the Council. Tips do not have any definite
value, and the final value of the tip is decided based on the median of all tips issued by the
tippers.

Currently, the tippers are the same as the members of the Council. However, being a tipper is not
the direct responsibility of the Council, and at some point the Council and the tippers may be
different groups of accounts.

A tip will enter a closing phase when more than a half plus one of the tipping group have endorsed a
tip. During that time frame, the other members of the tipping group can still issue their tips, but
do not have to. Once the window closes, anyone can call the `close_tip` extrinsic, and the tip will
be paid out.

There are two types of tips:

- public: A small bond is required to place them. This bond depends on the tip message length, and a
  fixed bond constant defined on chain, currently
  {{ polkadot: <RPC network="polkadot" path="consts.tips.tipReportDepositBase" defaultValue={10000000000} filter="humanReadable"/>. :polkadot }}
  {{ kusama: <RPC network="kusama" path="consts.tips.tipReportDepositBase" defaultValue={166000000000} filter="humanReadable"/>. :kusama }}
  Public tips carry a finder's fee of
  {{ polkadot: <RPC network="polkadot" path="consts.tips.tipFindersFee" defaultValue={20}/>%, :polkadot }}
  {{ kusama: <RPC network="kusama" path="consts.tips.tipFindersFee" defaultValue={20}/>%, :kusama }}
  which is paid out from the total amount.
- tipper-initiated: Tips that a Council member published, do not have a finder's fee or a bond.

:::info

For information about how to submit a tip from the Treasury you can read
[this support article](https://support.polkadot.network/support/solutions/articles/65000181971).

:::

To better understand the process a tip goes through until it is paid out, let's consider the example
below.

### Example

Bob has done something great for {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}.
Alice has noticed this and decides to report Bob as deserving a tip from the Treasury. The Council
is composed of three members Charlie, Dave, and Eve.

Alice begins the process by issuing the `report_awesome` extrinsic. This extrinsic requires two
arguments, a reason and the beneficiary. Alice submits Bob's address with the reason being a UTF-8
encoded URL to a post on {{ polkadot: [Polkassembly](https://polkadot.polkassembly.io) :polkadot }}
{{ kusama: [Polkassembly](https://kusama.polkassembly.io) :kusama }} that explains her reasoning for
why Bob deserves the tip.

As mentioned above, Alice must also lock up a deposit for making this report. The deposit is the
base deposit as set in the chain's parameter list, plus the additional deposit per byte contained in
the reason. This is why Alice submitted a URL as the reason instead of the explanation directly: it
was cheaper for her to do so. For her trouble, Alice is able to claim the eventual finder's fee if
the tip is approved by the tippers.

Since the tipper group is the same as the Council, the Council must now collectively (but also
independently) decide on the value of the tip that Bob deserves. Charlie, Dave, and Eve all review
the report and make tips according to their personal valuation of the benefit Bob has provided to
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}. Charlie tips
{{ polkadot: 10 DOT :polkadot }}{{ kusama: 1 KSM :kusama }}, Dave tips
{{ polkadot: 30 DOT :polkadot }}{{ kusama: 3 KSM :kusama }}, and Eve tips
{{ polkadot: 100 DOT :polkadot }}{{ kusama: 10 KSM :kusama }}.

The tip could have been closed out with only two of the three tippers. Once more than half of the
tippers group have issued tip valuations, the countdown to close the tip will begin. In this case,
the third tipper issued their tip before the end of the closing period, so all three were able to
make their tip valuations known.

The actual tip that will be paid out to Bob is the median of these tips, so Bob will be paid out
{{ polkadot: 30 DOT :polkadot }}{{ kusama: 3 KSM :kusama }} from the Treasury. In order for Bob to
be paid his tip, some account must call the `close_tip` extrinsic at the end of the closing period
for the tip. This extrinsic may be called by anyone.

## Bounties Spending

There are practical limits to Council Members curation capabilities when it comes to treasury
proposals: Council members likely do not have the expertise to make a proper assessment of the
activities described in all proposals. Even if individual Councillors have that expertise, it is
highly unlikely that a majority of members are capable in such diverse topics.

Bounties Spending proposals aim to delegate the curation activity of spending proposals to experts
called Curators: They can be defined as addresses with agency over a portion of the Treasury with
the goal of fixing a bug or vulnerability, developing a strategy, or monitoring a set of tasks
related to a specific topic: all for the benefit of the
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} ecosystem.

A proposer can submit a bounty proposal for the Council to pass, with a curator to be defined later,
whose background and expertise is such that they are capable of determining when the task is
complete. Curators are selected by the Council after the bounty proposal passes, and need to add an
upfront payment to take the position. This deposit can be used to punish them if they act
maliciously. However, if they are successful in their task of getting someone to complete the bounty
work, they will receive their deposit back and part of the bounty reward.

When submitting the value of the bounty, the proposer includes a reward for curators willing to
invest their time and expertise in the task: this amount is included in the total value of the
bounty. In this sense, the curator's fee can be defined as the result of subtracting the value paid
to the bounty rewardee from the total value of the bounty.

In general terms, curators are expected to have a well-balanced track record related to the issues
the bounty tries to resolve: they should be at least knowledgeable on the topics the bounty touches,
and show project management skills or experience. These recommendations ensure an effective use of
the mechanism. A Bounty Spending is a reward for a specified body of work - or specified set of
objectives - that needs to be executed for a predefined treasury amount to be paid out. The
responsibility of assigning a payout address once the specified set of objectives is completed is
delegated to the curator.

After the Council has activated a bounty, it delegates the work that requires expertise to the
curator who gets to close the active bounty. Closing the active bounty enacts a delayed payout to
the payout address and a payout of the curator fee. The delay phase allows the Council to act if any
issues arise.

To minimize storage on chain in the same way as any proposal, bounties don't contain contextual
information. When a user submits a bounty spending proposal, they will probably need to find an
off-chain way to explain the proposal (any of the available community forums serve this purpose).
[This template](https://docs.google.com/document/d/1-IBz_owspV5OcvezWXpksWDQReWowschD0TFuaVKKcU/edit?usp=sharing)
can help as a checklist of all needed information for the Council to make an informed decision.

The bounty has a predetermined duration of 90 days with the possibility of being extended by the
curator. Aiming to maintain flexibility on the tasks’ curation, the curator will be able to create
sub-bounties for more granularity and allocation in the next iteration of the mechanism.

### Creating a Bounty Proposal

Anyone can create a Bounty proposal using Polkadot-JS Apps: Users are able to submit a proposal on
the dedicated Bounty section under Governance. The development of a robust user interface to view
and manage bounties in the Polkadot Apps is still under development and it will serve Council
members, Curators and Beneficiaries of the bounties, as well as all users observing the on-chain
treasury governance. For now, the help of a Councillor is needed to open a bounty proposal as a
motion to be voted.

To submit a bounty, please visit [Polkadot-JS Apps](https://polkadot.js.org/apps) and click on the
governance tab in the options bar on the top of the site. After, click on 'Bounties' and find the
button '+ Add Bounty' on the upper-right side of the interface. Complete the bounty title, the
requested allocation (including curator's fee) and confirm the call.

After this, a Council member will need to assist you to pass the bounty proposal for vote as a
motion. You can contact the Council by joining the
{{ polkadot: Polkadot Direction [channel](https://matrix.to/#/#Polkadot-Direction:parity.io) :polkadot }}
{{ kusama: Kusama Direction [channel](https://matrix.to/#/#Kusama-Direction:parity.io) :kusama }} in
Element or joining our
{{ polkadot: Polkadot Discord [server](https://parity.link/polkadot-discord) :polkadot }}
{{ kusama: Kusama Discord [server](https://parity.link/kusama-discord) :kusama }} and publishing a
short description of your bounty, with a link to one of the [forums](#announcing-the-proposal) for
contextual information.

A bounty can be cancelled by deleting the earmark for a specific treasury amount or be closed if the
tasks have been completed. On the opposite side, the 90 days life of a bounty can be extended by
amending the expiry block number of the bounty to stay active.

### Closing a bounty

The curator can close the bounty once they approve the completion of its tasks. The curator should
make sure to set up the payout address on the active bounty beforehand. Closing the Active bounty
enacts a delayed payout to the payout address and a payout of the curator fee.

A bounty can be closed by using the extrinsics tab and selecting the Treasury pallet, then
`Award_bounty`, making sure the right bounty is to be closed and finally sign the transaction. It is
important to note that those who received a reward after the bounty is completed, must claim the
specific amount of the payout from the payout address, by calling `Claim_bounty` after the curator
closed the allocation.

To understand more about Bounties and how this new mechanism works, read this
[Polkadot Blog post](https://polkadot.network/kusama-and-polkadot-now-reward-curators-helping-to-scale-councils-functions-join-the-force-moving-the-community-forward/).

## FAQ

### What prevents the Treasury from being captured by a majority of the Council?

The majority of the Council can decide the outcome of a treasury spend proposal. In an adversarial
mindset, we may consider the possibility that the Council may at some point go rogue and attempt to
steal all of the treasury funds. It is a possibility that the treasury pot becomes so great, that a
large financial incentive would present itself.

For one, the Treasury has deflationary pressure due to the burn that is suffered every spend period.
The burn aims to incentivize the complete spend of all treasury funds at every burn period, so
ideally the treasury pot doesn't have time to accumulate mass amounts of wealth. However, it is the
case that the burn on the Treasury could be so little that it does not matter - as is the case
currently on Kusama with a 0.2% burn.

However, it is the case on Kusama that the Council is composed of mainly well-known members of the
community. Remember, the Council is voted in by the token holders, so they must do some campaigning
or otherwise be recognized to earn votes. In the scenario of an attack, the Council members would
lose their social credibility. Furthermore, members of the Council are usually externally motivated
by the proper operation of the chain. This external motivation is either because they run businesses
that depend on the chain, or they have direct financial gain (through their holdings) of the token
value remaining steady.

Concretely, there are a couple on-chain methods that resist this kind of attack. One, the Council
majority may not be the token majority of the chain. This means that the token majority could vote
to replace the Council if they attempted this attack - or even reverse the treasury spend. They
would do this through a normal referendum. Two, there are time delays to treasury spends. They are
only enacted every spend period. This means that there will be some time to observe this attack is
taking place. The time delay then allows chain participants time to respond. The response may take
the form of governance measures or - in the most extreme cases a liquidation of their holdings and a
migration to a minority fork. However, the possibility of this scenario is quite low.

## Further Reading

- [Substrate's Treasury Pallet](https://github.com/paritytech/substrate/blob/master/frame/treasury/src/lib.rs)

- [Documentation of the Rust implementation of the Treasury](https://paritytech.github.io/substrate/master/pallet_treasury/index.html)

---
id: learn-validator
title: Validator
sidebar_label: Validator
description: Role of Validators within the Polkadot Ecosystem.
keywords: [validate, validator, maintain, NPoS, stake]
slug: ../learn-validator
---

import RPC from "./../../components/RPC-Connection";

:::info

This page provides a general overview of the role of validators in
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}. For more detailed information you
can read the Protocol Overview Section in
[The Polkadot Parachain Host Implementers' Guide](https://paritytech.github.io/polkadot/book/).

:::

Validators secure the [relay chain](learn-architecture.md#relay-chain) by staking
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }}, validating proofs from collators and
participating in consensus with other validators.

Validators play a crucial role in adding new blocks to the relay chain and, by extension, to all
parachains. This allows parties to complete cross-chain transactions via the relay chain. They
guarantee that each parachain follows its unique rules and can pass messages between shards in a
trust-free environment.

## Para-validators

Parachain validators (i.e. para-validators) participate to the
[Parachain Phase of the AnV Protocol](./learn-parachains-protocol.md/#parachain-phase), and submit
[candidate receipts](./learn-parachains-protocol.md/#candidate-receipts) to the Relay Chain
transaction queue so that a block author can include information on the parablock in a fork of of
the Relay Chain.

Para-validators work in groups and are selected by the runtime in every epoch to validate parachain
blocks for all parachains connected to the relay chain. The selected para-validators are one of
{{ polkadot: <RPC network="polkadot" path="query.staking.validatorCount" defaultValue={297}/> :polkadot }}
{{ kusama: <RPC network="kusama" path="query.staking.validatorCount" defaultValue={1000}/> :kusama }}
validators randomly selected (per epoch) to participate in the validation, creating a validator pool
of 200 para-validators.

Para-validators verify that the information contained in an assigned set of parachain blocks is
valid. They receive parachain block candidates from the [collators](./learn-collator.md) together
with a Proof-of-Validity (PoV). The para-validators perform the first round of validity checks on
the block candidates. Candidates that gather enough signed validity statements are considered
_backable_.

## Block Authors

There are validators on the Relay Chain who participate in the consensus mechanism to produce the
relay chain blocks based on validity statements from other validators. These validators are called
block authors, they are selected by [BABE](./learn-consensus.md/#block-production-babe) and can note
up to one backable candidate for each parachain to include in the relay chain. A backable candidate
included in the relay chain is considered _backed_ in that fork of the chain.

In a Relay Chain block, block authors will only include
[candidate receipts](./learn-parachains-protocol.md/#candidate-receipts) that have a parent
candidate receipt in an earlier Relay Chain block. This ensures the parachain follows a valid chain.
Also, the block authors will only include a receipt for which they have an erasure coding chunk,
ensuring that the system can perform the next round of availability and validity checks.

## Other Validators

Validators also contribute to the so-called **availability distribution**. In fact, once the
candidate is backed in a fork of the relay chain, it is still _pending availability_, i.e. it is not
fully included (only tentative included) as part of the parachain until it is proven avaialable
(together with the PoV). Information regarding the availability of the candidate will be noted in
the following relay chain blocks. Only when there is enough information, the candidate is considered
a full parachain block or _parablock_.

Validators also participate in the so-called
[**approval process**](./learn-parachains-protocol.md/#approval-process). Once the parablock is
considered available and part of the parachain, it is still _pending approval_. Because
para-validators are a small subset of all validators, there is a risk that by chance the majority of
para-validators assigned to a parachain might be dishonest. It is thus necessary to run a secondary
verification of the parablock before it can be considered approved. Having a secondary verification
step avoids the allocation of more para-validators that will ultimately reduce the throughput of the
system.

Any instances of non-compliance with the consensus algorithms result in
[**disputes**](./learn-parachains-protocol.md/#disputes) with the punishment of the validators on
the wrong side by removing some or all their staked
{{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }}, thereby discouraging bad actors. Good
performance, however, will be rewarded, with validators receiving block rewards (including
transaction fees) in the form of {{ polkadot: DOT :polkadot }}{{ kusama: KSM :kusama }} in exchange
for their activities.

Finally, validators participate in the
[chain selection process within GRANDPA](./learn-parachains-protocol.md/#chain-selection), ensuring
that only available and valid blocks end within the finalized Relay Chain.

:::info Within an era roles can change

Within the same era, a Validator can be a para-validator, block author, and participate in the
availability distribution or the approval process. Those roles can change between sessions.

:::

## Further Readings

### Guides

- [How to Validate on Polkadot](../maintain/maintain-guides-how-to-validate-polkadot.md) - Guide on
  how to set up a validator on the Polkadot live network.
- [Validator Payout Overview](../maintain/maintain-guides-validator-payout.md) - A short overview on
  how the validator payout mechanism works.
- [How to run your validator as a systemd process](../maintain/maintain-guides-how-to-systemd.md) -
  Guide on running your validator as a `systemd` process so that it will run in the background and
  start automatically on reboots.
- [How to Upgrade your Validator](../maintain/maintain-guides-how-to-upgrade.md) - Guide for
  securely upgrading your validator when you want to switch to a different machine or begin running
  the latest version of client code.
- [How to Use Validator Setup](../maintain/maintain-guides-how-to-validate-polkadot.md) - Guide on
  how to use Polkadot / Kusama validator setup.

### Other References

- [How to run a Polkadot node (Docker)](https://medium.com/@acvlls/setting-up-a-maintain-the-easy-way-3a885283091f)
- [A Serverless Failover Solution for Web3.0 Validator Nodes](https://medium.com/hackernoon/a-serverless-failover-solution-for-web-3-0-validator-nodes-e26b9d24c71d) -
  Blog that details how to create a robust failover solution for running validators.
- [VPS list](../maintain/kusama/maintain-guides-how-to-validate-kusama.md##vps-list)
- [Polkadot Validator Lounge](https://matrix.to/#/!NZrbtteFeqYKCUGQtr:matrix.parity.io?via=matrix.parity.io&via=matrix.org&via=web3.foundation) -
  A place to chat about being a validator.
- [Slashing Consequences](learn-staking#slashing) - Learn more about slashing consequences for
  running a validator node.
- [Why You Should be A Validator on Polkadot and Kusama](https://www.youtube.com/watch?v=0EmP0s6JOW4&list=PLOyWqupZ-WGuAuS00rK-pebTMAOxW41W8&index=2)
- [Roles and Responsibilities of a Validator](https://www.youtube.com/watch?v=riVg_Up_fCg&list=PLOyWqupZ-WGuAuS00rK-pebTMAOxW41W8&index=15)
- [Validating on Polkadot](https://www.crowdcast.io/e/validating-on-polkadot) - An explanation of
  how to validate on Polkadot, with Joe Petrowski and David Dorgan of Parity Technologies, along
  with Tim Ogilvie from Staked.

### Security / Key Management

- [Validator Security Overview](https://github.com/w3f/validator-security)

### Monitoring Tools

- [PANIC for Polkadot](https://github.com/SimplyVC/panic_polkadot) - A monitoring and alerting
  solution for Polkadot / Kusama node
- [Polkadot Telemetry Service](https://telemetry.polkadot.io/#list/Kusama%20CC3) - Network
  information, including what nodes are running on a given chain, what software versions they are
  running, and sync status.

### Validator Stats

- [HashQuark Staking Strategy](https://polkacube.hashquark.io/#/polkadot/strategy) - The HashQuark
  staking strategy dashboard helps you choose the optimal set-up to maximize rewards, and provides
  other useful network monitoring tools.
- [Polkastats](https://polkastats.io/) - Polkastats is a cleanly designed dashboard for validator
  statistics.
- [YieldScan](https://yieldscan.app/) - Staking yield maximization platform, designed to minimize
  effort.
- [Subscan Validators Page](https://kusama.subscan.io/validator) - Displays information on the
  current validators - not as tailored for validators as the other sites.


---
id: learn-video-tutorials
title: Videos about Polkadot
sidebar_label: Videos
description: Videos about Polkadot and Related Topics.
keywords: [learn, video, tutorials, explainers]
slug: ../learn-video-tutorials
---

:::info Visit the Polkadot YouTube Channel

For more videos see all playlists on the
[Polkadot YouTube channel](https://www.youtube.com/@PolkadotNetwork/playlists).

:::

## Ongoing Series

Learn about Polkadot and Substrate at a deeper level with these ongoing deep dives, technical
seminars, and initiatives within the ecosystem.

<tr class="cards-container">
  <td>
    <a class="guide-link" href="https://youtube.com/playlist?list=PLOyWqupZ-WGuAuS00rK-pebTMAOxW41W8">
      <img src="/img/polkadot-guide/tech-explainers.png" alt="Drawing" width="250" height="150"/>
        <div class="cards-body">
            <h5 class="cards-title">Technical Explainers</h5>
        </div>
    </a>
  </td>
  <td>
    <a class="guide-link" href="https://youtube.com/playlist?list=PLOyWqupZ-WGsfgxkwTdMOwnbRW4nx_T-i">
      <img src="/img/polkadot-guide/substrate-seminars.png" alt="Drawing" width="250" height="150"/>
        <div class="cards-body">
            <h5 class="cards-title">Substrate Seminars</h5>
        </div>
    </a>
  </td>
  <td>
    <a class="guide-link" href="https://youtube.com/playlist?list=PLOyWqupZ-WGsfnlpkk0KWX3uS4yg6ZztG">
      <img class="guide-image" src="/img/polkadot-guide/deep-dives.png" alt="Drawing" width="250" height="150" />
              <div class="cards-body">
                  <h5 class="cards-title">Polkadot Deep Dives</h5>
              </div>
    </a>
  </td>
</tr>

<br />

<tr class="cards-container">
  <td>
    <a class="guide-link" href="https://youtube.com/playlist?list=PLOyWqupZ-WGvJuOchUyo6eFB_RA76mv3h">
      <img src="/img/polkadot-guide/community-calls.png" alt="Drawing" width="250" height="150"/>
        <div class="cards-body">
            <h5 class="cards-title">Polkadot Community Calls</h5>
        </div>
    </a>
  </td>
  <td>
    <a class="guide-link" href="https://youtube.com/playlist?list=PLOyWqupZ-WGtxijJor37g5GmUqVgUvGDt">
      <img src="/img/polkadot-guide/decoded-23.png" alt="Drawing" width="250" height="150"/>
        <div class="cards-body">
            <h5 class="cards-title">Polkadot Decoded 2023</h5>
        </div>
    </a>
  </td>
  <td>
    <a class="guide-link" href="https://youtube.com/playlist?list=PLOyWqupZ-WGthz-1qCz9RozF9N2ywyb4V">
      <img src="/img/polkadot-guide/PBA-23.png" alt="Drawing" width="250" height="150"/>
        <div class="cards-body">
            <h5 class="cards-title">Polkadot Blockchain Academy</h5>
        </div>
    </a>
  </td>
</tr>

## Past Events

<tr class="cards-container">
  <td>
    <a class="guide-link" href="https://youtube.com/playlist?list=PLOyWqupZ-WGsnACsCmWH7PO-0paz9zlQ8">
      <img class="guide-image" src="/img/polkadot-guide/beginners.png" alt="Drawing" width="250" height="150" />
              <div class="cards-body">
                  <h5 class="cards-title">Polkadot for Beginners</h5>
              </div>
    </a>
  </td>
  <td>
    <a class="guide-link" href="https://youtube.com/playlist?list=PLOyWqupZ-WGsbca2vOnkS3l6j53G6ZS_E">
      <img src="/img/polkadot-guide/eth-denver-23.png" alt="Drawing" width="250" height="150"/>
        <div class="cards-body">
            <h5 class="cards-title">ETH Denver 2023</h5>
        </div>
    </a>
  </td>
  <td>
    <a class="guide-link" href="https://youtube.com/playlist?list=PLOyWqupZ-WGvgdDcF-dW4RVEoeFZiZmQc">
      <img class="guide-image" src="/img/polkadot-guide/encode-club.png" alt="Drawing" width="250" height="150" />
              <div class="cards-body">
                  <h5 class="cards-title">Encode Polkadot Club</h5>
              </div>
    </a>
  </td>
</tr>

<br />

<tr class="cards-container">
  <td>
    <a class="guide-link" href="https://youtube.com/playlist?list=PLOyWqupZ-WGvywLqJDsMIYdCn8QEa2ShQ">
      <img src="/img/polkadot-guide/sub0.png" alt="Drawing" width="250" height="150"/>
        <div class="cards-body">
            <h5 class="cards-title">Sub0 2022</h5>
        </div>
    </a>
  </td>
  <td>
    <a class="guide-link" href="https://youtube.com/playlist?list=PLOyWqupZ-WGvcE0HKKnORiFqWNv5onxCf">
      <img src="/img/polkadot-guide/decoded-22.png" alt="Drawing" width="250" height="150"/>
        <div class="cards-body">
            <h5 class="cards-title">Polkadot Decoded 2022</h5>
        </div>
    </a>
  </td>
  <td>
    <a class="guide-link" href="https://youtube.com/playlist?list=PLOyWqupZ-WGuA9BWEP4_zRiLwHzXb1zE9">
      <img class="guide-image" src="/img/polkadot-guide/davos-22.png" alt="Drawing" width="250" height="150" />
              <div class="cards-body">
                  <h5 class="cards-title">Polkadot in Davos 2022</h5>
              </div>
    </a>
  </td>
</tr>

<br />

<tr class="cards-container">
  <td>
    <a class="guide-link" href="https://youtube.com/playlist?list=PLOyWqupZ-WGsLEJq0sRyvUD-pWuVwA5yg">
      <img src="/img/polkadot-guide/webinars.png" alt="Drawing" width="250" height="150"/>
        <div class="cards-body">
            <h5 class="cards-title">Polkadot Webinars</h5>
        </div>
    </a>
  </td>
  <td>
    <a class="guide-link" href="https://youtube.com/playlist?list=PLOyWqupZ-WGsFyiLL4AOn24obxfZzXTFO">
      <img src="/img/polkadot-guide/polkadot-NA.png" alt="Drawing" width="250" height="150"/>
        <div class="cards-body">
            <h5 class="cards-title">Hackathon North America</h5>
        </div>
    </a>
  </td>
  <td>
    <a class="guide-link" href="https://youtube.com/playlist?list=PLOyWqupZ-WGve3__mfw7wX4tY1pWj8ExG">
      <img class="guide-image" src="/img/polkadot-guide/global-series.png" alt="Drawing" width="250" height="150" />
              <div class="cards-body">
                  <h5 class="cards-title">Hackathon Global Series</h5>
              </div>
    </a>
  </td>
</tr>



---
id: learn-wasm
title: WebAssembly (Wasm)
sidebar_label: WebAssembly (Wasm)
description: WASM and its Role in Polkadot's Runtime.
keywords: [webassembly, wasm, runtime]
slug: ../learn-wasm
---

WebAssembly is used in Polkadot and Substrate as the compilation target for the runtime.

## What is WebAssembly?

WebAssembly, shortened to _Wasm_, is a binary instruction format for a stack-based virtual machine.
Wasm is designed as a portable target for the compilation of high-level languages like C/C++/Rust,
enabling deployment on the web for client and server applications.

## Why WebAssembly?

WebAssembly is a platform-agnostic binary format, meaning it will run the exact instructions across
whatever machine it operates on. Blockchains need determinacy to have reliable state transition
updates across all nodes in the peer-to-peer network without forcing every peer to run the same
hardware. Wasm is an excellent fit for reliability among the diverse set of machines. Wasm is both
efficient and fast. The efficiency means that it can be uploaded onto the chain as a blob of code
without causing too much state bloat while keeping its ability to execute at near-native speeds.

## Resources

- [WebAssembly.org](https://webassembly.org/) - WebAssembly homepage that contains a link to the
  spec.
- [Wasmi](https://github.com/paritytech/Wasmi) - WebAssembly interpreter written in Rust.
- [Parity Wasm](https://github.com/paritytech/parity-Wasm) - WebAssembly
  serialization/deserialization in Rust.
- [Wasm utils](https://github.com/paritytech/Wasm-utils) - Collection of Wasm utilities used in
  Parity and Wasm contract development.



---
id: learn-xcm-instructions
title: XCM Instructions & Register Specification
sidebar_label: XCM Instructions
description: Specification for Instructions and Registers for the XCM Format.
keywords: [cross-consensus, XCM, XCMP, interoperability, communication]
slug: ../learn-xcm-instructions
---

import Tabs from "@theme/Tabs";

:::info XCM Documentation

For a more practical approach to utilizing XCM, refer to the [XCM Docs](./learn/xcm). Please keep in
mind that XCM is under active development.

:::

This page can also be viewed at the [`xcm-format`](https://github.com/paritytech/xcm-format)
repository, where each instruction and register is explained in-depth.

## XCVM Registers

- _Programme_
- _Programme Counter_
- _Error_
- _Error Handler_
- _Appendix_
- _Origin_
- _Holding_
- _Surplus Weight_
- _Refunded Weight_
- _Transact Status_
- _Topic_
- _Transact Status Register_
- _Topic Register_

## XCVM Instruction Set

- `WithdrawAsset`
- `ReserveAssetDeposited`
- `ReceiveTeleportedAsset`
- `QueryResponse`
- `TransferAsset`
- `TransferReserveAsset`
- `Transact`
- `HrmpNewChannelOpenRequest`
- `HrmpChannelAccepted`
- `HrmpChannelClosing`
- `ClearOrigin`
- `DescendOrigin`
- `ReportError`
- `DepositAsset`
- `DepositReserveAsset`
- `ExchangeAsset`
- `InitiateReserveWithdraw`
- `InitiateTeleport`
- `QueryHolding`
- `BuyExecution`
- `RefundSurplus`
- `SetErrorHandler`
- `SetAppendix`
- `ClearError`
- `ClaimAsset`
- `Trap`
- `SubscribeVersion`
- `UnsubscribeVersion`
- `BurnAsset`
- `ExpectAsset`
- `ExpectError`
- `ExpectOrigin`
- `QueryPallet`
- `ExpectPallet`
- `ReportTransactStatus`
- `ClearTransactStatus`
- `LockAsset`
- `UnlockAsset`
- `NoteUnlockable`
- `RequestUnlock`

## Instructions Application Example

The following presents the practical mapping of instructions to some
[core functionality in XCM](./learn-xcm.md/#core-functionality-of-xcm).

<Tabs groupId="operating-systems" values={[ {label: 'Programmability', value: 'program'}, {label:
'Functional Multichain Decomposition', value: 'fmd'} ]}>

<TabItem value="program"> These are the primary instructions that enable programmability and
branching to be possible. Branching in this context is the ability for errors and logic to be
handled as needed when dealing with a message.

- [`ExpectAsset(MultiAssets)`](https://github.com/paritytech/xcm-format/tree/master#expectassetmultiassets) -
  Checks if the Holding register has a specific amount of assets, throws an error if it doesn't.
- [`ExpectError(Option<(u32, Error)>)`](https://github.com/paritytech/xcm-format/tree/master#expecterroroptionu32-error) -
  Ensures the Error register contains the given error, and throws an error if it doesn't.
- [`ExpectOrigin(MultiLocation)`](https://github.com/paritytech/xcm-format/tree/master#expectoriginmultilocation) -
  Ensures the Origin register contains the expected origin, and throws an error if it doesn't.
- `QueryPallet` - Queries the existence of a particular pallet type.

- `ExpectPallet` - Ensure that a particular pallet with a particular version exists.

- `ReportTransactStatus(QueryResponseInfo)` - Send a `QueryResponse` message containing the value of
  the Transact Status Register to some destination.

- `ClearTransactStatus` - Set the Transact Status Register to its default, cleared, value.

</TabItem>

<TabItem value="fmd">

These instructions highlight the key instructions focused on Functional Multichain Decomposition.

- `LockAsset(MultiAsset, MultiLocation)` - Lock the locally held asset and prevent further transfer
  or withdrawal.

- `UnlockAsset(MultiAsset, MultiLocation)` - Remove the lock over `asset` on this chain and (if
  nothing else is preventing it) allow the asset to be transferred.

- `NoteUnlockable(MultiAsset, MultiLocation)` - Asset (`asset`) has been locked on the `origin`
  system and may not be transferred. It may only be unlocked with the receipt of the `UnlockAsset`
  instruction from this chain.

- `RequestUnlock(MultiAsset, MultiLocation)` - Send an `UnlockAsset` instruction to the `locker` for
  the given `asset`.

</TabItem>
</Tabs>



---
id: learn-xcm-pallet
title: XCM FRAME Pallet Overview
sidebar_label: XCM Pallet
description: Mechanics of the XCM Pallet and its role in Polkadot's Ecosystem.
keywords: [cross-consensus, XCM, XCMP, interoperability, communication]
slug: ../learn-xcm-pallet
---

:::info XCM Documentation

For a more practical approach to utilizing XCM, refer to the [XCM Docs](./learn/xcm). Please keep in
mind that XCM is under active development.

:::

The XCM pallet
([`pallet-xcm`](https://github.com/paritytech/polkadot-sdk/blob/master/polkadot/xcm/pallet-xcm/src/lib.rs))
provides a set of pre-defined, commonly used XCVM programs in the form of a set of extrinsics using
[FRAME](https://docs.substrate.io/reference/frame-pallets/).

This pallet provides some default implementations for traits required by `XcmConfig`. The XCM
executor is also included as an associated type within the pallet's configuration.

Where the XCM format defines a set of instructions used to construct XCVM programs, `pallet-xcm`
defines a set of extrinsics that can be utilized to build XCVM programs, either to target the local
or external chains. `pallet-xcm`'s functionality is separated into three categories:

:::note

Remember, all XCMs are XCVM programs that follow
[the XCM format](https://github.com/paritytech/xcm-format). It is the job of the XCM executor is to
handle and execute these programs.

:::

1. Primitive, dispatchable functions to locally execute an XCM.
2. High-level, dispatchable functions for asset transfers.
3. Version negotiation-specific dispatchable functions.

## Primitive Extrinsics

There are two primary primitive extrinsics. These extrinsics handle sending and executing XCVM
programs as dispatchable functions within the pallet.

1. [`execute`](https://github.com/paritytech/polkadot-sdk/blob/a808a3a0918ffbce314dbe00e03761e7a8f8ce79/polkadot/xcm/pallet-xcm/src/lib.rs#L902) -
   This call contains direct access to the XCM executor. It is the job of the executor to check the
   message and ensure that no barrier/filter will block the execution of the XCM. Once it is deemed
   valid, the message will then be _locally_ executed, therein returning the outcome as an event.
   This operation is executed on behalf of whichever account has signed the extrinsic. It's possible
   for only a partial execution to occur.
2. [`send`](https://github.com/paritytech/polkadot-sdk/blob/a808a3a0918ffbce314dbe00e03761e7a8f8ce79/polkadot/xcm/pallet-xcm/src/lib.rs#L769) -
   This call specifies where a message should be sent
   ([via a transport method](./learn-xcm-transport.md)) externally to a particular destination, i.e.
   a parachain, smart contract, or any system which is governed by consensus. In contrast to
   `execute`, the executor is not called locally, as the execution will occur on the destination
   chain.

:::info

The XCM pallet needs the `XcmRouter` to send XCMs. It is used to dictate where XCMs are allowed to
be sent, and which XCM transport protocol to use. For example, Kusama, the canary network, uses the
`ChildParachainRouter` which only allows for Downward Message Passing from the relay to parachains
to occur.

You can read more about [XCM transport protocols here](./learn-xcm-transport.md).

:::

## Asset Transfer Extrinsics

Several extrinsics within the pallet handle asset transfer logic. They define a predetermined set of
instructions for sending and executing XCMs. Two variants of these functions are prefixed with
`limited_`. They have the same functionality but can specify a weight to pay for the XCM fee.

Otherwise, the fee is taken as needed from the asset being transferred.

1. [`reserve_transfer_assets`](https://github.com/paritytech/polkadot-sdk/blob/a808a3a0918ffbce314dbe00e03761e7a8f8ce79/polkadot/xcm/pallet-xcm/src/lib.rs#L872) -
   Transfer some assets from the local chain to the sovereign account of a destination chain and
   forward an XCM containing a
   [`ReserveAssetDeposited`](https://github.com/paritytech/xcm-format#reserveassetdeposited)
   instruction, which serves as a notification.

2. [`teleport_assets`](https://github.com/paritytech/polkadot-sdk/blob/a808a3a0918ffbce314dbe00e03761e7a8f8ce79/polkadot/xcm/pallet-xcm/src/lib.rs#L827) -
   Teleport some assets from the local chain to some destination chain.

### Transfer Reserve vs. Teleport

While both extrinsics deal with transferring assets, they exhibit fundamentally different behavior.

- **Teleporting** an asset implies a two-step process: the assets are taken out of circulating
  supply (typically by burning/destroying) in the origin chain and re-minted to whatever account is
  specified at the destination. Teleporting should only occur if there is an inherent and bilateral
  trust between the two chains, as the tokens destroyed at the origin _could not_ necessarily be
  guaranteed to have the same properties when minted at the destination. There has to be **trust**
  that the a particular chain burned, or re-minted the assets.
- **Transferring** or **reserving** an asset implies that **equivalent** assets (i.e, native
  currency, like `DOT` or `KSM`) are withdrawn from _sovereign account_ of the origin chain and
  deposited into the sovereign account on the destination chain. Unlike teleporting an asset, it is
  not destroyed and re-minted, rather a trusted, third entity is used (i.e., Asset Hub) to
  **reserve** the assets, wherein the sovereign account of the destination chain on the reserve
  chain obtains ownership of these assets.

  It's worth noting that this means that some other mechanism is needed to ensure that the balance
  on the destination does not exceed the amount being held in reserve chain.

:::info

A sovereign account refers to an account within a particular consensus system. Even though accounts
may be different in terms of factors such as an address format, XCM agnostic nature enables
communication between these sovereign accounts that are in other consensus systems.

:::

## Version Negotiation Extrinsics

The following extrinsics require root, as they are only used when bypassing XCM version negotiation.
They change any relevant storage aspects that enforce anything to do with XCM version negotiations.

1. [`force_xcm_version`](https://github.com/paritytech/polkadot-sdk/blob/a808a3a0918ffbce314dbe00e03761e7a8f8ce79/polkadot/xcm/pallet-xcm/src/lib.rs#L934) -
   Modifies the `SupportedVersion` storage to change a particular destination's stated XCM version.
2. [`force_default_xcm_version`](https://github.com/paritytech/polkadot-sdk/blob/a808a3a0918ffbce314dbe00e03761e7a8f8ce79/polkadot/xcm/pallet-xcm/src/lib.rs#L957) -
   Modifies the `SafeXcmVersion` storage, which stores the default XCM version to use when the
   destination's version is unknown.
3. [`force_subscribe_version_notify`](https://github.com/paritytech/polkadot-sdk/blob/a808a3a0918ffbce314dbe00e03761e7a8f8ce79/polkadot/xcm/pallet-xcm/src/lib.rs#L972) -
   Sends an XCM with a
   [`SubscribeVersion`](https://github.com/paritytech/xcm-format#subscribeversion) instruction to a
   destination.
4. [`force_unsubscribe_version_notify`](https://github.com/paritytech/polkadot-sdk/blob/a808a3a0918ffbce314dbe00e03761e7a8f8ce79/polkadot/xcm/pallet-xcm/src/lib.rs#L996) -
   Sends an XCM with a
   [`UnsubscribeVersion`](https://github.com/paritytech/xcm-format#unsubscribeversion) instruction
   to a destination.

## Fees in the XCM Pallet

Message fees are only paid if the interior location does not equal the interpreting consensus system
(known as Here in the context of an XCM `Multilocation`). Otherwise, the chain bears the fees. If
applicable, fees are withdrawn from the assets from the specified `MultiLocation` and used as
payment to execute any subsequent instructions within the XCM.

Fees are generally dependent on several factors within the `XcmConfig`. For example, the barrier may
negate any fees to be paid at all.

Before any XCM is sent, and if the destination chain’s barrier requires it, a
[`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution) instruction is used to buy
the necessary weight for the XCM. XCM fee calculation is handled by the Trader, which iteratively
calculates the total fee based on the number of instructions.

The Trader used to calculate the weight (time for computation in consensus) to include in the
message. Fee calculation in XCM is highly configurable and, for this reason, subjective to whichever
configuration is in place.



---
id: learn-xcm-transport
title: XCM Transport Methods (XCMP, HRMP, VMP)
sidebar_label: XCM Transport
description: Methods to send XCM Messages across Networks.
keywords: [cross-consensus, XCM, XCMP, interoperability, communication]
slug: ../learn-xcm-transport
---

:::info XCM Documentation

For a more practical approach to utilizing XCM, refer to the [XCM Docs](./learn/xcm). Please keep in
mind that XCM is under active development.

:::

With the XCM format established, common patterns for protocols of these messages are needed.
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} implements two message passing
protocols for acting on XCM messages between its constituent parachains.

There are three primary methods for message passing, one of which is under development:

1. XCMP (Cross-Consensus Message Passing)
2. Horizontal Relay-routed Message Passing (HRMP/XCMP-lite)
3. VMP (Vertical Message Passing)

### XCMP (Cross-Chain Message Passing)

:::caution

XCMP is currently under development, and most of the cross-chain messages pass through HRMP channels
for the time being.

:::

XCM is related to XCMP in the same way that REST is related to RESTful.

_Cross-Consensus Message Passing_ secure message passing between parachains. There are two variants:
_Direct_ and _Relayed_.

- With _Direct_, message data goes direct between parachains and is O(1) on the side of the
  Relay-chain and is very scalable.
- With _Relayed_, message data is passed via the Relay-chain, and piggy-backs over VMP. It is much
  less scalable, and parathreads in particular may not receive messages due to excessive queue
  growth.

Cross-chain transactions are resolved using a simple queuing mechanism based around a Merkle tree to
ensure fidelity. It is the task of the Relay Chain validators to move transactions on the output
queue of one parachain into the input queue of the destination parachain. However, only the
associated metadata is stored as a hash in the Relay Chain storage.

The input and output queue are sometimes referred to in the
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} codebase and associated documentation
as `ingress` and `egress` messages, respectively.

:::info

For detailed information about VMP see dedicated section in
[The Polkadot Parachain Host Implementers' Guide](https://paritytech.github.io/polkadot/book/messaging.html#horizontal-message-passing).

:::

### VMP (Vertical Message Passing)

_Vertical Message Passing_ message passing between the Relay-chain itself and a parachain. Message
data in both cases exists on the Relay-chain and are interpreted by the relay chain according to
[XCM](./learn-xcm.md/#cross-consensus-message-format-xcm) standards. This includes:

- #### UMP (Upward Message Passing)

  _Upward Message Passing_ message passing from a parachain to the Relay-chain.

- #### DMP (Downward Message Passing)
  _Downward Message Passing_ message passing from the Relay-chain to a parachain.

:::info

For detailed information about VMP see dedicated section in
[The Polkadot Parachain Host Implementers' Guide](https://paritytech.github.io/polkadot/book/messaging.html#vertical-message-passing).

:::

### HRMP (XCMP-Lite)

While XCMP is still being implemented, a stop-gap protocol (see definition below) known as
**Horizontal Relay-routed Message Passing (HRMP)** exists in its place. HRMP has the same interface
and functionality as XCMP but is much more demanding on resources since it stores all messages in
the Relay Chain storage. When XCMP has been implemented, HRMP is planned to be deprecated and phased
out in favor of it.

![xcm](../assets/cross-consensus/hrmp-ex.png)

:::note

A stop-gap protocol is a temporary substitute for the functionality that is not fully complete.
While XCMP proper is still in development, HRMP is a working replacement.

:::

A tutorial on how to open an HRMP channel on a parachain can be found
[here](../build/build-hrmp-channels.md).

### XCMP (Cross Consensus Message Passing) Design Summary

[![XCMP explained](https://img.youtube.com/vi/tOnzk4AROUY/0.jpg)](https://www.youtube.com/watch?v=tOnzk4AROUY)

:::note

XCMP is not yet implemented. The following illustrates the overall design goals and expectations for
XCMP.

:::

- Cross-chain messages will _not_ be delivered to the Relay Chain.
- Cross-chain messages will be constrained to a maximum size specified in bytes.
- Parachains are allowed to block messages from other parachains, in which case the dispatching
  parachain would be aware of this block.
- Collator nodes are responsible for routing messages between chains.
- Collators produce a list of `egress` messages and will receive the `ingress` messages from other
  parachains.
- On each block, parachains are expected to route messages from some subset of all other parachains.
- When a collator produces a new block to hand off to a validator, it will collect the latest
  ingress queue information and process it.
- Validators will check the proof that the new candidate for the next parachain block includes the
  processing of the expected ingress messages to that parachain.

XCMP queues must be initiated by first opening a channel between two parachains. The channel is
identified by both the sender and recipient parachains, meaning that it's a one-way channel. A pair
of parachains can have at most establish two channels between them, one for sending messages to the
other chain and another for receiving messages. The channel will require a deposit in DOT to be
opened, which will get returned when the channel is closed.

#### The Anatomy of an XCMP Interaction

A smart contract that exists on parachain `A` will route a message to parachain `B` in which another
smart contract is called that makes a transfer of some assets within that chain.

Charlie executes the smart contract on parachain `A`, which initiates a new cross-chain message for
the destination of a smart contract on parachain `B`.

The collator node of parachain `A` will place this new cross-chain message into its outbound
messages queue, along with a `destination` and a `timestamp`.

The collator node of parachain `B` routinely pings all other collator nodes asking for new messages
(filtering by the `destination` field). When the collator of parachain `B` makes its next ping, it
will see this new message on parachain `A` and add it into its own inbound queue for processing into
the next block.

Validators for parachain `A` will also read the outbound queue and know the message. Validators for
parachain `B` will do the same. This is so that they will be able to verify the message transmission
happened.

When the collator of parachain `B` is building the next block in its chain, it will process the new
message in its inbound queue as well as any other messages it may have found/received.

During processing, the message will execute the smart contract on parachain `B` and complete the
asset transfer as intended.

The collator now hands this block to the validator, which itself will verify that this message was
processed. If the message was processed and all other aspects of the block are valid, the validator
will include this block for parachain `B` into the Relay Chain.



---
id: learn-xcm-usecases
title: XCM Use-cases & Examples
sidebar_label: XCM Use-cases
description: Cross-consensus Interactions and the XCM Format.
keywords: [cross-consensus, XCM, XCMP, interoperability, communication]
slug: ../learn-xcm-usecases
---

:::info XCM Documentation

For a more practical approach to utilizing XCM, refer to the [XCM Docs](./learn/xcm). Please keep in
mind that XCM is under active development.

:::

XCM has a multitude of use cases. While the wiki covers some of the key commonplace interactions,
the XCM format can be used to construct many more combinations to suit the use case at hand.

### Example Use-Cases

- Request for specific operations to occur on the recipient system such as governance voting.
- Enables single use-case chains e.g. the [Asset Hub](./learn-guides-assets-create.md) as asset
  parachains
- Optionally include payment of fees on a target network for requested operation.
- Provide methods for various asset transfer models:
  - **Remote Transfers**: control an account on a remote chain, allowing the local chain to have an
    address on the remote chain for receiving funds and to eventually transfer those funds it
    controls into other accounts on that remote chain.
  - **Asset Teleportation**: movement of an asset happens by destroying it on one side and creating
    a clone on the other side.
  - **Reserve Asset Transfer**: there may be two chains that want to nominate a third chain, where
    one includes a native asset that can be used as a reserve for that asset. Then, the derivative
    form of the asset on each of those chains would be fully backed, allowing the derivative asset
    to be exchanged for the underlying asset on the reserve chain backing it.

Let's review two of these example asset transfer use cases: **Asset Teleportation** and **Reserve
Asset Transfer**.

### Asset Teleportation

An asset teleport operation from a single source to a single destination.

![Diagram of the usage flow while teleporting assets](../assets/cross-consensus/xcm-asset-teleportation.png)

1. [InitiateTeleport](https://github.com/paritytech/xcm-format#initiateteleport)

The source gathers the assets to be teleported from the sending account and takes them out of the
circulating supply, taking note of the total amount of assets that was taken out.

2. [ReceiveTeleportedAsset](https://github.com/paritytech/xcm-format#receiveteleportedasset)

The source then creates an XCM instruction called `ReceiveTeleportedAssets` and puts the amount of
assets taken out of circulation and the receiving account as parameters to this instruction. It then
sends this instruction over to the destination, where it gets processed and new assets gets put back
into circulating supply accordingly.

3. [DepositAsset](https://github.com/paritytech/xcm-format#depositasset)

The destination then deposits the assets to the receiving account of the asset.

### Reserve Asset Transfer

When consensus systems do not have a established layer of trust over which they can transfer assets,
they can opt for a trusted 3rd entity to store the assets.

![xcm-reserve-asset-transfer](../assets/cross-consensus/xcm-reserve-asset-transfer.png)

1. [InitiateReserveWithdraw](https://github.com/paritytech/xcm-format#initiatereservewithdraw)

The source gathers the derivative assets to be transferred from the sending account and burns them,
taking note of the amount of derivatives that were burned.

2. [WithdrawAsset](https://github.com/paritytech/xcm-format#withdrawasset)

The source sends a WithdrawAsset instruction to the reserve, instructing the reserve to withdraw
assets equivalent to the amount of derivatives burned from the source's sovereign account.

3. [DepositReserveAsset](https://github.com/paritytech/xcm-format#depositreserveasset)

The reserve deposits the assets withdrawn from the previous step to the destination's sovereign
account, taking note of the amount of assets deposited.

4. [ReserveAssetDeposited](https://github.com/paritytech/xcm-format#reserveassetdeposited)

The reserve creates a ReserveAssetDeposited instruction with the amount of assets deposited to the
destination's sovereign account, and sends this instruction onwards to the destination. The
destination receives the instruction and processes it, minting the derivative assets as a result of
the process.

5. [DepositAsset](https://github.com/paritytech/xcm-format#depositasset)

The destination deposits the derivative assets minted to the receiving account.




---
id: learn-xcm
title: Introduction to Cross-Consensus Message Format (XCM)
sidebar_label: Cross-Consensus Message Format (XCM)
description: XCM, The Messaging Format at the Forefront of Interoperability.
keywords: [cross-consensus, XCM, XCMP, interoperability, communication]
slug: ../learn-xcm
---

:::info XCM Documentation

For a more practical approach to utilizing XCM, refer to the [XCM Docs](./learn/xcm). Please keep in
mind that XCM is under active development.

:::

The Cross-Consensus Message Format, or **XCM**, is a **messaging format** and language used to
communicate between consensus systems.

One of {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}'s main functionalities is
interoperability amongst parachains and any other participating consensus-driven systems. XCM is the
language through which complex, cross-consensus interactions can occur. Two blockchains can "speak"
XCM to seamlessly interact with each other using a standard messaging format.

:::info

We typically discuss XCM in the context of parachains, but please bear this in mind that it expands
to the domain of all consensus systems! Remember, a consensus system here means any system or
protocol that achieves finality to agree on the latest and correct state, whether it's a Polkadot
parachain, an EVM smart contract, or other bridged consensus systems.

:::

XCM is not meant to be only specific to
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}, but rather its primary intention is
to define a **generic** and **common** format amongst different consensus systems to communicate.

It's important to note that XCM does not define how messages are delivered but rather define how
they should look, act, and contain relative instructions to the on-chain actions the message intends
to perform.

[**XCMP**](./learn-xcm-transport.md#xcmp-design), or Cross Chain Message Passing, is the actual
network-layer protocol to deliver XCM-formatted messages to other participating parachains. There
are other ways to define transport layer protocols for delivering XCM messages(see:
[HRMP](./learn-xcm-transport.md#hrmp-xcmp-lite) and
[VMP](./learn-xcm-transport.md#vmp-vertical-message-passing)).

XCM has four high-level core design principles which it stands to follow:

1. **Asynchronous**: XCM messages in no way assume that the sender will be blocking on its
   completion.
2. **Absolute**: XCM messages are guaranteed to be delivered and interpreted accurately, in order
   and in a timely fashion. Once a message is sent, one can be sure it will be processed as it was
   intended to be.
3. **Asymmetric**: XCM messages, by default, do not have results that let the sender know that the
   message was received - they follow the 'fire and forget' paradigm. Any results must be separately
   communicated to the sender with an additional message back to the origin.
4. **Agnostic**: XCM makes no assumptions about the nature of the consensus systems between which
   the messages are being passed. XCM as a message format should be usable in any system that
   derives finality through consensus.

These four crucial design decisions allow for XCM messages to be a reliable yet convenient way to
properly convey the intentions from one consensus system to another without any compatibility
issues.

:::note

XCM is constantly in development - meaning the format is expected to change over time. XCM v3 is the
latest version, and is deployed on {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}.
To view updates on the XCM format, visit the
[xcm-format repository](https://github.com/paritytech/xcm-format) to view any RFCs that have been
submitted that would contribute to the next release.

:::

## A Format, Not a Protocol

What started as an approach to _cross-chain communication_, has evolved into a format for
[**Cross-Consensus Communication**](https://polkadot.network/cross-chain-communication) that is not
only conducted between chains, but also between smart contracts, pallets, bridges, and even sharded
enclaves like [SPREE](learn-spree.md).

XCM cannot actually send messages between systems. It is a format for how message transfer should be
performed, similar to how RESTful services use REST as an architectural style of development, where
HTTP requests contain specific parameters to perform some action.

Similar to UDP, out of the box XCM is a "fire and forget" model, unless there is a separate XCM
message designed to be a response message which can be sent from the recipient to the sender. All
error handling should also be done on the recipient side.

:::info

XCM is not designed in a way where every system supporting the format is expected to be able to
interpret any possible XCM message. Practically speaking, one can imagine that some messages will
not have reasonable interpretations under some systems or will be intentionally unsupported.

:::

Furthermore, it's essential to realize that XCM messages by themselves are _not_ considered
transactions. XCM describes how to change the state of the target network, but the message by itself
doesn't perform the state change.

This partly ties to what is called **asynchronous composability**, which allows XCM messages to
bypass the concept of time-constrained mechanisms, like on-chain scheduling and execution over time
in the correct order in which it was intended.

### XCM Tech Stack

![xcm tech stack](../assets/cross-consensus-tech-stack.png)

XCM can be used to express the meaning of the messages over each of these three communication
channels.

## Core Functionality of XCM

XCM opens the doors to a multi-hop, multi-network communications.

XCM introduces some key features and additions to cross-consensus messaging, including:

1. **Programmability** - the ability to have **expectations** for messages, which allow for more
   comprehensive use cases, safe dispatches for version checking, branching, and NFT/Asset support.

2. **Functional Multichain Decomposition** - the ability to define mechanisms to cross-reference and
   perform actions on other chains on behalf of the origin chain (remote locking), context/id for
   these messages, and asset namespacing.

3. **Bridging** - introduces the concept of a universal location, which allows for a base reference
   for global consensus systems for multi-hop setups. This location is above the parent relay chain
   or other consensus systems like Ethereum or Bitcoin.

A core part of the vision that XCM provides is improving communication between the chains to make
**system parachains** a reality. For example, the Polkadot relay chain handles more than just
parachain management and shared security - it handles user balances/assets, auctions, governance,
and staking. Ideally, the relay chain should be for what it's intended to be - a place for shared
security. System parachains can alleviate these core responsibilities from the relay chain but only
by using a standard format like XCM.

This is where system parachains come in, where each of these core responsibilities can be delegated
to a system parachain respectively.

:::info

XCM bridging, functional multichain decomposition, and programmability upgrades are crucial to
bringing ecosystems together using a common communication abstraction.

:::

For more information on the specific intructions used for these key features, head over to the
[instructions and registers page](./learn-xcm-instructions.md).

#### Cross-Consensus Message Format (XCM Format)

For an updated and complete description of the cross-consensus message format please see the
[xcm-format repository on GitHub](https://github.com/paritytech/xcm-format).

## Resources

- [Shawn Tabrizi: XCM - The Backbone Of A Multichain Future | Polkadot Decoded 2022](https://www.youtube.com/watch?v=cS8GvPGMLS0) -
  High level overview which should answer “What is XCM?

- [XCM: The Cross-Consensus Message Format](https://medium.com/polkadot-network/xcm-the-cross-consensus-message-format-3b77b1373392) -
  Detailed blog post by Dr. Gavin Wood about the XCM Format.

- [XCM Format specification](https://github.com/paritytech/xcm-format) - The best starting point for
  understanding the XCM API at a technical level.

- [Gavin Wood, Polkadot founder: XCM v3 | Polkadot Decoded 2022](https://www.youtube.com/watch?v=K2c6xrCoQOU&t=1196s) -
  High level overview of XCM and specifically the new features available in XCM v3.

- [XCMP Scheme](https://medium.com/web3foundation/polkadots-messaging-scheme-b1ec560908b7) - An
  overall overview of XCMP describing a number of design decisions.

- [Messaging Overview](https://paritytech.github.io/polkadot/book/types/messages.html) - An overview
  of the messaging schemes from the Polkadot Parachain Host Implementor's guide.

- [Sub0 Online: Getting Started with XCM - Your First Cross Chain Messages](https://www.youtube.com/watch?v=5cgq5jOZx9g) -
  Code focused workshop on how XCM v1 works, and the core concepts of XCM.

- [XCM: Cross-Consensus Messaging Audit](https://blog.quarkslab.com/resources/2022-02-27-xcmv2-audit/21-12-908-REP.pdf) -
  Technical audit report by Quarkslab prepared for Parity.

- [XCM pallet code](https://github.com/paritytech/polkadot-sdk/blob/master/polkadot/xcm/pallet-xcm/src/lib.rs) -
  The pallet that contains XCM logic from the Polkadot code repository

- [XCM Config & Pallet-XCM | Polkadot Deep Dives](https://www.youtube.com/watch?v=bFMvWmU1pYI) - A
  technical deep dive into `pallet-xcm` and the XCM configuration.



---
id: learn-xcvm
title: XCM Virtual Machine (XCVM) & XCM Executor
sidebar_label: XCM Virtual Machine (XCVM)
description: Design of the XCM Executor and Mechanics of the XCM Virtual Machine.
keywords: [cross-consensus, XCM, XCMP, interoperability, communication]
slug: ../learn-xcvm
---

:::info XCM Documentation

For a more practical approach to utilizing XCM, refer to the [XCM Docs](./learn/xcm). Please keep in
mind that XCM is under active development.

:::

At the core of XCM lies the Cross-Consensus Virtual Machine (XCVM). A “message” in XCM is an XCVM
program, referred to as an **"XCM"** or **"XCMs"** for multiple messages. The XCVM is a
register-based state machine. The state is tracked in domain-specific registers that hold
information that is used and mutated along the execution of a particular message. Most of the XCM
format comprises these registers and the instructions used to compose XCVM programs.

The XCVM is an ultra-high-level non-Turing-complete computer whose instructions are designed to be
roughly at the same level as transactions in terms of definition. Messages are one or more XCM
instructions executed in order by the XCVM. An XCM is executed until it either runs to the end or
hits an error, at which point it finishes up and halts.

The first implementation of the XCVM is the
[`xcm-executor`](https://github.com/paritytech/polkadot/tree/26b0c4f6273190f4538b24939a56b6a0b51a344c/xcm/xcm-executor).
It follows the XCVM specification provided by Parity. It's engineered to be extendable, providing
maximum customizability when configuring XCM. Because the `xcm-executor` is just an implementation
of XCVM, it's entirely possible to create another implementation if desired.

## XCMs are XCVM Programs

A cross consensus message (XCM) is just a program that runs on the `XCVM`: in other words, one or
more XCM instructions that are executed by an XCVM implementation, such as the `xcm-executor`. To
learn more about the XCVM and the XCM format, see the latest
[blog post on XCM](https://medium.com/polkadot-network/xcm-part-iii-execution-and-error-management-ceb8155dd166)
by Dr. Gavin Wood.

XCM instructions might change a register, the state of the consensus system, or both. Depending on
the program's goal, whether it is to teleport assets from one chain to another or call a smart
contract on another chain, XCMs usually require changes to the registers before any changes to the
consensus system can be made.

## XCM Executor & Configuration

The XCM Executor's implementation centers around a core piece: the XCM configuration. Each instance
of the Executor must have a valid configuration, which specifies a multitude of options on how a
chain may treat incoming messages via
[Barriers](https://github.com/paritytech/polkadot/blob/26b0c4f6273190f4538b24939a56b6a0b51a344c/xcm/xcm-executor/src/config.rs#L52),
calculate weight for a message via the
[Weigher](https://github.com/paritytech/polkadot/blob/26b0c4f6273190f4538b24939a56b6a0b51a344c/xcm/xcm-executor/src/config.rs#L55),
how much weight to purchase via the
[Trader](https://github.com/paritytech/polkadot/blob/26b0c4f6273190f4538b24939a56b6a0b51a344c/xcm/xcm-executor/src/config.rs#L58),
[configure fees](https://github.com/paritytech/polkadot/blob/26b0c4f6273190f4538b24939a56b6a0b51a344c/xcm/xcm-executor/src/config.rs#L89),
how to
[convert origins](https://github.com/paritytech/polkadot/blob/26b0c4f6273190f4538b24939a56b6a0b51a344c/xcm/xcm-executor/src/config.rs#L40),
and more.

## Cross Consensus Message (XCM) Anatomy & Flow

An XCM is made up of a list of instructions that are executed in order. There are four different
kinds of XCM instructions:

1. **Instruction** - Results in a state change in the local consensus system or some state change.
2. **Trusted Indication** - Tells the XCVM, or the Executor, that some action has been done before
   already - meaning, this action is now trusted and can be acted on, i.e., in a teleport scenario.
3. **Information** - Provides additional information about a particular origin, usually the result
   of a query, i.e., a `QueryResponse` instruction.
4. **System Notification** - Typically used in the context of when an HRMP channel is being opened,
   closed, or accepted.

Typically, an XCM takes the following path through the XCVM:

1.  Instructions within an XCM are read one-by-one by the XCVM. An XCM may contain one or more
    instructions.
2.  The instruction is executed. This means that the current values of the _XCVM registers_, the
    _instruction type_, and the _instruction operands_ are all used to execute some operation, which
    might result in some registers changing their value, or in an error being thrown, which would
    halt execution.
3.  Each subsequent instruction within the XCM is read until the end of the message has been
    reached.

### Example Register: The Holding Register

There are many instructions that depend on the _Holding register_. The _Holding register_ is an XCVM
register that provides a place for any assets that are in an intermediary state to be held until
they are taken out of the Holding register. It requires an instruction to place assets within it and
another to withdraw them. The simplest example of this occurring is the `DepositAsset` instruction,
which in its Rust form looks like this:

```rust
enum Instruction {
    DepositAsset {
        assets: MultiAssetFilter,
        beneficiary: MultiLocation,
    },
    /* snip */
}
```

This instruction specifies which assets (asset type and amount), already present in the Holding
register, are going to be taken from it and deposited to the specified beneficiary (recipient). It
is very common for instructions to remove and place assets into the Holding register when
transacting between chains.

### Example: TransferAsset

An example below illustrates how a chain may transfer assets locally, or locally on a remote chain
(as part of another instruction) using an XCM. In this message, the `TransferAsset` instruction is
defined with two parameters: `assets`, which are the assets to be transferred, and the
`beneficiary`, whoever will be the sole beneficiary of these assets. More complex instructions,
especially those which perform actions that target a location other than the interpreting consensus
system may make use of XCVM registers.

```rust
enum Instruction {
    TransferAsset {
        assets: MultiAssets,
        beneficiary: MultiLocation,
    }
    /* snip */
}
```

- A `MultiAsset` is a general identifier for an asset. It may represent both fungible and
  non-fungible assets, and in the case of a fungible asset, it represents some defined amount of the
  asset.

- A `MultiLocation` is a relative identifier, meaning that it can only be used to define the the
  relative path between two locations, and cannot generally be used to refer to a location
  universally.

`TransferAsset` is one of the many instructions that can be contained within an XCM. For more
information, please read [XCM Instructions in the wiki](./learn-xcm-instructions.md).

## Locations in XCM

XCM's generic nature involves specifying a wide array of "locations", or any body that is governed
by consensus (parachains, solochains, smart contracts, accounts, etc). These are relatively abstract
notions that point to _where_ but also _to who_ a particular action may affect. The `MulitLocation`
type is what XCM uses to define these locations.

A `MultiLocation` is a relative identifier that defines a **relative** path into some state-bearing
consensus system.

It is used to define the relative path between two locations, and cannot generally be used to refer
to a location universally. It is very much akin to how a **relative** filesystem path works and is
dependent on the which consensus system the location expression is being evaluated.

![XCM MultiLocation](../assets/cross-consensus/multilocation.png)

`MultiLocation` has two primary fields:

- A series of paths, called `Junctions`, which define an interior portion of state to descend into
  it (sometimes called a "sub-consensus" system, such as a smart contract or pallet). An interior
  location may also be used to refer to a Junction, used in the context of "a parachain is an
  **interior location** of the relay chain", or how a UTXO is interior to Bitcoin's consensus.
- The number of parent junctions at the beginning of a `MultiLocation`'s formation - in other words,
  the number of parent consensus systems above it.

There are a number of various `Junction` variants that may be used to describe a particular
location - whether it's a 32 byte account, a Substrate pallet, or a pluralistic body.

### MultiLocation Scenario Example

In this scenario, assume an XCM is to be sent from our parachain to the Asset Hub
(`Parachain 1000`). This XCM references an account on the Asset Hub. As a general path, the
`MultiLocation` would look like this:

```
../Parachain(1000)/AccountId32(<some_account_id>)
```

Or, as a Rust enum:

```rust
MultiLocation {
  parents: 1,
  interior: X2(Parachain(1000), <some_account_id>.into())
}
```

- In the first field, `parents`, there is a parent of `1`. This is because our parachain has the
  relay chain as a parent - in other words, it will go **up** by one consensus system to the relay
  chain. This is also illustrated by the `../` of the "file path" representation.

- The second field, `interior`, defines where to go after the relay chain. In this case, from the
  relay chain this message will go to the Asset Hub (`Parachain 1000`), then reference the account
  (`some_account_id`) located within.

Keep in mind that this location is specific to this interaction. The identities may need to change
if this location was defined on another consensus system, such as Kusama. On other consensus
systems, such as Ethereum, it won't be able to interpret it.

### UniversalLocation in XCM

A `UniversalLocation` refers to any global consensus system. A global consensus system is an entity
that provides its top-level consensus through some non-derivative consensus algorithm that can exist
without reference to any other singleton data system. Such global consensus systems include Polkadot
(or other relay chains), Bitcoin, or Ethereum. It provides a point of reference for overarching
consensus systems.

The `GlobalConsensus` junction refers to a global consensus system and takes a `NetworkId` that
specifies a particular remote network. A `UniversalLocation` allows overarching consensus systems to
communicate using this junction. Sub-consensus systems (i.e., a parachain on Polkadot) may refer to
other _remote_ sub-consensus systems (i.e., a parachain on Kusama) using a relative path defined via
a `MultiLocation`.

## Simulating XCVM using the xcm-simulator

Within the Polkadot repository exists the
[`xcm-simulator`](https://github.com/paritytech/polkadot/tree/master/xcm/xcm-simulator), which
allows developers to experiment with building, executing, and simulating various XCM use scenarios.
