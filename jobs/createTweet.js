const twitterClient = require("./../src/twitter/twitter");
const firebase = require("./../src/firebase/firebaseAdmin");
const slugify = require("underscore.string").slugify;
var request = require("request-promise").defaults({
  encoding: null
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
      return twitterClient.post("media/upload", {
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
      return twitterClient.post("statuses/update", status);
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
