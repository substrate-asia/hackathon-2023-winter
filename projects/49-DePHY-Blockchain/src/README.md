DePHY Blockchain
====

## Development

### Build

```sh
cargo build --release
```

### Run

Once the project has been built, the following command can be used to explore all parameters and
subcommands:

```sh
./target/release/dephy-blockchain -h
```

#### Single-Node Development Chain

This command will start the single-node development chain with non-persistent state:

```bash
./target/release/dephy-blockchain --dev
```

#### Connect with Polkadot-JS Apps Front-end

Once the node is running locally, you can connect it with **Polkadot-JS Apps** front-end
to interact with your chain. [Click here](https://polkadot.js.org/apps/#/explorer?rpc=ws://localhost:9944) connecting the Apps to your
local node.

## License

Pallets (`/pallets`), runtimes (`/runtimes`), and the node (`/node`) released under [AGPL v3.0 License](./AGPL3-LICENSE).

All primitives (`*-primitives`) released under [GPL v3.0 with a classpath linking exception](./GPL3-LICENSE).

Third-party vendors (`/vendors`) released under their own licenses.

Docs (`/docs`) released under [Creative Commons](https://creativecommons.org/licenses/by/3.0/).

The prototyping protocol implementation (`/protocol_impl`), the Subsquid project (`/squid`),
and all other utilities licensed under [MIT License](./MIT-LICENSE).
