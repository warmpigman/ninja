const db = require('../storage/database');
const helper = require('../src/helper');
const router = require('express').Router();

let auctions = [];
let allAuctions = [];
const retrievePrices = async function () {
  for (const item of await db.auctions.find()) {
    const auction = { id: item.id, name: item.auction.name, lowestBin: item.auction.price, rawItem: item };
    const index = auctions.findIndex(i => i.id === item.id);

    if (index === -1) auctions.push(auction);
    else auctions[index] = auction;
  }
  for (const item of await db.allAuctions.find()) {
    const auction = { id: item.id, auctions: item.many, rawItem: item };
    const index = allAuctions.findIndex(i => i.id === item.id);

    if (index === -1) allAuctions.push(auction);
    else allAuctions[index] = auction;
  }
};
router.get('/find/:name', async (req, res) => {
  if (!req.params.name) return res.status(400).send({ success: false, message: 'Missing name' });
  const stringSimilarity = (a, b) => {
    const bg1 = bigrams(a);
    const bg2 = bigrams(b);
    const c1 = count(bg1);
    const c2 = count(bg2);
    const combined = uniq([...bg1, ...bg2]).reduce((t, k) => t + Math.min(c1[k] || 0, c2[k] || 0), 0);
    return (2 * combined) / (bg1.length + bg2.length);
  };
  const prep = (
    str // TODO: unicode support?
  ) =>
    str
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ');

  const bigrams = str => [...str].slice(0, -1).map((c, i) => c + str[i + 1]);

  const count = xs => xs.reduce((a, x) => ((a[x] = (a[x] || 0) + 1), a), {});

  const uniq = xs => [...new Set(xs)];
  const ahs = auctions
    .filter(item => stringSimilarity(item.name.toLowerCase(), req.params.name.toLowerCase()) > 0.5)
    .sort((a, b) => {
      var aLikeliness = stringSimilarity(a.name.toLowerCase(), req.params.name.toLowerCase());
      var bLikeliness = stringSimilarity(b.name.toLowerCase(), req.params.name.toLowerCase());
      if (a.name.toLowerCase().includes('lvl')) aLikeliness += 1;
      if (b.name.toLowerCase().includes('lvl')) bLikeliness += 1;
      ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'].some(c => {
        if (a.name.toLowerCase().includes(c)) {
          aLikeliness += 1;
        }
        return;
      });
      ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'].some(c => {
        if (b.name.toLowerCase().includes(c)) {
          bLikeliness += 1;
        }
        return;
      });
      return aLikeliness - bLikeliness;
    });
  if (ahs.length > 0) return res.status(200).send({ success: true, auctions: ahs });
  return res.status(404).send({ success: false, message: 'No auctions found' });
});
router.get('/every', async (req, res) => {
  if (allAuctions.length === 0) {
    return res.status(404).json({
      status: 404,
      data: 'No auctions found.'
    });
  }
  return res.status(200).json({
    status: 200,
    data: allAuctions
  });
});
router.get('/all', async (req, res) => {
  if (auctions.length === 0) {
    return res.status(404).json({
      status: 404,
      data: 'No auctions found.'
    });
  }

  return res.status(200).json({
    status: 200,
    data: auctions
  });
});

router.get('/lowestbin/:id', async (req, res) => {
  const id = req.params.id.toUpperCase();
  const item = await db.auctions.findOne({ id: id });

  if (!item) {
    return res.status(404).json({
      status: 404,
      cause: 'Item not found.'
    });
  }

  return res.status(200).json({
    status: 200,
    data: item.auction
  });
});

router.get('/quickStats/:id', async (req, res) => {
  const id = req.params.id.toUpperCase();
  const item = await db.auctions.findOne({ id: id });

  if (!item) {
    return res.status(404).json({
      status: 404,
      cause: 'Item not found.'
    });
  }

  const sales = item.sales.map(i => i.price);

  const stats = {
    average: helper.getAverage(sales),
    median: helper.getMedian(sales),
    min: Math.min(...sales),
    max: Math.max(...sales),
    mode: helper.getMode(sales),
    mean: helper.getMean(sales)
  };

  return res.status(200).json({
    status: 200,
    data: stats
  });
});

retrievePrices();
setInterval(() => retrievePrices(), 60 * 10000);

module.exports = router;
