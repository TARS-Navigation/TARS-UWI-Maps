import React from "react";

import "../Styles/marker_options.css";

export function AddMarker(props) {
  return (
    <div className="marker-options-contianer">
        <form className="marker-options-form">
            <h2>Add Marker</h2>
            <label htmlFor="marker-name">Marker Name:</label>
            <input type="text" id="marker-name" name="marker-name" required />
    
            <label htmlFor="marker-description">Description:</label>
            <textarea
                id="marker-description"
                name="marker-description"
                required
            ></textarea>
    
            <label htmlFor="marker-location">Location:</label>
            <input type="text" id="marker-location" name="marker-location" required />
    
            <button type="submit">Add Marker</button>

        </form>
    </div>
  );
}

export function RemoveMarker(props) {
  return (
    <div className="marker-options-contianer">
        <form className="marker-options-form">
            <h2>Add Marker</h2>
            <label htmlFor="marker-name">Marker Name:</label>
            <input type="text" id="marker-name" name="marker-name" required />
    
            <label htmlFor="marker-description">Description:</label>
            <textarea
                id="marker-description"
                name="marker-description"
                required
            ></textarea>
    
            <label htmlFor="marker-location">Location:</label>
            <input type="text" id="marker-location" name="marker-location" required />
    
            <button type="submit">Add Marker</button>

        </form>
    </div>
  );
}
export function ViewMarkers(props) {
  return (
    <div className="marker-options-contianer">
        <form className="marker-options-form">
            <h2>Add Marker</h2>
            <label htmlFor="marker-name">Marker Name:</label>
            <input type="text" id="marker-name" name="marker-name" required />
    
            <label htmlFor="marker-description">Description:</label>
            <textarea
                id="marker-description"
                name="marker-description"
                required
            ></textarea>
    
            <label htmlFor="marker-location">Location:</label>
            <input type="text" id="marker-location" name="marker-location" required />
    
            <button type="submit">Add Marker</button>

        </form>
    </div>
  );
}

export function UpdateMarker(props) {
  return (
    <div className="marker-options-contianer">
        <form className="marker-options-form">
            <h2>Add Marker</h2>
            <label htmlFor="marker-name">Marker Name:</label>
            <input type="text" id="marker-name" name="marker-name" required />
    
            <label htmlFor="marker-description">Description:</label>
            <textarea
                id="marker-description"
                name="marker-description"
                required
            ></textarea>
    
            <label htmlFor="marker-location">Location:</label>
            <input type="text" id="marker-location" name="marker-location" required />
    
            <button type="submit">Add Marker</button>

        </form>
    </div>
  );
}
