import {
  addPost,
  editPost,
  setPosts,
  startAddPost
} from "./../../actions/posts";
import posts from "./../fixtures/posts";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import database from "./../../firebase/firebase";
import { generateTooShortString, generateTooLongString } from './../helpers/helpers';
import { MIN_NUM_OF_CHARACTERS_FOR_TITLE, MAX_NUM_OF_CHARACTERS_FOR_TITLE, MIN_NUM_OF_CHARACTERS_FOR_DESCRIPTION, MAX_NUM_OF_CHARACTERS_FOR_DESCRIPTION } from './../../constants/constants';

const uid = "YYFEgQAdBuQIsox3ojncZtpSAmG3";
const userName = "Jenna Jacquelyn";
const userPhotoURL = "https://graph.facebook.com/10161147754845459/picture";

const defaultAuthState = { auth: { uid, userName, userPhotoURL } };
const createMockStore = configureMockStore([thunk]);

describe("addPost", () => {
  test("should return the right value", () => {
    const post = posts[0];
    expect(addPost(post)).toEqual({ type: "ADD_POST", post });
  });
});

describe("setPosts", () => {
  test("should return the right value", () => {
    expect(setPosts(posts)).toEqual({ type: "SET_POSTS", posts });
  });
});

describe("editPost", () => {
  test("should return the right value", () => {
    const title = "a new title";
    const updates = { title };
    const id = 1;
    expect(editPost({ id, updates })).toEqual({
      type: "EDIT_POST",
      id,
      updates
    });
  });
});

