import { Router } from "express";
import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";

const router = Router();

const setupPolkadotApi = async () => {
    const wsProvider = new WsProvider("wss://rpc.shibuya.astar.network");
    const api = await ApiPromise.create({ provider: wsProvider });
    return api;
};

router.post("/", async (req, res) => {
    try {
        const { targetAddress, amount, address } = req.body;

        const api = await setupPolkadotApi();

        const injector = await api.tx.balances
            .transfer(targetAddress, amount)
            .signAndSend(address, (status) => {
                if (status.isInBlock) {
                    console.log(
                        `Completed at block hash #${status.asInBlock.toString()}`
                    );
                } else {
                    console.log(`Current status: ${status.type}`);
                }
            });

        res.json({ success: true, injector });
    } catch (error) {
        console.error("Error transferring funds:", error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
});

export default router;
