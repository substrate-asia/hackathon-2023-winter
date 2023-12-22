## Basic Information

Project Name: dShips

Date of Project Establishment (Which year and month): 20/10/2023

## Overall Project Profile

### Project Background/Origin/Problem to be solved

In the current process of receiving shopping packages, a significant challenge is faced with the need to provide personal data to verify the identity of the recipient. This practice raises concerns about the privacy of the individual, as it involves sharing sensitive information on a frequent basis and could expose the user to potential security risks.

The proposed solution is to implement Zero-Knowledge Proofs (zk proofs) as an innovative mechanism to preserve the recipient's privacy during the packet ownership verification process. The zk proofs allow proving the authenticity of the information without revealing the specific details of that information, ensuring that the recipient's identity can be verified without compromising the confidentiality of his or her personal data.

By adopting this solution, the aim is to improve the user experience when receiving packages, eliminating the need to provide sensitive information in each transaction. In addition, the implementation of zk proofs will contribute to strengthen security and protect users' privacy, creating a more reliable and efficient environment in the process of receiving packages in the context of online shopping.

### Project Description

dShips is presented as a solution designed to address the existing problem in the process of receiving packages in online shopping. This innovative add-on for marketplaces aims to provide anonymous package deliveries, eliminating the need to disclose sensitive personal information during ownership verification.

Instead of relying on traditional disclosure of personal data, dShips incorporates Zero-Knowledge Proofs (zk proofs) technology to enable verification of the recipient's authenticity without compromising their privacy. This advanced technology makes it possible to prove that the user is the rightful owner of the package without revealing specific details of his or her identity, thus ensuring a completely anonymous delivery process.

The integration of dShips into marketplaces offers users a more secure and convenient package receiving experience. By using zk proofs, dShips ensures that the recipient's personal information remains confidential, thus mitigating the risks associated with exposing sensitive data.

With dShips, marketplaces can differentiate themselves by offering a delivery service that prioritizes user privacy, creating a trusted and secure environment for online transactions. This addition not only simplifies the process of receiving packages, but also sets a new standard in privacy protection in the online shopping arena.
In addition to addressing privacy concerns in the parcel delivery process, dShips also has a positive impact on employment generation by introducing a novel and secure approach to hiring anonymous delivery drivers.

The dShips system operates by verifying delivery drivers anonymously, allowing individuals interested in working as deliverers to apply and be selected without having to reveal their full identity. The verification of the authenticity of the deliverers is carried out through the deposit of an amount of money equivalent to the value of the package to be transported (this is an idea to be analyzed).

This verification process not only ensures the legitimacy of the delivery person, but also acts as a preventative measure against potential theft or fraud. The repository provides an additional layer of security for both the delivery person and the customer, establishing a foundation of trust in the delivery system.

By providing anonymous employment opportunities, dShips contributes to economic growth while preserving the privacy of those seeking employment opportunities. This innovative approach not only redefines the rules in package delivery, but also creates an ecosystem in which trust and privacy coexist, offering benefits for both the users and the delivery drivers involved in the process.

### Project Demo

