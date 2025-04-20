import React, { useState, useEffect } from "react";

import "../Styles/marker_options.css";

//DONT EDIT THIS FILE UNLESS YOU FULLY UNDERSTAND IT
//This file contains the components that are used to add, remove, view, and update markers on the map.
//The components are used in the sidebar and are passed props from the sidebar to manage the state of the markers.

//NOTE FOR WHEN STYLING:
//You can change the style of the html parts for the form
//BUT DONT REMOVE THE EXISTING HTML ELEMENTS OR THE FUNCTIONALITY WILL BREAK

export function AddMarker(props) {
  const addMarker = (e) => {
    e.preventDefault();
    props.setIsPlacingMarker(true);

    const formData = new FormData(e.target);
    const markerName = formData.get("marker-name");
    const markerDescription = formData.get("marker-description");
    const markerCategory = formData.get("marker-category");

    props.setMarkerDetails({
      name: markerName,
      description: markerDescription,
      categories: [markerCategory]
    });
  };

  return (
    <div className="marker-options-contianer">
      <form className="marker-options-form" onSubmit={addMarker}>
        <h2>Add Marker</h2>
        <label htmlFor="marker-name">Marker Name:</label>
        <input type="text" id="marker-name" name="marker-name" required />

        <label htmlFor="marker-description">Description:</label>
        <textarea
          id="marker-description"
          name="marker-description"
          required
        ></textarea>
        <label htmlFor="marker-categories">Marker Category:</label>
        <select name="marker-category" id="marker-category">
          {props.filters.map((filter) => (
            <option value={filter}> {filter}</option>
          ))}
        </select>
        <button type="submit">Add Marker</button>
      </form>
    </div>
  );
}

export function RemoveMarker(props) {
  const removeMarker = () => {
    props.setMarkers((prevMarkers) => {
      return prevMarkers.filter(
        (marker) => marker.id !== props.selectedMarker.id
      );
    });
    props.setSelectedMarker(null);
  };

  return (
    <div className="marker-options-contianer">
      <div className="marker-remove">
        <h2>Remove Marker</h2>
        <p>Click on the marker you want to remove.</p>
        <h2>Selected Marker: </h2>
        {props.selectedMarker && (
          <div className="marker-details">
            <h3>{props.selectedMarker.name}</h3>
            <p>{props.selectedMarker.description}</p>
            <p>{props.selectedMarker.categories}</p>
          </div>
        )}
        <button onClick={removeMarker}>Remove Marker</button>
      </div>
    </div>
  );
}
export function ViewMarkers(props) {
  return (
    <div className="marker-options-contianer">
      <div className="marker-view">
        <h2>View Markers</h2>
        <ul className="marker-list">
          {props.markers.map((marker, index) => (
            <li key={index} className="marker-item">
              <h3>{marker.name}</h3>
              <p>{marker.description}</p>
              <p>{marker.categories}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function UpdateMarker(props) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (props.selectedMarker) {
      setFormData({
        name: props.selectedMarker.name || "",
        description: props.selectedMarker.description || "",
      });
    }
  }, [props.selectedMarker]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateMarker = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const markerName = formData.get("name");
    const markerDescription = formData.get("description");

    props.setMarkers((prevMarkers) => {
      return prevMarkers.map((marker) => {
        if (marker.id === props.selectedMarker.id) {
          return {
            ...marker,
            name: markerName,
            description: markerDescription,
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

          <button type="submit">Update Marker</button>
        </form>
      )}
    </div>
  );
}
