import React, { useState } from "react";

import "../../Styles/filter_options.css";
import "../../Styles/add_custom_filter.css";

export default function AddCustomFilter(props) {
  const [title, setTitle] = useState("");
  const [selectedMarkerIds, setSelectedMarkerIds] = useState([]);

  const handleMarkerToggle = (id) => {
    setSelectedMarkerIds((prev) =>
      prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    try {
      const token = localStorage.getItem("access_token");
      const newFilter = {
        name: title,
        marker_ids: selectedMarkerIds,
      };
      

      if (!props.filters.includes(title)) {
        props.setFilters((prev) => [...prev, title]);
        const response = await fetch("/filters", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(newFilter),
        });
        const data = await response.json();
        console.log(data);

        props.setFilterMap((prev) => {
          const newMap = { ...prev };
          newMap[data.name] = data.id;
          return newMap;
        });

        if (props.setCustomFilterMap) {
          props.setCustomFilterMap((prev) => ({
            ...prev,
            [title]: selectedMarkerIds,
          }));
        }
      } else {
        const response = await fetch(`/filters/${props.filterMap[title]}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(newFilter),
        });
        const data = await response.json();
        console.log(data);

        props.setFilterMap((prev)=>{
          const newMap ={...prev};
          delete newMap[title];
          newMap[data.name] = data.id;
          return newMap;
        });

        if (props.setCustomFilterMap) {
          props.setCustomFilterMap((prev) => ({
            ...prev,
            [title]: selectedMarkerIds,
          }));
        }
      }
    } catch (err) {
      console.log("Error adding Filters:", err);
    }

    setTitle("");
    setSelectedMarkerIds([]);
    alert("Filter Saved!");
  };

  return (
    <div className="filter-form">
      <h2>Create Custom Filter</h2>
      <label> Custom Filter Title: </label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="eg. Best UWI spots to play fours"
      />

      <label>Select Markers you want: </label>
      <div className="available-marker-container">
        {props.markers.map((marker) => (
          <div className="marker-item">
            <input
              type="checkbox"
              checked={selectedMarkerIds.includes(marker.id)}
              onChange={() => handleMarkerToggle(marker.id)}
              className="marker-item-input"
            />
            <img
              className="marker-item-icon"
              src={`${require(`../../Icons/${marker.icon}.png`)}`}
              alt="ok"
            />
            <div className="marker-item-name">{marker.name}</div>
          </div>
        ))}
      </div>

      <button onClick={handleSave}> Save Filter</button>
    </div>
  );
}
