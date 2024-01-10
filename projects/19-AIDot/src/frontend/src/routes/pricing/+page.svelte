<script>
    import NavBar from '../NavBar.svelte';
    import Footer from '../Footer.svelte';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition'; 
    import { ethers } from "ethers";
    import { AcalaJsonRpcProvider } from "@acala-network/eth-providers";
    import { config } from '$lib/config.js';


    let isPaymentSuccess = false;
    let isLogin = false;
    let isPopupTryNow = false;
    let isPopupPurchase = false;
    let username = "";
    let isSubscribed = false;

    let purchaseWithAcala, purchaseWithMoonbeam;

    onMount(() => {
        if (localStorage.username) {
            username = localStorage.username;
            isLogin = true;
        }

        (async function() {
            let errorMessage = "An unknown error occurred.";
            
            const response = await fetch(config.rpcUrl, {
                method: "POST",
                body: JSON.stringify({
                    method: "getSubscription",
                    params: {
                        username
                    }
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                // Success
                const responseBody = await response.json();

                isSubscribed = responseBody.payload.subscription !== "free";

                console.log(isSubscribed);
            } else {
                // Fail
                const responseBody = await response.json();

                if (responseBody.error && responseBody.error.message) {
                    errorMessage = responseBody.error.message;   
                }

                console.log(errorMessage);
            }
        })();

        let acalaProvider = new AcalaJsonRpcProvider(window.ethereum), 
            mbeamProvider = new ethers.providers.Web3Provider(window.ethereum),
            acalaSigner,
            mbeamSigner;

        async function purchasePack(paywith, txHash) {
            let errorMessage = "An unknown error occurred.";

            const response = await fetch(config.rpcUrl, {
                method: "POST",
                body: JSON.stringify({
                    method: "purchasePack",
                    params: {
                        username,
                        paywith,
                        txHash
                    }
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                // Success
                const responseBody = await response.json();

                isPaymentSuccess = true;
                isPopupPurchase = false;
                
                setTimeout(() => location.reload(), 1000);
                
                console.log("Payment succeeded!");
            } else {
                // Fail
                const responseBody = await response.json();

                if (responseBody.error && responseBody.error.message) {
                    errorMessage = responseBody.error.message;   
                }

                console.log(errorMessage);
            }
        }

        purchaseWithAcala = async function() {
            // Add Mandala Testnet if it's not already added yet
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

            // Switch network to Mandala
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: "0x253" }],
            });
            
            // Connect to wallet if not already connected
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

            if (accounts.length) {
                acalaProvider = new AcalaJsonRpcProvider(window.ethereum);
                acalaSigner = acalaProvider.getSigner();
            }

            const { chainId } = await mbeamProvider.getNetwork();

            // Only pay when network is Mandala
            if (chainId === 595) {
                const { hash } = await acalaSigner.sendTransaction({
                    to: "0x029B93211e7793759534452BDB1A74b58De22C9c",
                    value: ethers.utils.parseEther("1"),
                })

                await purchasePack("aca", hash);
            }
        }

        purchaseWithMoonbeam = async function() {
            // Add Moonbase Alpha Testnet if it's not already added yet
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

            // Switch network to Moonbeam
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: "0x507" }],
            });

            // Connect to wallet if not already connected
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

            if (accounts.length) {
                mbeamProvider = new ethers.providers.Web3Provider(window.ethereum);
                mbeamSigner = mbeamProvider.getSigner();
            }

            const { chainId } = await mbeamProvider.getNetwork();

            // Only pay when network is Moonbeam
            if (chainId === 1287) {
                const { hash } = await mbeamSigner.sendTransaction({
                    to: "0x029B93211e7793759534452BDB1A74b58De22C9c",
                    value: ethers.utils.parseEther("1"),
                });

                await purchasePack("glmr", hash);
            }
        }
    });
    
    function tryNow(){
        if(!isLogin){
            goto(`/login`);
            return;
        }
        isPopupTryNow = true;
    };
    function purchase(){
        if(!isLogin){
            goto(`/login`);
            return;
        }
        if(isSubscribed){
            isPaymentSuccess = true;
            return;
        }
        isPopupPurchase = true;
    };

    function upcoming(){};

    let plans =[
            {
                title: "Free plan",
                price: 0,
                features:[
                    {
                        content:"Use AIDot chatbot",
                        status:true
                    },
                    {
                        content:"Create custom chatbot: 1",
                        status:true
                    },
                    {
                        content:"Cap custom chatbot: 150/month",
                        status:true
                    },
                    {
                        content:"Training bot",
                        status:true
                    },
                    {
                        content:"Integrate to your website",
                        status:true
                    },
                    {
                        content:"Customize logo",
                        status:false
                    },
                    {
                        content:"Customize widget",
                        status:false
                    },
                    {
                        content:"Integrate to your Discord",
                        status:false
                    },
                    {
                        content:"Automatic learning from Discord",
                        status:false
                    },
                    {
                        content:"Automatic learning from Twitter",
                        status:false
                    },
                    {
                        content:"Automatic training with your API",
                        status:false
                    },
                ],
                buttonTitle:"Try now",
                buttonBg:"bg-pink2",
                buttonAction: tryNow
            },
            {
                title: "Advanced plan",
                price: 5,
                features:[
                    {
                        content:"Use AIDot chatbot",
                        status:true
                    },
                    {
                        content:"Create custom chatbot: 1",
                        status:true
                    },
                    {
                        content:"Cap custom chatbot: 15000/month",
                        status:true
                    },
                    {
                        content:"Training bot",
                        status:true
                    },
                    {
                        content:"Integrate to your website",
                        status:true
                    },
                    {
                        content:"Customize logo",
                        status:false
                    },
                    {
                        content:"Customize widget",
                        status:false
                    },
                    {
                        content:"Integrate to your Discord",
                        status:false
                    },
                    {
                        content:"Automatic learning from Discord",
                        status:false
                    },
                    {
                        content:"Automatic learning from Twitter",
                        status:false
                    },
                    {
                        content:"Automatic training with your API",
                        status:false
                    },
                ],
                buttonTitle:"Purchase",
                buttonBg:"bg-linearPink2",
                buttonAction:purchase
            },
            {
                title: "Full plan",
                price: 100,
                features:[
                    {
                        content:"Use AIDot chatbot",
                        status:true
                    },
                    {
                        content:"Create custom chatbot: 1",
                        status:true
                    },
                    {
                        content:"Cap custom chatbot: unlimited/month",
                        status:true
                    },
                    {
                        content:"Training bot",
                        status:true
                    },
                    {
                        content:"Integrate to your website",
                        status:true
                    },
                    {
                        content:"Customize logo",
                        status:true
                    },
                    {
                        content:"Customize widget",
                        status:true
                    },
                    {
                        content:"Integrate to your Discord",
                        status:true
                    },
                    {
                        content:"Automatic learning from Discord",
                        status:true
                    },
                    {
                        content:"Automatic learning from Twitter",
                        status:true
                    },
                    {
                        content:"Automatic training with your API",
                        status:true
                    },
                ],
                buttonTitle:"Upcoming",
                buttonBg:"bg-gray-600",
                buttonAction:upcoming
            },
        ]
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

