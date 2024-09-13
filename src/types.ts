export type Event = {
  lat: string;
  lng: string;
  id: string;
  name: string;
  location: string;
};

export type CalendarEvent = {
  kind: string;
  etag: string;
  id: string;
  status: "confirmed" | "tentative" | "cancelled";
  htmlLink: string;
  created: Date;
  updated: Date;
  location: string;
  creator: {
    email: string;
  };
  organizer: {
    email: string;
    displayName: string;
    self: boolean;
  };
  start: {
    dateTime: Date;
    timeZone: string;
  };
  end: {
    dateTime: Date;
    timeZone: string;
  };
  recurrence?: string[]; // optional
  iCalUID: string;
  sequence: number;
  reminders: {
    useDefault: boolean;
  };
  eventType: "default" | "outOfOffice" | "focus" | "workingElsewhere"; // Update as per the possible event types
  lat: string;
  lng: string;
};
