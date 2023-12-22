# Web3.0 Operation System based on Anchor Network

## Overview

- W3OS is based on the Anchor Network, so all data can be stored on the network, even the OS itself and private data. 

- Even without any coins, you can benefit from Web3.0. The Web3.0 account can be treated as a mobile number - you can get in touch with another Web3.0 user without more information than the SS58 account.

- The complex blockchain world can be managed on W3OS, no need to visit so many websites again. All the DApps can be deployed on the Anchor Network which is more secure than CDNs and private servers.  

- W3OS is pretty easy for users who have never joined Web3.0 and are not familiar with Web3.0 tools. It is easy to join the Web3.0 world even for total newcomers.

## Technical Details and Functions  

### Technical Details

- W3OS Frontend is based on React
  1. Account: Usage of @polkadot/keyring  
  2. Payment: Usage of @polkadot/api
  3. Contact: Encrypted local storage 
  4. Talking: Encrypted local storage, IndexedDB
  5. DApps: Usage of EasyPolka, usage of Anchor Network

- IMGC (Instant Messaging & Group Chat) service is based on NodeJS
  1. Instant Messaging: Websocket 
  2. Group Chat: Websocket
  3. Payment Verification: Usage of @polkadot/api
  
- Full on-chain deployment is based on the Anchor Network. Test network here: [wss://dev2.metanchor.net](wss://dev2.metanchor.net)

### Basic Functions  

- W3OS treats basic functions as DApps that you can find on the screen

- As a Web3.0 OS for users, basic functions are included in the **W3OS** project:

  1. Payment - a basic function but you need to have some coins
  2. Contact - you can add friends just by their SS58 account, no coins needed
  3. Talking - IMing with friends and creating groups to chat are important parts of W3OS
  4. Market - you can check prices and will be able to buy/exchange in the future

### DApps Deployment  

- W3OS treats DApps on the Anchor Network as isolated applications that can be docked to the screen by their Anchor Name. When you input the name, W3OS will check the Anchor Network and create an icon. Supports different Anchor types which W3OS will handle accordingly.
  
- Loader (from [EasyPolka](https://github.com/ff13dfly/EasyPolka)) can load DApps following the [Easy Protocol](https://github.com/ff13dfly/EasyPolka/tree/main/protocol). It's just a single HTML file deployable to any HTTP server. Can even run locally.
  
- Converter (from [EasyPolka](https://github.com/ff13dfly/EasyPolka)) tools to deploy normal Web3 UIs on the Anchor network. Tried many packages and improved a lot.  


### Secure APIs [Not done yet]

- Normally we get JS SDKs from project websites by downloading or as NPM packages. But it's hard to find if the SDK is hacked/modified. W3OS solves this by putting SDK code on-chain - loadable like NPM but more secure than websites/CDNs.
  
- As the APIs are trustable, W3OS won't load all SDKs at start but gets the code from Anchor Network when DApps try to run it.

## Functions  

### Account  

- New Account function. Create accounts with default Polkadot Mnemonic, encrypt account JSON locally. Easy login by selecting file and entering password.  

### Talking (IMGC)  

- Improves UX by auto-reconnecting on network issues  

#### Instant Messaging

- Basic W3OS function - click contacts to chat immediately. Unread message counts shown on avatars.
  
- Can chat to any SS58 account, strangers are listed separately from friends.

#### Group Chat  

- Create group by selecting members from contacts - can add forgotten people later.
  
- Chat by typing messages which get sent to all online group members. Offline messages held by server.
  
- Change group name - members get notified automatically.
  
- Change members - IMGC service handles notifications.  

- Transfer group manager role.

- Any member can leave voluntarily - others notified.  

- Manager can destroy group, removing data.

#### Payment Verification  

- SS58 accounts can be spoofed so verify via payment - IMGC requests specific payment then confirms transaction.
  
- Details stored on Anchor Network, services identify verified accounts. (Not implemented yet)

### Payment  

- Contacts have a "Pay to" button to send coins and see transaction history (not in official portals). 

- Verification payments also recorded.

### Contact  

- Add by SS58 address - [https://robohash.org](https://robohash.org) used for default avatars.

- Strangers messaging you get listed separately - can add them.

- Remove contacts in edit mode.

- Set custom names for contacts.
  
### Trend

- Major coin prices from [https://coincap.io/](https://coincap.io/) - entry point to future market functions.

### DApps  

- Input Anchor Names like `home`, `acala`, `playground` to load DApps.

## Code  

- W3OS Github: [https://github.com/ff13dfly/W3OS](https://github.com/ff13dfly/W3OS)
  
- IMGC service: [https://github.com/ff13dfly/W3OS/tree/main/service](https://github.com/ff13dfly/W3OS/tree/main/service)

## Resources

- Polkadot/Substrate  
- Anchor Network
- Easy Protocol
