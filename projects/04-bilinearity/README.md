## Basic information

project name: Bilinearity

Project establishment date 11/2023

## Overall introduction to the project
- Project background/original reasons/problems to be solved (If there are other attachments, they can be placed in the `docs` directory. Submit in English).
  - The project aims to enhance the security and transparency of codebase validation by introducing a zero-knowledge proof system for unit test results, based on the existing RISC Zero test tooling. Through this innovation, the project ensures that unit tests pass without revealing any sensitive information, and the proof of the passing tests is recorded securely on a custom blockchain.
  This allows for:
    - Assurance of software behavior; even closed-source projects can prove their code behaves correctly without being revealed.
    - Supply-chain security
    - Solving problems around trusted blockchain code - See this post: https://forum.polkadot.network/t/trustless-wasm-compilation-with-snarks/3825. This may allow blockchain software to be shared more readily among different runtimes.
- Technology Architecture
  ![Substrate solution architecture](./docs/architecture.png)
- Project Layout
  - `substrate-winter-2023-hackathon`: this is the substrate blockchain node which contains the validation logic for the test proofs
  - `example-ci-project`: this is a sample Rust project which utilizes the test proofs in CI, and sends the proofs onchain

## Things planned to be accomplished during the hackathon

**Blockchain side**

- `proof-tests-pallet`
   - [x] Adapt existing code for verifying ZK proofs
   - [ ] Implement requests for work, and rewards

**Prover side**

- `Tests prover`
   - [x] Integrate RISC Zero tool to prove tests pass/fail for project
   - [] Provide generic Gitlab runner for other projects

**Consumer side**

- `Example project`
   - [x] Demonstrate integration of the tool and blockchain in an example Rust project


## Things accomplished during the hackathon (submitted before preliminary review at 11:59 am on December 22, 2023)
   - [x] Adapt existing code for verifying ZK proofs
   - [x] Integrate RISC Zero tool to prove tests pass/fail for project
   - [x] Demonstrate integration of the tool and blockchain in an example Rust project

## Demo Video
See a demonstration of a Github CI action that uses the tool to prove its tests, and submit those proofs to be verified by a live running substrate node:
https://youtu.be/ojrd1BTj8HU

## Team information

Justin Frevert
  - Role: Substrate Developer
  - Github: `justinfrevert`

Vivek Pandya
  - Role: Substrate Developer
  - Github: `vivekvpandya`