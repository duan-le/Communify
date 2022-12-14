import { BACKEND_URL } from "./constants.js";

export async function isLoggedIn() {
  const request = {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(BACKEND_URL + "/is-logged-in", request);
  if (response.ok) {
    return true;
  } else {
    return false;
  }
}
