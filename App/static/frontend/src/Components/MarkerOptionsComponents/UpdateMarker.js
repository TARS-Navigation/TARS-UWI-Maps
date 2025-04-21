import React, { useState, useEffect } from "react";

import "../../Styles/marker_options.css";

export default function UpdateMarker(props) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState("redmarker");

  const icons = [
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
  ];

  const changeSelectedCategories = () => {
    const selectedValue = document.getElementById("marker-category").value;

    setSelectedCategories((prev) => {
      if (!prev.includes(selectedValue)) return [...prev, selectedValue];
      else return prev;
    });
  };

  const addCustomCategory = () => {
    const customValue = document.getElementById("custom-category").value;
    if (customValue === "") return;

    setSelectedCategories((prev) => {
      if (!prev.includes(customValue)) return [...prev, customValue];
      else return prev;
    });
  };

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (props.selectedMarker) {
      setFormData({
        name: props.selectedMarker.name || "",
        description: props.selectedMarker.description || "",
        filters: props.selectedMarker.filters || "",
      });
      setSelectedIcon(props.selectedMarker.icon);
      setSelectedCategories(props.selectedMarker.filters);
    }
  }, [props.selectedMarker]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNewFilters = async () => {
    try {
      const token = localStorage.getItem("access_token");
      for (let category of selectedCategories) {
        if (!props.filters.includes(category)) {
          const response = await fetch("/filters", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
            body: JSON.stringify({name:category}),
          });
          
          const data = await response.json();

          props.setFilters((prev) => [...prev, data.name]);
          props.setFilterMap((prev)=> ({
            ...prev,
            [data.name]: data.id,
          }))
        }
      }
    } catch (err) {
      console.log("Error loading Markers:", err);
    }
  };

  const updateMarker = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const markerName = formData.get("name");
    const markerDescription = formData.get("description");

    await addNewFilters();
    props.setMarkers((prevMarkers) => {
      return prevMarkers.map((marker) => {
        if (marker.id === props.selectedMarker.id) {
          return {
            ...marker,
            name: markerName,
            description: markerDescription,
            filters: selectedCategories,
            icon: selectedIcon
          };
        }
        return marker;
      });
    });
    props.setSelectedMarker(null);
  };

  return (
    <div className="marker-options-contianer">
      <h2>Update Marker</h2>
      <h4>Select a Marker to be updated</h4>
      {props.selectedMarker && (
        <form className="marker-options-form" onSubmit={updateMarker}>
          <h3>Selected Marker</h3>

          <label htmlFor="marker-name">Marker Name:</label>
          <input
            type="text"
            id="marker-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="marker-description">Description:</label>
          <textarea
            id="marker-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>

          <label className="marker-form-label" htmlFor="marker-icon">
            Icon:
          </label>
          <div className="marker-icon-select-container">
            {icons.map((icon) => (
              <img
                src={`${require(`../../Icons/${icon}.png`)}`}
                alt={`${icon}`}
                className={`icon-option ${
                  selectedIcon === icon ? "icon-option-active" : ""
                }`}
                onClick={() => {
                  setSelectedIcon(icon);
                }}
              />
            ))}
          </div>

          <label className="marker-form-label" htmlFor="marker-categories">
            Marker Category:
          </label>
          <div className="category-container">
            <select name="marker-category" id="marker-category" required>
              {props.filters.map((filter) => (
                <option key={filter} value={filter}>
                  {filter}
                </option>
              ))}
            </select>
            <div
              className="category-add-button"
              onClick={changeSelectedCategories}
            >
              add
            </div>
          </div>

          <label className="marker-form-label" htmlFor="custom-category">
            Custom category:
          </label>
          <div className="custom-category-container">
            <input
              type="text"
              id="custom-category"
              name="custom-category"
              placeholder="Custom category"
            />
            <div className="category-add-button" onClick={addCustomCategory}>
              add
            </div>
          </div>

          <label className="marker-form-label" htmlFor="selected-categories">
            Selected Categories
          </label>
          <div className="selected-categories-container">
            <textarea
              id="selected-categories"
              className="marker-selected-categories-field"
              name="marker-description"
              value={selectedCategories}
              required
            ></textarea>
            <div
              className="reset-categories-button"
              onClick={() => {
                setSelectedCategories([]);
              }}
            >
              reset
            </div>
          </div>

          <button type="submit">Update Marker</button>
        </form>
      )}
    </div>
  );
}