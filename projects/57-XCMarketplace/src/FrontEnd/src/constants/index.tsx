import '../types'

export const dummyAsset: MultiAsset = {
    id: {
        Concrete : {
            parents: 0, // Will always be 0 in our case
            interior: { 
                // For NFT Pallet
                X3: [{Parachain: 1000}, {PalletInstance: 60}, {GeneralIndex:0}]
            }
        }
    },
    fun: {
        NonFungible: 0
    }
}

export const dummyMessage: XCMMessage = 
{
    V2: [
        {
            ExchangeAsset: {
                give: {
                    definite: [dummyAsset]
                },
                receive :  [dummyAsset],
                maximal: false
            }
        }
    ],
}

export const dummyWeight: XCMWeight = {
    refTime: 10000,
    proofSize: 1000
}