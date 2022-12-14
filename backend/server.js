const express = require("express");
const cors = require("cors");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const db = require("./database");
const User = require("./schemas/User");
const Community = require("./schemas/Community");
const Post = require("./schemas/Post");
const Comment = require("./schemas/Comment");

const {
  hashPassword,
  validatePassword,
  isUserAuthenticated,
  isUserAdmin,
} = require("./helper.js");

// This is for demo purposes, should be stored in .env file
const SESSION_SECRET = "secret";
const ORIGIN = "http://localhost:5500";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: ORIGIN }));

db.initDBConnection();

passport.use(
  new LocalStrategy(async (username, password, cb) => {
    const user = await db.getUser(username);
    if (user && validatePassword(password, user.password)) {
      return cb(null, user);
    } else {
      return cb(null, false);
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user.username);
});

passport.deserializeUser(async (username, cb) => {
  const user = await db.getUser(username);
  if (user) {
    return cb(null, user);
  } else {
    return cb(null, false);
  }
});

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create(mongoose.connection),
    cookie: {
      maxAge: 86400000, // 24 hrs
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ----- User related endpoints ------

app.post("/signup", async (req, res, next) => {
  const user = await db.getUser(req.body.username);
  if (user) {
    return res.status(409).send({ msg: "Username is already taken." });
  }

  const newUser = new User({
    username: req.body.username,
    password: hashPassword(req.body.password),
    communitiesOwned: [],
    communitiesFollowed: [],
  });

  const userCreated = await db.createUser(newUser);
  if (userCreated) {
    res.send();
  } else {
    res.redirect("/server-error");
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login-failure",
    successRedirect: "/login-success",
  }),
  (err, req, res, next) => {
    if (err) {
      res.redirect("/server-error");
    }
  }
);

app.use("/login-success", (req, res, next) => {
  res.send();
});

app.use("/login-failure", (req, res, next) => {
  res.status(401).send({ msg: "Incorrect username or password." });
});

app.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return res.redirect("/server-error");
    }
    res.send();
  });
});

app.get("/is-logged-in", isUserAuthenticated, async (req, res, next) => {
  res.send();
});

app.get("/get-account", isUserAuthenticated, async (req, res, next) => {
  const user = await db.getUser(req.user.username);
  res.send(user);
});

app.post("/update-account", isUserAuthenticated, async (req, res, next) => {
  const update = {};
  if (req.body.password) update.password = hashPassword(req.body.password);
  if (req.body.communitiesOwned)
    update.communitiesOwned = req.body.communitiesOwned;
  if (req.body.communitiesFollowed)
    update.communitiesFollowed = req.body.communitiesFollowed;

  const userUpdated = await db.updateUser(req.user.username, update);
  if (userUpdated) {
    const user = await db.getUser(req.user.username);
    res.send(user);
  } else {
    res.redirect("/server-error");
  }
});

app.delete("/delete-account", isUserAuthenticated, async (req, res, next) => {
  const userDeleted = await db.deleteUser(req.user.username);
  if (userDeleted) {
    req.logout((err) => {
      if (err) {
        return res.redirect("/server-error");
      }
      res.send();
    });
  } else {
    res.redirect("/server-error");
  }
});

// ----- Community related endpoints ------

app.post("/create-community", isUserAdmin, async (req, res, next) => {
  const community = await db.getCommunity(req.body.name);
  if (community) {
    return res.status(409).send({ msg: "Community already exists." });
  }

  const newCommunity = new Community({
    name: req.body.name,
    owner: req.user.username,
  });

  const communityCreated = await db.createCommunity(newCommunity);
  if (communityCreated) {
    res.send();
  } else {
    res.redirect("/server-error");
  }
});

app.get("get-community", async (req, res, next) => {
  const community = await db.getCommunity(req.body.name);
  res.send(community);
});

app.delete("/delete-community", isUserAdmin, async (req, res, next) => {
  const communityDeleted = await db.deleteCommunity(req.body.name);
  // TODO: Need to delete all posts and comments under the community too
  if (communityDeleted) {
    res.send();
  } else {
    res.redirect("/server-error");
  }
});

// ----- Post related endpoints ------

app.post("/create-post", isUserAuthenticated, async (req, res, next) => {
  const newPost = new Post({
    author: req.user.username,
    community: req.body.community,
    title: req.body.title,
    body: req.body.body,
    rating: 0,
  });

  const postCreated = await db.createPost(newPost);
  if (postCreated) {
    res.send();
  } else {
    res.redirect("/server-error");
  }
});

app.get("get-user-posts", isUserAuthenticated, async (req, res, next) => {
  const userPosts = await db.getUserPosts(req.user.username);
  res.send(userPosts);
});

app.get("get-community-posts", async (req, res, next) => {
  const communityPosts = await db.getCommunityPosts(req.body.community);
  res.send(communityPosts);
});

app.delete("/delete-post", isUserAuthenticated, async (req, res, next) => {
  const post = await db.getPost(req.body.postId);
  if (post & (post.author !== req.user.username)) {
    return res.status(403).send({
      msg: "You do not have permission to delete a post that you didn't create.",
    });
  }

  const commentsOfPostDeleted = await db.deleteAllCommentsOfPost(
    req.body.postId
  );
  if (commentsOfPostDeleted) {
    const postDeleted = await db.deletePost(req.body.postId);
    if (postDeleted) {
      res.send();
    } else {
      res.redirect("/server-error");
    }
  }
});

// ----- Comment related endpoints ------

app.post("/create-comment", isUserAuthenticated, async (req, res, next) => {
  const newComment = new Comment({
    author: req.user.username,
    postId: req.body.postId,
    body: req.body.body,
    rating: 0,
  });

  const commentCreated = await db.createComment(newComment);
  if (commentCreated) {
    res.send();
  } else {
    res.redirect("/server-error");
  }
});

app.get("get-user-comments", isUserAuthenticated, async (req, res, next) => {
  const userComments = await db.getUserComments(req.user.username);
  res.send(userComments);
});

app.get("get-post-comments", async (req, res, next) => {
  const postComments = await db.getPostComments(req.body.postId);
  res.send(postComments);
});

app.delete("/delete-comment", isUserAuthenticated, async (req, res, next) => {
  const comment = await db.getComment(req.body.commentId);
  if (comment & (comment.author !== req.user.username)) {
    return res.status(403).send({
      msg: "You do not have permission to delete a comment that you didn't create.",
    });
  }

  const commentDeleted = await db.deleteComment(req.body.commentId);
  if (commentDeleted) {
    res.send();
  } else {
    res.redirect("/server-error");
  }
});

// ----- Error related endpoints ------

app.use("/server-error", (req, res, next) => {
  res.status(500).send({ msg: "An error has occurred. Please try again." });
});

app.listen(3000);
