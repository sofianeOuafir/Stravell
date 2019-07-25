const twitterClient = require("./../src/twitter/twitter");
const firebase = require("./../src/firebase/firebaseAdmin");
const slugify = require("underscore.string").slugify;
var request = require("request-promise").defaults({
  encoding: null
});

const getRandomItemFromArray = array => {
  return array[Math.floor(Math.random() * array.length)];
};

function createTweetFromTweetQueue() {
  let post;
  firebase
    .database()
    .ref("tweetQueue-posts")
    .orderByChild("published")
    .equalTo(true)
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
      const url = `https://stravell.com/p/show/${slugify(title)}/${id}`;
      // Lets tweet it
      const greetings = ["Hey Stravellers", "Hey Folks", "Hi friends"];
      const callsToAction = [
        "Here is a new post",
        "Check this post out",
        "Read this article",
        "NEW POST",
        "Post of the day"
      ];
      const hashtags = [
        "#traveltips #travel",
        "#TravelMassive #rtw",
        "#ttot #TBEX",
        "#travelskills #rtwnow"
      ];
      const hashtag = getRandomItemFromArray(hashtags);
      const callToAction = getRandomItemFromArray(callsToAction);
      const greeting = getRandomItemFromArray(greetings);
      var status = {
        status: `${greeting}! :) ${callToAction}: « ${title} » By ${userName} ${url} ${hashtag} #stravell`,
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
