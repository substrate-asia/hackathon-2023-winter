<script>
    import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
    import { config } from '$lib/config.js';
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
</script>
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
                <div class="flex justify-center items-center text-white w-[330px]  shadow-lg bg-black  rounded-lg">
                    <!--Account Address-->
                    <button class="mr-1 font-semibold border rounded-lg px-1 my-2 ml-2 text-lg " 
                    on:click={()=>{isShowLoginWithAccount = !isShowLoginWithAccount}}>
                        Sign in with Account & Password
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

                            goto("../control");
                        } else {
                            isLogin = false;
                        }
                    }} class=" bg-pink hover:bg-black py-1 w-fit rounded-lg px-4 mb-2 mt-4 self-center">
                        <span class="text-white text-lg font-semibold">Sign in</span>
                    </button>

                {/if}

                
                <span class="text-xl my-1">or</span>

                <div class="flex justify-center items-center text-white w-[330px]  shadow-lg bg-pink  rounded-lg mt-6">
                    <button class="mr-1 font-semibold border rounded-lg px-1 my-2 ml-2 text-lg " on:click={()=>{showRegister =!showRegister }}>
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

                        goto("../control");
                    }
                }} class=" bg-pink hover:bg-black py-1 w-fit rounded-lg px-4 mb-2 mt-4 self-center">
                    <span class="text-white text-lg font-semibold">Register</span>
                </button>

            {/if}
            

            </div>
            <Footer/>	
        </div>
    </div>
