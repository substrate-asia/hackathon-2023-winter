<script>
    import { page } from '$app/stores';
    import { fade } from 'svelte/transition';
    import { config } from '$lib/config.js';
    let loadWidget = true;

    const token = $page.url.pathname.split("/");
    const assistantID = token.at(-1);
    
    let question = "";
    let messageList = [];
    let latestMessageID = "";
    let fulfilled = false;
    let latestMessageIndex = 0;
    let questionStatus = "none";

    let threadID = "";
    let turn = 1;

    async function handleThread() {
        if (turn % 3 === 0) {
            await createThread();
        }

        console.log("New thread:", threadID);

        turn++;
    }

    async function createThread() {
        let errorMessage = "An unknown error occurred.";

        const response = await fetch(config.rpcUrl, {
            method: "POST",
            body: JSON.stringify({
                method: "createChatThread",
                params: {}        
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if (response.ok) {
            // Success
            const responseBody = await response.json();
            
            threadID = responseBody.payload.thread.id;
        } else {
            // Fail
            const responseBody = await response.json();
        
            if (responseBody.error && responseBody.error.message) {
                errorMessage = responseBody.error.message;   
            }

            throw new Error(errorMessage);
        }
    }

    // Create new thread and get message ID
    (async () => {
        await createThread();

        const response = await fetch(config.rpcUrl, {
            method: "POST",
            body: JSON.stringify({
                method: "getMessages",
                params: {
                    threadID,
                    assistantID
                }        
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const responseBody = await response.json();

            if (responseBody.payload.messages.length !== 0) {
                const message = responseBody.payload.messages[0];

                latestMessageID = message.id;

                console.log("Fulfilled", message);
            }

            await getChatBotInfo();

            fulfilled = true;

            console.log(threadID);
        } else {
            throw new Error("Can not fetch latest message ID.");
        }
    })();

    let botInfo;
    let name = "";
    let recommendations = [];

    // Get chat bot info
    let getChatBotInfoErrorMessage = "";
    async function getChatBotInfo() {
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

            botInfo = responseBody.payload.botInfo;
            name = botInfo.name;
            recommendations = responseBody.payload.recommendations;
        } else {
            // Fail
            const responseBody = await response.json();
        
            if (responseBody.error && responseBody.error.message) {
                getChatBotInfoErrorMessage = responseBody.error.message;   
            }

            console.log(getChatBotInfoErrorMessage);
            // Lam gi day o day
        }
        loadWidget = false;
    }

    //Send message
    async function sendMessage() {
        //Stop runing neu cai send message khac dang chay
        if (questionStatus === "loading") return;

        questionStatus = "loading";
        messageList.push({
            type: "user",
            message: question
        });

        messageList = messageList;

        let errorMessage = "An unknown error occurred.";

        const response = await fetch(config.rpcUrl, {
            method: "POST",
            body: JSON.stringify({
                method: "sendMessage",
                params: {
                    threadID,
                    assistantID,
                    question
                }        
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        question = "";
        
        if (response.ok) {
            // Success
            // const responseBody = await response.json();
            // await new Promise(resolve => setTimeout(resolve, 2000));
            await getLatestMessage();
        } else {
            // Fail
            const responseBody = await response.json();
        
            if (responseBody.error && responseBody.error.message) {
                errorMessage = responseBody.error.message;   
            }
            questionStatus = "fail";
            console.log(errorMessage);

            // Lam gi day o day
        }
    }


    //get Latest Message
    let errorGetMessage ="";
    async function getLatestMessage() {
        questionStatus = "waiting";
        const response = await fetch(config.rpcUrl, {
            method: "POST",
            body: JSON.stringify({
                method: "getMessages",
                params: {
                    threadID,
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
            
            const message = responseBody.payload.messages[0];

            // Check xem lieu co message nao ton tai khong
            if (!message) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                await getLatestMessage();
                return;
            }

            // Check xem cai message gan nhat co phai cai nay khong thi push vao
            if (latestMessageID !== message.id) {
                console.log("a", message);

                latestMessageID = message.id;

                messageList.push({ 
                    type: "bot",
                    message: message.content[0].text.value
                });

                messageList = messageList;

                latestMessageIndex = messageList.length - 1;

                if (message.content[0].text.value === "") {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await getLatestMessage();
                    return;
                }

                await handleThread();

                questionStatus = "done";
            // Neu message moi nhat cua minh la message moi nhat cua bot nma truoc day no bi rong
            } else if (message.content[0].text.value !== "") {
                // Cai nay dung de handle khi minh da push message moi nhat vao list nhung ma chua co content
                if (messageList[latestMessageIndex].message === "") {
                    console.log("b", message);

                    messageList[latestMessageIndex].message = message.content[0].text.value;
                    messageList = messageList;

                    await handleThread();

                    questionStatus = "done";
                // Cai nay hoan toan khong lien quan, no dung de handle truong hop openai chua send mot cai message moi vao thread
                } else {
                    console.log("loop d");

                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await getLatestMessage();
                }
            // Cai loop nay dung de handle truong hop ma message cua openai send bi rong
            } else {
                console.log("loop c");

                await new Promise(resolve => setTimeout(resolve, 1000));
                await getLatestMessage();
            } /*else {
                console.log("loop");

                await new Promise(resolve => setTimeout(resolve, 1000));
                await getLatestMessage();
            }*/
        } else {
            // Fail
            const responseBody = await response.json();
        
            if (responseBody.error && responseBody.error.message) {
                errorGetMessage = responseBody.error.message; 
            }

            console.log(errorGetMessage);
            questionStatus = "fail";
        }
    }




    //Front-end stuffs
    let isShowWidget = "default";
    let isShowChat = false;

    //Example
</script>

<div class="fixed bottom-0 right-0 flex flex-col z-2509 mr-4">
    {#if isShowChat === true } 
        <!--Pop Up Chat-->
        <div class="max-w-[440px] max-h-[588px] bg-white flex flex-col border rounded-lg shadow-lg" in:fade={{ duration: 300 }} out:fade={{ duration: 300 }} >
            <!--Header-->
            <div class="flex justify-between items-center mt-2 mx-2 pb-2 border-b-2">
                <div class="flex items-center gap-1">
                    {#if name !== "AIDot"}
                        <img class="h-[25px] inline-block" src="/customBot.svg"/>
                        <span class="text-lg font-semibold">
                            {name}
                        </span>
                    {:else}
                        <img class="h-[25px] inline-block" src="/logo.svg"/>
                    {/if}
                </div>
                <div class="flex gap-4 mx-2">
                    <!--Reload Button-->
                    <button disabled={questionStatus === "loading" || questionStatus ==="waiting"} on:click={()=>{messageList = []}}>
                        <svg class="h-[18px] 
                        {questionStatus === "loading" || questionStatus ==="waiting"?"fill-gray-300":"hover:fill-pink fill-black"} " viewBox="0 0 489.711 489.711" xml:space="preserve">
                            <g class="stroke-inherit fill-inherit">
                                <g class="stroke-inherit fill-inherit">
                                    <path class="stroke-inherit	fill-inherit" d="M112.156,97.111c72.3-65.4,180.5-66.4,253.8-6.7l-58.1,2.2c-7.5,0.3-13.3,6.5-13,14c0.3,7.3,6.3,13,13.5,13
                                        c0.2,0,0.3,0,0.5,0l89.2-3.3c7.3-0.3,13-6.2,13-13.5v-1c0-0.2,0-0.3,0-0.5v-0.1l0,0l-3.3-88.2c-0.3-7.5-6.6-13.3-14-13
                                        c-7.5,0.3-13.3,6.5-13,14l2.1,55.3c-36.3-29.7-81-46.9-128.8-49.3c-59.2-3-116.1,17.3-160,57.1c-60.4,54.7-86,137.9-66.8,217.1
                                        c1.5,6.2,7,10.3,13.1,10.3c1.1,0,2.1-0.1,3.2-0.4c7.2-1.8,11.7-9.1,9.9-16.3C36.656,218.211,59.056,145.111,112.156,97.111z"/>
                                    <path class="stroke-inherit	fill-inherit" d="M462.456,195.511c-1.8-7.2-9.1-11.7-16.3-9.9c-7.2,1.8-11.7,9.1-9.9,16.3c16.9,69.6-5.6,142.7-58.7,190.7
                                        c-37.3,33.7-84.1,50.3-130.7,50.3c-44.5,0-88.9-15.1-124.7-44.9l58.8-5.3c7.4-0.7,12.9-7.2,12.2-14.7s-7.2-12.9-14.7-12.2l-88.9,8
                                        c-7.4,0.7-12.9,7.2-12.2,14.7l8,88.9c0.6,7,6.5,12.3,13.4,12.3c0.4,0,0.8,0,1.2-0.1c7.4-0.7,12.9-7.2,12.2-14.7l-4.8-54.1
                                        c36.3,29.4,80.8,46.5,128.3,48.9c3.8,0.2,7.6,0.3,11.3,0.3c55.1,0,107.5-20.2,148.7-57.4
                                        C456.056,357.911,481.656,274.811,462.456,195.511z"/>
                                </g >
                            </g>
                        </svg>
                    </button>
                    <!--Close Button-->
                    <button
                        on:click ={()=>{isShowChat = false; isShowWidget = "default"; window.parent.postMessage("aidot-hide", "*");}}>
                        <svg class="h-[18px] hover:stroke-pink stroke-black" viewBox="-0.5 0 25 25" >
                            <path class="stroke-inherit	" d="M3 21.32L21 3.32001" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path class="stroke-inherit	" d="M3 3.32001L21 21.32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!--Content Container-->
            <div class="flex flex-col overflow-auto h-[420px] border-b mx-2 my-3 gap-2 min-w-[350px]">
                {#each messageList as message}
                    
                    <!--response-->
                    {#if message.type === "bot" && message.message !== ""} 
                        <div class="w-fit max-w-[333px] break-words border p-2 rounded-lg bg-gray-100" in:fade={{ duration: 300 }} > 
                            {message.message}
                        </div>
                    {/if}
                    
                    <!--question-->
                    {#if message.type === "user"}
                        <div class="self-end max-w-[333px] break-words text-white border mr-3 p-2 rounded-lg bg-linearPink" >
                            {message.message}
                        </div>
                    {/if}
                {/each}
                <!--Error-->
                     {#if getChatBotInfoErrorMessage !== ""}
                        <span class="text-red-500 text-lg">{getChatBotInfoErrorMessage}</span>
                     {/if}
                    {#if errorGetMessage !== ""}
                        <span class="text-red-500 text-lg">{errorGetMessage}</span>
                    {/if}
                <!--loading response-->
                {#if questionStatus === "waiting" }
                    <div class="w-fit break-words p-2 rounded-lg" in:fade={{ duration: 300 }} >
                        <img class="h-12" src ="/gif/messageLoad.gif"/>
                    </div>
                 {/if}
            </div>

            <!--Sample question-->
            <div class="flex mb-2 mt-2 overflow-x-auto ml-2 gap-2">
                {#each recommendations as recommendation}
                    {#if recommendation !== ""}
                        <button class=" px-2 py-1 mb-1 text-sm whitespace-nowrap rounded-md bg-gray-200"
                            on:click={()=>{ question = recommendation; setTimeout(sendMessage, 500) }}>
                            {recommendation}
                        </button>
                    {/if}
                {/each}
            </div>

            <!--User Input Container-->
            <div class="flex border rounded-lg shadow-lg mx-2 items-center mb-2">
                <!--User Input-->
                <input bind:value={question} class=" rounded-lg w-full h-[40px] pl-4 pr-2 " placeholder="Enter your question..."/>
                <!--Send button-->
                <button class="px-2 {question === "" || !fulfilled || questionStatus === "loading"? 'fill-gray-400':'hover:fill-black fill-pink'}" disabled={question === "" || !fulfilled || questionStatus === "loading"}
                on:click={()=> { setTimeout(sendMessage, 500) }}>
                    <svg  class="h-[22px] inline-block fill-inherit" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path class="fill-inherit" d="M21 9.5C21 8.38038 20 8 20 8L0 0L3.60352 8.56055L13 9.5L3.60352 10.4395L0 19L20 11C20 11 21 10.6196 21 9.5Z"/>
                        <defs>
                        <linearGradient id="paint0_linear_69_1471" x1="-0.00801604" y1="9.4921" x2="21.0129" y2="9.4921" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#E6007A"/>
                        <stop offset="1" stop-color="#9E00FF"/>
                        </linearGradient>
                        </defs>
                    </svg>
                </button>
            </div>


        </div>
    {/if } 

    <!--Widget button-->
    <!--Load widget button-->
    {#if loadWidget === true}
        <div class="p-1 self-end my-2">
            <img class="h-[70px] w-auto inline-block" alt ="widget button" src="/gif/loadWidget.gif"/>
        </div>
    {:else}
        <!--Default Widget button-->
        {#if isShowWidget === "default" } 
            <button class="self-end my-2 hover:bg-lightPink bg-opacity-50 rounded-full p-1" in:fade={{ duration: 300 }}  
                on:click ={() => {
                    isShowChat = true;
                    isShowWidget = "close";

                    window.parent.postMessage("aidot-show", "*");
                }}>
                <img class="h-[70px] w-auto inline-block" alt ="widget button" src="/widgetButton.png"/>
            </button>
        {/if } 

        <!--Close Widget button-->
        {#if isShowWidget === "close" } 
            <button class="self-end my-2 hover:bg-lightPink bg-opacity-50 rounded-full p-1" in:fade={{ duration: 300 }} 
                on:click ={() => {
                    isShowChat = false;
                    isShowWidget = "default";

                    window.parent.postMessage("aidot-hide", "*");
                }}>
                <img class="h-[70px] w-auto inline-block" alt ="widget button" src="/closeWidgetButton.svg"/>
            </button>
        {/if }
    {/if } 
</div>
