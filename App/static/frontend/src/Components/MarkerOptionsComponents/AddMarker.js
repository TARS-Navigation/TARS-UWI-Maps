import React, { useState } from "react";

import "../../Styles/add_marker.css";

export default function AddMarker(props) {
  const [selectedCategories, setSelectedCategories] = useState([
    "Science and Technology",
  ]);
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

  const addMarker = (e) => {
    e.preventDefault();
    props.setIsPlacingMarker(true);

    const formData = new FormData(e.target);
    const markerName = formData.get("marker-name");
    const markerDescription = formData.get("marker-description");

    props.setMarkerDetails({
      name: markerName,
      description: markerDescription,
      filters: selectedCategories,
      icon: selectedIcon,
    });
  };

  return (
    <div className="marker-options-contianer">
      <form className="marker-options-form" onSubmit={addMarker}>
        <h2 className="marker-form-name">Add Marker</h2>

        <label className="marker-form-label" htmlFor="marker-name">
          Marker Name:
        </label>
        <input
          className="marker-name-input-field"
          type="text"
          id="marker-name"
          name="marker-name"
          required
        />
        <p>This will be the name of the marker you create</p>

        <label className="marker-form-label" htmlFor="marker-description">
          Description:
        </label>
        <textarea
          id="marker-description"
          className="marker-description-input-field"
          name="marker-description"
          required
        ></textarea>
        <p>This will be the description of the marker you create</p>

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

        <p>
          You can add your own custom category with the 'new category' field
        </p>
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
          <p>These are the categories you will add to this marker</p>
        </div>

        <button type="submit">Add Marker</button>
      </form>
    </div>
  );
}