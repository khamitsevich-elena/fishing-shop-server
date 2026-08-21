import Product from '../models/Product.js';
import QuizResult from '../models/QuizResult.js';
import quizConfig from '../seed/quizConfig.js';

export function questions(_req, res) {
  res.json(quizConfig.questions);
}

// Place → recommended method tags (ordered by priority)
const PLACE_METHODS = {
  'озеро': ['спиннинг', 'фидер', 'поплавок'],
  'река': ['фидер', 'спиннинг'],
  'пруд': ['поплавок', 'фидер'],
  'берег': ['фидер', 'поплавок', 'спиннинг'],
  'лодка': ['спиннинг', 'джиг', 'твичинг'],
};

// Experience → kit size and preferences
const EXPERIENCE_CONFIG = {
  'новичок': { maxItems: 4, preferCheapest: true },
  'опытный': { maxItems: 5, preferCheapest: false },
};

// Method → what to look for in each kit slot
const KIT_SLOTS = {
  'спиннинг': {
    rod: { methodTags: 'спиннинг', nameIncludes: ['спиннинг'] },
    reel: { methodTags: 'спиннинг', nameIncludes: ['катушк'] },
    line: { methodTags: 'спиннинг', nameIncludes: ['шнур', 'плетён'] },
    bait: { methodTags: 'спиннинг', nameIncludes: ['воблер', 'блесн', 'силикон', 'виброхвост'] },
  },
  'фидер': {
    rod: { methodTags: 'фидер', nameIncludes: ['фидер'] },
    reel: { methodTags: 'фидер', nameIncludes: ['катушк'] },
    line: { methodTags: 'фидер', nameIncludes: ['шнур', 'леск', 'плетён'] },
    bait: { methodTags: 'фидер', nameIncludes: ['прикорм', 'бойл'] },
  },
  'поплавок': {
    rod: { methodTags: 'поплавок', nameIncludes: ['поплавочн', 'удочк'] },
    reel: { methodTags: 'поплавок', nameIncludes: ['катушк'] },
    line: { methodTags: 'поплавок', nameIncludes: ['леск', 'монофил'] },
    bait: { methodTags: 'поплавок', nameIncludes: ['прикорм'] },
  },
  'джиг': {
    rod: { methodTags: 'джиг', nameIncludes: ['спиннинг'] },
    reel: { methodTags: 'джиг', nameIncludes: ['катушк'] },
    line: { methodTags: 'джиг', nameIncludes: ['шнур', 'плетён'] },
    bait: { methodTags: 'джиг', nameIncludes: ['силикон', 'виброхвост'] },
  },
  'твичинг': {
    rod: { methodTags: 'твичинг', nameIncludes: ['спиннинг'] },
    reel: { methodTags: 'твичинг', nameIncludes: ['катушк'] },
    line: { methodTags: 'твичинг', nameIncludes: ['шнур', 'плетён'] },
    bait: { methodTags: 'твичинг', nameIncludes: ['воблер'] },
  },
};

export async function match(req, res, next) {
  try {
    const { fish, place, season, experience, budget } = req.body;
    const budgetNum = Number(budget) || 999999;
    const expConfig = EXPERIENCE_CONFIG[experience] || EXPERIENCE_CONFIG['новичок'];
    const methods = PLACE_METHODS[place] || ['спиннинг'];

    // Fetch all products matching fish + season + budget
    const filter = { price: { $lte: budgetNum } };
    if (fish) filter.fishTags = fish;
    if (season) filter.seasonTags = season;

    const fishProducts = await Product.find(filter).sort({ popularity: -1 }).lean();

    // Also fetch universal products (no fish/method restriction, e.g. boxes, boots)
    const universalFilter = {
      price: { $lte: budgetNum },
      fishTags: { $exists: true, $size: 0 },
    };
    if (season) universalFilter.seasonTags = season;
    const universal = await Product.find(universalFilter).sort({ popularity: -1 }).lean();

    // For items that match method but may not match fish (e.g. reels)
    const methodFilter = {
      price: { $lte: budgetNum },
      methodTags: { $in: methods },
    };
    if (season) methodFilter.seasonTags = season;
    const methodProducts = await Product.find(methodFilter).sort({ popularity: -1 }).lean();

    // Merge all, deduplicate
    const allMap = new Map();
    for (const p of [...fishProducts, ...methodProducts, ...universal]) {
      allMap.set(p._id.toString(), p);
    }
    const allProducts = [...allMap.values()];

    const kit = buildKit(allProducts, methods, fish, budgetNum, expConfig);
    const total = kit.reduce((s, p) => s + p.price, 0);

    res.json({ products: kit, total });
  } catch (err) { next(err); }
}

