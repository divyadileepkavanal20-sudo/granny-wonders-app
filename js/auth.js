const OWNER_EMAIL = "owner@grannywonders.com";
const OWNER_PASSWORD = "admin123";

function login() {
  const e = email.value;
  const p = password.value;

  if (e === OWNER_EMAIL && p === OWNER_PASSWORD) {
    localStorage.setItem("auth", "true");
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid credentials");
  }
}

function requireAuth() {
  if (!localStorage.getItem("auth")) {
    window.location.href = "index.html";
  }
}