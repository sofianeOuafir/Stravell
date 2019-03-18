const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const next = require("next");
const Feed = require("feed").Feed;

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
    const feed = new Feed({
      title: "Stravell",
      description: "Stravell's Feed",
      id: "stravell.com/",
      link: "stravell.com/",
      language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
      image: "stravell.com/favicon",
      favicon: "stravell.com/favicon",
      copyright: "All rights reserved 2019, Stravell Inc",
      feedLinks: {
        json: "https://example.com/json",
        atom: "https://example.com/atom"
      },
      author: {
        name: "Stravell",
        email: "stravell.com@gnail.com",
        link: "https://www.stravell.com"
      }
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
      const { title, id, description, userName, createdAt, image } = post;
      feed.addItem({
        title,
        id,
        link: `https://stravell.com/p/show/${title}/${id}`,
        description,
        content: description,
        author: [
          {
            name: `${userName}`
          }
        ],
        date: undefined,
        image
      });
    });

    console.log(feed.rss2());
    res.set("application/xml").send(feed.rss2());
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
