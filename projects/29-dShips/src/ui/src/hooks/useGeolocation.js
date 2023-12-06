import { useEffect, useState } from "react";

const useGeolocation = () => {
  const [userCoordinates, setUserCoordinates] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setUserCoordinates([longitude, latitude]);
        },
        function (error) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error(
                "Acceso a la geolocalización denegado por el usuario."
              );
              break;
            case error.POSITION_UNAVAILABLE:
              console.error("Información de ubicación no disponible.");
              break;
            case error.TIMEOUT:
              console.error(
                "Tiempo de espera agotado al obtener la ubicación."
              );
              break;
            case error.UNKNOWN_ERROR:
              console.error("Ocurrió un error desconocido.");
              break;
          }
        }
      );
    } else {
      console.log("El navegador no admite la geolocalización.");
    }
  }, []);

  return { userCoordinates };
};

export default useGeolocation;
