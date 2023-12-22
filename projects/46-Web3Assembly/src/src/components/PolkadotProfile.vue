<template>
    <div>
      <button v-if="!accounts.length" @click="connectToPolkadot" class="connectButton">
        Connect to Polkadot
      </button>
      <div v-else class="accountInfo">
        <select v-model="selectedAddress" @change="fetchBalance" class="selectAccount">
          <option v-for="account in accounts" :key="account.address" :value="account.address">
            {{ account.meta.name || account.address }}
          </option>
        </select>
        <p>{{ balance }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import { web3Enable, web3Accounts } from '@polkadot/extension-dapp';
  import { ApiPromise, WsProvider } from '@polkadot/api';
  
  export default {
    data() {
      return {
        accounts: [],
        selectedAddress: '',
        balance: '',
        api: null,
      };
    },
    methods: {
      async connectToPolkadot() {
        const extensions = await web3Enable('MyVueApp');
        if (extensions.length === 0) {
          alert('No extension found');
          return;
        }

        const allAccounts = await web3Accounts();
        if (allAccounts.length > 0) {
          this.accounts = allAccounts;
          this.selectedAddress = allAccounts[0].address;
          this.balance = 'loading...'
          this.initializeApi();
        } else {
          alert('No accounts found');
        }
      },
      async initializeApi() {
        const provider = new WsProvider('wss://rpc.polkadot.io');
        this.api = await ApiPromise.create({ provider });
        this.fetchBalance();
      },
      async fetchBalance() {
        if (!this.selectedAddress || !this.api) return;
        const { data: { free: balance } } = await this.api.query.system.account(this.selectedAddress);
        this.balance = "balance:" + balance.toHuman();
      },
    },
    watch: {
      selectedAddress(newAddress, oldAddress) {
        if (newAddress !== oldAddress) {
          this.fetchBalance();
        }
      },
    },
  };
  </script>
  
  <style>
/* 登录按钮样式 */
.connectButton {
    background-color: #4a90e2; /* 蓝色背景 */
    color: white; /* 白色文字 */
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s, box-shadow 0.3s;
}

.connectButton:hover {
    background-color: #357ab8; /* 深蓝色背景 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 用户名和余额展示样式 */
.accountInfo {
    background-color: #4a90e2; /* 浅灰色背景 */
    border-radius: 5px;
    padding: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;

}

.accountInfo p {
    /* margin: 5px 0; */
    color: white; /* 深灰色文字 */
    font-size: 14px;
    white-space: nowrap;
}
/* 其他样式保持不变 */

/* 账户选择下拉菜单样式 */
.selectAccount {
    width: 100%; /* 宽度100% */
    /* padding: 8px 10px; */
    border-radius: 4px;
    border: 1px solid #4a90e2;
    background-color: #4a90e2;
    color: white;
    font-size: 14px;
    cursor: pointer;
    /* margin-top: 10px; */
}

.selectAccount:focus {
    outline: none;
    border-color: #4a90e2;
}

  </style>
  