import React, { useState } from "react";

import "../../Styles/filter_options.css";


export default function ToggleFilter(props) {
  const handleFilterChange = (e) => {
    const { value, checked } = e.target;

    props.setActiveFilters((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };

  return (
    <div>
      <ul className="filter-list-2">
        {props.filters.map((filter) => (
          <li key={filter} className="filter-item-2">
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