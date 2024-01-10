<script>
    import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
    import { config } from '$lib/config.js';
    import { onMount } from 'svelte';
    import { ethers } from "ethers";
    
    let connectToAcala;
    let connectToMoonBeam;

    onMount(() => {
        // Utilities
        function arrayToHex(array) {
            return Array.from(array)
                .map((i) => i.toString(16).padStart(2, '0'))
                .join('');
        }

        let provider = window.ethereum ? new ethers.providers.Web3Provider(window.ethereum) : undefined, signer;

        // Sign message for authentication
        async function sign() {
            if (!signer) {
                alert("No sign message");
                return;
            }

            // Generate salt
            const randomValue = new Uint8Array(32);
            window.crypto.getRandomValues(randomValue);
            const salt = arrayToHex(randomValue);

            const messageHash = ethers.utils.solidityKeccak256(["string"], ["AIDOT_AUTH_MESSAGE" + salt]);

            const flatSig = await signer.signMessage(ethers.utils.arrayify(messageHash));

            // Get authkey
            let errorMessage = "An unknown error occurred.";

            const response = await fetch("http://localhost:20297", {
                method: "POST",
                body: JSON.stringify({
                    method: "getAuthKey",
                    params: {
                        username: await signer.getAddress(),
                        sig: flatSig,
                        salt
                    }
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            
            if (response.ok) {
                // Success
                const responseBody = await response.json();

                localStorage.username = await signer.getAddress();
                localStorage.password = "";
                localStorage.authkey = responseBody.payload.authkey;

                goto("../control");
            } else {
                // Fail
                const responseBody = await response.json();
            
                if (responseBody.error && responseBody.error.message) {
                    errorMessage = responseBody.error.message;   
                }

                console.log(errorMessage);
            }
        }

        // Connect to metamask
        connectToAcala = async function() {
            // Handle the case where user might not have an Acala EVM wallet installed
            if (!window.ethereum) {
                window.open("https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn", "_blank");
                return;
            }

            await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [{
                    chainId: "0x253",
                    rpcUrls: ["https://eth-rpc-tc9.aca-staging.network"],
                    chainName: "Mandala TC9",
                    nativeCurrency: {
                        name: "mACA",
                        symbol: "mACA",
                        decimals: 18
                    },
                    blockExplorerUrls: ["https://blockscout.mandala.aca-staging.network/"]
                }]
            });

            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

            if (accounts.length) {
                signer = provider.getSigner();
                await sign();
            }
        }
        
        // Connect to metamask
        connectToMoonBeam = async function() {
            // Handle the case where user might not have an Acala EVM wallet installed
            if (!window.ethereum) {
                window.open("https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn", "_blank");
                return;
            }

            await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [{
                    chainId: "0x507",
                    rpcUrls: ["https://rpc.api.moonbase.moonbeam.network"],
                    chainName: "Moonbase Alpha",
                    nativeCurrency: {
                        name: "DEV",
                        symbol: "DEV",
                        decimals: 18
                    },
                    blockExplorerUrls: ["https://moonbase.moonscan.io/"]
                }]
            });

            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

            if (accounts.length) {
                signer = provider.getSigner();
                await sign();
            }
        }
    });




    let showRegister = false;
    let rePasswordInput;
    let reUsernameInput;
    let reRePasswordInput;

    async function register() {
        let errorMessage = "An unknown error occurred.";

        const response = await fetch(config.rpcUrl, {
            method: "POST",
            body: JSON.stringify({
                method: "register",
                params: {
                    username: reUsernameInput,
                    password: rePasswordInput
                }
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if (response.ok) {
        } else {
            // Fail
            const responseBody = await response.json();
        
            if (responseBody.error && responseBody.error.message) {
                errorMessage = responseBody.error.message;   
            }

            console.log(errorMessage);
        }
    }
    //front-end stuff
    let isShowLoginWithAccount = false;

    let usernameInput = "";
    let passwordInput = "";

    import NavBar from '../NavBar.svelte';
    import Footer from '../Footer.svelte';
    
    async function verifyPassword(username, password) {
        let errorMessage = "An unknown error occurred.";

        const response = await fetch(config.rpcUrl, {
            method: "POST",
            body: JSON.stringify({
                method: "listChatBots",
                params: {
                    username,
                    password
                }
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    }
    

    let isLogin = true;
    let isPopUpMetamask = false;
</script>
<style>
    .linear-pink2-text {
    background: linear-gradient(to right, #E6449A, #9E00FF);
    -webkit-background-clip: text;
    -moz-background-clip: text;
    background-clip: text;
    color: transparent;
    }

    .shrink-on-hover {
    vertical-align: middle;
    -webkit-transform: perspective(1px) translateZ(0);
    transform: perspective(1px) translateZ(0);
    box-shadow: 0 0 1px rgba(0, 0, 0, 0);
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -webkit-transition-property: transform;
    transition-property: transform;
    }
    .shrink-on-hover:hover, .shrink-on-hover:focus, .shrink-on-hover:active {
    -webkit-transform: scale(1.1);
    transform: scale(1.05);
}
</style>
    <div class="relative flex w-full md:justify-start justify-center">
        <div class="w-full flex flex-col max-w-screen-2xl mx-auto bg-no-repeat	bg-cover" style="background-image: url(./loginBg1.png)">
            <NavBar/>
            <!--Login Container-->
            <div class=" flex flex-col my-24 items-center mx-auto w-fit gap-y-1 mb-32 bg-white py-6 px-4 border-2 shadow-lg rounded-lg" in:fade={{ duration: 300 }}>
                <img class="w-[330px] inline-block" src="/loginBanner.png"/>
                <!-- 
                <div class="flex justify-center items-center text-white w-[330px]  shadow-lg bg-pink  rounded-lg mt-6">
                    <button class="mr-1 font-semibold border rounded-lg px-1 my-2 ml-2 text-lg ">
                        Sign in with Polkadot Wallet
                    </button>
                </div> Sign in with Polkadot Wallet Container
                -->
                <!--Display login with Account Button-->
                <div class="flex shrink-on-hover justify-center items-center text-white w-[330px]  shadow-lg bg-linearPink2  rounded-lg">
                    <!--Account Address-->
                    <button on:click={()=>{isPopUpMetamask = true}} class="flex mr-1 font-semibold border rounded-lg px-6 my-2 ml-2 text-lg " >
                        Sign in with Metamask
                        <img class="inline-block h-6 mx-2" src="/metamask.svg"/>
                    </button>
                </div>
                <!--Display login with Account Button-->
                <div class="shrink-on-hover flex justify-center items-center text-white w-[330px]  shadow-lg bg-black rounded-lg">
                    <!--Account Address-->
                    <button class="mr-1 font-semibold border rounded-lg px-1 my-2 ml-2 text-lg " 
                    on:click={()=>{isShowLoginWithAccount = !isShowLoginWithAccount}}>
                        Sign in with Account & Password
                    </button>
                </div> 
                <!--Display login with Polkadot JS-->
                <div class="flex justify-center items-center text-white w-[330px]  shadow-lg bg-gray-400 rounded-lg">
                    <!--Account Address-->
                    <button disabled class="flex items-center mr-1 font-semibold border rounded-lg px-1 my-2 ml-2 text-lg " >
                        <span>Sign in with Polkadot JS</span>
                        <img class="inline-block h-6 mx-1" src="/polkadotjs.png"/>
                        <span class="text-xs text white bg-yellow-500 p-0.5 rounded-lg">Upcoming</span>
                    </button>
                </div>

                <!--Display login with Account & Password-->
                {#if isShowLoginWithAccount === true}
                    <!--Account Input Container-->
                    <div class="flex flex-col gap-3 mx-auto my-1" in:fade={{ duration: 300 }}>
                        <div class="flex w-fit">
                            <input bind:value={usernameInput}
                                class="border rounded-lg h-8 w-80 pl-2" 
                                placeholder="                       Enter account"
                            />
                        </div>
                    </div>

                    <!--Password Input Container-->
                    <div class="flex flex-col gap-3 mx-auto my-1" in:fade={{ duration: 300 }}>
                        <div class="flex w-fit">
                            <input bind:value={passwordInput}
                                class="border rounded-lg h-8 w-80 pl-2" 
                                type="password"
                                placeholder="                       Enter password"
                            />
                        </div>
                        <!--Error Message for login with password-->
                            
                        {#if !isLogin}
                            <span class="text-red-500">Error</span>
                        {/if}
                    </div>

                    <!--Sign in Button-->
                    <button on:click={async () => {
                        if (await verifyPassword(usernameInput, passwordInput)) {
                            localStorage.username = usernameInput;
                            localStorage.password = passwordInput;
                            localStorage.authkey = "";

                            goto("../control");
                        } else {
                            isLogin = false;
                        }
                    }} class=" bg-pink hover:bg-black py-1 w-fit rounded-lg px-4 mb-2 mt-4 self-center">
                        <span class="text-white text-lg font-semibold">Sign in</span>
                    </button>

                {/if}

                
                <span class="text-xl my-1">or</span>

                <div class="shrink-on-hover flex justify-center items-center text-white w-[330px]  shadow-lg bg-pink  rounded-lg mt-2">
                    <button class="mr-1 font-semibold border rounded-lg px-10 my-2 ml-2 text-lg " on:click={()=>{showRegister =!showRegister }}>
                        Register new account
                    </button>
                </div> 
                <!--Display login with Account & Password-->
                {#if showRegister === true}
                <!--Account Input Container-->
                <div class="flex flex-col gap-3 mx-auto my-1 border rounded-lg border-black" in:fade={{ duration: 300 }}>
                    <div class="flex w-fit">
                        <input bind:value={reUsernameInput}
                            class="border rounded-lg h-8 w-80 pl-2" 
                            placeholder="                       Enter account"
                        />
                    </div>
                </div>

                <!--Password Input Container-->
                <div class="flex flex-col gap-3 mx-auto my-1 borde rounded border-black" in:fade={{ duration: 300 }}>
                    <div class="flex w-fit">
                        <input bind:value={rePasswordInput}
                            class="border rounded-lg h-8 w-80 pl-2" 
                            type="password"
                            placeholder="                       Enter password"
                        />
                    </div>
                    <!--Error Message for login with password-->
                        
                    {#if !isLogin}
                        <span class="text-red-500">Error</span>
                    {/if}
                </div>
                <!--RePassword Input Container-->
                <div class="flex flex-col gap-3 mx-auto my-1 borde rounded border-black" in:fade={{ duration: 300 }}>
                    <div class="flex w-fit">
                        <input bind:value={reRePasswordInput}
                            class="border rounded-lg h-8 w-80 pl-2" 
                            type="password"
                            placeholder="                       Re-enter password"
                        />
                    </div>
                    <!--Error Message for login with password-->
                        
                    {#if rePasswordInput !== reRePasswordInput}
                        <span class="text-red-500">Password do not match</span>
                    {/if}
                </div>

                <!--Sregister Button-->
                <button on:click={async () => {
                    if (rePasswordInput === reRePasswordInput) {
                        await register();

                        localStorage.username = reUsernameInput;
                        localStorage.password = rePasswordInput;
                        localStorage.authkey = "";

                        goto("../control");
                    }
                }} class=" bg-pink hover:bg-black py-1 w-fit rounded-lg px-4 mb-2 mt-4 self-center">
                    <span class="text-white text-lg font-semibold">Register</span>
                </button>

            {/if}
            

            </div>
            <Footer/>
            <!--PopUp-->	
            {#if isPopUpMetamask}
                <div class="absolute font-semibold flex flex-col inset-0 bg-black  bg-opacity-60 z-50" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
                    <div class="flex flex-col w-[360px] mx-auto mt-[150px] h-[380px] bg-white gap-2 rounded-lg">
                        <!--Close button + reset page to 1-->
                        <button class="self-end"
                                on:click={()=>{isPopUpMetamask = false}}>
                            <svg class="h-10 p-2 fill-pink hover:fill-black"  viewBox="0 0 32 32" fill="none">
                                <path d="M5.74777 0L0 5.74777L2.93503 8.6828L10.1911 16.0611L2.93503 23.3172L0 26.1299L5.74777 32L8.6828 29.065L16.0611 21.6866L23.3172 29.065L26.1299 32L32 26.1299L29.065 23.3172L21.6866 16.0611L29.065 8.6828L32 5.74777L26.1299 0L23.3172 2.93503L16.0611 10.1911L8.6828 2.93503L5.74777 0Z" />
                            </svg>	
                        </button>
                        <span class="md:text-2xl sm:text-xl text-base self-center font-base linear-pink2-text">
                            Choose chain
                        </span>
                        <div class="flex flex-col w-fit mx-auto gap-4 mt-[10px] border-t pt-[10px]">
                            <button on:click={() => connectToMoonBeam()} class="px-2 shrink-on-hover flex self-center justify-center items-center gap-2 p-1 rounded-xl border shadow hover:border-pink">
                                <img class=" w-[50px] inline-block" src="/chain/moonbeam.svg"/>
                                <span>Moonbeam Testnet</span>
                            </button>
                            <button on:click={() => connectToAcala()} class="px-[10px] shrink-on-hover  flex self-center justify-center items-center gap-2 p-1 rounded-xl border shadow hover:border-pink">
                                <img class="w-[50px] inline-block" src="/chain/acalaEVM.svg"/>
                                <span>Acala EVM Testnet</span>
                            </button>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </div>

