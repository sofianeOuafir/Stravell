import React from "react";
import uuid from "uuid";

export const Checkbox = ({ handleChange, checked, label }) => {
  const id = uuid();
  return (
    <div>
      <input
        id={id}
        name={id}
        className="mr1"
        onChange={handleChange}
        type="checkbox"
        checked={checked}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default Checkbox;
