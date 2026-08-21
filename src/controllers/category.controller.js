import Category from '../models/Category.js';
import Product from '../models/Product.js';

export async function getTree(_req, res, next) {
  try {
    const all = await Category.find().lean();
    const byParent = new Map();
    for (const cat of all) {
      const key = cat.parentId ? cat.parentId.toString() : 'root';
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key).push(cat);
    }

    const counts = await Product.aggregate([
      { $group: { _id: '$categoryId', count: { $sum: 1 } } },
    ]);

    const countByCategory = new Map();
    for (const { _id, count } of counts) {
      countByCategory.set(_id.toString(), count);
    }

    function getCount(cat) {
      const own = countByCategory.get(cat._id.toString()) || 0;
      const children = byParent.get(cat._id.toString()) || [];
      if (children.length === 0) return own;
      return children.reduce((sum, child) => sum + getCount(child), own);
    }

    const roots = byParent.get('root') || [];
    const tree = roots.map((r) => ({
      ...r,
      count: getCount(r),
      children: (byParent.get(r._id.toString()) || []).map((c) => ({
        ...c,
        count: countByCategory.get(c._id.toString()) || 0,
      })),
    }));
    res.json(tree);
  } catch (err) { next(err); }
}
