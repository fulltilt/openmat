/* 
Since the map was loaded on client side, 
we need to make this component client rendered as well else error occurs
*/
"use client";

//Map component Component from library
import { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

import { useSession } from "next-auth/react";

import { Button } from "./ui/button";
import EventForm from "~/app/(ui)/home/form";

//Map's styling
export const defaultMapContainerStyle = {
  width: "80vw",
  height: "80vh",
  borderRadius: "15px 0px 0px 15px",
};

const defaultMapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: "auto",
};

const locations = [
  {
    lat: 38.0453502,
    lng: -122.1458514,
  },
  {
    lat: 37.92452400000001,
    lng: -121.6947009,
  },
  {
    lat: 37.958458,
    lng: -122.057377,
  },
];

function filterLocations(map: google.maps.Map | undefined) {
  // console.log(locations.filter((l) => map?.getBounds()?.contains(l)));
}

const MapComponent = () => {
  const session = useSession();

  const [currentLocation, setCurrentLocation] = useState({
    lat: 39,
    lng: -95,
  });
  const [zoom, setZoom] = useState(4);
  const [map, setMap] = useState<google.maps.Map>();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    navigator?.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        console.log(lat, lng);
        setCurrentLocation({ lat, lng });
        setZoom(10);
      },
      (error) => console.log(error),
    );

    getUpcomingEvents();
  }, [session]);

  async function getUpcomingEvents() {
    // const evt = {
    //   timeMax: {
    //     dateTime: new Date(new Date().getDate() + 7).toISOString(),
    //     timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    //   },
    // };

    if (!session.data) return;

    await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID}/events?timeMax=${new Date(new Date().getTime() + 7 * (24 * 60 * 60 * 1000)).toISOString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.data?.access_token}`,
        },
        // body: JSON.stringify(evt),
      },
    )
      .then((data) => data.json())
      .then((data) => console.log("data", data))
      .catch((err) => console.log("error", err));
  }

  return (
    <div className="w-full">
      <div className="flex">
        <GoogleMap
          mapContainerStyle={defaultMapContainerStyle}
          center={currentLocation}
          zoom={zoom}
          options={defaultMapOptions}
          onLoad={(map) => {
            setMap(map);
            filterLocations(map);
          }}
          onBoundsChanged={() => filterLocations(map)}
          onCenterChanged={() => filterLocations(map)}
          onClick={(e: any) => {
            if (e.placeId) console.log(e.placeId);
          }}
        >
          {locations.map((l) => (
            <Marker
              key={`${l.lat} ${l.lng}`}
              position={l}
              onClick={(e) => {
                const lat = e.latLng?.lat();
                const lng = e.latLng?.lng();
              }}
            />
          ))}
        </GoogleMap>
        <div className="flex flex-col items-center">
          <Button
            onClick={() => {
              setShowForm(true);
            }}
          >
            Add
          </Button>
          {showForm && (
            <EventForm
              setCurrentLocation={setCurrentLocation}
              setZoom={setZoom}
              setShowForm={setShowForm}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export { MapComponent };
