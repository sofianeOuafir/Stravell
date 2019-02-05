import React from "react";
import Link from "next/link";
import Flag from 'react-world-flags'

import Layout from "./Layout";
import PageHeader from "./PageHeader";
import { getCountries } from "../queries/country";


class DestinationsPage extends React.Component {
  render() {
    const { countries } = this.props;
    return (
      <Layout title="Stravell | Destinations" description="test">
        <PageHeader title="Destinations" />
        <div className="content-container">
          {countries.map(({ country, id }) => (
            <Link key={id} as={`/country/${id}`} href={`/country?countryCode=${id}`}>
              <a>{country}
              <Flag code={id} height="16" />
              </a>
              
            </Link>
          ))}
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
