type NFTInstance = Uint8Array;
type Action = Buy | Sell | Swap;

interface Buy {
    name: string,
    chain: Chain,
    desiredNftInstance: NFTInstance,
    desiredNftLocation: XCMLocation
}

interface Sell {
    name: string,
    chain: Chain,
    soldNftInstance: NFTInstance,
    soldNftLocation: XCMLocation,
    amountProposed: BigInt
}

interface Swap {
    name: string,
    chain: Chain,
    offeredNftInstance: NFTInstance,
    offeredNftLocation: XCMLocation,
    desiredNftInstance: NFTInstance,
    desiredNftLocation: XCMLocation
}

// TODO DEFINE HOW TO HANDLE XCM
type XCMLocation = {
    parents: number, // Will always be 0 in our case
    interior: { 
        // For NFT Pallet
        X3: [{Parachain: number}, {PalletInstance: number}, {GeneralIndex:number}]
        // | 
        // For EVM Pallet
        // [{Parachain: number}, {PalletInstance: number}, {GeneralIndex:number}]
    }
}

type AssetId = {
    Concrete: XCMLocation
}

type Fungibility = Fungible | NonFungible

type Fungible = {
    Fungible: number
}

type NonFungible = {
    NonFungible: number
}

type MultiAsset = {
    id: AssetId,
    fun: Fungibility
}
type XCMMessage = {
    V2: [
        {
            ExchangeAsset: {
                give: {
                    definite: Array<MultiAsset>
                }
                receive :  Array<MultiAsset>,
                maximal: boolean
            }
        }
    ]
}
type XCMWeight = {
    refTime: number,
    proofSize: number
}

interface Chain {
    name: string,
    webSocketUrl: string
} 

