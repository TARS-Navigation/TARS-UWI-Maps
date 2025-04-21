import React  from "react";

import "../../Styles/marker_options.css";


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
        {props.selectedMarker && (props.selectedMarker.is_global && props.userPermissions) ?(
          <>
            <div className="marker-details">
              <h3>{props.selectedMarker.name}</h3>
              <p>{props.selectedMarker.description}</p>
              <p>{props.selectedMarker.filters}</p>
            </div>
            <button onClick={removeMarker}>Remove Marker</button>
          </>
        ) :
        <div>Can not Edit Admin Marker</div>}
      </div>
    </div>
  );
}