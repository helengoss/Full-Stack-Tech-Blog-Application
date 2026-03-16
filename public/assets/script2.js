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

        // ONLY show delete button if token exists
        const deleteBtn = token
          ? `<button class="delete-btn" onclick="deletePost(${post.id})">Delete</button>`
          : "";

        div.innerHTML = `<h3>${post.title}</h3>
        <p>${post.content}</p>
        <small>By: ${post.postedBy} on ${new Date(
          post.createdOn
        ).toLocaleString()}</small>
        ${deleteBtn}`;

        postsContainer.appendChild(div);
      });
    });
}

// CHANGED: improved deletePost to handle errors and alert if deletion fails
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
      fetchPosts(); // reload posts after successful deletion
    })
    .catch((error) => console.error("Error deleting post:", error));
}