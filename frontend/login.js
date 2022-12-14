import { BACKEND_URL } from "./constants.js";

const usernameInput = document.querySelector("#usernameInput");
const passwordInput = document.querySelector("#passwordInput");
const errorNotif = document.querySelector("#errorNotif");
const logInBtn = document.querySelector("#logInBtn");

logInBtn.addEventListener("click", (e) => {
  logIn();
});

async function logIn() {
  const request = {
    method: "POST",
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
    window.location.replace("/");
  } else {
    const res = await response.json();
    errorNotif.firstChild.nodeValue = res.msg;
    errorNotif.classList.remove("display-none");
  }
}
