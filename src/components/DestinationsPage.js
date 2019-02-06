import React from "react";

import Layout from "./Layout";
import PageHeader from "./PageHeader";
import { getCountries } from "../queries/country";
import CountryList from './CountryList';
class DestinationsPage extends React.Component {
  render() {
    const { countries } = this.props;
    return (
      <Layout title="Stravell | Destinations" description="test">
        <PageHeader title="Destinations" />
        <div className="content-container">
          <CountryList countries={countries} />
        </div>
      </Layout>
    );
  }
}

DestinationsPage.getInitialProps = async function() {
  const countries = await getCountries();
  return { countries };
};

export default DestinationsPage;
