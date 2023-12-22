# polkadot-2023-winter-contracts 🚀 How to run the project

## 📦 Prerequisites

- Node.js v18.18.2+
- npm v9.8.1+

## 🗿 Deploy frontend

### Step 1. Clone the repository

Note: the smart contracts and frontend are located in two repositories, please use the correct one.

```bash
git clone [GIT_REPOSITORY_URL]
```

### Step 2. Go to the project directory (frontend)

```bash
cd [Project Name]
```

### Step 3. Install dependencies

```bash
npm i -f
```

### Step 4. Run the project

```bash
npm run dev
```

<div style="color:orange; background-color:#333">
Note:
<br />
- The frontend connects to the smart contracts deployed on the Moonbase Alpha TestNet by us instead of yours.
  <br />
- The frontend also connects to our centralized backend for data fetching, e.g. vault list.
  </div>
