## How to set up

This is a step-by-step tutorial on how to set up AIDot locally on your computer

### The server (which contains the core AI)

1. Install dependencies
	```
	npm install
	```

2. Compile source
	```
	npx tsc
	```

3. Get your API key
	If you already have an OpenAI API key or already know how to get an OpenAI API key, skip this step.

	Log in to OpenAI and hop over to [platform.openai.com/api-keys](https://platform.openai.com/api-keys).

	You should be able to see something like this:
	![Failed to load image](../assets/api-window.png)

	Click "Create new secret key" and you will have your API key.

4. Configure your API key in AIDot
	Open your console.

	If you are on Linux, type:
	```sh
	OPENAI_API_KEY=Enter your API key here
	```

	If you are on Windows, type:
	```bat
	set OPENAI_API_KEY=Enter your API key here
	```

5. Run AIDot
	```
	node .
	```

And you are good to go!


### The front-end

1. Install dependencies
	```
	npm install
	```

2. Serve front-end in localhost
	```
	npx run dev
	```


### Load more initial resources to train AI

You can load more resources to train the bot by specifying the file paths in `aidot.config.js`.

You can also train the bot by using the `modifyChatBot` API (and potentially `getChatBotInfo`) from our server. [Check the API docs here](./rpc.md). But the difference is that this loading from `aidot.config.js` will apply on every new bot created.


### The admin account

By default, the server is initiated with an admin account. You can configure the username and password in `aidot.config.js`.


### APIs

To interact with an AIDot server and use its APIs, [check the documentations about our RPC APIs](./rpc.md).
