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
      console.log(lat, lng);
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
    filters: [],
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
    "Recreation",
  ];

  const [customFilterMap, setCustomFilterMap] = useState({});
  const [filters, setFilters] = useState([...baseFilters]);

  const [activeFilters, setActiveFilters] = useState([]);

  // These states are managed by AddMarker form
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  //Load Markers from database
  useEffect(async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("/markers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const data = await response.json();

      data.forEach((marker) => {
        let newMarker = {
          id: marker.id,
          name: marker.name,
          description: marker.description,
          filters: marker.filters.map((f) => f.name),
          lattitude: marker.lattitude,
          longitude: marker.longitude,
        };
        console.log(data);
        setMarkers((prev) => [...prev, newMarker]);
      });
    } catch (err) {
      console.log("Error loading Markers:", err);
    }
  }, []);

  useEffect(() => {
    const mapContainer = document.getElementById("map");
    if (mapContainer) {
      mapContainer.classList.toggle("selecting-marker", isPlacingMarker);
    }
  }, [isPlacingMarker]);

  useEffect(() => {
    if (activeFilters.length === 0) {
      setFilteredMarkers(markers);
      return;
    } else {
      const filtered = markers.filter((marker) =>
        marker.filters.some((cat) => activeFilters.includes(cat))
      );
      setFilteredMarkers(filtered);
    }

    const visibleMarkerIds = new Set();

    console.log(" Active Filters:", activeFilters);

    console.log(" Custom Filter Map:", customFilterMap);

    console.log(" All Markers:", markers);

    // Loop through all markers
    markers.forEach((marker) => {
      // If this marker has a category that is toggled on
      if (marker.filters.some((cat) => activeFilters.includes(cat))) {
        visibleMarkerIds.add(marker.id);
      }

      // Check custom filters
      activeFilters.forEach((filter) => {
        if (customFilterMap[filter]?.includes(marker.id)) {
          visibleMarkerIds.add(marker.id);
        }
      });
    });

    console.log(" Filtered Marker IDs:", [...visibleMarkerIds]);

    // Final filtered markers
    setFilteredMarkers(markers.filter((m) => visibleMarkerIds.has(m.id)));
  }, [activeFilters, markers, customFilterMap]);

  //Adds new marker to state and database
  const AddNewMarker = async (finalCategory, lattitude, longitude) => {
    try {
      const token = localStorage.getItem("access_token");

      const newMarker = {
        name: markerDetails.name,
        parent_id: null,
        description: markerDetails.description,
        icon: "",
        filter_name: finalCategory,
        lattitude: lattitude,
        longitude: longitude,
      };
      console.log(finalCategory);
      const response = await fetch("/markers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(newMarker),
      });

      const data = await response.json();

      let marker = {
        id: data.id,
        name: data.name,
        description: data.description,
        filters: data.filters.map((f) => f.name),
        lattitude: data.lattitude,
        longitude: data.longitude,
      };

      setMarkers((prev) => [...prev, marker]);
    } catch (err) {
      console.log("Error loading Markers:", err);
    }
  };

  //Removes Marker from State and Database
  const removeMarker = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`/markers/${selectedMarker.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      setMarkers((prev) => {
        const updatedMarkers = prev.filter((m) => m.id !== selectedMarker.id);

        const remainingfilters = new Set();
        updatedMarkers.forEach((m) => {
          m.filters.forEach((cat) => remainingfilters.add(cat));
        });

        setFilters((prevFilters) =>
          prevFilters.filter(
            (f) => baseFilters.includes(f) || remainingfilters.has(f)
          )
        );

        return updatedMarkers;
      });
      setSelectedMarker(null);
    } catch (err) {
      console.log("Error deleting marker:", err);
    }
  };

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
        customFilterMap={customFilterMap}
        setCustomFilterMap={setCustomFilterMap}
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
                  customCategory.trim() !== ""
                    ? customCategory
                    : selectedCategory;

                if (finalCategory && !filters.includes(finalCategory)) {
                  setFilters((prev) => [...prev, finalCategory]);
                }

                AddNewMarker(finalCategory, lat, lng);
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
                  <p>{marker.filters.join(", ")}</p>
                  <button
                    onClick={() => {
                      removeMarker();
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
