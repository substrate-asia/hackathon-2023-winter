<script>
    import { page } from '$app/stores';
    import { getCode } from '$lib/embed.js'
    import { config } from '$lib/config.js'
    import { fade } from 'svelte/transition'; 
    import { goto } from '$app/navigation';
    import Footer from '../Footer.svelte'
    import NavBar2 from '../NavBar2.svelte'
    import { get } from 'svelte/store';
    import { onMount } from 'svelte';

    let errorCreateBotMessage = "";
    let displayIntegrate = false;
    let displayId = "";

    //load bot
    let fulfilled = false;

    //Check bot existed
    let customChatBotExisted = false;
    let customChatBotID = "";

    let customBotUsage = 0;
    let customBotLimit = 150;
    let initialBotUsage = 0;

    let isAdmin = false;

    let username = "";
    let password = "";
    let authkey = "";

    onMount(() => {
        if (!localStorage.username) {
            goto("/../../login");
        }

        console.log(username, password, authkey);

        username = localStorage.username;
        password = localStorage.password;
        authkey = localStorage.authkey;

        console.log(username, password, authkey);

        (async function() {
            let errorMessage = "An unknown error occurred.";

            const response = await fetch(config.rpcUrl, {
                method: "POST",
                body: JSON.stringify({
                    method: "listChatBots",
                    params: {
                        username,
                        password,
                        authkey
                    }
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            
            if (response.ok) {
                // Success
                const responseBody = await response.json();

                console.log(responseBody.payload.chatBots[0]);

                if (responseBody.payload.chatBots[0]) {
                    customChatBotExisted = true;
                    customChatBotID = responseBody.payload.chatBots[0];
                }

                await getInitialBotId();

                await verifyAdmin();

                [ customBotUsage, customBotLimit] = await getBotUsage(customChatBotID);
                [ initialBotUsage, ] = await getBotUsage(initialBotId);

                fulfilled = true;
            } else {
                // Fail
                const responseBody = await response.json();
            
                console.log(responseBody);

                if (responseBody.error && responseBody.error.message) {
                    errorMessage = responseBody.error.message;
                }

                console.log(errorMessage);

                // Lam gi day o day
            }
        })();
    });

    // Verify admin
    async function verifyAdmin() {
        let errorMessage = "An unknown error occurred.";

        const response = await fetch(config.rpcUrl, {
            method: "POST",
            body: JSON.stringify({
                method: "listChatBots",
                params: {
                    username,
                    password,
                    authkey
                }
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if (response.ok) {
            // Success
            const responseBody = await response.json();

            isAdmin = responseBody.payload.chatBots.includes(initialBotId);

            fulfilled = true;
        } else {
            // Fail
            const responseBody = await response.json();
        
            console.log(responseBody);

            if (responseBody.error && responseBody.error.message) {
                errorMessage = responseBody.error.message;
            }

            console.log(errorMessage);

            // Lam gi day o day
        }
    };

    //Load Initial bot
    let initialBotId = "";

    async function getInitialBotId() {
        let errorMessage = "An unknown error occurred.";

        const response = await fetch(config.rpcUrl, {
            method: "POST",
            body: JSON.stringify({
                method: "getInitialBotId",
                params: {}
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if (response.ok) {
            // Success
            const responseBody = await response.json();

            initialBotId = responseBody.payload.id;
        } else {
            // Fail
            const responseBody = await response.json();
        
            if (responseBody.error && responseBody.error.message) {
                errorMessage = responseBody.error.message;   
            }

            console.log(errorMessage);
        }
    }

    // get bot info
    async function getBotUsage(assistantID) {
        console.log(assistantID);

        let errorMessage = "An unknown error occurred.";

        const response = await fetch(config.rpcUrl, {
            method: "POST",
            body: JSON.stringify({
                method: "getChatBotInfo",
                params: {
                    assistantID
                }
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if (response.ok) {
            // Success
            const responseBody = await response.json();

            return [ responseBody.payload.usage, responseBody.payload.limit ];
        } else {
            // Fail
            const responseBody = await response.json();
        
            if (responseBody.error && responseBody.error.message) {
                errorMessage = responseBody.error.message;   
            }

            console.log(errorMessage);

            return [];
        }
    }

    //create Chat Bot
    let loadCreateChatBot = false;
    async function createChatBot(username, password, authkey) {
        loadCreateChatBot = true;
        const response = await fetch(config.rpcUrl, {
            method: "POST",
            body: JSON.stringify({
                method: "createChatBot",
                params: {
                    username,
                    password,
                    authkey
                }
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if (response.ok) {
            // Success
            const responseBody = await response.json();
            errorCreateBotMessage = "";
            customChatBotExisted = true;
            customChatBotID = responseBody.payload.botInfo.id;

            console.log(responseBody.payload);

            location.reload();
        } else {    
            // Fail
            const responseBody = await response.json();
        
            if (responseBody.error && responseBody.error.message) {
                errorCreateBotMessage = responseBody.error.message;   
            }

            console.log(errorCreateBotMessage);
            

            // Lam gi day o day
        }

        loadCreateChatBot = false;
    }

    //Delete Chat Bot
    async function deleteChatBot() {
        let errorMessage = "An unknown error occurred.";

        console.log(customChatBotID);

        const response = await fetch(config.rpcUrl, {
            method: "POST",
            body: JSON.stringify({
                method: "deleteChatBot",
                params: {
                    username,
                    password,
                    authkey,
                    assistantID: customChatBotID
                }
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if (response.ok) {
            // Success
            const responseBody = await response.json();

            console.log(responseBody);

            location.reload();
        } else {
            // Fail
            const responseBody = await response.json();
        
            console.log(responseBody);

            if (responseBody.error && responseBody.error.message) {
                errorMessage = responseBody.error.message;   
            }

            console.log(errorMessage);

            // Lam gi day o day
        }
    }

    function formatAddress(address) {
			return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`;
		}
</script>




<div class="relative bg-gray-100 w-full">
    <div class="flex-col flex max-w-screen-md mx-auto gap-10 border border-x-2 px-4">
        <!--Nav bar-->
        <NavBar2/>
        
        <!--Account & Add button Container-->
        <div class="flex flex-col w-full gap-4 bg-white py-[20px] px-6 rounded-2xl shadow-lg border" in:fade={{ duration: 300 }}>
            <!--Account stuffs-->
            <div class="flex sm:flex-row flex-col justify-between items-center gap-2  text-base font-semibold border-b pb-2">
                <!--Account Container-->
                <div class="flex gap-6 items-center"> 
                    <span class="hidden sm:flex">
                        Account
                    </span>
                    <!---->
                    <div class="flex p-1 border-2 rounded-xl gap-4">
                        <!--Your Account Name / Wallet-->
                        <span class="ml-2">
                            {#if username.length > 16}
                                {formatAddress(username)}
                            {:else}
                                {username}
                            {/if}
                        </span>
                        <!--Verified status-->
                        {#if isAdmin === true}
                            <span class="font-normal text-xs bg-pink text-white py-0.5 px-1 rounded-lg mb-[1px]">
                                Admin
                            </span>
                        {:else if customBotLimit === 15000}
                            <button class="font-normal text-xs bg-linearPink text-white py-0.5 px-1 rounded-lg mb-[1px]" on:click={()=>{goto("/pricing")}}>
                                Advanced plan
                            </button>
                        {:else}
                            <button class="font-normal text-xs bg-gray-500 text-white py-0.5 px-1 rounded-lg mb-[1px]" on:click={()=>{goto("/pricing")}}>
                                Free plan
                            </button>
                        {/if}
                    </div>
                </div> 

                <button class="flex justify-center items-center font-semibold sm:w-fit w-[220px] sm:border-0 p-1 border rounded-lg font-normal sm:text-base text-xs sm:text-red-600 text-white sm:fill-red-500 hover:fill-black hover:text-black fill-white sm:bg-white bg-red-600"
                on:click={()=>{localStorage.username = ""; localStorage.password = ""; localStorage.authkey = ""; goto("../login")}}>
                    Log out
                    <svg class="sm:h-6 h-4 mx-2 fill-inherit inline-block" viewBox="0 0 490.3 490.3" xml:space="preserve">
                            <g>
                                <g>
                                    <path d="M0,121.05v248.2c0,34.2,27.9,62.1,62.1,62.1h200.6c34.2,0,62.1-27.9,62.1-62.1v-40.2c0-6.8-5.5-12.3-12.3-12.3
                                        s-12.3,5.5-12.3,12.3v40.2c0,20.7-16.9,37.6-37.6,37.6H62.1c-20.7,0-37.6-16.9-37.6-37.6v-248.2c0-20.7,16.9-37.6,37.6-37.6h200.6
                                        c20.7,0,37.6,16.9,37.6,37.6v40.2c0,6.8,5.5,12.3,12.3,12.3s12.3-5.5,12.3-12.3v-40.2c0-34.2-27.9-62.1-62.1-62.1H62.1
                                        C27.9,58.95,0,86.75,0,121.05z"/>
                                    <path d="M385.4,337.65c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6l83.9-83.9c4.8-4.8,4.8-12.5,0-17.3l-83.9-83.9
                                        c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l63,63H218.6c-6.8,0-12.3,5.5-12.3,12.3c0,6.8,5.5,12.3,12.3,12.3h229.8l-63,63
                                        C380.6,325.15,380.6,332.95,385.4,337.65z"/>
                                </g>
                            </g>
                    </svg>
                </button>
            </div>
            
            <!--Temporary limit each user create only 1 chatbot/admin can not create chatbot-->
            {#if customChatBotExisted === false && isAdmin === false}
                <!--Add bot Button-->
                <button class="flex items-center sm:self-start self-center gap-2 w-fit border border-pink rounded-xl shadow-md px-2 py-1 text-xl"
                    on:click={()=>{ setTimeout(() => createChatBot(username, password, authkey), 500) }}>
                    <!--Loading create chat bot when it is existed-->
                    {#if loadCreateChatBot === true}
                        <img alt="loading" class="sm:h-8 h-6" src="/gif/loading2.gif"/>
                    {:else}
                        <svg class="sm:h-8 h-6" viewBox="0 0 75 85" fill="none">
                            <circle cx="37.5" cy="46.5" r="37" fill="#E6007A" stroke="#9C9C9C"/>
                            <path d="M35.2841 64.5199V31.7074H40.8523V64.5199H35.2841ZM21.6619 50.8977V45.3295H54.4744V50.8977H21.6619Z" fill="white"/>
                        </svg>
                    {/if}    
                    <span class="pr-1 sm:text-base text-sm">
                        Create your custom chat bot
                    </span>
                </button>
            {:else}
                <!--Message when chat bot is existed-->
                {#if isAdmin}
                    <span class="text-sm sm:mx-0 mx-auto">Admin account can not create extra bot</span>
                {:else}
                    <span class="text-sm sm:mx-0 mx-auto">Currently for this MVP we only limit to create 1 custom bot</span>
                {/if}
            {/if}

            <!--Show error create bot message-->
            {#if errorCreateBotMessage !== ""}
                <span class="text-sm text-red-500">
                    {errorCreateBotMessage}
                </span>
            {/if}
        </div>
        <!--Render bot-->
        {#if fulfilled === true}
            <!--Check if user has created bot or not-->
            {#if customChatBotExisted === true && isAdmin === false}
                <!--Custom Bot-->
                <div class="flex flex-col w-full gap-4 bg-white py-[20px] px-6 rounded-2xl shadow-lg border" in:fade={{ duration: 300 }}>
                    <!--Your bot's Logo & Plan & Cap container-->
                    <div class="flex sm:flex-row flex-col gap-2 justify-between items-center">
                        <!--Your bot's  Logo Container-->
                        <div class="flex sm:flex-row flex-col gap-2 items-center"> 
                            <!--Your bot's Logo-->
                            <img class="h-[40px] inline-block" src="/customBot.svg"/>
                            <div class="flex gap-3">
                                <!--Your bot's name-->
                                <span class="text-xl font-semibold">
                                    Your custom bot
                                </span>
                                <!--Plan status-->
                                {#if customBotLimit === 15000}
                                    <button class=" h-fit  text-xs bg-linearPink text-white p-1 rounded-lg mb-[1px]" on:click={()=>{goto("/pricing")}}>
                                        Advanced plan
                                    </button>
                                {:else}
                                    <button class=" h-fit text-xs bg-gray-600 text-white p-1 rounded-lg mb-[1px]" on:click={()=>{goto("/pricing")}}>
                                        Free plan
                                    </button>
                                {/if}
                            </div>
                        </div> 
                        <!--Cap Container-->
                        <div class="flex flex-col gap-1 min-w-[200px] pl-[14px] text-sm">
                            <!--Used Cap-->
                            <div class="flex gap-2">
                                <span>Used:</span>
                                <!--Cap value example-->
                                <span class="text-gray-600">{customBotUsage}/{customBotLimit} response</span>
                            </div>
                            <!-- Cap per hour-->
                            <div class="flex gap-2">
                                <span>Cap per hour:</span>
                                <!--Cap per hour value example-->
                                <span class="text-gray-600">No</span>
                            </div>

                        </div>
                    </div>
                    <!--Your bot's  Description-->
                    <span class="md:text-sm text-xs border rounded-lg p-2">
                        This bot can be changed and customized by you. Any changes you make will affect projects integrating your custom bot.
                    </span>
                    <div class="flex md:flex-row flex-col mx-auto gap-2">
                        <!--Embed bot Button-->
                        <button class="max-w-[230px] sm:text-base text-sm border-2 rounded-xl shadow-md px-2 py-1 bg-pink text-white"
                        on:click={()=>{displayIntegrate = true; displayId = customChatBotID}}>
                            Embed on your website
                        </button>
                        <!--Training bot Button-->
                        <button class="max-w-[230px] sm:text-base text-sm min-w-[230px] border-2 rounded-xl shadow-md px-2 py-1"
                            on:click={() =>goto(`../custombot/${customChatBotID}`)}>
                            Training bot
                        </button>
                        <!--Delete bot Button-->
                        <button class="max-w-[230px] sm:text-base text-sm min-w-[230px] border-2 rounded-xl shadow-md px-2 py-1"
                        on:click={()=>{deleteChatBot()}}>
                            Delete bot
                        </button>
                    </div>
                </div>
            {/if}

                <!--Default AIDOT-->
                <div class="flex flex-col w-full gap-4 bg-white py-[20px] px-6 rounded-2xl shadow-lg border" in:fade={{ duration: 300 }}>
                    <!--AIDOT Logo & Plan & Cap container-->
                    <div class="flex sm:flex-row flex-col gap-2 justify-between items-center">
                        <!--AIDOT Logo Container-->
                        <div class="flex gap-6 items-center"> 
                            <!--AI Dot Logo-->
                            <img class="h-[35px] inline-block" src="/logoAIDOT.svg"/>
                        </div> 
                        <!--Cap Container-->
                        <div class="flex flex-col gap-1 min-w-[200px] pl-[14px] text-sm">
                            <!--Used Cap-->
                            <div class="flex gap-2">
                                <span>Used:</span>
                                <!--Cap value example-->
                                <span class="text-gray-600">{initialBotUsage}/Unlimited</span>
                            </div>
                            <!-- Cap per hour-->
                            <div class="flex gap-2">
                                <span>Cap per hour:</span>
                                <!--Cap per hour value example-->
                                <span class="text-gray-600">No</span>
                            </div>

                        </div>
                    </div>
                    <!--AIDOT Description-->
                    <span class="md:text-sm text-xs border rounded-lg p-2">
                        This AIDOT bot integrates with all resources of the Polkadot ecosystem and is trained by administrators and experts within this ecosystem. 
                        Any changes you make will affect all projects embedding this AIDOT.
                        <span class="font-semibold">Only admins or verified accounts can contribute to or train this AIDOT.</span>
                    </span>
                    <div class="flex md:flex-row flex-col mx-auto gap-2">
                        <!--Embed bot Button-->
                        <button class="max-w-[200px] sm:text-base text-sm border-2 rounded-xl shadow-md px-2 py-1 bg-pink text-white"
                        on:click={()=>{displayIntegrate = true; displayId = initialBotId}}>
                            Embed on your website
                        </button>
                        <!--Training bot Button-->
                        <button
                        on:click={() =>goto(`../custombot/${initialBotId}`)}
                        class="max-w-[200px] sm:text-base text-sm min-w-[200px] border-2 rounded-xl shadow-md px-2 py-1">
                            Training bot
                        </button>
                    </div>
                </div>
        {:else}
            <!--Loading gif-->
            <div class="h-screen flex flex-col" in:fade={{ duration: 300 }}>
                <svg class="h-[200px] mx-auto" viewBox="0 0 2026 1646" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path id="pinkCircle" d="M529.476 1091.05C650.52 1343.49 953.285 1450.01 1205.72 1328.96C1458.16 1207.92 1564.67 905.152 1443.63 652.712C1322.59 400.273 1019.82 293.757 767.385 414.801C514.948 535.846 408.433 838.614 529.476 1091.05Z" fill="url(#paint0_linear_118_148)"/>
                    <path id="name" d="M792.395 1087.18H684.932L848.676 623.964H977.912L1141.42 1087.18H1033.96L915.147 729.817H911.441L792.395 1087.18ZM785.681 905.107H1039.52V981.556H785.681V905.107ZM1298.8 623.964V1087.18H1198.52V623.964H1298.8Z" fill="url(#paint1_linear_118_148)"/>
                    <path id="blackCircle1" d="M1666.92 1355.3C1705.25 1435.24 1801.12 1468.97 1881.06 1430.63C1961 1392.3 1994.73 1296.43 1956.4 1216.49C1918.07 1136.55 1822.19 1102.81 1742.26 1141.15C1662.32 1179.48 1628.59 1275.36 1666.92 1355.3Z" fill="url(#paint2_linear_118_148)"/>
                    <path id="blackCircle2" d="M1499.54 383.319C1537.87 463.259 1633.75 496.989 1713.68 458.658C1793.62 420.327 1827.35 324.449 1789.02 244.509C1750.69 164.569 1654.82 130.838 1574.88 169.169C1494.94 207.501 1461.21 303.379 1499.54 383.319Z" fill="url(#paint3_linear_118_148)"/>
                    <path id="blackCircle3" d="M34.4646 649.22C53.1097 688.105 99.7465 704.513 138.631 685.867C177.515 667.222 193.922 620.585 175.277 581.7C156.632 542.815 109.996 526.408 71.1111 545.053C32.2268 563.698 15.8196 610.336 34.4646 649.22Z" fill="url(#paint4_linear_118_148)"/>
                    <path id="blackCircle4" d="M464.976 1434.34C482.396 1470.67 525.968 1485.99 562.297 1468.57C598.626 1451.15 613.955 1407.58 596.536 1371.25C579.116 1334.92 535.543 1319.59 499.214 1337.01C462.885 1354.43 447.556 1398.01 464.976 1434.34Z" fill="url(#paint5_linear_118_148)"/>
                    <path id="blackCircle5" d="M588.612 219.539C618.289 281.431 692.521 307.547 754.413 277.87C816.305 248.192 842.421 173.96 812.743 112.067C783.066 50.174 708.834 24.0584 646.942 53.736C585.05 83.4135 558.935 157.646 588.612 219.539Z" fill="url(#paint6_linear_118_148)"/>
                    <path id="blackCircle6" d="M1090.57 1588.55C1105.78 1620.28 1143.84 1633.67 1175.57 1618.45C1207.29 1603.24 1220.68 1565.19 1205.47 1533.46C1190.25 1501.73 1152.2 1488.34 1120.47 1503.55C1088.75 1518.77 1075.36 1556.82 1090.57 1588.55Z" fill="url(#paint7_linear_118_148)"/>
                    <defs>
                    <linearGradient id="paint0_linear_118_148" x1="1443.63" y1="652.712" x2="529.473" y2="1091.05" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#E3B6FF"/>
                    <stop offset="1" stop-color="#E6007A"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_118_148" x1="991.867" y1="623.964" x2="991.867" y2="1087.18" gradientUnits="userSpaceOnUse">
                    <stop stop-color="white"/>
                    <stop offset="1" stop-color="#E3A5F3"/>
                    </linearGradient>
                    <linearGradient id="paint2_linear_118_148" x1="1956.4" y1="1216.48" x2="1666.92" y2="1355.29" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#B1B1B1"/>
                    <stop offset="1"/>
                    </linearGradient>
                    <linearGradient id="paint3_linear_118_148" x1="1789.02" y1="244.509" x2="1499.54" y2="383.316" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#B1B1B1"/>
                    <stop offset="1"/>
                    </linearGradient>
                    <linearGradient id="paint4_linear_118_148" x1="175.278" y1="581.7" x2="34.4651" y2="649.219" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#B1B1B1"/>
                    <stop offset="1"/>
                    </linearGradient>
                    <linearGradient id="paint5_linear_118_148" x1="596.536" y1="1371.25" x2="464.977" y2="1434.33" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#B1B1B1"/>
                    <stop offset="1"/>
                    </linearGradient>
                    <linearGradient id="paint6_linear_118_148" x1="812.743" y1="112.067" x2="588.611" y2="219.537" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#B1B1B1"/>
                    <stop offset="1"/>
                    </linearGradient>
                    <linearGradient id="paint7_linear_118_148" x1="1205.47" y1="1533.46" x2="1090.57" y2="1588.55" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#B1B1B1"/>
                    <stop offset="1"/>
                    </linearGradient>
                    </defs>
                
                    <style type="text/css">
                        @keyframes shrink {
                            0%, 100% { transform: scale(1); }
                            50% { transform: scale(0.95); }
                        }
                
                        #circlePink, #name {
                            animation: shrink 2s infinite alternate ease-in-out;
                        }
                
                        @keyframes moveAround1 {
                            0%, 100% { transform: translate(0, 0); }
                            25% { transform: translate(-2%, 0); } 50% { transform: translate(-2%, -2%); } 75% { transform: translate(0, -2%); }
                        }
                
                        #blackCircle1 {
                            animation: moveAround1 2s infinite alternate ease-in-out;
                        }
                        
                        @keyframes moveAround2 {
                            0%, 100% { transform: translate(0, 0); }
                            25% { transform: translate(3%, 0); } 50% { transform: translate(-2%, -2%); } 75% { transform: translate(0, -2%); }
                        }
                
                        #blackCircle2 {
                            animation: moveAround2 2s infinite alternate ease-in-out;
                        }
                        
                        @keyframes moveAround3 {
                            0%, 100% { transform: translate(0, 0); }
                            25% { transform: translate(6%, 6%); } 50% { transform: translate(0%, 0%); } 75% { transform: translate(0, 5%); }
                        }
                
                        #blackCircle3 {
                            animation: moveAround3 2s infinite alternate ease-in-out;
                        }
                        
                        @keyframes moveAround4 {
                            0%, 100% { transform: translate(0, 0); }
                            25% { transform: translate(0, -5%); } 50% { transform: translate(5%, -5%); } 75% { transform: translate(5%, 0); }
                        }
                
                        #blackCircle4 {
                            animation: moveAround4 2s infinite alternate ease-in-out;
                        }
                        
                        @keyframes moveAround5 {
                            0%, 100% { transform: translate(0, 0); }
                            25% { transform: translate(-2%, -2%); } 50% { transform: translate(0, -2%); } 75% { transform: translate(0, 0); }
                        }
                
                        #blackCircle5 {
                            animation: moveAround5 2s infinite alternate ease-in-out;
                        }
                        
                        @keyframes moveAround6 {
                            0%, 100% { transform: translate(0, 0); }
                            25% { transform: translate(5%, -5%); } 50% { transform: translate(0, -4%); } 75% { transform: translate(0, 0); }
                        }
                
                        #blackCircle6 {
                            animation: moveAround6 2s infinite alternate ease-in-out;
                        }
                        </style>
                </svg>
                <span class="text-3xl italic font-semibold mx-auto mt-4">
                    Loading...
                </span>

            </div>
        {/if}      
        <Footer class="max-w-screen-md mx-auto"/>
        
        <!--Display integrate to website-->
        {#if displayIntegrate === true}
            <div class="absolute flex flex-col inset-0 bg-black bg-opacity-50 z-30 " in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
                <div class="flex flex-col mx-auto mt-[200px] bg-white gap-4 rounded-lg border shadow-md px-[30px] pb-[50px] pt-[10px] ">
                    <!--Close button-->
                    <button class="self-end"
                    on:click={()=>{displayIntegrate = false}}>
                        <img class=" h-[20px]" src="/close.svg"/>
                    </button>
                    <div class="flex items-center gap-1">
                        <img class="h-[18px] inline-block" src="/pointer.svg"/>
                        <span class="md:text-base text-sm">
                            Copy the code below and insert it into the <span class="font-semibold">&lt;head&gt; </span> section of your website's HTML
                        </span>
                    </div>   
                    <code class="flex justify-center text-pink w-full mx-auto bg-gray-800 rounded-md p-2 text-xs">
                        {getCode(displayId)}
                    </code>
                </div>
            </div>
        {/if} 
    </div>
    
</div>

