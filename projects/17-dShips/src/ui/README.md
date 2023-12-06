## Basic Information

Project Name: dShips

Date of Project Establishment (Which year and month): November 2023

## Overall Project Profile

### Inspiration

In some parts of the world to receive a package of a purchase is necessary to give certain data to corroborate that one is the owner of the package, for example, imagine that we buy a 70-inch TV, and to receive it I need to give my full name, my id or dni, plus my home address which is explicit, and a package that is too obvious. Maybe I don't want to give so many details but still corroborate that I am the owner of the package. This is why dShips was created, a system with the idea of delivering local packages without revealing unnecessary information.

### What it does

It serves as a tool for online stores that need to ship their products to buyers who choose to receive packages anonymously, guaranteeing their correct delivery. Generating anonymous jobs.

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

### The start of the project commit

## Things planned to be accomplished during the hackathon

**Smart Contract**
[ ] Create a shipment
[ ] Verify deliverymen
[ ] Assign yourself as a delivery person
[ ] Indicate package status
[ ] Deliver package

**Web Client**
[ ] Admin dashboard
[ ] Carrier dashboard
[ ] Receiver dashboard

## Things accomplished during the Hackathon (submitted by 11:59am Dec 22, 2023 initial review)

- By December 22, 2023, 11:59 AM, list in this column the feature points that were finalized during the hackathon.
- Place the relevant code in the `src` directory and list in this column the development work done during the hackathon and the code structure. We will do a focused technical review of these directories/files.
- Demo videos, ppts and other large files should not be submitted. You can store their link addresses in the readme

## Team Information

Include the name and introduction of the participant
Role in the team
GitHub account
WeChat account (if you have one, please leave it to facilitate timely contact)
