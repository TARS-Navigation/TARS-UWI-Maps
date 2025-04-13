import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";
import { useMap } from "react-leaflet";

import "./Styles/map.css";

function App() {
  return (
    <div className="ui-container">
      <div className="ui-header">
        <div className="buttons-left">
          <button id="markers">Markers</button>
          <button id="filters">Filters</button>
        </div>

        <h1>TARS-MAPS UWI STA</h1>

        <div className="buttons-right">
          <button>Logout</button>
        </div>
      </div>
      <div className="ui-dropdown">
        {}
      </div>
      <div className="ui-map">
        <MapContainer
          style={{ height: "100%", width: "100%" }}
          trackResize={true}
          scrollWheelZoom={true}
          wheelPxPerZoomLevel={200}
          center={[10.64179, -61.400861]}
          maxBounds={[
            [10.63555, -61.38032],
            [10.64829, -61.41387],
          ]}
          maxBoundsViscosity={1.0}
          zoom={17}
          minZoom={17}
          maxZoom={18}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ZoomControl position="topright" />
        </MapContainer>
      </div>
    </div>
  );
}

export default App;