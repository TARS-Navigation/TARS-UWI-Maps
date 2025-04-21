import React from "react";

import "../../Styles/marker_options.css";

export default function ViewMarkers(props) {
  return (
    <div className="marker-options-contianer">
      <div className="marker-view">
        <h2>View Markers</h2>
        <ul className="marker-list">
          {props.markers.map((marker, index) => (
            <li key={index} className="marker-item">
              <h3>{marker.name}</h3>
              <p>{marker.description}</p>
              <p>{marker.filters}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}