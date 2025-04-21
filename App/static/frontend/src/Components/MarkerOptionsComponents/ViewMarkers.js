import React from "react";

import "../../Styles/marker_options.css";

export default function ViewMarkers(props) {
  return (
    <div className="marker-options-contianer">
      <div className="marker-view">
        <h2>View Markers</h2>
        <ul className="marker-list-vertical">
          {props.markers.map((marker, index) => (
            <li key={index} className="marker-item-vertical">
              <p><strong>Name:</strong> {marker.name}</p>
              <p><strong>Description:</strong> {marker.description}</p>
              <p><strong>Categories:</strong> {Array.isArray(marker.filters) ? marker.filters.join(", ") : marker.filters}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}