import { BACKEND_URL } from "./constants.js";
import {
  isLoggedIn,
  logOut,
  getAccount,
  updateAccount,
  deleteAccount,
  getAllCommunities,
  createPost,
  getUserFeedPosts,
  getPost,
  updatePost,
  createCommunity,
} from "./session.js";

const communitiesNavItem = document.querySelector("#communitiesNavItem");
const communitiesModal = document.querySelector("#communitiesModal");
const followingCommunitiesList = document.querySelector(
  "#followingCommunitiesList"
);
const remainingCommunitiesList = document.querySelector(
  "#remainingCommunitiesList"
);
const createCommunityNavItem = document.querySelector(
  "#createCommunityNavItem"
);
const createCommunityModal = document.querySelector("#createCommunityModal");
const communityInput = document.querySelector("#communityInput");
const createPostNavItem = document.querySelector("#createPostNavItem");
const createPostModal = document.querySelector("#createPostModal");
const createPostCommunitySelect = document.querySelector(
  "#createPostCommunitySelect"
);
const createCommunityBtn = document.querySelector("#createCommunityBtn");
const publishPostBtn = document.querySelector("#publishPostBtn");
const titleInput = document.querySelector("#titleInput");
const bodyTextArea = document.querySelector("#bodyTextArea");
const accountSettingsNavItem = document.querySelector(
  "#accountSettingsNavItem"
);
const accountSettingsModal = document.querySelector("#accountSettingsModal");
const updatePasswordInput = document.querySelector("#updatePasswordInput");
const updatePasswordBtn = document.querySelector("#updatePasswordBtn");
const deleteAccountBtn = document.querySelector("#deleteAccountBtn");
const feedDiv = document.querySelector("#feedDiv");
const newestSortBtn = document.querySelector("#newestSortBtn");
const oldestSortBtn = document.querySelector("#oldestSortBtn");
const mostLikedSortBtn = document.querySelector("#mostLikedSortBtn");
const leastLikedSortBtn = document.querySelector("#leastLikedSortBtn");

// Increase like counter on post and database
async function likePost(likedPostId) {
  const user = await getAccount();
  const likedPostIds = new Set(user.likedPostIds);
  likedPostIds.add(likedPostId);
  const accountUpdated = await updateAccount({
    likedPostIds: [...likedPostIds],
  });

  const post = await getPost(likedPostId);
  post.rating++;
  const updatedPost = await updatePost({
    postId: likedPostId,
    rating: post.rating > 0 ? post.rating : 0,
  });
  document.querySelector(`#lc${likedPostId}`).innerHTML = updatedPost.rating;
}

// Decrease like counter on post and database
async function unlikePost(unlikedPostId) {
  const user = await getAccount();
  const likedPostIds = new Set(user.likedPostIds);
  likedPostIds.delete(unlikedPostId);
  const accountUpdated = await updateAccount({
    likedPostIds: [...likedPostIds],
  });

  const post = await getPost(unlikedPostId);
  post.rating--;
  const updatedPost = await updatePost({
    postId: unlikedPostId,
    rating: post.rating > 0 ? post.rating : 0,
  });
  document.querySelector(`#lc${unlikedPostId}`).innerHTML = updatedPost.rating;
}

// Populate the user's home feed
async function populateFeed(sort) {
  feedDiv.innerHTML = "";
  const user = await getAccount();
  const likedPostIds = new Set(user.likedPostIds);
  const userFeedPosts = await getUserFeedPosts(sort);
  userFeedPosts.forEach((post) => {
    const likeButtonState = likedPostIds.has(post._id)
      ? "like-button-active"
      : "like-button-inactive";
    const postElement = document.createElement("div");
    postElement.classList.add("box");
    postElement.innerHTML = `
      <article class="media">
        <div class="media-content">
          <div class="content">
            <p>
              <strong>${post.title}</strong> <small>@${post.author}</small>
              <small>in ${post.community}</small>
              <br />
              ${post.body}
            </p>
          </div>
          <nav class="level is-mobile">
            <div class="level-left">
              <small id="lc${post._id}">${post.rating}</small>&nbsp
              <a class="level-item">
                <i id="p${
                  post._id
                }" class="fa-solid fa-heart like-button ${likeButtonState}"></i>
              </a>
              <small>created at ${new Date(
                post.createdAt
              ).toLocaleString()}</small>
            </div>
          </nav>
        </div>
      </article>
    `;
    feedDiv.appendChild(postElement);
    const likeBtn = document.querySelector(`#p${post._id}`);
    likeBtn.addEventListener("click", (e) => {
      if (e.target.classList.contains("like-button-active")) {
        e.target.classList.remove("like-button-active");
        e.target.classList.add("like-button-inactive");
        unlikePost(e.target.id.substring(1, e.target.id.length));
      } else if (e.target.classList.contains("like-button-inactive")) {
        e.target.classList.remove("like-button-inactive");
        e.target.classList.add("like-button-active");
        likePost(e.target.id.substring(1, e.target.id.length));
      }
    });
  });

  userFeedPosts.forEach((post) => {});
}

