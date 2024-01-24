import {
  Autocomplete,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import React, { useEffect, useRef, useState } from "react";
import { fromAddress, setKey } from "react-geocode";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const Container = styled.main`
  width: 100vw;
  height: calc(100vh - 36px);
`;

const MapsContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: -1;
`;

const color = {
  "google-blue 100": `#4285F4`,
  "white 100": `rgb(255,255,255)`,
};

export default function Result() {
  const { state } = useLocation();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  const [map, setMap] = useState(/** @type google.maps.Map **/ (null));
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const originRef = useRef(null);

  useEffect(() => {
    setKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // 위치 정보를 얻었을 때의 처리
          const { latitude: lat, longitude: lng } = position.coords;
          setLocation({ lat, lng });
        },
        (error) => {
          // 위치 정보를 얻지 못했을 때의 처리
          setError(`Error getting location: ${error.message}`);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 렌더링될 때만 실행

  const changeLoc = async () => {
    if (originRef.current.value === "") {
      return;
    }

    fromAddress(originRef.current.value)
      .then(({ results }) => {
        const { lat, lng } = results[0].geometry.location;
        setLocation({ lat, lng });
      })
      .catch(console.error);
  };

  console.log(state, location);

  return (
    <Container>
      {location == null ? (
        <div>loading...</div>
      ) : (
        isLoaded && (
          <>
            <Autocomplete>
              <input placeholder="Origin" ref={originRef} />
            </Autocomplete>
            <button onClick={changeLoc}>Change Locatioin</button>
            <MapsContainer>
              <GoogleMap
                center={location}
                zoom={12}
                mapContainerStyle={{ width: "100%", height: "100%" }}
                options={{
                  zoomControl: false,
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                }}
                onLoad={(map) => setMap(map)}
              >
                <Marker
                  icon={{
                    fillColor: color["google-blue 100"],
                    fillOpacity: 1,
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    strokeColor: color["white 100"],
                    strokeWeight: 2,
                  }}
                  position={location}
                />
              </GoogleMap>
            </MapsContainer>
          </>
        )
      )}
    </Container>
  );
}
