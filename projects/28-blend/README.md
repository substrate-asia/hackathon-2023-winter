<div align="center">
    <img src="https://github.com/parity-asia/hackathon-2023-winter/assets/69501009/ac5ea9e3-59af-4a6d-9753-8499df93d594" width=100>
    <h1>Blend</h1>
    <strong>Multiplatform Ink!-Based Ultra Realistic Digital Identity Creation Engine for Polkadot and Substrate</strong>
    <br><br>
    <strong>A project started on 3/11/2023</strong>
</div>

<br>
<hr>

> Hey👋 Before reading the detail documentation of our work, watch a demo video about Blend! [Click here to watch~](https://youtu.be/eXH7SNKzU94)
### Understanding Blend: Solving Digital Identity Challenges in Polkadot and Substrate

![image](https://github.com/parity-asia/hackathon-2023-winter/assets/69501009/abe3f320-501d-4823-ab0a-69547bf71270)

Blend represents a Multiplatform Ink!-Based Ultra Realistic Digital Identity Creation Engine tailored for the Polkadot and Substrate ecosystem. Its core objective lies in reconstructing highly detailed digital replicas of users based solely on a single-view selfie image. This feat is achieved through advanced on-cloud deep learning 3D face reconstruction technology. The primary aim? To streamline the onboarding of Web3 users into diverse metaverse or virtual world applications by generating hyper-realistic identities.

The brainchild of our team is the Blend NFT PASSPORT concept. It encapsulates all 3D-related files necessary for rendering a user's digital replica into a non-fungible token (NFT), leveraging IPFS decentralized storage and powered by an Ink!-based smart contract. This NFT can traverse various applications, requiring users merely to connect their wallet. Applications built using Blend seamlessly fetch the requisite files from the NFT metadata, rendering the user's digital self in real-time within the application interface, facilitating immediate interaction within the virtual world. Blend pioneers the interoperable use of NFTs within the Polkadot and Substrate-based ecosystem.

#### Addressing the Current Challenges:

1. Traditional methods for generating ultra-realistic user replicas necessitate professional equipment and prolonged scanning periods, limiting scalability. For instance, the Kodec Avatar by Meta Research Lab typifies this approach. While our reconstruction technology may not match the quality of tech giants, Blend focuses on delivering a concept enabling fast, user-friendly, and mobile digital replica reconstruction. This solution resolves scalability challenges.

2. The booming trend of metaverse and blockchain games lacks realistic avatars, relying on cartoonish characters that diminish immersive experiences. Blend seeks to fill this gap by providing a solution to introduce realistic avatars, fostering the development of such applications.

3. Interoperability is pivotal for a solution allowing users to generate and utilize their digital replicas in Web3.0 applications within the Polkadot or Substrate-based ecosystem. Thus, we integrate NFT technology with Ink!, a programming language for smart contracts, offering compatibility within blockchains built using the Substrate framework. This language extension of Rust simplifies smart contract development.

4. Blend's design as a multiplatform engine supports Web3 development across web and mobile applications in the Polkadot and Substrate ecosystem. Its versatile architecture caters to different devices, unlocking boundless possibilities for implementing ultra-realistic digital replicas.

5. Deep learning model interaction for 3D reconstruction is intricate and developer-intensive. Blend streamlines this complexity by providing dedicated APIs to manage processing tasks, allowing developers to concentrate on Web3 and blockchain-related development tasks.

<hr>

### Brief overview of how Blend Engine works

![Frame 24](https://github.com/parity-asia/hackathon-2023-winter/assets/69501009/1c373a94-d4ad-4a0c-936b-7d6c8081d76c)

Here's a high-level description to help you understand what Blend is attempting to accomplish in order to provide an immersive experience for your Web3.0 users. The entire pipeline begins with the gamers uploading a single selfie image, which Blend will use to reconstruct an ultra-realistic 3D reproduction with high-detail textures by forwarding the uploaded image to our computation resources via propoer encoding and API. Following the conclusion of the reconstruction, all output files (including 3D face mesh object files, MATLAB texture mapping files, and so on) will be processed by the S3 object storage solution and stored in the IPFS decentralized storage. Now, users can mint their NFT PASSPORT (which contains all of the links to 3D-related files), with the minting process triggering an Ink! written smart contract. The NFT PASSPORT of the user can be minted on any WASM compatible (Ink! supported, such as Astar) blockchain. With the NFT PASSPORT properly created, users can begin their journey in any Polkadot or Substrate-based ecosystem that uses the Blend engine by just connecting their wallet. The application will locate the 3D-related files associated with the NFT and utilize them to render the 3D replica in the virtual environment. This is the entire process of how the user interacts with the Blend engine and how developers can build their product based on this flow.

## Blend Three-Stages AI Pipeline


### Stage 1: Image Pre-processing Phase

![image](https://github.com/parity-asia/hackathon-2023-winter/assets/69501009/c585e0df-1677-4aa5-81ee-b97881f2c320)

The first stage is the image preprocessing phase. Instead of performing multi-image 3D face reconstruction by exploiting complementary information from different images for shape aggregation, our team designed the pipeline to utilize just a single image of the user. We know that turning a single 2D image into a 3D object is challenging due to the loss of information from different perspectives. Hence, we solve this by first feeding the selfie image into a dynamic pipeline to enhance quality, remove unnecessary illumination, and color corrections. Then, the processed selfie image will be passed into a monocular depth estimation model to generate a depth map. This map indicates the depth of each portion of the user's face from a single camera viewpoint, providing us with depth data in 3D space. This step is crucial as not all the camera devices on phones or laptops out there have a true depth or ToF sensor. Through this phase, we are still able to perform 3D reconstruction regardless of the user device. This is an important point to focus on as users' capturing devices should not be the obstacle for them to onboard into the metaverse on the Polkadot or any Substrate-based ecosystem.

### Stage 2: 3D Face Reconstruction

![image](https://github.com/parity-asia/hackathon-2023-winter/assets/69501009/0d6cf2ca-3c63-4039-b844-392f96942da2)

The second stage is the 3D face reconstruction pipeline. The depth data obtained from the first stage will be passed into the pipeline together with the selfie image. Blend implements a differentiable renderer, leveraging a 3D Morphable Model fitting algorithm. This algorithm leverages the depth data to recover facial geometries which takes advantage of a powerful 3DMM basis constructed with extensive data generation and perturbation. Our 3DMM boasts significantly enhanced expressive capabilities compared to conventional models, enabling us to attain more precise facial geometry utilizing only linear basis functions. For the synthesis of reflectance properties, we employ a hybrid strategy that combines parametric fitting and deep CNN. This combined approach enables the production of high-resolution albedo and normal maps with intricate, realistic details such as hair, pores, and wrinkles.

Here are more samples we generated using Blend's pipeline:

![image](https://github.com/parity-asia/hackathon-2023-winter/assets/69501009/6dc69d4c-0fc7-426c-a135-8ba50b075bf1)

### Stage 3: Post Skeletal Mesh Fusion

![image](https://github.com/parity-asia/hackathon-2023-winter/assets/69501009/c2b048d4-25a7-4e61-931f-bc27c5577969)

The final stage involves post-skeletal mesh fusion. Here, developers can utilize their automated mesh fusion pipeline to seamlessly merge the reconstructed face mesh with a mannequin game character's skeleton in real-time, resulting in a complete virtual character ready for interaction within the virtual world. In this hackathon, our team process this phase manually using Unreal Engine 5. Once everything is done, we will now have a complete digital replica generated based on the user-uploaded selfie and is ready to interact inside the metaverse.

#### Blend High-Level Architecture Overview

![Frame 2 (3)](https://github.com/parity-asia/hackathon-2023-winter/assets/69501009/f9edc8a4-a819-4da7-853c-7afd6a0b081c)

Above diagram illustrating Blend on-cloud computation architecture and how an application which is built on top of an Ink! compatible blockchain able to facilitate the NFT PASSPORT minting process (combined with the interaction between the IPFS decentralised storage). Blend, being a real-time engine, hosts its deep learning model on AWS GPU instances for powerful computation. To simplify interaction with these complex models, our team developed an architecture comprising the model, AWS S3 object storage, and dedicated Lambda APIs. Developers can easily utilize these APIs to manage input images and 3D-related output files, while able to focus on the Web3.0 or blockchain-related development task. Hence, it is built in a way in which the entire 3D face reconstruction deep learning pipeline can be easily hosted on an AWS virtual machine and also connect with an Unreal Engine-developed 3D environment via pixel streaming technique.

## Blend's Ink!-based NFT Passport & Demo Application

Our team introduced a concept on Blend, which is called NFT Passport. It is a NFT token (which is minted using a Ink!-based smart contract) and has the connection to all your metaverse human-related 3D files. In other words, this NFT passport is your identity card in the metaverse or virtual world in the Polkadot and Substrate-based network, which is used to render and visualize your ultra-realisitc 3D replica. This idea is a paradigm shift in how you onboard Web 3.0 users to your virtual world concept application. Instead of storing all the related files of each user on your cloud server, retrieve them once needed. Now, the user just has to connect their wallet containing their NFT passport and we can retrieve the files that are bound with the token from the IPFS decentralized storage.

We've built a demo web application to demonstrate how Blend can onboard Web3 users into the metaverse or virtual world within the Polkadot and Substrate ecosystem by generating a 3D digital replica minted as Blend's NFT Passport. In this demonstration, we'll be leveraging the Astar blockchain, which supports the ink! smart contract language. Begin by connecting your SubWallet and uploading your selfie with the correct ratio. As the face reconstruction process demands substantial computational resources, you have the option to set charges for your users based on the epoch or quality you've preset. Assign a name to your PASSPORT, as this will be the name for your NFT. Subsequently, await the generation of your Metaverse human 3D files. Once these files are ready, their retrieval URL from the storage bucket will be stored on IPFS. Finally, proceed to mint your Blend NFT passport. Below are the complete screenshots of the demo application which our team had developed, we had test mint a NFT PASSPORT on Shibuya Testnet:

![Frame 15](https://github.com/parity-asia/hackathon-2023-winter/assets/69501009/d6836a61-0ccd-4cf9-bfba-72aab1039017)

> Hey👋 [Click here](https://blend-sooty.vercel.app/) to redirect to our demo web application. Note: as the demo web application required our AWS instance to run, please contact our team to run the instance for you before testing~ (Cost of running GPU instance is high, that's why our team will stop the instance when not used)

```
Smart Contract deployed on Shibuya Testnet: XxFZhk32yigWi8j4ZLEVBPzEEaGsEbrnggpd2LJWehAzPBs
You can use the contract address to add the NFT collection in your wallet!
```

Our team developed two different games, utilizing only one NFT passport to transition between them. This single NFT passport is linked to all the associated 3D files stored on IPFS. Utilizing this passport, the blockchain game created with Blend can access all the relevant 3D files of a gamer's metaverse human. Essentially, Blend's NFT passport introduces the concept of interoperability to the Polkadot and Substrate ecosystem. Users need only create their NFT passport once to embark on adventures across various applications built using Blend. Interoperability plays a crucial role in enhancing users' overall metaverse experience, and Blend effectively facilitates this. Additionally, our streamlined digital replica reconstruction also enables the possibility of open-world applications, like the demo we have constructed below

You can download the demo game execution files for Unreal Engine (Version 5.2) here:

#### [Demo Game 1](https://numcmy-my.sharepoint.com/:f:/g/personal/hfyst6_nottingham_edu_my/EovtdBSxyZ1EurPeIcMT2yoBXBAPnwtEnFE4bAjBL3j38Q?e=hqPWLM) ⬇️

![image](https://github.com/parity-asia/hackathon-2023-winter/assets/69501009/744c5b4b-cc05-40d2-bd0d-79857b748413)

#### [Demo Game 2](https://numcmy-my.sharepoint.com/:f:/g/personal/hfyst6_nottingham_edu_my/EmA8SActjthHoZzzq8uu0jUB__YC_8Wdw7RVY2e5oRdmvg?e=0xnwWm) ⬇️

![image](https://github.com/parity-asia/hackathon-2023-winter/assets/69501009/7ba96673-6e78-4ec3-973b-0c5282cf5ebc)

#### Open World environment our team created to demonstrate the lightweight reconstruction of the 3D digital replica:

> You can download the UE5 project folder of this openworld [here](https://numcmy-my.sharepoint.com/:f:/g/personal/hfyst6_nottingham_edu_my/EjVP2zCX9AxAoZGaIkyFMC0BzL4zRq6D2X4plldeUP44BQ?e=8CCKuX)

![Group 19](https://github.com/parity-asia/hackathon-2023-winter/assets/69501009/e675778a-d69b-461b-b798-ebbaabf409e8)

## Multiplatform Ability: Blend Mobile Toolkit

Moreover, in this hackathon, we've expanded Blend's capabilities by introducing a Blend mobile toolkit, enabling developers to create digital replicas using mobile phones. Users can connect their wallet to the application, generating a digital replica bound to their wallet address, and allowing developers to guide them in minting their PASSPORT NFT. Blend mobile toolkit is an extension of the web application computation architecture build which is utilising Fire Storage as the intermediatery object storing solution and also utilising WalletConnect to record the user's Polkadot or any Substrate-based blockchain wallet address and store it together with the user info collection in Firebase for future usage. Currently in this hackathon, our team developed the toolkit for Android-based application (Java and Kotlin) and we hope to expand to the IOS ecosystem. Below is a high level architecture overview for the demo Android application using the Blend mobile toolkit:

![Frame 25](https://github.com/parity-asia/hackathon-2023-winter/assets/69501009/c07e671e-5e51-4414-9fb2-55648adfc75d)

#### Screenshots of the complete application activities (working on Android device):

![Group 2 (2)](https://github.com/parity-asia/hackathon-2023-winter/assets/69501009/b5e9b43d-d733-4bc1-aa61-daa8480c303a)

> Hey👋 [Click here](https://drive.google.com/file/d/1jkF3T3G16_ARll8Upeq8r9Nx_6lnleJx/view?usp=sharing) to download this Android demo application via APK. Note: as the demo Android application also required our AWS instance to run, please contact our team to run the instance for you before testing~ (Cost of running GPU instance is high, that's why our team will stop the instance when not used)


## Progressing Future Milestones (Post-Hackathon)

Our team is actively continuing the research and development of Blend, aiming to achieve even greater heights in the post-hackathon period. Currently, we are focused on several key initiatives.

![image](https://github.com/parity-asia/hackathon-2023-winter/assets/69501009/e43cebf3-0068-4ab2-8fd6-f4c8aecd6c09)

Firstly, our team is dedicated to refining the entire pipeline for reconstructing a full head mesh, complete with high-detail texture, to achieve a more seamless and lifelike blending of the game character. This process involves three additional components: the upper scalp section, the side face, and the junction between the scalp and the side face.

![image](https://github.com/parity-asia/hackathon-2023-winter/assets/69501009/8eb63161-abf4-4a4f-9ba1-29b313868ac0)

These newly reconstructed segments will seamlessly integrate with the existing reconstructed facial part. We have chosen to isolate the top scalp section in the reconstructed head model to concentrate on incorporating Neural Haircut, a deep-learning hairnet, to recreate and generate detailed hair strands based on the Web3 user's real-life hairstyle.

Here is a hair reconstruction sample based on a single selfie image using the Neural Haircut pipeline:

![image](https://github.com/parity-asia/hackathon-2023-winter/assets/69501009/b92b1d1f-c78d-41ca-9962-bf080775765e)

To further enhance the capabilities of our reconstructed head model, we have implemented an additional pipeline to automatically attach a face rig to the reconstructed face mesh. By employing text-to-speech AI and lip sync technology, we can effortlessly enable our Web3 gamers to take on roles within the narrative and engage with other in-game characters, creating a personalized gaming experience.

![image](https://github.com/parity-asia/hackathon-2023-winter/assets/69501009/30814f04-52c8-4b67-8d23-8c6088541321)

## Plans

### Things to be accomplished during the hackathon

- [ ] Automated Post Mesh Fusion pipeline for application
- [ ] Implement wallet connection in UE
- [ ] All-day running flask application (server)
- [ ] API key generation system (relate to usage control)
- [ ] Complete documentation of API (using GitBook)
- [ ] Developed a home page for our project (documenting our research progress and guide)
- [ ] Correctly integrate WalletConnect modal

### Things accomplished during the hackathon

- Blend Engine (Pytorch-based Deep Learning Model)
  - [x] Reconstruct model codebase
  - [x] Implement face landmark detection for preprocessing
  - [x] Build flask application and host model
  - [x] S3 buckets
  - [x] Lambda and Flask Endpoint
  - [x] Integration testing (Develop simple demo website for process job testing)

- Demo Web Application (Developed on Astar: Shibuya Testnet)
  - [x] Ink! smart contract (NFT minting)
  - [x] Blend engine integration
  - [x] Wallet connection (SubWallet)
  - [x] Payment (SBY token transfer)
  - [x] Metadata generation and IPFS task
  - [x] Token ID link to SubScan Explorer
  - [x] Integration testing (test mint, NFT reflect in wallet, metadata containing 3D files retrieval info)
  - [x] hosted on Vercel

- Demo Android Application (Connecting application to Polkadot and Kusama network)
  - [x] Frontend UI
  - [x] Model (Application Logic)
  - [x] Blend engine integration
  - [x] Firebase and Firestore setup
  - [x] Integration Testing (connect to SubWallet, record user wallet address in Firebase collection)

- Unreal Engine Task (for judge demo purpose)
  - [x] Two different game scene (showcase interoperability of NFT)
  - [x] Openworld social scene (showcase lightweight reconstruction)
  - [x] Manual post mesh fusion task

  
## Contact the Blend Team 👋

**Tan Zhi Xuan** (Lead Researcher and Developer of Blend)

Final Year Computer Science and Artificial Intelligence in the University of Nottingham (Malaysia)

GitHub: [@Zhixuan0318](https://github.com/Zhixuan0318)

WeChat: superbeef21



