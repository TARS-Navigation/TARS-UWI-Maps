import React  from "react";

import "../../Styles/remove_marker.css";


export default function RemoveMarker(props) {
  const removeMarker = async () => {
    try {
      if (props.selectedMarker == null) return;
      const token = localStorage.getItem("access_token");
      await fetch(`/markers/${props.selectedMarker.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
    } catch (err) {
      console.log("Error deleting marker:", err);
    }

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
        {props.selectedMarker && (!props.selectedMarker.is_global || props.userPermissions) ?(
          <>
            <div className="marker-details">
              <p><strong>Name:</strong> {props.selectedMarker.name}</p>
              <p><strong>Description:</strong> {props.selectedMarker.description}</p>
              <p><strong>Categories:</strong> {props.selectedMarker.filters.join(", ")}</p>
            </div>
            <button onClick={removeMarker}>Remove Marker</button>
          </>
        ) :
        <div>Can not Edit Admin Marker</div>}
      </div>
    </div>
  );
}