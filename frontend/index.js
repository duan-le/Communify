import { BACKEND_URL } from "./constants.js";
import { isLoggedIn, logOut, updateAccount, deleteAccount } from "./session.js";

const accountSettingsNavItem = document.querySelector(
  "#accountSettingsNavItem"
);
const accountSettingsModal = document.querySelector("#accountSettingsModal");
const updatePasswordInput = document.querySelector("#updatePasswordInput");
const updatePasswordBtn = document.querySelector("#updatePasswordBtn");
const deleteAccountBtn = document.querySelector("#deleteAccountBtn");

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

async function redirectIfUserIsNotLoggedIn() {
  const userLoggedIn = await isLoggedIn();
  if (!userLoggedIn) {
    window.location.replace("login.html");
  }
}

redirectIfUserIsNotLoggedIn();
