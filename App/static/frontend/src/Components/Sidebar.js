import React, { useState } from "react";
import {
  AddMarker,
  RemoveMarker,
  ViewMarkers,
  UpdateMarker,
} from "./MarkerOptions";

import "../Styles/sidebar.css";

export function Sidebar(props) {
  const [prevOption, setPrevOption] = useState(null);

  const componentMap = {
    AddMarker: AddMarker,
    RemoveMarker: RemoveMarker,
    ViewMarkers: ViewMarkers,
    UpdateMarker: UpdateMarker,
    null: () => <div></div>,
  };

  return (
    <div className="ui-sidebar-container">
      <div
        className={`ui-sidebar-content ${
          props.activeOption != null ? "ui-sidebar-content-moved" : ""
        }`}
      >
        {props.children}
      </div>
      <div
        className={`secondary-content ${
          props.activeOption != null ? "secondary-content-open" : ""
        }`}
      >
        <button
          onClick={() => {
            setPrevOption(props.activeOption);
            props.changeActiveOption(null);
          }}
        >
          back
        </button>
        {props.activeOption != null
          ? React.createElement(componentMap[props.activeOption], {
              setMarkerDetails: props.setMarkerDetails,
              markers: props.markers,
              setMarkers: props.setMarkers,
              selectedMarker: props.selectedMarker,
              setSelectedMarker: props.setSelectedMarker,
              setIsPlacingMarker: props.setIsPlacingMarker
            })
          : React.createElement(componentMap[prevOption], {
              setMarkerDetails: props.setMarkerDetails,
              markers: props.markers,
              setMarkers: props.setMarkers,
              selectedMarker: props.selectedMarker,
              setSelectedMarker: props.setSelectedMarker,
              setIsPlacingMarker: props.setIsPlacingMarker
            })}
      </div>
    </div>
  );
}

export function SidebarItem(props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="ui-sidebar-button"
        id={props.name}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {props.name !== "Achievements" ? (
          <div className="sidebar-button-content">
            <div className="sidebar-icon">{props.icon}</div>
            <div className="siderbar-name">{props.name}</div>
            <div className="sidebar-arrow">{isOpen ? "▼" : "▶"}</div>
          </div>
        ) : (
          <div>{props.name}</div>
        )}
      </button>

      {props.name !== "Achievements" ? (
        <div
          className={`sidebar-dropdown ${
            isOpen ? "sidebar-dropdown-open" : ""
          }`}
        >
          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
            {props.selections &&
              props.selections.map((selection, index) => (
                <li
                  key={index}
                  className="sidebar-dropdown-item"
                  onClick={() => {
                    props.changeActiveOption(selection.replace(/\s/g, ""));
                  }}
                >
                  {selection}
                </li>
              ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}
