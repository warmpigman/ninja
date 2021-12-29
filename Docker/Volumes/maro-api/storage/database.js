const mongoose = require('mongoose');
const config = require('../config');

const createDatabaseConnection = function () {
  try {
    mongoose.connect(config.dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Successaafully connected to database.' + process.pid);
  } catch (e) {
    console.log(e);
  }
};

createDatabaseConnection();
const bazaar = require('./schemas/bazaar');
const auctions = require('./schemas/auctions');
const allAuctions = require('./schemas/all-auctions');
const leaderboards = require('./schemas/leaderboard');
bazaar.ensureIndexes();
auctions.ensureIndexes();
allAuctions.ensureIndexes();
leaderboards.ensureIndexes();
module.exports = {
  bazaar: bazaar,
  auctions: auctions,
  allAuctions: allAuctions,
  leaderboard: leaderboards
};
