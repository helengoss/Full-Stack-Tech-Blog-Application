# Helen's Blog

## Description

A full-stack blogging platform with user authentication. Users can register and log in to create, edit, and delete their own blog posts. Posts can be assigned to categories and filtered by them. Built with Node.js, Express, Sequelize, and MySQL.

---

## Features

- **User registration and login** with JWT authentication
- **Create, edit, and delete** blog posts
- **Category tagging** — assign a category to a post when creating or editing it
- **Filter posts by category** — e.g. view only "Useful" posts
- **Protected routes** — post management requires a valid login session
- **Responsive, styled UI** served as a static frontend

---

## Installation

### Prerequisites

- Node.js
- MySQL

### Steps

1. **Clone the repository**

2. **Open MySQL and set up the database:**

```bash
mysql -u root -p
```

```sql
source db/schema.sql;
quit;
```

3. **Install dependencies:**

```bash
npm install
```

4. **Seed the database with sample posts and categories:**

```bash
npm run seed
```

> Re-running `npm run seed` at any time will wipe existing posts and re-insert the sample data fresh. Categories are preserved.

5. **Start the server:**

```bash
npm run dev
```

6. **Open the app in your browser:**

```
http://localhost:3001
```

---

## Usage

### Registering and logging in

- Fill in the **Register** form with a username, email, and password and click **Register**
- Log in using your username and password in the **Login** form

### Creating a post

- Enter a title and content
- Optionally select a category from the **Choose category** dropdown
- Click **Submit Post**

### Editing a post

- Click the **Edit** button on any post
- Update the title, content, or category
- Click **Save**

### Deleting a post

- Click the x button on any post

### Filtering by category

- Click **All Posts** to see every post
- Click **Useful** (or any category button) to filter posts by that category

### Logging out

- Click the **Logout** button in the top right corner

---

## Deployment (Render + Railway)

This app uses MySQL, which is not available on Render's free tier. The recommended setup is to host the database on Railway and the web service on Render.

### 1. Set up a MySQL database on Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project → Provision MySQL**
3. Once created, click the MySQL service → **Variables** tab
4. Copy the `MYSQL_URL` value

### 2. Run the schema on Railway

In the Railway dashboard, click **Connect** on your MySQL service to get a connection command. Run it in your terminal, then:

```sql
source db/schema.sql;
quit;
```

### 3. Deploy to Render

1. Go to [render.com](https://render.com) and create a **New Web Service**
2. Connect your GitHub repository
3. Set the following:
   - **Build command:** `npm install`
   - **Start command:** `node server.js`
4. Under **Environment Variables**, add:
   - `JAWSDB_URL` = the `MYSQL_URL` value copied from Railway

5. Click **Deploy**

Once deployed, add your live Render URL here: `https://your-app.onrender.com`

### GitHub Repository

Add your GitHub repo link here: `https://github.com/your-username/your-repo`

---

## Technologies Used

- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JWT (JSON Web Tokens)
- HTML / CSS / Vanilla JavaScript

---

## Licence

Unlicensed

## Author

Helen
