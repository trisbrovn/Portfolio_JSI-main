import { auth, db } from "./firebase-cdn.js";

/* ================= REGISTER ================= */
function register() {
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const fullname = document.getElementById("fullname");
  const phone = document.getElementById("phone");
  const address = document.getElementById("address");
  const career = document.getElementById("career");
  const description = document.getElementById("description");
  const photo = document.getElementById("photo");

  // TODO: create user with email and password FIREBASE AUTH
  // TODO: after creating user, save additional info to firestore "users" collection
}

/* ================= LOGIN ================= */
function login() {
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const fullname = document.getElementById("fullname");
  const phone = document.getElementById("phone");
  const address = document.getElementById("address");
  const career = document.getElementById("career");
  const description = document.getElementById("description");
  const photo = document.getElementById("photo");
  // hide other elements
  fullname.style.display = "none";
  phone.style.display = "none";
  address.style.display = "none";
  career.style.display = "none";
  description.style.display = "none";
  photo.style.display = "none";
  // TODO: login with email and password FIREBASE AUTH
}

/* ================= AUTH GUARD ================= */
auth.onAuthStateChanged((user) => {
  if (
    !user &&
    (location.href.includes("home") || location.href.includes("edit"))
  ) {
    window.location.href = "index.html";
  }
});

/* ================= LOAD PROFILE ================= */
function loadProfile() {
  const user = auth.currentUser;
  if (!user) return;

  // TODO: load user profile from firestore "users" collection and set to form fields
}

/* ================= UPDATE PROFILE ================= */
function updateProfile() {
  const user = auth.currentUser;
  if (!user) return;
  // TODO: update user profile in firestore "users" collection
}

/* ================= LOGOUT ================= */
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  auth.signOut().then(() => (window.location.href = "index.html"));
});

/* ================= EVENT LISTENERS ================= */
document.getElementById("register")?.addEventListener("click", (event) => {
  event.preventDefault();
  register();
});
document.getElementById("login")?.addEventListener("click", (event) => {
  event.preventDefault();
  login();
});
document
  .getElementById("updateProfile")
  ?.addEventListener("click", (event) => {
    event.preventDefault();
    updateProfile();
  });

/* ================= INITIALIZE ================= */
if (location.pathname.includes("home")) {
  loadProfile();
}