// Redirect users back to login page if they are not logged in
async function redirectIfUserIsNotLoggedIn() {
  const userLoggedIn = await isLoggedIn();
  if (!userLoggedIn) {
    window.location.replace("login.html");
  }
}

// Logic to follow a community
async function followCommunity(community) {
  const { communitiesFollowed } = await getAccount();
  communitiesFollowed.push(community);
  const accountUpdated = await updateAccount({
    communitiesFollowed: communitiesFollowed,
  });
  if (accountUpdated) {
    populateCommunitiesModal();
  }
}

// Logic to unfollow a community
async function unfollowCommunity(community) {
  const user = await getAccount();
  const communitiesFollowed = user.communitiesFollowed.filter(
    (c) => c !== community
  );
  const accountUpdated = await updateAccount({
    communitiesFollowed: communitiesFollowed,
  });
  if (accountUpdated) {
    populateCommunitiesModal();
  }
}

// Populate the list of communities in the Communities modal
async function populateCommunitiesModal(e) {
  followingCommunitiesList.innerHTML = "";
  remainingCommunitiesList.innerHTML = "";

  const user = await getAccount();
  const communitiesFollowed = user.communitiesFollowed.sort((a, b) =>
    a.localeCompare(b)
  );
  communitiesFollowed.forEach((communityName) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.id = communityName;
    a.innerHTML = communityName;
    a.addEventListener("click", (e) => {
      unfollowCommunity(e.target.id);
    });
    li.appendChild(a);
    followingCommunitiesList.appendChild(li);
  });

  const allCommunities = await getAllCommunities();
  const remainingCommunities = allCommunities.filter(
    (c) => !user.communitiesFollowed.includes(c.name)
  );
  remainingCommunities.forEach((community) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.id = community.name;
    a.innerHTML = community.name;
    a.addEventListener("click", (e) => {
      followCommunity(e.target.id);
    });
    li.appendChild(a);
    remainingCommunitiesList.appendChild(li);
  });

  communitiesModal.classList.add("is-active");
}

// Create community event listeners
communitiesNavItem.addEventListener("click", populateCommunitiesModal);

createCommunityNavItem.addEventListener("click", (e) => {
  communityInput.value = "";
  createCommunityModal.classList.add("is-active");
});

createCommunityBtn.addEventListener("click", async (e) => {
  const communityCreated = await createCommunity({
    name: communityInput.value,
  });
  if (communityCreated) {
    window.location.replace("index.html");
  }
});

// Create post event listeners
createPostNavItem.addEventListener("click", async (e) => {
  titleInput.value = "";
  bodyTextArea.value = "";
  createPostCommunitySelect.value = "";
  createPostCommunitySelect.innerHTML = "";
  const user = await getAccount();
  const communitiesFollowed = user.communitiesFollowed.sort((a, b) =>
    a.localeCompare(b)
  );
  communitiesFollowed.forEach((community) => {
    const option = document.createElement("option");
    option.innerHTML = community;
    createPostCommunitySelect.appendChild(option);
  });
  createPostModal.classList.add("is-active");
});

publishPostBtn.addEventListener("click", async (e) => {
  if (titleInput.value && bodyTextArea && createPostCommunitySelect.value) {
    const postCreated = await createPost({
      community: createPostCommunitySelect.value,
      title: titleInput.value,
      body: bodyTextArea.value,
    });
    if (postCreated) {
      window.location.replace("index.html");
    }
  }
});

// Account settings event listeners
accountSettingsNavItem.addEventListener("click", (e) => {
  updatePasswordInput.value = "";
  accountSettingsModal.classList.add("is-active");
});

deleteAccountBtn.addEventListener("click", async (e) => {
  const accountDeleted = await deleteAccount();
  if (accountDeleted) {
    window.location.replace("login.html");
  }
});

updatePasswordBtn.addEventListener("click", async (e) => {
  const accountUpdated = await updateAccount({
    password: updatePasswordInput.value,
  });
  if (accountUpdated) {
    window.location.replace("index.html");
  }
});

// Sorting the user's home feed
newestSortBtn.addEventListener("click", (e) => {
  populateFeed(1);
});
oldestSortBtn.addEventListener("click", (e) => {
  populateFeed(2);
});
mostLikedSortBtn.addEventListener("click", (e) => {
  populateFeed(3);
});
leastLikedSortBtn.addEventListener("click", (e) => {
  populateFeed(4);
});

redirectIfUserIsNotLoggedIn();
populateFeed(1);