describe("startAddPost", () => {
  let store;

  beforeEach(done => {
    store = createMockStore(defaultAuthState);
    const postsData = {};
    posts.forEach(
      ({
        id,
        body,
        createdAt,
        description,
        image,
        s3FolderName,
        title,
        uid,
        updatedAt,
        userName,
        provideURL,
        providedURL,
        userPhotoURL
      }) => {
        postsData[id] = {
          body,
          createdAt,
          description,
          image,
          s3FolderName,
          title,
          uid,
          updatedAt,
          userName,
          provideURL,
          providedURL,
          userPhotoURL
        };
      }
    );
    database
      .ref(`posts`)
      .set(postsData)
      .then(() => done());
  });

  test("should persist a valid post", (done) => {
    let { id, ...post } = posts[0];
    post.title = 'My amazing blog post';
    store.dispatch(startAddPost(post)).then(() => {
      return database.ref('posts').once('value');
    }).then((snapshot) => {
      let posts = [];
      snapshot.forEach((post) => {
        posts.push(post.val());
      })
      expect(posts.length).toEqual(2);
      expect(posts[1]).toEqual(post);
      done();
    })
  });

  test('should not persist a post when the title is too short', (done) => {
    let { id, ...post } = posts[0];
    post.title = generateTooShortString(MIN_NUM_OF_CHARACTERS_FOR_TITLE);
    store.dispatch(startAddPost(post)).then(() => {
      return database.ref('posts').once('value');
    }).then((snapshot) => {
      let posts = [];
      snapshot.forEach((post) => {
        posts.push(post.val());
      })
      expect(posts.length).toEqual(1);
      done();
    });
  });

  test('should not persist a post when the title is too long', (done) => {
    let { id, ...post } = posts[0];
    post.title = generateTooLongString(MAX_NUM_OF_CHARACTERS_FOR_TITLE);
    store.dispatch(startAddPost(post)).then(() => {
      return database.ref('posts').once('value');
    }).then((snapshot) => {
      let posts = [];
      snapshot.forEach((post) => {
        posts.push(post.val());
      })
      expect(posts.length).toEqual(1);
      done();
    });
  });

  test('should not persist a post when the description is too short', (done) => {
    let { id, ...post } = posts[0];
    post.description = generateTooShortString(MIN_NUM_OF_CHARACTERS_FOR_DESCRIPTION);
    store.dispatch(startAddPost(post)).then(() => {
      return database.ref('posts').once('value');
    }).then((snapshot) => {
      let posts = [];
      snapshot.forEach((post) => {
        posts.push(post.val());
      })
      expect(posts.length).toEqual(1);
      done();
    });
  });

  test('should not persist a post when the description is too long', (done) => {
    let { id, ...post } = posts[0];
    post.description = generateTooLongString(MAX_NUM_OF_CHARACTERS_FOR_DESCRIPTION);
    store.dispatch(startAddPost(post)).then(() => {
      return database.ref('posts').once('value');
    }).then((snapshot) => {
      let posts = [];
      snapshot.forEach((post) => {
        posts.push(post.val());
      })
      expect(posts.length).toEqual(1);
      done();
    });
  });

  test('should not persist a post when createdat is not a number', (done) => {
    let { id, ...post } = posts[0];
    post.createdAt = null;
    store.dispatch(startAddPost(post)).then(() => {
      return database.ref('posts').once('value');
    }).then((snapshot) => {
      let posts = [];
      snapshot.forEach((post) => {
        posts.push(post.val());
      })
      expect(posts.length).toEqual(1);
      done();
    });
  });

  test('should not persist a post when updatedAt is not a number', (done) => {
    let { id, ...post } = posts[0];
    post.updatedAt = null;
    store.dispatch(startAddPost(post)).then(() => {
      return database.ref('posts').once('value');
    }).then((snapshot) => {
      let posts = [];
      snapshot.forEach((post) => {
        posts.push(post.val());
      })
      expect(posts.length).toEqual(1);
      done();
    });
  });

  test('should not persist a post when image is not a string', (done) => {
    let { id, ...post } = posts[0];
    post.image = null;
    store.dispatch(startAddPost(post)).then(() => {
      return database.ref('posts').once('value');
    }).then((snapshot) => {
      let posts = [];
      snapshot.forEach((post) => {
        posts.push(post.val());
      })
      expect(posts.length).toEqual(1);
      done();
    });
  });

  test('should not persist a post when s3FolderName is not a string', (done) => {
    let { id, ...post } = posts[0];
    post.s3FolderName = null;
    store.dispatch(startAddPost(post)).then(() => {
      return database.ref('posts').once('value');
    }).then((snapshot) => {
      let posts = [];
      snapshot.forEach((post) => {
        posts.push(post.val());
      })
      expect(posts.length).toEqual(1);
      done();
    });
  });

  test('should not persist a post when s3FolderName is an empty string', (done) => {
    let { id, ...post } = posts[0];
    post.s3FolderName = "";
    store.dispatch(startAddPost(post)).then(() => {
      return database.ref('posts').once('value');
    }).then((snapshot) => {
      let posts = [];
      snapshot.forEach((post) => {
        posts.push(post.val());
      })
      expect(posts.length).toEqual(1);
      done();
    });
  });

  test('should not persist a post when provideURL is not a boolean', (done) => {
    let { id, ...post } = posts[0];
    post.provideURL = null;
    store.dispatch(startAddPost(post)).then(() => {
      return database.ref('posts').once('value');
    }).then((snapshot) => {
      let posts = [];
      snapshot.forEach((post) => {
        posts.push(post.val());
      })
      expect(posts.length).toEqual(1);
      done();
    });
  });

  test('should not persist a post when providedURL is not a string', (done) => {
    let { id, ...post } = posts[0];
    post.providedURL = null;
    store.dispatch(startAddPost(post)).then(() => {
      return database.ref('posts').once('value');
    }).then((snapshot) => {
      let posts = [];
      snapshot.forEach((post) => {
        posts.push(post.val());
      })
      expect(posts.length).toEqual(1);
      done();
    });
  });

  test('should not persist a post when provideURL is true and providedURL is not a valide URL', (done) => {
    let { id, ...post } = posts[0];
    post.provideURL = true;
    post.providedURL = 'google.com';
    store.dispatch(startAddPost(post)).then(() => {
      return database.ref('posts').once('value');
    }).then((snapshot) => {
      let posts = [];
      snapshot.forEach((post) => {
        posts.push(post.val());
      })
      expect(posts.length).toEqual(1);
      done();
    });
  });

  test('should not persist a post when image is a string but not a URL format http(s).www.google.com', (done) => {
    let { id, ...post } = posts[0];
    post.image = "google.com";
    store.dispatch(startAddPost(post)).then(() => {
      return database.ref('posts').once('value');
    }).then((snapshot) => {
      let posts = [];
      snapshot.forEach((post) => {
        posts.push(post.val());
      })
      expect(posts.length).toEqual(1);
      done();
    });
  });

  test('should not persist a post when uid is not a string', (done) => {
    store = createMockStore({ auth: { uid: null, userName, userPhotoURL } });
    let { id, ...post } = posts[0];
    store.dispatch(startAddPost(post)).then(() => {
      return database.ref('posts').once('value');
    }).then((snapshot) => {
      let posts = [];
      snapshot.forEach((post) => {
        posts.push(post.val());
      })
      expect(posts.length).toEqual(1);
      done();
    });
  });

  test('should not persist a post when uid is an empty string', (done) => {
    store = createMockStore({ auth: { uid: "", userName, userPhotoURL } });
    let { id, ...post } = posts[0];
    store.dispatch(startAddPost(post)).then(() => {
      return database.ref('posts').once('value');
    }).then((snapshot) => {
      let posts = [];
      snapshot.forEach((post) => {
        posts.push(post.val());
      })
      expect(posts.length).toEqual(1);
      done();
    });
  });

  test('should not persist a post when userName is not a string', (done) => {
    store = createMockStore({ auth: { uid, userName: null, userPhotoURL } });
    let { id, ...post } = posts[0];
    store.dispatch(startAddPost(post)).then(() => {
      return database.ref('posts').once('value');
    }).then((snapshot) => {
      let posts = [];
      snapshot.forEach((post) => {
        posts.push(post.val());
      })
      expect(posts.length).toEqual(1);
      done();
    });
  });

  test('should not persist a post when userName is an empty string', (done) => {
    store = createMockStore({ auth: { uid, userName: '', userPhotoURL } });
    let { id, ...post } = posts[0];
    store.dispatch(startAddPost(post)).then(() => {
      return database.ref('posts').once('value');
    }).then((snapshot) => {
      let posts = [];
      snapshot.forEach((post) => {
        posts.push(post.val());
      })
      expect(posts.length).toEqual(1);
      done();
    });
  });

  test('should not persist a post when userPhotoURL is not a string', (done) => {
    store = createMockStore({ auth: { uid, userName, userPhotoURL: null } });
    let { id, ...post } = posts[0];
    store.dispatch(startAddPost(post)).then(() => {
      return database.ref('posts').once('value');
    }).then((snapshot) => {
      let posts = [];
      snapshot.forEach((post) => {
        posts.push(post.val());
      })
      expect(posts.length).toEqual(1);
      done();
    });
  });

  test('should not persist a post when userPhotoURL is not in format http(s)://google.com', (done) => {
    store = createMockStore({ auth: { uid, userName, userPhotoURL: 'google.com' } });
    let { id, ...post } = posts[0];
    store.dispatch(startAddPost(post)).then(() => {
      return database.ref('posts').once('value');
    }).then((snapshot) => {
      let posts = [];
      snapshot.forEach((post) => {
        posts.push(post.val());
      })
      expect(posts.length).toEqual(1);
      done();
    });
  });
});
