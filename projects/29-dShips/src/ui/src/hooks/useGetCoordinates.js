/* eslint-disable */
import React, { useEffect, useState } from "react";
import axios from "axios";

const useGetCoordinates = (data) => {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const [fromCoordinates, setFromCoordinates] = useState(null);
  const [toCoordinates, setToCoordinates] = useState(null);

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

  return { fromCoordinates, toCoordinates };
};

export default useGetCoordinates;
