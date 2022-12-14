import { BACKEND_URL } from "./constants.js";

const usernameInput = document.querySelector("#usernameInput");
const passwordInput = document.querySelector("#passwordInput");
const errorNotif = document.querySelector("#errorNotif");
const signUpBtn = document.querySelector("#signUpBtn");

signUpBtn.addEventListener("click", (e) => {
  signUp();
});

async function signUp() {
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

  const response = await fetch(BACKEND_URL + "/signup", request);
  if (response.ok) {
    window.location.replace("login.html");
  } else {
    const res = await response.json();
    errorNotif.firstChild.nodeValue = res.msg;
    errorNotif.classList.remove("display-none");
  }
}
