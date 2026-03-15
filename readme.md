Description
This REST API for a **blogging platform** allows users to:

- **Read** blog articles and filter them by categories.
- **Register** and log in to manage their content.
- **Create, update, and delete** their own blog posts.

Installation
Clone the repository

**Open MySQL in the terminal:**

```bash
mysql -u root -p
```

3. **Run the following command to set up the database:**

```bash
source db/schema.sql;
```

4. **Exit MySQL**

```bash
quit;
```

5. **Update the .env file and set DB_PASSWORD to your MySQL password.**
6. **Install dependencies**

```bash
npm install
```

7. **Seed the database with test data:**

```bash
npm run seed
```

8. **Run the application**

```bash
npm start
```

9. **Open the application in your browser:**

```browser
http://localhost:3001

Licence
Unlicensed

Author
Helen

Contact
Smile