[https://www.youtube.com/watch?v=221j6GkPvd4](https://www.youtube.com/watch?v=221j6GkPvd4)
[https://d-s-polkadot.vercel.app/](https://d-s-polkadot.vercel.app/)

### Technical Architecture

The idea is that dShips is designed as a pallet within the Polkadot framework, meaning that it is a modular and interoperable component that can be integrated and used on any parachain within the Polkadot ecosystem. This architectural decision offers a number of key benefits:

**Interoperability:** as a pallet, dShips follows the Polkadot standard for interoperability between parachains. It can communicate and share information efficiently with other chains within the Polkadot network, enabling seamless integration with different services and applications in the ecosystem.

**Reusability across Parachains:** The modular nature of dShips allows it to be reused in different parachains. Each parachain can leverage dShips functionality to enable anonymous packet delivery in its own context, thus contributing to the creation of a standardized set of services for the Polkadot ecosystem.

**Polkadot Security and Consensus:** Being part of the Polkadot network, dShips benefits from the security and consensus provided by the chain of relevance. Network-level validation and consensus provide an additional layer of trust and security to transactions conducted through dShips.

**Flexibility for Developers:** As a pallet, dShips provides developers with the flexibility to customize and tailor the anonymous delivery functionality to the specific requirements of each parachain. Developers can leverage the capabilities of dShips and customize it to meet the particular needs of their applications.

In summary, dShips as a Polkadot pallet integrates seamlessly into the broader Polkadot ecosystem, providing a standardized and secure service for anonymous package delivery that can be leveraged by a variety of parachains. This contributes to the creation of a broader, collaborative ecosystem, where services can be shared and used efficiently between different chains.

### Step by step

1. The idea is to be another tool for a marketplace environment, so when making a purchase, the customer can choose to receive the package anonymously.
   <img width="800" alt="1" src="https://github.com/geraBarboni/dShips/assets/63870012/11035e30-c64a-4239-949d-6448ab4a8874">

2. At the time of purchase, a new "ship" is created within the dShips environment, with the basic data needed by the delivery person.
   <img width="904" alt="2" src="https://github.com/geraBarboni/dShips/assets/63870012/7e946ca6-ee69-425a-8659-8bebaad7c843">

3. This new "ship" is stored in a pool of "ships" where the deliverer by convenience or choice chooses which packages to search for and deliver, assigning them to himself.
   <img width="840" alt="3" src="https://github.com/geraBarboni/dShips/assets/63870012/c009a0b9-b1e8-4502-89ed-e9ded23dffe6">
   <img width="976" alt="carrier zk" src="https://github.com/geraBarboni/dShips/assets/63870012/42bb1b6c-4027-4c2b-bd56-c639c7537c3c">

4. Once you have the package assigned to you, the delivery person must pick it up at the seller's premises/depot, who will deliver the package only if he is the delivery person assigned to the seller. The package is marked as "picked".
   <img width="840" alt="4" src="https://github.com/geraBarboni/dShips/assets/63870012/fdd707ca-a1f9-4435-9a49-f48a3b4972a2">

5. The delivery person goes to the final address, where the buyer generates a proof of ownership in order to receive it. Once the package is delivered, the corresponding shipping amount is released to the delivery person.
   <img width="840" alt="5" src="https://github.com/geraBarboni/dShips/assets/63870012/ab58dcd9-ab59-4206-a659-c47032a86857">
   <img width="976" alt="buyer zk" src="https://github.com/geraBarboni/dShips/assets/63870012/fd52af26-8216-4b4c-8c76-0090c890b098">

### The project logo

![Asset 1](https://github.com/geraBarboni/hackathon-2023-winter/assets/63870012/0820c586-0fac-4875-987c-c757afe31029)

### The start of the project commit

For a brand new project can be a clone of an open source framework, such as blockchain clone from substrate-node-template, react framework, etc., please give a description. For mature projects it can be a BRANCH, which is required to be generated after November 1, 2023, state what features are already available

## Plans

### Things planned to be accomplished during the hackathon

Perform a proof of concept of how the environment would work, through an interface that allows interaction between the three main users: admin/seller, carrier and receiver, by means of a simple smart contract in order to explain the idea.

**Smart Contract**

- [ ] Create a shipment
- [ ] Verify carrier
- [ ] Assign yourself as a carrier
- [ ] Indicate package status
- [ ] Deliver package
- [ ] Generate ZK Proof

**Client**

- [ ] Admin dashboard
- [ ] Carrier dashboard
- [ ] Receiver dashboard

### Things accomplished during the Hackathon (submitted by 11:59am Dec 22, 2023 initial review)

A smart contract was made in solidity deployed in Moonbase Alpha together with a front-end in NextJs.

**Smart Contract**

- [ ] Create a shipment
- [ ] Verify carrier
- [ ] Assign yourself as a carrier
- [ ] Indicate package status
- [ ] Deliver package

**Client**

- [ ] Admin dashboard
- [ ] Carrier dashboard
- [ ] Receiver dashboard

### Things that are planned after the hackathon

| User/Area        | Description                                                                                                                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **General**      | Create a pallet for the correct functioning of the whole system and easy integration with marketplaces.                                                                                                             |
| **Admin/Seller** | Automatically generate shipments on demand.                                                                                                                                                                         |
| **Carrier**      | Optimize or improve the verification of the carrier.                                                                                                                                                                |
|                  | Apply a payment rate for the carrier, generated by the supply-demand of the moment or applied by the receiver (pending analysis) that is released at the moment when the receiver and carrier confirm the delivery. |
|                  | Create a mobile dApp to facilitate the delivery driver's work.                                                                                                                                                      |
| **Receiver**     | Generate true ZK proofs.                                                                                                                                                                                            |

## Team

- Gera Barboni
- Product Designer / Front-End Developer
- [https://github.com/geraBarboni](https://github.com/geraBarboni)
