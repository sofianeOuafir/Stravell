import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "./PageHeader";

const NotFoundPage = () => (
  <PageHeader>
    404 - <Link to="/">Go home</Link>
  </PageHeader>
);

export default NotFoundPage;
