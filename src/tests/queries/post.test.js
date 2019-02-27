import { addPost } from "./../../queries/post";
import posts from "./../fixtures/posts";
import database from "./../../firebase/firebase";
import {
  generateTooShortString,
  generateTooLongString
} from "./../helpers/helpers";
import {
  MIN_NUM_OF_CHARACTERS_FOR_TITLE,
  MAX_NUM_OF_CHARACTERS_FOR_TITLE,
  MIN_NUM_OF_CHARACTERS_FOR_DESCRIPTION,
  MAX_NUM_OF_CHARACTERS_FOR_DESCRIPTION
} from "./../../constants/constants";
import {
  fromSnapShotToObject,
  fromSnapShotToArray
} from "./../../lib/utils/snapshot";

describe("addPost", () => {
  beforeEach(done => {
    const { id, ...post } = posts[0];
    const { uid, countryCode, regionCode, placeId } = post;
    let data = {};

    data[`posts/${id}`] = post;
    data[`country-posts/${countryCode}/${id}`] = post;
    data[`user-posts/${uid}/${id}`] = post;
    data[`region-posts/${regionCode}/${id}`] = post;
    data[`/place-posts/${placeId}/${id}`] = post;

    database
      .ref()
      .update(data)
      .then(() => done());
  });

  afterEach(done => {
    database
      .ref()
      .set({})
      .then(() => {
        done();
      });
  });

  describe("the post is valid", () => {
    test("should persist a post at /posts/:postId", done => {
      let { id, ...post } = posts[0];
      addPost(post)
        .then(() => {
          return database.ref("posts").once("value");
        })
        .then(snapshot => {
          let posts = fromSnapShotToArray(snapshot);
          expect(posts.length).toEqual(2);
          expect(posts[1]).toMatchObject(post);
          done();
        });
    });

    describe("the countryCode is not null", () => {
      let { id, ...post } = posts[0];
      beforeEach(() => {
        expect(post.countryCode).toBeDefined();
        expect(post.countryCode).not.toBeNull();
      });

      test("should persist a post at /country-posts/:countryCode/:postId", done => {
        addPost(post)
          .then(() => {
            return database
              .ref(`/country-posts/${post.countryCode}`)
              .once("value");
          })
          .then(snapshot => {
            let posts = fromSnapShotToArray(snapshot);
            expect(posts.length).toEqual(2);
            expect(posts[1]).toMatchObject(post);
            done();
          });
      });
    });

    describe("the countryCode is null", () => {
      let { id, ...post } = posts[0];
      post.countryCode = null;
      beforeEach(() => {
        expect(post.countryCode).toBeNull();
      });
      test("should NOT persist a post at /country-posts/:countryCode/:postId", done => {
        addPost(post)
          .then(() => {
            return database
              .ref(`/country-posts/${posts[0].countryCode}`)
              .once("value");
          })
          .then(snapshot => {
            let posts = fromSnapShotToArray(snapshot);
            expect(posts.length).toEqual(1);
            done();
          });
      });
    });

    describe("the userId is not null", () => {
      let { id, ...post } = posts[0];
      beforeEach(() => {
        expect(post.uid).toBeDefined();
        expect(post.uid).not.toBeNull();
      });
      test("should persist a post at /user-posts/:userId/:postId", done => {
        addPost(post)
          .then(() => {
            return database.ref(`/user-posts/${post.uid}`).once("value");
          })
          .then(snapshot => {
            let posts = fromSnapShotToArray(snapshot);
            expect(posts.length).toEqual(2);
            expect(posts[1]).toMatchObject(post);
            done();
          });
      });
    });

    describe("the userId is null", () => {
      let { id, ...post } = posts[0];
      post.uid = null;
      beforeEach(() => {
        expect(post.uid).toBeDefined();
        expect(post.uid).toBeNull();
      });
      test("should NOT persist a post at /user-posts/:userId/:postId", done => {
        addPost(post)
          .then(() => {
            return database.ref(`/user-posts/${posts[0].uid}`).once("value");
          })
          .then(snapshot => {
            let posts = fromSnapShotToArray(snapshot);
            expect(posts.length).toEqual(1);
            done();
          });
      });
    });

    describe("the regionCode is not null", () => {
      let { id, ...post } = posts[0];
      beforeEach(() => {
        expect(post.regionCode).toBeDefined();
        expect(post.regionCode).not.toBeNull();
      });
      test("should persist a post at /region-posts/:regionCode/:postId", done => {
        addPost(post)
          .then(() => {
            return database
              .ref(`/region-posts/${post.regionCode}`)
              .once("value");
          })
          .then(snapshot => {
            let posts = fromSnapShotToArray(snapshot);
            expect(posts.length).toEqual(2);
            expect(posts[1]).toMatchObject(post);
            done();
          });
      });
    });

    describe("the regionCode is null", () => {
      let { id, ...post } = posts[0];
      post.regionCode = null;
      beforeEach(() => {
        expect(post.regionCode).toBeNull();
      });
      test("should NOT persist a post at /region-posts/:regionCode/:postId", done => {
        addPost(post)
          .then(() => {
            return database
              .ref(`/region-posts/${posts[0].regionCode}`)
              .once("value");
          })
          .then(snapshot => {
            let posts = fromSnapShotToArray(snapshot);
            expect(posts.length).toEqual(1);
            done();
          });
      });
    });

    describe("the placeId is not null", () => {
      let { id, ...post } = posts[0];
      beforeEach(() => {
        expect(post.regionCode).toBeDefined();
        expect(post.regionCode).not.toBeNull();
      });
      test("should persist a post at /place-posts/:placeId/:postId", done => {
        addPost(post)
          .then(() => {
            return database.ref(`/place-posts/${post.placeId}`).once("value");
          })
          .then(snapshot => {
            let posts = fromSnapShotToArray(snapshot);
            expect(posts.length).toEqual(2);
            expect(posts[1]).toMatchObject(post);
            done();
          });
      });
    });

    describe("the placeId is null", () => {
      let { id, ...post } = posts[0];
      post.placeId = null;
      beforeEach(() => {
        expect(post.placeId).toBeNull();
      });
      test("should NOT persist a post at /place-posts/:placeId/:postId", done => {
        addPost(post)
          .then(() => {
            return database
              .ref(`/place-posts/${posts[0].placeId}`)
              .once("value");
          })
          .then(snapshot => {
            let posts = fromSnapShotToArray(snapshot);
            expect(posts.length).toEqual(1);
            done();
          });
      });
    });
  });

  test("should not persist a post when the title is too short", done => {
    let { id, ...post } = posts[0];
    post.title = generateTooShortString(MIN_NUM_OF_CHARACTERS_FOR_TITLE);
    addPost(post)
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when the title is too long", done => {
    let { id, ...post } = posts[0];
    post.title = generateTooLongString(MAX_NUM_OF_CHARACTERS_FOR_TITLE);
    addPost(post)
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = fromSnapShotToArray(snapshot);
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when the description is too short", done => {
    let { id, ...post } = posts[0];
    post.description = generateTooShortString(
      MIN_NUM_OF_CHARACTERS_FOR_DESCRIPTION
    );
    addPost(post)
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = fromSnapShotToArray(snapshot);
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when the description is too long", done => {
    let { id, ...post } = posts[0];
    post.description = generateTooLongString(
      MAX_NUM_OF_CHARACTERS_FOR_DESCRIPTION
    );
    addPost(post)
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = fromSnapShotToArray(snapshot);
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when createdat is not a number", done => {
    let { id, ...post } = posts[0];
    post.createdAt = null;
    addPost(post)
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = fromSnapShotToArray(snapshot);
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when updatedAt is not a number", done => {
    let { id, ...post } = posts[0];
    post.updatedAt = null;
    addPost(post)
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = fromSnapShotToArray(snapshot);
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when image is not a string", done => {
    let { id, ...post } = posts[0];
    post.image = null;
    addPost(post)
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = fromSnapShotToArray(snapshot);
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when s3FolderName is not a string", done => {
    let { id, ...post } = posts[0];
    post.s3FolderName = null;
    addPost(post)
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = fromSnapShotToArray(snapshot);
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when s3FolderName is an empty string", done => {
    let { id, ...post } = posts[0];
    post.s3FolderName = "";
    addPost(post)
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = fromSnapShotToArray(snapshot);
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when provideURL is not a boolean", done => {
    let { id, ...post } = posts[0];
    post.provideURL = null;
    addPost(post)
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = fromSnapShotToArray(snapshot);
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when providedURL is not a string", done => {
    let { id, ...post } = posts[0];
    post.providedURL = null;
    addPost(post)
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = fromSnapShotToArray(snapshot);
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when provideURL is true and providedURL is not a valide URL", done => {
    let { id, ...post } = posts[0];
    post.provideURL = true;
    post.providedURL = "google.com";
    addPost(post)
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = fromSnapShotToArray(snapshot);
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should persist a post when provideURL is false and providedURL is not a valide URL", done => {
    let { id, ...post } = posts[0];
    post.provideURL = false;
    post.providedURL = "google.com";
    addPost(post)
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = fromSnapShotToArray(snapshot);
        expect(posts.length).toEqual(2);
        done();
      });
  });

  test("should not persist a post when image is a string but not a URL format http(s).www.google.com", done => {
    let { id, ...post } = posts[0];
    post.image = "google.com";
    addPost(post)
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = fromSnapShotToArray(snapshot);
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when uid is not a string", done => {
    let { id, ...post } = posts[0];
    post.uid = null;
    addPost(post)
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = fromSnapShotToArray(snapshot);
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when uid is an empty string", done => {
    let { id, ...post } = posts[0];
    post.uid = "";
    addPost(post)
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = [];
        snapshot.forEach(post => {
          posts.push(post.val());
        });
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when userName is not a string", done => {
    let { id, ...post } = posts[0];
    post.userName = null;
    addPost(post)
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = fromSnapShotToArray(snapshot);
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when userName is an empty string", done => {
    let { id, ...post } = posts[0];
    post.userName = "";
    addPost(post)
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = fromSnapShotToArray(snapshot);
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should persist a post when userPhotoURL is not a string", done => {
    let { id, ...post } = posts[0];
    post.userPhotoURL = null;
    addPost(post)
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = fromSnapShotToArray(snapshot);
        expect(posts.length).toEqual(2);
        done();
      });
  });

  test("should not persist a post when userPhotoURL is not in format http(s)://google.com", done => {
    let { id, ...post } = posts[0];
    post.userPhotoURL = "google.com";
    addPost(post)
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = fromSnapShotToArray(snapshot);
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should persist a post when userPhotoURL is in format http(s)://google.com", done => {
    let { id, ...post } = posts[0];
    post.userPhotoURL = "https://google.com";
    addPost(post)
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = fromSnapShotToArray(snapshot);
        expect(posts.length).toEqual(2);
        done();
      });
  });
});

