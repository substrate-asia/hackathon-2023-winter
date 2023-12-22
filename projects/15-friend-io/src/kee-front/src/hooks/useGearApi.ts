import { useState, useEffect } from "react";
import { GearApi } from "@gear-js/api";

const GEAR_TEST_RPC = "wss://testnet.vara-network.io";
// const GEAR_TEST_RPC = "ws://localhost:9944";

export default function useGearApi() {
  const [gearApi, setGearApi] = useState<GearApi>();

  useEffect(() => {
    // Your code to initialize the gearApi object goes here
    const initializeGearApi = async () => {
      try {
        const gearApi = await GearApi.create({
          providerAddress: GEAR_TEST_RPC
        });
        setGearApi(gearApi);
        console.log("GearApi initialized");
      } catch (err) {
        console.error("Failed to initialize gearApi");
        console.error(err);
      }
    };

    initializeGearApi();
  }, []);

  return { gearApi };
}
