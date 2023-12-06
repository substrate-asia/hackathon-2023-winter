/* eslint-disable */
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const useGetMap = (user, data) => {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const mapContainer = useRef(null);
  const map = useRef(null);

  const [fromCoordinates, setFromCoordinates] = useState(null);
  const [toCoordinates, setToCoordinates] = useState(null);
  const [userToFromDistance, setUserToFromDistance] = useState(null);
  const [shipmentDistance, setShipmentDistance] = useState(null);

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

      //SET MAP
      setMap(
        responseFromAddress.data.features[0].center,
        responseToAddress.data.features[0].center
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    data && getCoordinates(data[5], data[3]);
  }, [data]);

  const setMap = (from, to) => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      zoom: 12,
    });
    const fromMark = new mapboxgl.Marker().setLngLat(from).addTo(map.current);
    const toMark = new mapboxgl.Marker().setLngLat(to).addTo(map.current);

    // Calculate the midpoint coordinates
    const midLng = (from[0] + to[0]) / 2;
    const midLat = (from[1] + to[1]) / 2;

    // Set the center of the map to the midpoint
    map.current.setCenter([midLng, midLat]);

    const url = `https://api.mapbox.com/matching/v5/mapbox/driving/${from[0]},${from[1]};${to[0]},${to[1]}?access_token=${token}`;

    axios
      .get(url)
      .then((response) => {
        // Add a GeoJSON source for the matched route
        map.current.addSource("route", {
          type: "geojson",
          data: response.data.matchings[0].geometry,
        });

        // Add a new layer to visualize the route
        map.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#888",
            "line-width": 8,
          },
        });
      })
      .catch((error) => console.error(error));
  };

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
    if (user !== null && fromCoordinates !== null && toCoordinates !== null) {
      getDistance(user, fromCoordinates, toCoordinates);
    }
  }, [user, toCoordinates]);

  return {
    mapContainer,
    map,
    fromCoordinates,
    toCoordinates,
    userToFromDistance,
    shipmentDistance,
  };
};

export default useGetMap;
