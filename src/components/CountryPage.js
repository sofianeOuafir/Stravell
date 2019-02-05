import React from "react";

import Layout from "./Layout";
import FilterablePostList from "./FilterablePostList";
import PageHeader from "./PageHeader";
import { getPosts } from "../queries/post";
import { getCountry } from "../queries/country";

const CountryPage = ({ posts, country }) => {
  return (
    <Layout title={`Stravell | ${country.country}`} description="to be written">
      <PageHeader title={country.country} />
      <div className="content-container">
        <FilterablePostList posts={posts} />
      </div>
    </Layout>
  );
};

CountryPage.getInitialProps = async function({ query }) {
  const { countryCode } = query;
  const country = await getCountry(countryCode);
  const posts = await getPosts({ countryCode });
  return { posts, country };
};

export default CountryPage;
