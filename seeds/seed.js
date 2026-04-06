const sequelize = require("../config/connection");
const { Post, Category } = require("../models");
const postData = require("./posts.json");

const seedDatabase = async () => {
  await sequelize.sync({ alter: true });

  await Category.findOrCreate({ where: { category_name: "Useful" } });

  await Post.destroy({ where: {} });
  await Post.bulkCreate(postData);

  process.exit(0);
};

seedDatabase();
