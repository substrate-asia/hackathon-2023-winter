import CarrierId from "@/components/carrier/CarrierId/CarrierId";
import MyShipments from "@/components/carrier/MyShips/MyShipments";
import OpenToShip from "@/components/carrier/OpenToShip/OpenToShip";
import useGeolocation from "@/hooks/useGeolocation";
import React, { useState } from "react";

const Carrier = () => {
  const [activeSection, setActiveSection] = useState("myShips");

  const { userCoordinates } = useGeolocation();

  return (
    <div className="flex flex-col gap-6 font-medium relative">
      <div className="flex relative">
        <div className="flex gap-2 w-fit">
          <button
            className={
              activeSection == "myShips"
                ? "bg-schemes-light-primary text-schemes-light-onPrimary hover:bg-coreColors-primary rounded-full py-2 px-4"
                : "py-2 px-4 rounded-full hover:bg-coreColors-secondary hover:text-schemes-light-onSecondary transition duration-200"
            }
            onClick={() => {
              setActiveSection("myShips");
            }}
          >
            My ships
          </button>
          <button
            className={
              activeSection == "open"
                ? "bg-schemes-light-primary text-schemes-light-onPrimary hover:bg-coreColors-primary rounded-full py-2 px-4"
                : "py-2 px-4 rounded-full hover:bg-coreColors-secondary hover:text-schemes-light-onSecondary transition duration-200"
            }
            onClick={() => {
              setActiveSection("open");
            }}
          >
            Open to ship
          </button>
        </div>
        <CarrierId />
      </div>
      <div>
        {activeSection == "myShips" && userCoordinates !== null && (
          <MyShipments userCoordinates={userCoordinates} />
        )}
        {activeSection == "open" && userCoordinates !== null && (
          <OpenToShip userCoordinates={userCoordinates} />
        )}
      </div>
    </div>
  );
};

export default Carrier;
