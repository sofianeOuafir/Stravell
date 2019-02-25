import React from "react";
import { connect } from "react-redux";
import { withRouter } from "next/router";
import { slugify } from "underscore.string";

import PostForm from "./PostForm";
import PageHeader from "./PageHeader";
import {
  ADD_POST_PAGE_TITLE,
  ADD_POST_PAGE_DESCRIPTION
} from "./../constants/constants";
import Layout from "./Layout";
import BreadCrumb from "./Breadcrumb";
import { addPost } from "./../queries/post";
import { addCountry } from "./../queries/country";
import { addPlace } from "./../queries/place";
import { addRegion } from "../queries/region";

export class AddPostPage extends React.Component {
  onSubmit = ({ postData, countryData, userData, placeData, regionData }) => {
    addPost(postData)
      .then(() => {
        return addCountry({ countryData, userData });
      })
      .then(() => {
        return addPlace({ countryData, placeData, regionData, userData });
      }).then(() => {
        return addRegion({ countryData, regionData });
      })
      .then(() => {
        this.props.router.push(
          `/dashboard?uid=${this.props.uid}`,
          `/dashboard/${slugify(this.props.userName)}/${this.props.uid}`
        );
      });
  };

  render() {
    const breadcrumbLinks = [
      { href: "/", text: "Home" },
      {
        href: `/dashboard/${slugify(this.props.userName)}/${this.props.uid}`,
        text: "Dashboard"
      },
      {
        href: `/create`,
        as: "/p/create",
        text: "Create Post",
        active: true
      }
    ];
    return (
      <Layout
        title={ADD_POST_PAGE_TITLE}
        description={ADD_POST_PAGE_DESCRIPTION}
      >
        <PageHeader title="Create Post" withSocialShareButtons={false} />
        <div className="content-container">
          <div className="mb1">
            <BreadCrumb links={breadcrumbLinks} />
          </div>

          <PostForm onSubmit={this.onSubmit} />
        </div>
      </Layout>
    );
  }
}

AddPostPage.getInitialProps = async function({ req, reduxStore, res }) {
  let authorised = false;
  if (req && req.session) {
    const user = req.session.decodedToken;
    if (user) {
      authorised = true;
    }
  } else {
    if (reduxStore.getState().auth.uid) {
      authorised = true;
    }
  }

  if (authorised) {
    return {};
  } else {
    if (res) {
      res.writeHead(302, {
        Location: "/"
      });
      res.end();
    } else {
      Router.push("/");
    }
  }
};

const mapStateToProps = state => ({
  uid: state.auth.uid,
  userName: state.auth.userName
});

export default connect(mapStateToProps)(withRouter(AddPostPage));
