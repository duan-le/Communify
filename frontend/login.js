import { BACKEND_URL } from "./constants.js";
import { isLoggedIn } from "./session.js";

const usernameInput = document.querySelector("#usernameInput");
const passwordInput = document.querySelector("#passwordInput");
const errorNotif = document.querySelector("#errorNotif");
const logInBtn = document.querySelector("#logInBtn");

logInBtn.addEventListener("click", (e) => {
  logIn();
});

// Call to the server to authenticate the user and log them in
async function logIn() {
  const request = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: usernameInput.value,
      password: passwordInput.value,
    }),
  };

  const response = await fetch(BACKEND_URL + "/login", request);
  if (response.ok) {
    window.location.replace("index.html");
  } else {
    const res = await response.json();
    errorNotif.firstChild.nodeValue = res.msg;
    errorNotif.classList.remove("display-none");
  }
}

// Redirect the user if they are logged in
async function redirectIfUserIsLoggedIn() {
  const userLoggedIn = await isLoggedIn();
  if (userLoggedIn) {
    window.location.replace("index.html");
  }
}

redirectIfUserIsLoggedIn();
