import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useMap } from "react-leaflet";

function App() {
  return (
    <div style={{ height: "100vh" }}>
      <MapContainer
        center={[10.64179, -61.400861]}
        zoom={17}
        minZoom={17}
        maxZoom={18}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        maxBounds={[
          [10.63716, -61.39418],
          [10.64829, -61.40707],
        ]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
}

export default App;
