 const API_BASE_URL = "http://localhost:5000/api";
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!token) window.location.href = "login.html";
    if (username) document.getElementById("adminName").innerHTML =' <i class="fas fa-user"></i>'+ username;

    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    // Load dashboard stats
    async function loadStats() {
  //render category
  const res = await fetch(`${API_BASE_URL}/categories`, { headers });
  const categories = await res.json();
  renderCategories(categories);
  categoriesID(categories);
  //render news
  const newsRes=await fetch(`${API_BASE_URL}/news`, { headers });
  const news = await newsRes.json();
  renderNews(news);
  document.getElementById("newsCount").textContent = news.length;
  //render comment
  const commentsRes=await fetch(`${API_BASE_URL}/feedback`, { headers });
  const comments = await commentsRes.json();
  renderComments(comments);
  document.getElementById("commentsCount").textContent = comments.length +1;
  //render applicatin
  const appsRes=await fetch(`${API_BASE_URL}/apply`, { headers });
  const apps = await appsRes.json();
  renderApplications(apps);
  document.getElementById("applicationsCount").textContent = apps.length;
}
   

    
    function renderComments(comments) {
      const list = document.getElementById("adminCommentsList");
      list.innerHTML = comments.map(c => `
        <tr>
          <td>${c.name}</td>
          <td>${c.message}</td>
          <td>${new Date(c.created_at).toLocaleDateString()}</td>
          <td><button class="btn btn-danger btn-sm" onclick="deleteComment(${c.id})"><i class="fas fa-trash"></i></button></td>
        </tr>
      `).join("");
    }

    async function deleteComment(id) {
      if (!confirm("Delete this comment?")) return;
      const res=await fetch(`${API_BASE_URL}/feedback/${id}`, { method: "DELETE", headers });
       if(res.status==404){
        alert(data.message);
      }
      loadStats();
    }

    function renderApplications(apps) {
      const list = document.getElementById("adminApplicationsList");
      list.innerHTML = apps.map(a => `
        <tr>
          <td>${a.fullName}</td>
          <td>${a.email}</td>
          <td>${a.phone}</td>
          <td>${a.program}</td>
          <td>${new Date(a.created_at).toLocaleDateString()}</td>
        </tr>
      `).join("");
    }
// Load categories

 function categoriesID(categories){
   const list=document.getElementById("newsCategory");
   list.innerHTML=categories.map(i=>`<option value='${i.id}'>${i.name}</option>`).join("");
 }
 function renderCategories(categories) {
  const list = document.getElementById("adminCategoriesList");
  list.innerHTML = categories.map(c => `
    <tr>
      <td>${c.name}</td>
      <td>
        <button class="btn btn-sm btn-warning me-2" onclick="editCategory(${c.id}, '${c.name}')"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-danger" onclick="deleteCategory(${c.id})"><i class="fas fa-trash"></i></button>
      </td>
    </tr>
  `).join("");

}

// Add category
async function addCategory() {
  const name = document.getElementById("categoryName").value.trim();
  if (!name) return alert("Category name is required");

  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name }),
  });

  if (res.ok) {
    document.getElementById("addCategoryForm").reset();
    bootstrap.Modal.getInstance(document.getElementById("addCategoryModal")).hide();
    loadStats();
  } else {
    alert("Failed to add category");
  }
}

// Delete category
async function deleteCategory(id) {
  if (!confirm("Delete this category?")) return;
  const res=await fetch(`${API_BASE_URL}/categories/${id}`, { method: "DELETE", headers });
    if(res.status==404){
        alert(data.message);
      }
  loadStatss();
}

// Edit category (simple prompt example)
async function editCategory(id, currentName) {
  const newName = prompt("Edit category name:", currentName);
  if (!newName) return;
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "PUT",
    headersz,
    body: JSON.stringify({ name: newName }),
  });
  if (!res.ok) {
    alert('Not updated');
  }
    loadStatss();
}
   function renderNews(news) {
      const list = document.getElementById("adminNewsList");
      list.innerHTML = news.map(n => `
        <tr>
          <td>${n.title}</td>
          <td>${n.content.substring(0, 80)}...</td>
          <td>${new Date(n.created_at).toLocaleDateString()}</td>
          <td>
            <button class="btn btn-sm btn-warning me-2" onclick="editNews(${n.id},'${n.title}','${n.content}',${n.category_id},'${n.image}')"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm btn-danger" onclick="deleteNews(${n.id})"><i class="fas fa-trash"></i></button>
          </td>
        </tr>
      `).join("");
    }
     // Preview image before upload
        document.getElementById('newsImageFile').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const preview = document.getElementById('preview');
                const url = URL.createObjectURL(file);
                preview.src = url;
                preview.style.display = 'block';
                
                // Clean up URL when done
                preview.onload = () => URL.revokeObjectURL(url);
            }
        });
       