describe("editPost", () => {
  describe("countryCode", () => {
    describe("was not null before update", () => {
      describe("has not changed", () => {
        test("should edit post at /post/:id", () => {});
        test("should edit post at /country-posts/:countryCode/:id", () => {});
        test("should edit post at /user-posts/:id when uid is not null", () => {});
        test("should not edit post at /user-posts/:id when uid is null", () => {});
        test("should edit post at /region-posts/:id when regionCode is not null", () => {});
        test("should not edit post at /region-posts/:id when regionCode is null", () => {});
        test("should edit post at /place-posts/:id when placeId is not null", () => {});
        test("should not edit post at /place-posts/:id when placeId is null", () => {});
      });
      describe("has changed", () => {
        describe("and is not null", () => {
          test("should edit post at /post/:id", () => {});
          test("should edit post at /country-posts/:countryCode/:id", () => {});
          test("should edit post at /user-posts/:id when uid is not null", () => {});
          test("should not edit post at /user-posts/:id when uid is null", () => {});
          test("should edit post at /region-posts/:id when regionCode is not null", () => {});
          test("should not edit post at /region-posts/:id when regionCode is null", () => {});
          test("should edit post at /place-posts/:id when placeId is not null", () => {});
          test("should not edit post at /place-posts/:id when placeId is null", () => {});
          test("should add post at /country-posts/:newCountryCode/:id", () => {});
          test("should remove post at /country-posts/:formerCountryCode/:id", () => {});
          test("should add new country at countries/:newCountryCode", () => {});
          test("should remove the former country at countries/:formerCountryCode if not another article talk about this country", () => {});
          test("should add the new country at user-countries/:uid/:newCountryCode", () => {});
          test("should remove the former country at user-countries/:uid/:formerCountry if not another article belonging to that same user talk about the former country", () => {});
        });
        describe("and is null", () => {
          test("should edit post at /post/:id", () => {});
          test("should edit post at /user-posts/:id when uid is not null", () => {});
          test("should not edit post at /user-posts/:id when uid is null", () => {});
          test("should edit post at /region-posts/:id when regionCode is not null", () => {});
          test("should not edit post at /region-posts/:id when regionCode is null", () => {});
          test("should edit post at /place-posts/:id when placeId is not null", () => {});
          test("should not edit post at /place-posts/:id when placeId is null", () => {});
          test("should not add new country at countries/:newCountryCode", () => {});
          test("should not add new country at user-countries/:uid/:newCountryCode", () => {});
          test("should not add post at /country-posts/:newCountryCode/:id", () => {});
          test("should remove the former country at countries/:formerCountryCode if not another article talk about this country", () => {});
          test("should remove the former country at user-countries/:uid/:formerCountryCode if not another article belonging to that same user talk about the former country", () => {});
          test("should remove the post at /country-posts/:formerCountryCode/:id", () => {});
        });
      });
    });

    describe("was null before update", () => {
      describe("countryCode has changed", () => {
        test("should edit post at /post/:id", () => {});
        test("should edit post at /country-posts/:countryCode/:id", () => {});
        test("should edit post at /user-posts/:id when uid is not null", () => {});
        test("should not edit post at /user-posts/:id when uid is null", () => {});
        test("should edit post at /region-posts/:id when regionCode is not null", () => {});
        test("should not edit post at /region-posts/:id when regionCode is null", () => {});
        test("should edit post at /place-posts/:id when placeId is not null", () => {});
        test("should not edit post at /place-posts/:id when placeId is null", () => {});
        test("should add the post at /country-posts/:newCountryCode/:id", () => {});
        test("should add the new country at countries/:newCountryCode", () => {});
        test("should add the new country at user-countries/:uid/:newCountryCode", () => {});
      });
    });
  });
  describe("regionCode", () => {
    describe("was not null before update", () => {
      describe("has not changed", () => {
        test("should edit post at /post/:id", () => {});
        test("should edit post at /country-posts/:countryCode/:id", () => {});
        test("should edit post at /user-posts/:id when uid is not null", () => {});
        test("should not edit post at /user-posts/:id when uid is null", () => {});
        test("should edit post at /region-posts/:id when regionCode is not null", () => {});
        test("should not edit post at /region-posts/:id when regionCode is null", () => {});
        test("should edit post at /place-posts/:id when placeId is not null", () => {});
        test("should not edit post at /place-posts/:id when placeId is null", () => {});
      });
      describe("has changed", () => {
        describe("and is not null", () => {
          test("should edit post at /post/:id", () => {});
          test("should edit post at /country-posts/:countryCode/:id when countryCode is not null", () => {});
          test("should not edit post at /country-posts/:countryCode/:id when countryCode is null", () => {});
          test("should edit post at /user-posts/:id when uid is not null", () => {});
          test("should not edit post at /user-posts/:id when uid is null", () => {});
          test("should edit post at /region-posts/:id when regionCode", () => {});
          test("should edit post at /place-posts/:id when placeId is not null", () => {});
          test("should not edit post at /place-posts/:id when placeId is null", () => {});
          test("should add post at /country-posts/:newCountryCode/:id", () => {});
          test("should remove post at /country-posts/:formerCountryCode/:id", () => {});
          test("should add new country at countries/:newCountryCode", () => {});
          test("should remove the former country at countries/:formerCountryCode if not another article talk about this country", () => {});
          test("should add the new country at user-countries/:uid/:newCountryCode", () => {});
          test("should remove the former country at user-countries/:uid/:formerCountry if not another article belonging to that same user talk about the former country", () => {});
        });
        describe("and is null", () => {
          test("should edit post at /post/:id", () => {});
          test("should edit post at /user-posts/:id when uid is not null", () => {});
          test("should not edit post at /user-posts/:id when uid is null", () => {});
          test("should edit post at /region-posts/:id when regionCode is not null", () => {});
          test("should not edit post at /region-posts/:id when regionCode is null", () => {});
          test("should edit post at /place-posts/:id when placeId is not null", () => {});
          test("should not edit post at /place-posts/:id when placeId is null", () => {});
          test("should not add new country at countries/:newCountryCode", () => {});
          test("should not add new country at user-countries/:uid/:newCountryCode", () => {});
          test("should not add post at /country-posts/:newCountryCode/:id", () => {});
          test("should remove the former country at countries/:formerCountryCode if not another article talk about this country", () => {});
          test("should remove the former country at user-countries/:uid/:formerCountryCode if not another article belonging to that same user talk about the former country", () => {});
          test("should remove the post at /country-posts/:formerCountryCode/:id", () => {});
        });
      });
    });

    describe("was null before update", () => {
      describe("countryCode has changed", () => {
        test("should edit post at /post/:id", () => {});
        test("should edit post at /country-posts/:countryCode/:id", () => {});
        test("should edit post at /user-posts/:id when uid is not null", () => {});
        test("should not edit post at /user-posts/:id when uid is null", () => {});
        test("should edit post at /region-posts/:id when regionCode is not null", () => {});
        test("should not edit post at /region-posts/:id when regionCode is null", () => {});
        test("should edit post at /place-posts/:id when placeId is not null", () => {});
        test("should not edit post at /place-posts/:id when placeId is null", () => {});
        test("should add the post at /country-posts/:newCountryCode/:id", () => {});
        test("should add the new country at countries/:newCountryCode", () => {});
        test("should add the new country at user-countries/:uid/:newCountryCode", () => {});
      });
    });
  });
  
});
