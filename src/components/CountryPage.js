import React from "react";

import Layout from "./Layout";
import FilterablePostList from "./FilterablePostList";
import PageHeader from "./PageHeader";
import { getCountryPosts } from "../queries/post";
import { getCountry } from "../queries/country";
import Country from "./Country";
import { setCountryFilter } from "../actions/filters";
import { connect } from "react-redux";

class CountryPage extends React.Component {
  componentDidMount() {
    this.props.dispatch(setCountryFilter(""));
  }
  render() {
    const { posts, country } = this.props;
    return (
      <Layout
        title={`Stravell | ${country.country}`}
        description={`Travel articles about ${country.country}`}
      >
        <PageHeader>
          <Country
            countryName={country.country}
            countryCode={country.id}
            countryNameClassName="h2 favourite-font-weight"
            flagSize="64"
          />
        </PageHeader>
        <div className="content-container">
          <FilterablePostList posts={posts} withCountryFilter={false} noPostText={`There is no post about ${country.country} yet.`} />
        </div>
      </Layout>
    );
  }
}

CountryPage.getInitialProps = async function({ query }) {
  const { countryCode } = query;
  const country = await getCountry(countryCode);
  const posts = await getCountryPosts(countryCode);
  return { posts, country };
};

export default connect()(CountryPage);
