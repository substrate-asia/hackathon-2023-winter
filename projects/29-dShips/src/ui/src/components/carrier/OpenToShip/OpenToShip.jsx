import Ship from "./Ship";
import useIsVerifiedCarrier from "@/hooks/useIsVerifiedCarrier";
import useGetAllShipents from "@/hooks/useGetAllShipents";

const OpenToShip = ({ userCoordinates }) => {
  const { verified } = useIsVerifiedCarrier();
  const { shipsIds } = useGetAllShipents();

  return (
    <div className="flex flex-col gap-4">
      <p className="text-3xl font-black">Open to ships</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shipsIds &&
          userCoordinates !== null &&
          shipsIds.map((s) => (
            <Ship
              key={s}
              ship={s}
              userCoordinates={userCoordinates}
              verified={verified}
            />
          ))}
      </div>
    </div>
  );
};

export default OpenToShip;
