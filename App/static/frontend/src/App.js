import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, ZoomControl, Marker, Popup } from "react-leaflet";
import { useMapEvents } from "react-leaflet";
import { Sidebar, SidebarItem } from "./Components/Sidebar";
import Header from "./Components/Header";

import "./Styles/map.css";
import { ReactComponent as MarkerIcon } from "./Icons/marker.svg";
import { ReactComponent as FilterIcon } from "./Icons/filter.svg";

function ClickCoordinatesHandler({ onClick }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onClick({ lat, lng });
    },
  });

  return null;
}

function App() {
  const [markers, setMarkers] = useState([]);
  const [markerDetails, setMarkerDetails] = useState({
    name: "",
    description: "",
  });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isPlacingMarker, setIsPlacingMarker] = useState(false);
  const [activeOption, setActiveOption] = useState(null);

  //This useEffect is used to change the cursor on the map container when a marker is being placed.
  //It changes the cursor to a marker icon, but only on the map container.
  //It removes it when the marker is placed or the user cancels the action.
  useEffect(() => {
    const mapContainer = document.getElementById("map");
    if (mapContainer) {
      if (isPlacingMarker) {
        mapContainer.classList.add("selecting-marker");
      } else {
        mapContainer.classList.remove("selecting-marker");
      }
    }
  }, [isPlacingMarker]);

  return (
    <div className="ui-container">
      <Header />
      <Sidebar
        markers={markers}
        setMarkers={setMarkers}
        selectedMarker={selectedMarker}
        setSelectedMarker={setSelectedMarker}
        activeOption={activeOption}
        changeActiveOption={setActiveOption}
        setIsPlacingMarker={setIsPlacingMarker}
        setMarkerDetails={setMarkerDetails}
      >
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
          changeActiveOption={setActiveOption}
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
          id="map"
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
          {markers.map((marker) => (
            <Marker
              id={marker.id}
              position={[marker.lattitude, marker.longitude]}
              eventHandlers={{
                click: () => setSelectedMarker(markers.find((obj) => {
                  return obj.id === marker.id;
                })),
              }}
            >
              <Popup>
                <div className="marker-popup">
                  <h3>{marker.name}</h3>
                  <p>{marker.description}</p>
                  <button
                    onClick={() => {
                      setMarkers((prevMarkers) =>
                        prevMarkers.filter((m) => m.id !== marker.id)
                      );
                      setSelectedMarker(null);
                    }}
                  >
                    Remove Marker
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
          <ZoomControl position="topright" />
          <ClickCoordinatesHandler
            onClick={({ lat, lng }) => {
              if (isPlacingMarker) {
                setMarkers((prevMarkers) => [
                  ...prevMarkers,
                  {
                    id: prevMarkers.length + 1,
                    name: markerDetails.name,
                    description: markerDetails.description,
                    lattitude: lat,
                    longitude: lng,
                  },
                ]);
                setIsPlacingMarker(false);
              }
            }}
          />
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
