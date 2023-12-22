# Net

The `net` folder contains:
- Shared logic (`Engine`), that is then used by **Unity UI** and others.
- Automated tests.
- `WebAPI`, that was initially used for quick scaffolding.
- `NetApiExt`, which is an automatically generated c# project by Substrate.Net.Toolchain, for communication with the Substrate Node.
- `Integration`, that combines `Engine` and `NetApiExt`.
- `Bot`, that implements a simple AI to play against

Basically, you can find a bunch logic here, that is hidden from the end-user. This logic is then used in the **Unity UI**.

# Prerequisites
- Ensure **Visual Studio 2022** is installed. If not, it can be downloaded from https://visualstudio.microsoft.com/downloads/.

### Step 1: Clone the Hackathon Repository
- Clone the hackathon's repository to a local machine.
- Navigate to `src/new/Substrate.Hexalem.NET` folder.

### Step 2: Open the C# Solution (.sln) in Visual Studio 2022
- Open Visual Studio 2022
- Click on **Open**.
- Find the `Substrate.Hexalem.NET.sln` file in the `src/new/Substrate.Hexalem.NET` folder.

<img width="1182" alt="Screenshot 2023-12-22 at 0 54 51" src="https://github.com/SubstrateGaming/hackathon-2023-winter/assets/77352013/990b724d-12f1-4a8f-911a-50dfdd32d251">

### Step 3: Build the solution
- In the top panel, click on the build -> rebuild solution

<img width="945" alt="Screenshot 2023-12-22 at 1 03 47" src="https://github.com/SubstrateGaming/hackathon-2023-winter/assets/77352013/d73dd0bf-6882-4220-9e46-7a5c1feced27">

### Step 4: Show Tests window
- In the top panel, activate the Tests panel by clicking on the View -> Tests

### Step 5: Run tests
- Integration tests depend on connecting to a local node on `ws://127.0.0.1:9944` address. For a guide on how to start the local Hexalem Substrate Node, please refer to the [Substrate node readme](https://github.com/SubstrateGaming/hackathon-2023-winter/tree/main/projects/36-Hexalem/src/substrate/README.md).
- To start the tests, just click on the 3 green triangles.

<img width="365" alt="Screenshot 2023-12-22 at 1 16 22" src="https://github.com/SubstrateGaming/hackathon-2023-winter/assets/77352013/21536700-09dc-439f-bebe-9e3a002df691">

- After running the tests, all tests should pass and you should see this. Please, be patient, the Integration tests might take ~30 seconds.
<img width="348" alt="Screenshot 2023-12-22 at 1 28 29" src="https://github.com/SubstrateGaming/hackathon-2023-winter/assets/77352013/e602b367-02a8-4df7-bf8e-2a97301b98c1">


