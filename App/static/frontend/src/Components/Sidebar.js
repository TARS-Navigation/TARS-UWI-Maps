import React, { useState } from "react";
import AddMarker from "./MarkerOptionsComponents/AddMarker";
import RemoveMarker from "./MarkerOptionsComponents/RemoveMarker";
import ViewMarkers from "./MarkerOptionsComponents/ViewMarkers";
import UpdateMarker from "./MarkerOptionsComponents/UpdateMarker";
import ToggleFilter from "./FilterOptionsComponents/ToggleFilter";
import EditFilter from "./FilterOptionsComponents/EditFilter";
import AddCustomFilter from "./FilterOptionsComponents/AddCustomFilter"

import "../Styles/sidebar.css";

export function Sidebar(props) {
  const [prevOption, setPrevOption] = useState(null);

  //This is the map of components that will be rendered in the sidebar.
  //The keys are the names of the components, and the values are the components themselves.
  //For any new component, add it to this map and create a new entry in the sidebar.
  const componentMap = {
    AddMarker: AddMarker,
    RemoveMarker: RemoveMarker,
    ViewMarkers: ViewMarkers,
    UpdateMarker: UpdateMarker,
    ToggleFilters: ToggleFilter,
    EditFilters: EditFilter,
    AddCustomFilters: AddCustomFilter,
    null: () => <div></div>,
  };

  return (
    <div
      className={`ui-sidebar-container ${
        props.activeOption != null ? "ui-sidebar-container-overflow" : ""
      }`}
    >
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
        {/* 
          This is where the dropdown option's component will be rendered, so the form for the 'Add Marker' 
          component will be rendered here and is dynamically created based on the active option.
          If you are adding a new component that needs props be sure to add them to the props arguemen
          in the React.createElement function call below.
        */}
        {props.activeOption != null
          ? React.createElement(componentMap[props.activeOption], {
              //Pass in the props that are needed for the component here.
              setMarkerDetails: props.setMarkerDetails,
              userPermissions: props.userPermissions,
              markers: props.markers,
              setMarkers: props.setMarkers,
              selectedMarker: props.selectedMarker,
              setSelectedMarker: props.setSelectedMarker,
              setIsPlacingMarker: props.setIsPlacingMarker,
              filters: props.filters,
              setFilters: props.setFilters,
              activeFilters: props.activeFilters,
              setActiveFilters: props.setActiveFilters,
              setSelectedCategory: props.setSelectedCategory,
              setCustomCategory: props.setCustomCategory,
              customCategory: props.customCategory,
              customFilterMap: props.customFilterMap,
              setCustomFilterMap: props.setCustomFilterMap,
              filterMap : props.filterMap,
              setFilterMap: props.setFilterMap,
              baseFilters: props.baseFilters
            })
          : React.createElement(componentMap[prevOption], {
              //Pass in the SAME props that are needed for the component here ALSO else code will break.
              setMarkerDetails: props.setMarkerDetails,
              userPermissions: props.userPermissions,
              markers: props.markers,
              setMarkers: props.setMarkers,
              selectedMarker: props.selectedMarker,
              setSelectedMarker: props.setSelectedMarker,
              setIsPlacingMarker: props.setIsPlacingMarker,
              filters: props.filters,
              setFilters: props.setFilters,
              activeFilters: props.activeFilters,
              setActiveFilters: props.setActiveFilters,
              setSelectedCategory: props.setSelectedCategory,
              setCustomCategory: props.setCustomCategory,
              customCategory: props.customCategory,
              customFilterMap: props.customFilterMap,
              setCustomFilterMap: props.setCustomFilterMap,
              filterMap : props.filterMap,
              setFilterMap :props.setFilterMap,
              baseFilters: props.baseFilters
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
        className={`ui-sidebar-button ${isOpen ? "glow-active" : ""}`}
        id={props.name}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {/*Achievements does not have an arrow so I do a check to render it correctly */}
        {props.name !== "Achievements" ? (
          <div className="sidebar-button-content">
            <div className="sidebar-icon">{props.icon}</div>
            <div className="sidebar-name">{props.name}</div>
            <div className="sidebar-arrow">{isOpen ? "▼" : "▶"}</div>
          </div>
        ) : (
          <div className="sidebar-button-content">
            <div className="sidebar-name">{props.name}</div>
          </div>
        )}
      </button>

      {/*This is the dropdown menu that will be rendered when the button is clicked.*/}
      {/*I do a check to see if the name is not achievements, because achievements does not have a dropdown.*/}
      {/*The dropdown will be open if the isOpen state is true.*/}
      {/*The selections are passed in as props and are mapped to create the list items.*/}
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
