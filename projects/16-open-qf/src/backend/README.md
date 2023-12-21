## Backend

Scan packages include:

- [Account scan](./packages/account-scan). It scans blocks data and extract address first debut data.
- [Role scan](./packages/role-scan). It scans blocks data and extract history councilor and validator data.
- [Governance scan](./packages/governance-scan). It scans blocks data and extract active OpenGov voter data.
- [Treasury scan](./packages/treasury-scan). It scans blocks data and extract treasury related data.
- [Contributor scan](./packages/contributor-scan). It scans blocks and extract community donation info to projects.

[Qf server](./packages/qf-server) has the following components:

- A restful server
    - to serve quadratic funding business related data.
    - to accept new project application data(disabled in demo environment).
    - to support github account link to polkadot address.
- API instances are maintained to support on-chain data query.
- Scripts to populate mock data.
- Scripts to calculate contributors' matching power.
- Scripts to calculate final matched fund from public pool.
