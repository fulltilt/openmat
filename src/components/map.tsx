/* 
Since the map was loaded on client side, 
we need to make this component client rendered as well else error occurs
*/
"use client";

//Map component Component from library
import { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { format } from "date-fns";

import { useSession } from "next-auth/react";

import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import EventForm from "~/app/(ui)/home/form";
import { getOpenMats } from "~/server/queries";
import { cn } from "~/lib/utils";

//Map's styling
export const defaultMapContainerStyle = {
  width: "75vw",
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

type Event = {
  lat: string;
  lng: string;
  id: string;
  name: string;
  location: string;
};

const MapComponent = () => {
  const session = useSession();

  const [currentLocation, setCurrentLocation] = useState({
    lat: 39,
    lng: -95,
  });
  const [zoom, setZoom] = useState(4);
  const [map, setMap] = useState<google.maps.Map>();
  const [showForm, setShowForm] = useState(false);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    navigator?.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        setCurrentLocation({ lat, lng });
        setZoom(10);
      },
      (error) => console.log(error),
    );

    getUpcomingEvents(new Date());

    getOpenMats()
      .then((res) => setAllEvents(res))
      .catch((err) => console.log(err));
  }, [session]);

  async function getUpcomingEvents(date: Date) {
    if (!session.data) return;

    await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID}/events?timeMin=${new Date(date.getTime()).toISOString()}&timeMax=${new Date(date.getTime() + 7 * (24 * 60 * 60 * 1000)).toISOString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.data?.access_token}`,
        },
        // body: JSON.stringify(evt),
      },
    )
      .then((data) => data.json())
      .then((data) => {
        console.log("data", data);
        setAllEvents(data.items);
      })
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
        <div className="flex w-[25vw] flex-col items-center p-4">
          <div className="flex">
            <Button
              onClick={() => {
                setShowForm(true);
              }}
              className="mb-4"
            >
              Add
            </Button>
            {/* <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => {
                setDate(date!);
                getUpcomingEvents(date!);
              }}
              initialFocus
            /> */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => {
                    setDate(date!);
                    getUpcomingEvents(date!);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {showForm && (
            <EventForm
              setCurrentLocation={setCurrentLocation}
              setZoom={setZoom}
              setShowForm={setShowForm}
            />
          )}

          {allEvents?.map((e) => <div key={e.id}>{e.location}</div>)}
        </div>
      </div>
    </div>
  );
};

export { MapComponent };
