import { BACKEND_URL } from "./constants.js";
import { isLoggedIn } from "./session.js";

const logInSignUpNavItem = document.querySelector("#logInSignUpNavItem");
const logOutNavItem = document.querySelector("#logOutNavItem");
const logOutBtn = document.querySelector("#logOutBtn");

logOutBtn.addEventListener("click", (e) => {
  logOut();
});

async function logOut() {
  const request = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(BACKEND_URL + "/logout", request);
  if (response.ok) {
    window.location.replace("login.html");
  }
}

async function setNavBarItems() {
  const userLoggedIn = await isLoggedIn();
  if (userLoggedIn) {
    logInSignUpNavItem.classList.add("display-none");
    logOutNavItem.classList.remove("display-none");
  }
}

setNavBarItems();
