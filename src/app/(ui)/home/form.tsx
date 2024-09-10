"use client";

import { useState, FormEvent } from "react";
import { useSession } from "next-auth/react";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";

import { Autocomplete } from "@react-google-maps/api";
import { toLocalISOString } from "~/lib/utils";
import { addOpenMat } from "~/server/queries";

export default function EventForm({
  setCurrentLocation,
  setZoom,
  setShowForm,
}: {
  setCurrentLocation: ({ lat, lng }: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
  setShowForm: (show: boolean) => void;
}) {
  const session = useSession();

  const [searchResult, setSearchResult] =
    useState<google.maps.places.Autocomplete>();
  const [startDate, setStartDate] = useState(toLocalISOString(new Date()));
  const [endDate, setEndDate] = useState(
    toLocalISOString(
      new Date(new Date(startDate).getTime() + 2 * (60 * 60 * 1000)),
    ),
  );
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  function onLoad(autocomplete: google.maps.places.Autocomplete) {
    setSearchResult(autocomplete);
  }

  const handleOnPlaceChanged = () => {
    if (searchResult) {
      const place = searchResult.getPlace();
      const lat = place.geometry?.location?.lat() ?? 39;
      const lng = place.geometry?.location?.lng() ?? -95;
      setLat(lat);
      setLng(lng);

      setCurrentLocation({ lat, lng });
      setZoom(16);
    }
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const location = formData.get("location");
    const recurring = formData.get("recurrence");
    const startDate = new Date(formData.get("startDate") as string);
    const endDate = new Date(formData.get("endDate") as string);

    const evt = {
      summary: name,
      location,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      recurrence: recurring ? ["RRULE:FREQ=WEEKLY;INTERVAL=1"] : undefined,
    };

    await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.data?.access_token}`,
        },
        body: JSON.stringify(evt),
      },
    )
      .then((data) => data.json())
      .then(async (data) => {
        console.log("data", data);

        try {
          const res = await addOpenMat(data.id, name, location, lat, lng);
          console.log(res);
        } catch (err) {
          console.log(err);
        }
      })
      .catch((err) => console.log("error", err))
      .finally(() => setShowForm(false));
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8 text-sm">
      <div>
        <label htmlFor="name">Event Name</label>
        <Input id="name" name="name" />
      </div>

      <div>
        <label htmlFor="location">Location</label>
        <Autocomplete
          onLoad={onLoad}
          onPlaceChanged={handleOnPlaceChanged}
          fields={["geometry.location", "formatted_address"]}
        >
          <Input
            placeholder="Enter your location"
            className="z-50"
            id="location"
            name="location"
          />
        </Autocomplete>
      </div>

      <div>
        <label htmlFor="startDate">Start Time</label>
        <br />
        <input
          aria-label="Date and time"
          type="datetime-local"
          id="startDate"
          name="startDate"
          defaultValue={toLocalISOString(new Date())}
          onChange={(evt) => {
            const startDate = toLocalISOString(
              new Date(
                new Date(evt.target.value).getTime() + 2 * (60 * 60 * 1000),
              ),
            );
            setStartDate(startDate);
          }}
        />
      </div>

      <div>
        <label htmlFor="endDate">End Time</label>
        <br />
        <input
          aria-label="Date and time"
          type="datetime-local"
          id="endDate"
          name="endDate"
          defaultValue={endDate}
          min={startDate}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="recurrence" name="recurrence" />
        <label
          htmlFor="recurrence"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Recurring?
        </label>
      </div>

      <div>
        <label htmlFor="website">Website (for verification purposes)</label>
        <Input id="website" name="website" />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}
