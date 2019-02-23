import React from "react";

import Layout from "./Layout";
import PageHeader from "./PageHeader";
import { getCountries } from "../queries/country";
import CountryList from "./CountryList";
import { getAllPlaces } from "./../queries/place";
import FilterableDataList from "./FilterableDataList";

import {
  DESTINATIONS_PAGE_TITLE,
  DESTINATIONS_PAGE_DESCRIPTION
} from "../constants/constants";
class DestinationsPage extends React.Component {
  render() {
    const { countries, places } = this.props;
    const breadcrumbLinks = [
      { href: "/", text: "Home" },
      {
        href: `/destinations`,
        text: "Destinations",
        active: true
      }
    ];
    const googleMapsProps = {
      showWholeWorld: true,
      isMarkerShown: true,
      places
    };
    return (
      <Layout
        title={DESTINATIONS_PAGE_TITLE}
        description={DESTINATIONS_PAGE_DESCRIPTION}
      >
        <PageHeader title="Destinations" />
        <div className="content-container">
          <FilterableDataList
            DataList={CountryList}
            googleMapsProps={googleMapsProps}
            noDataText={"There is no country yet."}
            data={countries}
            breadCrumbProps={{
              links: breadcrumbLinks
            }}
          />
        </div>
      </Layout>
    );
  }
}

DestinationsPage.getInitialProps = async function() {
  const countries = await getCountries();
  const places = await getAllPlaces();
  return { countries, places };
};

export default DestinationsPage;
