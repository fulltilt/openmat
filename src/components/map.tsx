/* 
Since the map was loaded on client side, 
we need to make this component client rendered as well else error occurs
*/
"use client";

//Map component Component from library
import { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  GoogleMap,
  type Libraries,
  useLoadScript,
} from "@react-google-maps/api";
import {
  APIProvider,
  ControlPosition,
  Map,
  MapControl,
} from "@vis.gl/react-google-maps";
import MapHandler from "./map-handler";
import { PlaceAutocompleteClassic } from "./placeAutocompleteClassic";
import { Input } from "./ui/input";

//Map's styling
export const defaultMapContainerStyle = {
  width: "100%",
  height: "80vh",
  borderRadius: "15px 0px 0px 15px",
};

const defaultMapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: "auto",
  // mapTypeId: 'satellite',
};

const MapComponent = () => {
  const [currentLocation, setCurrentLocation] = useState({
    lat: 39,
    lng: -95,
  });
  // const [selectedPlace, setSelectedPlace] =
  //   useState<google.maps.places.PlaceResult | null>(null);
  const [zoom, setZoom] = useState(4);
  const [searchResult, setSearchResult] =
    useState<google.maps.places.Autocomplete>();

  function onLoad(autocomplete: google.maps.places.Autocomplete) {
    setSearchResult(autocomplete);
  }

  // useEffect(() => {
  //   navigator?.geolocation.getCurrentPosition(
  //     ({ coords: { latitude: lat, longitude: lng } }) => {
  //       console.log(lat, lng);
  //       setCurrentLocation({ lat, lng });
  //       setZoom(10);
  //     },
  //     (error) => console.log(error),
  //   );
  // }, []);

  const handleOnPlaceChanged = () => {
    if (searchResult) {
      const place = searchResult.getPlace();
      console.log("Search : ", place);
    }
  };

  return (
    // <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API || ""}>
    //   <div className="w-full">
    //     <Map
    //       style={{ width: "100vw", height: "100vh" }}
    //       defaultCenter={currentLocation}
    //       defaultZoom={zoom}
    //       gestureHandling={"greedy"}
    //       disableDefaultUI={true}
    //     />

    //     <MapControl position={ControlPosition.TOP}>
    //       <div className="autocomplete-control">
    //         <PlaceAutocompleteClassic onPlaceSelect={setSelectedPlace} />
    //       </div>
    //     </MapControl>

    //     <MapHandler place={selectedPlace} />
    //   </div>
    // </APIProvider>
    <div className="w-full">
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={handleOnPlaceChanged}
        fields={["geometry.location", "formatted_address"]}
      >
        <Input placeholder="Enter your address" />
      </Autocomplete>
      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={currentLocation}
        zoom={zoom}
        options={defaultMapOptions}
      ></GoogleMap>
    </div>
  );
};

export { MapComponent };