async function addNews() {
  const title = document.getElementById("newsTitle").value.trim();
  const content = document.getElementById("newsContent").value.trim();
  const category_id = document.getElementById("newsCategory").value.trim();
  const fileInput = document.getElementById("newsImageFile");
  const file = fileInput.files[0];
    if (!file) {
          alert('Please select an image');
        }
  if (!title || !content) return alert("Title & content required");

  // Use FormData to handle file upload
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("category_id", category_id);
  formData.append("image", file); 
  // only append if file selected
  try {
    const res = await fetch(`${API_BASE_URL}/news`, {
      method: "POST",
      body: formData, // no need for headers when sending FormData
    });

     const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to add news");

    document.getElementById("addNewsForm").reset();
    bootstrap.Modal.getInstance(document.getElementById("addNewsModal")).hide();
    loadStats(); // refresh news list
    alert("News added successfully!");
  } catch (err) {
    alert(err.message);
  }
  loadStats();
}

 async function editNews(id, title, content, categoryId = "", imageUrl = "") {
  const editModal = document.getElementById("editmodal");

  // Fetch categories for dropdown
  const catRes = await fetch(`${API_BASE_URL}/categories`, { headers });
  const categories = await catRes.json();

  // Build category options
  const categoryOptions = categories.map(
    c => `<option value="${c.id}" ${c.id === categoryId ? "selected" : ""}>${c.name}</option>`
  ).join("");

  // Modal content
  editModal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit News Article</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form id="editNewsForm">
            <div class="mb-3">
              <label class="form-label">Title</label>
              <input type="text" class="form-control" id="UNTitle" value="${title}" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Content</label>
              <textarea class="form-control" id="UNContent" rows="4" required>${content}</textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Category</label>
              <select class="form-select" id="UNCategory">
                <option value="">-- Select Category --</option>
                ${categoryOptions}
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Image URL (optional)</label>
              <input type="file" class="form-control" id="UNImage" value="${imageUrl || ""}" />
            </div>
            <div id="previewContainer">
                <img src="../backend/uploads/${imageUrl}" id="preview" class="preview" style="display: block;">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" onclick="updateNews(${id})">Update</button>
        </div>
      </div>
    </div>`;

  // Show modal (initialize Bootstrap modal if not already)
  const modal = new bootstrap.Modal(editModal);
  modal.show();
}

// Function to update the news via API
async function updateNews(id) {
 
  const title = document.getElementById("UNTitle").value.trim();
  const content = document.getElementById("UNContent").value.trim();
  const category_id = document.getElementById("UNCategory").value.trim();
  const fileInput = document.getElementById("UNImage");
  const file = fileInput.files[0];
    if (!file) {
          alert('Please select an image');
        }
  if (!title || !content) return alert("Title & content required");

  // Use FormData to handle file upload
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("category_id", category_id);
  formData.append("image", file); 

  const res = await fetch(`${API_BASE_URL}/news/${id}`, {
     method: "PUT",
     body: formData,
  });

  if (res.ok) {
    alert("News updated successfully!");
    bootstrap.Modal.getInstance(document.getElementById("editmodal")).hide();
    loadStats(); // reload updated list
  } else {
    alert("Failed to update news.");
  }
  loadStats();
}

    async function deleteNews(id) {
      if (!confirm("Delete this news article?")) return;
      const res = await fetch(`${API_BASE_URL}/news/${id}`, { method: "DELETE", headers });
      if(res.status==404){
        alert(data.message);
      }
      loadStats();
    }


      async function register(event) {
      event.preventDefault();

      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("email").value.trim(); 
      const password = document.getElementById("password").value.trim();
      const confirmPassword = document.getElementById("confirmPassword").value.trim();

      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username,email, password })
        });

        const data = await res.json();

        if (res.ok) {
          alert("Registration successful!");
         bootstrap.Modal.getInstance(document.getElementById("registerModal")).hide();
        } else {
          alert(data.message || "Registration failed.");
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred. Try again later.");
      }
      loadStats();
    }

    function logout() {
      localStorage.clear();
      window.location.href = "login.html";
    }
    loadStats();