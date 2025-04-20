import React, { useState, useEffect } from "react";

import "../Styles/filter_options.css";

//You can merge AddFilter, UpdateFilter and RemoveFilter into one component if you want
//and call it Edit filters or Manage filters or something like that
//*I gonna keep it as EditFilter for now but if you find the addfilter updatefilter and remove filter
// better then keep that*

//The toggle filter component would be where you set the active filters
export function EditFilter(props) {
  return <div></div>;
}

export function AddCustomFilter(props) {
  const [title, setTitle ] = useState("");
  const [selectedMarkerIds, setSelectedMarkerIds ] = useState([]);

  const handleMarkerToggle  = (id) => {
    setSelectedMarkerIds((prev) =>
      prev.includes(id)
      ? prev.filter((mId) => mId !== id)
      : [...prev, id]
    );
  };

  const handleSave = () => {
    if(!title.trim()) 
      return

    if(!props.filters.includes(title)){
      props.setFilters((prev) => [...prev, title]);
    }

    if(props.setCustomFilterMap){
      props.setCustomFilterMap((prev) => ({
        ...prev,
        [title]: selectedMarkerIds,
      }));
    }

    setTitle("");
    setSelectedMarkerIds([]);
  };

  return(
    <div className ="filter-form">
      <h2>Create Custom Filter</h2>
      <label> Custom Filter Title: </label>
      <input
      type = "text" 
      value = {title}
      onChange = {(e) => setTitle(e.target.value)}
      placeholder = "eg. Best UWI spots to play fours"
      />

      <label>Select Markers you want: </label>
      <ul>
        {props.markers.map((marker) => (
          <li key={marker.id}>
            <label>
              <input 
              type = "checkbox"
              checked = {selectedMarkerIds.includes(marker.id)}
              onChange = {() => handleMarkerToggle(marker.id)}
              />
              {marker.name}
            </label>
          </li>
        ))}
      </ul>

      <button onClick = {handleSave}> Save Filter</button>

    </div>
  )


}


export function ToggleFilter(props) {
  const handleFilterChange = (e) => {
    const {value, checked } = e.target;

    props.setActiveFilters((prev) =>
      checked
        ? [...prev, value] 
        : prev.filter((v) => v !== value) 
    );
  };


  return (
    <div>
      <ul className="filter-list">
        {props.filters.map((filter) => (
          <li key={filter} className="filter-item">
            <label>
              <input
                type="checkbox"
                value={filter}
                checked={props.activeFilters.includes(filter)}
                onChange={handleFilterChange}
              />
              {filter}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
