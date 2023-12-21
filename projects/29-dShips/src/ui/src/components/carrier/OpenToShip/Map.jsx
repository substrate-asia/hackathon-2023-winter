/* eslint-disable */
import React, { useEffect, useRef } from "react";
import axios from "axios";
import mapboxgl from "!mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const Map = ({ data }) => {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const mapContainer = useRef(null);
  const map = useRef(null);
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

      //SET MAP
      setMap(responseFromAddress.data.features[0].center);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    data && getCoordinates(data[5], data[3]);
  }, [data]);

  const setMap = (center) => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: center,
      zoom: 15,
    });
    map.current.dragPan.disable();
    const marker = new mapboxgl.Marker().setLngLat(center).addTo(map.current);
  };
  return (
    <div className="">
      <div ref={mapContainer} className="map-container h-60 rounded flex"></div>
    </div>
  );
};

export default Map;
