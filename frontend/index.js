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
} from "./session.js";

const communitiesNavItem = document.querySelector("#communitiesNavItem");
const communitiesModal = document.querySelector("#communitiesModal");
const followingCommunitiesList = document.querySelector(
  "#followingCommunitiesList"
);
const remainingCommunitiesList = document.querySelector(
  "#remainingCommunitiesList"
);
const createPostNavItem = document.querySelector("#createPostNavItem");
const createPostModal = document.querySelector("#createPostModal");
const createPostCommunitySelect = document.querySelector(
  "#createPostCommunitySelect"
);
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

async function populateFeed() {
  const userFeedPosts = await getUserFeedPosts();
  userFeedPosts.forEach((post) => {
    const likeButtonState = null;
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
              <a class="level-item like-button ${likeButtonState}">
                <span class="icon">
                  <i class="fas fa-heart"></i>
                </span>
              </a>
            </div>
          </nav>
        </div>
      </article>
    `;
    feedDiv.appendChild(postElement);
  });
}

async function redirectIfUserIsNotLoggedIn() {
  const userLoggedIn = await isLoggedIn();
  if (!userLoggedIn) {
    window.location.replace("login.html");
  }
}

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

communitiesNavItem.addEventListener("click", populateCommunitiesModal);

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

redirectIfUserIsNotLoggedIn();
populateFeed();
