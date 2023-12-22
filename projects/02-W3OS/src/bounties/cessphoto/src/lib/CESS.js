let URI="";

const test={
    folder:()=>{
        /**************************************************/
        /******************** Overview ********************/
        /**************************************************/
        // space.userOwnedSpace(accountId32).then((res)=>{
        //     console.log(res);
        // })

        const { Bucket,Space, InitAPI, Common,File,testnetConfig,wellKnownAcct } = require("cess-js-sdk");
        const mnemonic ="denial empower wear venue distance leopard lamp source off other twelve permit";
        const accountId32 = "cXh5StobuVP4B7mGH9xn8dSsDtXks4qLAou8ZdkZ6DbB6zzxe";
        InitAPI().then(({ api, keyring })=>{
            const space = new Space(api, keyring, true);
            const oss = new Bucket(api, keyring, true);
            const common = new Common(api, keyring, true);
            /**************************************************/
            /******************* Bucket APIs ******************/
            /**************************************************/
            // oss.queryBucketList(accountId32).then((res)=>{
            //     console.log(res);
            // });

            const folder="folder_test_file";
            oss.createBucket(mnemonic, accountId32, folder).then((res)=>{
                console.log(res);
                oss.queryBucketList(accountId32).then((res)=>{
                    console.log(res);
                });
            }).catch((err)=>{
                console.log(err);
            })

            // oss.queryBucketInfo(accountId32, folder).then((res)=>{
            //     console.log(res);
            // }).catch((err)=>{
            //     console.log(err);
            // })
            
            // oss.deleteBucket(mnemonic, accountId32, folder).then((res)=>{
            //     console.log(res);
            // }).catch((err)=>{
            //     console.log(err);
            // })
        });
    },
    file:()=>{
        /**************************************************/
        /******************* Files APIs *******************/
        /**************************************************/
        const { InitAPI,Authorize,Bucket,File,testnetConfig,wellKnownAcct } = require("cess-js-sdk");
        const { mnemonic, addr } = wellKnownAcct;
        const accountId32=addr;

        console.log(accountId32); 

        InitAPI(testnetConfig).then(({api, keyring })=>{
            // const oss = new Bucket(api, keyring, true);

            // const folder="folder_test_file";
            // oss.createBucket(mnemonic, accountId32, folder).then((res)=>{
            //     console.log(res);
            //     oss.queryBucketList(accountId32).then((res)=>{
            //         console.log(res);
            //     });
            // }).catch((err)=>{
            //     console.log(err);
            // })

            const folder="test";
            //const fss = new File(api, keyring,testnetConfig.gatewayURL, true);
            const fss = new File(api, keyring);
            const target="index.css";
            console.log(wellKnownAcct);
            console.log(testnetConfig);
            fss.uploadFile(mnemonic, accountId32,target, folder).then((res)=>{
                console.log(res);
            }).catch((err)=>{
                console.log(err);
            });

            // const fileHash="eb46b512283bdbe28108da479497d51b71ed8fc159f953bb9353338849b8f4b9";
            // fss.queryFileMetadata(fileHash).then((res)=>{
            //     console.log(res);
            // }).catch((err)=>{
            //     console.log(err);
            // });

            // const ass=new Authorize(api, keyring);
            // oss.authorize(mnemonic, gatewayAddr);
        }).catch(()=>{

        });
        
    }
};

const CESS={
    setGateway:(gateway_uri)=>{
        URI=gateway_uri;
    },
    overview:(pair)=>{
        test.file();
    },

    //list images from folder
    list:(folder,page,pair)=>{

    },

    //get the target file by hash
    view:(hash,pair)=>{

    },

    //upload new image file to bucket
    upload:(folder,fa,pair)=>{

    },

    //bucket management
    bucket:{
        //create a bucket as folder
        create:(folder,pair)=>{

        },
        detail:(folder,pair)=>{

        },
        delete:(folder,pair)=>{

        }
    }
}

export default CESS;