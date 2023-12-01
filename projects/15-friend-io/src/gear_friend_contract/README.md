[![Open in Gitpod](https://img.shields.io/badge/Open_in-Gitpod-white?logo=gitpod)](https://gitpod.io/#FOLDER=gear_friend_contract/https://github.com/gear-foundation/dapps)
[![Docs](https://img.shields.io/github/actions/workflow/status/gear-foundation/dapps/contracts.yml?logo=rust&label=docs)](https://dapps.gear.rs/auto_changed_nft_io)

# [Auto-changed NFT](https://wiki.gear-tech.io/docs/examples/NFTs/dynamic-nft#examples)

An example of Auto-Changed NFT (modified [Dynamic NFT](../dynamic-nft)).

### 🏗️ Building

```sh
cargo b -p "gear_friend_contract*"
```

### ✅ Testing

Run all tests, except `gclient` ones:
```sh
cargo t -p "gear_friend_contract*" -- --skip gclient
```

Run all tests:
```sh
# Download the node binary.
cargo xtask node
cargo t -p "gear_friend_contract*"
```

program_id:0x54d349a638e300dd798a6c8465de4ec0bbef8103b8b45d46253e75ca0febfca7