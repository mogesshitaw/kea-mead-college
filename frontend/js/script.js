document.addEventListener("DOMContentLoaded", () => {
  // ----- Admin Login -----
  const loginForm = document.getElementById("loginForm");
  const adminPasswordInput = document.getElementById("adminPassword");
  const loginMessage = document.getElementById("loginMessage");
  const loginSection = document.getElementById("loginSection");
  const newsFormSection = document.getElementById("newsFormSection");
  const logoutBtn = document.getElementById("logoutBtn");

  const ADMIN_PASSWORD = "kea123"; // change to your real password

  function checkLogin() {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
    if (isLoggedIn) {
      loginSection.classList.add("d-none");
      newsFormSection.classList.remove("d-none");
    } else {
      loginSection.classList.remove("d-none");
      newsFormSection.classList.add("d-none");
    }
  }

  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      if (adminPasswordInput.value === ADMIN_PASSWORD) {
        localStorage.setItem("isAdminLoggedIn", "true");
        checkLogin();
      } else {
        loginMessage.textContent = "Invalid password!";
      }
      loginForm.reset();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.setItem("isAdminLoggedIn", "false");
      checkLogin();
    });
  }

  checkLogin();

  // ----- News System -----
  const newsForm = document.getElementById("newsForm");
  const newsList = document.getElementById("newsList");

  if (newsForm && newsList) {
    function loadNews() {
      const news = JSON.parse(localStorage.getItem("news")) || [];
      newsList.innerHTML = news.map(n => `
        <div class="col-md-4">
          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">${n.title}</h5>
              <p class="card-text">${n.content}</p>
              <small class="text-muted">${n.date}</small>
            </div>
          </div>
        </div>
      `).join("");
    }

    newsForm.addEventListener("submit", e => {
      e.preventDefault();
      const title = document.getElementById("newsTitle").value;
      const content = document.getElementById("newsContent").value;
      const date = new Date().toLocaleString();

      const news = JSON.parse(localStorage.getItem("news")) || [];
      news.unshift({ title, content, date });
      localStorage.setItem("news", JSON.stringify(news));

      newsForm.reset();
      loadNews();
    });

    loadNews();
  }

  // ----- Comment System (Home page only) -----
  const form = document.getElementById("commentForm");
  const commentList = document.getElementById("commentList");

  if (form && commentList) {
    function loadComments() {
      const comments = JSON.parse(localStorage.getItem("comments")) || [];
      commentList.innerHTML = comments.map(c => `
        <div class="card my-2">
          <div class="card-body">
            <h5>${c.name}</h5>
            <p>${c.text}</p>
          </div>
        </div>
      `).join("");
    }

    form.addEventListener("submit", e => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const text = document.getElementById("comment").value;

      const comments = JSON.parse(localStorage.getItem("comments")) || [];
      comments.push({ name, text });
      localStorage.setItem("comments", JSON.stringify(comments));

      form.reset();
      loadComments();
    });

    loadComments();
  }
});
