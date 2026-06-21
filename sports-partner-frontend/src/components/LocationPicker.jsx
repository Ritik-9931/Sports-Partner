import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DEFAULT_POSITION = [25.5941, 85.1376];

function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 15, {
        animate: true,
        duration: 1,
      });
    }
  }, [position, map]);

  return null;
}

function LocationMarker({ position, setPosition, onLocationSelect }) {
  const getAddressFromCoords = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      );

      const data = await res.json();
      const address = data.display_name || "";

      onLocationSelect(lat, lng, address);
    } catch {
      onLocationSelect(lat, lng, "");
    }
  };

  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      setPosition([lat, lng]);
      getAddressFromCoords(lat, lng);
    },
  });

  return (
    <Marker position={position}>
      <Popup>Selected location</Popup>
    </Marker>
  );
}

export default function LocationPicker({
  latitude,
  longitude,
  onLocationSelect,
}) {
  const [position, setPosition] = useState(DEFAULT_POSITION);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (latitude !== "" && longitude !== "") {
      setPosition([Number(latitude), Number(longitude)]);
    }
  }, [latitude, longitude]);

  const handleSearch = async () => {
    if (!search.trim()) return;

    try {
      setSearching(true);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
          search,
        )}&limit=5&countrycodes=in`,
      );

      const data = await res.json();
      setResults(data || []);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectResult = (place) => {
    const lat = Number(place.lat);
    const lng = Number(place.lon);
    const address = place.display_name;

    setPosition([lat, lng]);
    setSearch(address);
    setResults([]);

    onLocationSelect(lat, lng, address);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your area, city, road, or place"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
          />

          <button
            type="button"
            onClick={handleSearch}
            className="rounded-lg bg-violet-500 px-5 py-3 font-semibold text-white hover:bg-violet-600"
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </div>

        {results.length > 0 && (
          <div className="mt-3 space-y-2">
            {results.map((place) => (
              <button
                type="button"
                key={place.place_id}
                onClick={() => handleSelectResult(place)}
                className="block w-full rounded-lg bg-slate-950 px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-800"
              >
                {place.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      <MapContainer
        center={position}
        zoom={15}
        style={{
          height: "450px",
          width: "100%",
        }}
        className="overflow-hidden rounded-xl"
      >
        <RecenterMap position={position} />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker
          position={position}
          setPosition={setPosition}
          onLocationSelect={onLocationSelect}
        />
      </MapContainer>
    </div>
  );
}
