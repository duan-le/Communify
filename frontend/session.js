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

export async function logOut() {
  const request = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(BACKEND_URL + "/logout", request);
  if (response.ok) {
    return true;
  } else {
    return false;
  }
}

export async function getAccount() {
  const request = {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(BACKEND_URL + "/get-account", request);
  if (response.ok) {
    const res = await response.json();
    return res;
  } else {
    return null;
  }
}

export async function updateAccount(update) {
  const body = {};
  if (update.password) body.password = update.password;
  if (update.communitiesOwned) body.communitiesOwned = update.communitiesOwned;
  if (update.communitiesFollowed)
    body.communitiesFollowed = update.communitiesFollowed;

  const request = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  const response = await fetch(BACKEND_URL + "/update-account", request);
  if (response.ok) {
    return true;
  } else {
    return false;
  }
}

export async function deleteAccount() {
  const request = {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(BACKEND_URL + "/delete-account", request);
  if (response.ok) {
    return true;
  } else {
    return false;
  }
}

export async function getAllCommunities() {
  const request = {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(BACKEND_URL + "/get-all-communities", request);
  if (response.ok) {
    const res = await response.json();
    return res;
  } else {
    return null;
  }
}
