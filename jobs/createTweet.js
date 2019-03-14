const Twitter = require("twitter");
const admin = require("firebase-admin");
const slugify = require("underscore.string").slugify;

require("dotenv").config({ path: ".env.development" });

const firebase = admin.initializeApp(
  {
    credential: admin.credential.cert({
      type: process.env.FIREBASE_ADMIN_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
      auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI,
      token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
      auth_provider_x509_cert_url:
        process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  },
  "server"
);

var request = require("request-promise").defaults({
  encoding: null
});

const client = new Twitter({
  consumer_key: "Qkq0LILBdbV8U4cpQdGri8LMR",
  consumer_secret: "7YBuif7cAJxWXiISUbXMRpboM2TX28ZrSR9Vj27oj7WdlNbsJq",
  access_token_key: "819852518960275456-S4CZJDhOESQc4R7ucsqEFIslJRUmGQX",
  access_token_secret: "v1MjgJg83nVOIVqyJlu8XmHe5kfLDLZkDWH3CCtVtDk8J"
});

function createTweetFromTweetQueue() {
  let post;
  firebase
    .database()
    .ref("tweetQueue-posts")
    .orderByChild("createdAt")
    .once("value")
    .then(snapshot => {
      let posts = [];
      snapshot.forEach(element => {
        posts.push({
          id: element.key,
          ...element.val()
        });
      });

      if (posts.length === 0) {
        return Promise.reject("No post in queue");
      }
      post = posts[0];
      return post;
    })
    .then(post => {
      return request(`${post.image}`);
    })
    .then(body => {
      return client.post("media/upload", {
        media: body
      });
      console.log(body);
    })
    .then(media => {
      const { countryCode, title, id, userName } = post;
      const url = countryCode
        ? `www.stravell.com/country/${countryCode}`
        : `https://stravell.com/p/show/${slugify(title)}/${id}`;
      // Lets tweet it
      var status = {
        status: `Hey Stravellers! :) Here is a new post: « ${title} » By ${userName} ${url} #traveltips #travel #stravell`,
        media_ids: media.media_id_string
      };
      return client.post("statuses/update", status);
    })
    .then(() => {
      let updates = {};
      updates[`tweetQueue-posts/${post.id}`] = null;
      return firebase
        .database()
        .ref()
        .update(updates);
    })
    .catch(error => {
      console.log(error);
    });
}

createTweetFromTweetQueue();
