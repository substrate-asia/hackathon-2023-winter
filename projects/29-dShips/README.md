## Basic Information

Project Name: dShips

Date of Project Establishment (Which year and month): 20/10/2023

## Overall Project Profile

### Project Background/Origin/Problem to be solved

In some parts of the world to receive a package of a purchase is necessary to give certain data to corroborate that one is the owner of the package, for example, imagine that we buy a 70-inch TV, and to receive it I need to give my full name, my id or dni, plus my home address which is explicit, and a package that is too obvious. Maybe I don't want to give so many details but still corroborate that I am the owner of the package. This is why dShips was created, a system with the idea of delivering local packages without revealing unnecessary information.

### Project Description

dShips is currently a proof of concept, consisting of three users: Admin, Carrier and Receiver.

- Admin: Currently in charge of creating shipments, assigning address A, address B and the receiver's address.
- Carrier: He assigns himself the package(s) to be delivered and is in charge of looking for them in address A and taking them to B.
- Receiver: Must show a QR with a proof of ownership of the package.

### How is this accomplished?

By generating a ZK Proof that corroborates if the owner of the package is who he claims to be.

### Step by step

1. A purchase is made in a marketplace
   <img width="800" alt="1" src="https://github.com/geraBarboni/dShips/assets/63870012/11035e30-c64a-4239-949d-6448ab4a8874">

2. The product needs to be purchased, so the purchase becomes a package.
   <img width="904" alt="2" src="https://github.com/geraBarboni/dShips/assets/63870012/7e946ca6-ee69-425a-8659-8bebaad7c843">

3. A verified delivery person chooses which parcels to transport
   <img width="840" alt="3" src="https://github.com/geraBarboni/dShips/assets/63870012/c009a0b9-b1e8-4502-89ed-e9ded23dffe6">
   <img width="976" alt="carrier zk" src="https://github.com/geraBarboni/dShips/assets/63870012/42bb1b6c-4027-4c2b-bd56-c639c7537c3c">

4. The delivery person goes to the store and picks up the package to be transported
   <img width="840" alt="4" src="https://github.com/geraBarboni/dShips/assets/63870012/fdd707ca-a1f9-4435-9a49-f48a3b4972a2">

5. The delivery person goes to the buyer's address and verifies that he is the owner of the package to be delivered
   <img width="840" alt="5" src="https://github.com/geraBarboni/dShips/assets/63870012/ab58dcd9-ab59-4206-a659-c47032a86857">
   <img width="976" alt="buyer zk" src="https://github.com/geraBarboni/dShips/assets/63870012/fd52af26-8216-4b4c-8c76-0090c890b098">

### Project Demo

### Technical Architecture

The architecture of the project would be composed by a pallet, for the access to the information and creation of the shipments plus a mobile dApp to facilitate the work of the carrier in the delivery and collection of packages.

Actually as mentioned before, dShips is a proof of concept, conformed by a smart contract in solidity deployed in Moonbase Alpha and a front end developed in NextJs.

### The project logo

![Asset 1](https://github.com/geraBarboni/hackathon-2023-winter/assets/63870012/0820c586-0fac-4875-987c-c757afe31029)

### Demo

[https://www.youtube.com/watch?v=221j6GkPvd4](https://www.youtube.com/watch?v=221j6GkPvd4)

### The start of the project commit

For a brand new project can be a clone of an open source framework, such as blockchain clone from substrate-node-template, react framework, etc., please give a description. For mature projects it can be a BRANCH, which is required to be generated after November 1, 2023, state what features are already available

## Things planned to be accomplished during the hackathon

- Perform a proof of concept through a smart contract to verify the feasibility and approval of the project.
- Understand the users involved and their tasks.

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

## Things accomplished during the Hackathon (submitted by 11:59am Dec 22, 2023 initial review)

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

## Things that are planned after the hackathon

| User/Area        | Description                                                                                                                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **General**      | Create a pallet for the correct functioning of the whole system and easy integration with marketplaces.                                                                                                             |
| **Admin/Seller** | Automatically generate shipments on demand.                                                                                                                                                                         |
| **Carrier**      | Optimize or improve the verification of the carrier.                                                                                                                                                                |
|                  | Apply a payment rate for the carrier, generated by the supply-demand of the moment or applied by the receiver (pending analysis) that is released at the moment when the receiver and carrier confirm the delivery. |
|                  | Create a mobile dApp to facilitate the delivery driver's work.                                                                                                                                                      |
| **Receiver**     | Generate true ZK proofs.                                                                                                                                                                                            |

- Gera Barboni
- Product Designer / Front-End Developer / Smart contract Developer
- [https://github.com/geraBarboni](https://github.com/geraBarboni)
