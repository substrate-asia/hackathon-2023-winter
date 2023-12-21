# Tanssi Customized Substrate Node

## Overview

- [https://apps.tanssi.network/](https://apps.tanssi.network/)

- [https://docs.tanssi.network](https://docs.tanssi.network)

## Development

- Folk [https://github.com/moondance-labs/tanssi](https://github.com/moondance-labs/tanssi) to [https://github.com/ff13dfly/tanssi](https://github.com/ff13dfly/tanssi)

- Add the new pallet called "anchor-pallet" to "container-chains/pallets/anchor".

- Modify the root "Cargo.toml", add "container-chains/pallets/*" under "workspace.members". Then the pallet is added to Tanssi.

- Following the document [https://docs.tanssi.network/builders/build/local/adding-custom-made-module/](https://docs.tanssi.network/builders/build/local/adding-custom-made-module/), copy the sample code to "container-chains/pallets/anchor/src/lib.rs".

- Open the current Anchor [https://github.com/ff13dfly/Anchor](https://github.com/ff13dfly/Anchor) and find the pallet here "frame/anchor", then copy the code part by part to "container-chains/pallets/anchor/src/lib.rs".

- Last step, modify the "Cargo.toml" of anchor-pallet. Copy all the content from [https://github.com/ff13dfly/Anchor/blob/main/frame/anchor/Cargo.toml](https://github.com/ff13dfly/Anchor/blob/main/frame/anchor/Cargo.toml) to [https://github.com/ff13dfly/tanssi/blob/master/container-chains/pallets/anchor/Cargo.toml](https://github.com/ff13dfly/tanssi/blob/master/container-chains/pallets/anchor/Cargo.toml). Then modify the path such as `path = "../pallet-name"` to `{ workspace = true }`.

- Then you can build the appchain successful with `cargo build`.

## Deployment

- Get the JSON file.

```SHELL
    ./tanssi-node build-spec --disable-default-bootnode --chain local > anchor.json
```

## Result

- The JSON file can be deployed on Tanssi is "anchor.v1.0.0.json".