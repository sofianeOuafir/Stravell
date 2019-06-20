import React from "react";

const Loader = ({ size, color = "black" }) =>
  color === "white" ? (
    <img
      style={{ height: size, width: size }}
      src="/static/images/loader-white.svg"
    />
  ) : (
    <img
      style={{ height: size, width: size }}
      src="/static/images/loader-black.svg"
    />
  );

export default Loader;
