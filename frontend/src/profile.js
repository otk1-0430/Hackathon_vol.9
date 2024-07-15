import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function Profile() {
  const location = useLocation();
  const { username } = location.state;
  const [position, setPosition] = useState([51.505, -0.09]); // デフォルト位置

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition([pos.coords.latitude, pos.coords.longitude]);
    });
  }, []);

  return (
    <div>
      <h1>{username}のページ</h1>
      <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
        />
        <Marker position={position}>
          <Popup>{username}の位置</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default Profile;