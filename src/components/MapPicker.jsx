import { useEffect, useRef, useState } from "react";

// Shashemene, Ethiopia
const DEFAULT_LAT = 7.2003;
const DEFAULT_LNG = 38.5917;
const DEFAULT_ZOOM = 15;

// Reverse geocode using OpenStreetMap Nominatim (free, no API key)
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    if (!data || data.error) return null;

    const a = data.address || {};
    // Build a human-readable address from available parts
    const parts = [
      a.road || a.pedestrian || a.footway,
      a.neighbourhood || a.suburb || a.quarter,
      a.city_district || a.district,
      a.city || a.town || a.village || a.county,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(", ") : data.display_name?.split(",").slice(0, 3).join(",").trim() || null;
  } catch {
    return null;
  }
}

export default function MapPicker({ onConfirm, onClose }) {
  const mapRef        = useRef(null);
  const leafletMap    = useRef(null);
  const markerRef     = useRef(null);
  const [address, setAddress]       = useState("");
  const [loading, setLoading]       = useState(false);
  const [locating, setLocating]     = useState(false);
  const [coords, setCoords]         = useState({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
  const [mapReady, setMapReady]     = useState(false);
  const [geoError, setGeoError]     = useState("");

  // Load Leaflet CSS + JS dynamically (no install needed)
  useEffect(() => {
    // CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id   = "leaflet-css";
      link.rel  = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // JS
    const loadLeaflet = () => {
      if (window.L) { initMap(); return; }
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initMap;
      document.head.appendChild(script);
    };

    loadLeaflet();

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  function initMap(lat = DEFAULT_LAT, lng = DEFAULT_LNG) {
    if (!mapRef.current || leafletMap.current) return;

    const L   = window.L;
    const map = L.map(mapRef.current).setView([lat, lng], DEFAULT_ZOOM);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    // Custom red pin icon
    const icon = L.divIcon({
      html: `<div style="width:32px;height:32px;display:flex;align-items:center;justify-content:center">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="#c0392b">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>`,
      className: "",
      iconAnchor: [16, 32],
      iconSize: [32, 32],
    });

    const marker = L.marker([lat, lng], { icon, draggable: true }).addTo(map);
    markerRef.current = marker;
    leafletMap.current = map;
    setMapReady(true);

    // Update on drag
    marker.on("dragend", async (e) => {
      const { lat, lng } = e.target.getLatLng();
      setCoords({ lat, lng });
      await updateAddress(lat, lng);
    });

    // Update on map click
    map.on("click", async (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      setCoords({ lat, lng });
      await updateAddress(lat, lng);
    });

    // Initial address
    updateAddress(lat, lng);
  }

  async function updateAddress(lat, lng) {
    setLoading(true);
    const result = await reverseGeocode(lat, lng);
    setAddress(result || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    setLoading(false);
  }

  async function locateMe() {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    setGeoError("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });

        if (leafletMap.current && markerRef.current) {
          leafletMap.current.setView([lat, lng], 17);
          markerRef.current.setLatLng([lat, lng]);
          await updateAddress(lat, lng);
        } else {
          // Map not ready yet — init it at this location
          if (window.L) initMap(lat, lng);
          else {
            // Wait for Leaflet to load
            const wait = setInterval(() => {
              if (window.L) { clearInterval(wait); initMap(lat, lng); }
            }, 100);
          }
        }
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) setGeoError("Location access denied. Please allow location or pin your address on the map.");
        else setGeoError("Could not get your location. Please pin your address on the map.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function confirm() {
    if (!address) return;
    onConfirm(address);
    onClose();
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal */}
      <div className="flex w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl" style={{ maxHeight: "90vh" }}>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <div>
            <p className="font-black text-zinc-900">Pick your location</p>
            <p className="text-xs text-zinc-400">Drag the pin or tap the map to set your delivery spot</p>
          </div>
          <button type="button" onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition hover:bg-zinc-200">
            ✕
          </button>
        </div>

        {/* Locate me button */}
        <div className="px-5 pt-4">
          <button
            type="button"
            onClick={locateMe}
            disabled={locating}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-red-700 bg-red-50 py-2.5 text-sm font-black text-red-700 transition hover:bg-red-100 active:scale-95 disabled:opacity-60"
          >
            {locating ? (
              <><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-red-700 border-t-transparent" />Locating you…</>
            ) : (
              <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="9" strokeWidth="1.5"/></svg>Use my current location</>
            )}
          </button>
          {geoError && <p className="mt-2 text-xs font-semibold text-red-600">{geoError}</p>}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 px-5 pt-3 pb-2">
          <div className="h-px flex-1 bg-zinc-100" />
          <span className="text-xs text-zinc-400">or pin on map</span>
          <div className="h-px flex-1 bg-zinc-100" />
        </div>

        {/* Map */}
        <div className="mx-5 overflow-hidden rounded-xl border border-zinc-200" style={{ height: 280 }}>
          <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
        </div>

        {/* Detected address */}
        <div className="mx-5 mt-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Delivery address</p>
          {loading ? (
            <p className="mt-1 text-sm text-zinc-400 italic">Looking up address…</p>
          ) : (
            <p className="mt-0.5 text-sm font-semibold text-zinc-800">{address || "Tap the map to pick a location"}</p>
          )}
        </div>

        {/* Confirm button */}
        <div className="p-5">
          <button
            type="button"
            onClick={confirm}
            disabled={!address || loading}
            className="w-full rounded-xl bg-red-700 py-3 text-sm font-black text-white transition hover:bg-red-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Confirm this location
          </button>
        </div>

      </div>
    </div>
  );
}
