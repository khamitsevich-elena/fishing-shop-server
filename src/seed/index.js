import mongoose from 'mongoose';
import env from '../config/env.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import categoriesData from './categories.js';
import productsData from './products.js';

async function seed() {
  await mongoose.connect(env.mongoUri);
  console.log('Connected to MongoDB');

  await Category.deleteMany({});
  await Product.deleteMany({});

  const slugToId = {};

  for (const cat of categoriesData) {
    const parent = await Category.create({ name: cat.name, slug: cat.slug, icon: cat.icon });
    slugToId[cat.slug] = parent._id;

    for (const child of cat.children) {
      const sub = await Category.create({ name: child.name, slug: child.slug, parentId: parent._id });
      slugToId[child.slug] = sub._id;
    }
  }
  console.log(`Seeded ${Object.keys(slugToId).length} categories`);

  const productDocs = productsData.map((p) => ({
    ...p,
    categoryId: slugToId[p.categorySlug],
  }));
  await Product.insertMany(productDocs);
  console.log(`Seeded ${productDocs.length} products`);

  await mongoose.disconnect();
  console.log('Done');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
