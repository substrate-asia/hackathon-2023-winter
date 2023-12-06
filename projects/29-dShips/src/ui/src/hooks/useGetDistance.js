/* eslint-disable */
import React, { useEffect, useState } from "react";
import axios from "axios";
import useGeolocation from "./useGeolocation";

const useGetDistance = (data) => {
  const { userCoordinates } = useGeolocation();

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const [fromCoordinates, setFromCoordinates] = useState(null);
  const [toCoordinates, setToCoordinates] = useState(null);
  const [shipmentDistance, setShipmentDistance] = useState(null);
  const [userToFromDistance, setUserToFromDistance] = useState(null);

  const getCoordinates = async (from, to) => {
    //FROM COORDINATES
    const fromAddress = from.split(" ");
    for (let i = 0; i < fromAddress.length; i++) {
      fromAddress[i] =
        fromAddress[i].charAt(0).toUpperCase() + fromAddress[i].slice(1);
    }
    const formatedFromAddress = fromAddress.join("%20");

    //TO COORDINATES
    const toAddress = to.split(" ");
    for (let i = 0; i < toAddress.length; i++) {
      toAddress[i] =
        toAddress[i].charAt(0).toUpperCase() + toAddress[i].slice(1);
    }
    const formatedToAddress = toAddress.join("%20");

    //API CALL
    try {
      const responseToAddress = await axios.get(
        "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
          formatedToAddress +
          ".json?access_token=" +
          token
      );

      const responseFromAddress = await axios.get(
        "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
          formatedFromAddress +
          ".json?access_token=" +
          token
      );

      //SET COORDINATES
      setFromCoordinates(responseFromAddress.data.features[0].center);
      setToCoordinates(responseToAddress.data.features[0].center);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    data && getCoordinates(data[5], data[3]);
  }, [data]);

  const getDistance = (user, from, to) => {
    const turf = require("@turf/turf");
    let userPoint = turf.point(user);
    let fromPoint = turf.point(from);
    let toPoint = turf.point(to);
    let userToFromDistance = turf.distance(userPoint, fromPoint);
    let shipmentDistance = turf.distance(fromPoint, toPoint);
    setUserToFromDistance(userToFromDistance.toFixed(2));
    setShipmentDistance(shipmentDistance.toFixed(2));
  };

  useEffect(() => {
    if (fromCoordinates !== null && toCoordinates !== null && userCoordinates) {
      getDistance(userCoordinates, fromCoordinates, toCoordinates);
    }
  }, [userCoordinates, toCoordinates]);

  return { shipmentDistance, userToFromDistance };
};

export default useGetDistance;
