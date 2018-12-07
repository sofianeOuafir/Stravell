import React from "react";

const PageHeader = props => (
  <div className={props.className ? props.className : "page-header"}>
    <div className="content-container">
      {props.children ? (
        props.children
      ) : (
        <h1 className="page-header__title">{props.title}</h1>
      )}
    </div>
  </div>
);

export default PageHeader;