<!--Static Landing Page-->
<div class="relative flex flex-col max-w-screen-2xl mx-auto ">
    <NavBar/>
    <!--Content-->
    <div class="relative flex flex-col w-full items-center justify-center h-fit mb-[50px] ">
        <div class="text-center linear-pink2-text sm:text-4xl text-2xl font-bold sm:mt-[60px] mt-[40px] mb-[20px]">
            Get the complete AIDOT to your platform
        </div>
        <div class="bg-linearPink3  w-full flex justify-center py-10">
            <!--Plan Container-->
            <div class="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-12 lg:gap-6 sm:gap-8 gap-4 sm:w-fit w-full sm:px-0 px-10">
                {#each plans as plan}
                    <!--Plan-->
                    <div class="shrink-on-hover bg-white flex flex-col sm:gap-3 gap-1 p-4 col-span-1 border shadow-xl rounded-xl lg:px-8 md:px-4">
                        <span class="sm:text-2xl text-xl font-semibold ">
                            {plan.title}
                        </span>
                        <div class="sm:text-xl text-lg flex items-center text-lg">
                                <span class="{plan.price === 0? "opacity-0":""} mr-2">{plan.price}</span>
                                <img class="{plan.price === 0? "opacity-0":""} inline-block sm:h-[25px] h-[18px]" src ="/dot.svg"/>
                                <span class="{plan.price === 0? "opacity-0":""}">/month</span>
                        </div>

                        <!--Feature container-->
                        <div class="flex flex-col border-t border-gray-300 pt-4 gap-1">
                            {#each plan.features as feature}
                                <div class="flex gap-1 items-center {feature.status ? "":"opacity-40"}">
                                    {#if feature.status === true && plan.title !== "Free plan"}
                                        <img class="h-2 inline-block" src="/tickVip.svg"/>
                                    {:else if feature.status && plan.title == "Free plan"}
                                        <img class="h-2 inline-block" src="/tick.svg"/>
                                    {:else}
                                        <img class="h-2 inline-block" src="/x.svg"/>
                                    {/if}
                                    <span class="text-sm">
                                        {feature.content}
                                    </span>
                                </div>
                            {/each}
                        </div>
                        <!--Button-->
                        <button class={`mt-5 py-[5px] text-white hover:border-pink  border rounded-lg ${plan.buttonBg}`} on:click={plan.buttonAction}>
                            {#if isSubscribed && plan.title!=="Full plan"}
                                    Activated
                            {:else}
                                {plan.buttonTitle}
                            {/if}
                        </button>
                    </div>
                {/each}
            </div>
        </div>

    </div>

    <Footer/>

    <!--Notification-->
    {#if isPopupTryNow}
        <div class="absolute font-semibold flex flex-col inset-0 bg-black  bg-opacity-60 z-50" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
            <div class="flex flex-col mx-auto  mt-[200px] md:max-w-[500px] w-full max-w-[400px] h-[280px] bg-white gap-2 rounded-lg">
                <!--Close button + reset page to 1-->
                <button class="self-end"
                        on:click={()=>{isPopupTryNow = false}}>
                    <svg class="h-8 p-2 fill-black hover:fill-pink"  viewBox="0 0 32 32" fill="none">
                        <path d="M5.74777 0L0 5.74777L2.93503 8.6828L10.1911 16.0611L2.93503 23.3172L0 26.1299L5.74777 32L8.6828 29.065L16.0611 21.6866L23.3172 29.065L26.1299 32L32 26.1299L29.065 23.3172L21.6866 16.0611L29.065 8.6828L32 5.74777L26.1299 0L23.3172 2.93503L16.0611 10.1911L8.6828 2.93503L5.74777 0Z" />
                    </svg>	
                </button>
                <img class="self-center w-[150px] inline-block" src="/done.svg"/>
                <span class="md:text-2xl sm:text-xl text-base self-center font-thin">
                    Your account already has free plan
                </span>
            </div>
        </div>
    {/if}
    {#if isPopupPurchase}
        <div class="absolute flex flex-col inset-0 bg-black  bg-opacity-60 z-50" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
            <div class="flex flex-col mx-auto  sm:mt-[200px] mt-[70 0px] md:max-w-[500px] w-full max-w-[400px] h-[280px] bg-white gap-3 rounded-lg">
                <!--Close button + reset page to 1-->
                <button class="self-end"
                        on:click={()=>{isPopupPurchase  = false}}>
                    <svg class="h-8 p-2 fill-black hover:fill-pink"  viewBox="0 0 32 32" fill="none">
                        <path d="M5.74777 0L0 5.74777L2.93503 8.6828L10.1911 16.0611L2.93503 23.3172L0 26.1299L5.74777 32L8.6828 29.065L16.0611 21.6866L23.3172 29.065L26.1299 32L32 26.1299L29.065 23.3172L21.6866 16.0611L29.065 8.6828L32 5.74777L26.1299 0L23.3172 2.93503L16.0611 10.1911L8.6828 2.93503L5.74777 0Z" />
                    </svg>	
                </button>
                <span class="self-center text-3xl font-semibold linear-pink2-text" >Pay with</span>
                <button on:click={() => purchaseWithMoonbeam()} class="shrink-on-hover flex self-center items-center gap-2 p-1 rounded-xl border shadow hover:border-pink">
                    <img class=" w-[50px] inline-block" src="/chain/moonbeam.svg"/>
                    <span>Moonbeam Testnet</span>
                </button>
                <button disabled class=" flex self-center items-center gap-2 p-1 rounded-xl border shadow  bg-gray-200">
                    <img class="w-[50px] inline-block" src="/chain/acalaEVM.svg"/>
                    <span>Acala EVM Testnet</span>
                </button>

                
                
                <span class="text-sm self-center font-thin px-2">
                    For demo simplicity, we purchase plan with native token of the Testnet
                </span>
            </div>
        </div>
    {/if}
    {#if isPaymentSuccess }
        <div class="absolute font-semibold flex flex-col inset-0 bg-black  bg-opacity-60 z-50" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
            <div class="flex flex-col mx-auto  mt-[200px] md:max-w-[500px] w-full max-w-[400px] h-[280px] bg-white gap-2 rounded-lg">
                <!--Close button + reset page to 1-->
                <button class="self-end"
                        on:click={()=>{isPaymentSuccess = false}}>
                    <svg class="h-8 p-2 fill-black hover:fill-pink"  viewBox="0 0 32 32" fill="none">
                        <path d="M5.74777 0L0 5.74777L2.93503 8.6828L10.1911 16.0611L2.93503 23.3172L0 26.1299L5.74777 32L8.6828 29.065L16.0611 21.6866L23.3172 29.065L26.1299 32L32 26.1299L29.065 23.3172L21.6866 16.0611L29.065 8.6828L32 5.74777L26.1299 0L23.3172 2.93503L16.0611 10.1911L8.6828 2.93503L5.74777 0Z" />
                    </svg>	
                </button>
                <img class="self-center w-[150px] inline-block" src="/done.svg"/>
                <span class="md:text-2xl sm:text-xl text-base self-center font-thin">
                    Your plan has been activated
                </span>
            </div>
        </div>
    {/if}
</div>


