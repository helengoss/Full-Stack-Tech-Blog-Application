let token = localStorage.getItem("authToken");

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
        token = data.token;

        alert("User Logged In successfully");

        // Fetch the posts list
        fetchPosts();

        // Hide the auth container and show the app container as we're now logged in
        document.getElementById("auth-container").classList.add("hidden");
        document.getElementById("app-container").classList.remove("hidden");
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
    token = null;
    document.getElementById("auth-container").classList.remove("hidden");
    document.getElementById("app-container").classList.add("hidden");
  });
}

function fetchPosts() {
  fetch("http://localhost:3001/api/posts", {
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

        const deleteBtn = token
          ? `<button class="delete-btn" onclick="deletePost(${post.id})">×</button>`
          : "";

        const editBtn = token
          ? `<button class="edit-btn" onclick="editPost(${post.id})">Edit</button>`
          : "";

        div.innerHTML = `<h3>${post.title}</h3>
        <p>${post.content}</p>
        <small>By: ${post.postedBy} on ${new Date(
          post.createdOn
        ).toLocaleString()}</small>
        ${deleteBtn}${editBtn}`;

        postsContainer.appendChild(div);
      });
    });
}

function createPost() {
  const title = document.getElementById("post-title").value;
  const content = document.getElementById("post-content").value;
  fetch("http://localhost:3001/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content, postedBy: "User" }),
  })
    .then((res) => res.json())
    .then(() => {
      alert("Post created successfully");
      fetchPosts();
    });
}

function editPost(id) {
  const div = document.querySelector(`.post[data-id="${id}"]`);
  const { title, content, postedBy } = div.dataset;

  div.innerHTML = `
    <input type="text" id="edit-title-${id}">
    <textarea id="edit-content-${id}"></textarea>
    <button class="edit-btn" onclick="savePost(${id})">Save</button>
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

  fetch(`http://localhost:3001/api/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content, postedBy }),
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
