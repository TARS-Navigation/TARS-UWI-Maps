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
  return (
    <div className="filter-placeholder">
      <h2>Add Custom Filter</h2>
      <p>Need to implement logic where we add markers to filters. </p>
       <p>  There will be a dropdown of all markers here.</p>
       <p>  Then add it to toggle filters list</p>
    </div>
  );
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
