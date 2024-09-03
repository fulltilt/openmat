const { google } = require("googleapis");

export default function handler(
  req: { method: string },
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: { (arg0: { googleApiInstance: any }): void; new (): any };
    };
  },
) {
  // Fetch Calendar Service Instance
  if (req.method === "GET") {
    res.status(200).json({
      googleApiInstance: google.calendar({
        version: "v3",
        auth: process.env.NEXT_PUBLIC_G_API_KEY,
      }),
    });
  }
}
