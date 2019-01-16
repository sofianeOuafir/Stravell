import React from "react";

export const Checkbox = ({ onChange, checked, label, id }) => {
  return (
    <div>
      <input
        id={id}
        name={id}
        className="mr1"
        onChange={onChange}
        type="checkbox"
        checked={checked}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default Checkbox;
