import React, { useState } from "react";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import { useMap } from "react-leaflet";
import { Sidebar, SidebarItem } from "./Components/Sidebar";
import Header from "./Components/Header";

import "./Styles/map.css";
import { ReactComponent as MarkerIcon } from "./Icons/marker.svg";
import { ReactComponent as FilterIcon } from "./Icons/filter.svg";

function App() {
  const [activeOption, setActiveOption] = useState(null);

  return (
    <div className="ui-container">
      <Header />
      <Sidebar activeOption={activeOption} changeActiveOption={setActiveOption}>
        <SidebarItem
          name="Markers"
          icon={<MarkerIcon />}
          changeActiveOption={setActiveOption}
          selections={[
            "Add Marker",
            "Remove Marker",
            "View Markers",
            "Update Marker",
          ]}
        />
        <SidebarItem
          name="Filters"
          icon={<FilterIcon />}
          selections={[
            "Add Filter",
            "Remove Filter",
            "Toggle Filters",
            "Update Filter",
          ]}
        />
        <SidebarItem name="Achievements" />
      </Sidebar>
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
