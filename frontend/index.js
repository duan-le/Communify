import { BACKEND_URL } from "./constants.js";
import {
  isLoggedIn,
  logOut,
  getAccount,
  updateAccount,
  deleteAccount,
  getAllCommunities,
} from "./session.js";

const communitiesNavItem = document.querySelector("#communitiesNavItem");
const communitiesModal = document.querySelector("#communitiesModal");
const followingCommunitiesList = document.querySelector(
  "#followingCommunitiesList"
);
const remainingCommunitiesList = document.querySelector(
  "#remainingCommunitiesList"
);
const accountSettingsNavItem = document.querySelector(
  "#accountSettingsNavItem"
);
const accountSettingsModal = document.querySelector("#accountSettingsModal");
const updatePasswordInput = document.querySelector("#updatePasswordInput");
const updatePasswordBtn = document.querySelector("#updatePasswordBtn");
const deleteAccountBtn = document.querySelector("#deleteAccountBtn");

async function redirectIfUserIsNotLoggedIn() {
  const userLoggedIn = await isLoggedIn();
  if (!userLoggedIn) {
    window.location.replace("login.html");
  }
}

async function followCommunity(community) {
  const user = await getAccount();
  user.communitiesFollowed.push(community);
  const accountUpdated = await updateAccount({
    communitiesFollowed: user.communitiesFollowed,
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

accountSettingsNavItem.addEventListener("click", (e) => {
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
