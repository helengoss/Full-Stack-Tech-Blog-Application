let token = localStorage.getItem("authToken");
let currentUser = localStorage.getItem("username");

function register() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  fetch("http://localhost:3001/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.errors) {
        alert(data.errors[0].message);
      } else {
        alert("User registered successfully");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function login() {
  const username = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  fetch("http://localhost:3001/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      // Save the token in the local storage
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("username", data.userData.username);
        token = data.token;
        currentUser = data.userData.username;

        alert("User Logged In successfully");

        // Fetch the posts list
        fetchPosts();

        // Hide the auth container and show the app container as we're now logged in
        document.getElementById("auth-container").classList.add("hidden");
        document.getElementById("app-container").classList.remove("hidden");
        loadCategories();
      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function logout() {
  fetch("http://localhost:3001/api/users/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  }).then(() => {
    // Clear the token from the local storage as we're now logged out
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    token = null;
    currentUser = null;
    document.getElementById("auth-container").classList.remove("hidden");
    document.getElementById("app-container").classList.add("hidden");
  });
}

function loadCategories() {
  fetch("http://localhost:3001/api/categories", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((categories) => {
      const select = document.getElementById("post-category");
      select.innerHTML = '<option value="">No category</option>';
      categories.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.category_name;
        select.appendChild(option);
      });
    })
    .catch((err) => console.error("Error loading categories:", err));
}

function fetchPosts(filterCategoryName) {
  let url = "http://localhost:3001/api/posts";
  if (filterCategoryName) {
    // find the category id from the dropdown options
    const select = document.getElementById("post-category");
    const option = Array.from(select.options).find(
      (o) => o.textContent === filterCategoryName
    );
    if (option && option.value) {
      url += `?categoryId=${option.value}`;
    }
  }
  fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((posts) => {
      const postsContainer = document.getElementById("posts");
      postsContainer.innerHTML = "";
      posts.forEach((post) => {
        const div = document.createElement("div");
        div.classList.add("post");
        div.dataset.id = post.id;
        div.dataset.title = post.title;
        div.dataset.content = post.content;
        div.dataset.postedBy = post.postedBy;
        div.dataset.categoryId = post.categoryId || post.category_id || "";

        const deleteBtn = token
          ? `<button class="delete-btn" onclick="deletePost(${post.id})">×</button>`
          : "";

        const editBtn = token
          ? `<button class="edit-btn" onclick="editPost(${post.id})">Edit</button>`
          : "";

        const categoryLabel = post.category
          ? `<span class="category-tag">${post.category.category_name}</span>`
          : "";

        div.innerHTML = `<h3>${post.title}</h3>
        <p>${post.content}</p>
        <small>By: ${post.postedBy} on ${new Date(
          post.createdOn
        ).toLocaleString()}</small>
        ${categoryLabel}
        ${deleteBtn}${editBtn}`;

        postsContainer.appendChild(div);
      });
    });
}

function createPost() {
  const title = document.getElementById("post-title").value;
  const content = document.getElementById("post-content").value;
  const categoryId = document.getElementById("post-category").value || null;
  fetch("http://localhost:3001/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content, postedBy: currentUser, categoryId }),
  })
    .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
    .then(({ ok, data }) => {
      if (!ok) {
        alert(data.error || "Failed to create post");
        return;
      }
      document.getElementById("post-title").value = "";
      document.getElementById("post-content").value = "";
      fetchPosts();
    })
    .catch((error) => console.error("Error creating post:", error));
}

function editPost(id) {
  const div = document.querySelector(`.post[data-id="${id}"]`);
  const { title, content, postedBy, categoryId } = div.dataset;

  // Build category options from the existing dropdown
  const sourceSelect = document.getElementById("post-category");
  const categoryOptions = Array.from(sourceSelect.options)
    .map((o) => `<option value="${o.value}" ${o.value == categoryId ? "selected" : ""}>${o.textContent}</option>`)
    .join("");

  div.innerHTML = `
    <input type="text" id="edit-title-${id}">
    <textarea id="edit-content-${id}"></textarea>
    <select id="edit-category-${id}">${categoryOptions}</select>
    <button class="edit-btn" style="position:static;" onclick="savePost(${id})">Save</button>
    <button class="delete-btn" style="position:static;margin-left:8px;" onclick="fetchPosts()">Cancel</button>
  `;

  document.getElementById(`edit-title-${id}`).value = title;
  document.getElementById(`edit-content-${id}`).value = content;
}

function savePost(id) {
  const div = document.querySelector(`.post[data-id="${id}"]`);
  const title = document.getElementById(`edit-title-${id}`).value;
  const content = document.getElementById(`edit-content-${id}`).value;
  const postedBy = div.dataset.postedBy;
  const categoryId = document.getElementById(`edit-category-${id}`).value || null;

  fetch(`http://localhost:3001/api/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content, postedBy, categoryId }),
  })
    .then((res) => res.json())
    .then(() => fetchPosts())
    .catch((error) => console.error("Error saving post:", error));
}

// function to delete a post from the database
function deletePost(id) {
  fetch(`http://localhost:3001/api/posts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((data) => {
          alert(data.message || "Failed to delete post");
          throw new Error("Delete failed");
        });
      }

      // reload posts after deletion
      fetchPosts();
    })
    .catch((error) => console.error("Error deleting post:", error));
}
