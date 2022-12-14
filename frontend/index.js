import { BACKEND_URL } from "./constants.js";
import { isLoggedIn } from "./session.js";

async function redirectIfUserIsNotLoggedIn() {
  const userLoggedIn = await isLoggedIn();
  if (!userLoggedIn) {
    window.location.replace("login.html");
  }
}

redirectIfUserIsNotLoggedIn();
