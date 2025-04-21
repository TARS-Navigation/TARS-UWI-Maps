import React, { useState } from "react";

import "../../Styles/filter_options.css";
import "../../Styles/toggle_filter.css";

export default function ToggleFilter(props) {
  const handleFilterChange = (e) => {
    const { value, checked } = e.target;

    props.setActiveFilters((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };

  return (
    <div>
      <div className="filter-list-2">
        {props.filters.map((filter) => (
          <div className="filter-item">
            <input
              type="checkbox"
              className="filter-icon-input"
              value={filter}
              checked={props.activeFilters.includes(filter)}
              onChange={handleFilterChange}
            />
            <div className="filter-item-name">{filter}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
