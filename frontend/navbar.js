import { BACKEND_URL } from "./constants.js";
import { isLoggedIn, logOut, getAccount } from "./session.js";

const logInSignUpNavItem = document.querySelector("#logInSignUpNavItem");
const logOutNavItem = document.querySelector("#logOutNavItem");
const logOutBtn = document.querySelector("#logOutBtn");

logOutBtn.addEventListener("click", async (e) => {
  const userLoggedOut = await logOut();
  if (userLoggedOut) {
    window.location.replace("login.html");
  }
});

// Hides/displays parts of the nav bar depending if user is logged in or not
// Also hides/displays parts of the nav bar for regular users and admins
async function setNavBarItems() {
  const userLoggedIn = await isLoggedIn();
  if (userLoggedIn) {
    logInSignUpNavItem.classList.add("display-none");
    logOutNavItem.classList.remove("display-none");
  }

  const user = await getAccount();
  if (user.admin) {
    const createCommunityNavItem = document.querySelector(
      "#createCommunityNavItem"
    );
    createCommunityNavItem.classList.remove("display-none");
  }
}

setNavBarItems();
