import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  Marker,
  Popup,
} from "react-leaflet";
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
  //The overall map state is managed here.
  //Pass any new state to the sidebar as needed for new components.
  const [markers, setMarkers] = useState([]);
  const [markerDetails, setMarkerDetails] = useState({
    name: "",
    description: "",
    categories: [],
  });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [filterMarkers, setFilteredMarkers] = useState([]);
  const [isPlacingMarker, setIsPlacingMarker] = useState(false);
  const [activeOption, setActiveOption] = useState(null);

  //Filter State
  //This is the list of preset categories available
  const [filters, setFilters] = useState([
    "Science and Technology",
    "Social Sciences",
    "Food And Agriculture",
    "Law",
    "Engineering",
    "Recreation",
    "Bomboclaat"
  ]);

  //This is the current toggled filters
  const [activeFilters, setActiveFilters] = useState([]);

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

  //Filters the markers everytime the toggled filters change
  //or a new marker is added
  useEffect(() => {
    if (activeFilters.length === 0) setFilteredMarkers(markers);
    else {
      const filtered = markers.filter((marker) =>
        marker.categories.some((cat) => activeFilters.includes(cat))
      );

      setFilteredMarkers(filtered);
    }
  }, [activeFilters, markers]);

  return (
    <div className="ui-container">
      <Header />
      <Sidebar
        //Pass in state as props here
        markers={markers}
        setMarkers={setMarkers}
        selectedMarker={selectedMarker}
        setSelectedMarker={setSelectedMarker}
        activeOption={activeOption}
        changeActiveOption={setActiveOption}
        setIsPlacingMarker={setIsPlacingMarker}
        setMarkerDetails={setMarkerDetails}
        filters={filters}
        setFilters={setFilters}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      >
        <SidebarItem
          name="Markers"
          icon={<MarkerIcon />}
          changeActiveOption={setActiveOption}
          //These are the dropdown options for the markers sidebar item.
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
          //These are the dropdown options for the filters sidebar item.
          //Some of these may be changed such as Remove Filter and Update Filter being
          //merged into one option called "Manage Filters"
          //*I reduced it to just Edit Filters and Toggle Filters for now.*
          //You can change it back to Add, Remove and Update Filters if you want
          //and remove the Edit Filters option.
          selections={["Edit Filters", "Toggle Filters"]}
        />
        <SidebarItem name="Achievements" />
      </Sidebar>

      {/*This is the main map container.*/}
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
          {/*This is the code for adding markers to the map from the markers state*/}
          {filterMarkers.map((marker) => (
            <Marker
              id={marker.id}
              position={[marker.lattitude, marker.longitude]}
              eventHandlers={{
                click: () =>
                  setSelectedMarker(
                    markers.find((obj) => {
                      return obj.id === marker.id;
                    })
                  ),
              }}
            >
              <Popup>
                <div className="marker-popup">
                  <h3>{marker.name}</h3>
                  <p>{marker.description}</p>
                  <p>{marker.categories}</p>
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
          {/*
          This is the code for placing markers on the map
          Its functionality is handled in the ClickCoordinatesHandler component found higher up in the file.
          It uses the useMapEvents hook from react-leaflet to get the lat and lng of the click event.
          */}
          <ClickCoordinatesHandler
            onClick={({ lat, lng }) => {
              if (isPlacingMarker) {
                setMarkers((prevMarkers) => [
                  ...prevMarkers,
                  {
                    id: prevMarkers.length + 1,
                    name: markerDetails.name,
                    description: markerDetails.description,
                    categories: markerDetails.categories,
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
