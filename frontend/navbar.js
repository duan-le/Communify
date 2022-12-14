import { BACKEND_URL } from "./constants.js";
import { isLoggedIn, logOut } from "./session.js";

const logInSignUpNavItem = document.querySelector("#logInSignUpNavItem");
const logOutNavItem = document.querySelector("#logOutNavItem");
const logOutBtn = document.querySelector("#logOutBtn");

logOutBtn.addEventListener("click", async (e) => {
  const userLoggedOut = await logOut();
  if (userLoggedOut) {
    window.location.replace("login.html");
  }
});

async function setNavBarItems() {
  const userLoggedIn = await isLoggedIn();
  if (userLoggedIn) {
    logInSignUpNavItem.classList.add("display-none");
    logOutNavItem.classList.remove("display-none");
  }
}

setNavBarItems();
