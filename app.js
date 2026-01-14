import { auth, db } from "./firebase-cdn.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut 
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc 
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

/* ================= REGISTER ================= */
async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  
  // Các thông tin bổ sung
  const fullname = document.getElementById("fullname").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const career = document.getElementById("career").value;
  const description = document.getElementById("description").value;
  const photo = document.getElementById("photo").value;

  try {
    // 1. Tạo tài khoản trên Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Lưu thông tin chi tiết vào Firestore collection "users"
    // Sử dụng UID của user làm ID cho document để dễ dàng quản lý
    await setDoc(doc(db, "users", user.uid), {
      fullname: fullname,
      phone: phone,
      address: address,
      career: career,
      description: description,
      photo: photo,
      email: email,
      createdAt: new Date().toISOString()
    });

    alert("Đăng ký thành công!");
    window.location.href = "home.html"; // Chuyển hướng sau khi đăng ký
  } catch (error) {
    console.error("Lỗi đăng ký:", error.message);
    alert("Lỗi: " + error.message);
  }
}

/* ================= LOGIN ================= */
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Đăng nhập thành công!");
    window.location.href = "home.html";
  } catch (error) {
    console.error("Lỗi đăng nhập:", error.message);
    alert("Sai tài khoản hoặc mật khẩu!");
  }
}

/* ================= AUTH GUARD ================= */
// Kiểm tra trạng thái đăng nhập để bảo vệ các trang nội bộ
onAuthStateChanged(auth, (user) => {
  if (
    !user &&
    (location.href.includes("home") || location.href.includes("edit"))
  ) {
    window.location.href = "index.html";
  }
});

/* ================= LOAD PROFILE ================= */
async function loadProfile() {
  // onAuthStateChanged sẽ giúp đảm bảo user đã load xong
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if(document.getElementById("fullname")) document.getElementById("fullname").value = data.fullname || "";
        if(document.getElementById("phone")) document.getElementById("phone").value = data.phone || "";
        if(document.getElementById("address")) document.getElementById("address").value = data.address || "";
        if(document.getElementById("career")) document.getElementById("career").value = data.career || "";
        if(document.getElementById("description")) document.getElementById("description").value = data.description || "";
        if(document.getElementById("photo")) document.getElementById("photo").value = data.photo || "";
      }
    }
  });
}

/* ================= UPDATE PROFILE ================= */
async function updateProfile() {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const docRef = doc(db, "users", user.uid);
    await updateDoc(docRef, {
      fullname: document.getElementById("fullname").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      career: document.getElementById("career").value,
      description: document.getElementById("description").value,
      photo: document.getElementById("photo").value,
      updatedAt: new Date().toISOString()
    });
    alert("Cập nhật thông tin thành công!");
  } catch (error) {
    console.error("Lỗi cập nhật:", error);
    alert("Không thể cập nhật thông tin.");
  }
}

/* ================= LOGOUT ================= */
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  signOut(auth).then(() => (window.location.href = "index.html"));
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

document.getElementById("updateProfile")?.addEventListener("click", (event) => {
  event.preventDefault();
  updateProfile();
});

/* ================= INITIALIZE ================= */
if (location.pathname.includes("home") || location.pathname.includes("edit")) {
  loadProfile();
}