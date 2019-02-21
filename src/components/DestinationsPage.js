import React from "react";

import GoogleMaps from "./GoogleMaps";
import Layout from "./Layout";
import PageHeader from "./PageHeader";
import { getCountries } from "../queries/country";
import CountryList from "./CountryList";
import { getPlaces } from "./../queries/place";

import {
  DESTINATIONS_PAGE_TITLE,
  DESTINATIONS_PAGE_DESCRIPTION
} from "../constants/constants";
class DestinationsPage extends React.Component {
  render() {
    const { countries, places } = this.props;
    return (
      <Layout
        title={DESTINATIONS_PAGE_TITLE}
        description={DESTINATIONS_PAGE_DESCRIPTION}
      >
        <PageHeader title="Destinations" />
        <div className="content-container">
          <GoogleMaps showWholeWorld isMarkerShown places={places} />
          <CountryList countries={countries} />
        </div>
      </Layout>
    );
  }
}

DestinationsPage.getInitialProps = async function() {
  const countries = await getCountries();
  const places = await getPlaces();
  return { countries, places };
};

export default DestinationsPage;
