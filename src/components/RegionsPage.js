import React from "react";
import { slugify } from "underscore.string";

import Layout from "./Layout";
import FilterableDataList from "./FilterableDataList";
import { getCountry } from "../queries/country";
import { getCountryRegions } from "../queries/region";
import { getCountryPlaces } from "../queries/place";
import Place from "./Place";
import RegionList from "./RegionList";
import LandingPageBanner from "./LandingPageBanner";

class RegionsPage extends React.Component {
  render() {
    const { country, regions, places } = this.props;
    const {
      country: countryName,
      countryNorthEastLat,
      countryNorthEastLng,
      countrySouthWestLat,
      countrySouthWestLng,
      id
    } = country;
    const breadcrumbLinks = [
      { href: "/", text: "Home" },
      {
        href: `/country?countryCode=${id}`,
        as: `/country/${id}`,
        text: countryName
      },
      {
        href: `/regions?countryCode=${id}`,
        as: `/${slugify(countryName)}/${id}/regions`,
        text: "Search By State / Region",
        active: true
      }
    ];
    return (
      <Layout
        title={`Stravell | Regions of ${countryName}`}
        description={`Regions of ${countryName}`}
      >
        <LandingPageBanner
          imageUrl={`https://source.unsplash.com/1026x405/?${countryName}`}
          place={countryName}
          placeSuggestions={[countryName]}
        />
        <div className="content-container">
          <FilterableDataList
            DataList={RegionList}
            data={regions}
            noDataText={`There is no region for ${countryName} yet.`}
            googleMapsProps={{
              isMarkerShown: true,
              places,
              northEastLat: countryNorthEastLat,
              northEastLng: countryNorthEastLng,
              southWestLat: countrySouthWestLat,
              southWestLng: countrySouthWestLng
            }}
            breadCrumbProps={{
              links: breadcrumbLinks
            }}
          />
        </div>
      </Layout>
    );
  }
}

RegionsPage.getInitialProps = async function({ query }) {
  const { countryCode } = query;
  const country = await getCountry(countryCode);
  const regions = await getCountryRegions(countryCode);
  const places = await getCountryPlaces(countryCode);
  return { country, regions, places };
};

export default RegionsPage;
