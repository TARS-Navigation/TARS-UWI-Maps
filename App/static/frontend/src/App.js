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

  const baseFilters = [
    "Science and Technology",
    "Social Sciences",
    "Food And Agriculture",
    "Law",
    "Engineering",
    "Recreation"
  ];



  const [filters, setFilters] = useState([...baseFilters]);


  const [activeFilters, setActiveFilters] = useState([]);

  // These states are managed by AddMarker form
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  useEffect(() => {
    const mapContainer = document.getElementById("map");
    if (mapContainer) {
      mapContainer.classList.toggle("selecting-marker", isPlacingMarker);
    }
  }, [isPlacingMarker]);

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
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        customCategory={customCategory}
        setCustomCategory={setCustomCategory}
      >
        <SidebarItem
          name="Markers"
          icon={<MarkerIcon />}
          changeActiveOption={setActiveOption}
          selections={["Add Marker", "Remove Marker", "View Markers", "Update Marker"]}
        />
        <SidebarItem
          name="Filters"
          icon={<FilterIcon />}
          changeActiveOption={setActiveOption}
          selections={["Edit Filters", "Toggle Filters", "Add Custom Filters"]}
        />
        <SidebarItem name="Achievements" />
      </Sidebar>

      <div className="ui-map">
        <MapContainer
          id="map"
          style={{ height: "100%", width: "100%" }}
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
          scrollWheelZoom={true}
          wheelPxPerZoomLevel={200}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          
          <ClickCoordinatesHandler
            onClick={({ lat, lng }) => {
              if (isPlacingMarker) {
                const finalCategory =
                  customCategory.trim() !== "" ? customCategory : selectedCategory;

                if (finalCategory && !filters.includes(finalCategory)) {
                  setFilters((prev) => [...prev, finalCategory]);
                }

                const newMarker = {
                  id: markers.length + 1,
                  name: markerDetails.name,
                  description: markerDetails.description,
                  categories: [finalCategory],
                  lattitude: lat,
                  longitude: lng,
                };

                setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
                setIsPlacingMarker(false);
                setSelectedCategory("");
                setCustomCategory("");
              }
            }}
          />

          {filterMarkers.map((marker) => (
            <Marker
              key={marker.id}
              position={[marker.lattitude, marker.longitude]}
              eventHandlers={{
                click: () =>
                  setSelectedMarker(
                    markers.find((obj) => obj.id === marker.id)
                  ),
              }}
            >
              <Popup>
                <div className="marker-popup">
                  <h3>{marker.name}</h3>
                  <p>{marker.description}</p>
                  <p>{marker.categories.join(", ")}</p>
                  <button
                    onClick={() => {
              
                      setMarkers((prev) => {
                        const updatedMarkers = prev.filter((m) => m.id !== marker.id);
                    
                        const remainingCategories = new Set();
                        updatedMarkers.forEach((m) => {
                          m.categories.forEach((cat) => remainingCategories.add(cat));
                        });
                    
                        setFilters((prevFilters) =>
                          prevFilters.filter(
                            (f) => baseFilters.includes(f) || remainingCategories.has(f)
                          )
                        );
                    
                        return updatedMarkers;
                      });
                    
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
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
