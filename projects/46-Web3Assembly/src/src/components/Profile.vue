<template>
  <div class="wallet">
    <div v-if="account">
      <el-row>
        <img src="../assets/wonderpal3981.png" alt="Avatar" class="avatar" />
      </el-row>
      <el-row>
        <div class="name-font">{{ name }}</div>
      </el-row>
      <el-row
        style="display: flex; justify-content: center; align-items: center"
        align-items="middle"
      >
        <img
          style="margin-right: 4px; width: 15px; height: 15px"
          src="../assets/solana.jpg"
        />
        <label class="address-font">{{ shortenedAddress }}</label>
      </el-row>
      <el-row>
        <div class="balance-font">{{ shortenedBalance }}</div>
      </el-row>
      <el-row class="full-width-row">
        <div>
          <i style="color: #3887fe; font-size: 24px" class="el-icon-menu"></i>
          <span>Dashboard</span>
        </div>
        <div class="disconnect-hover" @click="getToken">
          <i
            style="color: #3887fe; font-size: 24px"
            class="el-icon-circle-plus-outline"
          ></i>
          <span>ClaimToken</span>
        </div>
        <div class="disconnect-hover" @click="disconnectWallet">
          <i style="color: #3887fe; font-size: 24px" class="el-icon-more"></i>
          <span>Disconnect</span>
        </div>
      </el-row>
    </div>
    <div v-else>
      <el-button style="font-size: large" type="primary" @click="connectWallet"
        >Connect Wallet</el-button
      >
    </div>
  </div>
</template>
  
<script>
import Vue from 'vue'
import { ethers } from "ethers"
import contractAbi from '@/contract/abi/WAG.json'
import { contractAddress } from '@/components/const.js'
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js'


export default {

  data () {
    return {
      account: null,
      name: "tian.eth",
      balance: null,
      connection: new Connection('https://api.devnet.solana.com'),
    }
  },
  computed: {
    // shortenedAddress () {
    //   if (this.account) {
    //     this.name = "tian.eth"
    //     return `${this.account.substring(0, 12)}...${this.account.substring(this.account.length - 4)}`
    //   }
    //   return ''
    // },
    // shortenedBalance () {
    //   if (this.balance) {
    //     return `${this.balance.substring(0, 6)}...ETH`
    //   }
    // }
    shortenedAddress () {
      if (this.account) {
        return `${this.account.substring(0, 12)}...${this.account.substring(this.account.length - 4)}`
      }
      return ''
    },
    shortenedBalance () {
      if (this.balance != null) {
        return `${this.balance} SOL`  // 假设余额是以 SOL 为单位的
      }
      return ''
    }
  },
  methods: {
    // async connectWallet() {
    //     if (typeof window.ethereum !== "undefined") {
    //         try {
    //             // 请求用户账户地址
    //             const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    //             this.$emit('update:account', accounts[0]);
    //             this.account = accounts[0]
    //             console.log("account here:" + this.account)

    //             // 创建一个 ethers provider
    //             const provider = new ethers.providers.Web3Provider(window.ethereum);

    //             // 获取用户的 ETH 余额
    //             const balanceWei = await provider.getBalance(this.account);
    //             this.balance = ethers.utils.formatEther(balanceWei);

    //             // Save account info to localStorage
    //             localStorage.setItem('walletInfo', JSON.stringify({ account: this.account, balance: this.balance, name: 'tian.eth' }));
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     } else {
    //         alert("Please install a Web3 provider, such as MetaMask.");
    //     }
    // },
    // async connectWallet () {
    //   // console.log('"window.solana.isPhantom :',window.solana.isPhantom);

    //   try {
    //     //{ onlyIfTrusted: true }是 onlyIfTrusted 的参数，可以去掉
    //     const resp = await window.solana.connect()
    //     resp.publicKey.toString()
    //     //连接了solana钱包，得到了钱包地址
    //     console.log('resp.publicKey.toString() :', resp.publicKey.toString())
    //     this.getTokenByAccount(resp.publicKey.toString())
    //   } catch (err) {
    //     console.log('connectWallet err :', err)
    //   }
    // },
    async connectWallet () {
      try {
        const resp = await window.solana.connect()
        this.account = resp.publicKey.toString()
        console.log('resp.publicKey.toString() :', this.account)
        const balance = await this.connection.getBalance(window.solana.publicKey)
        this.balance = balance / LAMPORTS_PER_SOL  // 获取余额
        console.log(this.balance)
      } catch (err) {
        console.log('connectWallet err :', err)
      }
    },

    disconnectWallet () {
      this.account = null
      this.name = null
      this.balance = null
      localStorage.removeItem('walletInfo')
    },

    async getToken () {
      try {
        if (typeof window.ethereum !== "undefined") {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner()
          console.log(contractAddress)
          const contract = new ethers.Contract(contractAddress, contractAbi, signer)
          const tx = await contract.claim()
          await tx.wait()
          this.$message({
            message: 'Token received !',
            type: 'success'
          })
        } else {
          alert("Please install a Web3 provider, such as MetaMask.")
        }
      } catch (error) {
        this.$message({
          message: error,
          type: 'error'
        })
        console.error('Error sending transaction:', error)
      }
    }
  },
  mounted () {
    const walletInfo = JSON.parse(localStorage.getItem('walletInfo'))
    if (walletInfo) {
      this.account = walletInfo.account
      this.name = walletInfo.name
      this.balance = walletInfo.balance
    }
  },
  created () {
    // Check if account info exists in localStorage and use it if it does
    const walletInfo = JSON.parse(localStorage.getItem('walletInfo'))
    if (walletInfo) {
      this.account = walletInfo.account
      this.name = walletInfo.name
      this.balance = walletInfo.balance
    }
  }
};
</script>
  
<style>
.wallet {
  max-height: 400px;
  padding: 10px;
  max-width: 300px;
  margin: 10 10;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.full-width-row {
  width: 100%;
}
.el-row {
  margin: 10px;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.icon {
  width: 20px;
  height: 20px;
  margin-right: 50%;
}
.info-line {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.address-font {
  color: #5d5d5b;
  font-weight: 700;
  font-size: 1rem;
}
.name-font {
  font-weight: 800;
  font-size: 2rem;
  align-items: center;
}
.full-width-row {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.content-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.icon {
  width: 20px;
  height: 20px;
  margin-bottom: 5px; /* 添加一些间距，使图像和文本之间有一些空间 */
}
.balance-font {
  font-weight: 600;
  font-size: 1rem;
  color: #333;
}
.disconnect-hover:hover {
  border: 2px solid #3887fe;
  border-radius: 5px; /* 可以根据你的需求调整这个值 */
  transition: border 0.15s; /* 添加一个平滑的过渡效果 */
}
.full-width-row div {
  display: inline-block;
  padding: 2px; /* 添加一些填充，使得边框看起来更好 */
}
</style>
  
