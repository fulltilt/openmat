/* 
Since the map was loaded on client side, 
we need to make this component client rendered as well else error occurs
*/
"use client";

import { useEffect, useState } from "react";
import { GoogleMap, MarkerF, InfoWindowF } from "@react-google-maps/api";
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
import { cn, timeFormat } from "~/lib/utils";
import Modal from "./modal";
import { useRouter } from "next/navigation";
import type { Event, CalendarEvent } from "../types";

import { useDebouncedCallback } from "use-debounce";

// Map's styling
export const defaultMapContainerStyle = {
  width: "75vw",
  height: "100vh",
  // borderRadius: "15px 0px 0px 15px",
};

const defaultMapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: "auto",
};

const MapComponent = () => {
  const session = useSession();
  const router = useRouter();

  const [currentLocation, setCurrentLocation] = useState({
    lat: 39,
    lng: -95,
  });
  const [zoom, setZoom] = useState(4);
  const [map, setMap] = useState<google.maps.Map>();
  const [showForm, setShowForm] = useState(false);
  const [allOpenMats, setAllOpenMats] = useState<Event[]>([]);
  const [currentEvent, setCurrentEvent] = useState<CalendarEvent & Event>();
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [filteredCalendarEvents, setFilteredCalendarEvents] = useState<
    (Event | (Event & CalendarEvent))[]
  >([]);
  const [date, setDate] = useState(new Date());
  const [openPopover, setOpenPopover] = useState(false);
  const [popoverIndex, setPopoverIndex] = useState<number>();

  useEffect(() => {
    navigator?.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        console.log(lat, lng);
        setCurrentLocation({ lat, lng });
        setZoom(10);
      },
      (error) => console.log(error),
    );

    getOpenMats()
      .then((res) => setAllOpenMats(res))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (!session.data && session.status !== "loading") router.push("/");

    getUpcomingEvents(date);
  }, [session, date]);

  async function updateOpenMats() {
    getOpenMats()
      .then((res) => {
        setAllOpenMats(res);
        const currentDate = new Date();
        const currentDay = currentDate.getDay();
        const offsetToLastSunday = (currentDay + 7) % 7;
        const lastSundayDate = new Date(currentDate);
        lastSundayDate.setDate(currentDate.getDate() - offsetToLastSunday);

        getUpcomingEvents(lastSundayDate);
      })
      .catch((err) => console.log(err));
  }

  async function getUpcomingEvents(date: Date) {
    if (!session.data && session.status !== "loading") {
      router.push("/");
      return;
    }

    return await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID}/events${date ? `?timeMin=${new Date(date.getTime()).toISOString()}&timeMax=${new Date(date.getTime() + 7 * (24 * 60 * 60 * 1000)).toISOString()}&singleEvents=true` : ""}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.data?.access_token}`,
        },
      },
    )
      .then((data) => data.json())
      .then((data) => {
        setCalendarEvents(data.items);
        filterLocations(data.items);
        return data.items;
      })
      .catch((err) => {
        // console.log("error", err);
        return err;
      });
  }

  const filterLocations = useDebouncedCallback((eventDates: Event[] = []) => {
    const locations =
      (eventDates.length ? eventDates : calendarEvents)?.map(
        (e) => e.location,
      ) ?? [];

    let filteredEvents = allOpenMats
      .filter((l) =>
        map
          ?.getBounds()
          ?.contains({ lat: parseFloat(l.lat), lng: parseFloat(l.lng) }),
      )
      .filter((evt) => locations.includes(evt.location));

    const combinedEventData = filteredEvents.map((evt) =>
      Object.assign(
        {},
        evt,
        (eventDates.length ? eventDates : calendarEvents).filter(
          (cal) => evt.location === cal.location,
        )[0],
      ),
    );

    setFilteredCalendarEvents(combinedEventData);
  }, 300);

  function isThereAnOpenMatThisWeek(openMat: Event) {
    const locations = calendarEvents.map((evt) => evt.location);
    return locations.includes(openMat.location);
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
            getUpcomingEvents(new Date());
          }}
          onBoundsChanged={() => filterLocations()}
          onCenterChanged={() => filterLocations()}
          onClick={(e: any) => {
            if (e.placeId) console.log(e.placeId);
          }}
        >
          {allOpenMats.map((openMat, i) => (
            <MarkerF
              key={`${openMat.lat} ${openMat.lng}`}
              position={{
                lat: parseFloat(openMat.lat),
                lng: parseFloat(openMat.lng),
              }}
              onClick={() => {
                setPopoverIndex(i);

                const calendarEvent = calendarEvents.filter(
                  (evt) => evt.location === openMat.location,
                )[0];
                setCurrentEvent(Object.assign({}, openMat, calendarEvent));

                setOpenPopover(true);
              }}
            >
              {openPopover && i === popoverIndex && (
                <InfoWindowF
                  position={{
                    lat: parseFloat(openMat.lat),
                    lng: parseFloat(openMat.lng),
                  }}
                  onCloseClick={() => setOpenPopover(false)}
                >
                  {isThereAnOpenMatThisWeek(openMat) && currentEvent ? (
                    <div className="flex flex-col gap-2">
                      <strong>{currentEvent?.location.split(",")[0]}</strong>
                      <p>
                        {new Date(
                          currentEvent!.start?.dateTime,
                        ).toLocaleDateString()}
                      </p>
                      <p>
                        Start:{" "}
                        {`${timeFormat(new Date(currentEvent!.start?.dateTime).toLocaleTimeString())}`}
                      </p>
                      <p>
                        End:{" "}
                        {`${timeFormat(new Date(currentEvent!.end?.dateTime).toLocaleTimeString())}`}
                      </p>
                      {(session?.data?.user?.email ?? "") ===
                        currentEvent.creator.email && <Button>Edit</Button>}
                    </div>
                  ) : (
                    <div>
                      <p>No Open Mat scheduled</p>
                    </div>
                  )}
                </InfoWindowF>
              )}
            </MarkerF>
          ))}
        </GoogleMap>
        <div className="flex w-[25vw] flex-col gap-4 p-4">
          <Button onClick={() => setShowForm(true)} className="mb-4">
            Add Open Mat
          </Button>
          <div>
            <label htmlFor="week">Week of:</label>
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
                  id="week"
                  mode="single"
                  selected={date}
                  onSelect={(date) => {
                    setDate(date!);
                    // getUpcomingEvents(date!);
                    setOpenPopover(false);
                  }}
                  disabled={{ dayOfWeek: [1, 2, 3, 4, 5, 6] }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {showForm && (
            <Modal onClose={() => setShowForm(false)} title="Add New Open Mat">
              <EventForm
                setCurrentLocation={setCurrentLocation}
                setZoom={setZoom}
                setShowForm={setShowForm}
                updateOpenMats={updateOpenMats}
              />
            </Modal>
          )}

          <div className="flex flex-col gap-4">
            {filteredCalendarEvents.map((e) => (
              <div
                key={e.id}
                onClick={() =>
                  setCurrentLocation({
                    lat: parseFloat(e.lat ?? 39),
                    lng: parseFloat(e.lng ?? -95),
                  })
                }
                className="cursor-pointer"
              >
                <p>{new Date(e.start?.dateTime).toLocaleDateString()}</p>
                <p className="font-semibold">{e.location.split(",")[0]}</p>
                <p>{`${timeFormat(new Date(e.start?.dateTime).toLocaleTimeString())} - ${timeFormat(new Date(e.end?.dateTime).toLocaleTimeString())}`}</p>
              </div>
            ))}
            {filteredCalendarEvents.length === 0 &&
              "No Open Mats found. Try zooming out."}
          </div>
        </div>
      </div>
    </div>
  );
};

export { MapComponent };
