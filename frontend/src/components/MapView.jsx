/**
 * MapView Component
 *
 * Renders an interactive Leaflet map displaying donor locations
 * with blood-group-colored markers and popup details.
 *
 * @param {Object} props
 * @param {Array} [props.donors=[]] - Array of donor objects with lat/lng coordinates.
 * @param {Array} [props.center=[19.076, 72.8777]] - Default map center (Mumbai).
 * @param {number} [props.zoom=11] - Default zoom level.
 */

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BLOOD_GROUP_COLORS } from '../utils/bloodGroups';

/* Fix the default Leaflet marker icon path issue in bundled environments */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/**
 * Creates a custom colored div icon for a map marker.
 * @param {string} color - CSS color value for the marker.
 * @returns {L.DivIcon} Leaflet DivIcon instance.
 */
function createColoredIcon(color) {
  return L.divIcon({
    html: `<div style="background:${color};width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

export default function MapView({ donors = [], center = [19.076, 72.8777], zoom = 11 }) {
  /* Filter donors that have valid geographic coordinates */
  const mappable = donors.filter(d => d.latitude && d.longitude);

  if (mappable.length === 0) {
    return (
      <div className="bg-gray-100 dark:bg-dark-surface rounded-2xl h-96 flex items-center justify-center">
        <p className="text-gray-400">No donors with location data to display on map</p>
      </div>
    );
  }

  /* Calculate the geographic center from all mappable donors */
  const avgLat = mappable.reduce((sum, d) => sum + parseFloat(d.latitude), 0) / mappable.length;
  const avgLng = mappable.reduce((sum, d) => sum + parseFloat(d.longitude), 0) / mappable.length;

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg" style={{ height: '400px' }}>
      <MapContainer
        center={[avgLat, avgLng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mappable.map((donor) => (
          <Marker
            key={donor.donor_id || donor.id}
            position={[parseFloat(donor.latitude), parseFloat(donor.longitude)]}
            icon={createColoredIcon(BLOOD_GROUP_COLORS[donor.blood_group] || '#C0392B')}
          >
            <Popup>
              <div className="text-center p-1">
                <strong className="block">{donor.name}</strong>
                <span className="text-red-600 font-semibold">{donor.blood_group}</span>
                <br />
                <span className="text-gray-500 text-xs">{donor.city}</span>
                <br />
                <span className={`text-xs ${donor.is_available ? 'text-green-600' : 'text-gray-400'}`}>
                  {donor.is_available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