export async function save(req, res, next) {
  try {
    const { answers, productIds, total } = req.body;
    const result = await QuizResult.create({
      userId: req.user._id,
      answers,
      productIds,
      total,
    });
    res.status(201).json(result);
  } catch (err) { next(err); }
}

export async function results(req, res, next) {
  try {
    const list = await QuizResult.find({ userId: req.user._id })
      .populate('productIds', 'name slug price images brand')
      .sort({ createdAt: -1 })
      .lean();
    res.json(list);
  } catch (err) { next(err); }
}

export async function remove(req, res, next) {
  try {
    const result = await QuizResult.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
  } catch (err) { next(err); }
}

function buildKit(products, methods, fish, budget, expConfig) {
  const used = new Set();
  const kit = [];
  let spent = 0;

  function addProduct(p) {
    if (used.has(p._id.toString())) return false;
    if (spent + p.price > budget) return false;
    kit.push(p);
    used.add(p._id.toString());
    spent += p.price;
    return true;
  }

  function findForSlot(slotDef) {
    return products.filter((p) => {
      if (used.has(p._id.toString())) return false;
      // Must match method tag
      if (slotDef.methodTags && !p.methodTags?.includes(slotDef.methodTags)) return false;
      // Must match at least one name pattern
      if (slotDef.nameIncludes?.length > 0) {
        const nameLower = p.name.toLowerCase();
        return slotDef.nameIncludes.some((pattern) => nameLower.includes(pattern));
      }
      return true;
    });
  }

  // Sort: cheapest first for beginners, popular first for experienced
  const sortFn = expConfig.preferCheapest
    ? (a, b) => a.price - b.price
    : (a, b) => (b.popularity || 0) - (a.popularity || 0);

  // Try each method in order of priority until we find a matching slot config
  for (const method of methods) {
    const slots = KIT_SLOTS[method];
    if (!slots) continue;

    // 1. Rod
    const rods = findForSlot(slots.rod).sort(sortFn);
    if (rods.length > 0) addProduct(rods[0]);

    // 2. Reel (may not have fish tag, so allow broader match)
    const reels = findForSlot(slots.reel).sort(sortFn);
    if (reels.length > 0) addProduct(reels[0]);

    // 3. Line
    const lines = findForSlot(slots.line).sort(sortFn);
    if (lines.length > 0) addProduct(lines[0]);

    // 4. Bait/Lure
    const baits = findForSlot(slots.bait).sort(sortFn);
    if (baits.length > 0) addProduct(baits[0]);

    // If we got at least a rod, this method works — stop trying others
    if (kit.length > 0) break;
  }

  // 5. Add accessories (universal items) for experienced users
  if (expConfig.maxItems > 4 && kit.length < expConfig.maxItems) {
    const accessories = products
      .filter((p) => !used.has(p._id.toString()) && (!p.fishTags || p.fishTags.length === 0))
      .sort(sortFn);
    if (accessories.length > 0) addProduct(accessories[0]);
  }

  // 6. Fill remaining slots with best matching products
  const remaining = products
    .filter((p) => !used.has(p._id.toString()))
    .sort(sortFn);

  for (const p of remaining) {
    if (kit.length >= expConfig.maxItems) break;
    addProduct(p);
  }

  return kit;
}
