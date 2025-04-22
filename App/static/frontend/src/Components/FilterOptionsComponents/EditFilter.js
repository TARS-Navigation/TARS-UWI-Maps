import React, { useState } from "react";

import "../../Styles/filter_options.css";

export default function EditFilter(props) {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedFilterName, setSelectedFilterName] = useState("");
  const [filterMarkers, setFilterMarkers] = useState([]);

  const changeSelectedFilter = async (filter) => {
    try {
      setSelectedFilter(filter);
      setSelectedFilterName(filter)
      console.log(props.filterMap[filter]);
      const token = localStorage.getItem("access_token");
      const response = await fetch(`/filters/${props.filterMap[filter]}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const data = await response.json();
      setFilterMarkers(data.markers);
    } catch (err) {
      console.log("Error loading Filter:", err);
    }
  };

  const updateFilter = async () => {
    try {
      const newFilter = {
        name: selectedFilterName,
        marker_ids: filterMarkers.map((marker) => marker.id),
      };
      const token = localStorage.getItem("access_token");
      const response = await fetch(`/filters/${props.filterMap[selectedFilter]}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(newFilter),
      });
      const data = await response.json();
      props.setFilters((prev) => [
        ...prev.filter((filter)=> filter !== selectedFilter),
        data.name
      ]);
      props.setFilterMap((prev)=>{
        const newMap ={...prev};
        delete newMap[selectedFilterName];
        newMap[data.name] = data.id;
        return newMap;
      });
      alert("Filter Updated!");
    } catch (err) {
      console.log("Error loading Filter:", err);
    }
  };

  const handleChange = (e) => {
    setSelectedFilterName(e.target.value);
  };

  const removeFilterMarker = (marker) => {
    setFilterMarkers((prev) => 
      prev.filter((m) => m.id != marker.id)
    );
  };

  const addFilterMarker = (marker) => {
    if(filterMarkers.map(m => m.id = marker.id))
        return
    setFilterMarkers((prev) => 
      [...prev, marker]
    );
  };

  return (
    <div className="filter-form">
      <h3>Filters Which Can Be Editted</h3>
      <div className="filter-list">
        {props.filters &&
          props.filters.map((filter) => (
            !props.baseFilters.includes(filter) &&(
            <div
              className="filter-item"
              onClick={() => {
                changeSelectedFilter(filter);
              }}
            >
              {filter}
            </div>
          )))}
      </div>
      <p>These are all the available filters which you may edit</p>
      {selectedFilter !== null ? (
        <>
          <div className="selected-filter-name-container">
            <label htmlFor="filter-name">Selected Filter:</label>
            <form>
              <input
                type="text"
                id="filter-name"
                name="filter-name"
                className="selected-filter"
                value={selectedFilterName}
                onChange={handleChange}
                required
              />
            </form>
          </div>
          <p>You may change the filters name in the field here!</p>
          <div>Markers in Filter:</div>
          <p>These are the markers that are currently assigned to this filter. Remove a marker by clicking the X next to the appropriate marker!</p>
          <div className="marker-list">
            {filterMarkers &&
              filterMarkers.map((marker) => (
                <div className="marker-item">
                  <img
                    className="marker-item-icon"
                    src={`${require(`../../Icons/${marker.icon}.png`)}`}
                  />
                  <div className="marker-item-name">{marker.name}</div>
                  <div
                    className="marker-item-remove"
                    onClick={() => {
                      removeFilterMarker(marker);
                    }}
                  >
                    {" "}
                    X{" "}
                  </div>
                </div>
              ))}
          </div>
          <div>Markers Available</div>
          <p>Want to add more markers to this filter? Choose from the list below and add any you wish with the add button! </p>
          <div className="available-marker-container">
            {props.markers &&
              props.markers.map((marker) => (
                <div className="marker-item">
                  <img
                    className="marker-item-icon"
                    src={`${require(`../../Icons/${marker.icon}.png`)}`}
                  />
                  <div className="marker-item-name">{marker.name}</div>
                  <div
                    className="marker-item-add"
                    onClick={() => {
                      addFilterMarker(marker);
                    }}
                  >
                    {" "}
                    add{" "}
                  </div>
                </div>
              ))}
          </div>
          <button onClick={() => {updateFilter(); setSelectedFilter(null)}}>confirm changes</button>
        </>
      ) : null}
    </div>
  );
}