const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const next = require("next");
const RSS = require("rss");
const WEBSITE_URL = 'https://stravell.com';

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const firebase = require("./../src/firebase/firebaseAdmin");

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.json());
  server.use(
    session({
      secret: "geheimnis",
      saveUninitialized: true,
      store: new FileStore({ path: "/tmp/sessions", secret: "geheimnis" }),
      resave: false,
      rolling: true,
      httpOnly: true,
      cookie: { maxAge: 604800000 } // week
    })
  );

  server.use((req, res, next) => {
    req.firebaseServer = firebase;
    next();
  });

  server.post("/api/login", (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const token = req.body.token;
    firebase
      .auth()
      .verifyIdToken(token)
      .then(decodedToken => {
        req.session.decodedToken = decodedToken;
        return decodedToken;
      })
      .then(decodedToken => res.json({ status: true, decodedToken }))
      .catch(error => res.json({ error }));
  });

  server.post("/api/logout", (req, res) => {
    req.session.decodedToken = null;
    res.json({ status: true });
  });

  server.get("/p/create", (req, res) => {
    const actualPage = "/createPost";
    const queryParams = {};
    app.render(req, res, actualPage, queryParams);
  });

  server.get("/p/show/:title/:id", (req, res) => {
    const actualPage = "/post";
    const queryParams = { id: req.params.id };
    app.render(req, res, actualPage, queryParams);
  });

  server.get("/dashboard/:username/:uid", (req, res) => {
    const actualPage = "/dashboard";
    const queryParams = { uid: req.params.uid };
    app.render(req, res, actualPage, queryParams);
  });

  server.get("/p/edit/:title/:id", (req, res) => {
    const actualPage = "/editPost";
    const queryParams = { id: req.params.id };
    app.render(req, res, actualPage, queryParams);
  });

  server.get("/u/show/:username/:uid", (req, res) => {
    const actualPage = "/user";
    const queryParams = { uid: req.params.uid };
    app.render(req, res, actualPage, queryParams);
  });

  server.get("/country/:countryCode", (req, res) => {
    const actualPage = "/country";
    const queryParams = { countryCode: req.params.countryCode };
    app.render(req, res, actualPage, queryParams);
  });

  server.get("/place/:address/:id", (req, res) => {
    const actualPage = "/place";
    const queryParams = { id: req.params.id };
    app.render(req, res, actualPage, queryParams);
  });

  server.get("/region/:country/:regionCode", (req, res) => {
    const actualPage = "/region";
    const queryParams = { regionCode: req.params.regionCode };
    app.render(req, res, actualPage, queryParams);
  });

  server.get("/:country/:countryCode/regions", (req, res) => {
    const actualPage = "/regions";
    const queryParams = { countryCode: req.params.countryCode };
    app.render(req, res, actualPage, queryParams);
  });

  server.get("/country/:countryCode", (req, res) => {
    const actualPage = "/country";
    const queryParams = { countryCode: req.params.countryCode };
    app.render(req, res, actualPage, queryParams);
  });

  server.get("/sitemap.xml", (req, res) => {
    const sitemapOptions = {
      root: __dirname + "/../static/",
      headers: {
        "Content-Type": "text/xml;charset=UTF-8"
      }
    };
    res.status(200).sendFile("sitemap.xml", sitemapOptions);
  });

  server.get("/favicon", (req, res) => {
    const faviconOptions = {
      root: __dirname + "/../static/images",
      headers: {
        "Content-Type": "image/x-icon"
      }
    };
    res.status(200).sendFile("favicon.png", faviconOptions);
  });

  server.get("/feed", async (req, res) => {
    var feed = new RSS({
      title: "Stravell",
      description: "Stravell's RSS Feed",
      feed_url: `${WEBSITE_URL}/feed`,
      site_url: `${WEBSITE_URL}`,
      image_url: `${WEBSITE_URL}/favicon`,
      managingEditor: "Stravell",
      webMaster: "Stravell",
      copyright: "2019 Stravell",
      language: "en",
      ttl: "60"
    });

    const posts = await firebase
      .database()
      .ref("posts")
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
        return posts;
      });

    posts.forEach(post => {
      const {
        title,
        id,
        description,
        userName,
        createdAt,
        image,
        lat,
        lng
      } = post;

      feed.item({
        title,
        description,
        url: `https://stravell.com/p/show/${title}/${id}`, // link to the item
        guid: id, // optional - defaults to url
        author: userName, // optional - defaults to feed author property
        date: new Date(createdAt), // any format that js Date can parse.
        lat, //optional latitude field for GeoRSS
        long: lng, //optional longitude field for GeoRSS
        enclosure: { url: image } // optional enclosure
      });
    });

    console.log(feed.xml());
    res.set("application/xml").send(feed.xml({ indent: true }));
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
