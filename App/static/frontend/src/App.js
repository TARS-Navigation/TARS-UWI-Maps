import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  Marker,
  Popup,
} from "react-leaflet";
import { useMapEvents } from "react-leaflet";
import L from "leaflet";
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
  //USER PERMISSIONS
  const [userPermissions, setUserPermissions] = useState(false);

  const getUserPermissions = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const data = await response.json();
      setUserPermissions(data.is_admin);

      console.log(data);
    } catch (err) {
      console.log("Error loading Markers:", err);
    }
  };

  //Marker State
  const [markers, setMarkers] = useState([]);
  const [markerDetails, setMarkerDetails] = useState({
    name: "",
    description: "",
    filters: [],
    icon: "",
  });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [hoverMarker, setHoveredMarker] = useState(null);
  const [filterMarkers, setFilteredMarkers] = useState([]);
  const [isPlacingMarker, setIsPlacingMarker] = useState(false);

  //Sidebar State
  const [activeOption, setActiveOption] = useState(null);

  //Filter State
  const [customFilterMap, setCustomFilterMap] = useState({});
  const [filters, setFilters] = useState([]);
  const [baseFilters, setBaseFilters] = useState([]);
  const [filterMap, setFilterMap] = useState({});
  const [visitedAchievements, setVisitedAchievements] = useState({});
  const [activeFilters, setActiveFilters] = useState([]);

  //These states are managed by AddMarker form
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  //Load Markers from database
  const getAllMarkers = async () => {
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
          icon: marker.icon,
          lattitude: marker.lattitude,
          longitude: marker.longitude,
          is_global: marker.is_global,
          achievement_id: marker.achievement_id || null,
        };
        setMarkers((prev) => [...prev, newMarker]);
      });
    } catch (err) {
      console.log("Error loading Markers:", err);
    }
  };

  //Load Filters from database
  const getAllFilters = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("/filters", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const data = await response.json();

      data.forEach((filter) => {
        setFilters((prev) => [...prev, filter.name]);

        if (filter.creator_id === null)
          setBaseFilters((prev) => [...prev, filter.name]);

        setFilterMap((prev) => ({
          ...prev,
          [filter.name]: filter.id,
        }));
      });
    } catch (err) {
      console.log("Error loading Filters:", err);
    }
  };

  //Load in all Database Variables
  useEffect(() => {
    async function fetchData(){
      getUserPermissions();
      getAllMarkers();
      getAllFilters();
    }

    fetchData();
  }, []);

  useEffect(() => {
    const loadVisitedAchievements = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("/api/visited-achievements", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const visitedMap = {};
          data.forEach((id) => {
            visitedMap[id] = true;
          });
          setVisitedAchievements(visitedMap);
        }
      } catch (err) {
        console.log("Error loading visited achievements:", err);
      }
    };

    loadVisitedAchievements();
  }, []);

  //Changes Cusor if Placing Marker
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


    // Final filtered markers
    setFilteredMarkers(markers.filter((m) => visibleMarkerIds.has(m.id)));
  }, [activeFilters, markers, customFilterMap]);

  //Adds new marker to state and database
  const AddNewMarker = async (lattitude, longitude) => {
    try {
      const token = localStorage.getItem("access_token");

      const newMarker = {
        name: markerDetails.name,
        parent_id: null,
        description: markerDetails.description,
        icon: markerDetails.icon,
        filter_names: markerDetails.filters,
        lattitude: lattitude,
        longitude: longitude,
      };

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
        icon: data.icon,
        lattitude: data.lattitude,
        longitude: data.longitude,
        is_global: data.is_global,
        achievement_id: data.achievement_id || null,
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
       await fetch(`/markers/${selectedMarker.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      setMarkers((prev) => {
        const updatedMarkers = prev.filter((m) => m.id !== selectedMarker.id);

        checkMarkers(updatedMarkers);

        return updatedMarkers;
      });
      setSelectedMarker(null);
    } catch (err) {
      console.log("Error deleting marker:", err);
    }
  };

  //Called to remove any filters no longer associated with a marker
  const checkMarkers = async (updatedMarkers) => {
    const remainingfilters = new Set();
    updatedMarkers.forEach((m) => {
      m.filters.forEach((cat) => remainingfilters.add(cat));
    });

    for (let filter of filters) {
      if (!baseFilters.includes(filter) && !remainingfilters.has(filter)) {
        try {
          const token = localStorage.getItem("access_token");
          await fetch(`/filters/${filterMap[filter]}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          });
          setFilterMap((prev) => {
            const newMap = { ...prev };
            delete newMap[filter];
            return newMap;
          });
        } catch (err) {
          console.log("Error deleting Filter:", err);
        }
      }
    }

    setFilters((prevFilters) =>
      prevFilters.filter(
        (f) => baseFilters.includes(f) || remainingfilters.has(f)
      )
    );
  };

  const toggleVisited = async (achievementId) => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`/visit/${achievementId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      setVisitedAchievements((prev) => ({
        ...prev,
        [achievementId]: data.visited,
      }));
    }
  };

  const iconNames = [
    "redmarker",
    "blackmarker",
    "bluemarker",
    "coffee",
    "food",
    "greenmarker",
    "landmark",
    "orangemarker",
    "purplemarker",
    "recreation",
    "shop",
    "sport1",
    "sport2",
    "yellowmarker",
    "appartment",
  ];

  const icons = iconNames.reduce((acc, name) => {
    acc[name] = new L.divIcon({
      className: `ui-marker`,
      html: `<div class="marker-wrapper"><img src=${require(`./Icons/${name}.png`)} alt="${name}" /></div>`,
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38],
    });
    return acc;
  }, {});

  console.log(filterMarkers);
  return (
    <div className="ui-container">
      <Header />
      <Sidebar
        userPermissions={userPermissions}
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
        filterMap={filterMap}
        setFilterMap={setFilterMap}
        baseFilters={baseFilters}
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
                if (markerDetails.filters) {
                  markerDetails.filters.forEach((filter) => {
                    if (!filters.includes(filter))
                       setFilters((prev) => [...prev, filter]);
                  });
                }

                AddNewMarker(lat, lng);
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
              icon={L.divIcon({
                ...icons[marker.icon].options,
                className: `ui-marker ${
                  hoverMarker === marker.id ? "hovered" : ""
                } ${selectedMarker?.id === marker.id ? "selected" : ""}`,
              })}
              eventHandlers={{
                click: () =>
                  setSelectedMarker(
                    markers.find((obj) => obj.id === marker.id)
                  ),
                mouseover: () => setHoveredMarker(marker.id),
                mouseout: () => setHoveredMarker(null),
              }}
            >
              <Popup>
                <div className="marker-popup">
                  {marker.is_global && !userPermissions ? (
                    <>
                      <h3>{marker.name}</h3>
                      <p>Created by admin</p>
                    </>
                  ) : (
                    <h3>{marker.name}</h3>
                  )}
                  <p>{marker.description}</p>
                  <p>{marker.filters.join(", ")}</p>

                  {marker.achievement_id && (
                    <label>
                      <input
                        type="checkbox"
                        checked={
                          visitedAchievements[marker.achievement_id] || false
                        }
                        onChange={() => toggleVisited(marker.achievement_id)}
                      />
                      Visited?
                    </label>
                  )}

                  {!marker.is_global || userPermissions === true ? (
                    <button
                      onClick={() => {
                        removeMarker();
                      }}
                    >
                      Remove Marker
                    </button>
                  ) : null}
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
