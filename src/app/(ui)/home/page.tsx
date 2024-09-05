import { MapComponent } from "~/components/map";
import { MapProvider } from "~/providers/mapsProvider";

export default function Home() {
  return (
    <MapProvider>
      <MapComponent />
    </MapProvider>
  );
}
