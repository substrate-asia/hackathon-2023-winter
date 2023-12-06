import React from "react";
import Ship from "./Ship";
import useGetAllShipents from "@/hooks/useGetAllShipents";

const MyShips = () => {
  const { shipsIds } = useGetAllShipents();
  return (
    <div className="flex flex-col gap-4">
      <p className="text-3xl font-black">My ships</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shipsIds && shipsIds.map((s) => <Ship key={s} ship={s} />)}
      </div>
    </div>
  );
};

export default MyShips;
