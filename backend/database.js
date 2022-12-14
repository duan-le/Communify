const mongoose = require("mongoose");
const User = require("./schemas/User");
const Community = require("./schemas/Community");
const Post = require("./schemas/Post");
const Comment = require("./schemas/Comment");

// This is for demo purposes, should be stored in .env file
const COLLECTION_NAME = "communify";
const DB_USERNAME = "communify";
const DB_PASSWORD = "communify";

// Initializing database connection
function initDBConnection() {
  mongoose.set("strictQuery", true);
  try {
    mongoose.connect(
      `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.x0oyajv.mongodb.net/${COLLECTION_NAME}?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  } catch (err) {
    console.log(err);
  }
}

// Success: Returns true
// Failure: Returns false
async function createUser(user) {
  try {
    await user.save();
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Success: Returns user object, could also be null if no user
// Failure: Returns null
async function getUser(username) {
  try {
    return await User.findOne({ username: username });
  } catch (err) {
    console.log(err);
    return null;
  }
}

// Success: Returns true
// Failure: Returns false
async function updateUser(username, update) {
  try {
    const result = await User.findOneAndUpdate({ username: username }, update);
    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Success: Returns true
// Failure: Returns false
async function deleteUser(username) {
  try {
    const result = await User.deleteOne({ username: username });
    if (result.deletedCount > 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Success: Returns true
// Failure: Returns false
async function createCommunity(community) {
  try {
    await community.save();
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Success: Returns community object, could also be null if no community
// Failure: Returns null
async function getCommunity(name) {
  try {
    return await Community.findOne({ name: name });
  } catch (err) {
    console.log(err);
    return null;
  }
}

// Success: Returns list of all communities, could also be null if no communities
// Failure: Returns null
async function getAllCommunities() {
  try {
    return await Community.find().sort({ name: 1 });
  } catch (err) {
    console.log(err);
    return null;
  }
}

// Success: Returns true
// Failure: Returns false
async function updateCommunity(name, update) {
  try {
    const result = await Community.findOneAndUpdate({ name: name }, update);
    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Success: Returns true
// Failure: Returns false
async function deleteCommunity(name) {
  try {
    const result = await Community.deleteOne({ name: name });
    if (result.deletedCount > 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Success: Returns true
// Failure: Returns false
async function createPost(post) {
  try {
    await post.save();
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Success: Returns list of posts created by user, could also be null if no posts
// Failure: Returns null
async function getUserPosts(username) {
  try {
    const posts = await Post.find({ author: username });
    if (posts.length == 0) {
      return null;
    } else {
      return posts;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

// Success: Returns list of posts from a community, could also be null if no posts
// Failure: Returns null
async function getCommunityPosts(community) {
  try {
    const posts = await Post.find({ community: community });
    if (posts.length == 0) {
      return null;
    } else {
      return posts;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

// Success: Returns true
// Failure: Returns false
async function updatePost(postId, update) {
  try {
    const result = await Post.findOneAndUpdate({ _id: postId }, update);
    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Success: Returns true
// Failure: Returns false
async function deletePost(postId) {
  try {
    const result = await Post.deleteOne({ _id: postId });
    if (result.deletedCount > 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Success: Returns true
// Failure: Returns false
async function deleteAllPostsOfCommunity(community) {
  try {
    const result = await Post.deleteMany({ community: community });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Success: Returns true
// Failure: Returns false
async function createComment(comment) {
  try {
    await comment.save();
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Success: Returns list of comments created by user, could also be null if no comments
// Failure: Returns null
async function getUserComments(username) {
  try {
    const comments = await Comment.find({ author: username });
    if (comments.length == 0) {
      return null;
    } else {
      return comments;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

// Success: Returns list of comments from a post, could also be null if no comments
// Failure: Returns null
async function getPostComments(postId) {
  try {
    const comments = await Comment.find({ postId: postId });
    if (comments.length == 0) {
      return null;
    } else {
      return comments;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

// Success: Returns true
// Failure: Returns false
async function updateComment(commentId, update) {
  try {
    const result = await Comment.findOneAndUpdate({ _id: commentId }, update);
    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Success: Returns true
// Failure: Returns false
async function deleteComment(commentId) {
  try {
    const result = await Comment.deleteOne({ _id: commentId });
    if (result.deletedCount > 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Success: Returns true
// Failure: Returns false
async function deleteAllCommentsOfPost(postId) {
  try {
    const result = await Comment.deleteMany({ postId: postId });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = {
  initDBConnection,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  createCommunity,
  getCommunity,
  getAllCommunities,
  updateCommunity,
  deleteCommunity,
  createPost,
  getUserPosts,
  getCommunityPosts,
  updatePost,
  deletePost,
  deleteAllPostsOfCommunity,
  createComment,
  getUserComments,
  getPostComments,
  updateComment,
  deleteComment,
  deleteAllCommentsOfPost,
};
